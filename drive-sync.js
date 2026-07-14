const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const { Readable } = require("node:stream");
const { pipeline } = require("node:stream/promises");
const zlib = require("node:zlib");

const DEFAULT_DRIVE_FOLDER_ID = "1BafAOZrEUhHe2PwrG5n1KhEaS1pF6TOg";
const EMBEDDED_FOLDER_BASE = "https://drive.google.com/embeddedfolderview";
const DOWNLOAD_BASE = "https://drive.usercontent.google.com/download";
const DEFAULT_SYNC_INTERVAL_MS = 15 * 60 * 1000;
const ARCHIVE_EXTENSIONS = new Set([".zip"]);
const ZIP_EOCD_SIGNATURE = 0x06054b50;
const ZIP_CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const ZIP_LOCAL_FILE_SIGNATURE = 0x04034b50;
const ZIP_METHOD_STORE = 0;
const ZIP_METHOD_DEFLATE = 8;
const ZIP_UTF8_FLAG = 0x0800;
const ZIP_TAIL_SEARCH_BYTES = 65_557;

function createGoogleDriveSync({
  enabled,
  folderId,
  folderUrl,
  sourceDir,
  dataDir,
  mediaExtensions,
  intervalMs = DEFAULT_SYNC_INTERVAL_MS,
  afterSync,
  logger = console,
}) {
  const resolvedFolderId = extractDriveFolderId(folderId || folderUrl || "");
  const syncRoot = path.join(dataDir, "drive-sync");
  const downloadDir = path.join(syncRoot, "downloads");
  const manifestPath = path.join(syncRoot, "manifest.json");
  const supportedMediaExtensions = new Set([...mediaExtensions].map((extension) => extension.toLowerCase()));
  const isEnabled = Boolean(enabled && resolvedFolderId);
  let activeSync = null;
  let timer = null;

  const state = {
    enabled: isEnabled,
    folderId: resolvedFolderId,
    status: isEnabled ? "idle" : "disabled",
    intervalMs,
    lastRunAt: "",
    lastSuccessAt: "",
    lastError: "",
    lastMessage: isEnabled ? "Ready to sync Google Drive." : "Google Drive sync is disabled.",
    fileCount: 0,
    downloadedCount: 0,
    extractedCount: 0,
    skippedCount: 0,
    ignoredCount: 0,
    runningReason: "",
  };

  function getState() {
    return { ...state, running: state.status === "running" };
  }

  function start() {
    if (!isEnabled) {
      return;
    }

    queueSync({ reason: "startup" });

    if (Number.isFinite(intervalMs) && intervalMs > 0) {
      timer = setInterval(() => {
        queueSync({ reason: "interval" });
      }, intervalMs);
      timer.unref?.();
    }
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function queueSync(options = {}) {
    if (!isEnabled) {
      const error = new Error("Google Drive sync is not configured.");
      state.lastError = error.message;
      throw error;
    }

    if (activeSync) {
      return activeSync;
    }

    state.status = "running";
    state.runningReason = options.reason || "manual";
    state.lastRunAt = new Date().toISOString();
    state.lastError = "";
    state.lastMessage = `Sync started (${state.runningReason}).`;

    activeSync = runSync(options)
      .then((summary) => {
        state.status = "complete";
        state.lastSuccessAt = new Date().toISOString();
        state.lastMessage = `Synced ${summary.fileCount} Drive item(s).`;
        state.fileCount = summary.fileCount;
        state.downloadedCount = summary.downloadedCount;
        state.extractedCount = summary.extractedCount;
        state.skippedCount = summary.skippedCount;
        state.ignoredCount = summary.ignoredCount;
        state.runningReason = "";
        afterSync?.(summary);
        return getState();
      })
      .catch((error) => {
        state.status = "failed";
        state.lastError = error.message;
        state.lastMessage = "Google Drive sync failed.";
        state.runningReason = "";
        logger.warn("Google Drive sync failed:", error.message);
        throw error;
      })
      .finally(() => {
        activeSync = null;
      });

    activeSync.catch(() => {});
    return activeSync;
  }

  async function runSync({ force = false } = {}) {
    await fsp.mkdir(sourceDir, { recursive: true });
    await fsp.mkdir(downloadDir, { recursive: true });

    const previousManifest = await readManifest(manifestPath);
    const entries = await listDriveFolder(resolvedFolderId, { logger });
    const summary = {
      fileCount: entries.length,
      downloadedCount: 0,
      extractedCount: 0,
      skippedCount: 0,
      ignoredCount: 0,
    };
    const nextManifest = {
      folderId: resolvedFolderId,
      syncedAt: new Date().toISOString(),
      entries: {},
    };

    for (const entry of entries) {
      if (entry.kind === "folder") {
        summary.ignoredCount += 1;
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (ARCHIVE_EXTENSIONS.has(extension)) {
        const archivePath = path.join(downloadDir, `${entry.id}-${sanitizeFileName(entry.name)}`);
        const downloaded = await downloadIfNeeded(entry, archivePath, {
          force,
          previousManifest,
          logger,
        });
        summary.downloadedCount += downloaded ? 1 : 0;
        summary.skippedCount += downloaded ? 0 : 1;
        const extracted = await extractSupportedMediaFromZip(archivePath, sourceDir, {
          force,
          supportedMediaExtensions,
          logger,
        });
        summary.extractedCount += extracted.extractedCount;
        summary.skippedCount += extracted.skippedCount;
        nextManifest.entries[entry.id] = {
          ...entry,
          localPath: path.relative(sourceDir, archivePath),
          type: "archive",
        };
        continue;
      }

      if (supportedMediaExtensions.has(extension)) {
        const relativePath = entry.folderPath.length
          ? path.join(...entry.folderPath.map(sanitizeFileName), sanitizeFileName(entry.name))
          : sanitizeFileName(entry.name);
        const destinationPath = path.join(sourceDir, relativePath);
        const downloaded = await downloadIfNeeded(entry, destinationPath, {
          force,
          previousManifest,
          logger,
        });
        summary.downloadedCount += downloaded ? 1 : 0;
        summary.skippedCount += downloaded ? 0 : 1;
        nextManifest.entries[entry.id] = {
          ...entry,
          localPath: path.relative(sourceDir, destinationPath),
          type: "media",
        };
        continue;
      }

      summary.ignoredCount += 1;
    }

    await writeManifest(manifestPath, nextManifest);
    return summary;
  }

  return {
    get enabled() {
      return isEnabled;
    },
    getState,
    queueSync,
    start,
    stop,
  };
}

async function listDriveFolder(folderId, { logger, folderPath = [], seen = new Set() } = {}) {
  if (seen.has(folderId)) {
    return [];
  }
  seen.add(folderId);

  const url = `${EMBEDDED_FOLDER_BASE}?id=${encodeURIComponent(folderId)}#list`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to list Google Drive folder (${response.status}).`);
  }

  const html = await response.text();
  const entries = parseEmbeddedFolderEntries(html, folderPath);
  const results = [];

  for (const entry of entries) {
    if (entry.kind === "folder") {
      const childFolderId = extractDriveFolderId(entry.href);
      if (!childFolderId) {
        results.push(entry);
        continue;
      }

      try {
        const childEntries = await listDriveFolder(childFolderId, {
          logger,
          folderPath: [...folderPath, entry.name],
          seen,
        });
        results.push(...childEntries);
      } catch (error) {
        logger?.warn?.(`Unable to list nested Drive folder "${entry.name}": ${error.message}`);
        results.push(entry);
      }
      continue;
    }

    results.push(entry);
  }

  return results;
}

function parseEmbeddedFolderEntries(html, folderPath = []) {
  const entries = [];
  const entryPattern =
    /<div class="flip-entry" id="entry-([^"]+)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>/g;

  for (const match of html.matchAll(entryPattern)) {
    const id = decodeHtml(match[1]);
    const href = decodeHtml(match[2]);
    const name = decodeHtml(stripHtml(match[3])).trim();
    const folderId = extractDriveFolderId(href);

    if (!id || !name) {
      continue;
    }

    entries.push({
      id: folderId || id,
      fileId: id,
      name,
      href,
      folderPath,
      kind: folderId ? "folder" : "file",
    });
  }

  return entries;
}

async function downloadIfNeeded(entry, destinationPath, { force, previousManifest, logger }) {
  const previousEntry = previousManifest.entries?.[entry.id];
  const destinationExists = await fileExists(destinationPath);
  if (!force && destinationExists && (!previousEntry || previousEntry.name === entry.name)) {
    return false;
  }

  await fsp.mkdir(path.dirname(destinationPath), { recursive: true });
  const tempPath = `${destinationPath}.download`;
  await fsp.rm(tempPath, { force: true });

  const url = `${DOWNLOAD_BASE}?id=${encodeURIComponent(entry.fileId || entry.id)}&export=download&confirm=t`;
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Unable to download "${entry.name}" from Google Drive (${response.status}).`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    const preview = (await response.text()).slice(0, 240).replace(/\s+/g, " ");
    throw new Error(`Google Drive returned an HTML page instead of "${entry.name}": ${preview}`);
  }

  logger?.log?.(`Downloading ${entry.name}...`);
  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(tempPath));
  const stat = await fsp.stat(tempPath);
  if (stat.size <= 0) {
    await fsp.rm(tempPath, { force: true });
    throw new Error(`Downloaded file "${entry.name}" is empty.`);
  }

  await fsp.rename(tempPath, destinationPath);
  return true;
}

