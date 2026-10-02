// Data simulasi chat untuk section "Bot preview" (components/BotPreview.tsx).
// Diport dari Chat-WhatApp-Imitation (app/scenario.js + PEOPLE di page.js).
//
// Format pesan:
// - Pesan pertama (index 0) selalu tampil dulu; sisanya muncul berurutan,
//   dan bot "mengetik" dulu sebelum balasannya muncul.
// - **teks** = tebal, "@Agemasen Bot" = mention hijau.
// - head: true = bubble pertama dari satu pengirim (tampil avatar + nama).
// - type: "image" + image = bubble gambar/GIF; caption = teks di bawah gambar.
// Gambar ada di public/image/preview/.

export type Who = "bot" | "sam";

export type Person = {
  name: string;
  color: string;
  bg: string;
  letter: string;
  avatar: string;
};

export type Msg = {
  id: number;
  from: Who;
  head?: boolean;
  time: string;
  text?: string;
  big?: string;
  quote?: { who: Who; text: string };
  type?: "image";
  image?: string;
  letter?: string;
  caption?: string[];
};

export type ScenarioKey = "chat" | "command";

export const IMG = "/image/preview";

export const PEOPLE: Record<Who, Person> = {
  bot: { name: "Agemasen Bot", color: "#e8c36a", bg: "#c9757d", letter: "A", avatar: `${IMG}/image.webp` },
  sam: { name: "user1", color: "#53bdeb", bg: "#1f3a5f", letter: "U", avatar: "" },
};

export const GROUP = {
  title: "Grup Random",
  members:
    "user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, Agemasen Bot",
  avatar: `${IMG}/image.webp`,
  pinned: "Agemasen:",
  pinnedText: "🎧 Audio",
};

// 1) Skenario ngobrol
const CHAT_SCENARIO: Msg[] = [
  { id: 1, from: "sam", head: true, time: "20:14", text: "@Agemasen Bot halo, lagi ngapain?" },

  { id: 2, from: "bot", head: true, time: "20:14",
    text: "**Special Week mengangkat kepala dari semangkuk nasi.** Hah?! Tiba-tiba nyapa gitu... Lagi makan, lah, apa lagi! 😤 Kenapa, kangen ya?" },

  { id: 3, from: "sam", head: true, time: "20:15", text: "Hehe, kamu tuh imut banget sih" },

  { id: 4, from: "bot", head: true, time: "20:15",
    text: "**Special Week tersedak, lalu buru-buru membuang muka.** H-hah?! Jangan ngomong yang aneh-aneh, dong!" },
  { id: 5, from: "bot", time: "20:15",
    text: "**Telinganya bergerak-gerak pelan.** ...Ya, makasih. Tapi jangan besar kepala dulu!" },

  { id: 6, from: "sam", head: true, time: "07:58",
    quote: { who: "bot", text: "...Ya, makasih. Tapi jangan besar kepala dulu!" },
    text: "@Agemasen Bot Eh, besok ada ujian fisika nih. Rumus energi kinetik apa sih?" },

  { id: 7, from: "bot", head: true, time: "07:58",
    text: "**Special Week langsung menghela napas panjang, lalu memijat pelipisnya dengan ekspresi gemas. Telinga kudanya sedikit turun, tapi ia tetap mendengus sok kesal.** 🤦‍♀️" },
  { id: 8, from: "bot", time: "07:58",
    text: "Hah? Ujian fisika?! Pagi-pagi gini malah nanya rumus fisika, kamu ini kemarin malem begadang mulu sih makanya otaknya korslet!" },
  { id: 9, from: "bot", time: "07:58",
    text: "**Special Week melipat tangan di depan dada sambil menatap layar dengan serius, meskipun nadanya masih ketus.**" },
  { id: 91, from: "bot", time: "07:58",
    text: "Dengerin, ya! Jangan salah paham, aku ngasih tahu bukan berarti aku rajin atau peduli sama nilai fisika kamu. Tapi rumus energi kinetik itu gampang banget, ditulisnya begini:" },
  { id: 92, from: "bot", head: true, time: "07:58", type: "image", image: `${IMG}/rumus-ek.webp`, letter: "Eₖ = ½mv²" },
  { id: 93, from: "bot", head: true, time: "07:58", text: "Di mana" },
  { id: 94, from: "bot", time: "07:58", text: "𝑚" },
  { id: 95, from: "bot", time: "07:58", text: "itu massa benda dan" },
  { id: 96, from: "bot", time: "07:58", text: "𝑣" },
  { id: 97, from: "bot", time: "07:58", text: "itu kecepatan larinya—kayak kita waktu sprint di track lari!" },
  { id: 98, from: "bot", time: "07:58", text: "**Special Week menunjuk-nunjuk layar dengan jari sambil melotot kecil.**" },
  { id: 99, from: "bot", time: "07:58",
    text: "Udah, catat baik-baik tuh! Jangan sampai pas ujian besok kamu malah ngisi jawaban pakai rumus karbit atau ngawur, ya! Belajar yang bener, iyo pemalas! 😤📚✨" },

  { id: 10, from: "sam", head: true, time: "07:59", text: "Makasih Spe-chan", big: "🥕🥕🥕" },

  { id: 11, from: "bot", head: true, time: "07:59",
    quote: { who: "sam", text: "🥕🥕🥕" },
    text: "**Special Week terdiam, wajahnya memerah.** ...Wortelnya aku terima. B-bukan berarti aku senang, ya! 😳" },

  { id: 12, from: "sam", head: true, time: "08:00", text: "!lupain" },
  { id: 13, from: "bot", head: true, time: "08:00",
    text: "🧠 Oke, ingatan obrolan kita sudah dihapus. Mulai dari nol lagi... ya." },
];

