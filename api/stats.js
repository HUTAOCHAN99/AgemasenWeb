const { isAuthed } = require("../lib/auth");

module.exports = async (req, res) => {
  if (!isAuthed(req)) return res.status(401).json({ error: "Belum login." });
  const base = (process.env.BOT_STATS_URL || "").replace(/\/$/, "");
  if (!base) return res.status(500).json({ error: "BOT_STATS_URL belum diisi di Vercel." });
  try {
    const r = await fetch(base + "/stats", {
      headers: { Authorization: "Bearer " + (process.env.BOT_STATS_TOKEN || "") },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return res.status(502).json({ error: `Bot membalas ${r.status}. Cek BOT_STATS_TOKEN.` });
    res.setHeader("Cache-Control", "no-store");
    res.json(await r.json());
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi. Cek BOT_STATS_URL dan pastikan bot menyala." });
  }
};
