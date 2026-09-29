export const site = {
  name: "Agemasen",
  // Ganti nomor di bawah (atau set NEXT_PUBLIC_WA_URL) dengan nomor bot yang sebenarnya.
  waUrl: process.env.NEXT_PUBLIC_WA_URL ?? "https://wa.me/62XXXXXXXXXX",
  // Kosongkan untuk menyembunyikan semua tautan GitHub.
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
};

export const SECTION_TOTAL = "06";

export type NavLink = { label: string; href: string; external?: boolean };

export const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "How to use", href: "#how-to-use" },
  { label: "Commands", href: "/home" },
  ...(site.githubUrl
    ? [{ label: "GitHub", href: site.githubUrl, external: true }]
    : []),
];
