// Server lokal: melayani public/ dan menjalankan handler di api/ (meniru Vercel).
// Jalankan: node server.js   -> http://localhost:3001
const http = require("http");
const fs = require("fs");
const path = require("path");

// Baca .env.local tanpa dependency
try {
  for (const line of fs.readFileSync(path.join(__dirname, ".env.local"), "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch { console.log("Peringatan: .env.local tidak ditemukan."); }

const PORT = process.env.WEB_PORT || 3001;
const PUB = path.join(__dirname, "public");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const p = decodeURIComponent(url.pathname);

  if (p.startsWith("/api/")) {
    const name = p.slice(5);
    if (!/^[a-z]+$/.test(name) || !fs.existsSync(path.join(__dirname, "api", name + ".js"))) {
      res.writeHead(404); return res.end();
    }
    let raw = "";
    for await (const c of req) raw += c;
    if ((req.headers["content-type"] || "").includes("json")) { try { req.body = JSON.parse(raw); } catch { req.body = {}; } }
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
    try { await require("./api/" + name + ".js")(req, res); }
    catch (e) { console.error(e); if (!res.headersSent) res.status(500).json({ error: "Error server." }); }
    return;
  }

  // file statis, dengan cleanUrls (/admin -> admin.html)
  let file = path.join(PUB, p === "/" ? "index.html" : p);
  if (!file.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end("Not found"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Web lokal: http://localhost:${PORT}  (admin: /admin)`));
