import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

// Halaman admin memakai navbar (menu khusus admin), footer, tema, dan bahasa
// yang sama dengan landing page (lihat app/layout.tsx), tapi tidak boleh
// diindeks mesin pencari. Navbar & footer dirender di dalam AdminApp karena
// menu admin bergantung pada status login.
export const metadata: Metadata = {
  title: "Admin · Agemasen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminApp />;
}
