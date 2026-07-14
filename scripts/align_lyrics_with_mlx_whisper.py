#!/usr/bin/env python3
"""Align local lyrics to the separated original vocal using MLX Whisper ASR."""

from __future__ import annotations

import json
import os
import re
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

import mlx_whisper


DEFAULT_MODEL = "mlx-community/whisper-large-v3-turbo"
CREDIT_PATTERN = re.compile(
    r"^(title|artist|album|composer|composed by|written by|lyrics by|作词|作曲|编曲|歌手|歌曲|专辑)\b|composed by",
    re.IGNORECASE,
)


def main() -> None:
    vocals_path = Path(os.environ.get("KTV_VOCALS_PATH") or os.environ.get("KTV_INPUT") or "")
    lyrics_path = Path(require_env("KTV_LYRICS_PATH"))
    output_path = Path(require_env("KTV_ALIGNMENT_PATH"))
    model_id = os.environ.get("KTV_ASR_MODEL_ID", DEFAULT_MODEL)
    language = os.environ.get("KTV_ASR_LANGUAGE") or None
    max_seconds = parse_float(os.environ.get("KTV_ASR_MAX_AUDIO_SECONDS") or os.environ.get("KTV_MAX_AUDIO_SECONDS"))
    song_title = os.environ.get("KTV_TITLE") or ""
    song_artist = os.environ.get("KTV_ARTIST") or ""

    if not vocals_path.exists():
        raise SystemExit(f"Vocal source does not exist: {vocals_path}")

    lyric_text = lyrics_path.read_text(encoding="utf-8") if lyrics_path.exists() else ""
    lyric_lines = parse_lyric_lines(lyric_text)
    singable_lines = [line for line in lyric_lines if is_singable_line(line["text"], song_title, song_artist)]
    transcription = transcribe_vocals(vocals_path, model_id, language=language, max_seconds=max_seconds)
    segments = normalize_segments(transcription.get("segments") or [])
    if not segments:
        raise SystemExit("Whisper did not return any usable vocal transcript segments.")

    generated_lyrics = ""
    if len(singable_lines) >= 4:
        aligned_lines = align_lyrics_to_segments(singable_lines, segments)
        source = "vocal-asr-lyric-match"
        quality_label = None
    else:
        aligned_lines = generate_lines_from_segments(segments)
        if not aligned_lines:
            raise SystemExit("Whisper transcript did not contain usable lyric lines.")
        generated_lyrics = build_generated_lrc(aligned_lines)
        source = "vocal-asr-generated-lyrics"
        quality_label = "asr-generated"

    generated_mode = source == "vocal-asr-generated-lyrics"
    duration = max(
        [float(segment["end"]) for segment in segments if segment.get("end") is not None]
        + [float(line["end"]) for line in aligned_lines if line.get("end") is not None]
        + [0.0]
    )
    similarities = [float(line.get("similarity") or 0) for line in aligned_lines]
    average_similarity = 1.0 if generated_mode else sum(similarities) / max(1, len(similarities))
    low_confidence_count = 0 if generated_mode else sum(1 for value in similarities if value < 0.2)
    if quality_label is None:
        quality_label = "asr-matched" if average_similarity >= 0.32 and low_confidence_count <= len(aligned_lines) // 3 else "asr-low-confidence"

    alignment = {
        "version": 1,
        "source": source,
        "model": model_id,
        "duration": round(duration, 3),
        "lineCount": len(aligned_lines),
        "lines": aligned_lines,
        "generatedLyrics": generated_lyrics,
        "transcription": {
            "model": model_id,
            "language": transcription.get("language") or language or "",
            "text": transcription.get("text") or " ".join(segment["text"] for segment in segments),
            "segments": segments,
        },
        "quality": {
            "label": quality_label,
            "averageSimilarity": round(average_similarity, 3),
            "matchedLineCount": len(aligned_lines) if generated_mode else sum(1 for value in similarities if value >= 0.2),
            "segmentCount": len(segments),
            "warnings": build_warnings(average_similarity, low_confidence_count, len(aligned_lines), generated=generated_mode),
        },
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(alignment, ensure_ascii=False, indent=2), encoding="utf-8")


