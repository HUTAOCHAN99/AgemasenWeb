"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Dashboard, type Stats } from "@/components/admin/Dashboard";
import { LoginCard } from "@/components/admin/LoginCard";

type View = "checking" | "login" | "dash";

// Satu-satunya yang menentukan tampilan: sudah login atau belum ditentukan oleh
// /api/stats (401 = belum login). Login/logout tetap lewat /api/login & /api/logout.
export function AdminApp() {
  const { t } = useLanguage();
  const [view, setView] = useState<View>("checking");
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const r = await fetch("/api/stats", { cache: "no-store" });
      if (r.status === 401) {
        setData(null);
        setView("login");
        return;
      }
      const d = await r.json().catch(() => ({}));
      setView("dash");
      if (!r.ok) {
        setData(null);
        setError(d.error || t.admin.errLoad);
        return;
      }
      setData(d);
    } catch {
      setView("dash");
      setData(null);
      setError(t.admin.errNetwork);
    }
  }, [t.admin.errLoad, t.admin.errNetwork]);

  useEffect(() => {
    load();
    // Hanya saat pertama dibuka; ganti bahasa tidak perlu memuat ulang data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // Kalau gagal, cookie tetap akan kedaluwarsa sendiri (12 jam).
    }
    setData(null);
    setError(null);
    setView("login");
  }

  if (view === "checking") {
    return (
      <section className="pb-20 pt-32 lg:pt-40">
        <div className="shell">
          <p role="status" className="text-sm text-ag-muted">
            {t.admin.loading}
          </p>
        </div>
      </section>
    );
  }

  if (view === "login") return <LoginCard onLogin={load} />;

  return <Dashboard data={data} error={error} onLogout={logout} onRetry={load} />;
}
