// Detail satu grup / satu user pada SATU bot tertentu (khusus admin).
// Query: type=group|user, id, botId. Diteruskan ke endpoint bot
// /group?id=... atau /user?number=...
const { isAuthed } = require("../lib/auth");
const { pickBot, botFetch } = require("../lib/bots");
const { getChatCommandStats } = require("../lib/commandLog");

module.exports = async (req, res) => {
  if (!isAuthed(req)) return res.status(401).json({ error: "Belum login." });

  const q = req.query || {};
  const picked = pickBot(q.botId);
  if (!picked.bot) return res.status(picked.code).json({ error: picked.error });
  const bot = picked.bot;

  const id = String(q.id || "");
  const who = "&botId=" + encodeURIComponent(bot.id);
  let path;
  if (q.type === "group" && /^[\w.-]{5,60}@g\.us$/.test(id)) path = "/group?id=" + encodeURIComponent(id) + who;
  else if (q.type === "user" && /^\d{5,25}$/.test(id)) path = "/user?number=" + id + who;
  else return res.status(400).json({ error: "Parameter tidak valid." });

  try {
    const r = await botFetch(bot, path, { signal: AbortSignal.timeout(10000) });
    if (r.status === 404) return res.status(404).json({ error: "Data tidak ditemukan." });
    if (r.status === 409) return res.status(409).json({ error: `Salah routing: BOT_ID server "${bot.id}" tidak cocok. Cek env BOTS.` });
    if (!r.ok) return res.status(502).json({ error: `Bot membalas ${r.status}.` });
    const d = await r.json();
    const cmd = await getChatCommandStats(id, bot.id); // id = jid grup atau nomor user
    if (cmd) d.commands = cmd;
    d.botId = bot.id;
    res.setHeader("Cache-Control", "no-store");
    res.json(d);
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi." });
  }
};
