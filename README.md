# phishEye

Premium futuristic cybersecurity web app built as a single-page UI.

## Overview

- Dark cyberpunk gradient + neon glow theme
- Glassmorphism cards and animated background
- Real-time phishing URL risk simulation
- Scanning overlay, progress ring, and AI indicator logic
- Sections: Home, Login, About, Learn, Footer
- Fully mobile responsive

## Run locally

1. Open workspace folder in VS Code.
2. Open `index.html` in browser manually, or use Live Server extension.
3. Enter URL and click `ANALYZE`.

## Analysis behavior

- Add score for HTTPS, subtract for HTTP/non-HTTPS
- Subtract for suspicious keywords: `login`, `verify`, `bank`, `update`, etc.
- Subtract for long URLs (>30, >70)
- Random noise for realistic output
- Result categories:
  - SAFE (80–100)
  - SUSPICIOUS (50–79)
  - DANGEROUS (0–49)

## Deploy (GitHub Pages)

1. `git init`
2. `git add .`
3. `git commit -m "Initial phishEye UI"`
4. Create GitHub repo named `phiseye` (or your name)
5. `git remote add origin https://github.com/<username>/phiseye.git`
6. `git branch -M main`
7. `git push -u origin main`

In GitHub:
- Settings > Pages > Source: `main` branch / `/ (root)`
- Save.

Public URL will be:
`https://<username>.github.io/phiseye/`

## Optional hosts

- Netlify (drag & drop) 
- Vercel (`vercel --prod`)
- Surge (`surge ./ phisheye.surge.sh`)

## Live demo link (replace username)

`https://<your-username>.github.io/phiseye/`

## Notes

- File locations:
  - `index.html`
  - `styles.css`
  - `app.js`

- Add API integration for real threat intelligence when ready.