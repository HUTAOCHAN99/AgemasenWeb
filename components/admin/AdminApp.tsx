"use client";

import { useCallback, useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageProvider";
import { Navbar, type AdminNav } from "@/components/Navbar";
import { Dashboard, type Stats, type Tab } from "@/components/admin/Dashboard";
import { LoginCard } from "@/components/admin/LoginCard";
import type { SubInfo } from "@/components/admin/Subscription";

type View = "checking" | "login" | "dash";

const TABS: readonly Tab[] = ["overview", "system", "groups", "users"];
const tabFromHash = (): Tab => {
  const h = window.location.hash.slice(1);
  return (TABS as readonly string[]).includes(h) ? (h as Tab) : "overview";
};

// Satu-satunya yang menentukan tampilan: sudah login atau belum ditentukan oleh
// /api/stats (401 = belum login). Login/logout tetap lewat /api/login & /api/logout.
export function AdminApp() {
  const { t } = useLanguage();
  const [view, setView] = useState<View>("checking");
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");

  // Menu admin = hash URL (#groups, #users, ...), jadi bisa di-bookmark dan
  // tombol back/forward browser tetap berfungsi.
  useEffect(() => {
    const sync = () => {
      setTab(tabFromHash());
      window.scrollTo({ top: 0 });
    };
    setTab(tabFromHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

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

  // Setelah on/off berhasil, perbarui daftar langsung tanpa memuat ulang.
  const onToggled = useCallback(
    (kind: "group" | "user", id: string, disabled: boolean) => {
      setData((d) =>
        d
          ? kind === "group"
            ? { ...d, groups: d.groups?.map((g) => (g.id === id ? { ...g, disabled } : g)) }
            : { ...d, users: d.users?.map((u) => (u.number === id ? { ...u, blocked: disabled } : u)) }
          : d,
      );
    },
    [],
  );

  // Setelah langganan diubah dari drawer, perbarui baris di daftar langsung.
  const onSubscribed = useCallback(
    (kind: "group" | "user", id: string, sub: SubInfo) => {
      setData((d) =>
        d
          ? kind === "group"
            ? { ...d, groups: d.groups?.map((g) => (g.id === id ? { ...g, sub } : g)) }
            : { ...d, users: d.users?.map((u) => (u.number === id ? { ...u, sub } : u)) }
          : d,
      );
    },
    [],
  );

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

  const nav: AdminNav = {
    label: t.admin.navLabel,
    logoutLabel: t.admin.logout,
    // Menu & tombol keluar hanya ada setelah login.
    items:
      view === "dash"
        ? [
            { key: "overview", label: t.admin.navOverview },
            { key: "system", label: t.admin.navSystem },
            { key: "groups", label: t.admin.navGroups },
            { key: "users", label: t.admin.navUsers },
          ]
        : [],
    active: tab,
    onSelect: (key) => {
      window.location.hash = key;
    },
    onLogout: view === "dash" ? logout : undefined,
  };

  let content;
  if (view === "checking") {
    content = (
      <section className="pb-20 pt-32 lg:pt-40">
        <div className="shell">
          <p role="status" className="text-sm text-ag-muted">
            {t.admin.loading}
          </p>
        </div>
      </section>
    );
  } else if (view === "login") {
    content = <LoginCard onLogin={load} />;
  } else {
    content = <Dashboard
        data={data}
        error={error}
        tab={tab}
        onRetry={load}
        onToggled={onToggled}
        onSubscribed={onSubscribed}
      />;
  }

  return (
    <>
      <Navbar home={false} admin={nav} />
      <main id="main">{content}</main>
      <Footer home={false} />
    </>
  );
}
