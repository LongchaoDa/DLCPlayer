const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawn } = require("node:child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const SONG_FIXTURE = path.join(REPO_ROOT, "utils", "april-encounter.mp3");
const COMPLETE_LYRICS = [
  "[00:00.00]First line of a complete rehearsal lyric for the KTV scoring gate",
  "[00:02.00]Second line keeps enough words for a realistic singing phrase",
  "[00:04.00]Third line gives the alignment stage another timed checkpoint",
  "[00:06.00]Fourth line closes the verse and confirms this is not a placeholder",
].join("\n");

test(
  "pretrained KTV pipeline prepares RoFormer stems and RMVPE pitch guide",
  {
    timeout: 120000,
    skip:
      process.env.RUN_KTV_MODEL_TESTS !== "1" ||
      !(process.env.KTV_PYTHON || "").includes(".venv-ktv"),
  },
  async (t) => {
    const app = await startTestApp();
    t.after(() => app.cleanup());

    const initialState = await requestJson(app, "/api/state");
    const songId = initialState.songs[0].id;
    await requestJson(app, `/api/songs/${songId}`, {
      method: "PATCH",
      body: JSON.stringify({ lyrics: COMPLETE_LYRICS }),
    });

    await requestJson(app, `/api/ktv/songs/${songId}/prepare`, { method: "POST" });
    const preparedState = await pollFor(
      async () => {
        const state = await requestJson(app, "/api/state");
        const asset = state.ktv.assetsBySongId[songId];
        return asset?.status === "complete" || asset?.status === "failed" ? state : null;
      },
      { timeout: 100000, message: "Pretrained KTV preparation did not finish." },
    );

    const asset = preparedState.ktv.assetsBySongId[songId];
    assert.equal(asset.status, "complete", asset.errorMessage);
    assert.match(asset.modelReport.separator.model, /Mel-RoFormer|mlx/i);
    assert.match(asset.modelReport.pitch.model, /RMVPE/i);
    assert.ok(asset.modelReport.alignment.model || asset.modelReport.alignment.fallbackFrom);

    const guide = await requestJson(app, asset.referencePitchUrl);
    assert.equal(guide.extractor, "mlx-rmvpe");
    assert.ok(guide.pointCount > 0);
    assert.ok(guide.quality.rawPointCount >= guide.pointCount);
    assert.ok(["vocal-asr-lyric-match", "synced-lyrics", "plain-lyrics-even-spacing"].includes(guide.alignment.source));
  },
);

async function startTestApp() {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "78dlcplayer-ktv-model-test-"));
  const sourceDir = path.join(rootDir, "source");
  const dataDir = path.join(rootDir, "data");

  await fs.mkdir(sourceDir, { recursive: true });
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
      if (match && !settled) {
        cleanup();
        resolve(match[1]);
      }
    };
    const onStderr = (chunk) => {
      stderr += chunk.toString();
    };
    const onExit = (code) => {
      if (!settled) {
        cleanup();
        reject(new Error(`Server exited with code ${code}.\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`));
      }
    };
    const onError = (error) => {
      if (!settled) {
        cleanup();
        reject(error);
      }
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
  const response = await fetch(`${app.baseUrl}${pathname}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  return payload;
}

async function pollFor(callback, { timeout, interval = 800, message }) {
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
