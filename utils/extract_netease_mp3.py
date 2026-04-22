#!/usr/bin/env python3
"""Download an MP3 from a NetEase Cloud Music short link or song URL.

Examples:
    python extract_netease_mp3.py "https://163cn.tv/49QbIHD"
    python extract_netease_mp3.py "https://163cn.tv/49QbIHD" --output-dir /tmp
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from html import unescape
from pathlib import Path
from typing import Optional
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen


USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)
DEFAULT_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept-Language": "en-US,en;q=0.9",
}
API_HEADERS = {
    **DEFAULT_HEADERS,
    "Referer": "https://music.163.com/",
    "Accept": "application/json,text/plain,*/*",
}
CHUNK_SIZE = 64 * 1024


class DownloadError(RuntimeError):
    """Raised when the target page cannot be resolved into an MP3 download."""


def fetch_page(url: str, timeout: int = 20) -> tuple[str, str]:
    request = Request(url, headers=DEFAULT_HEADERS)
    with urlopen(request, timeout=timeout) as response:
        final_url = response.geturl()
        charset = response.headers.get_content_charset() or "utf-8"
        html = response.read().decode(charset, errors="replace")
    return final_url, html


def fetch_json(url: str, timeout: int = 20) -> dict:
    request = Request(url, headers=API_HEADERS)
    with urlopen(request, timeout=timeout) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        payload = response.read().decode(charset, errors="replace")
    return json.loads(payload)


def extract_song_id(final_url: str, html: str) -> str:
    parsed = urlparse(final_url)
    query_song_ids = parse_qs(parsed.query).get("id", [])
    if query_song_ids and query_song_ids[0].isdigit():
        return query_song_ids[0]

    patterns = (
        r'<link rel="canonical" href="https?://(?:y\.)?music\.163\.com/(?:m/)?song\?id=(\d+)',
        r'"@id"\s*:\s*"https?://(?:y\.)?music\.163\.com/(?:m/)?song\?.*?\bid=(\d+)',
        r'"songId"\s*:\s*(\d+)',
    )
    for pattern in patterns:
        match = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
        if match:
            return match.group(1)

    raise DownloadError("Could not find a NetEase song id in the resolved page.")


def extract_track_title(html: str) -> Optional[str]:
    match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    if not match:
        return None

    title = unescape(match.group(1)).strip()
    for suffix in (" - 单曲 - 网易云音乐", " - 网易云音乐"):
        if title.endswith(suffix):
            title = title[: -len(suffix)].strip()
            break
    return title or None


def slugify_filename(title: Optional[str], song_id: str) -> str:
    fallback = f"song-{song_id}"
    if not title:
        return f"{fallback}.mp3"

    ascii_title = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^A-Za-z0-9]+", "-", ascii_title).strip("-").lower()
    if not slug:
        slug = fallback
    return f"{slug}.mp3"


def looks_like_html(payload: bytes) -> bool:
    prefix = payload.lstrip().lower()
    return prefix.startswith(b"<!doctype html") or prefix.startswith(b"<html")


def resolve_audio_url(song_id: str) -> str:
    api_url = (
        "https://music.163.com/api/song/enhance/player/url"
        f"?id={song_id}&ids=%5B{song_id}%5D&br=128000"
    )
    payload = fetch_json(api_url, timeout=30)
    data = payload.get("data") or []
    if not data:
        raise DownloadError(f"NetEase returned an unexpected player API response for song id {song_id}.")

    track_info = data[0]
    audio_url = track_info.get("url")
    if audio_url:
        return audio_url

    track_code = track_info.get("code")
    cannot_listen_reason = (
        (track_info.get("freeTrialPrivilege") or {}).get("cannotListenReason")
    )
    reason_suffix = ""
    if cannot_listen_reason is not None:
        reason_suffix = f" cannotListenReason={cannot_listen_reason}."

    raise DownloadError(
        "NetEase resolved the song page, but no public MP3 URL is available "
        f"for song id {song_id} (track code={track_code}).{reason_suffix}"
    )


def download_mp3(audio_url: str, destination: Path) -> str:
    request = Request(audio_url, headers=DEFAULT_HEADERS)

    with urlopen(request, timeout=60) as response:
        final_audio_url = response.geturl()
        first_chunk = response.read(CHUNK_SIZE)
        content_type = response.headers.get_content_type()

        if not first_chunk:
            raise DownloadError("The audio endpoint returned an empty response.")

        if content_type.startswith("text/") or looks_like_html(first_chunk):
            raise DownloadError("The audio endpoint returned HTML instead of an MP3 stream.")

        destination.parent.mkdir(parents=True, exist_ok=True)
        with destination.open("wb") as output_file:
            output_file.write(first_chunk)
            while True:
                chunk = response.read(CHUNK_SIZE)
                if not chunk:
                    break
                output_file.write(chunk)

    return final_audio_url


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Resolve a NetEase Cloud Music short link or song page and download its MP3."
    )
    parser.add_argument("url", help="NetEase short link or song URL to resolve.")
    parser.add_argument(
        "--output-dir",
        default=str(Path(__file__).resolve().parent),
        help="Directory where the MP3 should be saved. Defaults to this script's directory.",
    )
    parser.add_argument(
        "--filename",
        help="Optional output filename. Defaults to a sanitized name based on the track title.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite the output file if it already exists.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_dir = Path(args.output_dir).expanduser().resolve()

    try:
        resolved_url, html = fetch_page(args.url)
        song_id = extract_song_id(resolved_url, html)
        title = extract_track_title(html)
        filename = args.filename or slugify_filename(title, song_id)
        destination = output_dir / filename

        if destination.exists() and not args.overwrite:
            raise DownloadError(
                f"Refusing to overwrite existing file: {destination}. Use --overwrite to replace it."
            )

        audio_url = resolve_audio_url(song_id)
        final_audio_url = download_mp3(audio_url, destination)
    except (DownloadError, HTTPError, URLError, OSError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(f"Resolved page: {resolved_url}")
    print(f"Song id: {song_id}")
    if title:
        print(f"Track title: {title}")
    print(f"Audio URL: {final_audio_url}")
    print(f"Saved MP3: {destination}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
