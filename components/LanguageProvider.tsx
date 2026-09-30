"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANG,
  STORAGE_KEY,
  dictionaries,
  isLang,
  type Dict,
  type Lang,
} from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Server & render pertama selalu memakai bahasa default supaya tidak terjadi
  // hydration mismatch; pilihan tersimpan dibaca setelah mount.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLang(saved)) setLangState(saved);
    } catch {
      // localStorage bisa diblokir (mode privat) — abaikan.
    }
  }, []);

  // Sinkronkan <html lang>, judul tab, dan meta description dengan bahasa aktif
  // (judul & description landing hanya di "/").
  useEffect(() => {
    const { meta, admin } = dictionaries[lang];
    document.documentElement.lang = lang;
    if (pathname === "/") {
      document.title = meta.title;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", meta.description);
    } else {
      // Halaman lain (admin) tidak memakai judul landing page.
      document.title = admin.metaTitle;
    }
  }, [lang, pathname]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // abaikan
    }
  }, []);

  const value = useMemo(
    () => ({ lang, t: dictionaries[lang], setLang }),
    [lang, setLang],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage harus dipakai di dalam <LanguageProvider>");
  return ctx;
}
