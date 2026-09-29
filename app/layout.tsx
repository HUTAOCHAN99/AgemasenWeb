import type { Metadata, Viewport } from "next";
import "@fontsource/dela-gothic-one/latin-400.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Agemasen — Bot WhatsApp untuk hari-harimu yang berantakan",
  description:
    "Bot WhatsApp untuk bikin stiker, download video, perbesar foto jadi HD, cari gambar dan GIF, sampai ngobrol dengan karakter tsundere. Proyek penggemar bertema Uma Musume.",
  openGraph: {
    title: "Agemasen — WhatsApp bot, powered by chaos",
    description:
      "Stiker, download, foto HD, pencarian gambar dan GIF, ringkasan grup. Semua dari chat WhatsApp.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#08070D",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <div aria-hidden className="atmos">
          <i />
          <i />
        </div>
        <a href="#main" className="skip-link">
          Lewati ke konten
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
