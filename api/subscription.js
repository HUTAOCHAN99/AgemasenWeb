// Atur langganan satu grup / satu user PADA SATU BOT (khusus admin). Diteruskan
// ke endpoint bot POST /subscription; bot yang menyimpan ke Supabase (service
// key hanya ada di server bot, tidak pernah di Vercel / browser).
// MULTI-BOT: body harus membawa botId, jadi langganan grup yang sama di bot
// lain tidak ikut berubah.
// Body: { botId, type: "group"|"user", id, action: "add"|"set"|"expire", days? }
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
  const okAction = b.action === "add" || b.action === "set" || b.action === "expire";
  const days = Number(b.days);
  const okDays = b.action === "expire" || (Number.isInteger(days) && days >= 1 && days <= 3650);
  if (!okType || !okAction || !okDays) return res.status(400).json({ error: "Parameter tidak valid." });

  try {
    const r = await botFetch(bot, "/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botId: bot.id, type: b.type, id, action: b.action, days: b.action === "expire" ? undefined : days }),
      signal: AbortSignal.timeout(10000),
    });
    const d = await r.json().catch(() => ({}));
    if (r.status === 404) return res.status(404).json({ error: `Grup/user tidak ditemukan di bot "${bot.label}".` });
    if (r.status === 409) return res.status(409).json({ error: `Salah routing: BOT_ID server "${bot.id}" tidak cocok. Cek env BOTS.` });
    // Pesan dari bot (mis. Supabase belum dikonfigurasi) diteruskan apa adanya.
    if (!r.ok) return res.status(r.status === 503 ? 503 : 502).json({ error: d.error || `Bot membalas ${r.status}.` });
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, sub: d.sub || null, botId: bot.id });
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi." });
  }
};
