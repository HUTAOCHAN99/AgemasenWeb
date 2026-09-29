const { SECURE } = require("../lib/auth");
module.exports = (req, res) => {
  res.setHeader("Set-Cookie", `sess=; HttpOnly${SECURE}; SameSite=Strict; Path=/; Max-Age=0`);
  res.json({ ok: true });
};
