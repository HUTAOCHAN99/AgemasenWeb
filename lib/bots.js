// Daftar bot yang dikelola dashboard ini (MULTI-BOT).
//
// Isi env BOTS dengan JSON array, satu objek per bot / server / nomor WA:
//
//   BOTS=[{"id":"bot1","label":"Bot Utama","url":"https://bot1.up.railway.app","token":"TOKEN1"},
//         {"id":"bot2","label":"Bot Kedua","url":"https://bot2.up.railway.app","token":"TOKEN2"}]
//
//   id     : harus SAMA PERSIS dengan BOT_ID di server bot tersebut
//   label  : nama tampilan di dashboard (opsional)
//   url    : alamat endpoint stats bot (domain publik Railway-nya)
//   token  : harus sama dengan STATS_TOKEN di server bot tersebut
//
// Kompatibel mundur: kalau BOTS kosong, dipakai BOT_STATS_URL +
// BOT_STATS_TOKEN seperti sebelumnya (dianggap 1 bot, id = BOT_ID / "bot1").
const ID_RE = /^[a-z0-9_-]{1,20}$/;

let cached = null;
let cachedKey = null;

function parse() {
  const raw = (process.env.BOTS || "").trim();
  if (raw) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        const seen = new Set();
        const out = [];
        for (const b of arr) {
          const id = String(b?.id || "").trim().toLowerCase();
          const url = String(b?.url || "").trim().replace(/\/+$/, "");
          if (!ID_RE.test(id) || !url || seen.has(id)) continue;
          seen.add(id);
          out.push({ id, label: String(b.label || id).slice(0, 40), url, token: String(b.token || "") });
        }
        return out;
      }
    } catch (e) {
      console.error("[bots] env BOTS bukan JSON yang valid:", e.message);
    }
    return [];
  }
  const url = (process.env.BOT_STATS_URL || "").trim().replace(/\/+$/, "");
  if (!url) return [];
  const id = (process.env.BOT_ID || "bot1").trim().toLowerCase();
  return [{
    id: ID_RE.test(id) ? id : "bot1",
    label: (process.env.BOT_LABEL || "").trim().slice(0, 40) || "Bot",
    url,
    token: process.env.BOT_STATS_TOKEN || "",
  }];
}

function getBots() {
  const key = (process.env.BOTS || "") + "|" + (process.env.BOT_STATS_URL || "") + "|" + (process.env.BOT_STATS_TOKEN || "");
  if (!cached || key !== cachedKey) { cached = parse(); cachedKey = key; }
  return cached;
}

// Cari bot untuk request tulis/detail.
//  - botId diisi -> harus ada di daftar.
//  - botId kosong -> hanya boleh kalau cuma ada 1 bot (perilaku lama).
// Return { bot } atau { error, code }.
function pickBot(botId) {
  const bots = getBots();
  if (!bots.length) return { code: 500, error: "Bot belum dikonfigurasi di web (isi BOTS atau BOT_STATS_URL)." };
  const id = String(botId || "").trim().toLowerCase();
  if (!id) {
    return bots.length === 1
      ? { bot: bots[0] }
      : { code: 400, error: "botId wajib diisi (ada lebih dari satu bot)." };
  }
  const bot = bots.find((b) => b.id === id);
  return bot ? { bot } : { code: 400, error: `Bot "${id}" tidak dikenal.` };
}

// fetch ke endpoint bot tertentu, dengan token milik bot itu.
function botFetch(bot, path, init = {}) {
  return fetch(bot.url + path, {
    ...init,
    headers: { Authorization: "Bearer " + bot.token, ...(init.headers || {}) },
  });
}

module.exports = { getBots, pickBot, botFetch };
