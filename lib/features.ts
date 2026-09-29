import {
  Download,
  ImageUpscale,
  Images,
  MessageCircleHeart,
  Newspaper,
  Sticker,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  commands: string[];
  icon: LucideIcon;
};

// Sumber: daftar command di public/home.html.
export const features: Feature[] = [
  {
    title: "Sticker & Meme",
    description:
      "Ubah gambar atau video jadi stiker, tulis teks meme, atau bikin stiker chat dan brat.",
    commands: ["!meme", "!smeme", "!sbrat", "!schat"],
    icon: Sticker,
  },
  {
    title: "Downloader",
    description: "Tempel link, bot kirim videonya balik ke chat.",
    commands: ["!dl", "!dlr"],
    icon: Download,
  },
  {
    title: "HD Photo",
    description: "Foto kecil atau buram dipertajam jadi HD.",
    commands: ["!hd"],
    icon: ImageUpscale,
  },
  {
    title: "Image & GIF Search",
    description:
      "Cari dari Safebooru, Pinterest, dan Tenor tanpa keluar dari WhatsApp.",
    commands: ["!img", "!id", "!pin", "!gif"],
    icon: Images,
  },
  {
    title: "Articles & Summary",
    description:
      "Cari artikel jurnal terbuka dan ringkas obrolan grup yang kelewat.",
    commands: ["!artikel", "!ringkas", "!lupain"],
    icon: Newspaper,
  },
  {
    title: "Tsundere Chat",
    description:
      "Ngobrol dengan AI berkarakter tsundere yang ingat konteks obrolan.",
    commands: [],
    icon: MessageCircleHeart,
  },
];

// Semua command di daftar + !menu.
export const commandCount =
  features.flatMap((f) => f.commands).length + 1;
