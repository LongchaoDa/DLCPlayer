const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const REPO_ROOT = path.resolve(__dirname, "..");
const SONG_FIXTURE = path.join(REPO_ROOT, "utils", "april-encounter.mp3");

test("API returns full multi-playlist membership for each song", { timeout: 30000 }, async (t) => {
  const app = await startTestApp();
  t.after(() => app.cleanup());

  const initialState = await requestJson(app, "/api/state");
  assert.equal(initialState.songs.length, 1);
  assert.equal(initialState.playlists.length, 0);

  const songId = initialState.songs[0].id;
  const alphaId = await createPlaylist(app, "Alpha");
  const betaId = await createPlaylist(app, "Beta");

  await addSongToPlaylist(app, alphaId, songId);
  await addSongToPlaylist(app, betaId, songId);
  await addSongToPlaylist(app, alphaId, songId);

  const state = await requestJson(app, "/api/state");
  const song = state.songs.find((entry) => entry.id === songId);
  const alpha = state.playlists.find((playlist) => playlist.id === alphaId);
  const beta = state.playlists.find((playlist) => playlist.id === betaId);

  assert.ok(song);
  assert.deepEqual(
    song.playlists.map((playlist) => playlist.name),
    ["Alpha", "Beta"],
  );
  assert.deepEqual(song.playlistIds, [alphaId, betaId]);
  assert.equal(alpha.songCount, 1);
  assert.equal(beta.songCount, 1);
  assert.deepEqual(alpha.songIds, [songId]);
  assert.deepEqual(beta.songIds, [songId]);

  const songResponse = await requestJson(app, `/api/songs/${songId}`);
  assert.deepEqual(
    songResponse.song.playlists.map((playlist) => playlist.name),
    ["Alpha", "Beta"],
  );

  await requestJson(app, `/api/playlists/${alphaId}/songs/${songId}`, { method: "DELETE" });

  const afterRemoval = await requestJson(app, "/api/state");
  const updatedSong = afterRemoval.songs.find((entry) => entry.id === songId);
  assert.deepEqual(
    updatedSong.playlists.map((playlist) => playlist.name),
    ["Beta"],
  );
});

test("editor shows every collected playlist and keeps add/remove state consistent", { timeout: 45000 }, async (t) => {
  const app = await startTestApp();
  let browser;

  t.after(async () => {
    await browser?.close();
    await app.cleanup();
  });

  const initialState = await requestJson(app, "/api/state");
  const songId = initialState.songs[0].id;
  const alphaId = await createPlaylist(app, "Alpha");
  const betaId = await createPlaylist(app, "Beta");

  await addSongToPlaylist(app, alphaId, songId);

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(app.baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#song-table-body tr[data-song-id]").first().waitFor();
  await page.click("#focus-editor-button");
  await page.locator("#editor-panel.is-open").waitFor();

  await waitForMembershipNames(page, ["Alpha"]);

  await page.selectOption("#playlist-select", { label: "Beta" });
  await page.click("#add-to-playlist-button");

  await waitForMembershipNames(page, ["Alpha", "Beta"]);
  assert.equal(await page.locator("#playlist-select").isDisabled(), true);
  assert.equal(
    await page.locator("#playlist-select option").first().textContent(),
    "Already in all playlists",
  );

  await page.click(`[data-remove-playlist-id="${alphaId}"]`);

  await waitForMembershipNames(page, ["Beta"]);
  assert.equal(await page.locator("#playlist-select").isDisabled(), false);

  const optionLabels = await page.locator("#playlist-select option").evaluateAll((nodes) =>
    nodes.map((node) => node.textContent.trim()),
  );
  assert.ok(optionLabels.includes("Alpha"));
  assert.equal(optionLabels[0], "Select");
});

test("editor still shows full playlist membership when song payload omits embedded playlist fields", { timeout: 45000 }, async (t) => {
  const app = await startTestApp();
  let browser;

  t.after(async () => {
    await browser?.close();
    await app.cleanup();
  });

  const initialState = await requestJson(app, "/api/state");
  const songId = initialState.songs[0].id;
  const alphaId = await createPlaylist(app, "Alpha");
  const betaId = await createPlaylist(app, "Beta");
  await addSongToPlaylist(app, alphaId, songId);
  await addSongToPlaylist(app, betaId, songId);

  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.route(`${app.baseUrl}/api/state`, async (route) => {
    const response = await route.fetch();
    const payload = await response.json();
    payload.songs = payload.songs.map((song) => ({
      ...song,
      playlists: [],
      playlistIds: [],
    }));

    await route.fulfill({
      response,
      contentType: "application/json",
      body: JSON.stringify(payload),
    });
  });

  await page.goto(app.baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("#song-table-body tr[data-song-id]").first().waitFor();
  await page.click("#focus-editor-button");
  await page.locator("#editor-panel.is-open").waitFor();

  await waitForMembershipNames(page, ["Alpha", "Beta"]);
});

async function startTestApp() {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "78dlcplayer-test-"));
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

    const onExit = (code, signal) => {
      if (settled) {
        return;
      }

      cleanup();
      reject(
        new Error(`Server exited before startup completed (code: ${code}, signal: ${signal}).\nSTDERR:\n${stderr}`),
      );
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
  if (child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  await Promise.race([
    onceExit(child),
    new Promise((resolve) => {
      setTimeout(() => {
        if (child.exitCode === null) {
          child.kill("SIGKILL");
        }
        resolve();
      }, 3000);
    }),
  ]);
}

function onceExit(child) {
  return new Promise((resolve) => {
    child.once("exit", () => resolve());
  });
}

async function requestJson(app, pathname, { method = "GET", body } = {}) {
  const response = await fetch(new URL(pathname, app.baseUrl), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}.`);
  }

  return payload;
}

async function createPlaylist(app, name) {
  const state = await requestJson(app, "/api/playlists", {
    method: "POST",
    body: { name },
  });
  const playlist = state.playlists.find((entry) => entry.name === name);
  assert.ok(playlist, `Missing playlist ${name}`);
  return playlist.id;
}

async function addSongToPlaylist(app, playlistId, songId) {
  return requestJson(app, `/api/playlists/${playlistId}/songs`, {
    method: "POST",
    body: { songId },
  });
}

async function waitForMembershipNames(page, expectedNames) {
  await page.waitForFunction((expected) => {
    const names = [...document.querySelectorAll(".playlist-membership-name")].map((node) =>
      node.textContent.trim(),
    );
    return JSON.stringify(names) === JSON.stringify(expected);
  }, expectedNames);
}
