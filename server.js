const { createServer } = require("node:http");
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 4318;
const ROOT_DIR = __dirname;
const SOURCE_DIR = path.join(ROOT_DIR, "source");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.join(ROOT_DIR, "data");
const COVER_DIR = path.join(DATA_DIR, "covers");
const DB_PATH = path.join(DATA_DIR, "player.db");
const MAX_JSON_BYTES = 12 * 1024 * 1024;

const AUDIO_EXTENSIONS = new Set([
  ".aac",
  ".flac",
  ".m4a",
  ".mp3",
  ".ogg",
  ".wav",
  ".webm",
]);
const VIDEO_EXTENSIONS = new Set([".m4v", ".mov", ".mp4", ".webm"]);

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

ensureDirectory(SOURCE_DIR);
ensureDirectory(DATA_DIR);
ensureDirectory(COVER_DIR);

const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
initializeDatabase();
syncLibrary();
startSourceWatcher();

const server = createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (req.method === "GET" && (pathname === "/" || pathname === "/index.html")) {
      return serveStaticFile(res, path.join(PUBLIC_DIR, "index.html"));
    }

    if (req.method === "GET" && pathname === "/styles.css") {
      return serveStaticFile(res, path.join(PUBLIC_DIR, "styles.css"));
    }

    if (req.method === "GET" && pathname === "/app.js") {
      return serveStaticFile(res, path.join(PUBLIC_DIR, "app.js"));
    }

    if (req.method === "GET" && pathname.startsWith("/covers/")) {
      return serveCoverFile(res, pathname.replace("/covers/", ""));
    }

    if (req.method === "GET" && pathname === "/api/state") {
      syncLibrary();
      return sendJson(res, 200, buildState());
    }

    if (req.method === "POST" && pathname === "/api/library/refresh") {
      syncLibrary();
      return sendJson(res, 200, buildState());
    }

    const songMatch = pathname.match(/^\/api\/songs\/(\d+)$/);
    if (songMatch && req.method === "GET") {
      const song = getSongByIdOrThrow(songMatch[1]);
      return sendJson(res, 200, { song: formatSong(song) });
    }

    if (songMatch && req.method === "PATCH") {
      const songId = Number(songMatch[1]);
      const payload = await readJson(req);
      updateSong(songId, payload);
      return sendJson(res, 200, buildState());
    }

    const coverMatch = pathname.match(/^\/api\/songs\/(\d+)\/cover$/);
    if (coverMatch && req.method === "PUT") {
      const songId = Number(coverMatch[1]);
      const payload = await readJson(req);
      updateSongCover(songId, payload);
      return sendJson(res, 200, buildState());
    }

    if (coverMatch && req.method === "DELETE") {
      const songId = Number(coverMatch[1]);
      removeSongCover(songId);
      return sendJson(res, 200, buildState());
    }

    const playMatch = pathname.match(/^\/api\/songs\/(\d+)\/play$/);
    if (playMatch && req.method === "POST") {
      const songId = Number(playMatch[1]);
      recordPlay(songId);
      return sendJson(res, 200, buildState());
    }

    const mediaMatch = pathname.match(/^\/api\/media\/(\d+)$/);
    if (mediaMatch && req.method === "GET") {
      return streamSongMedia(req, res, Number(mediaMatch[1]));
    }

    if (req.method === "POST" && pathname === "/api/playlists") {
      const payload = await readJson(req);
      createPlaylist(payload);
      return sendJson(res, 200, buildState());
    }

    const playlistMatch = pathname.match(/^\/api\/playlists\/(\d+)$/);
    if (playlistMatch && req.method === "PATCH") {
      const payload = await readJson(req);
      renamePlaylist(Number(playlistMatch[1]), payload);
      return sendJson(res, 200, buildState());
    }

    if (playlistMatch && req.method === "DELETE") {
      deletePlaylist(Number(playlistMatch[1]));
      return sendJson(res, 200, buildState());
    }

    const playlistSongMatch = pathname.match(/^\/api\/playlists\/(\d+)\/songs$/);
    if (playlistSongMatch && req.method === "POST") {
      const payload = await readJson(req);
      addSongToPlaylist(Number(playlistSongMatch[1]), payload);
      return sendJson(res, 200, buildState());
    }

    const playlistSongDeleteMatch = pathname.match(/^\/api\/playlists\/(\d+)\/songs\/(\d+)$/);
    if (playlistSongDeleteMatch && req.method === "DELETE") {
      removeSongFromPlaylist(Number(playlistSongDeleteMatch[1]), Number(playlistSongDeleteMatch[2]));
      return sendJson(res, 200, buildState());
    }

    sendJson(res, 404, { error: "Not found." });
  } catch (error) {
    const status = error.status || 500;
    const message = status >= 500 ? "Something went wrong on the server." : error.message;

    if (status >= 500) {
      console.error(error);
    }

    sendJson(res, status, { error: message });
  }
});

