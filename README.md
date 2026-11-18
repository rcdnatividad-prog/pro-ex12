# PRO-EX (PROcastinating EXpenditures)

Daily budget planner and savings tracker for students. Runs as a Render Web Service
(small Node.js server, no extra packages, no secrets). Installable on a phone's home screen.

## Features
- Sign up / log in (name, email, 6-character password)
- Daily plan: total budget, assigned expenses and savings (linked: budget = assigned + savings)
- Automatic savings adjustment: Excess = Actual - Assigned; Adjusted savings = Desired - Excess (never below 0)
- Daily budget summary, savings progress, over/within-budget notifications, edit/delete expenses
- Customizable suggested split (food, transport, school, wants). The default is a general guide, not official data
- 30-day or 10-week savings challenge with streak and history
- Home screen, My Spending Habits, personalized budget plan, Customize My Budget (donut chart, comparison, saved plans), Spending History, light/dark mode
- Desktop view (sidebar and two columns on screens 900px and wider), tablet and phone layouts
- Works offline after the first visit

## Folder structure
```
render.yaml
package.json
server.js
README.md
.gitignore
public/
  index.html
  enhance.css
  enhance.js
  modules.css
  modules.js
  manifest.webmanifest
  sw.js
  icons/ (apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png)
```

## Publish
1. GitHub: new repository, click "uploading an existing file", drag in `public`, `server.js`, `package.json`, `render.yaml`, `README.md` and `.gitignore`, then Commit changes.
2. Render: New > Web Service > pick the repository. Runtime Node, Build Command `npm install`, Start Command `npm start`, Instance Free. Create Web Service.
3. Open the https://...onrender.com link. Android Chrome: menu > Install app. iPhone Safari: Share > Add to Home Screen.

## Updating
Upload changed files to GitHub; Render redeploys. Press Ctrl+Shift+R on the site. If phones show an old version, raise the cache name in `public/sw.js` (for example proex-v7 to proex-v8).
