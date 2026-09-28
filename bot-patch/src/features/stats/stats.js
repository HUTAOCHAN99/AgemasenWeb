// Pencatat command + endpoint GET /stats untuk dashboard web.
// Env: DATABASE_URL (sudah ada), STATS_TOKEN (baru, wajib), PORT (otomatis dari Railway)
const http = require("http");
const crypto = require("crypto");
const { Pool } = require("pg");

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
const h = (s) => crypto.createHash("sha256").update(String(s)).digest("hex").slice(0, 10);

async function init() {
  if (!pool) return console.log("[stats] DATABASE_URL kosong, statistik nonaktif.");
  await pool.query(`CREATE TABLE IF NOT EXISTS command_log(
    id bigserial PRIMARY KEY, ts timestamptz DEFAULT now(), command text,
    chat_hash text, is_group boolean, ok boolean, ms int)`);
  await pool.query("CREATE INDEX IF NOT EXISTS command_log_ts ON command_log(ts)");
}

// Panggil dari router. Fire-and-forget: tidak pernah mengganggu command.
function logCommand({ command, jid, ok = true, ms = 0 }) {
  if (!pool) return;
  pool.query(
    "INSERT INTO command_log(command,chat_hash,is_group,ok,ms) VALUES($1,$2,$3,$4,$5)",
    [String(command).slice(0, 40), h(jid), String(jid).endsWith("@g.us"), ok, ms],
  ).catch(() => {});
}

async function buildStats() {
  const W = "WHERE ts > now() - interval '7 days'";
  const [t, top, daily] = await Promise.all([
    pool.query(`SELECT count(*) FILTER (WHERE ts > now() - interval '1 day')::int today, count(*)::int week,
      count(*) FILTER (WHERE NOT ok)::int errors,
      count(DISTINCT chat_hash) FILTER (WHERE is_group)::int groups,
      coalesce(avg(ms),0)::int "avgMs" FROM command_log ${W}`),
    pool.query(`SELECT command, count(*)::int n, count(*) FILTER (WHERE NOT ok)::int err
      FROM command_log ${W} GROUP BY 1 ORDER BY n DESC LIMIT 10`),
    pool.query(`SELECT to_char((ts AT TIME ZONE 'Asia/Jakarta')::date,'DD/MM') d, count(*)::int n
      FROM command_log WHERE ts > now() - interval '14 days' GROUP BY (ts AT TIME ZONE 'Asia/Jakarta')::date, 1
      ORDER BY (ts AT TIME ZONE 'Asia/Jakarta')::date`),
  ]);
  return { ...t.rows[0], top: top.rows, daily: daily.rows, uptimeSec: Math.round(process.uptime()) };
}

function startStatsServer() {
  init().catch((e) => console.log("[stats] init gagal:", e.message));
  const token = process.env.STATS_TOKEN;
  if (!token || !pool) return console.log("[stats] STATS_TOKEN/DATABASE_URL kosong, endpoint tidak dibuka.");
  http.createServer(async (req, res) => {
    const auth = Buffer.from(req.headers.authorization || "");
    const want = Buffer.from("Bearer " + token);
    const ok = auth.length === want.length && crypto.timingSafeEqual(auth, want);
    if (req.url !== "/stats" || !ok) { res.writeHead(ok ? 404 : 401); return res.end(); }
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(await buildStats()));
    } catch { res.writeHead(500); res.end(); }
  }).listen(process.env.PORT || 3000, () => console.log("[stats] endpoint /stats aktif"));
}

module.exports = { logCommand, startStatsServer };
