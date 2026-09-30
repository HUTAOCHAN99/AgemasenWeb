// Statistik PUBLIK untuk panel "Aktivitas Server" di halaman utama.
// Beda dengan /api/stats (khusus admin): di sini tidak ada nama grup, nomor
// user, atau data pribadi apa pun. Hanya angka agregat dari respons bot.
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);

module.exports = async (req, res) => {
  const base = (process.env.BOT_STATS_URL || "").replace(/\/$/, "");
  if (!base) return res.status(503).json({ error: "offline" });
  try {
    const r = await fetch(base + "/stats", {
      headers: { Authorization: "Bearer " + (process.env.BOT_STATS_TOKEN || "") },
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return res.status(502).json({ error: "offline" });
    const d = await r.json();

    // Field di bawah ini opsional: kalau bot belum mengirimnya, nilainya null
    // dan kartunya disembunyikan di halaman (tidak ada angka karangan).
    const m = d.messages || {};
    const s = d.sessions || {};
    const top = Array.isArray(d.top) ? d.top.slice(0, 4) : [];

    res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=10");
    res.json({
      online: !!d.botOnline,
      perSec: num(m.perSec),
      peak: num(m.peak),
      received: num(m.received),
      sent: num(m.sent),
      sessionsActive: num(s.active),
      sessionsTotal: num(s.total),
      today: num(d.today),
      load: d.system ? num(d.system.cpuPercent) : null,
      top: top.map((t) => ({ command: String(t.command || ""), n: num(t.n) || 0 })),
      series: Array.isArray(m.series) ? m.series.slice(-40).map((n) => num(n) || 0) : null,
    });
  } catch {
    res.status(502).json({ error: "offline" });
  }
};
