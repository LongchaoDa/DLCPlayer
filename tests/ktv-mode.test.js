const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const REPO_ROOT = path.resolve(__dirname, "..");
const SONG_FIXTURE = path.join(REPO_ROOT, "utils", "april-encounter.mp3");
const COMPLETE_LYRICS = [
  "[00:00.00]First line of a complete rehearsal lyric for the KTV scoring gate",
  "[00:04.00]Second line keeps enough words for a realistic singing phrase",
  "[00:08.00]Third line gives the alignment stage another timed checkpoint",
  "[00:12.00]Fourth line closes the verse and confirms this is not a placeholder",
].join("\n");

test("KTV API enforces complete lyrics, prepares assets, and scores a recording", { timeout: 60000 }, async (t) => {
  const app = await startTestApp();
  t.after(() => app.cleanup());

  const initialState = await requestJson(app, "/api/state");
  const songId = initialState.songs[0].id;
  assert.equal(initialState.songs[0].ktvReadiness.ready, false);

  await assert.rejects(
    () => requestJson(app, `/api/ktv/songs/${songId}/prepare`, { method: "POST" }),
    /complete lyrics/i,
  );

  const withLyrics = await requestJson(app, `/api/songs/${songId}`, {
    method: "PATCH",
    body: JSON.stringify({ lyrics: COMPLETE_LYRICS }),
  });
  assert.equal(withLyrics.songs[0].ktvReadiness.ready, true);
  assert.equal(withLyrics.songs[0].ktvReadiness.level, "synced");

  await assert.rejects(
    () =>
      requestJson(app, "/api/ktv/sessions", {
        method: "POST",
        body: JSON.stringify({ songId }),
      }),
    /accompaniment and pitch guide are not ready/i,
  );

  await requestJson(app, `/api/ktv/songs/${songId}/prepare`, { method: "POST" });
  const preparedState = await pollFor(
    async () => {
      const state = await requestJson(app, "/api/state");
      const asset = state.ktv.assetsBySongId[songId];
      return asset?.status === "complete" || asset?.status === "failed" ? state : null;
    },
    { timeout: 45000, message: "KTV preparation did not finish." },
  );

  const asset = preparedState.ktv.assetsBySongId[songId];
  assert.equal(asset.status, "complete", asset.errorMessage);
  assert.match(asset.accompanimentUrl, /\/api\/ktv\/songs\/\d+\/assets\/accompaniment/);
  assert.match(asset.referencePitchUrl, /\/api\/ktv\/songs\/\d+\/pitch-guide/);
  assert.match(asset.modelReport.separator.model, /center-vocal guide/);

  const pitchGuide = await requestJson(app, asset.referencePitchUrl);
  assert.equal(pitchGuide.version, 1);
  assert.ok(Array.isArray(pitchGuide.points));
  assert.ok(pitchGuide.quality.rawPointCount >= pitchGuide.pointCount);
  assert.ok(pitchGuide.quality.singableLineCount >= 4);

  const stemResponse = await fetch(`${app.baseUrl}${asset.accompanimentUrl}`);
  assert.equal(stemResponse.status, 200);
  assert.match(stemResponse.headers.get("content-type") || "", /audio\/mpeg|audio\/wav|application\/octet-stream/);

  const sessionPayload = await requestJson(app, "/api/ktv/sessions", {
    method: "POST",
    body: JSON.stringify({ songId }),
  });
  assert.equal(sessionPayload.session.status, "created");

  const recording = await fs.readFile(SONG_FIXTURE);
  const scoredPayload = await requestJson(app, `/api/ktv/sessions/${sessionPayload.session.id}/recording?name=Custom%20Sing%20Take`, {
    method: "POST",
    headers: { "Content-Type": "audio/mpeg" },
    body: recording,
  });
  assert.equal(scoredPayload.session.status, "complete", scoredPayload.session.errorMessage);
  assert.equal(scoredPayload.session.recordingName, "Custom Sing Take");
  assert.match(scoredPayload.session.recordingPath, /Custom Sing Take\.mp3$/);
  assert.ok(scoredPayload.session.overallScore >= 0);
  assert.ok(scoredPayload.session.overallScore <= 100);
  assert.equal(scoredPayload.state.ktv.latestSessionsBySongId[songId].id, sessionPayload.session.id);
});

