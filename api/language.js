// Atur bahasa bot untuk satu grup / satu user PADA SATU BOT (khusus admin).
// Diteruskan ke endpoint bot POST /language; bot yang menyimpan ke Supabase
// (service key hanya ada di server bot, tidak pernah di Vercel / browser).
// Body: { botId, type: "group"|"user", id, lang: "id"|"en"|"default" }
// "default" = hapus pengaturan, chat kembali ke bahasa bawaan bot.
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
  const lang = String(b.lang || "");
  if (!okType || !/^[a-z]{2,8}$/.test(lang)) return res.status(400).json({ error: "Parameter tidak valid." });

  try {
    const r = await botFetch(bot, "/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botId: bot.id, type: b.type, id, lang }),
      signal: AbortSignal.timeout(10000),
    });
    const d = await r.json().catch(() => ({}));
    if (r.status === 404) return res.status(404).json({ error: `Grup/user tidak ditemukan di bot "${bot.label}".` });
    if (r.status === 409) return res.status(409).json({ error: `Salah routing: BOT_ID server "${bot.id}" tidak cocok. Cek env BOTS.` });
    // Pesan dari bot (mis. Supabase belum dikonfigurasi, bahasa tidak didukung) diteruskan apa adanya.
    if (!r.ok) return res.status(r.status === 503 || r.status === 400 ? r.status : 502).json({ error: d.error || `Bot membalas ${r.status}.` });
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, language: d.language || null, botId: bot.id });
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi." });
  }
};
