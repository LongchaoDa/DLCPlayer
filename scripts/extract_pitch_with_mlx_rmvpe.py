#!/usr/bin/env python3
"""Extract a KTV reference pitch guide from a vocal stem using MLX-RMVPE."""

from __future__ import annotations

import json
import math
import os
from pathlib import Path
from typing import Any

import librosa
import numpy as np
from mlx_rmvpe import RMVPE


SAMPLE_RATE = 16000
FPS = 100
NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


def main() -> None:
    input_path = Path(os.environ.get("KTV_VOCALS_PATH") or require_env("KTV_INPUT"))
    output_path = Path(os.environ.get("KTV_REFERENCE_PITCH_PATH") or os.environ.get("KTV_PITCH_PATH") or "")
    if not output_path:
        raise SystemExit("KTV_REFERENCE_PITCH_PATH or KTV_PITCH_PATH is required")

    max_seconds = parse_float(os.environ.get("KTV_MAX_AUDIO_SECONDS"))
    alignment = load_alignment()
    audio, _ = librosa.load(input_path, sr=SAMPLE_RATE, mono=True, duration=max_seconds)

    model = RMVPE.from_pretrained()
    f0 = np.asarray(model.infer_from_audio(audio), dtype=np.float32)
    raw_points = f0_to_points(f0)
    points = filter_points_to_singable_lines(raw_points, alignment)
    duration = alignment.get("duration") or round(len(audio) / SAMPLE_RATE, 3)

    guide = {
        "version": 1,
        "source": "rmvpe-vocal-stem",
        "extractor": "mlx-rmvpe",
        "model": os.environ.get("KTV_PITCH_MODEL_ID", "lexandstuff/mlx-rmvpe"),
        "duration": duration,
        "alignment": alignment,
        "sampleRate": SAMPLE_RATE,
        "hopSeconds": 1 / FPS,
        "pointCount": len(points),
        "points": points,
        "quality": {
            "label": "usable" if len(points) >= 24 else "sparse" if points else "empty",
            "rawPointCount": len(raw_points),
            "singableLineCount": len(get_singable_intervals(alignment)),
            "voicedRatio": round(len(points) / max(1, len(f0)), 3),
            "warnings": [] if len(points) >= 8 else ["Very little stable vocal pitch was detected."],
        },
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(guide, indent=2), encoding="utf-8")


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


def load_alignment() -> dict[str, Any]:
    alignment_json = os.environ.get("KTV_ALIGNMENT_JSON")
    if alignment_json:
        return json.loads(alignment_json)

    alignment_path = os.environ.get("KTV_ALIGNMENT_PATH")
    if alignment_path and Path(alignment_path).exists():
        return json.loads(Path(alignment_path).read_text(encoding="utf-8"))

    return {"lines": []}


def f0_to_points(f0: np.ndarray) -> list[dict[str, Any]]:
    points: list[dict[str, Any]] = []
    for index, frequency in enumerate(f0):
        frequency = float(frequency)
        if not math.isfinite(frequency) or frequency <= 0:
            continue

        midi = frequency_to_midi(frequency)
        points.append(
            {
                "time": round(index / FPS, 2),
                "frequency": round(frequency, 2),
                "midi": round(midi, 3),
                "note": midi_to_note_name(midi),
            }
        )

    return smooth_points(points)


def smooth_points(points: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if len(points) < 3:
        return points

    filtered: list[dict[str, Any]] = []
    for index, point in enumerate(points):
        previous = points[index - 1] if index > 0 else None
        next_point = points[index + 1] if index < len(points) - 1 else None
        if not previous or not next_point:
            filtered.append(point)
            continue

        jump_in = abs(point["midi"] - previous["midi"])
        jump_out = abs(point["midi"] - next_point["midi"])
        neighbors_close = abs(previous["midi"] - next_point["midi"]) < 1.5
        if not (neighbors_close and jump_in > 7 and jump_out > 7):
            filtered.append(point)

    return filtered


def filter_points_to_singable_lines(points: list[dict[str, Any]], alignment: dict[str, Any]) -> list[dict[str, Any]]:
    intervals = get_singable_intervals(alignment)
    if not intervals:
        return points

    return [
        point
        for point in points
        if any(interval["start"] <= point["time"] <= interval["end"] for interval in intervals)
    ]


def get_singable_intervals(alignment: dict[str, Any]) -> list[dict[str, float]]:
    intervals = []
    for line in alignment.get("lines") or []:
        if not is_singable_line(line.get("text", "")):
            continue
        try:
            start = max(0.0, float(line["start"]) - 0.15)
            end = max(start, float(line["end"]) + 0.2)
        except (KeyError, TypeError, ValueError):
            continue
        intervals.append({"start": start, "end": end})
    return intervals


def is_singable_line(text: str) -> bool:
    normalized = " ".join(str(text or "").strip().lower().split())
    if len(normalized.replace(" ", "")) < 3:
        return False

    credit_markers = (
        "title",
        "artist",
        "album",
        "composer",
        "composed by",
        "written by",
        "lyrics by",
        "作词",
        "作曲",
        "编曲",
        "歌手",
        "歌曲",
        "专辑",
    )
    return not any(marker in normalized for marker in credit_markers)


def frequency_to_midi(frequency: float) -> float:
    return 12 * math.log2(frequency / 440.0) + 69


def midi_to_note_name(midi: float) -> str:
    note_number = round(midi)
    octave = note_number // 12 - 1
    return f"{NOTE_NAMES[note_number % 12]}{octave}"


if __name__ == "__main__":
    main()
