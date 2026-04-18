# Fonts

Place these font files here before shipping:

- **Atkinson Hyperlegible** (default, high-legibility) — https://brailleinstitute.org/freefont
  - Files needed: `AtkinsonHyperlegible-Regular.woff2`, `AtkinsonHyperlegible-Bold.woff2`, `AtkinsonHyperlegible-Italic.woff2`
  - License: SIL Open Font License 1.1
- **OpenDyslexic** (dyslexia-friendly toggle) — https://opendyslexic.org
  - Files needed: `OpenDyslexic-Regular.woff2`, `OpenDyslexic-Bold.woff2`
  - License: SIL Open Font License 1.1

The CSS in `assets/css/base.css` already has `@font-face` declarations pointing to these filenames. Until the files are present, the browser falls back to system-ui.
