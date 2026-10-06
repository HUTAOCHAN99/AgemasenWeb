// Statistik PUBLIK untuk panel "Aktivitas Server" di halaman utama.
// Beda dengan /api/stats (khusus admin): di sini tidak ada nama grup, nomor
// user, atau data pribadi apa pun. Hanya angka agregat dari respons bot.
const { getCommandStats } = require("../lib/commandLog");
const { getBots, botFetch } = require("../lib/bots");
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);

// MULTI-BOT: angka dari semua bot dijumlahkan jadi satu panel publik.
// "online" = minimal satu bot terhubung. CPU/RAM/uptime diambil dari bot
// pertama yang online (panel publik hanya menampilkan satu server).
const sum = (a, b) => (a == null ? b : b == null ? a : a + b);

async function loadOne(bot) {
  try {
    const r = await botFetch(bot, "/stats", { signal: AbortSignal.timeout(6000) });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  const bots = getBots();
  if (!bots.length) return res.status(503).json({ error: "offline" });
  try {
    const list = (await Promise.all(bots.map(loadOne))).filter(Boolean);
    if (!list.length) return res.status(502).json({ error: "offline" });
    const lead = list.find((x) => x.botOnline) || list[0];
    const d = lead;

    let perSec = null, peak = null, received = null, sent = null, active = null, total = null, todayBot = 0;
    let series = null;
    const topBot = new Map();
    for (const x of list) {
      const m = x.messages || {}, s = x.sessions || {};
      perSec = sum(perSec, num(m.perSec));
      peak = sum(peak, num(m.peak));
      received = sum(received, num(m.received));
      sent = sum(sent, num(m.sent));
      active = sum(active, num(s.active));
      total = sum(total, num(s.total));
      todayBot += num(x.today) || 0;
      for (const t of Array.isArray(x.top) ? x.top : []) topBot.set(t.command, (topBot.get(t.command) || 0) + (num(t.n) || 0));
      if (Array.isArray(m.series)) {
        const cur = m.series.slice(-40).map((n) => num(n) || 0);
        if (!series) series = cur;
        else { // jumlahkan elemen dari belakang (titik waktu terbaru sejajar)
          const len = Math.max(series.length, cur.length);
          const a = Array(len - series.length).fill(0).concat(series);
          const b = Array(len - cur.length).fill(0).concat(cur);
          series = a.map((v, i) => v + b[i]);
        }
      }
    }

    const sy = d.system || {};
    const system = d.system
      ? {
          cpuPercent: num(sy.cpuPercent),
          cpuModel: sy.cpuModel ? String(sy.cpuModel).slice(0, 80) : null,
          cpuCores: num(sy.cpuCores),
          totalMem: num(sy.totalMem),
          heapUsed: num(sy.heapUsed),
          heapTotal: num(sy.heapTotal),
          external: num(sy.external),
          arrayBuffers: num(sy.arrayBuffers),
          node: sy.node ? String(sy.node).slice(0, 20) : null,
          os: sy.os ? String(sy.os).slice(0, 20) : null,
          arch: sy.arch ? String(sy.arch).slice(0, 20) : null,
        }
      : null;

    // today & top dari Supabase (semua bot digabung, p_bot = null); jatuh balik ke angka bot.
    const cmd = await getCommandStats();
    const todayVal = cmd ? cmd.today : todayBot;
    const topSrc = cmd
      ? cmd.top
      : [...topBot].map(([command, n]) => ({ command, n })).sort((a, b) => b.n - a.n);
    const top = Array.isArray(topSrc) ? topSrc.slice(0, 4) : [];

    res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=10");
    res.json({
      online: list.some((x) => x.botOnline),
      perSec, peak, received, sent,
      sessionsActive: active,
      sessionsTotal: total,
      today: num(todayVal),
      uptimeSec: num(d.uptimeSec),
      system,
      load: d.system ? num(d.system.cpuPercent) : null,
      top: top.map((t) => ({ command: String(t.command || ""), n: num(t.n) || 0 })),
      series,
    });
  } catch {
    res.status(502).json({ error: "offline" });
  }
};
