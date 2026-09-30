type MascotArtProps = {
  src: string | null;
  alt: string;
  priority?: boolean;
  sizes?: string;
  float?: boolean;
  className?: string;
};

// Glow radial + cincin tipis di belakang karakter.
function Halo() {
  return (
    <>
      <div
        aria-hidden
        className="animate-glow absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.5),rgb(192_38_211/0.22)_55%,transparent_75%)] blur-2xl"
      />
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full text-white"
      >
        <g fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
          <circle cx="50" cy="52" r="46" strokeOpacity="0.22" strokeDasharray="0.5 1.6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="52" r="36" strokeOpacity="0.14" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </g>
        <g className="fill-ag-pink">
          <circle cx="50" cy="6" r="0.9" />
          <circle cx="93.7" cy="66" r="0.7" opacity="0.7" />
          <circle cx="14" cy="80" r="0.7" opacity="0.7" />
        </g>
      </svg>
    </>
  );
}

// Dipakai saat public/videos/special week.webm belum ada.
function Placeholder() {
  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label="Slot artwork maskot: letakkan special week.webm di public/videos"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full"
    >
      <g stroke="#F472B6" strokeLinecap="round">
        <path d="M20 170 170 120" strokeOpacity="0.55" strokeWidth="2" />
        <path d="M0 215 150 165" strokeOpacity="0.3" strokeWidth="2" />
        <path d="M40 260 180 214" strokeOpacity="0.45" strokeWidth="2" />
        <path d="M10 310 140 268" strokeOpacity="0.2" strokeWidth="2" />
      </g>
      <rect x="120" y="60" width="200" height="400" fill="rgb(139 92 246 / 0.08)" stroke="#8B5CF6" strokeOpacity="0.7" strokeDasharray="6 6" />
      <g stroke="#fff" strokeOpacity="0.8" strokeWidth="2" fill="none">
        <path d="M120 84V60h24" />
        <path d="M296 60h24v24" />
        <path d="M320 436v24h-24" />
        <path d="M144 460h-24v-24" />
      </g>
      <text x="220" y="240" textAnchor="middle" className="fill-white font-display" fontSize="22">
        ARTWORK
      </text>
      <text x="220" y="268" textAnchor="middle" className="fill-white/60" fontSize="11" fontWeight="600">
        special week.webm
      </text>
      <text x="220" y="286" textAnchor="middle" className="fill-white/40" fontSize="10">
        public/videos/
      </text>
    </svg>
  );
}

export function MascotArt({
  src,
  alt,
  priority,
  float = true,
  className = "absolute inset-0",
}: MascotArtProps) {
  return (
    <div className={className}>
      <Halo />
      <div className={`absolute inset-0 ${float ? "animate-float" : ""}`}>
        {src ? (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload={priority ? "auto" : "metadata"}
            aria-label={alt}
            role="img"
            className="h-full w-full object-contain object-bottom"
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
}