async function extractSupportedMediaFromZip(archivePath, sourceDir, {
  force,
  supportedMediaExtensions,
  logger,
}) {
  const entries = await listZipEntries(archivePath);
  const summary = { extractedCount: 0, skippedCount: 0 };

  for (const entry of entries) {
    const relativeParts = normalizeArchiveEntryParts(entry.name);
    if (!relativeParts.length) {
      continue;
    }

    const extension = path.extname(relativeParts.at(-1)).toLowerCase();
    if (!supportedMediaExtensions.has(extension)) {
      continue;
    }

    const destinationPath = path.join(sourceDir, ...relativeParts.map(sanitizeFileName));
    if (!force && (await fileExists(destinationPath))) {
      summary.skippedCount += 1;
      continue;
    }

    await fsp.mkdir(path.dirname(destinationPath), { recursive: true });
    logger?.log?.(`Extracting ${entry.name}...`);
    await extractZipEntry(archivePath, entry, destinationPath);
    summary.extractedCount += 1;
  }

  return summary;
}

async function listZipEntries(archivePath) {
  const file = await fsp.open(archivePath, "r");

  try {
    const stat = await file.stat();
    const tailLength = Math.min(stat.size, ZIP_TAIL_SEARCH_BYTES);
    const tail = Buffer.alloc(tailLength);
    await file.read(tail, 0, tailLength, stat.size - tailLength);

    const eocdOffsetInTail = findLastZipSignature(tail, ZIP_EOCD_SIGNATURE);
    if (eocdOffsetInTail < 0) {
      throw new Error("Unable to find zip end-of-central-directory record.");
    }

    const centralDirectorySize = tail.readUInt32LE(eocdOffsetInTail + 12);
    const centralDirectoryOffset = tail.readUInt32LE(eocdOffsetInTail + 16);
    if (centralDirectorySize === 0xffffffff || centralDirectoryOffset === 0xffffffff) {
      throw new Error("Zip64 archives are not supported by the local Drive sync yet.");
    }

    const centralDirectory = Buffer.alloc(centralDirectorySize);
    await file.read(centralDirectory, 0, centralDirectorySize, centralDirectoryOffset);
    return parseZipCentralDirectory(centralDirectory);
  } finally {
    await file.close();
  }
}

