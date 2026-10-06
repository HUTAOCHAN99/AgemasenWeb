"use client";

import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ActionButton } from "@/components/ui/ActionButton";
import { MascotArt } from "@/components/ui/MascotArt";
import { Reveal } from "@/components/ui/Reveal";

function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-ag-muted"
      >
        {label}
      </label>
      <div className="flex items-center border border-ag-line bg-ag-ink/60 transition-colors focus-within:border-ag-violet">
        <span aria-hidden className="ml-4 shrink-0 text-ag-muted">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

const inputCls =
  "min-w-0 flex-1 bg-transparent px-3.5 py-3 text-sm text-ag-fg outline-none placeholder:text-ag-muted/70 focus-visible:outline-none";

// onLogin dipanggil setelah /api/login berhasil; induknya yang memuat statistik.
export function LoginCard({ onLogin }: { onLogin: () => Promise<void> }) {
  const { t } = useLanguage();
  const a = t.admin;
  const userRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = user.trim();
    setErr("");
    if (!u || !pw) {
      setErr(!u ? a.errUser : a.errPw);
      (!u ? userRef : pwRef).current?.focus();
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: pw }),
      });
      if (r.ok) {
        setPw("");
        await onLogin();
      } else {
        const d = await r.json().catch(() => ({}));
        setErr(d.error || a.errLogin);
        pwRef.current?.select();
      }
    } catch {
      setErr(a.errNetwork);
    }
    setBusy(false);
  }

  return (
    <section
      aria-labelledby="login-title"
      className="relative flex items-center pb-16 pt-28 lg:min-h-svh lg:pt-32"
    >
      <div className="shell w-full">
        <Reveal>
          <div className="mx-auto grid max-w-[960px] overflow-hidden rounded-[6px] border border-ag-line bg-ag-ink-2/80 md:grid-cols-2">
            {/* Sisi kiri: maskot, nuansa sama dengan section CTA landing page */}
            <div
              aria-hidden
              className="relative h-56 overflow-hidden border-b border-ag-line bg-[linear-gradient(135deg,#2b1259_0%,#1a0b3a_55%,#0d0a14_100%)] light:bg-[linear-gradient(135deg,#efe9ff_0%,#faf7ff_55%,#f7eaf1_100%)] md:h-auto md:min-h-[540px] md:border-b-0 md:border-r"
            >
              <div className="grid-lines absolute inset-0" />
              <p className="absolute left-4 top-4 z-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-ag-fg/50">
                Admin / 00
              </p>
              <MascotArt
                src="/image/profile.png"
                alt=""
                kind="image"
                float={false}
                sizes="(min-width: 768px) 480px, 90vw"
                className="absolute inset-0 pt-8"
              />
            </div>

            <form
              onSubmit={submit}
              noValidate
              className="flex flex-col justify-center gap-5 p-7 sm:p-10"
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-pink">
                  {a.eyebrow}
                </p>
                <h1
                  id="login-title"
                  className="display-h mt-4 text-[clamp(1.9rem,4.4vw,2.75rem)]"
                >
                  {a.loginTitle}
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-ag-muted">
                  {a.loginLead}
                </p>
              </div>

              <Field id="user" label={a.username} icon={<User className="size-[18px]" />}>
                <input
                  ref={userRef}
                  id="user"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={a.usernamePh}
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className={inputCls}
                />
              </Field>

              <Field id="pw" label={a.password} icon={<Lock className="size-[18px]" />}>
                <input
                  ref={pwRef}
                  id="pw"
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={a.passwordPh}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-pressed={show}
                  aria-label={show ? a.hideLabel : a.showLabel}
                  title={show ? a.hideLabel : a.showLabel}
                  className="flex size-11 shrink-0 items-center justify-center text-ag-muted transition-colors hover:text-ag-fg"
                >
                  {show ? (
                    <EyeOff className="size-[18px]" aria-hidden />
                  ) : (
                    <Eye className="size-[18px]" aria-hidden />
                  )}
                </button>
              </Field>

              <p role="alert" className="min-h-[1.4em] text-sm font-semibold text-ag-pink">
                {err}
              </p>

              <ActionButton type="submit" size="lg" block disabled={busy}>
                {busy ? a.checking : a.submit}
              </ActionButton>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}