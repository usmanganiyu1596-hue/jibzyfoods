Deployment instructions — GitHub Pages
=================================

Quick summary (recommended): push this repo to GitHub `main` branch and the included GitHub Actions workflow will publish the site to the `gh-pages` branch and enable Pages.

Steps (copy & run from PowerShell in the workspace root):

1) Initialize git (if not already):

```powershell
git init
git add .
git commit -m "Initial site"
```

2) Create a GitHub repository and push. Two options:

- Using GitHub CLI (recommended if installed):

```powershell
gh repo create USERNAME/REPO-NAME --public --source=. --remote=origin --push
```

- Or create the repo on github.com and then set the remote and push:

```powershell
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

3) After pushing, open the repository on GitHub > Actions and watch the "Deploy to GitHub Pages" workflow run. When it completes, the site will be published to the `gh-pages` branch.

4) To view the site:

- Visit `https://USERNAME.github.io/REPO-NAME` (may take a minute to become available)

Notes & alternatives
- If you prefer Netlify or Vercel, you can connect your GitHub repo in their dashboard — they will pick up the static site automatically.
- The workflow publishes the repository root (all files). If you prefer a `docs/` folder or a build step, let me know and I can adjust the workflow.

Troubleshooting
- If Pages does not appear, ensure GitHub repository settings > Pages source shows `gh-pages` branch.
- If you need a custom domain, add a `CNAME` file to the repo root and configure DNS.