function parseZipCentralDirectory(centralDirectory) {
  const entries = [];
  let offset = 0;

  while (offset < centralDirectory.length) {
    if (centralDirectory.readUInt32LE(offset) !== ZIP_CENTRAL_DIRECTORY_SIGNATURE) {
      throw new Error("Zip central directory is malformed.");
    }

    const flags = centralDirectory.readUInt16LE(offset + 8);
    const method = centralDirectory.readUInt16LE(offset + 10);
    const crc32 = centralDirectory.readUInt32LE(offset + 16);
    const compressedSize = centralDirectory.readUInt32LE(offset + 20);
    const uncompressedSize = centralDirectory.readUInt32LE(offset + 24);
    const fileNameLength = centralDirectory.readUInt16LE(offset + 28);
    const extraLength = centralDirectory.readUInt16LE(offset + 30);
    const commentLength = centralDirectory.readUInt16LE(offset + 32);
    const localHeaderOffset = centralDirectory.readUInt32LE(offset + 42);
    const nameStart = offset + 46;
    const nameEnd = nameStart + fileNameLength;
    const fileNameBytes = centralDirectory.subarray(nameStart, nameEnd);
    const name = decodeZipFileName(fileNameBytes, flags);

    if (
      compressedSize === 0xffffffff ||
      uncompressedSize === 0xffffffff ||
      localHeaderOffset === 0xffffffff
    ) {
      throw new Error(`Zip64 entry "${name}" is not supported by the local Drive sync yet.`);
    }

    entries.push({
      index: entries.length + 1,
      name,
      flags,
      method,
      crc32,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
      isDirectory: name.endsWith("/"),
    });

    offset = nameEnd + extraLength + commentLength;
  }

  return entries;
}

