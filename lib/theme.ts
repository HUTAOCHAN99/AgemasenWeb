// Tema situs. Default = dark (tampilan asli). Pilihan disimpan di localStorage
// dan diterapkan ke <html data-theme="..."> oleh skrip inline di app/layout.tsx
// sebelum halaman digambar, jadi tidak ada kedipan.

export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";
export const THEME_STORAGE_KEY = "agemasen-theme";

// Warna <meta name="theme-color"> (bar browser di mobile) per tema.
export const THEME_COLOR: Record<Theme, string> = {
  dark: "#08070D",
  light: "#F7F5FC",
};

export function isTheme(v: unknown): v is Theme {
  return v === "dark" || v === "light";
}

// Dipasang di <head> sebagai skrip inline (harus berdiri sendiri, tanpa import).
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
