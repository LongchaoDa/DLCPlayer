#!/usr/bin/env python3
"""Separate vocals/accompaniment for KTV using an MLX Mel-RoFormer model."""

from __future__ import annotations

import json
import os
from pathlib import Path

import mlx.core as mx
import numpy as np
import soundfile as sf
from mlx_audio.sts.models.mel_roformer import MelRoFormer, MelRoFormerConfig


DEFAULT_MODEL = "mlx-community/mel-roformer-zfturbo-vocals-v1-mlx"
SAMPLE_RATE = 44100
CHUNK_SIZE = 352800
OVERLAP = CHUNK_SIZE // 2


def main() -> None:
    input_path = Path(require_env("KTV_INPUT"))
    output_dir = Path(require_env("KTV_OUTPUT_DIR"))
    model_id = os.environ.get("KTV_SEPARATOR_MODEL_ID", DEFAULT_MODEL)
    max_seconds = parse_float(os.environ.get("KTV_MAX_AUDIO_SECONDS"))
    output_dir.mkdir(parents=True, exist_ok=True)

    mixture = load_stereo_audio(input_path, max_seconds=max_seconds)
    model = MelRoFormer.from_pretrained(model_id, config=MelRoFormerConfig.zfturbo_vocals_v1())
    model.eval()

    vocals = separate_vocals(model, mixture)
    accompaniment = np.clip(mixture - vocals, -1.0, 1.0)

    vocals_path = output_dir / "vocals-roformer.wav"
    accompaniment_path = output_dir / "accompaniment-roformer.wav"
    background_path = output_dir / "background-roformer.wav"
    sf.write(vocals_path, vocals.T, SAMPLE_RATE, subtype="PCM_16")
    sf.write(accompaniment_path, accompaniment.T, SAMPLE_RATE, subtype="PCM_16")
    sf.write(background_path, accompaniment.T, SAMPLE_RATE, subtype="PCM_16")

    report = {
        "model": model_id,
        "sampleRate": SAMPLE_RATE,
        "duration": round(mixture.shape[1] / SAMPLE_RATE, 3),
        "stems": {
            "vocals": str(vocals_path),
            "accompaniment": str(accompaniment_path),
            "background": str(background_path),
        },
    }
    (output_dir / "separator-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise SystemExit(f"{name} is required")
    return value


def parse_float(value: str | None) -> float | None:
    if not value:
        return None
    try:
        parsed = float(value)
    except ValueError:
        return None
    return parsed if parsed > 0 else None


def load_stereo_audio(input_path: Path, max_seconds: float | None = None) -> np.ndarray:
    import librosa

    audio, _sample_rate = librosa.load(
        input_path,
        sr=SAMPLE_RATE,
        mono=False,
        duration=max_seconds,
    )

    if audio.ndim == 1:
        audio = np.repeat(audio[None, :], 2, axis=0)
    elif audio.shape[0] > 2:
        audio = audio[:2, :]

    if audio.shape[0] == 1:
        audio = np.repeat(audio, 2, axis=0)

    return np.ascontiguousarray(audio, dtype=np.float32)


def separate_vocals(model: MelRoFormer, mixture: np.ndarray) -> np.ndarray:
    channels, total_samples = mixture.shape
    if channels != 2:
        raise ValueError("Mel-RoFormer KTV separation expects stereo audio.")

    vocals_sum = np.zeros_like(mixture, dtype=np.float32)
    weights = np.zeros(total_samples, dtype=np.float32)
    starts = list(range(0, max(total_samples - OVERLAP, 1), OVERLAP))
    if not starts or starts[-1] + CHUNK_SIZE < total_samples:
        starts.append(max(0, total_samples - CHUNK_SIZE))

    for start in sorted(set(starts)):
        end = min(start + CHUNK_SIZE, total_samples)
        valid = end - start
        chunk = np.zeros((2, CHUNK_SIZE), dtype=np.float32)
        chunk[:, :valid] = mixture[:, start:end]

        prediction = model(mx.array(chunk[None, ...]))[0]
        mx.eval(prediction)
        predicted = np.array(prediction, dtype=np.float32)[:, :valid]
        window = make_blend_window(valid, start, end, total_samples)

        vocals_sum[:, start:end] += predicted * window[None, :]
        weights[start:end] += window

    weights = np.maximum(weights, 1e-6)
    return np.clip(vocals_sum / weights[None, :], -1.0, 1.0)


def make_blend_window(length: int, start: int, end: int, total: int) -> np.ndarray:
    if length <= 1:
        return np.ones(length, dtype=np.float32)

    window = np.ones(length, dtype=np.float32)
    fade = min(OVERLAP // 2, length // 2)
    if start > 0 and fade > 0:
        window[:fade] = np.linspace(0.0, 1.0, fade, dtype=np.float32)
    if end < total and fade > 0:
        window[-fade:] = np.linspace(1.0, 0.0, fade, dtype=np.float32)
    return window


if __name__ == "__main__":
    main()
