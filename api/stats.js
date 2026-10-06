// Statistik admin untuk SEMUA bot (MULTI-BOT). Tiap bot dipanggil paralel,
// hasilnya digabung, dan setiap grup/user diberi botId/botLabel supaya
// dashboard tahu baris itu milik bot (nomor WA) yang mana.
const { isAuthed } = require("../lib/auth");
const { getBots, botFetch } = require("../lib/bots");
const { getCommandStats, indexPerChat } = require("../lib/commandLog");

const sumBy = (list, key) => list.reduce((s, x) => s + (Number(x?.[key]) || 0), 0);

// Gabungkan ringkasan command beberapa bot: today/week dijumlah, top & daily
// dijumlahkan per command / per tanggal.
function mergeCmd(list) {
  const top = new Map();
  const daily = new Map();
  for (const c of list) {
    for (const t of c.top || []) top.set(t.command, (top.get(t.command) || 0) + (Number(t.n) || 0));
    for (const d of c.daily || []) daily.set(d.d, (daily.get(d.d) || 0) + (Number(d.n) || 0));
  }
  return {
    today: sumBy(list, "today"),
    week: sumBy(list, "week"),
    top: [...top].map(([command, n]) => ({ command, n })).sort((a, b) => b.n - a.n).slice(0, 10),
    // urutan tanggal dipertahankan sesuai kemunculan pertama (sudah urut dari sumbernya);
    // kalau digabung dari beberapa bot, urutkan lagi lewat awal pemanggilan di bawah.
    daily: [...daily].map(([d, n]) => ({ d, n })),
  };
}

// "DD/MM" -> kunci urut (bulan*100+hari); "YYYY-MM-DD" -> angka tanggalnya.
const dayKey = (d) => {
  const s = String(d);
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]);
  m = /^(\d{2})\/(\d{2})/.exec(s);
  return m ? Number(m[2]) * 100 + Number(m[1]) : 0;
};

async function loadBot(bot) {
  try {
    const r = await botFetch(bot, "/stats", { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return { bot, error: `Bot membalas ${r.status}. Cek token.` };
    return { bot, data: await r.json() };
  } catch {
    return { bot, error: "Bot tidak bisa dihubungi." };
  }
}

module.exports = async (req, res) => {
  if (!isAuthed(req)) return res.status(401).json({ error: "Belum login." });
  const bots = getBots();
  if (!bots.length) return res.status(500).json({ error: "Bot belum dikonfigurasi di web (isi BOTS atau BOT_STATS_URL)." });

  // Data bot + data command dari Supabase (per bot), semuanya paralel.
  const [results, cmds] = await Promise.all([
    Promise.all(bots.map(loadBot)),
    Promise.all(bots.map((b) => getCommandStats(b.id))),
  ]);

  const okCount = results.filter((r) => r.data).length;
  if (!okCount) {
    const msg = bots.length === 1
      ? (results[0].error === "Bot tidak bisa dihubungi."
          ? "Bot tidak bisa dihubungi. Cek BOT_STATS_URL dan pastikan bot menyala."
          : results[0].error)
      : "Tidak ada bot yang bisa dihubungi: " + results.map((r) => `${r.bot.id} (${r.error})`).join(", ");
    return res.status(502).json({ error: msg });
  }

  const groups = [], users = [], botList = [], cmdParts = [];
  let totalMembers = 0, supabaseUsed = false;

  results.forEach((r, i) => {
    const { bot } = r;
    const cmd = cmds[i];
    if (!r.data) {
      botList.push({ id: bot.id, label: bot.label, number: null, online: false, error: r.error });
      return;
    }
    const d = r.data;
    const pc = cmd ? indexPerChat(cmd.perChat) : null;
    if (cmd) supabaseUsed = true;
    const tag = { botId: bot.id, botLabel: d.botLabel || bot.label, botNumber: d.botNumber || null };

    for (const g of d.groups || []) {
      groups.push({
        ...g, ...tag,
        ...(pc ? { cmdToday: pc.groups[g.id]?.today || 0, cmd7: pc.groups[g.id]?.week || 0 } : {}),
      });
    }
    for (const u of d.users || []) {
      users.push({ ...u, ...tag, ...(pc ? { cmdToday: pc.users[u.number]?.today || 0 } : {}) });
    }

    // command: Supabase kalau ada, kalau tidak angka dari bot itu sendiri.
    const part = cmd
      ? { today: cmd.today, week: cmd.week, top: cmd.top, daily: cmd.daily }
      : { today: d.today, week: d.week, top: d.top, daily: d.daily };
    const merged = mergeCmd([part]);
    cmdParts.push(part);
    totalMembers += Number(d.totalMembers) || 0;

    botList.push({
      id: bot.id,
      label: tag.botLabel,
      number: tag.botNumber,
      online: !!d.botOnline,
      uptimeSec: d.uptimeSec ?? null,
      system: d.system ?? null,
      subscriptionEnabled: d.subscriptionEnabled ?? null,
      totalMembers: Number(d.totalMembers) || 0,
      groups: (d.groups || []).length,
      users: (d.users || []).length,
      today: merged.today, week: merged.week, top: merged.top, daily: merged.daily,
    });
  });

  const all = mergeCmd(cmdParts);
  all.daily.sort((a, b) => dayKey(a.d) - dayKey(b.d));
  for (const b of botList) if (b.daily) b.daily.sort((x, y) => dayKey(x.d) - dayKey(y.d));

  const firstOk = botList.find((b) => b.online) || botList.find((b) => b.system) || botList[0];

  res.setHeader("Cache-Control", "no-store");
  res.json({
    bots: botList,
    botOnline: botList.some((b) => b.online),
    uptimeSec: firstOk?.uptimeSec ?? null,
    system: firstOk?.system ?? null,
    totalMembers,
    groups: groups.sort((a, b) => (b.members || 0) - (a.members || 0)),
    users: users.sort((a, b) => String(b.lastSeen).localeCompare(String(a.lastSeen))),
    today: all.today, week: all.week, top: all.top, daily: all.daily,
    commandSource: supabaseUsed ? "supabase" : "bot",
  });
};
