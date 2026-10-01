import type { Metadata, Viewport } from "next";
import "@fontsource/dela-gothic-one/latin-400.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SkipLink } from "@/components/SkipLink";
import { DEFAULT_THEME, themeBootScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Agemasen — Bot WhatsApp untuk hari-harimu yang berantakan",
  description:
    "Bot WhatsApp untuk bikin stiker, download video, perbesar foto jadi HD, cari gambar dan GIF, sampai ngobrol dengan karakter tsundere. Proyek penggemar bertema Uma Musume.",
  icons: {
    icon: "/image/agemasen%20icon.webp",
  },
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
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-theme diganti skrip inline di <head> sebelum paint, jadi atributnya
    // boleh berbeda dari HTML server (suppressHydrationWarning).
    <html lang="id" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <div aria-hidden className="atmos">
          <i />
          <i />
        </div>
        <Providers>
          <SkipLink />
          {children}
        </Providers>
      </body>
    </html>
  );
}
