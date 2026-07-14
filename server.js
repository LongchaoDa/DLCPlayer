const { createServer: createHttpServer } = require("node:http");
const { createServer: createHttpsServer } = require("node:https");
const { execFile, execFileSync } = require("node:child_process");
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");
const { fetchSongMetadata, storeRemoteCover } = require("./metadata-enrichment");
const {
  DEFAULT_DRIVE_FOLDER_ID,
  createGoogleDriveSync,
} = require("./drive-sync");

const parsedPort = Number(process.env.PORT);
const PORT = Number.isInteger(parsedPort) && parsedPort >= 0 ? parsedPort : 4318;
const HOST = process.env.HOST || "127.0.0.1";
const ROOT_DIR = __dirname;
const SOURCE_DIR = path.resolve(process.env.PLAYER_SOURCE_DIR || path.join(ROOT_DIR, "source"));
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.resolve(process.env.PLAYER_DATA_DIR || path.join(ROOT_DIR, "data"));
const COVER_DIR = path.join(DATA_DIR, "covers");
const CERT_DIR = path.join(DATA_DIR, "certs");
const KTV_DIR = path.join(DATA_DIR, "ktv");
const KTV_STEMS_DIR = path.join(KTV_DIR, "stems");
const KTV_RECORDINGS_DIR = path.join(KTV_DIR, "recordings");
const DB_PATH = path.join(DATA_DIR, "player.db");
const PLAYLIST_SEED_PATH = path.join(DATA_DIR, "playlists.seed.json");
const MAX_JSON_BYTES = 12 * 1024 * 1024;
const MAX_KTV_RECORDING_BYTES = 160 * 1024 * 1024;
const KTV_TOOL_TIMEOUT_MS = Number(process.env.KTV_TOOL_TIMEOUT_MS) || 20 * 60 * 1000;
const WATCH_SOURCE = process.env.PLAYER_DISABLE_WATCHER !== "1";
const HTTPS_ENABLED = process.env.PLAYER_HTTPS === "1";
const HTTPS_KEY_PATH = path.resolve(
  process.env.PLAYER_HTTPS_KEY || path.join(CERT_DIR, "78dlc-local-key.pem"),
);
const HTTPS_CERT_PATH = path.resolve(
  process.env.PLAYER_HTTPS_CERT || path.join(CERT_DIR, "78dlc-local-cert.pem"),
);
const DRIVE_SYNC_INTERVAL_MS = Number(process.env.PLAYER_DRIVE_SYNC_INTERVAL_MS) || 15 * 60 * 1000;
const DRIVE_SYNC_ENABLED =
  process.env.PLAYER_DRIVE_SYNC === "1" ||
  Boolean(process.env.PLAYER_DRIVE_FOLDER_ID || process.env.PLAYER_DRIVE_FOLDER_URL);
const execFileAsync = promisify(execFile);
const ktvPreparationTasks = new Map();

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
const MEDIA_EXTENSIONS = new Set([...AUDIO_EXTENSIONS, ...VIDEO_EXTENSIONS]);

const driveSync = createGoogleDriveSync({
  enabled: DRIVE_SYNC_ENABLED,
  folderId: process.env.PLAYER_DRIVE_FOLDER_ID || (DRIVE_SYNC_ENABLED ? DEFAULT_DRIVE_FOLDER_ID : ""),
  folderUrl: process.env.PLAYER_DRIVE_FOLDER_URL || "",
  sourceDir: SOURCE_DIR,
  dataDir: DATA_DIR,
  mediaExtensions: MEDIA_EXTENSIONS,
  intervalMs: DRIVE_SYNC_INTERVAL_MS,
  afterSync: () => {
    try {
      syncLibrary();
    } catch (error) {
      console.error("Library scan after Drive sync failed:", error);
    }
  },
});

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

ensureDirectory(SOURCE_DIR);
ensureDirectory(DATA_DIR);
ensureDirectory(COVER_DIR);
ensureDirectory(CERT_DIR);
ensureDirectory(KTV_DIR);
ensureDirectory(KTV_STEMS_DIR);
ensureDirectory(KTV_RECORDINGS_DIR);

const db = new DatabaseSync(DB_PATH);
configureDatabase(db);
initializeDatabase();
syncLibrary();
seedPlaylistsIfNeeded();
if (WATCH_SOURCE) {
  startSourceWatcher();
}
driveSync.start();

