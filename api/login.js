const { makeCookie, safeEq } = require("../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST." });
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET)
    return res.status(500).json({ error: "ADMIN_USERNAME / ADMIN_PASSWORD / SESSION_SECRET belum diisi di Vercel." });
  const user = String((req.body && req.body.username) || "").trim();
  const pw = String((req.body && req.body.password) || "");
  // Dua-duanya selalu diperiksa supaya tidak bocor mana yang salah.
  const okUser = safeEq(user, process.env.ADMIN_USERNAME);
  const okPw = safeEq(pw, process.env.ADMIN_PASSWORD);
  if (!(okUser && okPw)) {
    await new Promise((r) => setTimeout(r, 700)); // perlambat tebak-tebakan
    return res.status(401).json({ error: "Username atau password salah." });
  }
  res.setHeader("Set-Cookie", makeCookie());
  res.json({ ok: true });
};
