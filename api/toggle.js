// Aktif/nonaktifkan SATU bot untuk satu grup atau satu user (khusus admin).
// MULTI-BOT: body harus membawa botId, supaya yang dimatikan hanya bot (nomor WA)
// yang dimaksud, bukan bot lain di grup yang sama.
// Body: { botId, type: "group"|"user", id, enabled: boolean }
const { isAuthed } = require("../lib/auth");
const { pickBot, botFetch } = require("../lib/bots");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST." });
  if (!isAuthed(req)) return res.status(401).json({ error: "Belum login." });

  const b = req.body || {};
  const picked = pickBot(b.botId);
  if (!picked.bot) return res.status(picked.code).json({ error: picked.error });
  const bot = picked.bot;

  const id = String(b.id || "");
  const okType = b.type === "group" ? /^[\w.-]{5,60}@g\.us$/.test(id) : b.type === "user" ? /^\d{5,25}$/.test(id) : false;
  if (!okType || typeof b.enabled !== "boolean") return res.status(400).json({ error: "Parameter tidak valid." });

  try {
    const r = await botFetch(bot, "/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botId: bot.id, type: b.type, id, enabled: b.enabled }),
      signal: AbortSignal.timeout(8000),
    });
    if (r.status === 404) return res.status(404).json({ error: `Grup/user tidak ditemukan di bot "${bot.label}".` });
    if (r.status === 409) return res.status(409).json({ error: `Salah routing: BOT_ID server "${bot.id}" tidak cocok. Cek env BOTS.` });
    if (!r.ok) return res.status(502).json({ error: `Bot membalas ${r.status}.` });
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, enabled: b.enabled, botId: bot.id });
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi." });
  }
};