const requestHandler = async (req, res) => {
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

    if (req.method === "GET" && pathname === "/manifest.webmanifest") {
      return serveStaticFile(res, path.join(PUBLIC_DIR, "manifest.webmanifest"));
    }

    if (req.method === "GET" && pathname === "/service-worker.js") {
      return serveStaticFile(res, path.join(PUBLIC_DIR, "service-worker.js"));
    }

    if (req.method === "GET" && pathname.startsWith("/assets/")) {
      return servePublicAsset(res, pathname.replace("/assets/", ""));
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

    if (req.method === "POST" && pathname === "/api/drive/sync") {
      if (!driveSync.enabled) {
        throw new HttpError(400, "Google Drive sync is not configured.");
      }

      driveSync.queueSync({
        force: requestUrl.searchParams.get("force") === "1",
        reason: "manual",
      });
      return sendJson(res, 202, { driveSync: driveSync.getState() });
    }

    if (req.method === "POST" && pathname === "/api/source-folder/open") {
      await openSourceFolder();
      return sendJson(res, 200, { ok: true, path: SOURCE_DIR });
    }

    const songMatch = pathname.match(/^\/api\/songs\/(\d+)$/);
    if (songMatch && req.method === "GET") {
      const song = getSongByIdOrThrow(songMatch[1]);
      return sendJson(res, 200, { song: formatSong(song, { playlists: getSongPlaylists(song.id) }) });
    }

    if (songMatch && req.method === "PATCH") {
      const songId = Number(songMatch[1]);
      const payload = await readJson(req);
      updateSong(songId, payload);
      return sendJson(res, 200, buildState());
    }

    const enrichMatch = pathname.match(/^\/api\/songs\/(\d+)\/enrich$/);
    const enrichPreviewMatch = pathname.match(/^\/api\/songs\/(\d+)\/enrich\/preview$/);
    if (enrichPreviewMatch && req.method === "POST") {
      const enrichment = await previewSongMetadata(Number(enrichPreviewMatch[1]));
      return sendJson(res, 200, { state: buildState(), enrichment });
    }

    if (enrichMatch && req.method === "POST") {
      const payload = await readJson(req);
      const enrichment = await enrichSongMetadata(Number(enrichMatch[1]), payload.enrichment);
      return sendJson(res, 200, { state: buildState(), enrichment });
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

    const ktvPrepareMatch = pathname.match(/^\/api\/ktv\/songs\/(\d+)\/prepare$/);
    if (ktvPrepareMatch && req.method === "POST") {
      const payload = await readJson(req);
      startKtvPreparation(Number(ktvPrepareMatch[1]), normalizeKtvPrepareOptions(payload));
      return sendJson(res, 202, buildState());
    }

    const ktvAssetMatch = pathname.match(
      /^\/api\/ktv\/songs\/(\d+)\/assets\/(vocals|accompaniment|background)$/,
    );
    if (ktvAssetMatch && req.method === "GET") {
      return streamKtvAsset(req, res, Number(ktvAssetMatch[1]), ktvAssetMatch[2]);
    }

    const ktvPitchGuideMatch = pathname.match(/^\/api\/ktv\/songs\/(\d+)\/pitch-guide$/);
    if (ktvPitchGuideMatch && req.method === "GET") {
      return sendKtvPitchGuide(res, Number(ktvPitchGuideMatch[1]));
    }

    const ktvAlignmentMatch = pathname.match(/^\/api\/ktv\/songs\/(\d+)\/alignment$/);
    if (ktvAlignmentMatch && req.method === "GET") {
      return sendKtvAlignment(res, Number(ktvAlignmentMatch[1]));
    }

    if (req.method === "POST" && pathname === "/api/ktv/sessions") {
      const payload = await readJson(req);
      const session = createKtvSession(payload);
      return sendJson(res, 200, { state: buildState(), session });
    }

    const ktvSessionRecordingMatch = pathname.match(/^\/api\/ktv\/sessions\/(\d+)\/recording$/);
    if (ktvSessionRecordingMatch && req.method === "POST") {
      const body = await readBinary(req, MAX_KTV_RECORDING_BYTES);
      const session = await saveKtvRecordingAndScore(
        Number(ktvSessionRecordingMatch[1]),
        body,
        req.headers["content-type"],
        requestUrl.searchParams.get("name"),
      );
      return sendJson(res, 200, { state: buildState(), session });
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
};

const server = HTTPS_ENABLED
  ? createHttpsServer(resolveHttpsOptions(), requestHandler)
  : createHttpServer(requestHandler);

server.listen(PORT, HOST, () => {
  const address = server.address();
  const listenPort = typeof address === "object" && address ? address.port : PORT;
  const protocol = HTTPS_ENABLED ? "https" : "http";
  console.log(`78DLC Player running at ${protocol}://${HOST}:${listenPort}`);
  for (const lanUrl of getLanUrls(listenPort)) {
    console.log(`Phone URL: ${lanUrl}`);
  }
  console.log(`Source folder: ${SOURCE_DIR}`);
  if (HTTPS_ENABLED) {
    console.log(`HTTPS certificate: ${HTTPS_CERT_PATH}`);
  }
  if (driveSync.enabled) {
    console.log(`Google Drive sync: enabled for folder ${driveSync.getState().folderId}`);
  }
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

    CREATE TABLE IF NOT EXISTS ktv_assets (
      song_id INTEGER PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'idle',
      vocals_path TEXT NOT NULL DEFAULT '',
      accompaniment_path TEXT NOT NULL DEFAULT '',
      background_path TEXT NOT NULL DEFAULT '',
      alignment_path TEXT NOT NULL DEFAULT '',
      reference_pitch_path TEXT NOT NULL DEFAULT '',
      model_report TEXT NOT NULL DEFAULT '{}',
      error_message TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ktv_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      song_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'created',
      recording_path TEXT NOT NULL DEFAULT '',
      recording_name TEXT NOT NULL DEFAULT '',
      score_json TEXT NOT NULL DEFAULT '{}',
      overall_score REAL,
      error_message TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  ensureColumn("ktv_sessions", "recording_name", "TEXT NOT NULL DEFAULT ''");
  ensureColumn("ktv_assets", "reference_pitch_path", "TEXT NOT NULL DEFAULT ''");
}

function configureDatabase(database) {
  database.exec("PRAGMA busy_timeout = 5000;");

  try {
    database.exec("PRAGMA journal_mode = WAL;");
  } catch (error) {
    console.warn(
      `SQLite WAL mode unavailable for ${DB_PATH}; falling back to DELETE journal mode.`,
      error.message,
    );

    database.exec("PRAGMA journal_mode = DELETE;");
  }
}

async function openSourceFolder() {
  const command =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";

  try {
    await execFileAsync(command, [SOURCE_DIR]);
  } catch (error) {
    throw new HttpError(500, `Unable to open the source folder.`);
  }
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
      run("DELETE FROM ktv_assets WHERE song_id = ?", [existingSong.id]);
      run("DELETE FROM ktv_sessions WHERE song_id = ?", [existingSong.id]);
      run("DELETE FROM songs WHERE id = ?", [existingSong.id]);
    }

    db.exec("COMMIT;");
  } catch (error) {
    db.exec("ROLLBACK;");
    throw error;
  }
}

function seedPlaylistsIfNeeded() {
  if (!fs.existsSync(PLAYLIST_SEED_PATH)) {
    return;
  }

  const playlistCount = queryGet("SELECT COUNT(*) AS value FROM playlists").value;
  if (Number(playlistCount) > 0) {
    return;
  }

  let playlists;
  try {
    playlists = JSON.parse(fs.readFileSync(PLAYLIST_SEED_PATH, "utf8"));
  } catch (error) {
    console.warn(`Unable to read playlist seed file at ${PLAYLIST_SEED_PATH}:`, error.message);
    return;
  }

  if (!Array.isArray(playlists) || !playlists.length) {
    return;
  }

  const songsByFileName = new Map(
    queryAll("SELECT id, file_name FROM songs").map((song) => [song.file_name, song]),
  );

  db.exec("BEGIN;");

  try {
    for (const playlist of playlists) {
      const name = sanitizePlaylistName(playlist?.name);
      if (!name) {
        continue;
      }

      run("INSERT OR IGNORE INTO playlists (name) VALUES (?)", [name]);
      const savedPlaylist = queryGet("SELECT id FROM playlists WHERE name = ?", [name]);
      if (!savedPlaylist) {
        continue;
      }

      const seededSongs = Array.isArray(playlist.songs) ? playlist.songs : [];
      for (const [index, fileName] of seededSongs.entries()) {
        const song = songsByFileName.get(String(fileName));
        if (!song) {
          continue;
        }

        run(
          "INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id, sort_order) VALUES (?, ?, ?)",
          [savedPlaylist.id, song.id, index + 1],
        );
      }
    }

    db.exec("COMMIT;");
  } catch (error) {
    db.exec("ROLLBACK;");
    console.warn("Unable to seed playlists:", error.message);
  }
}

function buildState() {
  const songRows = queryAll(
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
  );

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
      SELECT
        playlist_songs.playlist_id,
        playlist_songs.song_id,
        playlists.name AS playlist_name
      FROM playlist_songs
      INNER JOIN playlists ON playlists.id = playlist_songs.playlist_id
      ORDER BY sort_order, song_id
    `,
  );

  const songIdsByPlaylist = new Map();
  const playlistsBySongId = new Map();
  for (const row of playlistSongRows) {
    if (!songIdsByPlaylist.has(row.playlist_id)) {
      songIdsByPlaylist.set(row.playlist_id, []);
    }

    songIdsByPlaylist.get(row.playlist_id).push(row.song_id);

    if (!playlistsBySongId.has(row.song_id)) {
      playlistsBySongId.set(row.song_id, []);
    }

    playlistsBySongId.get(row.song_id).push({
      id: row.playlist_id,
      name: row.playlist_name,
    });
  }

  for (const memberships of playlistsBySongId.values()) {
    memberships.sort((left, right) => left.name.localeCompare(right.name) || left.id - right.id);
  }

  const songs = songRows.map((song) =>
    formatSong(song, { playlists: playlistsBySongId.get(song.id) || [] }),
  );

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
    driveSync: driveSync.getState(),
    ktv: buildKtvState(),
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

async function previewSongMetadata(songId) {
  const song = getSongByIdOrThrow(songId);
  const enrichment = await fetchSongMetadata(song);
  return sanitizeEnrichmentForClient(enrichment);
}

async function enrichSongMetadata(songId, proposedEnrichment = null) {
  const song = getSongByIdOrThrow(songId);
  const enrichment = proposedEnrichment
    ? normalizeProposedEnrichment(song, proposedEnrichment)
    : await fetchSongMetadata(song, { coverDir: COVER_DIR, downloadCover: true });

  if (!enrichment.updated) {
    return {
      updated: false,
      fields: [],
      sources: enrichment.sources,
    };
  }

  if (enrichment.coverSourceUrl && !song.cover_path && !enrichment.values.coverPath) {
    enrichment.values.coverPath = await storeRemoteCover(song.id, enrichment.coverSourceUrl, COVER_DIR);
  }

  run(
    `
      UPDATE songs
      SET
        display_title = ?,
        artist = ?,
        album = ?,
        notes = ?,
        lyrics = ?,
        cover_path = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [
      enrichment.values.displayTitle,
      enrichment.values.artist,
      enrichment.values.album,
      enrichment.values.notes,
      enrichment.values.lyrics,
      enrichment.values.coverPath,
      song.id,
    ],
  );

  return {
    updated: true,
    fields: enrichment.fields,
    sources: enrichment.sources,
  };
}

function sanitizeEnrichmentForClient(enrichment) {
  return {
    updated: enrichment.updated,
    fields: enrichment.fields || [],
    sources: enrichment.sources || [],
    coverSourceUrl: enrichment.coverSourceUrl || "",
    values: sanitizeEnrichmentValues(enrichment.values || {}),
  };
}

function normalizeProposedEnrichment(song, proposedEnrichment) {
  const values = sanitizeEnrichmentValues(proposedEnrichment?.values || {});
  return {
    updated: Boolean(proposedEnrichment?.updated),
    fields: Array.isArray(proposedEnrichment?.fields)
      ? proposedEnrichment.fields.map((field) => String(field || "").trim()).filter(Boolean)
      : [],
    sources: Array.isArray(proposedEnrichment?.sources)
      ? proposedEnrichment.sources.map((source) => String(source || "").trim()).filter(Boolean)
      : [],
    coverSourceUrl: String(proposedEnrichment?.coverSourceUrl || "").trim(),
    values: {
      displayTitle: values.displayTitle || song.display_title,
      artist: values.artist,
      album: values.album,
      notes: values.notes,
      lyrics: values.lyrics,
      coverPath: values.coverPath || song.cover_path,
    },
  };
}

function sanitizeEnrichmentValues(values) {
  return {
    displayTitle: String(values.displayTitle || "").trim(),
    artist: String(values.artist || "").trim(),
    album: String(values.album || "").trim(),
    notes: String(values.notes || "").replace(/\r\n/g, "\n").trim(),
    lyrics: String(values.lyrics || "").replace(/\r\n/g, "\n").trim(),
    coverPath: String(values.coverPath || "").trim(),
  };
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

function buildKtvState() {
  const assetRows = queryAll("SELECT * FROM ktv_assets ORDER BY updated_at DESC");
  const sessionRows = queryAll(
    `
      SELECT *
      FROM ktv_sessions
      ORDER BY created_at DESC, id DESC
      LIMIT 60
    `,
  );

  const assetsBySongId = {};
  for (const row of assetRows) {
    assetsBySongId[row.song_id] = formatKtvAsset(row);
  }

  const latestSessionsBySongId = {};
  const sessions = sessionRows.map(formatKtvSession);
  for (const session of sessions) {
    if (!latestSessionsBySongId[session.songId]) {
      latestSessionsBySongId[session.songId] = session;
    }
  }

  return {
    assetsBySongId,
    latestSessionsBySongId,
    sessions,
    config: {
      separator: resolveKtvSeparatorCommand() ? getKtvPretrainedSeparatorLabel() : "ffmpeg-guide",
      alignment: resolveKtvAlignmentCommand() ? getKtvPretrainedAlignmentLabel() : "lyrics-timing",
      automaticLyricExtraction: canAutoExtractKtvLyrics(),
      scoring: process.env.KTV_SCORING_COMMAND ? "external" : "ffmpeg-heuristic",
      pitch: resolveKtvPitchCommand() ? getKtvPretrainedPitchLabel() : "audio-autocorrelation",
    },
  };
}

function resolveKtvSeparatorCommand() {
  if (process.env.KTV_SEPARATOR_COMMAND) {
    return process.env.KTV_SEPARATOR_COMMAND;
  }

  if (!isPretrainedKtvEnabled()) {
    return "";
  }

  const scriptPath = path.join(ROOT_DIR, "scripts", "separate_with_mlx_roformer.py");
  const pythonPath = resolveKtvPythonPath();
  if (!fs.existsSync(scriptPath) || !fs.existsSync(pythonPath)) {
    return "";
  }

  return `${shellQuote(pythonPath)} ${shellQuote(scriptPath)}`;
}

function resolveKtvPitchCommand() {
  if (process.env.KTV_PITCH_COMMAND) {
    return process.env.KTV_PITCH_COMMAND;
  }

  if (!isPretrainedKtvEnabled()) {
    return "";
  }

  const scriptPath = path.join(ROOT_DIR, "scripts", "extract_pitch_with_mlx_rmvpe.py");
  const pythonPath = resolveKtvPythonPath();
  if (!fs.existsSync(scriptPath) || !fs.existsSync(pythonPath)) {
    return "";
  }

  return `${shellQuote(pythonPath)} ${shellQuote(scriptPath)}`;
}

function resolveKtvAlignmentCommand() {
  if (process.env.KTV_ALIGNMENT_COMMAND) {
    return process.env.KTV_ALIGNMENT_COMMAND;
  }

  if (!isPretrainedKtvEnabled()) {
    return "";
  }

  const scriptPath = path.join(ROOT_DIR, "scripts", "align_lyrics_with_mlx_whisper.py");
  const pythonPath = resolveKtvPythonPath();
  if (!fs.existsSync(scriptPath) || !fs.existsSync(pythonPath)) {
    return "";
  }

  return `${shellQuote(pythonPath)} ${shellQuote(scriptPath)}`;
}

function canAutoExtractKtvLyrics() {
  return Boolean(resolveKtvAlignmentCommand());
}

function isPretrainedKtvEnabled() {
  return ["1", "true", "yes", "on"].includes(String(process.env.KTV_USE_PRETRAINED || "").toLowerCase());
}

function resolveKtvPythonPath() {
  return path.resolve(ROOT_DIR, process.env.KTV_PYTHON || path.join(".venv-ktv", "bin", "python"));
}

function getKtvPretrainedSeparatorLabel() {
  return process.env.KTV_SEPARATOR_MODEL || "mlx Mel-RoFormer vocal separation";
}

function getKtvPretrainedPitchLabel() {
  return process.env.KTV_PITCH_MODEL || "MLX-RMVPE vocal F0 extraction";
}

function getKtvPretrainedAlignmentLabel() {
  return process.env.KTV_ALIGNMENT_MODEL || `MLX Whisper vocal ASR lyric matching (${process.env.KTV_ASR_MODEL_ID || "large-v3-turbo"})`;
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function normalizeKtvPrepareOptions(payload = {}) {
  const requestedMode = String(payload.lyricMode || payload.lyricsMode || "").trim().toLowerCase();
  const lyricMode = ["default", "extract", "auto"].includes(requestedMode)
    ? requestedMode
    : payload.forceLyricExtraction
      ? "extract"
      : "auto";
  return { lyricMode };
}

function resolveKtvLyricMode(song, options = {}) {
  if (options.lyricMode === "extract") {
    return "extract";
  }

  if (options.lyricMode === "default") {
    return "default";
  }

  if (analyzeLyricsReadiness(song).ready) {
    return "default";
  }

  return canAutoExtractKtvLyrics() ? "extract" : "default";
}

function startKtvPreparation(songId, options = {}) {
  const song = getSongByIdOrThrow(songId);
  const lyricMode = resolveKtvLyricMode(song, options);
  assertKtvCanPrepare(song, { lyricMode });

  if (ktvPreparationTasks.has(song.id)) {
    return;
  }

  upsertKtvAsset(song.id, {
    status: "running",
    vocalsPath: "",
    accompanimentPath: "",
    backgroundPath: "",
    alignmentPath: "",
    referencePitchPath: "",
    errorMessage: "",
    modelReport: {
      stage: "queued",
      lyrics: { mode: lyricMode },
      startedAt: new Date().toISOString(),
    },
  });

  const task = prepareKtvAssets(song.id, { lyricMode })
    .catch((error) => {
      upsertKtvAsset(song.id, {
        status: "failed",
        errorMessage: error.message,
        modelReport: {
          stage: "failed",
          error: error.message,
          finishedAt: new Date().toISOString(),
        },
      });
    })
    .finally(() => {
      ktvPreparationTasks.delete(song.id);
    });

  ktvPreparationTasks.set(song.id, task);
}

function updateKtvPreparationReport(songId, report, stage, values = {}) {
  report.stage = stage;
  Object.assign(report, values);
  report.updatedAt = new Date().toISOString();
  upsertKtvAsset(songId, {
    status: "running",
    modelReport: report,
    errorMessage: "",
  });
}

async function prepareKtvAssets(songId, options = {}) {
  const song = getSongByIdOrThrow(songId);
  const initialReadiness = analyzeLyricsReadiness(song);
  const lyricMode = resolveKtvLyricMode(song, options);
  const forceLyricExtraction = lyricMode === "extract";
  assertKtvCanPrepare(song, { lyricMode });

  const songDir = path.join(KTV_STEMS_DIR, `song-${song.id}`);
  ensureDirectory(songDir);

  const inputPath = resolveSongAbsolutePath(song.relative_path);
  const lyricsPath = path.join(songDir, "lyrics.txt");
  const alignmentPath = path.join(songDir, "alignment.json");
  const referencePitchPath = path.join(songDir, "reference-pitch.json");
  fs.writeFileSync(lyricsPath, forceLyricExtraction ? "" : song.lyrics, "utf8");

  const report = {
    separator: null,
    lyrics: {
      mode: lyricMode,
      source: forceLyricExtraction ? "forced-vocal-asr" : "saved-metadata",
      initialReady: initialReadiness.ready,
    },
    alignment: null,
    pitch: null,
    startedAt: new Date().toISOString(),
  };

  const separatorCommand = resolveKtvSeparatorCommand();
  updateKtvPreparationReport(song.id, report, "separating");
  const stems = separatorCommand
    ? await runExternalSeparator(song, inputPath, songDir, report, separatorCommand)
    : await createFfmpegGuideStems(inputPath, songDir, report);

  const alignmentCommand = resolveKtvAlignmentCommand();
  updateKtvPreparationReport(song.id, report, forceLyricExtraction ? "extracting" : "aligning");
  const alignment = alignmentCommand
    ? await createAsrBackedLyricAlignment(song, inputPath, lyricsPath, alignmentPath, stems, report, alignmentCommand, {
        lyricMode,
      })
    : await createHeuristicLyricAlignment(song, inputPath, report);
  persistGeneratedKtvLyrics(song, alignment, initialReadiness, report, { force: forceLyricExtraction });

  fs.writeFileSync(alignmentPath, JSON.stringify(alignment, null, 2), "utf8");
  updateKtvPreparationReport(song.id, report, "pitch");
  await createReferencePitchGuide(song, inputPath, stems, alignment, referencePitchPath, report);
  updateKtvPreparationReport(song.id, report, "finalizing");
  report.finishedAt = new Date().toISOString();

  upsertKtvAsset(song.id, {
    status: "complete",
    vocalsPath: toDataRelativePath(stems.vocalsPath),
    accompanimentPath: toDataRelativePath(stems.accompanimentPath),
    backgroundPath: toDataRelativePath(stems.backgroundPath),
    alignmentPath: toDataRelativePath(alignmentPath),
    referencePitchPath: toDataRelativePath(referencePitchPath),
    modelReport: report,
    errorMessage: "",
  });
}

async function runExternalSeparator(song, inputPath, outputDir, report, command) {
  await runConfiguredCommand(command, {
    KTV_SONG_ID: String(song.id),
    KTV_INPUT: inputPath,
    KTV_OUTPUT_DIR: outputDir,
    KTV_LYRICS: song.lyrics,
  });

  const stems = discoverStemFiles(outputDir);
  if (!stems.vocalsPath || !stems.accompanimentPath) {
    throw new HttpError(
      500,
      "KTV separator finished but did not create recognizable vocals/accompaniment stems.",
    );
  }

  report.separator = {
    mode: "external",
    command: process.env.KTV_SEPARATOR_COMMAND ? "KTV_SEPARATOR_COMMAND" : "KTV_USE_PRETRAINED",
    model: process.env.KTV_SEPARATOR_MODEL || getKtvPretrainedSeparatorLabel(),
  };

  return {
    vocalsPath: stems.vocalsPath,
    accompanimentPath: stems.accompanimentPath,
    backgroundPath: stems.backgroundPath || stems.accompanimentPath,
  };
}

async function createFfmpegGuideStems(inputPath, outputDir, report) {
  const vocalsPath = path.join(outputDir, "vocals-guide.mp3");
  const accompanimentPath = path.join(outputDir, "accompaniment-guide.mp3");

  const extractedVocalGuide = await runFfmpeg([
    "-y",
    "-i",
    inputPath,
    "-map",
    "0:a:0",
    "-vn",
    "-ar",
    "44100",
    "-af",
    "aformat=channel_layouts=stereo,pan=mono|c0=0.5*c0+0.5*c1,highpass=f=85,lowpass=f=1400,dynaudnorm=f=75",
    "-b:a",
    "160k",
    vocalsPath,
  ]);

  if (!extractedVocalGuide.ok) {
    throw new HttpError(500, `Unable to extract KTV guide vocal stem: ${extractedVocalGuide.error}`);
  }

  const extractedAccompaniment = await runFfmpeg([
    "-y",
    "-i",
    inputPath,
    "-map",
    "0:a:0",
    "-vn",
    "-ac",
    "2",
    "-ar",
    "44100",
    "-af",
    "aformat=channel_layouts=stereo,pan=stereo|c0=c0-c1|c1=c1-c0",
    "-b:a",
    "160k",
    accompanimentPath,
  ]);

  if (!extractedAccompaniment.ok) {
    throw new HttpError(500, `Unable to extract KTV accompaniment guide: ${extractedAccompaniment.error}`);
  }

  report.separator = {
    mode: "ffmpeg-guide",
    model: "ffmpeg center-vocal guide stems",
    format: "mp3-160k",
    warning:
      "Fallback estimates a center vocal guide only. Configure KTV_SEPARATOR_COMMAND for BS-RoFormer/Mel-Band RoFormer quality separation.",
  };

  return { vocalsPath, accompanimentPath, backgroundPath: accompanimentPath };
}

async function createAsrBackedLyricAlignment(song, inputPath, lyricsPath, alignmentPath, stems, report, command, options = {}) {
  try {
    return await runExternalAlignment(song, inputPath, lyricsPath, alignmentPath, stems, report, command);
  } catch (error) {
    if (process.env.KTV_ALIGNMENT_COMMAND || options.lyricMode === "extract" || !analyzeLyricsReadiness(song).ready) {
      throw error;
    }

    const fallback = await createHeuristicLyricAlignment(song, inputPath, report);
    report.alignment = {
      ...report.alignment,
      fallbackFrom: "vocal-asr-lyric-match",
      fallbackError: error.message,
      warning: "ASR lyric matching failed; KTV fell back to saved lyric timing.",
    };
    return fallback;
  }
}

function persistGeneratedKtvLyrics(song, alignment, initialReadiness, report, options = {}) {
  if ((!options.force && initialReadiness?.ready) || !alignment || alignment.source !== "vocal-asr-generated-lyrics") {
    return false;
  }

  const generatedLyrics = String(alignment.generatedLyrics || buildGeneratedLrcFromAlignment(alignment)).trim();
  if (!generatedLyrics) {
    return false;
  }

  const generatedReadiness = analyzeLyricsReadiness({ lyrics: generatedLyrics });
  report.alignment = {
    ...(report.alignment || {}),
    generatedLyricsAvailable: true,
    generatedLyricsSaved: false,
    preservedDefaultLyrics: true,
    generatedLyricLineCount: generatedReadiness.lineCount,
    generatedTimedLineCount: generatedReadiness.timedLineCount,
    generatedLyricsReady: generatedReadiness.ready,
    generatedLyricsWarnings: generatedReadiness.ready ? [] : generatedReadiness.reasons,
  };
  alignment.generatedLyrics = generatedLyrics;
  alignment.generatedLyricsAvailable = true;
  alignment.generatedLyricsSaved = false;
  alignment.generatedLyricsReady = generatedReadiness.ready;
  return true;
}

function buildGeneratedLrcFromAlignment(alignment) {
  return (alignment.lines || [])
    .map((line) => {
      const text = String(line.text || "").trim();
      if (!text) {
        return "";
      }
      return `[${formatLrcTimestamp(Number(line.start) || 0)}]${text}`;
    })
    .filter(Boolean)
    .join("\n");
}

function formatLrcTimestamp(seconds) {
  const bounded = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(bounded / 60);
  const remaining = bounded - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${remaining.toFixed(2).padStart(5, "0")}`;
}

async function runExternalAlignment(song, inputPath, lyricsPath, alignmentPath, stems, report, command) {
  await runConfiguredCommand(command, {
    KTV_SONG_ID: String(song.id),
    KTV_INPUT: inputPath,
    KTV_OUTPUT_DIR: path.dirname(alignmentPath),
    KTV_LYRICS_PATH: lyricsPath,
    KTV_ALIGNMENT_PATH: alignmentPath,
    KTV_VOCALS_PATH: stems?.vocalsPath || inputPath,
    KTV_ACCOMPANIMENT_PATH: stems?.accompanimentPath || "",
    KTV_TITLE: song.display_title || song.file_stem || "",
    KTV_ARTIST: song.artist || "",
  });

  if (!fs.existsSync(alignmentPath)) {
    throw new HttpError(500, "KTV alignment command did not create alignment.json.");
  }

  const alignment = JSON.parse(fs.readFileSync(alignmentPath, "utf8"));
  validateAlignment(alignment);
  report.alignment = {
    mode: "external",
    source: alignment.source || "external",
    command: process.env.KTV_ALIGNMENT_COMMAND ? "KTV_ALIGNMENT_COMMAND" : "KTV_USE_PRETRAINED",
    model: alignment.model || process.env.KTV_ALIGNMENT_MODEL || getKtvPretrainedAlignmentLabel(),
    lineCount: alignment.lines.length,
    averageSimilarity: alignment.quality?.averageSimilarity,
    warnings: alignment.quality?.warnings || [],
  };

  return alignment;
}

async function createHeuristicLyricAlignment(song, inputPath, report) {
  const duration = (await probeMediaDuration(inputPath)) || 0;
  const timedLyrics = parseTimedLyricsForServer(song.lyrics);
  const plainLines = getPlainLyricLines(song.lyrics);

  const lines = timedLyrics.length
    ? timedLyrics.map((line, index) => ({
        index,
        start: line.time,
        end: timedLyrics[index + 1]?.time || duration || line.time + 3,
        text: line.text,
      }))
    : plainLines.map((line, index) => {
        const start = duration > 0 ? (duration / plainLines.length) * index : index * 3;
        const end = duration > 0 ? (duration / plainLines.length) * (index + 1) : start + 3;
        return { index, start, end, text: line };
      });

  const alignment = {
    version: 1,
    source: timedLyrics.length ? "synced-lyrics" : "plain-lyrics-even-spacing",
    duration,
    lineCount: lines.length,
    lines,
    quality: {
      label: timedLyrics.length ? "metadata-synced" : "heuristic",
      warnings: timedLyrics.length
        ? []
        : ["No timestamped lyrics were available; timing was estimated evenly across the song."],
    },
  };

  validateAlignment(alignment);
  report.alignment = {
    mode: alignment.source,
    model: process.env.KTV_ALIGNMENT_MODEL || "lyrics metadata timing",
    lineCount: lines.length,
  };

  return alignment;
}

async function createReferencePitchGuide(song, inputPath, stems, alignment, referencePitchPath, report) {
  const pitchCommand = resolveKtvPitchCommand();
  if (pitchCommand) {
    await runExternalPitchExtraction(song, inputPath, stems.vocalsPath, referencePitchPath, alignment, report, pitchCommand);
    return;
  }

  const sourcePath = stems.vocalsPath && fs.existsSync(stems.vocalsPath) ? stems.vocalsPath : inputPath;
  const guide = await extractPitchGuideFromAudio(sourcePath, {
    duration: alignment.duration,
    alignment,
    source: "vocal-stem-autocorrelation",
  });

  fs.writeFileSync(referencePitchPath, JSON.stringify(guide, null, 2), "utf8");
  report.pitch = {
    mode: guide.source,
    model: "ffmpeg PCM + autocorrelation pitch guide",
    source: path.basename(sourcePath),
    pointCount: guide.points.length,
    voicedRatio: guide.quality.voicedRatio,
    warning:
      guide.points.length < 8
        ? "Low voiced pitch count; configure KTV_PITCH_COMMAND with RMVPE/CREPE for production-grade extraction."
        : "",
  };
}

async function runExternalPitchExtraction(song, inputPath, vocalsPath, referencePitchPath, alignment, report, command) {
  const alignmentPath = path.join(path.dirname(referencePitchPath), "alignment.json");
  await runConfiguredCommand(command, {
    KTV_SONG_ID: String(song.id),
    KTV_INPUT: inputPath,
    KTV_VOCALS_PATH: vocalsPath,
    KTV_REFERENCE_PITCH_PATH: referencePitchPath,
    KTV_PITCH_PATH: referencePitchPath,
    KTV_ALIGNMENT_PATH: alignmentPath,
    KTV_ALIGNMENT_JSON: JSON.stringify(alignment),
  });

  if (!fs.existsSync(referencePitchPath)) {
    throw new HttpError(500, "KTV pitch command did not create reference-pitch.json.");
  }

  const guide = JSON.parse(fs.readFileSync(referencePitchPath, "utf8"));
  validatePitchGuide(guide);
  report.pitch = {
    mode: "external",
    command: process.env.KTV_PITCH_COMMAND ? "KTV_PITCH_COMMAND" : "KTV_USE_PRETRAINED",
    model: process.env.KTV_PITCH_MODEL || getKtvPretrainedPitchLabel(),
    pointCount: guide.points?.length || 0,
    extractor: guide.extractor || "",
  };
}

function createKtvSession(payload) {
  const song = getSongByIdOrThrow(Number(payload.songId));
  assertKtvLyricsReady(song);
  assertKtvAssetsReady(song.id);

  const result = run(
    `
      INSERT INTO ktv_sessions (song_id, status)
      VALUES (?, 'created')
    `,
    [song.id],
  );

  return formatKtvSession(getKtvSessionByIdOrThrow(Number(result.lastInsertRowid)));
}

function assertKtvAssetsReady(songId) {
  const asset = getKtvAssetBySongId(songId);
  if (!asset || asset.status !== "complete" || !asset.accompaniment_path || !asset.reference_pitch_path) {
    throw new HttpError(409, "KTV accompaniment and pitch guide are not ready. Prepare stems before singing.");
  }

  const accompanimentPath = resolveDataRelativePath(asset.accompaniment_path);
  const referencePitchPath = resolveDataRelativePath(asset.reference_pitch_path);
  if (!accompanimentPath || !referencePitchPath || !fs.existsSync(accompanimentPath) || !fs.existsSync(referencePitchPath)) {
    throw new HttpError(409, "KTV accompaniment and pitch guide are missing. Prepare stems before singing.");
  }
}

async function saveKtvRecordingAndScore(sessionId, body, contentType = "", requestedName = "") {
  const session = getKtvSessionByIdOrThrow(sessionId);
  const song = getSongByIdOrThrow(session.song_id);
  assertKtvLyricsReady(song);

  if (!body.length) {
    throw new HttpError(400, "Recording is empty.");
  }

  const extension = inferAudioExtension(contentType);
  const recordingName = buildKtvRecordingName(song, requestedName);
  const recordingPath = resolveUniqueKtvRecordingPath(recordingName, extension);
  fs.writeFileSync(recordingPath, body);

  run(
    `
      UPDATE ktv_sessions
      SET
        status = 'scoring',
        recording_path = ?,
        recording_name = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [toDataRelativePath(recordingPath), recordingName, session.id],
  );

  try {
    const score = process.env.KTV_SCORING_COMMAND
      ? await runExternalScoring(song, session.id, recordingPath)
      : await scoreKtvRecordingHeuristically(song, recordingPath);

    const normalizedScore = normalizeKtvScore(score);
    run(
      `
        UPDATE ktv_sessions
        SET
          status = 'complete',
          score_json = ?,
          overall_score = ?,
          error_message = '',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [JSON.stringify(normalizedScore), normalizedScore.overall, session.id],
    );
  } catch (error) {
    run(
      `
        UPDATE ktv_sessions
        SET
          status = 'failed',
          error_message = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [error.message, session.id],
    );
  }

  return formatKtvSession(getKtvSessionByIdOrThrow(session.id));
}

async function runExternalScoring(song, sessionId, recordingPath) {
  const outputPath = path.join(KTV_RECORDINGS_DIR, `session-${sessionId}-score.json`);
  await runConfiguredCommand(process.env.KTV_SCORING_COMMAND, {
    KTV_SONG_ID: String(song.id),
    KTV_SESSION_ID: String(sessionId),
    KTV_RECORDING_PATH: recordingPath,
    KTV_SCORE_PATH: outputPath,
    KTV_LYRICS: getKtvScoringLyrics(song),
  });

  if (!fs.existsSync(outputPath)) {
    throw new HttpError(500, "KTV scoring command did not create score JSON.");
  }

  const score = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  return {
    ...score,
    model: score.model || process.env.KTV_SCORING_MODEL || "external-pretrained",
    modelMode: "external",
  };
}

async function scoreKtvRecordingHeuristically(song, recordingPath) {
  const songDuration = (await probeMediaDuration(resolveSongAbsolutePath(song.relative_path))) || 0;
  const recordingDuration = (await probeMediaDuration(recordingPath)) || 0;
  const volume = await probeVolumeStats(recordingPath);
  const hasLyricGuide = hasKtvLyricGuideReady(song);
  const pitchAnalysis = await scoreRecordingPitchAgainstGuide(song, recordingPath).catch((error) => ({
    score: 70,
    confidence: "low",
    diagnostics: {
      error: error.message,
      warning: "Pitch scoring fell back because recording/reference pitch extraction failed.",
    },
  }));

  const durationRatio =
    songDuration > 0 && recordingDuration > 0
      ? Math.min(recordingDuration, songDuration) / Math.max(recordingDuration, songDuration)
      : 0.55;
  const timingScore = Math.round(clamp(durationRatio, 0, 1) * 100);
  const energyScore = volume ? scoreMeanVolume(volume.meanVolume) : 68;
  const pitchScore = pitchAnalysis.score;
  const lyricsScore = hasLyricGuide ? 100 : 0;
  const overall = Math.round(
    timingScore * 0.32 + energyScore * 0.23 + pitchScore * 0.25 + lyricsScore * 0.2,
  );

  return {
    overall,
    components: {
      timing: timingScore,
      energy: energyScore,
      pitch: pitchScore,
      lyrics: lyricsScore,
    },
    model: pitchAnalysis.model || "ffmpeg duration/volume + reference pitch guide",
    modelMode: "fallback",
    confidence: pitchAnalysis.confidence || (process.env.KTV_PITCH_COMMAND ? "medium" : "low"),
    diagnostics: {
      songDuration,
      recordingDuration,
      meanVolume: volume?.meanVolume ?? null,
      maxVolume: volume?.maxVolume ?? null,
      pitch: pitchAnalysis.diagnostics || {},
      note: "Configure KTV_PITCH_COMMAND/KTV_SCORING_COMMAND with RMVPE/CREPE for production-grade melody scoring.",
    },
  };
}

async function scoreRecordingPitchAgainstGuide(song, recordingPath) {
  const referenceGuide = loadKtvReferencePitchGuide(song.id);
  if (!referenceGuide?.points?.length) {
    return {
      score: 70,
      confidence: "low",
      model: "ffmpeg duration/volume heuristic",
      diagnostics: { warning: "Reference pitch guide is empty or unavailable." },
    };
  }

  const recordingGuide = await extractPitchGuideFromAudio(recordingPath, {
    duration: referenceGuide.duration,
    source: "recording-autocorrelation",
  });
  const comparison = comparePitchGuides(referenceGuide, recordingGuide);

  return {
    score: comparison.score,
    confidence: comparison.matchedPoints >= 18 ? "medium" : "low",
    model: "ffmpeg PCM + reference pitch guide",
    diagnostics: comparison,
  };
}

function streamKtvAsset(req, res, songId, stemName) {
  const asset = getKtvAssetBySongId(songId);
  if (!asset || asset.status !== "complete") {
    throw new HttpError(404, "KTV asset is not ready.");
  }

  const pathByStem = {
    vocals: asset.vocals_path,
    accompaniment: asset.accompaniment_path,
    background: asset.background_path,
  };
  const absolutePath = resolveDataRelativePath(pathByStem[stemName]);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    throw new HttpError(404, "KTV stem is missing.");
  }

  streamFile(req, res, absolutePath, getMimeType(absolutePath));
}

function sendKtvPitchGuide(res, songId) {
  const guide = loadKtvReferencePitchGuide(songId);
  if (!guide) {
    throw new HttpError(404, "KTV pitch guide is missing.");
  }

  sendJson(res, 200, guide);
}

function sendKtvAlignment(res, songId) {
  const alignment = loadKtvAlignment(songId);
  if (!alignment) {
    throw new HttpError(404, "KTV lyric alignment is missing.");
  }

  sendJson(res, 200, alignment);
}

function streamSongMedia(req, res, songId) {
  const song = getSongByIdOrThrow(songId);
  const absolutePath = resolveSongAbsolutePath(song.relative_path);

  if (!fs.existsSync(absolutePath)) {
    syncLibrary();
    throw new HttpError(404, "Media file is missing.");
  }

  streamFile(req, res, absolutePath, getMimeType(song.file_name));
}

function streamFile(req, res, absolutePath, mimeType) {
  const stat = fs.statSync(absolutePath);
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

function servePublicAsset(res, fileName) {
  const safeName = path.basename(fileName);
  const absolutePath = path.join(PUBLIC_DIR, "assets", safeName);
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

function ensureColumn(tableName, columnName, definition) {
  const columns = queryAll(`PRAGMA table_info(${tableName})`);
  if (columns.some((column) => column.name === columnName)) {
    return;
  }

  run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
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

async function readBinary(req, maxBytes) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > maxBytes) {
      throw new HttpError(413, "Recording is too large.");
    }

    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

function upsertKtvAsset(songId, values) {
  const current = getKtvAssetBySongId(songId);
  const next = {
    status: values.status ?? current?.status ?? "idle",
    vocalsPath: values.vocalsPath ?? current?.vocals_path ?? "",
    accompanimentPath: values.accompanimentPath ?? current?.accompaniment_path ?? "",
    backgroundPath: values.backgroundPath ?? current?.background_path ?? "",
    alignmentPath: values.alignmentPath ?? current?.alignment_path ?? "",
    referencePitchPath: values.referencePitchPath ?? current?.reference_pitch_path ?? "",
    modelReport: values.modelReport ?? parseJsonObject(current?.model_report),
    errorMessage: values.errorMessage ?? current?.error_message ?? "",
  };

  run(
    `
      INSERT INTO ktv_assets (
        song_id,
        status,
        vocals_path,
        accompaniment_path,
        background_path,
        alignment_path,
        reference_pitch_path,
        model_report,
        error_message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(song_id) DO UPDATE SET
        status = excluded.status,
        vocals_path = excluded.vocals_path,
        accompaniment_path = excluded.accompaniment_path,
        background_path = excluded.background_path,
        alignment_path = excluded.alignment_path,
        reference_pitch_path = excluded.reference_pitch_path,
        model_report = excluded.model_report,
        error_message = excluded.error_message,
        updated_at = CURRENT_TIMESTAMP
    `,
    [
      songId,
      next.status,
      next.vocalsPath,
      next.accompanimentPath,
      next.backgroundPath,
      next.alignmentPath,
      next.referencePitchPath,
      JSON.stringify(next.modelReport || {}),
      next.errorMessage,
    ],
  );
}

function getKtvAssetBySongId(songId) {
  return queryGet("SELECT * FROM ktv_assets WHERE song_id = ?", [Number(songId)]) || null;
}

function getKtvSessionByIdOrThrow(sessionId) {
  const session = queryGet("SELECT * FROM ktv_sessions WHERE id = ?", [Number(sessionId)]);
  if (!session) {
    throw new HttpError(404, "KTV session not found.");
  }

  return session;
}

function formatKtvAsset(row) {
  const vocalsPath = resolveDataRelativePath(row.vocals_path);
  const accompanimentPath = resolveDataRelativePath(row.accompaniment_path);
  const backgroundPath = resolveDataRelativePath(row.background_path);
  const alignmentPath = resolveDataRelativePath(row.alignment_path);
  const referencePitchPath = resolveDataRelativePath(row.reference_pitch_path);

  return {
    songId: row.song_id,
    status: row.status,
    vocalsUrl: vocalsPath && fs.existsSync(vocalsPath) ? `/api/ktv/songs/${row.song_id}/assets/vocals` : "",
    accompanimentUrl: accompanimentPath && fs.existsSync(accompanimentPath)
      ? `/api/ktv/songs/${row.song_id}/assets/accompaniment`
      : "",
    backgroundUrl: backgroundPath && fs.existsSync(backgroundPath) ? `/api/ktv/songs/${row.song_id}/assets/background` : "",
    alignmentUrl: alignmentPath && fs.existsSync(alignmentPath) ? `/api/ktv/songs/${row.song_id}/alignment` : "",
    referencePitchUrl: referencePitchPath && fs.existsSync(referencePitchPath) ? `/api/ktv/songs/${row.song_id}/pitch-guide` : "",
    modelReport: parseJsonObject(row.model_report),
    errorMessage: row.error_message || "",
    updatedAt: row.updated_at,
  };
}

function formatKtvSession(row) {
  const score = parseJsonObject(row.score_json);
  return {
    id: row.id,
    songId: row.song_id,
    status: row.status,
    recordingPath: row.recording_path,
    recordingName: row.recording_name || "",
    score,
    overallScore:
      row.overall_score === null || row.overall_score === undefined
        ? null
        : Number.isFinite(Number(row.overall_score))
          ? Number(row.overall_score)
          : null,
    errorMessage: row.error_message || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function assertKtvLyricsReady(song) {
  if (!hasKtvLyricGuideReady(song)) {
    const readiness = analyzeLyricsReadiness(song);
    throw new HttpError(422, `KTV mode requires complete lyrics: ${readiness.reasons.join(" ")}`);
  }
}

function hasKtvLyricGuideReady(song) {
  const readiness = analyzeLyricsReadiness(song);
  if (readiness.ready) {
    return true;
  }

  const alignment = loadKtvAlignment(song.id);
  return Boolean(alignment?.lines?.length);
}

function getKtvScoringLyrics(song) {
  if (analyzeLyricsReadiness(song).ready) {
    return song.lyrics;
  }

  const alignment = loadKtvAlignment(song.id);
  if (!alignment?.lines?.length) {
    return "";
  }

  return String(alignment.generatedLyrics || buildGeneratedLrcFromAlignment(alignment)).trim();
}

function assertKtvCanPrepare(song, options = {}) {
  const readiness = analyzeLyricsReadiness(song);
  if (options.lyricMode === "extract") {
    if (canAutoExtractKtvLyrics()) {
      return;
    }

    throw new HttpError(422, "KTV automatic lyric extraction requires a configured ASR alignment model.");
  }

  if (readiness.ready) {
    return;
  }

  throw new HttpError(
    422,
    `KTV mode requires complete lyrics or an automatic lyric extraction model: ${readiness.reasons.join(" ")}`,
  );
}

function analyzeLyricsReadiness(song) {
  const lyrics = String(song?.lyrics || "").replace(/\r\n/g, "\n").trim();
  const plainLines = getPlainLyricLines(lyrics);
  const timedLines = parseTimedLyricsForServer(lyrics);
  const normalized = lyrics.toLowerCase();
  const placeholderPattern =
    /(no lyrics|暂无歌词|没有歌词|纯音乐|instrumental|歌词待补|lyrics pending|unknown lyrics)/i;
  const reasons = [];

  if (!lyrics) {
    reasons.push("lyrics are empty.");
  }

  if (placeholderPattern.test(normalized)) {
    reasons.push("lyrics look like a placeholder.");
  }

  if (plainLines.length < 4) {
    reasons.push("at least 4 lyric lines are required.");
  }

  if (lyrics.replace(/\s/g, "").length < 80) {
    reasons.push("lyrics are too short to score reliably.");
  }

  const timestampCoverage = timedLines.length ? timedLines.length / Math.max(plainLines.length, 1) : 0;
  const ready = reasons.length === 0;

  return {
    ready,
    level: ready ? (timedLines.length >= 4 ? "synced" : "plain") : "blocked",
    lineCount: plainLines.length,
    timedLineCount: timedLines.length,
    timestampCoverage,
    reasons,
  };
}

function getPlainLyricLines(lyrics) {
  return String(lyrics || "")
    .split("\n")
    .map((line) =>
      line
        .replace(/\[[^\]]+\]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
}

function parseTimedLyricsForServer(lyrics) {
  const timedLines = [];
  const timestampPattern = /\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\]/g;

  for (const rawLine of String(lyrics || "").split("\n")) {
    const matches = [...rawLine.matchAll(timestampPattern)];
    if (!matches.length) {
      continue;
    }

    const text = rawLine.replace(timestampPattern, "").trim();
    if (!text) {
      continue;
    }

    for (const match of matches) {
      timedLines.push({
        time: Number(match[1]) * 60 + Number(match[2]),
        text,
      });
    }
  }

  return timedLines.sort((left, right) => left.time - right.time);
}

function validateAlignment(alignment) {
  if (!alignment || !Array.isArray(alignment.lines) || !alignment.lines.length) {
    throw new HttpError(500, "KTV alignment is empty.");
  }

  let previousStart = -1;
  for (const line of alignment.lines) {
    if (!Number.isFinite(Number(line.start)) || !Number.isFinite(Number(line.end))) {
      throw new HttpError(500, "KTV alignment contains invalid timestamps.");
    }

    if (Number(line.start) < previousStart || Number(line.end) < Number(line.start)) {
      throw new HttpError(500, "KTV alignment timestamps are not monotonic.");
    }

    previousStart = Number(line.start);
  }
}

function discoverStemFiles(outputDir) {
  const files = fs.existsSync(outputDir) ? walkFiles(outputDir) : [];
  const findByName = (patterns) =>
    files.find((filePath) => {
      const name = path.basename(filePath).toLowerCase();
      return patterns.some((pattern) => name.includes(pattern));
    }) || "";

  return {
    vocalsPath: findByName(["vocals", "vocal", "voice", "singing"]),
    accompanimentPath: findByName(["accompaniment", "instrumental", "karaoke", "no_vocals"]),
    backgroundPath: findByName(["background", "other", "music"]),
  };
}

function walkFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
      continue;
    }

    if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

async function extractPitchGuideFromAudio(
  sourcePath,
  { duration = 0, alignment = null, source = "audio-autocorrelation" } = {},
) {
  const sampleRate = 6000;
  const frameSize = 1536;
  const hopSize = 1200;
  const samples = await decodeAudioToFloat32Mono(sourcePath, sampleRate);
  const measuredDuration = samples.length / sampleRate;
  const rawPoints = extractPitchPointsFromSamples(samples, sampleRate, frameSize, hopSize);
  const points = filterPitchPointsToSingingPhrases(rawPoints, alignment);
  const guide = {
    version: 1,
    source,
    extractor: "ffmpeg-f32le-autocorrelation",
    duration: Number((duration || measuredDuration || 0).toFixed(3)),
    sampleRate,
    frameSeconds: Number((frameSize / sampleRate).toFixed(3)),
    hopSeconds: Number((hopSize / sampleRate).toFixed(3)),
    pointCount: points.length,
    points,
    quality: {
      label: points.length >= 24 ? "usable" : points.length ? "sparse" : "empty",
      rawPointCount: rawPoints.length,
      singableLineCount: countSingableAlignmentLines(alignment),
      voicedRatio: Number((points.length / Math.max(1, Math.floor(samples.length / hopSize))).toFixed(3)),
      warnings:
        points.length >= 8
          ? []
          : ["Very little stable pitch was detected from the source audio."],
    },
  };

  validatePitchGuide(guide);
  return guide;
}

async function decodeAudioToFloat32Mono(sourcePath, sampleRate) {
  const { stdout } = await execFileAsync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      sourcePath,
      "-map",
      "0:a:0",
      "-vn",
      "-ac",
      "1",
      "-ar",
      String(sampleRate),
      "-f",
      "f32le",
      "pipe:1",
    ],
    {
      timeout: KTV_TOOL_TIMEOUT_MS,
      maxBuffer: 128 * 1024 * 1024,
      encoding: "buffer",
    },
  );

  return new Float32Array(stdout.buffer, stdout.byteOffset, Math.floor(stdout.byteLength / 4));
}

function extractPitchPointsFromSamples(samples, sampleRate, frameSize, hopSize) {
  const points = [];
  for (let offset = 0; offset + frameSize <= samples.length; offset += hopSize) {
    const frame = samples.subarray(offset, offset + frameSize);
    const result = detectPitchFromSamples(frame, sampleRate);
    if (!result.frequency) {
      continue;
    }

    const midi = frequencyToMidi(result.frequency);
    points.push({
      time: Number((offset / sampleRate).toFixed(2)),
      frequency: Number(result.frequency.toFixed(2)),
      midi: Number(midi.toFixed(3)),
      note: midiToNoteName(midi),
      confidence: Number(result.confidence.toFixed(3)),
    });
  }

  return smoothPitchJumps(points);
}

function detectPitchFromSamples(frame, sampleRate) {
  let rms = 0;
  for (const sample of frame) {
    rms += sample * sample;
  }

  rms = Math.sqrt(rms / frame.length);
  if (rms < 0.01) {
    return { frequency: 0, confidence: 0 };
  }

  const minLag = Math.max(1, Math.floor(sampleRate / 900));
  const maxLag = Math.min(frame.length - 2, Math.floor(sampleRate / 70));
  let bestLag = -1;
  let bestScore = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    let leftEnergy = 0;
    let rightEnergy = 0;
    const limit = frame.length - lag;

    for (let index = 0; index < limit; index += 1) {
      const left = frame[index];
      const right = frame[index + lag];
      correlation += left * right;
      leftEnergy += left * left;
      rightEnergy += right * right;
    }

    const score = correlation / Math.sqrt(Math.max(leftEnergy * rightEnergy, 1e-12));
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }

  if (bestLag <= 0 || bestScore < 0.42) {
    return { frequency: 0, confidence: bestScore };
  }

  return {
    frequency: sampleRate / bestLag,
    confidence: clamp(bestScore, 0, 1),
  };
}

function smoothPitchJumps(points) {
  if (points.length < 3) {
    return points;
  }

  return points.filter((point, index) => {
    const previous = points[index - 1];
    const next = points[index + 1];
    if (!previous || !next) {
      return true;
    }

    const jumpIn = Math.abs(point.midi - previous.midi);
    const jumpOut = Math.abs(point.midi - next.midi);
    const neighborsClose = Math.abs(previous.midi - next.midi) < 1.5;
    return !(neighborsClose && jumpIn > 7 && jumpOut > 7);
  });
}

function filterPitchPointsToSingingPhrases(points, alignment) {
  const intervals = getSingableAlignmentIntervals(alignment);
  if (!intervals.length) {
    return points.filter((point) => point.confidence >= 0.5);
  }

  return points.filter((point) => {
    if (point.confidence < 0.48) {
      return false;
    }

    return intervals.some((interval) => point.time >= interval.start && point.time <= interval.end);
  });
}

function getSingableAlignmentIntervals(alignment) {
  if (!alignment || !Array.isArray(alignment.lines)) {
    return [];
  }

  return alignment.lines
    .filter((line) => isSingableLyricLine(line.text))
    .map((line) => ({
      start: Math.max(0, Number(line.start) - 0.15),
      end: Math.max(Number(line.start), Number(line.end) + 0.2),
    }))
    .filter((line) => Number.isFinite(line.start) && Number.isFinite(line.end) && line.end > line.start);
}

function countSingableAlignmentLines(alignment) {
  return getSingableAlignmentIntervals(alignment).length;
}

function isSingableLyricLine(text) {
  const normalized = String(text || "")
    .replace(/[：:]/g, ":")
    .trim()
    .toLowerCase();
  if (!normalized) {
    return false;
  }

  const creditPattern =
    /^(title|artist|album|composer|composed by|written by|lyrics by|作词|作曲|编曲|歌手|歌曲|专辑)\b|composed by|dave thomas junior\/david thomas/i;
  if (creditPattern.test(normalized)) {
    return false;
  }

  const compact = normalized.replace(/\s+/g, "");
  if (compact.length < 3) {
    return false;
  }

  return true;
}

function validatePitchGuide(guide) {
  if (!guide || !Array.isArray(guide.points)) {
    throw new HttpError(500, "KTV pitch guide is invalid.");
  }

  let previousTime = -1;
  for (const point of guide.points) {
    const time = Number(point.time);
    const frequency = Number(point.frequency);
    if (!Number.isFinite(time) || time < previousTime || !Number.isFinite(frequency) || frequency <= 0) {
      throw new HttpError(500, "KTV pitch guide contains invalid pitch points.");
    }
    previousTime = time;
  }
}

function loadKtvReferencePitchGuide(songId) {
  const asset = getKtvAssetBySongId(songId);
  const absolutePath = resolveDataRelativePath(asset?.reference_pitch_path);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return null;
  }

  const guide = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  validatePitchGuide(guide);
  return guide;
}

function loadKtvAlignment(songId) {
  const asset = getKtvAssetBySongId(songId);
  const absolutePath = resolveDataRelativePath(asset?.alignment_path);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    return null;
  }

  const alignment = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  validateAlignment(alignment);
  return alignment;
}

