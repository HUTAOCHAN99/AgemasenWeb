"use client";

import { useInView, useReducedMotion } from "framer-motion";
import {
  EllipsisVertical,
  Forward,
  MessageCircleHeart,
  Mic,
  Paperclip,
  Pin,
  Search,
  Send,
  Smile,
  Terminal,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Lines } from "@/components/ui/Lines";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  GROUP,
  PEOPLE,
  SCENARIOS,
  SCENARIO_KEYS,
  type Msg,
  type Person,
  type ScenarioKey,
} from "@/lib/botPreview";

const MODE_ICON: Record<ScenarioKey, LucideIcon> = {
  chat: MessageCircleHeart,
  command: Terminal,
};

/* **tebal** dan @Agemasen Bot (mention) */
function rich(s: string) {
  return s.split(/(\*\*[^*]+\*\*|@Agemasen Bot)/g).map((p, i) => {
    if (p === "@Agemasen Bot") return <span key={i} className="wa-mention">{p}</span>;
    if (p.startsWith("**") && p.endsWith("**")) return <b key={i}>{p.slice(2, -2)}</b>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

function Avatar({ p, size = 32, fs = 14 }: { p: Pick<Person, "bg" | "letter" | "avatar">; size?: number; fs?: number }) {
  return (
    <div className="wa-av" style={{ width: size, height: size, fontSize: fs, background: p.bg }}>
      {p.avatar ? <img src={p.avatar} alt="" decoding="async" /> : p.letter}
    </div>
  );
}

function Message({ m, onMedia }: { m: Msg; onMedia: () => void }) {
  const p = PEOPLE[m.from];
  const q = m.quote ? PEOPLE[m.quote.who] : null;
  const isImg = m.type === "image";
  return (
    <div className={"wa-row" + (m.head ? " head" : "")}>
      {m.head ? <Avatar p={p} /> : <div className="wa-gap" />}
      <div className={"wa-bub" + (isImg ? " img" : "")}>
        {m.head && (
          <div className="wa-name" style={{ color: p.color }}>
            <span>{p.name}</span>
          </div>
        )}
        {isImg && (
          <div className={"wa-pic" + (m.image ? " photo" : "")}>
            {m.image ? (
              <img src={m.image} alt="" decoding="async" onLoad={onMedia} onError={onMedia} />
            ) : (
              m.letter
            )}
          </div>
        )}
        {q && m.quote && (
          <div className="wa-quote" style={{ borderLeftColor: q.color }}>
            <div className="wa-qn" style={{ color: q.color }}>{q.name}</div>
            <div className="wa-qt">{rich(m.quote.text)}</div>
          </div>
        )}
        {m.big && <div className="wa-big">{m.big}</div>}
        {m.caption && m.caption.length > 0 && <div className="wa-cap wa-txt">{m.caption.join("")}</div>}
        {m.text && <span className="wa-txt">{rich(m.text)}</span>}
        <span className="wa-time">{m.time}</span>
        <div style={{ clear: "both" }} />
      </div>
      {isImg && (
        <span className="wa-fwd" aria-hidden>
          <Forward size={18} />
        </span>
      )}
    </div>
  );
}

function ChatWindow({ mode, play }: { mode: ScenarioKey; play: boolean }) {
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();
  const [msgs, setMsgs] = useState<Msg[]>([SCENARIOS[lang][mode][0]]);
  const [typing, setTyping] = useState(false);
  const [val, setVal] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const group = GROUP[lang];

  // Scroll hanya kotak chat-nya, bukan seluruh halaman.
  const toBottom = useCallback(() => {
    const el = box.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  useEffect(() => {
    toBottom();
  }, [msgs, typing, toBottom]);

  // Mainkan skenario berurutan; ulang dari awal setelah selesai.
  useEffect(() => {
    const script = SCENARIOS[lang][mode];
    setTyping(false);
    if (reduce) {
      setMsgs(script); // gerak dikurangi: tampilkan semuanya sekaligus
      return;
    }
    setMsgs([script[0]]);
    if (!play) return;

    let cancelled = false;
    let timer = 0;
    let i = 1;

    const step = () => {
      if (cancelled) return;
      if (i >= script.length) {
        setTyping(false);
        timer = window.setTimeout(() => {
          if (cancelled) return;
          i = 1;
          setMsgs([script[0]]);
          timer = window.setTimeout(step, 650);
        }, 2600);
        return;
      }
      const m = script[i];
      if (m.from === "bot") {
        setTyping(true);
        const len = (m.text ?? m.caption?.join("") ?? "").length;
        timer = window.setTimeout(() => {
          if (cancelled) return;
          setMsgs((c) => [...c, m]);
          setTyping(false);
          i += 1;
          timer = window.setTimeout(step, 450);
        }, Math.min(1800, Math.max(650, len * 8)));
        return;
      }
      setMsgs((c) => [...c, m]);
      i += 1;
      timer = window.setTimeout(step, 450);
    };

    timer = window.setTimeout(step, 650);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mode, lang, play, reduce]);

  const send = () => {
    const text = val.trim();
    if (!text) return;
    const time = new Date().toTimeString().slice(0, 5);
    setMsgs((c) => [...c, { id: Date.now(), from: "sam", head: true, time, text }]);
    setVal("");
  };

  return (
    <div className="wa" role="region" aria-label={t.botPreview.chatLabel}>
      <div className="wa-hdr">
        <Avatar p={{ bg: PEOPLE.bot.bg, letter: "P", avatar: group.avatar }} size={40} fs={18} />
        <div className="wa-info">
          <div className="wa-title">{group.title}</div>
          <div className="wa-sub">{group.members}</div>
        </div>
        <div className="wa-icons" aria-hidden>
          <Video size={20} />
          <span className="wa-sep" />
          <Search size={20} />
          <EllipsisVertical size={20} />
        </div>
      </div>

      <div className="wa-pin" aria-hidden>
        <Pin size={16} />
        <span><b>{group.pinned}</b> {group.pinnedText}</span>
      </div>

      <div className="wa-chat" ref={box}>
        {msgs.map((m) => (
          <Message key={m.id} m={m} onMedia={toBottom} />
        ))}
        {typing && (
          <div className="wa-row head" role="status" aria-label={t.botPreview.typing}>
            <Avatar p={PEOPLE.bot} />
            <div className="wa-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      <div className="wa-inp">
        <div className="wa-pill">
          <Smile size={22} aria-hidden />
          <Paperclip size={22} aria-hidden />
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t.botPreview.placeholder}
            aria-label={t.botPreview.placeholder}
            enterKeyHint="send"
          />
          <button type="button" onClick={send} aria-label={t.botPreview.send} className="wa-send">
            {val.trim() ? <Send size={22} aria-hidden /> : <Mic size={22} aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BotPreview() {
  const { t } = useLanguage();
  const p = t.botPreview;
  const [mode, setMode] = useState<ScenarioKey>("chat");
  const ref = useRef<HTMLDivElement>(null);
  // Mulai memutar saat section terlihat, supaya animasinya tidak jalan di luar layar.
  const play = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="preview" className="relative border-t border-ag-line py-24 lg:py-36">
      <div className="shell grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Kiri: judul */}
        <Reveal className="lg:col-span-5 lg:pt-4">
          <SectionLabel index="04" label={p.label} />
          <h2 className="display-h mt-8">
            <Lines lines={p.heading} />
          </h2>
          <p className="mt-8 max-w-[40ch] text-[15px] leading-relaxed text-ag-muted">{p.note}</p>

          <div role="group" aria-label={p.modesLabel} className="mt-8 flex flex-wrap gap-2">
            {SCENARIO_KEYS.map((k) => {
              const Icon = MODE_ICON[k];
              const on = mode === k;
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setMode(k)}
                  className={
                    "inline-flex items-center gap-2 border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors motion-reduce:transition-none " +
                    (on
                      ? "border-ag-pink bg-ag-pink text-ag-ink"
                      : "border-ag-line text-ag-fg/80 hover:border-ag-violet/70")
                  }
                >
                  <Icon className="size-4" aria-hidden strokeWidth={1.75} />
                  {p.modes[k]}
                </button>
              );
            })}
          </div>

          <p className="mt-6 max-w-[44ch] text-xs leading-relaxed text-ag-muted/80">{p.demoNote}</p>
        </Reveal>

        {/* Kanan: div chat */}
        <Reveal delay={0.1} className="lg:col-span-7">
          <div
            ref={ref}
            className="h-[580px] overflow-hidden rounded-[4px] border border-ag-line shadow-[0_0_80px_-30px_rgb(139_92_246/0.55)] sm:h-[640px] lg:h-[680px]"
          >
            <ChatWindow mode={mode} play={play} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}