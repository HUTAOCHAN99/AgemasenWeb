import {
  Download,
  ImageUpscale,
  Images,
  MessageCircleHeart,
  Newspaper,
  Sticker,
  Trophy,
  Wrench,
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

// Sumber: menu !menu di AgemasenBot (src/i18n/locales/id.menu.js).
export const features: Feature[] = [
  { key: "sticker", commands: ["!s", "!meme", "!smeme", "!sbrat", "!gifbrat", "!schat", "!togif", "!toimg"], icon: Sticker },
  { key: "downloader", commands: ["!dl", "!dlr"], icon: Download },
  { key: "hd", commands: ["!hd"], icon: ImageUpscale },
  { key: "search", commands: ["!img", "!pin", "!gif", "!next", "!id"], icon: Images },
  { key: "uma", commands: ["!trainer", "!club", "!threshold", "!leaderboard"], icon: Trophy },
  { key: "articles", commands: ["!artikel", "!ringkas"], icon: Newspaper },
  { key: "chat", commands: ["!lupain"], icon: MessageCircleHeart },
  { key: "tools", commands: ["!groupinfo", "!online", "!botstatus", "!langganan", "!lang", "!ping"], icon: Wrench },
];

// Semua command di daftar + !menu.
export const commandCount =
  features.flatMap((f) => f.commands).length + 1;

export const categoryCount = features.length;