server.listen(PORT, () => {
  console.log(`78DLC Player running at http://localhost:${PORT}`);
  console.log(`Source folder: ${SOURCE_DIR}`);
});

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      relative_path TEXT NOT NULL UNIQUE,
      file_name TEXT NOT NULL,
      file_stem TEXT NOT NULL,
      display_title TEXT NOT NULL,
      artist TEXT NOT NULL DEFAULT '',
      album TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      lyrics TEXT NOT NULL DEFAULT '',
      cover_path TEXT NOT NULL DEFAULT '',
      media_kind TEXT NOT NULL,
      file_size INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recent_plays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      song_id INTEGER NOT NULL,
      played_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS playlist_songs (
      playlist_id INTEGER NOT NULL,
      song_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (playlist_id, song_id)
    );
  `);
}

function syncLibrary() {
  const files = walkMediaFiles(SOURCE_DIR);
  const relativePaths = new Set(files.map((absolutePath) => normalizeRelativePath(absolutePath)));
  const existingSongs = queryAll(
    `
      SELECT
        id,
        relative_path,
        file_name,
        file_stem,
        display_title,
        cover_path,
        media_kind,
        file_size
      FROM songs
    `,
  );
  const existingByPath = new Map(existingSongs.map((song) => [song.relative_path, song]));

  db.exec("BEGIN;");

  try {
    for (const absolutePath of files) {
      const relativePath = normalizeRelativePath(absolutePath);
      const fileName = path.basename(absolutePath);
      const fileStem = path.parse(fileName).name;
      const mediaKind = getMediaKind(fileName);
      const fileSize = fs.statSync(absolutePath).size;
      const existingSong = existingByPath.get(relativePath);

      if (existingSong) {
        if (
          existingSong.file_name !== fileName ||
          existingSong.file_stem !== fileStem ||
          existingSong.media_kind !== mediaKind ||
          Number(existingSong.file_size) !== fileSize
        ) {
          run(
            `
              UPDATE songs
              SET
                file_name = ?,
                file_stem = ?,
                media_kind = ?,
                file_size = ?,
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `,
            [fileName, fileStem, mediaKind, fileSize, existingSong.id],
          );
        }
        continue;
      }

      run(
        `
          INSERT INTO songs (
            relative_path,
            file_name,
            file_stem,
            display_title,
            media_kind,
            file_size
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [relativePath, fileName, fileStem, fileStem, mediaKind, fileSize],
      );
    }

    for (const existingSong of existingSongs) {
      if (relativePaths.has(existingSong.relative_path)) {
        continue;
      }

      if (existingSong.cover_path) {
        deleteCoverFile(existingSong.cover_path);
      }

      run("DELETE FROM recent_plays WHERE song_id = ?", [existingSong.id]);
      run("DELETE FROM playlist_songs WHERE song_id = ?", [existingSong.id]);
      run("DELETE FROM songs WHERE id = ?", [existingSong.id]);
    }

    db.exec("COMMIT;");
  } catch (error) {
    db.exec("ROLLBACK;");
    throw error;
  }
}

