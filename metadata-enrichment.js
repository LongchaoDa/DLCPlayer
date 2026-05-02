const fs = require("node:fs");
const path = require("node:path");

async function fetchSongMetadata(song, { coverDir = "", downloadCover = false } = {}) {
  const iTunesMatch = await searchITunes(song);
  const lyricMatch = await searchLyrics(song, iTunesMatch);
  const nextValues = {
    displayTitle: song.display_title,
    artist: song.artist,
    album: song.album,
    notes: song.notes,
    lyrics: song.lyrics,
    coverPath: song.cover_path,
  };
  const sources = [];
  const updatedFields = [];
  let coverSourceUrl = "";

  if (iTunesMatch) {
    sources.push("iTunes");

    if (iTunesMatch.trackName && shouldReplaceShortText(song.display_title, song.file_stem)) {
      nextValues.displayTitle = iTunesMatch.trackName;
      updatedFields.push("title");
    }

    if (iTunesMatch.artistName && shouldReplaceShortText(song.artist, "")) {
      nextValues.artist = iTunesMatch.artistName;
      updatedFields.push("artist");
    }

    if (iTunesMatch.collectionName && shouldReplaceShortText(song.album, "")) {
      nextValues.album = iTunesMatch.collectionName;
      updatedFields.push("album");
    }

    if (iTunesMatch.artworkUrl100 && !song.cover_path) {
      coverSourceUrl = buildHighResolutionArtworkUrl(iTunesMatch.artworkUrl100);
      if (downloadCover && coverDir) {
        const coverPath = await storeRemoteCover(song.id, coverSourceUrl, coverDir);
        if (coverPath) {
          nextValues.coverPath = coverPath;
          updatedFields.push("cover");
        }
      } else {
        updatedFields.push("cover");
      }
    }
  }

  if (lyricMatch) {
    sources.push("LRCLIB");

    if (lyricMatch.syncedLyrics && !hasTimedLyrics(song.lyrics)) {
      nextValues.lyrics = lyricMatch.syncedLyrics;
      updatedFields.push("synced lyrics");
    } else if (lyricMatch.plainLyrics && !song.lyrics.trim()) {
      nextValues.lyrics = lyricMatch.plainLyrics;
      updatedFields.push("lyrics");
    }

    if (lyricMatch.artistName && shouldReplaceShortText(nextValues.artist, "")) {
      nextValues.artist = lyricMatch.artistName;
      updatedFields.push("artist");
    }

    if (lyricMatch.albumName && shouldReplaceShortText(nextValues.album, "")) {
      nextValues.album = lyricMatch.albumName;
      updatedFields.push("album");
    }
  }

  return {
    updated: updatedFields.length > 0,
    fields: [...new Set(updatedFields)],
    sources: [...new Set(sources)],
    coverSourceUrl,
    values: nextValues,
  };
}

async function searchITunes(song) {
  const terms = buildSongSearchTerms(song);
  let bestMatch = null;
  let bestScore = 0;

  for (const term of terms) {
    const url = new URL("https://itunes.apple.com/search");
    url.searchParams.set("term", term);
    url.searchParams.set("media", "music");
    url.searchParams.set("entity", "song");
    url.searchParams.set("limit", "8");

    const payload = await fetchJsonFromUrl(url, { timeoutMs: 8000 }).catch(() => null);
    const results = Array.isArray(payload?.results) ? payload.results : [];

    for (const result of results) {
      const score = scoreOnlineSongMatch(song, {
        title: result.trackName,
        artist: result.artistName,
        album: result.collectionName,
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = result;
      }
    }

    if (bestScore >= 0.92) {
      break;
    }
  }

  return bestScore >= 0.45 ? bestMatch : null;
}

async function searchLyrics(song, iTunesMatch) {
  const candidates = [
    {
      title: iTunesMatch?.trackName || song.display_title || song.file_stem,
      artist: iTunesMatch?.artistName || song.artist,
      album: iTunesMatch?.collectionName || song.album,
    },
    {
      title: song.display_title || song.file_stem,
      artist: song.artist,
      album: song.album,
    },
    ...buildTitleArtistCandidates(song.file_stem),
  ];
  let bestMatch = null;
  let bestScore = 0;

  for (const candidate of candidates) {
    if (!candidate.title) {
      continue;
    }

    const url = new URL("https://lrclib.net/api/search");
    url.searchParams.set("track_name", candidate.title);
    if (candidate.artist) {
      url.searchParams.set("artist_name", candidate.artist);
    }
    if (candidate.album) {
      url.searchParams.set("album_name", candidate.album);
    }

    const results = await fetchJsonFromUrl(url, { timeoutMs: 10000 }).catch(() => []);
    if (!Array.isArray(results)) {
      continue;
    }

    for (const result of results) {
      const score = scoreOnlineSongMatch(song, {
        title: result.trackName,
        artist: result.artistName,
        album: result.albumName,
      });
      const lyricBoost = result.syncedLyrics ? 0.18 : result.plainLyrics ? 0.08 : 0;
      const totalScore = score + lyricBoost;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestMatch = result;
      }
    }

    if (bestScore >= 1) {
      break;
    }
  }

  return bestScore >= 0.42 ? bestMatch : null;
}

