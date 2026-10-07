import type { FeatureKey, Lang } from "@/lib/i18n";

// Isi tutorial di panel kartu Features. Sumber: COMMAND_DETAILS di
// AgemasenBot/src/i18n/locales/{id,en}.menu.js. Mau ubah teks? Edit file ini.
//
// Satu fitur = beberapa command. Tiap command punya:
//   cmd     : sintaks yang tampil di judul
//   summary : satu kalimat, fungsinya
//   steps   : langkah pakai, berurutan
//   example : contoh yang bisa diketik langsung (satu baris = satu pesan)
//   tip     : catatan tambahan (opsional)
export type CommandTutorial = {
  cmd: string;
  summary: string;
  steps: string[];
  example?: string[];
  tip?: string;
};

export type Tutorials = Record<FeatureKey, CommandTutorial[]>;

const id: Tutorials = {
  sticker: [
    {
      cmd: "!s",
      summary: "Ubah foto, GIF, video, atau stiker jadi stiker biasa tanpa teks.",
      steps: [
        "Kirim medianya dengan caption !s.",
        "Atau kirim medianya dulu, lalu reply pesan itu dengan !s.",
      ],
      example: ["!s"],
    },
    {
      cmd: "!meme <teks>",
      summary: "Ubah GIF atau video jadi stiker animasi bertulisan.",
      steps: [
        "Kirim GIF/video dengan caption !meme lalu teksnya.",
        "Atau kirim dulu GIF/videonya, lalu reply dengan !meme teks.",
        "Mau dua baris? Pisahkan dengan tanda |. Emoji WhatsApp boleh dipakai.",
      ],
      example: ["!meme HALO DUNIA|SELAMAT PAGI"],
      tip: "Untuk foto atau stiker, pakai !smeme.",
    },
    {
      cmd: "!smeme <teks>",
      summary: "Ubah foto atau stiker (emote) jadi stiker bertulisan.",
      steps: [
        "Kirim foto/stiker dengan caption !smeme lalu teksnya.",
        "Atau kirim dulu medianya, lalu reply dengan !smeme teks.",
        "Dua baris? Pisahkan dengan |.",
      ],
      example: ["!smeme awokawokawok😂"],
      tip: "Untuk GIF atau video, pakai !meme.",
    },
    {
      cmd: "!sbrat <teks>",
      summary:
        "Bikin stiker bergaya brat (latar putih, teks hitam huruf kecil, efek blur) murni dari teks.",
      steps: [
        "Ketik teksnya langsung setelah command. Tidak perlu media.",
        "Emoji boleh ikut di dalam teks.",
      ],
      example: ["!sbrat hidup cuma sekali", "!sbrat capek banget hari ini 😭"],
      tip: "Maksimal sekitar 80 karakter supaya layout stikernya tetap rapi. Bisa juga diawali titik: .sbrat",
    },
    {
      cmd: "!gifbrat <teks>",
      summary:
        "Bikin stiker animasi gaya brat yang \"mengetik\" kata demi kata, murni dari teks.",
      steps: [
        "Ketik teksnya langsung setelah command. Tidak perlu media.",
        "Kata muncul satu per satu, lalu berakhir sama seperti hasil !sbrat.",
        "Emoji boleh ikut di dalam teks.",
      ],
      example: ["!gifbrat hidup cuma sekali", "!gifbrat capek banget hari ini 😭"],
      tip: "Maksimal 30 kata atau 300 karakter karena tiap kata jadi satu frame. Bisa juga diawali titik: .gifbrat",
    },
    {
      cmd: "!schat Nama|Pesan|badge",
      summary:
        "Bikin stiker dialog ala screenshot chat WhatsApp: avatar bulat, nama, dan bubble pesan.",
      steps: [
        "Ketik !schat lalu Nama|Pesan. Bagian |badge di akhir opsional (emoji kecil di samping nama).",
        "Avatar otomatis: reply pesan seseorang atau tag orangnya untuk memakai foto profilnya. Tanpa reply/tag, yang dipakai fotomu sendiri.",
        "Mau avatar dari gambar tertentu? Kirim gambar dengan caption !schat ..., atau reply gambarnya.",
      ],
      example: ["!schat Budi|Woy udah pada makan belom?|😂"],
      tip: "Nama maksimal 40 karakter, pesan maksimal 500 karakter. Kalau foto profil tidak bisa diambil, avatar berganti jadi lingkaran berisi huruf awal nama.",
    },
    {
      cmd: "!togif",
      summary: "Ubah stiker animasi kembali jadi GIF.",
      steps: [
        "Kirim stikernya dengan caption !togif.",
        "Atau kirim dulu stikernya, lalu reply dengan !togif.",
      ],
      example: ["!togif"],
      tip: "Hanya untuk stiker animasi. Stiker statis pakai !toimg.",
    },
    {
      cmd: "!toimg",
      summary: "Ubah stiker jadi gambar biasa (PNG).",
      steps: [
        "Kirim stikernya dengan caption !toimg.",
        "Atau kirim dulu stikernya, lalu reply dengan !toimg.",
      ],
      example: ["!toimg"],
      tip: "Kalau stikernya animasi, yang diambil hanya frame pertama.",
    },
  ],

  downloader: [
    {
      cmd: "!dl <link>",
      summary:
        "Download video atau audio dari YouTube, TikTok, Instagram, Facebook, Bilibili, X/Twitter, dan situs lain yang didukung.",
      steps: [
        "Salin link videonya.",
        "Kirim !dl lalu tempel link-nya.",
        "Mau audio saja atau video saja? Tambahkan mp3 atau mp4 setelah link. Bawaannya video.",
        "Kalau link-nya ternyata postingan foto (carousel Instagram atau slideshow TikTok), bot otomatis mengirim semua fotonya satu per satu, plus musiknya jika ada.",
      ],
      example: [
        "!dl https://youtu.be/xxxxxxxxxxx",
        "!dl https://youtu.be/xxxxxxxxxxx mp3",
      ],
      tip: "Batas ukuran file 95MB.",
    },
    {
      cmd: "!dlr <link>",
      summary:
        "Khusus postingan foto: carousel Instagram atau TikTok mode foto/slideshow.",
      steps: [
        "Kirim !dlr lalu tempel link postingannya.",
        "Semua foto dikirim berurutan sesuai aslinya, lalu musiknya di akhir jika ada.",
      ],
      example: ["!dlr https://www.instagram.com/p/xxxxxxxxxxx"],
      tip: "Lebih cepat dari !dl kalau kamu sudah tahu link-nya foto. Untuk video atau reel biasa tetap pakai !dl. Postingan Facebook berisi foto saja tidak didukung.",
    },
  ],

  hd: [
    {
      cmd: "!hd [2x | 4x]",
      summary: "Pertajam foto kecil atau buram jadi lebih HD dengan AI upscale.",
      steps: [
        "Kirim fotonya dengan caption !hd.",
        "Atau kirim dulu fotonya, lalu reply dengan !hd.",
        "Mau pilih tingkat perbesaran? Tambahkan 2x atau 4x.",
        "Tunggu sebentar. Kalau sedang ramai, bot memberi tahu bahwa kamu masuk antrean.",
      ],
      example: ["!hd", "!hd 2x", "!hd 4x"],
      tip: "Kalau skalanya salah ketik, bot membalas dengan pilihan yang tersedia.",
    },
  ],

  search: [
    {
      cmd: "!img <tag>",
      summary: "Cari gambar dari Safebooru berdasarkan tag.",
      steps: [
        "Kirim !img lalu tag-nya. Untuk banyak kata, pakai garis bawah seperti di contoh.",
        "Kalau tag terlalu umum, bot menampilkan daftar pilihan. Balas dengan angkanya.",
        "Tiap hasil punya Kode Sesi (angka). Siapa pun di grup boleh mengetik angka itu untuk lanjut ke gambar lain dari pencarian yang sama.",
      ],
      example: ["!img umamusume", "!img tokai_teio_(umamusume)"],
    },
    {
      cmd: "!pin <keyword>",
      summary: "Cari gambar di Pinterest berdasarkan keyword.",
      steps: [
        "Kirim !pin lalu keyword-nya.",
        "Lanjut ke gambar berikutnya dengan Kode Sesi atau !next.",
      ],
      example: ["!pin sunset aesthetic", "!pin desain kamar minimalis"],
      tip: "Memakai pencarian internal Pinterest, bukan API resmi, jadi sesekali bisa gagal. Coba lagi beberapa saat kemudian.",
    },
    {
      cmd: "!gif <keyword>",
      summary: "Cari GIF (Tenor, dengan cadangan GIPHY) dan kirim satu hasil acak.",
      steps: [
        "Kirim !gif lalu keyword-nya.",
        "Mau GIF lain dari pencarian yang sama? Ketik Kode Sesi atau !next.",
      ],
      example: ["!gif anime reaction", "!gif funny cat"],
      tip: "Huruf besar/kecil tidak masalah, !GIF juga jalan.",
    },
    {
      cmd: "!next",
      summary:
        "Lanjut ke hasil berikutnya dari pencarian !img, !pin, atau !gif terakhir.",
      steps: [
        "Lakukan pencarian dulu dengan !img, !pin, atau !gif.",
        "Ketik !next, atau langsung ketik Kode Sesi-nya.",
      ],
      example: ["!next"],
      tip: "Kode Sesi bisa dipakai siapa saja di grup, tidak hanya yang memulai pencarian.",
    },
    {
      cmd: "!id <kode>",
      summary: "Buka lagi gambar tertentu berdasarkan kode ID-nya.",
      steps: ["Kirim !id lalu kode gambarnya."],
      example: ["!id 12345"],
    },
  ],

  uma: [
    {
      cmd: "!trainer <nama atau ID>",
      summary:
        "Cari trainer Uma Musume (data uma.moe) dan lihat kartunya: inheritance, factor, dan support card.",
      steps: [
        "Kirim !trainer lalu nama atau ID trainer.",
        "Bot menampilkan daftar trainer bernama mirip beserta ID-nya. Reply pesan daftar itu dengan nomor urut untuk melihat kartunya.",
        "Kalau yang diketik ID trainer (9-12 digit), kartunya langsung muncul.",
      ],
      example: ["!trainer azan", "!trainer 243028085654"],
      tip: "Daftar yang panjang dibagi per halaman. Reply next, prev, atau hal 5 untuk pindah halaman.",
    },
    {
      cmd: "!club <nama atau ID club>",
      summary:
        "Cari club (circle) Uma Musume dan lihat statistik, rank, dan gain tiap member.",
      steps: [
        "Kirim !club lalu nama atau ID club.",
        "Bot menampilkan daftar club bernama mirip beserta ID dan nama leader-nya. Reply pesan daftar itu dengan nomor urut untuk melihat kartu club.",
        "Kalau yang diketik ID club (angka), kartunya langsung muncul.",
      ],
      example: ["!club hachimi", "!club 738117397"],
    },
    {
      cmd: "!threshold",
      summary:
        "Kartu rank threshold circle dari tier SS sampai D: minimal fans, fans per hari, dan selisih tiap tier.",
      steps: ["Kirim !threshold."],
      example: ["!threshold"],
    },
    {
      cmd: "!leaderboard",
      summary:
        "Kartu leaderboard circle dari rank 1 sampai 50: tier, leader, live fans, dan monthly fans.",
      steps: ["Kirim !leaderboard atau singkatnya !lb."],
      example: ["!leaderboard", "!lb"],
    },
  ],

  articles: [
    {
      cmd: "!artikel <URL>",
      summary:
        "Ambil artikel atau dokumen dari link publik dan legal: arXiv, DOAJ, Internet Archive, repository kampus, OJS, atau link PDF langsung.",
      steps: [
        "Kirim !artikel lalu tempel URL-nya.",
        "Kalau file tidak tersedia langsung, bot mencari versi Open Access resminya lewat DOI atau judul.",
        "Kalau memang tidak ada versi publik, kamu mendapat link ke artikel aslinya.",
      ],
      example: ["!artikel https://arxiv.org/abs/2101.00001"],
      tip: "Bot tidak mencoba menembus paywall, login, CAPTCHA, atau DRM.",
    },
    {
      cmd: "!ringkas [instruksi]",
      summary: "Ringkas garis besar isi dokumen PDF dengan AI.",
      steps: [
        "Kirim file PDF dengan caption !ringkas.",
        "Atau kirim PDF-nya dulu, lalu reply dengan !ringkas.",
        "Boleh tambah instruksi setelahnya untuk mengarahkan ringkasan.",
        "Setelah itu kamu bisa bertanya lebih detail soal isi dokumen lewat chat biasa (tag atau reply bot) selama beberapa jam.",
      ],
      example: ["!ringkas", "!ringkas jelasin poin-poin utamanya aja"],
      tip: "Hanya membaca teks yang ada di PDF. PDF hasil scan atau foto tanpa lapisan teks tidak terbaca.",
    },
  ],

  chat: [
    {
      cmd: "@AgemasenBot",
      summary: "Ngobrol dengan bot berkarakter tsundere. Tanpa command.",
      steps: [
        "Di grup, tag @AgemasenBot lalu tulis pesanmu.",
        "Untuk lanjut ngobrol, reply pesan balasan bot.",
        "Bot mengingat konteks obrolanmu, jadi tidak perlu mengulang dari awal.",
      ],
      example: ["@AgemasenBot hari ini capek banget"],
    },
    {
      cmd: "!lupain",
      summary: "Mulai obrolan dari nol dengan menghapus ingatan bot.",
      steps: [
        "Kirim !lupain kapan pun kamu ingin bot melupakan obrolan sebelumnya.",
      ],
      example: ["!lupain"],
    },
  ],

  tools: [
    {
      cmd: "!groupinfo",
      summary:
        "Lihat info grup: nama, jumlah anggota, admin, pembuat, tanggal dibuat, dan siapa yang boleh kirim pesan.",
      steps: ["Kirim !groupinfo di dalam grup."],
      example: ["!groupinfo"],
      tip: "Hanya jalan di grup.",
    },
    {
      cmd: "!online",
      summary: "Cek anggota grup yang sedang online.",
      steps: [
        "Kirim !online di dalam grup.",
        "Bot mengecek anggota dan hasilnya keluar sekitar 6 detik kemudian.",
      ],
      example: ["!online"],
      tip: "Maksimal 100 anggota per grup, dan ada jeda 60 detik antar pengecekan. Anggota yang menyembunyikan status online di privasi WhatsApp tidak terlihat.",
    },
    {
      cmd: "!botstatus",
      summary:
        "Lihat status bot: koneksi, uptime, jumlah grup, pemakaian memori, dan kondisinya di grup ini.",
      steps: ["Kirim !botstatus."],
      example: ["!botstatus"],
    },
    {
      cmd: "!langganan",
      summary: "Cek sisa masa langganan untuk grup atau nomor kamu.",
      steps: ["Kirim !langganan."],
      example: ["!langganan"],
      tip: "Tetap bisa dipakai walau langganan sudah habis, supaya kamu tahu kapan berakhirnya.",
    },
    {
      cmd: "!lang [id|en]",
      summary: "Ganti bahasa bot antara Bahasa Indonesia dan English.",
      steps: [
        "Kirim !lang untuk melihat bahasa yang dipakai sekarang.",
        "Kirim !lang en untuk English, atau !lang id untuk Bahasa Indonesia.",
      ],
      example: ["!lang", "!lang en", "!lang id"],
      tip: "Di chat pribadi, bahasa disimpan untuk nomormu. Di grup, bahasa berlaku untuk seluruh grup dan hanya admin grup (atau owner bot) yang boleh menggantinya. Pengaturan tersimpan permanen.",
    },
    {
      cmd: "!ping",
      summary: "Cek apakah bot masih hidup.",
      steps: ["Kirim !ping.", "Bot membalas Pong!"],
      example: ["!ping"],
    },
  ],
};

