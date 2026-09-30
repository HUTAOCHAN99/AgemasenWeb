// Kamus dua bahasa (Indonesia & Inggris).
// Aturan: `id` = tampilan situs yang sekarang, apa adanya. `en` = terjemahan
// bagian yang berbahasa Indonesia; teks yang sudah berbahasa Inggris tetap sama.
// Mau mengubah kata-kata? Cukup edit file ini.

export type Lang = "id" | "en";

export const LANGS: readonly Lang[] = ["id", "en"];
export const DEFAULT_LANG: Lang = "id";
export const STORAGE_KEY = "agemasen-lang";

export function isLang(v: unknown): v is Lang {
  return v === "id" || v === "en";
}

export type FeatureKey =
  | "sticker"
  | "downloader"
  | "hd"
  | "search"
  | "articles"
  | "chat";

const id = {
  meta: {
    title: "Agemasen — Bot WhatsApp untuk hari-harimu yang berantakan",
    description:
      "Bot WhatsApp untuk bikin stiker, download video, perbesar foto jadi HD, cari gambar dan GIF, sampai ngobrol dengan karakter tsundere. Proyek penggemar bertema Uma Musume.",
  },
  skip: "Lewati ke konten",
  theme: {
    toLight: "Ganti ke tema terang",
    toDark: "Ganti ke tema gelap",
  },
  lang: {
    group: "Bahasa",
    id: "Bahasa Indonesia",
    en: "English",
  },
  nav: {
    label: "Navigasi utama",
    features: "Features",
    about: "About",
    howTo: "How to use",
    commands: "Commands",
    github: "GitHub",
    tagline: "WhatsApp bot / community assistant",
    addBot: "Add bot",
    addToWa: "Add to WhatsApp",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
  },
  hero: {
    badge: "Anime community bot",
    status: "System ready",
    tagline: ["Your favorite", "WhatsApp bot,", "powered by chaos."],
    body: "Bikin stiker, download video, perbesar foto jadi HD, cari gambar dan GIF, sampai ngobrol dengan bot tsundere. Semuanya langsung dari chat WhatsApp.",
    cta: "Add to WhatsApp",
    explore: "Explore features",
    metaCommands: "commands",
    metaBot: "WhatsApp bot",
    metaCommunity: "Community project",
    alt: "Special Week, karakter Uma Musume yang menjadi maskot Agemasen",
    featured: "Featured bot",
  },
  about: {
    label: "About Agemasen",
    heading: ["Not just", "a bot."],
    lead: "Agemasen mengumpulkan alat harian di satu chat: stiker, unduhan, foto HD, pencarian gambar, sampai ringkasan obrolan grup.",
    body: "Semuanya jalan langsung dari WhatsApp, di grup maupun chat pribadi. Sifatnya galak, tapi selalu bantuin.",
    stats: {
      commands: { label: "Commands", note: "Ketik !menu untuk daftar terbaru." },
      prefix: { label: "One prefix", note: "Semua command diawali tanda seru." },
      apps: { label: "Apps to install", note: "Cukup WhatsApp yang sudah ada." },
    },
  },
  features: {
    label: "Features",
    heading: ["One bot.", "Many things", "to do."],
    noteBefore:
      "Klik kartu untuk melihat cara pakai tiap command. Untuk versi paling baru, ketik ",
    noteAfter: " di chat.",
    cardLink: "lihat cara pakai",
    commandList: "Command",
    tutorial: {
      label: "Cara pakai",
      example: "Contoh",
      tip: "Catatan",
      others: "Fitur lainnya",
      close: "Tutup",
      allCommands: "Lihat semua command",
    },
    items: {
      sticker: {
        title: "Sticker & Meme",
        description:
          "Ubah gambar atau video jadi stiker, tulis teks meme, atau bikin stiker chat dan brat.",
      },
      downloader: {
        title: "Downloader",
        description: "Tempel link, bot kirim videonya balik ke chat.",
      },
      hd: {
        title: "HD Photo",
        description: "Foto kecil atau buram dipertajam jadi HD.",
      },
      search: {
        title: "Image & GIF Search",
        description:
          "Cari dari Safebooru, Pinterest, dan Tenor tanpa keluar dari WhatsApp.",
      },
      articles: {
        title: "Articles & Summary",
        description:
          "Cari artikel jurnal terbuka dan ringkas obrolan grup yang kelewat.",
      },
      chat: {
        title: "Tsundere Chat",
        description:
          "Ngobrol dengan AI berkarakter tsundere yang ingat konteks obrolan.",
      },
    } satisfies Record<FeatureKey, { title: string; description: string }>,
  },
  mascot: {
    label: "Meet the mascot",
    heading: ["Special", "Week"],
    lines: ["Cheerful.", "Energetic.", "Always ready to run."],
    body: "Karakter dan artwork Special Week dipakai sebagai wajah visual Agemasen dalam semangat proyek penggemar. Hak ciptanya tetap milik pemegang haknya.",
    alt: "Special Week, karakter Uma Musume yang menjadi maskot Agemasen",
    tagsLabel: "Tag",
    tags: ["Cheerful", "Energetic", "Uma Musume", "Fan project"],
    profile: [
      { k: "Type", v: "Runner" },
      { k: "Role", v: "Mascot" },
      { k: "Status", v: "On duty" },
    ],
    disclaimer:
      "Agemasen is an unofficial fan project and is not affiliated with Cygames or the Uma Musume franchise.",
  },
  howTo: {
    label: "Three steps",
    heading: "How to use",
    steps: [
      {
        title: "Open WhatsApp",
        body: "Buka WhatsApp, lalu chat nomor Agemasen atau tambahkan bot ke grupmu.",
      },
      {
        title: "Send command",
        body: "Kirim command diawali tanda seru. Mulai dari !menu untuk melihat daftarnya.",
      },
      {
        title: "Enjoy",
        body: "Hasilnya datang di chat yang sama: stiker, video, foto HD, atau balasan galak yang membantu.",
      },
    ],
  },
  preview: {
    label: "Preview",
    heading: ["Command", "preview"],
    body: "Contoh percakapan dengan Agemasen. Ini hanya tampilan, bukan bot yang sedang berjalan.",
    seeAll: "Lihat semua command",
    botStatus: "WhatsApp bot",
    chatLabel: "Contoh percakapan",
    menu: [
      "Stiker & meme",
      "Download",
      "Foto",
      "Cari gambar & GIF",
      "Baca & ringkas",
      "Bantuan",
    ],
    hdCmd: "!hd (reply foto buram)",
    hdReply: "Hmph. Fotonya burem banget, bukan berarti aku peduli ya…",
    dlCmd: "!dl https://youtu.be/…",
    dlReply: "Nih, udah kelar. Jangan bilang-bilang aku yang repot. 😤",
  },
  cta: {
    eyebrow: "Ready to run?",
    heading: ["Bring Agemasen", "to your WhatsApp."],
    add: "Add Agemasen",
    github: "View GitHub",
    viewCommands: "Lihat command",
  },
  footer: {
    nav: "Footer",
    tagline: "WhatsApp Bot / Fan Project",
    fanTitle: "Fan Project",
    fanNote: "Not affiliated with Cygames / Uma Musume.",
    madeWith: "Made with curiosity & caffeine.",
    admin: "Admin",
  },
};

