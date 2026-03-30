# 78DLC Player

Local web music player for the files in:

`/Users/danielsmith/Documents/1-RL/ASU/research/78DLCPlayer/source`

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
- Playlist creation and song assignment
- Recent play history
- Local metadata DB stored at `data/player.db`

## Requirements

- Node.js 25 or newer

This app uses built-in Node modules only. No `npm install` step is required for the current version.

## Start The App

From this folder:

```bash
npm start
```

Or:

```bash
node server.js
```

Then open:

`http://localhost:4318`

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
