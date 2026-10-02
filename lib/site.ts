export const site = {
  name: "Agemasen",
  // Ganti nomor di bawah (atau set NEXT_PUBLIC_WA_URL) dengan nomor bot yang sebenarnya.
  waUrl: process.env.NEXT_PUBLIC_WA_URL ?? "https://wa.me/6289650789020",
  // Kosongkan untuk menyembunyikan semua tautan GitHub.
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
};

export const SECTION_TOTAL = "07";

// Label diambil dari kamus (t.nav[key]) supaya ikut berganti bahasa.
export type NavKey = "features" | "about" | "howTo" | "github";
export type NavLink = { key: NavKey; href: string; external?: boolean };

export const navLinks: NavLink[] = [
  { key: "features", href: "#features" },
  { key: "about", href: "#about" },
  { key: "howTo", href: "#how-to-use" },
  ...(site.githubUrl
    ? [{ key: "github" as const, href: site.githubUrl, external: true }]
    : []),
];