def transcribe_vocals(vocals_path: Path, model_id: str, *, language: str | None, max_seconds: float | None) -> dict[str, Any]:
    audio: str | Any = str(vocals_path)
    if max_seconds and max_seconds > 0:
        import librosa

        samples, _sample_rate = librosa.load(vocals_path, sr=16000, mono=True, duration=max_seconds)
        audio = samples

    options: dict[str, Any] = {
        "path_or_hf_repo": model_id,
        "verbose": False,
        "word_timestamps": False,
        "condition_on_previous_text": False,
        "temperature": 0.0,
    }
    if language:
        options["language"] = language

    return mlx_whisper.transcribe(audio, **options)


def generate_lines_from_segments(segments: list[dict[str, Any]]) -> list[dict[str, Any]]:
    generated: list[dict[str, Any]] = []
    for segment in segments:
        pieces = split_segment_text(segment["text"])
        if not pieces:
            continue

        segment_start = float(segment["start"])
        segment_end = max(segment_start + 0.45, float(segment["end"]))
        step = max(0.45, (segment_end - segment_start) / len(pieces))
        for piece_index, piece in enumerate(pieces):
            start = min(segment_end - 0.2, segment_start + piece_index * step)
            end = segment_end if piece_index == len(pieces) - 1 else min(segment_end, start + step)
            if end <= start:
                end = start + 0.45
            generated.append(
                {
                    "index": len(generated),
                    "start": round(max(0.0, start), 3),
                    "end": round(max(start + 0.45, end), 3),
                    "text": piece,
                    "transcript": piece,
                    "similarity": 1.0,
                    "asrSegmentIndexes": [int(segment["index"])],
                }
            )
    return smooth_alignment(generated)


def split_segment_text(text: str) -> list[str]:
    cleaned = re.sub(r"\s+", " ", str(text or "").strip())
    cleaned = re.sub(r"^[♪\-\s]+|[♪\-\s]+$", "", cleaned)
    if not cleaned:
        return []
    if re.fullmatch(r"[\[\(]?(music|instrumental|applause|silence)[\]\)]?", cleaned, re.IGNORECASE):
        return []

    clause_candidates = [part.strip(" ,.;:!?，。！？；：") for part in re.split(r"(?<=[,.;:!?，。！？；：])\s*", cleaned)]
    pieces: list[str] = []
    for clause in clause_candidates:
        if not clause:
            continue
        words = clause.split()
        if len(words) > 1:
            for index in range(0, len(words), 8):
                piece = " ".join(words[index : index + 8]).strip()
                if piece:
                    pieces.append(piece)
            continue

        for index in range(0, len(clause), 18):
            piece = clause[index : index + 18].strip()
            if piece:
                pieces.append(piece)

    return [piece for piece in pieces if is_singable_line(piece)]


def build_generated_lrc(lines: list[dict[str, Any]]) -> str:
    return "\n".join(f"[{format_lrc_time(float(line['start']))}]{line['text']}" for line in lines)


