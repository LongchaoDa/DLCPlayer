# 78DLC Player

Local web music player for the files in this project's `source/` folder.

It scans the folder, lists your MP3 and MP4 files, plays them in the browser, and stores editable song metadata in a small local SQLite database.

## Features

- Scans `source/` and uses the file name as the initial displayed song name
- Plays local audio and video files through a bottom player bar
- Left sidebar with:
  - `Special Select`
  - `Recent Played`
  - `My Lists`
- Song detail editor for:
  - display name
  - file name
  - artist
  - album
  - notes
  - lyrics
- Cover upload and removal
- Playlist creation and multi-playlist song assignment
- Recent play history
- Auto Fetch metadata preview:
  - searches online sources for title, artist, album, cover art, and synced lyrics
  - shows the fetched result as a preview before saving
  - lets you `Save Fetched` or `Abandon` if the match is wrong
- Auto Fetch is available in both the editor drawer and immersive playback view
- Blocking fetch overlay with a running dragon loader and live stage text during metadata retrieval
- KTV mode:
  - only enables songs with complete lyrics
  - prepares vocals, accompaniment, and background stems
  - records a browser microphone performance
  - lets you preview the take locally before saving it
  - saves recordings with a default `song-title-YYYYMMDD-HHMMSS-sing` name or your custom name
  - shows live microphone level and nearest-note pitch feedback while singing
  - stores scoring sessions and shows timing, energy, pitch, lyrics, and overall scores
- Local metadata DB stored at `data/player.db`

## Requirements

- Node.js 24 or newer

This app uses built-in Node modules only. No `npm install` step is required for the current version.

## Start The App

From this folder:

```bash
node server.js
```

Then open:

`http://localhost:4318`

On macOS, you can also double-click `start.command`.

On Windows, you can double-click `start.bat`.

If your Node install includes npm, `npm start` also works.

## Phone / Offline PWA

The phone build is a PWA, so the phone does not run Node.js. The computer runs the server when you want to sync; the phone installs the player from the browser and can later play cached songs without the computer or network.

Start the phone-ready server from this folder:

```bash
npm run start:mobile
```

On macOS, you can also double-click `start-mobile.command`. The server listens on the local network over HTTPS and prints one or more `Phone URL:` lines. Open one of those URLs on the phone.

The first mobile run creates a local self-signed HTTPS certificate under `data/certs/`. A phone browser must trust that certificate before PWA install and offline caching can work; plain `http://` LAN pages are not allowed to use service workers on mobile browsers.

On the phone:

1. Open the printed `Phone URL`.
2. If the phone warns about the local certificate, trust the generated certificate for this local player origin.
3. Install it:
   - iPhone Safari: Share -> Add to Home Screen
   - Android Chrome: Install app / Add to Home screen
4. Tap `Save Offline` while the computer server is reachable. This caches the app shell, the latest song list, cover images, and audio files on the phone.
5. Later, open the installed 78DLC app with no network. The last saved offline library will still load and cached songs can play.

Offline storage is controlled by the phone browser. If the whole library is too large, save again after reducing the library or use the app online from the computer server.

## Run Tests

```bash
npm test
```

For local pretrained KTV model verification after installing `.venv-ktv` dependencies:

```bash
npm run test:ktv-models
```

## Music Source

- Shared music folder: https://drive.google.com/drive/folders/1BafAOZrEUhHe2PwrG5n1KhEaS1pF6TOg?usp=sharing

`npm run start:mobile` also enables automatic sync from this public Google Drive folder. It supports direct audio/video files and `.zip` archives containing media files. Synced media lands in `source/`, then the local library scan picks it up.

Configuration:

```bash
PLAYER_DRIVE_SYNC=1
PLAYER_DRIVE_FOLDER_ID=1BafAOZrEUhHe2PwrG5n1KhEaS1pF6TOg
PLAYER_DRIVE_SYNC_INTERVAL_MS=900000
```

Manual sync can be triggered by posting to `/api/drive/sync`; use `/api/drive/sync?force=1` to re-download existing Drive entries.

## Restore Local Metadata

If you have an old `player.db`, you can restore local song metadata such as lyrics, notes, artists, and cover references into the current database:

```bash
npm run import:metadata -- /path/to/old/player.db /path/to/old/covers
```

The import matches songs by file name and only fills empty fields in the current database.

## Auto Fetch Metadata

The app includes an online metadata retrieval flow for songs that still have incomplete local information.

![Auto Fetch Metadata workflow](docs/images/auto-fetch-workflow-paper.png)

What it does:

- Tries to match the selected song against online catalog data
- Pulls candidate values for:
  - display title
  - artist
  - album
  - cover art
  - synced lyrics when available
- Shows the fetched result as a temporary preview first
- Requires an explicit save step before the database is updated

How the workflow behaves:

