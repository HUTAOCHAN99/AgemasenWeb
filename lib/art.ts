import { existsSync } from "node:fs";
import path from "node:path";


export function getMascotArt(): string | null {
  const file = path.join(process.cwd(), "public", "videos", "banner.webm");
  return existsSync(file) ? "/videos/banner.webm" : null;
}