function comparePitchGuides(referenceGuide, recordingGuide) {
  const referencePoints = referenceGuide.points || [];
  const recordingPoints = recordingGuide.points || [];
  const errors = [];
  let referenceIndex = 0;

  for (const point of recordingPoints) {
    while (
      referenceIndex < referencePoints.length - 1 &&
      referencePoints[referenceIndex + 1].time <= point.time
    ) {
      referenceIndex += 1;
    }

    const candidates = [referencePoints[referenceIndex], referencePoints[referenceIndex + 1]].filter(Boolean);
    const reference = candidates
      .map((candidate) => ({ ...candidate, distance: Math.abs(candidate.time - point.time) }))
      .filter((candidate) => candidate.distance <= 0.35)
      .sort((left, right) => left.distance - right.distance)[0];

    if (!reference) {
      continue;
    }

    errors.push(Math.abs(1200 * Math.log2(point.frequency / reference.frequency)));
  }

  if (!errors.length) {
    return {
      score: 70,
      matchedPoints: 0,
      averageCents: null,
      medianCents: null,
      warning: "No overlapping voiced pitch points were available for comparison.",
    };
  }

  errors.sort((left, right) => left - right);
  const averageCents = errors.reduce((sum, value) => sum + Math.min(value, 600), 0) / errors.length;
  const medianCents = errors[Math.floor(errors.length / 2)];

  return {
    score: normalizeScoreValue(100 - averageCents * 0.35),
    matchedPoints: errors.length,
    referencePoints: referencePoints.length,
    recordingPoints: recordingPoints.length,
    averageCents: Number(averageCents.toFixed(1)),
    medianCents: Number(medianCents.toFixed(1)),
  };
}

