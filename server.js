// Pro Ex - tiny web server (no dependencies). Serves the files in /public.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 10000;
const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname); }
  catch (e) { res.writeHead(400); return res.end("Bad request"); }

  if (urlPath === "/healthz") { res.writeHead(200, { "Content-Type": "text/plain" }); return res.end("ok"); }
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end("Method not allowed"); }
  if (urlPath.endsWith("/")) urlPath += "index.html";

  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403); return res.end("Forbidden"); }

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    const ext = path.extname(file).toLowerCase();
    const headers = {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": (ext === ".html" || file.endsWith("sw.js") || ext === ".webmanifest") ? "no-cache" : "public, max-age=86400"
    };
    res.writeHead(200, headers);
    res.end(req.method === "HEAD" ? undefined : data);
  });
}).listen(PORT, () => console.log("Pro Ex running on port " + PORT));
