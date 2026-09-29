import { existsSync } from "node:fs";
import path from "node:path";

// Artwork maskot tidak ikut di repo. Kalau file ini ada di public/images,
// dipakai di hero, mascot, dan CTA. Kalau belum ada, tampil slot placeholder.
export function getMascotArt(): string | null {
  const file = path.join(process.cwd(), "public", "images", "special-week.png");
  return existsSync(file) ? "/images/special-week.png" : null;
}
