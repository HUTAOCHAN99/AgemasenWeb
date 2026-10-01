// Detail satu grup / satu user (khusus admin). Diteruskan ke endpoint bot
// /group?id=... atau /user?number=...
const { isAuthed } = require("../lib/auth");

module.exports = async (req, res) => {
  if (!isAuthed(req)) return res.status(401).json({ error: "Belum login." });
  const base = (process.env.BOT_STATS_URL || "").replace(/\/$/, "");
  if (!base) return res.status(500).json({ error: "BOT_STATS_URL belum diisi di Vercel." });

  const q = req.query || {};
  const id = String(q.id || "");
  let path;
  if (q.type === "group" && /^[\w.-]{5,60}@g\.us$/.test(id)) path = "/group?id=" + encodeURIComponent(id);
  else if (q.type === "user" && /^\d{5,25}$/.test(id)) path = "/user?number=" + id;
  else return res.status(400).json({ error: "Parameter tidak valid." });

  try {
    const r = await fetch(base + path, {
      headers: { Authorization: "Bearer " + (process.env.BOT_STATS_TOKEN || "") },
      signal: AbortSignal.timeout(10000),
    });
    if (r.status === 404) return res.status(404).json({ error: "Data tidak ditemukan." });
    if (!r.ok) return res.status(502).json({ error: `Bot membalas ${r.status}.` });
    res.setHeader("Cache-Control", "no-store");
    res.json(await r.json());
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi." });
  }
};
