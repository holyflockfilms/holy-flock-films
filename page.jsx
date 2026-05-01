import { useState, useRef, useEffect } from "react";
import { Play, Pause, X, ArrowUpRight, Mail } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER CONTENT — replace with your actual films, posters, trailer URLs,
// and score audio. The structure is what matters; styling will follow.
// ─────────────────────────────────────────────────────────────────────────────

const FILMS = [
  {
    numeral: "I",
    title: "The Long Field",
    year: "MMXXV",
    runtime: "14′",
    format: "16mm · 4:3",
    synopsis:
      "A shepherd's last walk through unenclosed land, told in twelve tableaux. A meditation on loss, ritual, and what the ground remembers when the gates go up.",
    director: "Directed by [Director Name]",
    trailerUrl: "", // paste YouTube/Vimeo embed URL here
    palette: { from: "#3a2418", to: "#0a0908", accent: "#c9a961" },
  },
  {
    numeral: "II",
    title: "Bell-Ringer",
    year: "MMXXIV",
    runtime: "9′",
    format: "Digital · 2.39:1",
    synopsis:
      "An aging bell-ringer prepares the parish for a funeral that may not come. Shot in a single afternoon in a derelict chapel above the Wye.",
    director: "Directed by [Director Name]",
    trailerUrl: "",
    palette: { from: "#1c2a3e", to: "#0a0908", accent: "#a8c2d6" },
  },
  {
    numeral: "III",
    title: "Salt & Wool",
    year: "MMXXIV",
    runtime: "22′",
    format: "35mm · 1.85:1",
    synopsis:
      "A brackish coastline. A Welsh hymnal. A flock that will not enter the water. Official Selection — [Festival Name].",
    director: "Directed by [Director Name]",
    trailerUrl: "",
    palette: { from: "#2c3a3a", to: "#0a0908", accent: "#d4c4a8" },
  },
  {
    numeral: "IV",
    title: "Chapel Light",
    year: "MMXXIII",
    runtime: "11′",
    format: "Digital · 1.66:1",
    synopsis:
      "Three sisters debate the cost of a stained-glass window the village cannot afford. Premiered at [Festival Name].",
    director: "Directed by [Director Name]",
    trailerUrl: "",
    palette: { from: "#5b1a1f", to: "#0a0908", accent: "#e8c87a" },
  },
];