function frequencyToMidi(frequency) {
  return 12 * Math.log2(frequency / 440) + 69;
}

function midiToNoteName(midi) {
  const noteNumber = Math.round(midi);
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(noteNumber / 12) - 1;
  return `${noteNames[((noteNumber % 12) + 12) % 12]}${octave}`;
}

async function runConfiguredCommand(command, env) {
  if (!command) {
    throw new HttpError(500, "KTV command is not configured.");
  }

  const shell = process.platform === "win32" ? "cmd.exe" : "/bin/sh";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", command] : ["-lc", command];
  await execFileAsync(shell, args, {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      ...env,
    },
    timeout: KTV_TOOL_TIMEOUT_MS,
    maxBuffer: 20 * 1024 * 1024,
  });
}

async function runFfmpeg(args) {
  try {
    await execFileAsync("ffmpeg", ["-hide_banner", "-loglevel", "error", ...args], {
      timeout: KTV_TOOL_TIMEOUT_MS,
      maxBuffer: 8 * 1024 * 1024,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function probeMediaDuration(absolutePath) {
  try {
    const { stdout } = await execFileAsync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        absolutePath,
      ],
      { timeout: 30000, maxBuffer: 1024 * 1024 },
    );
    const duration = Number(stdout.trim());
    return Number.isFinite(duration) && duration > 0 ? duration : null;
  } catch (_error) {
    return null;
  }
}

async function probeVolumeStats(absolutePath) {
  try {
    const { stderr } = await execFileAsync(
      "ffmpeg",
      ["-hide_banner", "-i", absolutePath, "-filter:a", "volumedetect", "-f", "null", "-"],
      { timeout: 30000, maxBuffer: 4 * 1024 * 1024 },
    );
    return parseVolumeStats(stderr);
  } catch (error) {
    return parseVolumeStats(error.stderr || "");
  }
}

function parseVolumeStats(output) {
  const meanMatch = String(output).match(/mean_volume:\s*(-?\d+(?:\.\d+)?) dB/i);
  const maxMatch = String(output).match(/max_volume:\s*(-?\d+(?:\.\d+)?) dB/i);
  if (!meanMatch && !maxMatch) {
    return null;
  }

  return {
    meanVolume: meanMatch ? Number(meanMatch[1]) : null,
    maxVolume: maxMatch ? Number(maxMatch[1]) : null,
  };
}

function scoreMeanVolume(meanVolume) {
  if (!Number.isFinite(meanVolume)) {
    return 68;
  }

  if (meanVolume < -55) {
    return 20;
  }

  if (meanVolume > -6) {
    return 72;
  }

  return Math.round(clamp((meanVolume + 55) / 37, 0, 1) * 82 + 18);
}

function normalizeKtvScore(score) {
  const components = score?.components || {};
  const normalizedComponents = {
    timing: normalizeScoreValue(components.timing),
    energy: normalizeScoreValue(components.energy),
    pitch: normalizeScoreValue(components.pitch),
    lyrics: normalizeScoreValue(components.lyrics),
  };
  const overall = normalizeScoreValue(
    Number.isFinite(Number(score?.overall))
      ? score.overall
      : normalizedComponents.timing * 0.32 +
          normalizedComponents.energy * 0.23 +
          normalizedComponents.pitch * 0.25 +
          normalizedComponents.lyrics * 0.2,
  );

  return {
    overall,
    components: normalizedComponents,
    model: String(score?.model || "unknown").trim() || "unknown",
    modelMode: String(score?.modelMode || "external").trim() || "external",
    confidence: String(score?.confidence || "medium").trim() || "medium",
    diagnostics: score?.diagnostics && typeof score.diagnostics === "object" ? score.diagnostics : {},
  };
}

function normalizeScoreValue(value) {
  const number = Number(value);
  return Math.round(clamp(Number.isFinite(number) ? number : 0, 0, 100));
}

function buildKtvRecordingName(song, requestedName) {
  const requested = sanitizeFileStem(String(requestedName || ""));
  if (requested) {
    return requested.slice(0, 160);
  }

  const title = sanitizeFileStem(song.display_title || song.file_stem || "song") || "song";
  return `${title}-${formatKtvTimestamp(new Date())}-sing`.slice(0, 180);
}

function resolveUniqueKtvRecordingPath(recordingName, extension) {
  const baseName = sanitizeFileStem(recordingName) || "ktv-recording";
  let candidate = path.join(KTV_RECORDINGS_DIR, `${baseName}${extension}`);
  let index = 2;

  while (fs.existsSync(candidate)) {
    candidate = path.join(KTV_RECORDINGS_DIR, `${baseName}-${index}${extension}`);
    index += 1;
  }

  return candidate;
}

function formatKtvTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "-",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseJsonObject(value) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function getSongPlaylists(songId) {
  return queryAll(
    `
      SELECT playlists.id, playlists.name
      FROM playlists
      INNER JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
      WHERE playlist_songs.song_id = ?
      ORDER BY lower(playlists.name), playlists.id
    `,
    [Number(songId)],
  ).map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
  }));
}

