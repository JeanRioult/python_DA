# Deployment — GitHub Pages

The site is fully static and deploys to GitHub Pages via a GitHub Actions workflow. No build step is required to **run** the course locally; the workflow exists only to keep generated indexes (`tools/index.json`, `tools/search-index.json`) and PWA icons fresh on every push.

## One-time setup

1. Push this repository to GitHub (done — it's public).
2. In the repository on GitHub, go to **Settings → Pages**.
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch").

That's it. The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) takes over from there.

## Ongoing workflow

Every push to `main` triggers `pages.yml`, which:

1. Checks out the repo.
2. Installs Pillow (only if icons need regenerating).
3. Runs `python tools/make_icons.py` if `assets/img/icon-192.png` is missing.
4. Runs `python tools/build.py` to rebuild `tools/index.json` and `tools/search-index.json`.
5. Uploads the entire repo as a Pages artifact and deploys.

Typical cycle:

```bash
# edit a lesson or add a chapter
git add content/semester-01/chapter-XX-.../lesson-YY.fr.md
git commit -m "content: add lesson YY of chapter XX"
git push
# → GitHub Actions runs, indexes rebuild, Pages redeploys within ~1 min
```

You **do not** need to run `tools/build.py` locally before pushing. The workflow does it in CI. Commit only the source files (markdown, `_meta.json`, flashcards); the indexes are regenerated each deploy.

## The URL

After the first successful deploy, the site will be at:

```
https://<your-github-username>.github.io/<repo-name>/
```

A custom domain is optional and can be added later in **Settings → Pages → Custom domain**.

## Manual re-deploy

From the repo on GitHub: **Actions → "Deploy to GitHub Pages" → Run workflow**. Useful after renaming things or if a deploy failed transiently.

## Why `.nojekyll`?

GitHub Pages runs Jekyll by default, which skips files and folders whose names start with `_`. Several of our paths do — `_meta.json` in every chapter folder — and Jekyll would silently drop them. The empty `.nojekyll` file at the repo root tells Pages "no Jekyll, serve everything verbatim".

## PWA notes

- The service worker (`sw.js`) registers with scope `./`, which resolves to the Pages subpath at deploy time. All paths inside `sw.js` and `manifest.json` are relative, so the PWA works at `https://<user>.github.io/<repo>/` without edits.
- When the cached version needs to be forcibly invalidated (e.g. after a structural change), bump `VERSION` in `sw.js`. Old caches are purged on the next activate.

## Progress data is per-origin

Progress (`localStorage` under the `pyda.*` keys) is scoped to the origin it was created on. Switching from `http://<lan-ip>:8765` to `https://<user>.github.io/<repo>/` means the new origin starts with empty progress.

If you want to carry progress across origins, use **Settings → Progress → Export** on the old origin, then **Import** on the new one. One-time operation.

## License reminder

See [LICENSE](LICENSE). The repository is public for **viewing** only. Any reuse — republication, derivative works, use in training data, inclusion in other courses — requires prior written permission from the copyright holder.
