# JIBZYFOODS — Homepage

This is a single-page homepage for **JIBZYFOODS** showcasing processed food products with an interactive shopping cart and a WhatsApp order link.

Files in this folder
- `index.html` — main page
- `styles.css` — CSS styles
- `script.js` — cart and WhatsApp logic
- `images/` — place your real product photos here (optional)

How to run locally
1. Open the folder in VS Code (File → Open Folder...) and select the `jibzyfoods` folder.
2. Recommended: Install the Live Server extension and click "Go Live" (bottom-right). The site should open at `http://127.0.0.1:5500` (or another port Live Server chooses).

Alternative (no VS Code)
- If you have Python 3 installed, run from PowerShell inside the `jibzyfoods` folder:
```powershell
python -m http.server 8000
Start-Process 'http://localhost:8000'
```

- Or if you have Node.js installed:
```powershell
npm install -g http-server
http-server -p 8000
Start-Process 'http://localhost:8000'
```

Images
- Suggested filenames to place into `images/`:
  - `logo.jpg` (optional)
  - `hero.jpg` (optional)
  - `dried-catfish.jpg`
  - `dried-snail.jpg`
  - `crayfish.jpg`
  - `dried-pepper.jpg`

Notes
- The page will use Unsplash fallback images if any of your images are missing.
- If you want, upload the product images here and I will add them into the `images/` folder for you.
