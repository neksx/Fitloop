# Fitloop v86 — GitHub

`dist/` is the complete website. `index.html` and all 218 other files are included locally; the site uses hash routes such as `#next` and `#saved`.

## Upload

1. Unzip the Fitloop source archive and create an empty GitHub repository.
2. From the unzipped folder run `git init`, `git add .`, `git commit -m "Fitloop v86"`, `git branch -M main`, `git remote add origin <your-repository-URL>`, `git push -u origin main`.
3. In the repository's **Settings → Pages → Build and deployment**, choose **GitHub Actions**. The included `.github/workflows/pages.yml` publishes `dist/` on each push to `main`.

To work locally, run `python3 -m http.server 4174 --directory dist` and visit `http://127.0.0.1:4174/#next`. If Node.js is installed, `npm test` runs the checks.

The source is currently at version 0.86.0. The earlier v71 archive is historical and does not include the newer changes. Saved looks and model changes use browser storage, so they are not shared across devices or different site addresses.
