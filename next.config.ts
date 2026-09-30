import type { NextConfig } from "next";

const config: NextConfig = {
  // Halaman lama tetap berupa HTML statis di public/.
  async redirects() {
    return [
      { source: "/admin", destination: "/", permanent: false },
      { source: "/admin.html", destination: "/", permanent: false },
    ];
  },
};

export default config;
