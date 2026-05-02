const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const ROOT_DIR = path.join(__dirname, "..");
const CURRENT_DB_PATH = path.join(ROOT_DIR, "data", "player.db");
const CURRENT_COVER_DIR = path.join(ROOT_DIR, "data", "covers");
const sourceDbPath = process.argv[2];
const sourceCoverDir = process.argv[3];

if (!sourceDbPath) {
  console.error("Usage: node utils/import_metadata_from_db.js /path/to/old/player.db [/path/to/old/covers]");
  process.exit(1);
}

if (!fs.existsSync(sourceDbPath)) {
  console.error(`Source database not found: ${sourceDbPath}`);
  process.exit(1);
}

if (!fs.existsSync(CURRENT_DB_PATH)) {
  console.error(`Current database not found: ${CURRENT_DB_PATH}. Start the app once to create it.`);
  process.exit(1);
}

fs.mkdirSync(CURRENT_COVER_DIR, { recursive: true });

const currentDb = new DatabaseSync(CURRENT_DB_PATH);
const sourceDb = new DatabaseSync(sourceDbPath, { readOnly: true });

const sourceSongs = sourceDb
  .prepare(
    `
      SELECT
        file_name,
        artist,
        album,
        notes,
        lyrics,
        cover_path
      FROM songs
      WHERE
        trim(coalesce(artist, '')) <> ''
        OR trim(coalesce(album, '')) <> ''
        OR trim(coalesce(notes, '')) <> ''
        OR trim(coalesce(lyrics, '')) <> ''
        OR trim(coalesce(cover_path, '')) <> ''
    `,
  )
  .all();

const currentSongByFileName = new Map(
  currentDb.prepare("SELECT id, file_name FROM songs").all().map((song) => [song.file_name, song]),
);
const updateSong = currentDb.prepare(
  `
    UPDATE songs
    SET
      artist = CASE WHEN trim(coalesce(artist, '')) = '' THEN ? ELSE artist END,
      album = CASE WHEN trim(coalesce(album, '')) = '' THEN ? ELSE album END,
      notes = CASE WHEN trim(coalesce(notes, '')) = '' THEN ? ELSE notes END,
      lyrics = CASE WHEN trim(coalesce(lyrics, '')) = '' THEN ? ELSE lyrics END,
      cover_path = CASE WHEN trim(coalesce(cover_path, '')) = '' THEN ? ELSE cover_path END,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
);

let matched = 0;
let coverFilesCopied = 0;

currentDb.exec("BEGIN;");

try {
  for (const sourceSong of sourceSongs) {
    const currentSong = currentSongByFileName.get(sourceSong.file_name);
    if (!currentSong) {
      continue;
    }

    matched += 1;
    updateSong.run(
      sourceSong.artist || "",
      sourceSong.album || "",
      sourceSong.notes || "",
      sourceSong.lyrics || "",
      sourceSong.cover_path || "",
      currentSong.id,
    );

    if (sourceSong.cover_path && sourceCoverDir) {
      const sourceCoverPath = path.join(sourceCoverDir, path.basename(sourceSong.cover_path));
      const targetCoverPath = path.join(CURRENT_COVER_DIR, path.basename(sourceSong.cover_path));
      if (fs.existsSync(sourceCoverPath) && !fs.existsSync(targetCoverPath)) {
        fs.copyFileSync(sourceCoverPath, targetCoverPath);
        coverFilesCopied += 1;
      }
    }
  }

  currentDb.exec("COMMIT;");
} catch (error) {
  currentDb.exec("ROLLBACK;");
  throw error;
} finally {
  sourceDb.close();
  currentDb.close();
}

console.log(`Imported metadata for ${matched} matching songs.`);
console.log(`Copied ${coverFilesCopied} cover files.`);
