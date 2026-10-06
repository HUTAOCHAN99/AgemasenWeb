const { isAuthed } = require("../lib/auth");
const { getCommandStats, indexPerChat } = require("../lib/commandLog");

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
    const d = await r.json();

    // Data command dibaca dari Supabase (command_log). Kalau gagal / belum diatur,
    // angka dari bot tetap dipakai apa adanya.
    const cmd = await getCommandStats();
    if (cmd) {
      const pc = indexPerChat(cmd.perChat);
      d.today = cmd.today; d.week = cmd.week; d.top = cmd.top; d.daily = cmd.daily;
      for (const g of d.groups || []) { g.cmdToday = pc.groups[g.id]?.today || 0; g.cmd7 = pc.groups[g.id]?.week || 0; }
      for (const u of d.users || []) u.cmdToday = pc.users[u.number]?.today || 0;
    }
    d.commandSource = cmd ? "supabase" : "bot";

    res.setHeader("Cache-Control", "no-store");
    res.json(d);
  } catch {
    res.status(502).json({ error: "Bot tidak bisa dihubungi. Cek BOT_STATS_URL dan pastikan bot menyala." });
  }
};
