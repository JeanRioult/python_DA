"""Scaffold a new lesson.

Usage:
    python tools/new_lesson.py <semester-number> <chapter-slug> <lesson-slug>

Example:
    python tools/new_lesson.py 1 chapter-02-qu-est-ce-qu-une-donnee lesson-01
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main(argv: list[str]) -> int:
    if len(argv) != 4:
        print(__doc__)
        return 2

    _, sem_num, chapter_slug, lesson_slug = argv
    sem_id = f"semester-{int(sem_num):02d}"
    sem_dir = ROOT / "content" / sem_id
    ch_dir = sem_dir / chapter_slug

    ch_dir.mkdir(parents=True, exist_ok=True)
    (ch_dir / "exercises").mkdir(exist_ok=True)

    ch_meta_path = ch_dir / "_meta.json"
    if not ch_meta_path.exists():
        ch_meta_path.write_text(json.dumps({
            "id": chapter_slug,
            "number": 0,
            "semester": int(sem_num),
            "title": {"fr": "TODO", "en": "TODO"},
            "estimatedHours": 0,
            "lessons": [],
        }, indent=2, ensure_ascii=False), encoding="utf-8")

    for lang in ("fr", "en"):
        p = ch_dir / f"{lesson_slug}.{lang}.md"
        if not p.exists():
            p.write_text(f"# TODO ({lang})\n\n*Temps estimé : TODO*\n\n", encoding="utf-8")

    fc = ch_dir / "flashcards.json"
    if not fc.exists():
        fc.write_text(json.dumps({"chapter": chapter_slug, "cards": []}, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Scaffolded {ch_dir.relative_to(ROOT)} / {lesson_slug}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
