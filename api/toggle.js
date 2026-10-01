// Aktif/nonaktifkan bot untuk satu grup atau satu user (khusus admin).
// Body: { type: "group"|"user", id, enabled: boolean }
const { isAuthed } = require("../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST." });
  if (!isAuthed(req)) return res.status(401).json({ error: "Belum login." });
  const base = (process.env.BOT_STATS_URL || "").replace(/\/$/, "");
  if (!base) return res.status(500).json({ error: "BOT_STATS_URL belum diisi di Vercel." });

  const b = req.body || {};
  const id = String(b.id || "");
  const okType = b.type === "group" ? /^[\w.-]{5,60}@g\.us$/.test(id) : b.type === "user" ? /^\d{5,25}$/.test(id) : false;
  if (!okType || typeof b.enabled !== "boolean") return res.status(400).json({ error: "Parameter tidak valid." });

  try {
    const r = await fetch(base + "/toggle", {
      method: "POST",
      headers: { Authorization: "Bearer " + (process.env.BOT_STATS_TOKEN || ""), "Content-Type": "application/json" },
      body: JSON.stringify({ type: b.type, id, enabled: b.enabled }),
      signal: AbortSignal.timeout(8000),
    });
    if (r.status === 404) return res.status(404).json({ error: "Grup/user tidak ditemukan di bot." });
    if (!r.ok) return res.status(502).json({ error: `Bot membalas ${r.status}.` });
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, enabled: b.enabled });
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi." });
  }
};
