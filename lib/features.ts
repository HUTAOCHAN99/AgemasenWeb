import {
  Download,
  ImageUpscale,
  Images,
  MessageCircleHeart,
  Newspaper,
  Sticker,
  type LucideIcon,
} from "lucide-react";
import type { FeatureKey } from "@/lib/i18n";

// Judul & deskripsi ada di lib/i18n.ts (per bahasa); di sini hanya data yang
// sama untuk semua bahasa: kunci, command, dan ikon.
export type Feature = {
  key: FeatureKey;
  commands: string[];
  icon: LucideIcon;
};

// Sumber: daftar command di public/home.html.
export const features: Feature[] = [
  { key: "sticker", commands: ["!meme", "!smeme", "!sbrat", "!schat"], icon: Sticker },
  { key: "downloader", commands: ["!dl", "!dlr"], icon: Download },
  { key: "hd", commands: ["!hd"], icon: ImageUpscale },
  { key: "search", commands: ["!img", "!id", "!pin", "!gif"], icon: Images },
  { key: "articles", commands: ["!artikel", "!ringkas", "!lupain"], icon: Newspaper },
  { key: "chat", commands: [], icon: MessageCircleHeart },
];

// Semua command di daftar + !menu.
export const commandCount =
  features.flatMap((f) => f.commands).length + 1;