function buildState() {
  const songs = queryAll(
    `
      SELECT
        songs.*,
        (
          SELECT MAX(played_at)
          FROM recent_plays
          WHERE song_id = songs.id
        ) AS last_played_at
      FROM songs
      ORDER BY lower(display_title), lower(file_name)
    `,
  ).map(formatSong);

  const recentSongIds = queryAll(
    `
      SELECT song_id, MAX(played_at) AS played_at
      FROM recent_plays
      GROUP BY song_id
      ORDER BY played_at DESC
      LIMIT 20
    `,
  ).map((row) => row.song_id);

  const playlistRows = queryAll(
    `
      SELECT
        playlists.id,
        playlists.name,
        COUNT(playlist_songs.song_id) AS song_count
      FROM playlists
      LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      GROUP BY playlists.id
      ORDER BY lower(playlists.name)
    `,
  );

  const playlistSongRows = queryAll(
    `
      SELECT playlist_id, song_id
      FROM playlist_songs
      ORDER BY sort_order, song_id
    `,
  );

  const songIdsByPlaylist = new Map();
  for (const row of playlistSongRows) {
    if (!songIdsByPlaylist.has(row.playlist_id)) {
      songIdsByPlaylist.set(row.playlist_id, []);
    }

    songIdsByPlaylist.get(row.playlist_id).push(row.song_id);
  }

  return {
    libraryPath: SOURCE_DIR,
    songs,
    recentSongIds,
    playlists: playlistRows.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      songCount: playlist.song_count,
      songIds: songIdsByPlaylist.get(playlist.id) || [],
    })),
  };
}

