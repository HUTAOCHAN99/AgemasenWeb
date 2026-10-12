// Status koneksi + QR login SEMUA bot (khusus admin), untuk scan lewat web.
// Tiap bot dipanggil paralel ke GET /qr. QR itu setara kunci login WhatsApp,
// jadi endpoint ini wajib login admin dan tidak boleh di-cache.
const { isAuthed } = require("../lib/auth");
const { getBots, botFetch } = require("../lib/bots");

async function loadOne(bot) {
  const base = { id: bot.id, label: bot.label };
  try {
    const r = await botFetch(bot, `/qr?botId=${encodeURIComponent(bot.id)}`, { signal: AbortSignal.timeout(6000) });
    if (r.status === 409) return { ...base, reachable: false, error: `Salah routing: BOT_ID server tidak cocok dengan "${bot.id}".` };
    if (r.status === 401) return { ...base, reachable: false, error: "Token ditolak bot. Cek STATS_TOKEN." };
    if (r.status === 404) return { ...base, reachable: false, error: "Bot belum memakai versi terbaru (endpoint /qr belum ada). Deploy ulang bot." };
    if (!r.ok) return { ...base, reachable: false, error: `Bot membalas ${r.status}.` };
    const d = await r.json();
    return {
      ...base,
      reachable: true,
      status: String(d.status || "starting"),
      qr: typeof d.qr === "string" ? d.qr : null,
      qrAt: Number(d.qrAt) || null,
      number: d.number ? String(d.number) : null,
    };
  } catch {
    return { ...base, reachable: false, error: "Bot tidak bisa dihubungi." };
  }
}

module.exports = async (req, res) => {
  if (!isAuthed(req)) return res.status(401).json({ error: "Belum login." });
  const bots = getBots();
  if (!bots.length) return res.status(500).json({ error: "Bot belum dikonfigurasi di web (isi BOTS atau BOT_STATS_URL)." });
  res.setHeader("Cache-Control", "no-store");
  res.json({ bots: await Promise.all(bots.map(loadOne)) });
};
