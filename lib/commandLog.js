// Baca statistik command langsung dari Supabase (tabel command_log yang diisi bot).
// Dipanggil dari sisi SERVER (api/*.js) saja; SUPABASE_SERVICE_KEY tidak pernah
// dikirim ke browser. Fungsi SQL-nya ada di supabase/multi_bot.sql (menggantikan command_log_read.sql lama).
// Kalau env kosong / Supabase error -> return null, pemanggil jatuh balik ke data bot.
const base = () => (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const key = () => process.env.SUPABASE_SERVICE_KEY || "";
const enabled = () => !!(base() && key());

async function rpc(name, args = {}) {
  const r = await fetch(`${base()}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: key(), Authorization: "Bearer " + key(), "Content-Type": "application/json" },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(6000),
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${(await r.text().catch(() => "")).slice(0, 150)}`);
  return r.json();
}

async function safe(name, args) {
  if (!enabled()) return null;
  try { return await rpc(name, args); }
  catch (e) { console.error("[command_log]", e.message); return null; }
}

// { today, week, top[], daily[], perChat[] } atau null.
// MULTI-BOT: botId diisi -> hanya bot itu; kosong -> gabungan semua bot.
const getCommandStats = (botId) => safe("command_stats", { p_bot: botId || null });

// { today, week, total, last, top[] } atau null. chat = jid grup, atau nomor user.
// botId diisi -> hanya command yang dijalankan lewat bot itu.
const getChatCommandStats = (chat, botId) =>
  safe("command_chat_stats", { p_chat: chat, p_bot: botId || null });

// perChat[] -> { groups: {jid: {today,week}}, users: {nomor: {today,week}} }
function indexPerChat(list) {
  const groups = {}, users = {};
  for (const r of Array.isArray(list) ? list : []) {
    const id = String(r.chat_id || "");
    const v = { today: r.today || 0, week: r.week || 0 };
    if (id.endsWith("@g.us")) groups[id] = v;
    else users[id.split("@")[0]] = v;
  }
  return { groups, users };
}

module.exports = { getCommandStats, getChatCommandStats, indexPerChat };