function updateSong(songId, payload) {
  let song = getSongByIdOrThrow(songId);

  if (Object.prototype.hasOwnProperty.call(payload, "fileStem")) {
    const nextStem = sanitizeFileStem(payload.fileStem);

    if (!nextStem) {
      throw new HttpError(400, "File name cannot be empty.");
    }

    if (nextStem !== song.file_stem) {
      renameSongFile(song, nextStem);
      song = getSongByIdOrThrow(songId);
    }
  }

  const displayTitle = pickDisplayTitle(payload, song);
  const artist = pickShortText(payload, "artist", song.artist);
  const album = pickShortText(payload, "album", song.album);
  const notes = pickLongText(payload, "notes", song.notes);
  const lyrics = pickLongText(payload, "lyrics", song.lyrics);

  run(
    `
      UPDATE songs
      SET
        display_title = ?,
        artist = ?,
        album = ?,
        notes = ?,
        lyrics = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [displayTitle, artist, album, notes, lyrics, songId],
  );
}

function updateSongCover(songId, payload) {
  const song = getSongByIdOrThrow(songId);
  const dataUrl = typeof payload.dataUrl === "string" ? payload.dataUrl : "";
  const fileName = typeof payload.fileName === "string" ? payload.fileName : "";
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);

  if (!match) {
    throw new HttpError(400, "Cover image payload is invalid.");
  }

  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) {
    throw new HttpError(400, "Cover image is empty or too large.");
  }

  const extension = inferImageExtension(fileName, match[1]);
  const storedFileName = `song-${songId}-${Date.now()}${extension}`;
  fs.writeFileSync(path.join(COVER_DIR, storedFileName), buffer);

  if (song.cover_path) {
    deleteCoverFile(song.cover_path);
  }

  run("UPDATE songs SET cover_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
    storedFileName,
    songId,
  ]);
}

function removeSongCover(songId) {
  const song = getSongByIdOrThrow(songId);
  if (song.cover_path) {
    deleteCoverFile(song.cover_path);
  }

  run("UPDATE songs SET cover_path = '', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [songId]);
}

function recordPlay(songId) {
  getSongByIdOrThrow(songId);

  run("INSERT INTO recent_plays (song_id) VALUES (?)", [songId]);
  run(
    `
      DELETE FROM recent_plays
      WHERE id NOT IN (
        SELECT id
        FROM recent_plays
        ORDER BY played_at DESC, id DESC
        LIMIT 300
      )
    `,
  );
}

function createPlaylist(payload) {
  const name = sanitizePlaylistName(payload.name);
  if (!name) {
    throw new HttpError(400, "Playlist name cannot be empty.");
  }

  try {
    run("INSERT INTO playlists (name) VALUES (?)", [name]);
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      throw new HttpError(409, "Playlist name already exists.");
    }

    throw error;
  }
}

function renamePlaylist(playlistId, payload) {
  getPlaylistByIdOrThrow(playlistId);
  const name = sanitizePlaylistName(payload.name);

  if (!name) {
    throw new HttpError(400, "Playlist name cannot be empty.");
  }

  try {
    run("UPDATE playlists SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
      name,
      playlistId,
    ]);
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      throw new HttpError(409, "Playlist name already exists.");
    }

    throw error;
  }
}

function deletePlaylist(playlistId) {
  getPlaylistByIdOrThrow(playlistId);
  db.exec("BEGIN;");

  try {
    run("DELETE FROM playlist_songs WHERE playlist_id = ?", [playlistId]);
    run("DELETE FROM playlists WHERE id = ?", [playlistId]);
    db.exec("COMMIT;");
  } catch (error) {
    db.exec("ROLLBACK;");
    throw error;
  }
}

function addSongToPlaylist(playlistId, payload) {
  getPlaylistByIdOrThrow(playlistId);
  const songId = Number(payload.songId);
  getSongByIdOrThrow(songId);

  const existing = queryGet(
    "SELECT 1 AS present FROM playlist_songs WHERE playlist_id = ? AND song_id = ?",
    [playlistId, songId],
  );

  if (existing) {
    return;
  }

  const currentMax = queryGet(
    "SELECT COALESCE(MAX(sort_order), 0) AS value FROM playlist_songs WHERE playlist_id = ?",
    [playlistId],
  );

  run(
    "INSERT INTO playlist_songs (playlist_id, song_id, sort_order) VALUES (?, ?, ?)",
    [playlistId, songId, currentMax.value + 1],
  );
}

function removeSongFromPlaylist(playlistId, songId) {
  getPlaylistByIdOrThrow(playlistId);
  getSongByIdOrThrow(songId);
  run("DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?", [playlistId, songId]);
}

function streamSongMedia(req, res, songId) {
  const song = getSongByIdOrThrow(songId);
  const absolutePath = resolveSongAbsolutePath(song.relative_path);

  if (!fs.existsSync(absolutePath)) {
    syncLibrary();
    throw new HttpError(404, "Media file is missing.");
  }

  const stat = fs.statSync(absolutePath);
  const mimeType = getMimeType(song.file_name);
  const range = req.headers.range;

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", mimeType);

  if (!range) {
    res.writeHead(200, { "Content-Length": stat.size });
    fs.createReadStream(absolutePath).pipe(res);
    return;
  }

  const [startValue, endValue] = range.replace("bytes=", "").split("-");
  const start = Number(startValue);
  const end = endValue ? Number(endValue) : stat.size - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= stat.size) {
    throw new HttpError(416, "Requested range is invalid.");
  }

  res.writeHead(206, {
    "Content-Length": end - start + 1,
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
  });

  fs.createReadStream(absolutePath, { start, end }).pipe(res);
}

function serveCoverFile(res, fileName) {
  const safeName = path.basename(fileName);
  const absolutePath = path.join(COVER_DIR, safeName);
  serveStaticFile(res, absolutePath);
}

function serveStaticFile(res, absolutePath) {
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    throw new HttpError(404, "File not found.");
  }

  const contentType = getStaticContentType(absolutePath);
  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(absolutePath).pipe(res);
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function queryAll(sql, params = []) {
  const statement = db.prepare(sql);
  return statement.all(...params);
}

function queryGet(sql, params = []) {
  const statement = db.prepare(sql);
  return statement.get(...params);
}

function run(sql, params = []) {
  const statement = db.prepare(sql);
  return statement.run(...params);
}

async function readJson(req) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > MAX_JSON_BYTES) {
      throw new HttpError(413, "Request body is too large.");
    }

    chunks.push(chunk);
  }

  if (!chunks.length) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (_error) {
    throw new HttpError(400, "Invalid JSON body.");
  }
}

function formatSong(row) {
  return {
    id: row.id,
    relativePath: row.relative_path,
    fileName: row.file_name,
    fileStem: row.file_stem,
    displayTitle: row.display_title,
    artist: row.artist,
    album: row.album,
    notes: row.notes,
    lyrics: row.lyrics,
    coverUrl: row.cover_path
      ? `/covers/${encodeURIComponent(path.basename(row.cover_path))}?v=${encodeURIComponent(row.updated_at)}`
      : "",
    mediaKind: row.media_kind,
    fileSize: row.file_size,
    mediaUrl: `/api/media/${row.id}`,
    lastPlayedAt: row.last_played_at || null,
  };
}

function getSongByIdOrThrow(songId) {
  const song = queryGet("SELECT * FROM songs WHERE id = ?", [Number(songId)]);
  if (!song) {
    throw new HttpError(404, "Song not found.");
  }

  return song;
}

function getPlaylistByIdOrThrow(playlistId) {
  const playlist = queryGet("SELECT * FROM playlists WHERE id = ?", [Number(playlistId)]);
  if (!playlist) {
    throw new HttpError(404, "Playlist not found.");
  }

  return playlist;
}

function renameSongFile(song, nextStem) {
  const extension = path.extname(song.file_name);
  const nextFileName = `${nextStem}${extension}`;
  const relativeDirectory = path.posix.dirname(song.relative_path);
  const nextRelativePath =
    relativeDirectory === "." ? nextFileName : `${relativeDirectory}/${nextFileName}`;
  const currentAbsolutePath = resolveSongAbsolutePath(song.relative_path);
  const nextAbsolutePath = resolveSongAbsolutePath(nextRelativePath);

  if (nextFileName === song.file_name) {
    return;
  }

  if (fs.existsSync(nextAbsolutePath)) {
    throw new HttpError(409, "A file with that name already exists in the source folder.");
  }

  fs.renameSync(currentAbsolutePath, nextAbsolutePath);

  const nextDisplayTitle = song.display_title === song.file_stem ? nextStem : song.display_title;
  run(
    `
      UPDATE songs
      SET
        relative_path = ?,
        file_name = ?,
        file_stem = ?,
        display_title = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [nextRelativePath, nextFileName, nextStem, nextDisplayTitle, song.id],
  );
}

function walkMediaFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      results.push(...walkMediaFiles(absolutePath));
      continue;
    }

    if (entry.isFile() && isSupportedMedia(entry.name)) {
      results.push(absolutePath);
    }
  }

  return results;
}

function startSourceWatcher() {
  let syncTimer = null;

  try {
    fs.watch(SOURCE_DIR, { recursive: true }, () => {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        try {
          syncLibrary();
        } catch (error) {
          console.error("Auto-sync failed:", error);
        }
      }, 250);
    });
  } catch (error) {
    console.warn("Source watcher is unavailable:", error.message);
  }
}

function pickDisplayTitle(payload, song) {
  if (!Object.prototype.hasOwnProperty.call(payload, "displayTitle")) {
    return song.display_title;
  }

  const normalized = String(payload.displayTitle || "").trim();
  return normalized || song.file_stem;
}

function pickShortText(payload, key, currentValue) {
  if (!Object.prototype.hasOwnProperty.call(payload, key)) {
    return currentValue;
  }

  return String(payload[key] || "").trim();
}

function pickLongText(payload, key, currentValue) {
  if (!Object.prototype.hasOwnProperty.call(payload, key)) {
    return currentValue;
  }

  return String(payload[key] || "").replace(/\r\n/g, "\n").trim();
}

function sanitizePlaylistName(value) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeFileStem(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferImageExtension(fileName, mimeType) {
  const fromName = path.extname(fileName || "").toLowerCase();
  if ([".gif", ".jpg", ".jpeg", ".png", ".webp"].includes(fromName)) {
    return fromName === ".jpeg" ? ".jpg" : fromName;
  }

  if (mimeType === "image/gif") {
    return ".gif";
  }

  if (mimeType === "image/webp") {
    return ".webp";
  }

  if (mimeType === "image/png") {
    return ".png";
  }

  return ".jpg";
}

function deleteCoverFile(fileName) {
  const absolutePath = path.join(COVER_DIR, path.basename(fileName));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

function resolveSongAbsolutePath(relativePath) {
  return path.join(SOURCE_DIR, relativePath.split("/").join(path.sep));
}

function normalizeRelativePath(absolutePath) {
  return path.relative(SOURCE_DIR, absolutePath).split(path.sep).join("/");
}

function getStaticContentType(absolutePath) {
  const extension = path.extname(absolutePath).toLowerCase();

  switch (extension) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

function isSupportedMedia(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  return AUDIO_EXTENSIONS.has(extension) || VIDEO_EXTENSIONS.has(extension);
}

function getMediaKind(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  return VIDEO_EXTENSIONS.has(extension) ? "video" : "audio";
}

function getMimeType(fileName) {
  const extension = path.extname(fileName).toLowerCase();

  switch (extension) {
    case ".aac":
      return "audio/aac";
    case ".flac":
      return "audio/flac";
    case ".m4a":
      return "audio/mp4";
    case ".m4v":
      return "video/x-m4v";
    case ".mov":
      return "video/quicktime";
    case ".mp3":
      return "audio/mpeg";
    case ".mp4":
      return "video/mp4";
    case ".ogg":
      return "audio/ogg";
    case ".wav":
      return "audio/wav";
    case ".webm":
      return "video/webm";
    default:
      return "application/octet-stream";
  }
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}