const SCORES = [
  { num: "I",   title: "Procession",            instrumentation: "Solo cello & organ",     duration: "3:42", film: "The Long Field" },
  { num: "II",  title: "Threnody for the Hill", instrumentation: "String quartet",         duration: "5:18", film: "The Long Field" },
  { num: "III", title: "Bell-Ringer's Theme",   instrumentation: "Tubular bells & strings", duration: "2:54", film: "Bell-Ringer" },
  { num: "IV",  title: "Salt Hymn",             instrumentation: "Voice & harmonium",      duration: "4:11", film: "Salt & Wool" },
  { num: "V",   title: "Coda — Chapel Light",   instrumentation: "Solo piano",             duration: "2:03", film: "Chapel Light" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Stylized poster placeholder. Each film gets a unique palette + decoration.
// Replace <PosterArt> with <img src={film.posterUrl}/> when you have artwork.
// ─────────────────────────────────────────────────────────────────────────────

function PosterArt({ film }) {
  const { numeral, title, year, runtime, palette } = film;
  return (
    <svg viewBox="0 0 400 600" className="w-full h-full block">
      <defs>
        <linearGradient id={`g-${numeral}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={palette.from} />
          <stop offset="1" stopColor={palette.to} />
        </linearGradient>
        <radialGradient id={`r-${numeral}`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor={palette.accent} stopOpacity="0.28" />
          <stop offset="1" stopColor={palette.to} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="600" fill={`url(#g-${numeral})`} />
      <rect width="400" height="600" fill={`url(#r-${numeral})`} />

      {/* Decorative motif per film */}
      {numeral === "I" && (
        <g>
          {[260, 295, 330, 365, 400, 435, 470].map((y, i) => (
            <line key={i} x1="40" y1={y} x2="360" y2={y}
              stroke={palette.accent} strokeOpacity={0.12 + i * 0.04} strokeWidth="0.6" />
          ))}
        </g>
      )}
      {numeral === "II" && (
        <g>
          <path d="M200,200 Q158,200 158,250 L158,330 Q158,352 200,352 Q242,352 242,330 L242,250 Q242,200 200,200 Z"
            fill="none" stroke={palette.accent} strokeOpacity="0.3" strokeWidth="0.8" />
          <line x1="200" y1="178" x2="200" y2="200" stroke={palette.accent} strokeOpacity="0.3" strokeWidth="0.8" />
          <circle cx="200" cy="345" r="3.5" fill={palette.accent} fillOpacity="0.45" />
        </g>
      )}
      {numeral === "III" && (
        <g>
          {[270, 300, 330, 360, 390, 420].map((y, i) => (
            <path key={i}
              d={`M0,${y} Q100,${y - 9} 200,${y} T400,${y}`}
              fill="none" stroke={palette.accent}
              strokeOpacity={0.1 + i * 0.05} strokeWidth="0.7" />
          ))}
        </g>
      )}
      {numeral === "IV" && (
        <g>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI - Math.PI / 2;
            const x = 200 + Math.cos(a) * 280;
            const y = 260 + Math.sin(a) * 280;
            return <line key={i} x1="200" y1="260" x2={x} y2={y}
              stroke={palette.accent} strokeOpacity="0.14" strokeWidth="0.5" />;
          })}
          <circle cx="200" cy="260" r="22" fill={palette.accent} fillOpacity="0.22" />
        </g>
      )}

      {/* Top mark */}
      <text x="40" y="62" fill={palette.accent} fillOpacity="0.75"
        style={{ font: '500 11px "Cinzel", serif', letterSpacing: "0.32em" }}>
        OPVS · {numeral}
      </text>
      <line x1="40" y1="76" x2="120" y2="76" stroke={palette.accent} strokeOpacity="0.5" strokeWidth="0.5" />

      {/* Title */}
      <text x="40" y="528" fill="#ede1c8"
        style={{ font: '500 26px "Cinzel", serif', letterSpacing: "0.04em" }}>
        {title.toUpperCase()}
      </text>
      <text x="40" y="554" fill="#ede1c8" fillOpacity="0.55"
        style={{ font: 'italic 400 14px "Cormorant Garamond", serif', letterSpacing: "0.08em" }}>
        {year} · {runtime}
      </text>

      {/* Tiny corner mark */}
      <text x="360" y="62" fill={palette.accent} fillOpacity="0.45" textAnchor="end"
        style={{ font: '400 9px "Cinzel", serif', letterSpacing: "0.3em" }}>
        H · F · F
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Trailer modal
// ─────────────────────────────────────────────────────────────────────────────

function FilmModal({ film, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10"
      style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl"
        style={{ animation: "riseIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
        <button onClick={onClose}
          className="absolute -top-12 right-0 text-[#ede1c8]/70 hover:text-[#c9a961] transition-colors"
          aria-label="Close">
          <X size={22} />
        </button>

        {/* Trailer screen */}
        <div className="relative w-full aspect-video overflow-hidden border border-[#c9a961]/20"
          style={{
            background: `linear-gradient(160deg, ${film.palette.from} 0%, ${film.palette.to} 100%)`,
          }}>
          {film.trailerUrl ? (
            <iframe src={film.trailerUrl} title={film.title}
              className="w-full h-full" frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#ede1c8]/60">
              <div className="w-16 h-16 rounded-full border border-[#ede1c8]/30 flex items-center justify-center mb-5">
                <Play size={22} className="ml-1" />
              </div>
              <p style={{ font: '400 11px "Cinzel", serif', letterSpacing: "0.4em" }}>
                TRAILER · {film.numeral}
              </p>
              <p className="mt-3 text-xs italic opacity-50"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                Embed your Vimeo or YouTube URL in the FILMS array
              </p>
            </div>
          )}
        </div>

        {/* Caption strip */}
        <div className="mt-6 grid md:grid-cols-[1fr_2fr] gap-8">
          <div>
            <p style={{ font: '500 10px "Cinzel", serif', letterSpacing: "0.4em", color: "#c9a961" }}>
              OPVS · {film.numeral}
            </p>
            <h3 className="mt-3 text-3xl text-[#ede1c8]"
              style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
              {film.title}
            </h3>
            <p className="mt-2 text-sm text-[#ede1c8]/55 italic"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              {film.year} · {film.runtime} · {film.format}
            </p>
          </div>
          <div>
            <p className="text-[#ede1c8]/85 text-lg leading-relaxed"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400 }}>
              {film.synopsis}
            </p>
            <p className="mt-4 text-xs text-[#ede1c8]/45 tracking-widest uppercase"
              style={{ fontFamily: '"Cinzel", serif' }}>
              {film.director}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Score player (visual simulation — wire up real audio when ready)
// ─────────────────────────────────────────────────────────────────────────────

function ScorePlayer() {
  const [activeIdx, setActiveIdx] = useState(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (activeIdx === null) {
      setProgress(0);
      return;
    }
    intervalRef.current = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.4));
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [activeIdx]);

  return (
    <ul className="divide-y divide-[#c9a961]/10">
      {SCORES.map((track, i) => {
        const isActive = activeIdx === i;
        return (
          <li key={i}
            className="group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[3rem_1fr_1.5fr_auto] items-center gap-4 py-5 px-2 cursor-pointer transition-colors hover:bg-[#c9a961]/[0.03]"
            onClick={() => setActiveIdx(isActive ? null : i)}>
            <div className="flex items-center justify-center">
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                isActive
                  ? "border-[#c9a961] bg-[#c9a961]/10 text-[#c9a961]"
                  : "border-[#c9a961]/25 text-[#ede1c8]/50 group-hover:border-[#c9a961]/60 group-hover:text-[#c9a961]"
              }`}>
                {isActive ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span style={{ font: '500 10px "Cinzel", serif', letterSpacing: "0.32em", color: "#c9a961" }}>
                  {track.num}
                </span>
                <span className="text-[#ede1c8] text-lg"
                  style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
                  {track.title}
                </span>
              </div>
              {isActive && (
                <div className="mt-2 h-px bg-[#c9a961]/15 overflow-hidden">
                  <div className="h-full bg-[#c9a961]/70 transition-[width]"
                    style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
            <p className="hidden md:block text-sm italic text-[#ede1c8]/55"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              {track.instrumentation} <span className="opacity-60">— from {track.film}</span>
            </p>
            <p className="text-sm text-[#ede1c8]/55 tabular-nums"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              {track.duration}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Brand mark
// ─────────────────────────────────────────────────────────────────────────────

function Fleuron({ className = "" }) {
  return (
    <svg viewBox="0 0 80 16" className={className} aria-hidden="true">
      <line x1="0" y1="8" x2="30" y2="8" stroke="currentColor" strokeWidth="0.5" />
      <text x="40" y="12" textAnchor="middle" fill="currentColor"
        style={{ font: '400 11px serif' }}>❦</text>
      <line x1="50" y1="8" x2="80" y2="8" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function HolyFlockFilms() {
  const [openFilm, setOpenFilm] = useState(null);

  return (
    <div className="min-h-screen w-full text-[#ede1c8] relative overflow-x-hidden"
      style={{
        backgroundColor: "#0a0908",
        fontFamily: '"Spectral", "Cormorant Garamond", Georgia, serif',
      }}>

      {/* Font + keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=Spectral:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes hero1 { from { opacity: 0; transform: translateY(28px) } to { opacity: 1; transform: translateY(0) } }
        .hero-stagger > * { opacity: 0; animation: hero1 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .hero-stagger > *:nth-child(1) { animation-delay: 0.1s; }
        .hero-stagger > *:nth-child(2) { animation-delay: 0.35s; }
        .hero-stagger > *:nth-child(3) { animation-delay: 0.6s; }
        .hero-stagger > *:nth-child(4) { animation-delay: 0.85s; }
        .hero-stagger > *:nth-child(5) { animation-delay: 1.1s; }
      `}</style>

      {/* Film grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
        }} />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-30"
        style={{ background: "radial-gradient(circle at 50% 30%, transparent 0%, rgba(0,0,0,0.45) 100%)" }} />

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] text-[#ede1c8]/55"
          style={{ fontFamily: '"Cinzel", serif' }}>
          <span>EST. MMXXV</span>
          <span className="text-[#c9a961]/60">✦</span>
          <span className="hidden sm:inline">CAERDYDD · CARDIFF</span>
        </div>
        <ul className="hidden md:flex items-center gap-8 text-[10px] tracking-[0.36em] text-[#ede1c8]/65"
          style={{ fontFamily: '"Cinzel", serif' }}>
          <li><a href="#films" className="hover:text-[#c9a961] transition-colors">FILMS</a></li>
          <li><a href="#scores" className="hover:text-[#c9a961] transition-colors">SCORES</a></li>
          <li><a href="#manifesto" className="hover:text-[#c9a961] transition-colors">MANIFESTO</a></li>
          <li><a href="#contact" className="hover:text-[#c9a961] transition-colors">CONTACT</a></li>
        </ul>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <header className="relative z-10 px-6 md:px-12 pt-16 md:pt-28 pb-32 md:pb-44">
        <div className="hero-stagger max-w-7xl">
          <p className="text-[#c9a961] text-xs md:text-sm tracking-[0.5em] mb-10"
            style={{ fontFamily: '"Cinzel", serif' }}>
            ❦ &nbsp; HOLY FLOCK &nbsp; ❦
          </p>

          <h1 className="leading-[0.88] text-[#ede1c8]"
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 500,
              fontSize: "clamp(3.5rem, 13vw, 14rem)",
              letterSpacing: "-0.01em",
            }}>
            HOLY<br />
            <span className="italic font-normal" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              flock
            </span><br />
            FILMS
          </h1>

          <div className="mt-14 max-w-xl">
            <p className="text-lg md:text-xl text-[#ede1c8]/75 italic leading-relaxed"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Independent cinema from the Welsh marches.
              Quiet pictures, slow looking, devotional craft.
            </p>
          </div>

          <div className="mt-20 flex items-end gap-10">
            <a href="#films"
              className="group inline-flex items-baseline gap-3 text-[#c9a961] hover:text-[#ede1c8] transition-colors"
              style={{ font: '500 11px "Cinzel", serif', letterSpacing: "0.4em" }}>
              VIEW THE WORKS
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
            <span className="text-[#ede1c8]/30 text-[10px] tracking-[0.4em] hidden sm:inline"
              style={{ fontFamily: '"Cinzel", serif' }}>
              IV WORKS · MMXXIII—MMXXV
            </span>
          </div>

          <Fleuron className="mt-24 w-32 h-4 text-[#c9a961]/40" />
        </div>
      </header>

      {/* ── MANIFESTO ─────────────────────────────────────────────────────── */}
      <section id="manifesto" className="relative z-10 px-6 md:px-12 py-24 md:py-32 border-t border-[#c9a961]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
          <div>
            <p className="text-[#c9a961] text-[10px] tracking-[0.4em] mb-4"
              style={{ fontFamily: '"Cinzel", serif' }}>
              ❦ &nbsp; I
            </p>
            <h2 className="text-3xl md:text-4xl text-[#ede1c8]"
              style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
              MANIFESTO
            </h2>
          </div>
          <div className="space-y-6 text-[#ede1c8]/85 text-lg md:text-xl leading-relaxed"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            <p>
              <span className="float-left text-7xl text-[#c9a961] mr-3 mt-1 leading-none"
                style={{ fontFamily: '"Cinzel", serif', fontWeight: 500 }}>W</span>
              e make short films the way our forebears made altarpieces — slowly,
              patiently, and for the room they belong in. Every frame is composed.
              Every score is written for the picture, not borrowed for it.
            </p>
            <p className="italic text-[#ede1c8]/65">
              We believe in the long take, the held silence, the wool of weather, and
              the small congregation of people who still want to sit in the dark.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILMS ─────────────────────────────────────────────────────────── */}
      <section id="films" className="relative z-10 px-6 md:px-12 py-24 md:py-32 border-t border-[#c9a961]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 md:mb-24 flex-wrap gap-6">
            <div>
              <p className="text-[#c9a961] text-[10px] tracking-[0.4em] mb-4"
                style={{ fontFamily: '"Cinzel", serif' }}>
                ❦ &nbsp; II
              </p>
              <h2 className="text-3xl md:text-5xl text-[#ede1c8]"
                style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
                THE WORKS
              </h2>
            </div>
            <p className="italic text-[#ede1c8]/55 max-w-sm"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              A complete catalogue of short films and trailers, MMXXIII to present.
              Click any work to view the trailer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {FILMS.map((film) => (
              <button key={film.numeral}
                onClick={() => setOpenFilm(film)}
                className="group text-left relative overflow-hidden border border-[#c9a961]/15 hover:border-[#c9a961]/50 transition-all duration-500 bg-[#0a0908]">
                <div className="aspect-[2/3] overflow-hidden">
                  <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.04]">
                    <PosterArt film={film} />
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.85) 100%)" }}>
                  <div className="flex flex-col items-center text-[#ede1c8]">
                    <div className="w-14 h-14 rounded-full border border-[#c9a961] flex items-center justify-center mb-4">
                      <Play size={16} className="ml-0.5 text-[#c9a961]" />
                    </div>
                    <span className="text-[10px] tracking-[0.4em] text-[#c9a961]"
                      style={{ fontFamily: '"Cinzel", serif' }}>
                      VIEW TRAILER
                    </span>
                  </div>
                </div>

                {/* Caption */}
                <div className="px-5 py-5 border-t border-[#c9a961]/15 flex items-baseline justify-between">
                  <span className="text-[10px] tracking-[0.3em] text-[#ede1c8]/55"
                    style={{ fontFamily: '"Cinzel", serif' }}>
                    {film.format}
                  </span>
                  <ArrowUpRight size={14} className="text-[#c9a961]/60 group-hover:text-[#c9a961] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORES ────────────────────────────────────────────────────────── */}
      <section id="scores" className="relative z-10 px-6 md:px-12 py-24 md:py-32 border-t border-[#c9a961]/10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <p className="text-[#c9a961] text-[10px] tracking-[0.4em] mb-4"
                style={{ fontFamily: '"Cinzel", serif' }}>
                ❦ &nbsp; III
              </p>
              <h2 className="text-3xl md:text-5xl text-[#ede1c8]"
                style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
                THE SCORES
              </h2>
            </div>
            <p className="italic text-[#ede1c8]/55 max-w-sm text-right"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Original compositions, written for picture.
              Liner notes from the studio.
            </p>
          </div>

          <ScorePlayer />

          <p className="mt-10 text-xs italic text-[#ede1c8]/45"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Wire each track to a real audio file in the SCORES array to enable playback.
          </p>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" className="relative z-10 px-6 md:px-12 py-28 md:py-36 border-t border-[#c9a961]/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a961] text-[10px] tracking-[0.4em] mb-6"
            style={{ fontFamily: '"Cinzel", serif' }}>
            ❦ &nbsp; IV &nbsp; ❦
          </p>
          <h2 className="text-4xl md:text-6xl text-[#ede1c8] mb-10"
            style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
            CORRESPONDENCE
          </h2>
          <p className="text-xl md:text-2xl italic text-[#ede1c8]/75 mb-14 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            For festival submissions, commissions, or to enquire about a private screening.
          </p>
          <a href="mailto:hello@holyflock.film"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#c9a961]/40 text-[#ede1c8] hover:bg-[#c9a961]/10 hover:border-[#c9a961] transition-all"
            style={{ font: '500 11px "Cinzel", serif', letterSpacing: "0.36em" }}>
            <Mail size={14} className="text-[#c9a961]" />
            HELLO@HOLYFLOCK.FILM
          </a>
          <Fleuron className="mt-20 w-32 h-4 text-[#c9a961]/40 mx-auto" />
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 px-6 md:px-12 py-10 border-t border-[#c9a961]/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.32em] text-[#ede1c8]/35"
          style={{ fontFamily: '"Cinzel", serif' }}>
          <p>HOLY FLOCK FILMS · CAERDYDD</p>
          <p>© MMXXVI · ALL WORKS RESERVED</p>
        </div>
      </footer>

      {/* Trailer modal */}
      {openFilm && <FilmModal film={openFilm} onClose={() => setOpenFilm(null)} />}
    </div>
  );
}