// 2) Satu command per kategori
const COMMAND_SCENARIO: Msg[] = [
  // Pencarian gambar
  { id: 1, from: "sam", head: true, time: "20:20", text: "!img special_week_(umamusume)" },
  { id: 2, from: "bot", head: true, time: "20:20", type: "image", image: `${IMG}/image2.webp`, letter: "🖼️",
    caption: [
      "🖼️ Hasil Gambar\n\n👤 Karakter: special_week_(umamusume)\n🔢 Kode Sesi: 4821\n🆔 Kode Gambar: 7312045\n➡️ Ketik 4821 (siapa saja boleh) atau !next untuk gambar lain dari pencarian ini",
    ] },

  // Pencarian GIF
  { id: 3, from: "sam", head: true, time: "20:21", text: "!gif anime reaction" },
  { id: 4, from: "bot", head: true, time: "20:21", type: "image", image: `${IMG}/gif.gif`, letter: "GIF",
    caption: ["🎞️ Hasil GIF (TENOR)\n\n🔎 Keyword: anime reaction\n🔢 Kode Sesi: 5307"] },

  // Stiker
  { id: 5, from: "sam", head: true, time: "20:22", text: "!sbrat capek banget hari ini 😭" },
  { id: 6, from: "bot", head: true, time: "20:22", type: "image", image: `${IMG}/image3.webp`, letter: "capek banget hari ini 😭" },

  // Download media
  { id: 7, from: "sam", head: true, time: "20:23", text: "!dl https://youtu.be/xxxxxxxxxxx mp3" },
  { id: 8, from: "bot", head: true, time: "20:23", text: "🎧 judul-lagu.mp3  (4,2 MB)" },

  // AI upscale
  { id: 9, from: "sam", head: true, time: "20:24", type: "image", image: `${IMG}/image4.webp`, letter: "SD", caption: ["!hd"] },
  { id: 10, from: "bot", head: true, time: "20:24", type: "image", image: `${IMG}/image5.webp`, letter: "HD",
    caption: ["✨ Selesai di-upscale"] },

  // Dokumen
  { id: 11, from: "sam", head: true, time: "20:25", text: "📄 laporan.pdf\n!ringkas fokus ke bagian kesimpulan aja" },
  { id: 12, from: "bot", head: true, time: "20:25",
    text: "**Special Week membolak-balik halaman dengan serius.** Kesimpulannya: ... (ringkasan isi PDF)" },

  // Chat AI
  { id: 13, from: "sam", head: true, time: "20:26", text: "!lupain" },
  { id: 14, from: "bot", head: true, time: "20:26", text: "🧠 Ingatan obrolan sudah dihapus." },

  // Lain-lain
  { id: 15, from: "sam", head: true, time: "20:27", text: "!botstatus" },
  { id: 16, from: "bot", head: true, time: "20:27",
    text: "🤖 **Status Bot**\n\n**Koneksi:** ✅ terhubung\n**Uptime:** 2 hari 4 jam\n**Jumlah grup:** 12 (aktif 11, nonaktif 1)\n**Memori bot:** 184 MB\n**Di grup ini:** ✅ AKTIF" },
];

export const SCENARIOS: Record<ScenarioKey, Msg[]> = {
  chat: CHAT_SCENARIO,
  command: COMMAND_SCENARIO,
};

export const SCENARIO_KEYS: ScenarioKey[] = ["chat", "command"];
