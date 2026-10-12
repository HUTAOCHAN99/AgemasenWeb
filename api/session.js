// Sambung ulang / reset sesi WhatsApp SATU bot (khusus admin).
//   action "restart": sambung ulang memakai sesi yang ada
//   action "reset"  : hapus sesi login lalu minta QR baru (ganti nomor / relogin)
// Body: { botId, action: "restart"|"reset" }
const { isAuthed } = require("../lib/auth");
const { pickBot, botFetch } = require("../lib/bots");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST." });
  if (!isAuthed(req)) return res.status(401).json({ error: "Belum login." });

  const b = req.body || {};
  const picked = pickBot(b.botId);
  if (!picked.bot) return res.status(picked.code).json({ error: picked.error });
  const bot = picked.bot;
  if (b.action !== "restart" && b.action !== "reset") return res.status(400).json({ error: "Parameter tidak valid." });

  try {
    const r = await botFetch(bot, "/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botId: bot.id, action: b.action }),
      signal: AbortSignal.timeout(8000),
    });
    if (r.status === 409) return res.status(409).json({ error: `Salah routing: BOT_ID server "${bot.id}" tidak cocok. Cek env BOTS.` });
    if (r.status === 404) return res.status(502).json({ error: "Bot belum memakai versi terbaru. Deploy ulang bot." });
    if (!r.ok) return res.status(502).json({ error: `Bot membalas ${r.status}.` });
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, action: b.action, botId: bot.id });
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi." });
  }
};