def format_lrc_time(seconds: float) -> str:
    bounded = max(0.0, float(seconds))
    minutes = int(bounded // 60)
    remaining = bounded - minutes * 60
    return f"{minutes:02d}:{remaining:05.2f}"


def parse_lyric_lines(lyrics: str) -> list[dict[str, Any]]:
    lines: list[dict[str, Any]] = []
    timestamp_pattern = re.compile(r"\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\]")
    for raw_line in lyrics.replace("\r\n", "\n").split("\n"):
        text = timestamp_pattern.sub("", raw_line).strip()
        if not text:
            continue
        lines.append({"index": len(lines), "text": re.sub(r"\s+", " ", text)})
    return lines


def normalize_segments(raw_segments: list[dict[str, Any]]) -> list[dict[str, Any]]:
    segments: list[dict[str, Any]] = []
    for raw in raw_segments:
        text = re.sub(r"\s+", " ", str(raw.get("text") or "").strip())
        if not text:
            continue
        try:
            start = max(0.0, float(raw.get("start") or 0))
            end = max(start + 0.2, float(raw.get("end") or start + 2.5))
        except (TypeError, ValueError):
            continue
        segments.append(
            {
                "index": len(segments),
                "start": round(start, 3),
                "end": round(end, 3),
                "text": text,
            }
        )
    return segments


def align_lyrics_to_segments(lyric_lines: list[dict[str, Any]], segments: list[dict[str, Any]]) -> list[dict[str, Any]]:
    aligned: list[dict[str, Any]] = []
    cursor = 0
    last_end = 0.0

    for lyric_position, lyric in enumerate(lyric_lines):
        remaining_lines = max(1, len(lyric_lines) - lyric_position)
        remaining_segments = max(1, len(segments) - cursor)
        max_group = min(6, max(1, remaining_segments - remaining_lines + 1))
        best = None

        for group_size in range(1, max_group + 1):
            candidate = segments[cursor : cursor + group_size]
            if not candidate:
                break
            transcript_text = " ".join(segment["text"] for segment in candidate)
            similarity = text_similarity(lyric["text"], transcript_text)
            duration = candidate[-1]["end"] - candidate[0]["start"]
            duration_penalty = 0.08 if duration > 9 else 0
            score = similarity - duration_penalty
            if not best or score > best["score"]:
                best = {
                    "score": score,
                    "similarity": similarity,
                    "segments": candidate,
                    "groupSize": group_size,
                    "transcript": transcript_text,
                }

        if best and best["segments"]:
            start = max(last_end, float(best["segments"][0]["start"]))
            end = max(start + 0.45, float(best["segments"][-1]["end"]))
            cursor = min(len(segments), cursor + int(best["groupSize"]))
        else:
            start = last_end
            end = start + 3.0
            best = {"similarity": 0, "transcript": "", "segments": []}

        aligned.append(
            {
                "index": int(lyric["index"]),
                "start": round(start, 3),
                "end": round(end, 3),
                "text": lyric["text"],
                "transcript": best["transcript"],
                "similarity": round(float(best["similarity"]), 3),
                "asrSegmentIndexes": [int(segment["index"]) for segment in best["segments"]],
            }
        )
        last_end = end

    return smooth_alignment(aligned)


def smooth_alignment(lines: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if len(lines) < 2:
        return lines

    for index, line in enumerate(lines[:-1]):
        next_line = lines[index + 1]
        if line["end"] > next_line["start"]:
            midpoint = round((line["start"] + next_line["start"]) / 2, 3)
            line["end"] = max(line["start"] + 0.45, midpoint)
        elif next_line["start"] - line["end"] > 4.0:
            line["end"] = round(next_line["start"] - 0.2, 3)
    return lines


def text_similarity(expected: str, actual: str) -> float:
    left = normalize_text(expected)
    right = normalize_text(actual)
    if not left or not right:
        return 0.0
    if left in right or right in left:
        return min(len(left), len(right)) / max(len(left), len(right))
    return SequenceMatcher(None, left, right).ratio()


def normalize_text(value: str) -> str:
    value = value.lower()
    return "".join(re.findall(r"[\u4e00-\u9fff\w]+", value))


def is_singable_line(text: str, title: str = "", artist: str = "") -> bool:
    normalized = str(text or "").strip()
    if not normalized:
        return False
    if CREDIT_PATTERN.search(normalized):
        return False
    compact = normalize_text(normalized)
    title_compact = normalize_text(title)
    artist_compact = normalize_text(artist)
    if title_compact and len(title_compact) >= 6 and (compact in title_compact or title_compact in compact):
        return False
    if artist_compact and len(artist_compact) >= 4 and (artist_compact in compact):
        return False
    if "/" in normalized and any(token for token in (title_compact, artist_compact) if token and token in compact):
        return False
    return len(re.sub(r"\s+", "", normalized)) >= 3


def build_warnings(average_similarity: float, low_confidence_count: int, line_count: int, *, generated: bool = False) -> list[str]:
    warnings: list[str] = []
    if generated:
        warnings.append("Lyrics were generated from the separated original vocal transcript; review if the song has heavy effects or overlapping vocals.")
        return warnings
    if average_similarity < 0.32:
        warnings.append("ASR transcript only weakly matched the saved lyrics; verify the lyric source for this song.")
    if low_confidence_count:
        warnings.append(f"{low_confidence_count}/{line_count} lyric lines had low ASR text similarity.")
    return warnings


def parse_float(value: str | None) -> float | None:
    if not value:
        return None
    try:
        parsed = float(value)
    except ValueError:
        return None
    return parsed if parsed > 0 else None


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise SystemExit(f"{name} is required")
    return value


if __name__ == "__main__":
    main()
