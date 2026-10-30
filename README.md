# PRO-EX (PROcastinating EXpenditures)

Student daily budget and savings app, deployed as a **Render Web Service**
(a small Node.js server that serves the website). No database, no secret keys,
no dependencies to install. Installable on a phone's home screen.

## Folder structure
```
server.js          The web server (Node.js, no extra packages)
package.json       Tells Render how to start the server
render.yaml        Render settings
README.md
.gitignore
public/            The website (index.html, manifest.webmanifest, sw.js, icons/)
```

## Publish

### 1. GitHub
1. Unzip the ZIP file. You should see `server.js`, `package.json`, `render.yaml` and `public`.
2. At github.com click **+**, then **New repository**. Name it `pro-ex`, choose **Public**, click **Create repository**.
3. Click **uploading an existing file**, drag in everything inside the unzipped folder (keep `public`), then **Commit changes**.

### 2. Render (Web Service)
1. Sign in at render.com (you can use GitHub).
2. Click **New**, then **Web Service**.
3. Connect GitHub and pick the `pro-ex` repository.
4. Settings:
   - **Language / Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Click **Create Web Service**. Wait for "Live" (a few minutes).
6. Open the `https://...onrender.com` link at the top.

(Shortcut: **New > Blueprint** and choose the repo to use `render.yaml` automatically.)

### 3. Add to home screen
- **Android (Chrome):** open the link, tap the three dots, then **Install app** / **Add to Home screen**.
- **iPhone (Safari):** open the link in Safari, tap **Share**, then **Add to Home Screen**, then **Add**.

## Good to know
- On Render's Free plan the service sleeps after about 15 minutes without visitors. The first visit afterwards can take up to a minute to wake up. After the app has been opened once, it works offline from the phone.
- Each student's account and data stay on their own device (not on the server).
- To update: upload changed files to GitHub; Render redeploys. If phones show an old version, change the cache name in `public/sw.js` (e.g. `proex-v4` to `proex-v5`).
