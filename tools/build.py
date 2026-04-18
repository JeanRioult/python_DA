"""Validate course structure, build the TOC index, and a search index.

Run from the project root:
    python tools/build.py

Outputs:
  - tools/index.json         — hierarchy for the TOC (semester, chapter, lesson)
  - tools/search-index.json  — flat text index for the search bar (per-language)
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"

LANGS = ("fr", "en")


def fail(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)


def warn(msg: str) -> None:
    print(f"WARN:  {msg}", file=sys.stderr)


def strip_md(md: str) -> str:
    """Reduce markdown to plain searchable text (best-effort, not perfect)."""
    md = re.sub(r"```[\s\S]*?```", " ", md)        # fenced code blocks
    md = re.sub(r"`[^`]+`", " ", md)               # inline code
    md = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", md)  # links -> label only
    md = re.sub(r"!\[[^\]]*\]\([^)]+\)", " ", md)  # images
    md = re.sub(r"^#{1,6}\s*", "", md, flags=re.M)  # heading markers
    md = re.sub(r"[*_>|\[\]]", " ", md)            # remaining md punctuation
    md = re.sub(r"\s+", " ", md)                   # collapse whitespace
    return md.strip()


def main() -> int:
    if not CONTENT.is_dir():
        fail(f"content folder not found at {CONTENT}")
        return 1

    errors = 0
    index: list[dict] = []
    search_entries: list[dict] = []

    for semester_dir in sorted(CONTENT.glob("semester-*")):
        meta_path = semester_dir / "_meta.json"
        if not meta_path.is_file():
            fail(f"missing {meta_path.relative_to(ROOT)}")
            errors += 1
            continue
        try:
            sem_meta = json.loads(meta_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            fail(f"{meta_path.relative_to(ROOT)}: {e}")
            errors += 1
            continue

        for chapter_id in sem_meta.get("chapters", []):
            chapter_dir = semester_dir / chapter_id
            ch_meta_path = chapter_dir / "_meta.json"
            if not ch_meta_path.is_file():
                fail(f"missing {ch_meta_path.relative_to(ROOT)}")
                errors += 1
                continue
            try:
                ch_meta = json.loads(ch_meta_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                fail(f"{ch_meta_path.relative_to(ROOT)}: {e}")
                errors += 1
                continue

            for lesson in ch_meta.get("lessons", []):
                lesson_id = lesson["id"]
                fr = chapter_dir / f"{lesson_id}.fr.md"
                en = chapter_dir / f"{lesson_id}.en.md"
                if not fr.is_file():
                    fail(f"missing FR lesson {fr.relative_to(ROOT)}")
                    errors += 1
                    continue
                if not en.is_file():
                    warn(f"missing EN lesson {en.relative_to(ROOT)} (falls back to FR)")

                index.append({
                    "semester": sem_meta["id"],
                    "semesterNumber": sem_meta.get("number"),
                    "semesterTitle": sem_meta.get("title", {}),
                    "chapter": chapter_id,
                    "chapterNumber": ch_meta.get("number"),
                    "chapterTitle": ch_meta.get("title", {}),
                    "lesson": lesson_id,
                    "lessonNumber": lesson.get("number"),
                    "title": lesson.get("title", {}),
                    "estimatedMinutes": lesson.get("estimatedMinutes"),
                })

                entry_bodies: dict[str, str] = {}
                for lang in LANGS:
                    src = chapter_dir / f"{lesson_id}.{lang}.md"
                    if src.is_file():
                        entry_bodies[lang] = strip_md(src.read_text(encoding="utf-8"))
                if entry_bodies:
                    search_entries.append({
                        "semester": sem_meta["id"],
                        "chapter": chapter_id,
                        "lesson": lesson_id,
                        "title": lesson.get("title", {}),
                        "chapterTitle": ch_meta.get("title", {}),
                        "body": entry_bodies,
                    })

            fc = chapter_dir / "flashcards.json"
            if fc.is_file():
                try:
                    json.loads(fc.read_text(encoding="utf-8"))
                except json.JSONDecodeError as e:
                    fail(f"{fc.relative_to(ROOT)}: {e}")
                    errors += 1

    (ROOT / "tools" / "index.json").write_text(
        json.dumps(index, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    (ROOT / "tools" / "search-index.json").write_text(
        json.dumps(search_entries, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"OK: indexed {len(index)} lessons, {len(search_entries)} searchable, {errors} errors")
    return 0 if errors == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
