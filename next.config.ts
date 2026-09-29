import type { NextConfig } from "next";

const config: NextConfig = {
  // Halaman lama (admin & daftar command) tetap berupa HTML statis di public/.
  // Rewrite ini menjaga URL bersihnya (/admin, /home) tetap bekerja.
  async rewrites() {
    return [
      { source: "/admin", destination: "/admin.html" },
      { source: "/home", destination: "/home.html" },
    ];
  },
};

export default config;
