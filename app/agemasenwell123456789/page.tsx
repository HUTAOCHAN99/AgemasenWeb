import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

// Halaman admin memakai navbar, footer, tema, dan bahasa yang sama dengan
// landing page (lihat app/layout.tsx), tapi tidak boleh diindeks mesin pencari.
export const metadata: Metadata = {
  title: "Admin · Agemasen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <Navbar home={false} />
      <main id="main">
        <AdminApp />
      </main>
      <Footer home={false} />
    </>
  );
}
