const crypto = require("crypto");
const sign = (v) => crypto.createHmac("sha256", process.env.SESSION_SECRET || "").update(v).digest("hex");
const hash = (s) => crypto.createHash("sha256").update(String(s)).digest();

function safeEq(a, b) { return crypto.timingSafeEqual(hash(a), hash(b)); }

function makeCookie() {
  const exp = String(Date.now() + 12 * 3600e3);
  return `sess=${exp}.${sign(exp)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`;
}

function isAuthed(req) {
  const m = /(?:^|; )sess=([^;]+)/.exec(req.headers.cookie || "");
  if (!m || !process.env.SESSION_SECRET) return false;
  const [exp, sig] = m[1].split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEq(sig, sign(exp));
}

module.exports = { makeCookie, isAuthed, safeEq };