test("KTV API can generate timestamped lyrics from ASR alignment before preparing", { timeout: 60000 }, async (t) => {
  const alignmentFixture = path.join(REPO_ROOT, "tests", "fixtures", "ktv-generated-alignment.js");
  const app = await startTestApp({
    KTV_ALIGNMENT_COMMAND: `"${process.execPath}" "${alignmentFixture}"`,
  });
  t.after(() => app.cleanup());

  const initialState = await requestJson(app, "/api/state");
  const songId = initialState.songs[0].id;
  assert.equal(initialState.songs[0].ktvReadiness.ready, false);
  assert.equal(initialState.ktv.config.automaticLyricExtraction, true);

  await assert.rejects(
    () =>
      requestJson(app, `/api/ktv/songs/${songId}/prepare`, {
        method: "POST",
        body: JSON.stringify({ lyricMode: "default" }),
      }),
    /complete lyrics/i,
  );

  await requestJson(app, `/api/ktv/songs/${songId}/prepare`, {
    method: "POST",
    body: JSON.stringify({ lyricMode: "extract" }),
  });
  const preparedState = await pollFor(
    async () => {
      const state = await requestJson(app, "/api/state");
      const asset = state.ktv.assetsBySongId[songId];
      return asset?.status === "complete" || asset?.status === "failed" ? state : null;
    },
    { timeout: 45000, message: "KTV generated lyric preparation did not finish." },
  );

  const song = preparedState.songs.find((candidate) => candidate.id === songId);
  const asset = preparedState.ktv.assetsBySongId[songId];
  assert.equal(asset.status, "complete", asset.errorMessage);
  assert.equal(song.ktvReadiness.ready, false);
  assert.equal(song.lyrics, "");
  assert.equal(asset.modelReport.lyrics.mode, "extract");
  assert.equal(asset.modelReport.alignment.source, "vocal-asr-generated-lyrics");
  assert.equal(asset.modelReport.alignment.generatedLyricsAvailable, true);
  assert.equal(asset.modelReport.alignment.generatedLyricsSaved, false);
  assert.equal(asset.modelReport.alignment.preservedDefaultLyrics, true);

  const alignment = await requestJson(app, asset.alignmentUrl);
  assert.equal(alignment.source, "vocal-asr-generated-lyrics");
  assert.match(alignment.generatedLyrics, /\[00:00\.00\]Generated first lyric line/);
  assert.equal(alignment.generatedLyricsAvailable, true);
  assert.equal(alignment.generatedLyricsSaved, false);
  assert.equal(alignment.lines.length, 4);

  const sessionPayload = await requestJson(app, "/api/ktv/sessions", {
    method: "POST",
    body: JSON.stringify({ songId, lyricMode: "extract" }),
  });
  assert.equal(sessionPayload.session.status, "created");
});