export type Dict = typeof id;

const en: Dict = {
  meta: {
    title: "Agemasen — A WhatsApp bot for your messy days",
    description:
      "A WhatsApp bot for making stickers, downloading videos, upscaling photos to HD, searching images and GIFs, and chatting with a tsundere character. A fan project themed around Uma Musume.",
  },
  skip: "Skip to content",
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
  lang: {
    group: "Language",
    id: "Bahasa Indonesia",
    en: "English",
  },
  nav: {
    label: "Main navigation",
    features: "Features",
    about: "About",
    howTo: "How to use",
    commands: "Commands",
    github: "GitHub",
    tagline: "WhatsApp bot / community assistant",
    addBot: "Add bot",
    addToWa: "Add to WhatsApp",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    badge: "Anime community bot",
    status: "System ready",
    tagline: ["Your favorite", "WhatsApp bot,", "powered by chaos."],
    body: "Make stickers, download videos, upscale photos to HD, search images and GIFs, even chat with a tsundere bot. All straight from your WhatsApp chat.",
    cta: "Add to WhatsApp",
    explore: "Explore features",
    metaCommands: "commands",
    metaBot: "WhatsApp bot",
    metaCommunity: "Community project",
    alt: "Special Week, the Uma Musume character who is Agemasen's mascot",
    featured: "Featured bot",
  },
  about: {
    label: "About Agemasen",
    heading: ["Not just", "a bot."],
    lead: "Agemasen brings your everyday tools into one chat: stickers, downloads, HD photos, image search, even summaries of group conversations.",
    body: "It all runs right inside WhatsApp, in groups and private chats alike. Feisty, but always helpful.",
    stats: {
      commands: { label: "Commands", note: "Type !menu for the latest list." },
      prefix: { label: "One prefix", note: "Every command starts with an exclamation mark." },
      apps: { label: "Apps to install", note: "Just the WhatsApp you already have." },
    },
  },
  features: {
    label: "Features",
    heading: ["One bot.", "Many things", "to do."],
    noteBefore:
      "Click a card to see how each command works. For the latest version, type ",
    noteAfter: " in the chat.",
    cardLink: "see how to use it",
    commandList: "Command",
    tutorial: {
      label: "How to use",
      example: "Example",
      tip: "Note",
      others: "Other features",
      close: "Close",
      allCommands: "See all commands",
    },
    items: {
      sticker: {
        title: "Sticker & Meme",
        description:
          "Turn images or videos into stickers, add meme captions, or make chat and brat stickers.",
      },
      downloader: {
        title: "Downloader",
        description: "Paste a link and the bot sends the video back to your chat.",
      },
      hd: {
        title: "HD Photo",
        description: "Small or blurry photos get sharpened into HD.",
      },
      search: {
        title: "Image & GIF Search",
        description:
          "Search Safebooru, Pinterest, and Tenor without leaving WhatsApp.",
      },
      articles: {
        title: "Articles & Summary",
        description:
          "Find open-access journal articles and summarize group chats you missed.",
      },
      chat: {
        title: "Tsundere Chat",
        description:
          "Chat with a tsundere AI character that remembers the context of your conversation.",
      },
    },
  },
  mascot: {
    label: "Meet the mascot",
    heading: ["Special", "Week"],
    lines: ["Cheerful.", "Energetic.", "Always ready to run."],
    body: "Special Week's character and artwork serve as Agemasen's visual identity, in the spirit of a fan project. All rights remain with their respective owners.",
    alt: "Special Week, the Uma Musume character who is Agemasen's mascot",
    tagsLabel: "Tags",
    tags: ["Cheerful", "Energetic", "Uma Musume", "Fan project"],
    profile: [
      { k: "Type", v: "Runner" },
      { k: "Role", v: "Mascot" },
      { k: "Status", v: "On duty" },
    ],
    disclaimer:
      "Agemasen is an unofficial fan project and is not affiliated with Cygames or the Uma Musume franchise.",
  },
  howTo: {
    label: "Three steps",
    heading: "How to use",
    steps: [
      {
        title: "Open WhatsApp",
        body: "Open WhatsApp, then chat Agemasen's number or add the bot to your group.",
      },
      {
        title: "Send command",
        body: "Send a command starting with an exclamation mark. Start with !menu to see the list.",
      },
      {
        title: "Enjoy",
        body: "Results arrive in the same chat: stickers, videos, HD photos, or a feisty but helpful reply.",
      },
    ],
  },
  preview: {
    label: "Preview",
    heading: ["Command", "preview"],
    body: "A sample conversation with Agemasen. This is only a demo, not a live bot.",
    seeAll: "See all commands",
    botStatus: "WhatsApp bot",
    chatLabel: "Sample conversation",
    menu: [
      "Stickers & memes",
      "Download",
      "Photo",
      "Image & GIF search",
      "Read & summarize",
      "Help",
    ],
    hdCmd: "!hd (reply to a blurry photo)",
    hdReply: "Hmph. This photo is so blurry, not that I care or anything…",
    dlCmd: "!dl https://youtu.be/…",
    dlReply: "Here, it's done. Don't tell anyone I went to the trouble. 😤",
  },
  cta: {
    eyebrow: "Ready to run?",
    heading: ["Bring Agemasen", "to your WhatsApp."],
    add: "Add Agemasen",
    github: "View GitHub",
    viewCommands: "View commands",
  },
  footer: {
    nav: "Footer",
    tagline: "WhatsApp Bot / Fan Project",
    fanTitle: "Fan Project",
    fanNote: "Not affiliated with Cygames / Uma Musume.",
    madeWith: "Made with curiosity & caffeine.",
    admin: "Admin",
  },
};

export const dictionaries: Record<Lang, Dict> = { id, en };