const en: Tutorials = {
  sticker: [
    {
      cmd: "!s",
      summary: "Turn any photo, GIF, video, or sticker into a plain sticker with no text.",
      steps: [
        "Send the media with the caption !s.",
        "Or send the media first, then reply to it with !s.",
      ],
      example: ["!s"],
    },
    {
      cmd: "!meme <text>",
      summary: "Turn a GIF or video into an animated sticker with a caption.",
      steps: [
        "Send the GIF/video with the caption !meme followed by your text.",
        "Or send the GIF/video first, then reply with !meme text.",
        "Want two lines? Separate them with |. WhatsApp emoji work too.",
      ],
      example: ["!meme HELLO WORLD|GOOD MORNING"],
      tip: "For photos or stickers, use !smeme.",
    },
    {
      cmd: "!smeme <text>",
      summary: "Turn a photo or sticker (emote) into a sticker with a caption.",
      steps: [
        "Send the photo/sticker with the caption !smeme followed by your text.",
        "Or send the media first, then reply with !smeme text.",
        "Two lines? Separate them with |.",
      ],
      example: ["!smeme lmaooo😂"],
      tip: "For GIFs or videos, use !meme.",
    },
    {
      cmd: "!sbrat <text>",
      summary:
        "Make a brat-style sticker (white background, lowercase black text, blur effect) from text alone.",
      steps: [
        "Type your text right after the command. No media needed.",
        "Emoji can go inside the text.",
      ],
      example: ["!sbrat you only live once", "!sbrat so tired today 😭"],
      tip: "Keep it under about 80 characters so the layout stays tidy. A leading dot works too: .sbrat",
    },
    {
      cmd: "!gifbrat <text>",
      summary:
        "Make an animated brat-style sticker that \"types\" word by word, from text alone.",
      steps: [
        "Type your text right after the command. No media needed.",
        "Words appear one at a time and end up looking like the !sbrat result.",
        "Emoji can go inside the text.",
      ],
      example: ["!gifbrat you only live once", "!gifbrat so tired today 😭"],
      tip: "Up to 30 words or 300 characters, since each word becomes one frame. A leading dot works too: .gifbrat",
    },
    {
      cmd: "!schat Name|Message|badge",
      summary:
        "Make a sticker that looks like a WhatsApp chat screenshot: round avatar, sender name, and message bubble.",
      steps: [
        "Type !schat then Name|Message. The |badge part at the end is optional (a small emoji next to the name).",
        "The avatar is automatic: reply to someone's message or tag them to use their profile photo. With no reply or tag, your own photo is used.",
        "Want a specific avatar? Send an image with the caption !schat ..., or reply to that image.",
      ],
      example: ["!schat Budi|Have you all eaten yet?|😂"],
      tip: "Name up to 40 characters, message up to 500. If the profile photo can't be fetched, the avatar falls back to a colored circle with the name's initial.",
    },
    {
      cmd: "!togif",
      summary: "Turn an animated sticker back into a GIF.",
      steps: [
        "Send the sticker with the caption !togif.",
        "Or send the sticker first, then reply with !togif.",
      ],
      example: ["!togif"],
      tip: "Animated stickers only. For static stickers use !toimg.",
    },
    {
      cmd: "!toimg",
      summary: "Turn a sticker into a regular image (PNG).",
      steps: [
        "Send the sticker with the caption !toimg.",
        "Or send the sticker first, then reply with !toimg.",
      ],
      example: ["!toimg"],
      tip: "For animated stickers, only the first frame is used.",
    },
  ],

  downloader: [
    {
      cmd: "!dl <link>",
      summary:
        "Download video or audio from YouTube, TikTok, Instagram, Facebook, Bilibili, X/Twitter, and other supported sites.",
      steps: [
        "Copy the video link.",
        "Send !dl followed by the link.",
        "Want audio only or video only? Add mp3 or mp4 after the link. Video is the default.",
        "If the link turns out to be a photo post (Instagram carousel or TikTok slideshow), the bot sends every photo one by one, plus the music if there is any.",
      ],
      example: [
        "!dl https://youtu.be/xxxxxxxxxxx",
        "!dl https://youtu.be/xxxxxxxxxxx mp3",
      ],
      tip: "File size limit is 95MB.",
    },
    {
      cmd: "!dlr <link>",
      summary:
        "For photo posts only: Instagram carousels or TikTok photo/slideshow mode.",
      steps: [
        "Send !dlr followed by the post link.",
        "All photos arrive in their original order, then the music at the end if there is any.",
      ],
      example: ["!dlr https://www.instagram.com/p/xxxxxxxxxxx"],
      tip: "Faster than !dl when you already know the link is a photo post. For regular videos or reels, keep using !dl. Facebook posts with only photos aren't supported.",
    },
  ],

  hd: [
    {
      cmd: "!hd [2x | 4x]",
      summary: "Sharpen a small or blurry photo into HD with AI upscaling.",
      steps: [
        "Send the photo with the caption !hd.",
        "Or send the photo first, then reply with !hd.",
        "Want to choose the enlargement? Add 2x or 4x.",
        "Give it a moment. If it's busy, the bot tells you that you're in the queue.",
      ],
      example: ["!hd", "!hd 2x", "!hd 4x"],
      tip: "If you mistype the scale, the bot replies with the available options.",
    },
  ],

  search: [
    {
      cmd: "!img <tag>",
      summary: "Search Safebooru images by tag.",
      steps: [
        "Send !img followed by the tag. For multiple words, use underscores as in the example.",
        "If the tag is too broad, the bot shows a list of choices. Reply with the number.",
        "Every result has a Session Code (a number). Anyone in the group can type it to move on to another image from the same search.",
      ],
      example: ["!img umamusume", "!img tokai_teio_(umamusume)"],
    },
    {
      cmd: "!pin <keyword>",
      summary: "Search Pinterest images by keyword.",
      steps: [
        "Send !pin followed by the keyword.",
        "Move to the next image with the Session Code or !next.",
      ],
      example: ["!pin sunset aesthetic", "!pin minimalist bedroom design"],
      tip: "It uses Pinterest's internal search rather than an official API, so it can occasionally fail. Try again in a moment.",
    },
    {
      cmd: "!gif <keyword>",
      summary: "Search GIFs (Tenor, with GIPHY as backup) and send one random result.",
      steps: [
        "Send !gif followed by the keyword.",
        "Want another GIF from the same search? Type the Session Code or !next.",
      ],
      example: ["!gif anime reaction", "!gif funny cat"],
      tip: "Case doesn't matter, !GIF works too.",
    },
    {
      cmd: "!next",
      summary: "Move on to the next result of your last !img, !pin, or !gif search.",
      steps: [
        "Run a search first with !img, !pin, or !gif.",
        "Type !next, or just type the Session Code.",
      ],
      example: ["!next"],
      tip: "Anyone in the group can use the Session Code, not only the person who started the search.",
    },
    {
      cmd: "!id <code>",
      summary: "Reopen a specific image by its ID code.",
      steps: ["Send !id followed by the image code."],
      example: ["!id 12345"],
    },
  ],

  uma: [
    {
      cmd: "!trainer <name or ID>",
      summary:
        "Look up Uma Musume trainers (uma.moe data) and see their card: inheritance, factors, and support cards.",
      steps: [
        "Send !trainer followed by a trainer name or ID.",
        "The bot lists trainers with similar names and their IDs. Reply to that list with the row number to see the card.",
        "If you type a trainer ID (9-12 digits), the card appears right away.",
      ],
      example: ["!trainer azan", "!trainer 243028085654"],
      tip: "Long lists are split into pages. Reply next, prev, or page 5 to switch pages.",
    },
    {
      cmd: "!club <name or club ID>",
      summary:
        "Look up an Uma Musume club (circle) and see its stats, rank, and each member's gains.",
      steps: [
        "Send !club followed by a club name or ID.",
        "The bot lists clubs with similar names, their IDs, and leader names. Reply to that list with the row number to see the club card.",
        "If you type a club ID (a number), the card appears right away.",
      ],
      example: ["!club hachimi", "!club 738117397"],
    },
    {
      cmd: "!threshold",
      summary:
        "Circle rank threshold card from tier SS to D: minimum fans, fans per day, and the gap between tiers.",
      steps: ["Send !threshold."],
      example: ["!threshold"],
    },
    {
      cmd: "!leaderboard",
      summary:
        "Circle leaderboard card for ranks 1 to 50: tier, leader, live fans, and monthly fans.",
      steps: ["Send !leaderboard or the short form !lb."],
      example: ["!leaderboard", "!lb"],
    },
  ],

  articles: [
    {
      cmd: "!artikel <URL>",
      summary:
        "Fetch an article or document from a public, legal link: arXiv, DOAJ, Internet Archive, university repositories, OJS, or a direct PDF link.",
      steps: [
        "Send !artikel followed by the URL.",
        "If the file isn't directly available, the bot looks for the official Open Access version by DOI or title.",
        "If there's no public version, you get a link to the original article instead.",
      ],
      example: ["!artikel https://arxiv.org/abs/2101.00001"],
      tip: "The bot deliberately doesn't try to bypass paywalls, logins, CAPTCHAs, or DRM.",
    },
    {
      cmd: "!ringkas [instructions]",
      summary: "Summarize the main points of a PDF with AI.",
      steps: [
        "Send the PDF with the caption !ringkas.",
        "Or send the PDF first, then reply with !ringkas.",
        "You can add instructions after it to steer the summary.",
        "Afterwards you can ask more detailed questions about the document in normal chat (tag or reply to the bot) for a few hours.",
      ],
      example: ["!ringkas", "!ringkas just explain the key points"],
      tip: "It only reads text that exists in the PDF. Scanned or photographed PDFs without a text layer can't be read.",
    },
  ],

  chat: [
    {
      cmd: "@AgemasenBot",
      summary: "Chat with the tsundere-style bot. No command needed.",
      steps: [
        "In a group, tag @AgemasenBot and write your message.",
        "To keep talking, reply to the bot's message.",
        "The bot remembers the context of your conversation, so you don't need to start over.",
      ],
      example: ["@AgemasenBot I'm so tired today"],
    },
    {
      cmd: "!lupain",
      summary: "Start the conversation over by erasing the bot's memory.",
      steps: [
        "Send !lupain any time you want the bot to forget the earlier conversation.",
      ],
      example: ["!lupain"],
    },
  ],

  tools: [
    {
      cmd: "!groupinfo",
      summary:
        "See group info: name, member count, admins, creator, creation date, and who can send messages.",
      steps: ["Send !groupinfo inside a group."],
      example: ["!groupinfo"],
      tip: "Works in groups only.",
    },
    {
      cmd: "!online",
      summary: "Check which group members are online right now.",
      steps: [
        "Send !online inside a group.",
        "The bot checks the members and the result arrives about 6 seconds later.",
      ],
      example: ["!online"],
      tip: "Groups up to 100 members only, with a 60-second cooldown between checks. Members who hide their online status in WhatsApp privacy won't show up.",
    },
    {
      cmd: "!botstatus",
      summary:
        "See the bot's status: connection, uptime, number of groups, memory use, and how it's doing in this group.",
      steps: ["Send !botstatus."],
      example: ["!botstatus"],
    },
    {
      cmd: "!langganan",
      summary: "Check the subscription time left for your group or number.",
      steps: ["Send !langganan."],
      example: ["!langganan"],
      tip: "Still works after the subscription has run out, so you can see when it ended.",
    },
    {
      cmd: "!lang [id|en]",
      summary: "Switch the bot's language between Bahasa Indonesia and English.",
      steps: [
        "Send !lang to see the language currently in use.",
        "Send !lang en for English, or !lang id for Bahasa Indonesia.",
      ],
      example: ["!lang", "!lang en", "!lang id"],
      tip: "In private chat, the language is saved for your number. In a group it applies to the whole group, and only group admins (or the bot owner) can change it. The setting is saved permanently.",
    },
    {
      cmd: "!ping",
      summary: "Check whether the bot is still alive.",
      steps: ["Send !ping.", "The bot replies Pong!"],
      example: ["!ping"],
    },
  ],
};

export const tutorials: Record<Lang, Tutorials> = { id, en };