test("KTV panel blocks songs without complete lyrics and enables prepared workflows after metadata update", { timeout: 45000 }, async (t) => {
  const app = await startTestApp();
  let browser;

  t.after(async () => {
    await browser?.close();
    await app.cleanup();
  });

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(app.baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#song-table-body tr[data-song-id]").first().waitFor();
  await openFirstSongKtv(page);

  assert.equal(await page.locator("#ktv-panel").evaluate((node) => node.classList.contains("is-stage-open")), true);
  await expectText(page, "#ktv-readiness-pill", /Lyrics needed/);
  assert.equal(await page.locator("#ktv-prepare-button").isDisabled(), true);
  assert.equal(await page.locator("#ktv-record-button").isDisabled(), true);

  const state = await requestJson(app, "/api/state");
  const songId = state.songs[0].id;
  await requestJson(app, `/api/songs/${songId}`, {
    method: "PATCH",
    body: JSON.stringify({ lyrics: COMPLETE_LYRICS }),
  });

  await page.click("#ktv-stage-close");
  await page.click("#refresh-button");
  await openFirstSongKtv(page);
  await expectText(page, "#ktv-readiness-pill", /Synced lyrics/);
  assert.equal(await page.locator("#ktv-prepare-button").isDisabled(), false);
  assert.equal(await page.locator("#ktv-record-button").isDisabled(), true);
});

test("KTV browser flow previews recording locally before explicit save and score", { timeout: 60000 }, async (t) => {
  const app = await startTestApp();
  let browser;

  t.after(async () => {
    await browser?.close();
    await app.cleanup();
  });

  const initialState = await requestJson(app, "/api/state");
  const songId = initialState.songs[0].id;
  await requestJson(app, `/api/songs/${songId}`, {
    method: "PATCH",
    body: JSON.stringify({ lyrics: COMPLETE_LYRICS }),
  });
  await requestJson(app, `/api/ktv/songs/${songId}/prepare`, { method: "POST" });
  await pollFor(async () => {
    const state = await requestJson(app, "/api/state");
    return state.ktv.assetsBySongId[songId]?.status === "complete" ? state : null;
  }, { timeout: 45000, message: "KTV preparation did not finish." });

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await installFakeRecordingDevices(page);
  await page.goto(app.baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#song-table-body tr[data-song-id]").first().waitFor();
  await openFirstSongKtv(page);
  assert.equal(await page.locator("#ktv-panel").evaluate((node) => node.classList.contains("is-stage-open")), true);
  await expectText(page, "#ktv-readiness-pill", /Synced lyrics/);
  assert.equal(await page.locator("#ktv-record-button").isDisabled(), false);

  await page.click("#ktv-record-button");
  await expectText(page, "#ktv-status-line", /Recording/);
  await expectText(page, "#ktv-note-label", /No pitch|In tune|Sharp|Flat/);
  await page.waitForFunction(() => {
    const referencePath = document.querySelector("#ktv-reference-pitch-path");
    const guide = document.querySelector("#ktv-pitch-guide");
    return guide && referencePath && !document.querySelector("#ktv-pitch-guide-empty:not([hidden])");
  });
  await page.click("#ktv-record-button");
  await expectText(page, "#ktv-preview-status", /Unsaved/);
  assert.equal(await page.locator("#ktv-preview-panel").isVisible(), true);
  await expectText(page, "#ktv-save-name-input", /sing/);
  await page.waitForFunction(() => {
    const audio = document.querySelector("#ktv-preview-audio");
    return audio && audio.src.startsWith("blob:") && Number.isFinite(audio.duration) && audio.duration > 0;
  });
  const previewAdvanced = await page.evaluate(async () => {
    const audio = document.querySelector("#ktv-preview-audio");
    audio.currentTime = 0;
    await audio.play();
    await new Promise((resolve) => setTimeout(resolve, 160));
    const advanced = audio.currentTime > 0;
    audio.pause();
    return advanced;
  });
  assert.equal(previewAdvanced, true);

  await page.fill("#ktv-save-name-input", "Browser Custom Take");
  await page.click("#ktv-save-recording-button");
  await expectText(page, "#ktv-score-body", /Score/);

  const stateAfterSave = await requestJson(app, "/api/state");
  const latestSession = stateAfterSave.ktv.latestSessionsBySongId[songId];
  assert.equal(latestSession.status, "complete", latestSession.errorMessage);
  assert.equal(latestSession.recordingName, "Browser Custom Take");
});

async function startTestApp(extraEnv = {}) {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "78dlcplayer-ktv-test-"));
  const sourceDir = path.join(rootDir, "source");
  const dataDir = path.join(rootDir, "data");
  const coversDir = path.join(dataDir, "covers");

  await fs.mkdir(sourceDir, { recursive: true });
  await fs.mkdir(coversDir, { recursive: true });
  await fs.copyFile(SONG_FIXTURE, path.join(sourceDir, "fixture-song.mp3"));

  const child = spawn(process.execPath, ["server.js"], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      PORT: "0",
      PLAYER_SOURCE_DIR: sourceDir,
      PLAYER_DATA_DIR: dataDir,
      PLAYER_DISABLE_WATCHER: "1",
      ...extraEnv,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let baseUrl;
  try {
    baseUrl = await waitForServerStart(child);
  } catch (error) {
    await stopChildProcess(child);
    await fs.rm(rootDir, { recursive: true, force: true });
    throw error;
  }

  return {
    child,
    baseUrl,
    async cleanup() {
      await stopChildProcess(child);
      await fs.rm(rootDir, { recursive: true, force: true });
    },
  };
}

function waitForServerStart(child) {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    let settled = false;

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Server start timed out.\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`));
    }, 10000);

    const cleanup = () => {
      settled = true;
      clearTimeout(timeout);
      child.stdout.off("data", onStdout);
      child.stderr.off("data", onStderr);
      child.off("exit", onExit);
      child.off("error", onError);
    };

    const onStdout = (chunk) => {
      stdout += chunk.toString();
      const match = stdout.match(/78DLC Player running at (http:\/\/[^\s]+)/);
      if (!match || settled) {
        return;
      }

      cleanup();
      resolve(match[1]);
    };

    const onStderr = (chunk) => {
      stderr += chunk.toString();
    };

    const onExit = (code) => {
      if (settled) {
        return;
      }

      cleanup();
      reject(new Error(`Server exited early with code ${code}.\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`));
    };

    const onError = (error) => {
      if (settled) {
        return;
      }

      cleanup();
      reject(error);
    };

    child.stdout.on("data", onStdout);
    child.stderr.on("data", onStderr);
    child.on("exit", onExit);
    child.on("error", onError);
  });
}

async function stopChildProcess(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve();
    }, 2000);

    child.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function requestJson(app, pathname, options = {}) {
  const headers = {
    ...(options.body && !(options.body instanceof Buffer) ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(`${app.baseUrl}${pathname}`, {
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }

  return payload;
}

async function pollFor(callback, { timeout, interval = 500, message }) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeout) {
    const result = await callback();
    if (result) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(message);
}

async function installFakeRecordingDevices(page) {
  await page.addInitScript(() => {
    class FakeMediaRecorder {
      static isTypeSupported(type) {
        return type === "audio/wav";
      }

      constructor(_stream, options = {}) {
        this.mimeType = options.mimeType || "audio/wav";
        this.state = "inactive";
        this.listeners = {};
      }

      addEventListener(type, callback) {
        this.listeners[type] = this.listeners[type] || [];
        this.listeners[type].push(callback);
      }

      start() {
        this.state = "recording";
      }

      stop() {
        this.state = "inactive";
        const blob = createToneWavBlob();
        for (const callback of this.listeners.dataavailable || []) {
          callback({ data: blob });
        }
        for (const callback of this.listeners.stop || []) {
          callback();
        }
      }
    }

    function createToneWavBlob() {
      const sampleRate = 8000;
      const durationSeconds = 0.45;
      const sampleCount = Math.floor(sampleRate * durationSeconds);
      const bytes = new ArrayBuffer(44 + sampleCount * 2);
      const view = new DataView(bytes);
      const writeString = (offset, value) => {
        for (let index = 0; index < value.length; index += 1) {
          view.setUint8(offset + index, value.charCodeAt(index));
        }
      };

      writeString(0, "RIFF");
      view.setUint32(4, 36 + sampleCount * 2, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, "data");
      view.setUint32(40, sampleCount * 2, true);

      for (let index = 0; index < sampleCount; index += 1) {
        const sample = Math.sin((2 * Math.PI * 440 * index) / sampleRate) * 0.35;
        view.setInt16(44 + index * 2, sample * 32767, true);
      }

      return new Blob([bytes], { type: "audio/wav" });
    }

    class FakeAnalyser {
      constructor() {
        this.fftSize = 2048;
        this.smoothingTimeConstant = 0;
      }

      getFloatTimeDomainData(buffer) {
        for (let index = 0; index < buffer.length; index += 1) {
          buffer[index] = Math.sin(index / 8) * 0.03;
        }
      }
    }

    class FakeAudioContext {
      constructor() {
        this.sampleRate = 44100;
      }

      async resume() {}
      async close() {}
      createAnalyser() {
        return new FakeAnalyser();
      }
      createMediaStreamSource() {
        return { connect() {}, disconnect() {} };
      }
    }

    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        async getUserMedia() {
          return {
            getTracks() {
              return [{ stop() {} }];
            },
          };
        },
      },
    });
    window.MediaRecorder = FakeMediaRecorder;
    window.AudioContext = FakeAudioContext;
    window.webkitAudioContext = FakeAudioContext;
  });
}

async function openFirstSongKtv(page) {
  await page.locator("#song-table-body tr[data-song-id]").first().locator('[data-action="open-ktv"]').click();
}

async function expectText(page, selector, pattern) {
  await page.waitForFunction(
    ({ selector: currentSelector, patternSource }) => {
      const element = document.querySelector(currentSelector);
      if (!element) {
        return false;
      }
      const value = "value" in element ? element.value : element.textContent;
      return new RegExp(patternSource).test(value || "");
    },
    { selector, patternSource: pattern.source },
  );
}
