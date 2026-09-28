module.exports = (req, res) => {
  res.setHeader("Set-Cookie", "sess=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
  res.json({ ok: true });
};
