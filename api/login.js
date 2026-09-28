const { makeCookie, safeEq } = require("../lib/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Gunakan POST." });
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET)
    return res.status(500).json({ error: "ADMIN_PASSWORD / SESSION_SECRET belum diisi di Vercel." });
  const pw = String((req.body && req.body.password) || "");
  if (!safeEq(pw, process.env.ADMIN_PASSWORD)) {
    await new Promise((r) => setTimeout(r, 700)); // perlambat tebak-tebakan
    return res.status(401).json({ error: "Password salah." });
  }
  res.setHeader("Set-Cookie", makeCookie());
  res.json({ ok: true });
};
