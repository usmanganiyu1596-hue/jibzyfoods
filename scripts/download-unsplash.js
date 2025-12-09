const https = require('https');
const fs = require('fs');
const path = require('path');

const items = [
  { url: 'https://source.unsplash.com/1600x900/?dried,catfish', file: 'images/dried-catfish.jpg' },
  { url: 'https://source.unsplash.com/1600x900/?dried,snail', file: 'images/dried-snail.jpg' },
  { url: 'https://source.unsplash.com/1600x900/?crayfish,seafood', file: 'images/crayfish.jpg' },
  { url: 'https://source.unsplash.com/1600x900/?dried,pepper,chili', file: 'images/dried-pepper.jpg' },
  { url: 'https://source.unsplash.com/1200x800/?dried,market', file: 'images/hero.jpg' },
  { url: 'https://source.unsplash.com/60x60/?food,logo', file: 'images/logo.jpg' }
];

function download(url, dest, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 8) return reject(new Error('Too many redirects'));
    const opts = new URL(url);
    opts.headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };

    https.get(opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        res.destroy();
        return resolve(download(next, dest, redirectCount + 1));
      }

      if (res.statusCode !== 200) {
        return reject(new Error('Failed to download ' + url + ' status: ' + res.statusCode));
      }

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(resolve));
      fileStream.on('error', (err) => reject(err));
    }).on('error', (err) => reject(err));
  });
}

(async function(){
  try {
    for (const it of items) {
      const dest = path.join(__dirname, '..', it.file);
      console.log('Downloading', it.url, '->', dest);
      await download(it.url, dest);
      console.log('Saved', dest);
    }
    console.log('All downloads complete');
  } catch (err) {
    console.error('Download error:', err.message);
    process.exit(1);
  }
})();
