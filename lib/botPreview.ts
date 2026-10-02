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
// Teks percakapan tersedia per bahasa (id/en); nama command bot (!img, !lupain, dst.)
// sengaja tidak diterjemahkan karena itu command asli bot.

import type { Lang } from "@/lib/i18n";

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

const GROUP_ID = {
  title: "Grup Random",
  members:
    "user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, Agemasen Bot",
  avatar: `${IMG}/image.webp`,
  pinned: "Agemasen:",
  pinnedText: "🎧 Audio",
};

const GROUP_EN: typeof GROUP_ID = {
  ...GROUP_ID,
  title: "Random Group",
};

export const GROUP: Record<Lang, typeof GROUP_ID> = { id: GROUP_ID, en: GROUP_EN };

// 1) Skenario ngobrol
const CHAT_ID: Msg[] = [
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
const COMMAND_ID: Msg[] = [
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

// ---------------------------------------------------------------------------
// English
// ---------------------------------------------------------------------------

// 1) Chat scenario
const CHAT_EN: Msg[] = [
  { id: 1, from: "sam", head: true, time: "20:14", text: "@Agemasen Bot hey, what are you up to?" },

  { id: 2, from: "bot", head: true, time: "20:14",
    text: "**Special Week lifts her head from a bowl of rice.** Huh?! Greeting me out of nowhere... I'm eating, obviously! 😤 What, did you miss me?" },

  { id: 3, from: "sam", head: true, time: "20:15", text: "Hehe, you're so cute, you know that?" },

  { id: 4, from: "bot", head: true, time: "20:15",
    text: "**Special Week chokes, then hurriedly looks away.** W-what?! Don't say weird things like that!" },
  { id: 5, from: "bot", time: "20:15",
    text: "**Her ears twitch softly.** ...Well, thanks. But don't let it go to your head!" },

  { id: 6, from: "sam", head: true, time: "07:58",
    quote: { who: "bot", text: "...Well, thanks. But don't let it go to your head!" },
    text: "@Agemasen Bot Hey, I've got a physics exam tomorrow. What's the kinetic energy formula again?" },

  { id: 7, from: "bot", head: true, time: "07:58",
    text: "**Special Week lets out a long sigh and rubs her temples, clearly exasperated. Her horse ears droop a little, but she still huffs like she's annoyed.** 🤦‍♀️" },
  { id: 8, from: "bot", time: "07:58",
    text: "Huh? A physics exam?! Asking about physics formulas first thing in the morning... no wonder your brain's fried, you stayed up all night again!" },
  { id: 9, from: "bot", time: "07:58",
    text: "**Special Week folds her arms and stares at the screen seriously, though her tone is still sharp.**" },
  { id: 91, from: "bot", time: "07:58",
    text: "Listen up! Don't get the wrong idea, I'm not telling you this because I'm diligent or because I care about your physics grade. But the kinetic energy formula is super easy, you write it like this:" },
  { id: 92, from: "bot", head: true, time: "07:58", type: "image", image: `${IMG}/rumus-ek.webp`, letter: "Eₖ = ½mv²" },
  { id: 93, from: "bot", head: true, time: "07:58", text: "Where" },
  { id: 94, from: "bot", time: "07:58", text: "𝑚" },
  { id: 95, from: "bot", time: "07:58", text: "is the object's mass and" },
  { id: 96, from: "bot", time: "07:58", text: "𝑣" },
  { id: 97, from: "bot", time: "07:58", text: "is its running speed, just like when we sprint on the track!" },
  { id: 98, from: "bot", time: "07:58", text: "**Special Week jabs a finger at the screen with a tiny glare.**" },
  { id: 99, from: "bot", time: "07:58",
    text: "Now write it down properly! Don't you dare make up some random formula in the exam tomorrow! Study hard, you lazybones! 😤📚✨" },

  { id: 10, from: "sam", head: true, time: "07:59", text: "Thanks Spe-chan", big: "🥕🥕🥕" },

  { id: 11, from: "bot", head: true, time: "07:59",
    quote: { who: "sam", text: "🥕🥕🥕" },
    text: "**Special Week freezes, her face turning red.** ...I'll accept the carrots. I-it doesn't mean I'm happy, okay! 😳" },

  { id: 12, from: "sam", head: true, time: "08:00", text: "!lupain" },
  { id: 13, from: "bot", head: true, time: "08:00",
    text: "🧠 Okay, our chat memory has been cleared. Starting from scratch again... I guess." },
];

// 2) One command per category
const COMMAND_EN: Msg[] = [
  // Image search
  { id: 1, from: "sam", head: true, time: "20:20", text: "!img special_week_(umamusume)" },
  { id: 2, from: "bot", head: true, time: "20:20", type: "image", image: `${IMG}/image2.webp`, letter: "🖼️",
    caption: [
      "🖼️ Image Result\n\n👤 Character: special_week_(umamusume)\n🔢 Session Code: 4821\n🆔 Image Code: 7312045\n➡️ Type 4821 (anyone can) or !next for another image from this search",
    ] },

  // GIF search
  { id: 3, from: "sam", head: true, time: "20:21", text: "!gif anime reaction" },
  { id: 4, from: "bot", head: true, time: "20:21", type: "image", image: `${IMG}/gif.gif`, letter: "GIF",
    caption: ["🎞️ GIF Result (TENOR)\n\n🔎 Keyword: anime reaction\n🔢 Session Code: 5307"] },

  // Sticker
  { id: 5, from: "sam", head: true, time: "20:22", text: "!sbrat so tired today 😭" },
  { id: 6, from: "bot", head: true, time: "20:22", type: "image", image: `${IMG}/image3en.webp`, letter: "so tired today 😭" },

  // Media download
  { id: 7, from: "sam", head: true, time: "20:23", text: "!dl https://youtu.be/xxxxxxxxxxx mp3" },
  { id: 8, from: "bot", head: true, time: "20:23", text: "🎧 song-title.mp3  (4.2 MB)" },

  // AI upscale
  { id: 9, from: "sam", head: true, time: "20:24", type: "image", image: `${IMG}/image4.webp`, letter: "SD", caption: ["!hd"] },
  { id: 10, from: "bot", head: true, time: "20:24", type: "image", image: `${IMG}/image5.webp`, letter: "HD",
    caption: ["✨ Upscale complete"] },

  // Document
  { id: 11, from: "sam", head: true, time: "20:25", text: "📄 report.pdf\n!ringkas focus on the conclusion only" },
  { id: 12, from: "bot", head: true, time: "20:25",
    text: "**Special Week flips through the pages seriously.** The conclusion: ... (summary of the PDF's contents)" },

  // AI chat
  { id: 13, from: "sam", head: true, time: "20:26", text: "!lupain" },
  { id: 14, from: "bot", head: true, time: "20:26", text: "🧠 Chat memory has been cleared." },

  // Misc
  { id: 15, from: "sam", head: true, time: "20:27", text: "!botstatus" },
  { id: 16, from: "bot", head: true, time: "20:27",
    text: "🤖 **Bot Status**\n\n**Connection:** ✅ connected\n**Uptime:** 2 days 4 hours\n**Groups:** 12 (11 active, 1 inactive)\n**Bot memory:** 184 MB\n**In this group:** ✅ ACTIVE" },
];

export const SCENARIOS: Record<Lang, Record<ScenarioKey, Msg[]>> = {
  id: { chat: CHAT_ID, command: COMMAND_ID },
  en: { chat: CHAT_EN, command: COMMAND_EN },
};

export const SCENARIO_KEYS: ScenarioKey[] = ["chat", "command"];