async function extractZipEntry(archivePath, entry, destinationPath) {
  if (entry.isDirectory) {
    return;
  }

  if (![ZIP_METHOD_STORE, ZIP_METHOD_DEFLATE].includes(entry.method)) {
    throw new Error(`Unsupported zip compression method ${entry.method} for "${entry.name}".`);
  }

  const tempPath = `${destinationPath}.extract`;
  const dataStart = await getZipEntryDataStart(archivePath, entry);
  const compressedEnd = dataStart + entry.compressedSize - 1;
  const compressedStream = fs.createReadStream(archivePath, {
    start: dataStart,
    end: compressedEnd,
  });
  const outputStream = fs.createWriteStream(tempPath);
  const streams =
    entry.method === ZIP_METHOD_DEFLATE
      ? [compressedStream, zlib.createInflateRaw(), outputStream]
      : [compressedStream, outputStream];

  try {
    await pipeline(...streams);
    const stat = await fsp.stat(tempPath);
    if (stat.size <= 0) {
      throw new Error(`Extracted file "${entry.name}" is empty.`);
    }
    if (entry.uncompressedSize > 0 && stat.size !== entry.uncompressedSize) {
      throw new Error(
        `Extracted file "${entry.name}" has unexpected size ${stat.size}; expected ${entry.uncompressedSize}.`,
      );
    }
    await fsp.rename(tempPath, destinationPath);
  } catch (error) {
    await fsp.rm(tempPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function getZipEntryDataStart(archivePath, entry) {
  const file = await fsp.open(archivePath, "r");

  try {
    const localHeader = Buffer.alloc(30);
    await file.read(localHeader, 0, localHeader.length, entry.localHeaderOffset);
    if (localHeader.readUInt32LE(0) !== ZIP_LOCAL_FILE_SIGNATURE) {
      throw new Error(`Zip local header is malformed for "${entry.name}".`);
    }

    const fileNameLength = localHeader.readUInt16LE(26);
    const extraLength = localHeader.readUInt16LE(28);
    return entry.localHeaderOffset + localHeader.length + fileNameLength + extraLength;
  } finally {
    await file.close();
  }
}

function normalizeArchiveEntryParts(entryName) {
  const parts = String(entryName || "")
    .split(/[\\/]+/)
    .map((part) => part.trim())
    .filter((part) => part && part !== "." && part !== "..");

  if (!parts.length || entryName.endsWith("/") || entryName.endsWith("\\")) {
    return [];
  }

  if (parts[0] === "__MACOSX" || parts.at(-1) === ".DS_Store" || parts.at(-1).startsWith("._")) {
    return [];
  }

  const sourceIndex = parts.findIndex((part) => part.toLowerCase() === "source");
  if (sourceIndex >= 0 && sourceIndex < parts.length - 1) {
    return parts.slice(sourceIndex + 1);
  }

  if (parts.length > 1 && /78dlcplayer|source/i.test(parts[0])) {
    return parts.slice(1);
  }

  return parts;
}

function findLastZipSignature(buffer, signature) {
  for (let index = buffer.length - 4; index >= 0; index -= 1) {
    if (buffer.readUInt32LE(index) === signature) {
      return index;
    }
  }

  return -1;
}

function decodeZipFileName(bytes, flags) {
  const utf8 = bytes.toString("utf8");
  if ((flags & ZIP_UTF8_FLAG) || !utf8.includes("\uFFFD")) {
    return utf8.normalize("NFC");
  }

  return decodeCp437(bytes).normalize("NFC");
}

const CP437_HIGH_CHARS =
  "ÇüéâäàåçêëèïîìÄÅ" +
  "ÉæÆôöòûùÿÖÜ¢£¥₧ƒ" +
  "áíóúñÑªº¿⌐¬½¼¡«»" +
  "░▒▓│┤╡╢╖╕╣║╗╝╜╛┐" +
  "└┴┬├─┼╞╟╚╔╩╦╠═╬╧" +
  "╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀" +
  "αßΓπΣσµτΦΘΩδ∞φε∩" +
  "≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ";

function decodeCp437(bytes) {
  let result = "";
  for (const byte of bytes) {
    result += byte < 128 ? String.fromCharCode(byte) : CP437_HIGH_CHARS[byte - 128] || "?";
  }

  return result;
}

async function readManifest(manifestPath) {
  try {
    return JSON.parse(await fsp.readFile(manifestPath, "utf8"));
  } catch (_error) {
    return { entries: {} };
  }
}

async function writeManifest(manifestPath, manifest) {
  await fsp.mkdir(path.dirname(manifestPath), { recursive: true });
  await fsp.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

async function fileExists(filePath) {
  try {
    const stat = await fsp.stat(filePath);
    return stat.isFile() && stat.size > 0;
  } catch (_error) {
    return false;
  }
}

function extractDriveFolderId(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  const folderMatch = raw.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    return folderMatch[1];
  }

  const idParamMatch = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) {
    return idParamMatch[1];
  }

  return /^[a-zA-Z0-9_-]{12,}$/.test(raw) ? raw : "";
}

function sanitizeFileName(value) {
  const name = String(value || "")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return name || "untitled";
}

function decodeHtml(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]*>/g, "");
}

module.exports = {
  DEFAULT_DRIVE_FOLDER_ID,
  DEFAULT_SYNC_INTERVAL_MS,
  createGoogleDriveSync,
  decodeZipFileName,
  extractDriveFolderId,
  extractZipEntry,
  extractSupportedMediaFromZip,
  listZipEntries,
  parseEmbeddedFolderEntries,
};