async function fetchJsonFromUrl(url, { timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "78DLCPlayer/1.0 local metadata enrichment",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function storeRemoteCover(songId, artworkUrl, coverDir) {
  const highResUrl = buildHighResolutionArtworkUrl(artworkUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(highResUrl, { signal: controller.signal });
    if (!response.ok) {
      return "";
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return "";
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length || buffer.length > 8 * 1024 * 1024) {
      return "";
    }

    const extension = inferImageExtension(highResUrl, contentType);
    const storedFileName = `song-${songId}-online-${Date.now()}${extension}`;
    fs.writeFileSync(path.join(coverDir, storedFileName), buffer);
    return storedFileName;
  } catch (_error) {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

function buildHighResolutionArtworkUrl(artworkUrl) {
  return String(artworkUrl || "").replace(/\/\d+x\d+bb\.(jpg|png|webp)$/i, "/600x600bb.$1");
}

function buildSongSearchTerms(song) {
  const candidates = [
    [song.artist, song.display_title].filter(Boolean).join(" "),
    song.display_title,
    song.file_stem,
    ...buildTitleArtistCandidates(song.file_stem).map((candidate) =>
      [candidate.artist, candidate.title].filter(Boolean).join(" "),
    ),
  ];
  return [...new Set(candidates.map(cleanSearchTerm).filter(Boolean))].slice(0, 5);
}

function buildTitleArtistCandidates(fileStem) {
  const normalized = String(fileStem || "").trim();
  const candidates = [];

  for (const separator of [" - ", "-", "–", "—"]) {
    if (!normalized.includes(separator)) {
      continue;
    }

    const [left, ...rest] = normalized.split(separator);
    const right = rest.join(separator);
    if (left.trim() && right.trim()) {
      candidates.push({ title: left.trim(), artist: right.trim(), album: "" });
      candidates.push({ title: right.trim(), artist: left.trim(), album: "" });
    }
  }

  return candidates;
}

function cleanSearchTerm(value) {
  return String(value || "")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/\([^)]*(score|official|lyrics|lyric|video)[^)]*\)/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldReplaceShortText(currentValue, fallbackValue) {
  const current = String(currentValue || "").trim();
  const fallback = String(fallbackValue || "").trim();
  return !current || current === fallback;
}

function hasTimedLyrics(lyrics) {
  return /\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/.test(String(lyrics || ""));
}

function scoreOnlineSongMatch(song, candidate) {
  const currentTitle = normalizeMatchText(song.display_title || song.file_stem);
  const fileTitle = normalizeMatchText(song.file_stem);
  const candidateTitle = normalizeMatchText(candidate.title);
  const currentArtist = normalizeMatchText(song.artist);
  const candidateArtist = normalizeMatchText(candidate.artist);

  if (!candidateTitle) {
    return 0;
  }

  const titleScore = Math.max(
    tokenOverlapScore(currentTitle, candidateTitle),
    tokenOverlapScore(fileTitle, candidateTitle),
    currentTitle.includes(candidateTitle) || candidateTitle.includes(currentTitle) ? 0.86 : 0,
    fileTitle.includes(candidateTitle) || candidateTitle.includes(fileTitle) ? 0.82 : 0,
  );
  const artistScore =
    currentArtist && candidateArtist
      ? Math.max(
          tokenOverlapScore(currentArtist, candidateArtist),
          currentArtist.includes(candidateArtist) || candidateArtist.includes(currentArtist) ? 0.9 : 0,
        )
      : 0.2;

  return titleScore * 0.78 + artistScore * 0.22;
}

function normalizeMatchText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function tokenOverlapScore(left, right) {
  if (!left || !right) {
    return 0;
  }

  if (left === right) {
    return 1;
  }

  const leftTokens = new Set(left.split(" ").filter(Boolean));
  const rightTokens = new Set(right.split(" ").filter(Boolean));
  if (!leftTokens.size || !rightTokens.size) {
    return 0;
  }

  let overlap = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      overlap += 1;
    }
  }

  return overlap / Math.max(leftTokens.size, rightTokens.size);
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

module.exports = {
  fetchSongMetadata,
  storeRemoteCover,
};