function formatSong(row, { playlists = [] } = {}) {
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
    playlists,
    playlistIds: playlists.map((playlist) => playlist.id),
    ktvReadiness: analyzeLyricsReadiness(row),
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

function inferAudioExtension(mimeType) {
  const normalized = String(mimeType || "").split(";")[0].trim().toLowerCase();

  switch (normalized) {
    case "audio/wav":
    case "audio/x-wav":
      return ".wav";
    case "audio/mpeg":
    case "audio/mp3":
      return ".mp3";
    case "audio/mp4":
    case "audio/x-m4a":
      return ".m4a";
    case "audio/ogg":
      return ".ogg";
    case "audio/webm":
    case "video/webm":
      return ".webm";
    default:
      return ".webm";
  }
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

function toDataRelativePath(absolutePath) {
  return path.relative(DATA_DIR, absolutePath).split(path.sep).join("/");
}

function resolveDataRelativePath(relativePath) {
  if (!relativePath) {
    return "";
  }

  const absolutePath = path.resolve(DATA_DIR, relativePath.split("/").join(path.sep));
  if (!absolutePath.startsWith(DATA_DIR + path.sep)) {
    throw new HttpError(400, "Invalid KTV asset path.");
  }

  return absolutePath;
}

function getStaticContentType(absolutePath) {
  const extension = path.extname(absolutePath).toLowerCase();

  switch (extension) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".webmanifest":
      return "application/manifest+json; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
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

function getLanUrls(port) {
  if (!["0.0.0.0", "::", ""].includes(HOST)) {
    return [];
  }

  const protocol = HTTPS_ENABLED ? "https" : "http";
  const urls = [];
  for (const ipAddress of getLanIpv4Addresses()) {
    urls.push(`${protocol}://${ipAddress}:${port}`);
  }

  return urls;
}

function getLanIpv4Addresses() {
  const addresses = [];
  const interfaces = os.networkInterfaces();
  for (const interfaceAddresses of Object.values(interfaces)) {
    for (const address of interfaceAddresses || []) {
      if (address.internal || address.family !== "IPv4") {
        continue;
      }

      addresses.push(address.address);
    }
  }

  return addresses;
}

function resolveHttpsOptions() {
  ensureLocalHttpsCertificate();
  return {
    key: fs.readFileSync(HTTPS_KEY_PATH),
    cert: fs.readFileSync(HTTPS_CERT_PATH),
  };
}

function ensureLocalHttpsCertificate() {
  if (fs.existsSync(HTTPS_KEY_PATH) && fs.existsSync(HTTPS_CERT_PATH)) {
    return;
  }

  ensureDirectory(path.dirname(HTTPS_KEY_PATH));
  ensureDirectory(path.dirname(HTTPS_CERT_PATH));

  const configPath = path.join(CERT_DIR, "78dlc-local-openssl.cnf");
  const altNames = [
    "DNS:localhost",
    "IP:127.0.0.1",
    ...getLanIpv4Addresses().map((address) => `IP:${address}`),
  ];

  fs.writeFileSync(
    configPath,
    [
      "[req]",
      "distinguished_name=req_distinguished_name",
      "x509_extensions=v3_req",
      "prompt=no",
      "",
      "[req_distinguished_name]",
      "CN=78DLC Local",
      "",
      "[v3_req]",
      "keyUsage=critical,digitalSignature,keyEncipherment",
      "extendedKeyUsage=serverAuth",
      `subjectAltName=${altNames.join(",")}`,
      "",
    ].join("\n"),
  );

  try {
    execFileSync(
      "openssl",
      [
        "req",
        "-x509",
        "-nodes",
        "-newkey",
        "rsa:2048",
        "-keyout",
        HTTPS_KEY_PATH,
        "-out",
        HTTPS_CERT_PATH,
        "-days",
        "825",
        "-config",
        configPath,
      ],
      { stdio: "ignore" },
    );
  } catch (error) {
    throw new Error(
      `Unable to create local HTTPS certificate. Install openssl or set PLAYER_HTTPS_KEY and PLAYER_HTTPS_CERT. ${error.message}`,
    );
  }
}