1. Click `Auto Fetch` from either the editor drawer or immersive playback view.
2. A blocking loading overlay appears with the dragon animation and stage text so the current fetch cannot be interrupted by accidental edits.
3. The app requests a preview from the server instead of saving immediately.
4. If a usable match is found, the UI shows the fetched metadata as a temporary preview.
5. You can then choose:
   - `Save Fetched` to write the fetched values into `data/player.db`
   - `Abandon` to discard the fetched result and restore the original local values

Current online sources:

- iTunes Search for title, artist, album, and cover candidates
- LRCLIB for plain lyrics and synced timestamped lyrics

This preview-first workflow is intentionally conservative so incorrect matches can be rejected before they touch your local metadata.

## KTV Mode

KTV mode opens from the `KTV` tab as a full-stage singing view, similar to immersive playback. A song is eligible only when its saved lyrics look complete; timestamped synced lyrics are preferred, but long plain lyrics are accepted for rehearsal mode.

KTV data is stored under `data/ktv/`:

- `data/ktv/stems/` for generated vocal/accompaniment/background assets
- `data/ktv/stems/song-*/reference-pitch.json` for extracted pitch guide lines
- `data/ktv/recordings/` for singing recordings and score JSON
- `data/player.db` for KTV asset and session metadata

The default pipeline is intentionally local and dependency-light:

- separation: ffmpeg center-vocal guide stems encoded as compact MP3 assets
- alignment: saved synced lyrics, or even line spacing for plain lyrics
- pitch guide: ffmpeg PCM decode plus autocorrelation against the separated vocal guide, filtered to singable lyric phrases
- scoring: ffmpeg duration/volume heuristic plus recording pitch comparison when a guide is available

Singing workflow:

1. Select a lyrics-ready song.
2. Click `Prepare stems` and wait for accompaniment plus pitch guide generation.
3. Click `Start singing`.
4. Watch the source pitch guide line and your real-time vocal pitch line while reading lyrics.
5. Click `Stop & preview` to listen locally without saving.
6. Keep the suggested name or enter a custom name, then click `Save & score`.
7. Use `Discard` if you do not want to save that take.

For production-quality KTV scoring, configure pretrained model commands. The server passes file paths through environment variables and expects the commands to write output files into the provided paths.

```bash
npm run start:ktv-models
```

The bundled pretrained path uses:

- `scripts/separate_with_mlx_roformer.py` with Hugging Face `mlx-community/mel-roformer-zfturbo-vocals-v1-mlx`
- `scripts/extract_pitch_with_mlx_rmvpe.py` with Hugging Face `lexandstuff/mlx-rmvpe`

To install that local model environment on Apple Silicon:

```bash
/opt/homebrew/bin/python3.11 -m venv .venv-ktv
. .venv-ktv/bin/activate
python -m pip install -r requirements-ktv.txt
```

You can still override commands explicitly:

```bash
KTV_SEPARATOR_COMMAND='.venv-ktv/bin/python scripts/separate_with_mlx_roformer.py'
KTV_SEPARATOR_MODEL='mlx Mel-RoFormer vocal separation'

KTV_ALIGNMENT_COMMAND='python scripts/align_with_whisperx_or_openai.py'
KTV_ALIGNMENT_MODEL='WhisperX large-v3 alignment'

KTV_PITCH_COMMAND='.venv-ktv/bin/python scripts/extract_pitch_with_mlx_rmvpe.py'
KTV_PITCH_MODEL='MLX-RMVPE source melody extraction'

KTV_SCORING_COMMAND='python scripts/score_with_rmvpe.py'
KTV_SCORING_MODEL='RMVPE pitch scoring'
```

Command environment:

- `KTV_INPUT`: source song path for separation/alignment
- `KTV_OUTPUT_DIR`: directory where stem/alignment outputs should be written
- `KTV_LYRICS_PATH`: saved lyrics file for alignment
- `KTV_ALIGNMENT_PATH`: expected alignment JSON path
- `KTV_VOCALS_PATH`: separated vocal stem path for pitch extraction
- `KTV_REFERENCE_PITCH_PATH`: expected source pitch guide JSON path
- `KTV_RECORDING_PATH`: browser recording path for scoring
- `KTV_SCORE_PATH`: expected scoring JSON path

Recommended model targets:

- Hugging Face `AEmotionStudio/roformer-models`, `xycld/BS-RoFormer-ONNX`, or MLX Mel-Band RoFormer vocal checkpoints for vocal and accompaniment separation
- WhisperX or OpenAI `gpt-4o-transcribe` family for transcription and alignment review
- Hugging Face `lexandstuff/mlx-rmvpe` or RMVPE-compatible extractors for singing F0 extraction and melody scoring

## Notes

- Source media is read from `source/`
- Song metadata and playlists are stored in `data/player.db`
- Uploaded cover images are stored in `data/covers/`
- If you rename a song inside the app, the real file in `source/` is renamed too
- New files dropped into `source/` can be picked up by refreshing the page or clicking `Rescan Source`

## Project Structure

```text
78DLCPlayer/
|-- data/
|   |-- covers/
|   `-- player.db
|-- public/
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- source/
|-- package.json
|-- README.md
`-- server.js
```
