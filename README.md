# Python DA — a concise data-analyst course

A self-directed, master's-level course that takes a complete beginner to a professional data analyst, with a deliberately broad foundation: mathematics, computer science, statistics, **and** philosophy, political science, literature, languages, and physics.

Designed to be **neurodivergent-friendly** (dyslexia, ADHD, dark-mode), grounded in **learning sciences** (retrieval practice, spaced repetition, interleaving, worked examples), and **fully portable** — open `index.html` in any modern browser and it works. No server, no build step required to use it.

## Scope

- **10 semesters**, ~4,500 learner-hours total (master's equivalent, years 1 → 5)
- **Zero prior knowledge assumed** — basics are refreshed from the ground up (arithmetic, logic, scientific method, writing)
- **Bilingual FR / EN** — FR-first, EN toggle per lesson
- **MVP**: Semester 1 only. Further semesters ship one at a time.

See [CURRICULUM.md](CURRICULUM.md) for the full program map.

## Learner profile

- ~20 years old, first-year college, no prior assumption of math or coding background
- Has a desktop or laptop with **PyCharm** installed (Windows, macOS, or Linux)
- Wants to *think* like an analyst, not just push buttons

## What the interface does

- Renders lessons from `.md` files with an HTML + CSS + vanilla-JS shell
- **Progress tracking** (localStorage): lessons completed, quiz scores, flashcard SRS state
- **Progress export/import** (JSON) so learners don't lose state when they pull course updates
- **Navigation**: chapter summary button, jump-to-section, return-to-last-position
- **Language toggle** FR ↔ EN per lesson
- **Display modes**: light / dark, standard / dyslexia-friendly font, low-stimulation mode
- **Exercises** are Jupyter notebooks (`.ipynb`) opened in PyCharm, with auto-graded cells

## Portability — honest version

| What | Works on |
|---|---|
| Reading lessons, quizzes, flashcards | Any modern browser — phone, tablet, desktop (Windows/macOS/Linux/Android/iOS) |
| Doing the exercises | **Desktop only** (Windows / macOS / Linux) with PyCharm + Python |

Shortcut tables in lessons have a **Windows / macOS** toggle (Linux uses the same shortcuts as Windows in PyCharm).

## Technical constraints

- Content: `.md` files organized under `content/semester-XX/chapter-YY/`
- Interface: single-page `index.html` + vanilla JS + CSS (no framework, no build tool required)
- Markdown rendering: `marked.js` vendored in `assets/js/vendor/`
- Math rendering: `KaTeX` vendored (added when first needed in S2)
- Exercises: Jupyter `.ipynb` files, opened in PyCharm
- Portability: **sending the root folder is all it takes to share the course** — no install, no dependencies for the reader

## Folder structure

```
python_DA/
├── README.md                      ← this file
├── CURRICULUM.md                  ← 10-semester program map
├── LICENSE                        ← CC BY-SA 4.0 (content) + MIT (code)
├── index.html                     ← entry point of the interface
├── assets/
│   ├── css/                       ← base, dark, dyslexia, low-stim
│   ├── js/                        ← app, progress, i18n, markdown, vendor
│   ├── fonts/                     ← Atkinson Hyperlegible, OpenDyslexic
│   └── img/
├── content/
│   ├── semester-01/
│   │   ├── _meta.json             ← title, objectives, hours (FR+EN)
│   │   └── chapter-XX-slug/
│   │       ├── _meta.json
│   │       ├── lesson-XX.fr.md
│   │       ├── lesson-XX.en.md
│   │       ├── exercises/         ← .ipynb files
│   │       └── flashcards.json
│   └── semester-02/ …
└── tools/
    ├── build.py                   ← validates structure, builds search index
    └── new_lesson.py              ← scaffolds a new lesson folder
```

## Pedagogy — principles the course commits to

- **Retrieval practice** — each lesson opens with 3–5 questions from previous material
- **Spaced repetition** — flashcards per chapter, SRS schedule in localStorage, Anki-exportable
- **Worked examples → fading → independent practice** — every concept shown solved, then half-solved, then blank
- **Interleaved exercise blocks** — end-of-chapter sets mix topics rather than massing one
- **Metacognitive prompts** — *"what did you get wrong and why?"* written after each exercise set
- **Chunked lessons** — each capped at 12–15 minutes with a visible time estimate
- **One clear CTA** per page — "Next: …"

## Assessment

- **Formative**: auto-graded notebook cells (`assert` + hidden tests), quizzes, flashcards
- **Summative**: one capstone per semester with a rubric (correctness / clarity / depth / communication)
- **Final**: S10 thesis — real dataset, real question, 40–80 pages + public defense video

## Getting started (for learners — once content exists)

1. Download or clone the folder
2. Open `index.html` in any browser
3. Pick your language (FR / EN), font, and theme
4. Start Semester 1, Chapter 1

## Getting started (for authors)

1. `python tools/new_lesson.py <semester> <chapter> <lesson-slug>` scaffolds the files
2. Write `lesson-XX.fr.md` first, then translate to `lesson-XX.en.md`
3. `python tools/build.py` validates structure and rebuilds the search index
4. Open `index.html` locally to preview

## License

- **Content** (under `content/`): CC BY-SA 4.0
- **Code** (everything else): MIT

## Status

**MVP in progress — Semester 1.** See [CURRICULUM.md](CURRICULUM.md) for the roadmap beyond.
