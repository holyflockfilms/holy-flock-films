"use client";

import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// 6 CLUSTERS — each holds 6 cards of similar size, bunched tightly.
// pos.x/y are fractions of the 1.5×viewport canvas (0..1).
// dx/dy are pixel offsets from the cluster anchor (tight: roughly ±100).
// spread is a unit-vector direction the card flies in when cursor is near.
// ─────────────────────────────────────────────────────────────────────────────

const CLUSTERS = [
  {
    id: "i", numeral: "I",
    title: "Love Me, Hold Me, Always", year: "2025", runtime: "15′", format: "Digital",
    synopsis: "A shepherd's last walk through unenclosed land, told in twelve tableaux. A meditation on loss, ritual, and what the ground remembers when the gates go up.",
    note: "shot on 16mm — Brecons, late October",
    palette: { from: "#3a2418", to: "#0a0908", accent: "#c9a961" },
    trailer: { url: "https://player.vimeo.com/video/1105811175?h=dc1d1bdcff&badge=0&autopause=0&player_id=0&app_id=58479", aspect: 1 / 0.7383 },
    pos: { x: 0.20, y: 0.26 },
    cards: [
      { kind: "poster",    img: "/films/long-field/LMHMA_poster.jpg",         w: 380, dx:    0, dy:    0, rot: -3, spread: [ 0.0,  0.0] },
      { kind: "landscape", img: "/films/love-me-hold-me-always/LMHMA_Still_01.jpg", w: 395, dx: -120, dy:  -85, rot: -7, spread: [-1.0, -0.7] },
      { kind: "closeup",   img: "/films/love-me-hold-me-always/LMHMA_Still_02.jpg", w: 350, dx:  125, dy:  -80, rot:  5, spread: [ 1.0, -0.6] },
      { kind: "frame",     img: "/films/love-me-hold-me-always/LMHMA_Still_03.jpg", w: 365, dx:  105, dy:  115, rot:  6, spread: [ 0.7,  0.8] },
      { kind: "landscape", img: "/films/love-me-hold-me-always/LMHMA_Still_04.jpg", w: 360, dx: -100, dy:  108, rot: -5, spread: [-0.8,  0.8] },
      { kind: "closeup",   img: "/films/love-me-hold-me-always/LMHMA_Still_05.jpg", w: 345, dx:   -5, dy:  160, rot:  4, spread: [ 0.0,  1.0] },
    ],
  },
  {
    id: "ii", numeral: "II",
    title: "Bell-Ringer", year: "MMXXIV", runtime: "9′", format: "Digital",
    synopsis: "An aging bell-ringer prepares the parish for a funeral that may not come.",
    note: "single afternoon, derelict chapel",
    palette: { from: "#1c2a3e", to: "#0a0908", accent: "#a8c2d6" },
    pos: { x: 0.55, y: 0.22 },
    cards: [
      { kind: "poster", img: "/films/long-field/ITAE_poster.jpg", w: 380, dx: 0, dy: 0, rot: -3, spread: [0.0, 0.0] },
      { kind: "landscape", w: 300, dx: -100, dy:  -75, rot:  -6, spread: [-1.0, -0.6] },
      { kind: "closeup",   w: 275, dx:  108, dy:  -68, rot:   4, spread: [ 1.0, -0.5] },
      { kind: "frame",     w: 290, dx:   88, dy:  100, rot:   8, spread: [ 0.7,  0.8] },
      { kind: "landscape", w: 280, dx:  -88, dy:   97, rot:  -3, spread: [-0.8,  0.8] },
      { kind: "closeup",   w: 265, dx:    0, dy:  135, rot:   5, spread: [ 0.0,  1.0] },
    ],
  },
  {
    id: "iii", numeral: "III",
    title: "Salt & Wool", year: "MMXXIV", runtime: "22′", format: "35mm · 1.85:1",
    synopsis: "A brackish coastline. A Welsh hymnal. A flock that will not enter the water.",
    note: "the longest one — the one we like best",
    palette: { from: "#2c3a3a", to: "#0a0908", accent: "#d4c4a8" },
    trailer: { url: "https://player.vimeo.com/video/912247753?h=d282e7a789&badge=0&autopause=0&player_id=0&app_id=58479", aspect: 16 / 9 },
    pos: { x: 0.82, y: 0.30 },
    cards: [
      { kind: "poster", img: "/films/long-field/FOS_poster.jpg", w: 420, dx:    0, dy:    0, rot:  -3, spread: [ 0.0, -0.2] },
      { kind: "landscape", w: 435, dx: -135, dy: -100, rot:   5, spread: [-1.0, -0.5] },
      { kind: "closeup",   w: 400, dx:  135, dy:  -88, rot:  -4, spread: [ 1.0, -0.6] },
      { kind: "frame",     w: 415, dx:  115, dy:  120, rot:   6, spread: [ 0.7,  0.7] },
      { kind: "landscape", w: 405, dx: -108, dy:  118, rot:  -5, spread: [-0.8,  0.7] },
      { kind: "closeup",   w: 390, dx:    0, dy:  175, rot:   3, spread: [ 0.0,  1.0] },
    ],
  },
  {
    id: "iv", numeral: "IV",
    title: "Chapel Light", year: "MMXXIII", runtime: "11′", format: "Digital",
    synopsis: "Three sisters debate the cost of a stained-glass window the village cannot afford.",
    note: "first one. still fond.",
    palette: { from: "#5b1a1f", to: "#0a0908", accent: "#e8c87a" },
    pos: { x: 0.20, y: 0.72 },
    cards: [
      { kind: "poster",    w: 330, dx:    0, dy:    0, rot:   4, spread: [ 0.0,  0.0] },
      { kind: "landscape", w: 345, dx: -115, dy:  -80, rot:  -7, spread: [-1.0, -0.6] },
      { kind: "closeup",   w: 308, dx:  115, dy:  -75, rot:   3, spread: [ 1.0, -0.5] },
      { kind: "frame",     w: 322, dx:   95, dy:  108, rot:   9, spread: [ 0.7,  0.7] },
      { kind: "landscape", w: 315, dx:  -94, dy:  105, rot:  -4, spread: [-0.8,  0.8] },
      { kind: "closeup",   w: 300, dx:   -5, dy:  150, rot:   5, spread: [ 0.0,  1.0] },
    ],
  },
  {
    id: "v", numeral: "V",
    title: "The Last Hurrah", year: "MMXXVI", runtime: "—", format: "in production",
    synopsis: "[working title] A choir of farmers gathers each evening to sing the day's losses.",
    note: "in production — Snowdonia, spring",
    palette: { from: "#3a2a4a", to: "#0a0908", accent: "#c8a3d8" },
    pos: { x: 0.52, y: 0.78 },
    cards: [
      { kind: "poster", img: "/films/long-field/The_Last_Hurrah_poster.jpg", w: 300, dx: 0, dy: 0, rot: -5, spread: [0.0, 0.0] },
      { kind: "landscape", w: 315, dx: -105, dy:  -78, rot:   6, spread: [-1.0, -0.6] },
      { kind: "closeup",   w: 280, dx:  108, dy:  -70, rot:  -3, spread: [ 1.0, -0.5] },
      { kind: "frame",     w: 295, dx:   88, dy:  102, rot:   7, spread: [ 0.7,  0.7] },
      { kind: "landscape", w: 287, dx:  -88, dy:  100, rot:  -5, spread: [-0.8,  0.8] },
      { kind: "closeup",   w: 273, dx:   -5, dy:  138, rot:   4, spread: [ 0.0,  1.0] },
    ],
  },
  {
    id: "vi", numeral: "VI",
    title: "Quire", year: "MMXXVI", runtime: "—", format: "pre-production",
    synopsis: "[working title] An almost-empty cathedral, an organ tuner, a stranger.",
    note: "pre-production",
    palette: { from: "#1c3a2c", to: "#0a0908", accent: "#9bbf9b" },
    pos: { x: 0.82, y: 0.74 },
    cards: [
      { kind: "poster",    w: 370, dx:    0, dy:    0, rot:   3, spread: [ 0.0, -0.2] },
      { kind: "landscape", w: 385, dx: -125, dy:  -95, rot:  -6, spread: [-1.0, -0.6] },
      { kind: "closeup",   w: 350, dx:  128, dy:  -80, rot:   5, spread: [ 1.0, -0.5] },
      { kind: "frame",     w: 365, dx:  105, dy:  118, rot:   8, spread: [ 0.7,  0.8] },
      { kind: "landscape", w: 357, dx: -100, dy:  115, rot:  -5, spread: [-0.8,  0.8] },
      { kind: "closeup",   w: 343, dx:   -5, dy:  165, rot:   4, spread: [ 0.0,  1.0] },
    ],
  },
];

const SCORES = [
  { num: "I",   title: "Procession",            inst: "Solo cello & organ",      duration: "3:42", film: "The Long Field",  size: "lg", italic: false },
  { num: "II",  title: "Threnody for the Hill", inst: "String quartet",          duration: "5:18", film: "The Long Field",  size: "md", italic: true  },
  { num: "III", title: "Bell-Ringer's Theme",   inst: "Tubular bells & strings", duration: "2:54", film: "Bell-Ringer",     size: "xl", italic: false },
  { num: "IV",  title: "Salt Hymn",             inst: "Voice & harmonium",       duration: "4:11", film: "Salt & Wool",     size: "md", italic: true  },
  { num: "V",   title: "Coda — Chapel Light",   inst: "Solo piano",              duration: "2:03", film: "Chapel Light",    size: "lg", italic: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// HAND-DRAWN DOODLES
// ─────────────────────────────────────────────────────────────────────────────

function Sheep({ size = 64, className = "", style = {} }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 100 78" className={className} style={style}>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 22 50 Q 16 36 28 30 Q 28 22 38 24 Q 42 18 50 22 Q 58 18 62 24 Q 72 22 72 30 Q 84 36 78 50 Q 78 58 70 58 L 30 58 Q 22 58 22 50 Z" />
        <line x1="32" y1="58" x2="30" y2="68" /><line x1="42" y1="58" x2="44" y2="68" />
        <line x1="58" y1="58" x2="56" y2="68" /><line x1="68" y1="58" x2="70" y2="68" />
        <ellipse cx="80" cy="42" rx="9" ry="7.5" fill="currentColor" />
      </g>
    </svg>
  );
}

function Halo({ size = 80, className = "", style = {} }) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 100 40" className={className} style={style}>
      <ellipse cx="50" cy="20" rx="42" ry="14" fill="none" stroke="currentColor"
        strokeWidth="1.4" strokeDasharray="3 2" strokeLinecap="round" />
    </svg>
  );
}

function Fleuron({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <text x="12" y="18" textAnchor="middle" fill="currentColor"
        style={{ font: "400 16px serif" }}>❦</text>
    </svg>
  );
}

function CrossOut({ children, className = "" }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 30">
        <path d="M 2 22 Q 25 8, 50 18 T 98 12" fill="none" stroke="currentColor"
          strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
      </svg>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOODLED BACKGROUND across the full 1.5×viewport canvas
// ─────────────────────────────────────────────────────────────────────────────

function DoodleBG() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 2400 1350" preserveAspectRatio="none">
      <g stroke="#c9a961" strokeWidth="0.7" fill="none" strokeOpacity="0.14" strokeLinecap="round">
        {/* Long meandering lines */}
        <path d="M -50 240 Q 300 160 600 280 T 1200 260 T 1800 320 T 2450 270" />
        <path d="M 60 540 Q 360 520 660 580 T 1260 550 T 1860 600 T 2450 570" strokeDasharray="3 5" />
        <path d="M -30 880 Q 300 920 600 880 T 1200 920 T 1800 880 T 2450 920" />
        <path d="M 80 1140 Q 380 1120 680 1170 T 1280 1140 T 1880 1180 T 2450 1140" strokeDasharray="2 4" />

        {/* Vertical wandering lines */}
        <path d="M 450 -20 Q 470 200 430 400 T 470 800 T 430 1200 T 450 1370" strokeOpacity="0.1" />
        <path d="M 1650 -20 Q 1630 200 1670 400 T 1630 800 T 1670 1200 T 1650 1370" strokeOpacity="0.1" />

        {/* Halos */}
        <ellipse cx="290" cy="140" rx="90" ry="22" strokeDasharray="3 3" strokeOpacity="0.18" />
        <ellipse cx="1280" cy="240" rx="100" ry="26" strokeDasharray="3 3" strokeOpacity="0.16" />
        <ellipse cx="2050" cy="420" rx="80" ry="20" strokeDasharray="3 3" strokeOpacity="0.18" />
        <ellipse cx="380" cy="820" rx="100" ry="24" strokeDasharray="3 3" strokeOpacity="0.16" />
        <ellipse cx="1450" cy="940" rx="90" ry="22" strokeDasharray="3 3" strokeOpacity="0.18" />
        <ellipse cx="2200" cy="1040" rx="70" ry="18" strokeDasharray="3 3" strokeOpacity="0.18" />

        {/* Cross marks */}
        <g strokeOpacity="0.28">
          <path d="M 900 60 L 918 78 M 918 60 L 900 78" />
          <path d="M 1800 180 L 1818 198 M 1818 180 L 1800 198" />
          <path d="M 160 460 L 178 478 M 178 460 L 160 478" />
          <path d="M 2120 700 L 2138 718 M 2138 700 L 2120 718" />
          <path d="M 1140 1160 L 1158 1178 M 1158 1160 L 1140 1178" />
          <path d="M 600 980 L 618 998 M 618 980 L 600 998" />
        </g>

        {/* Scribbles */}
        <path d="M 820 360 Q 830 350 840 360 T 860 360 T 880 360 T 900 360" strokeOpacity="0.22" />
        <path d="M 1720 520 Q 1730 510 1740 520 T 1760 520 T 1780 520" strokeOpacity="0.22" />
        <path d="M 460 1240 Q 470 1230 480 1240 T 500 1240 T 520 1240" strokeOpacity="0.22" />

        {/* Sheep silhouettes faint */}
        <g transform="translate(1050, 580) scale(0.6)" strokeOpacity="0.13">
          <path d="M 22 50 Q 16 36 28 30 Q 28 22 38 24 Q 42 18 50 22 Q 58 18 62 24 Q 72 22 72 30 Q 84 36 78 50 Q 78 58 70 58 L 30 58 Q 22 58 22 50 Z" />
          <ellipse cx="80" cy="42" rx="9" ry="7.5" fill="currentColor" fillOpacity="0.1" />
        </g>
        <g transform="translate(1950, 820) scale(0.5)" strokeOpacity="0.11">
          <path d="M 22 50 Q 16 36 28 30 Q 28 22 38 24 Q 42 18 50 22 Q 58 18 62 24 Q 72 22 72 30 Q 84 36 78 50 Q 78 58 70 58 L 30 58 Q 22 58 22 50 Z" />
          <ellipse cx="80" cy="42" rx="9" ry="7.5" fill="currentColor" fillOpacity="0.1" />
        </g>

        {/* Smaller, more discreet ghost type */}
        <text x="1200" y="660" textAnchor="middle" fill="#c9a961" fillOpacity="0.045"
          style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, fontSize: 130, letterSpacing: "0.12em" }}>
          ❦ HOLY FLOCK FILMS ❦
        </text>

        {/* Annotation arrows */}
        <path d="M 1380 380 Q 1430 360 1480 400" strokeOpacity="0.22" />
        <path d="M 1472 392 L 1480 400 L 1474 410" strokeOpacity="0.22" />
        <path d="M 540 760 Q 500 780 480 820" strokeOpacity="0.18" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────────────────────

function CustomCursor({ dragMode }) {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hover, setHover] = useState("default");

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target.closest && e.target.closest("[data-cursor]");
      setHover(t?.dataset.cursor || "default");
    };
    const onLeave = () => setPos({ x: -200, y: -200 });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const mode = dragMode === "grabbing" ? "grabbing" : (hover !== "default" ? hover : (dragMode || "default"));
  const sizes = { default: 10, grab: 44, grabbing: 38, link: 36, view: 88, play: 64, pause: 64, mail: 56 };
  const size = sizes[mode] ?? 10;

  return (
    <div className="hidden md:block fixed top-0 left-0 pointer-events-none z-[300]"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}>
      <div className="relative -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px`, mixBlendMode: "difference" }}>
        <div className="absolute inset-0 rounded-full border-[1.5px]" style={{ borderColor: "#ede1c8" }} />
        {mode === "default" && <div className="w-1 h-1 rounded-full" style={{ background: "#ede1c8" }} />}
        {mode === "grab" && (
          <span className="text-[#ede1c8] text-[8px] tracking-[0.4em]"
            style={{ fontFamily: '"Cinzel", serif' }}>DRAG</span>
        )}
        {mode === "grabbing" && (
          <span className="text-[#ede1c8] text-[8px] tracking-[0.4em]"
            style={{ fontFamily: '"Cinzel", serif' }}>· · ·</span>
        )}
        {mode === "view" && (
          <span className="text-[#ede1c8] text-[10px] tracking-[0.4em]"
            style={{ fontFamily: '"Cinzel", serif' }}>VIEW</span>
        )}
        {mode === "play" && (
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5 L11 7 L3 12.5 Z" fill="#ede1c8" /></svg>
        )}
        {mode === "pause" && (
          <div className="flex gap-1.5">
            <div className="w-1 h-3.5" style={{ background: "#ede1c8" }} />
            <div className="w-1 h-3.5" style={{ background: "#ede1c8" }} />
          </div>
        )}
        {mode === "mail" && (
          <span className="text-[#ede1c8] text-[8px] tracking-[0.4em]"
            style={{ fontFamily: '"Cinzel", serif' }}>WRITE</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD ART
// ─────────────────────────────────────────────────────────────────────────────

function CardArt({ kind, palette, numeral, idx = 0, img }) {
  if (img) {
    return (
      <img
        src={img}
        alt=""
        className="w-full h-full block object-cover"
        draggable={false}
      />
    );
  }
  const id = `${numeral}-${idx}`;
  if (kind === "poster") {
    return (
      <svg viewBox="0 0 200 280" className="w-full h-full block">
        <defs>
          <linearGradient id={`pg-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.from} /><stop offset="1" stopColor={palette.to} />
          </linearGradient>
          <radialGradient id={`pr-${id}`} cx="0.5" cy="0.35" r="0.7">
            <stop offset="0" stopColor={palette.accent} stopOpacity="0.32" />
            <stop offset="1" stopColor={palette.to} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="280" fill={`url(#pg-${id})`} />
        <rect width="200" height="280" fill={`url(#pr-${id})`} />
        <text x="14" y="28" fill={palette.accent} fillOpacity="0.85"
          style={{ font: '500 8px "Cinzel", serif', letterSpacing: "0.36em" }}>
          OPVS · {numeral}
        </text>
        <line x1="14" y1="36" x2="60" y2="36" stroke={palette.accent} strokeOpacity="0.55" strokeWidth="0.4" />
        <text x="14" y="252" fill="#ede1c8"
          style={{ font: '500 13px "Cinzel", serif', letterSpacing: "0.04em" }}>
          {numeral}
        </text>
        <text x="186" y="252" fill="#ede1c8" fillOpacity="0.5" textAnchor="end"
          style={{ font: 'italic 400 8px "Cormorant Garamond", serif' }}>
          poster
        </text>
      </svg>
    );
  }
  if (kind === "landscape") {
    return (
      <svg viewBox="0 0 280 160" className="w-full h-full block">
        <defs>
          <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.from} stopOpacity="0.6" />
            <stop offset="0.55" stopColor={palette.accent} stopOpacity="0.35" />
            <stop offset="1" stopColor={palette.to} />
          </linearGradient>
        </defs>
        <rect width="280" height="160" fill={`url(#lg-${id})`} />
        <line x1="0" y1="92" x2="280" y2="92" stroke={palette.accent} strokeOpacity="0.4" strokeWidth="0.6" />
        <line x1="0" y1="100" x2="280" y2="100" stroke={palette.accent} strokeOpacity="0.2" strokeWidth="0.4" />
        <circle cx="200" cy="55" r="22" fill={palette.accent} fillOpacity="0.18" />
        <circle cx="200" cy="55" r="10" fill={palette.accent} fillOpacity="0.3" />
        <text x="14" y="148" fill="#ede1c8" fillOpacity="0.45"
          style={{ font: 'italic 400 8px "Cormorant Garamond", serif' }}>
          frame · still
        </text>
      </svg>
    );
  }
  if (kind === "closeup") {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full block">
        <defs>
          <radialGradient id={`cg-${id}`} cx="0.5" cy="0.5" r="0.7">
            <stop offset="0" stopColor={palette.accent} stopOpacity="0.5" />
            <stop offset="0.5" stopColor={palette.from} />
            <stop offset="1" stopColor={palette.to} />
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#cg-${id})`} />
        <circle cx="100" cy="100" r="32" fill={palette.accent} fillOpacity="0.18" />
        <circle cx="100" cy="100" r="14" fill={palette.accent} fillOpacity="0.3" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={100 + Math.cos(a) * 50} y1={100 + Math.sin(a) * 50}
            x2={100 + Math.cos(a) * 70} y2={100 + Math.sin(a) * 70}
            stroke={palette.accent} strokeOpacity="0.25" strokeWidth="0.5" />;
        })}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full block">
      <defs>
        <linearGradient id={`fg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={palette.to} /><stop offset="1" stopColor={palette.from} />
        </linearGradient>
      </defs>
      <rect width="200" height="220" fill={palette.to} />
      <rect x="0" y="40" width="200" height="140" fill={`url(#fg-${id})`} />
      <line x1="0" y1="40" x2="200" y2="40" stroke={palette.accent} strokeOpacity="0.2" strokeWidth="0.6" />
      <line x1="0" y1="180" x2="200" y2="180" stroke={palette.accent} strokeOpacity="0.2" strokeWidth="0.6" />
      <text x="14" y="28" fill={palette.accent} fillOpacity="0.6"
        style={{ font: '400 8px "Cinzel", serif', letterSpacing: "0.3em" }}>
        ASPECT 1.85
      </text>
      <text x="14" y="208" fill="#ede1c8" fillOpacity="0.45"
        style={{ font: 'italic 400 8px "Cormorant Garamond", serif' }}>
        frame · {numeral}
      </text>
      <g opacity="0.4">
        <line x1="60" y1="100" x2="140" y2="100" stroke={palette.accent} strokeWidth="0.4" />
        <line x1="60" y1="120" x2="140" y2="120" stroke={palette.accent} strokeWidth="0.4" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLUSTER
// ─────────────────────────────────────────────────────────────────────────────

function ClusterCanvas({ cluster, onOpen }) {
  return (
    <div
      data-cluster
      data-fx={cluster.pos.x}
      data-fy={cluster.pos.y}
      data-no-drag
      data-cursor="view"
      className="cluster absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${cluster.pos.x * 100}%`, top: `${cluster.pos.y * 100}%` }}
      onClick={(e) => { e.stopPropagation(); onOpen(cluster); }}>

      {/* Title above the bunch */}
      <div className="absolute pointer-events-none cluster-title"
        style={{ left: 0, top: 0, whiteSpace: "nowrap", transform: "translate(-50%, -260px)" }}>
        <div className="text-[#c9a961] text-[10px] tracking-[0.4em] mb-1 text-center"
          style={{ fontFamily: '"Cinzel", serif' }}>
          OPVS · {cluster.numeral}
        </div>
        <div className="text-[#ede1c8] text-2xl text-center"
          style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
          {cluster.title.toUpperCase()}
        </div>
        <div className="text-[#c9a961]/65 italic mt-1 text-center"
          style={{ fontFamily: '"Caveat", cursive', fontSize: 18 }}>
          {cluster.note}
        </div>
      </div>

      {/* Cards — front (i=0) on top of stack, scales most. Back cards scale less. */}
      {cluster.cards.map((c, i) => {
        // Z-parallax depth: front cards (low i) get more scale, back cards less.
        // Reduced range now that cards rest at larger sizes — hover adds modest growth on top.
        // 6 cards: 0.26, 0.21, 0.17, 0.13, 0.09, 0.06
        const depthZ = (0.26 - i * 0.04).toFixed(3);
        return (
          <div key={i} className="cluster-card absolute"
            style={{
              "--bx": String(c.dx),
              "--by": String(c.dy),
              "--sx": String(c.spread[0]),
              "--sy": String(c.spread[1]),
              "--rot": `${c.rot}deg`,
              "--depth-z": depthZ,
              left: 0, top: 0,
              width: `${c.w}px`,
              marginLeft: `${-c.w / 2}px`,
              marginTop: `${-c.w * 0.7}px`,
              zIndex: 20 - i,
            }}>
            <div className="border border-[#c9a961]/25 bg-[#0a0908] shadow-[0_30px_60px_rgba(0,0,0,0.55)] overflow-hidden">
              <CardArt kind={c.kind} palette={cluster.palette} numeral={cluster.numeral} idx={i} img={c.img} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS NAVIGATOR — drag-to-pan, momentum, magnet effect
// ─────────────────────────────────────────────────────────────────────────────

function CanvasNavigator({ onOpenCluster, dragMode, setDragMode }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    let raf;
    let vw = window.innerWidth, vh = window.innerHeight;
    // Canvas is 1.5× viewport, content scales inside it.
    // Pan bounds track the *scaled* content area.
    const SCALE = 1.5;
    const getScale = () => Math.max(0.7, Math.min(1.3, vw / 1440));
    const contentW = () => vw * SCALE * getScale();
    const contentH = () => vh * SCALE * getScale();
    const maxPanX = 0;
    const minPanX = () => Math.min(0, -(contentW() - vw));
    const maxPanY = 0;
    const minPanY = () => Math.min(0, -(contentH() - vh));

    // Centre content initially
    const initialPanX = () => -(contentW() - vw) / 2;
    const initialPanY = () => -(contentH() - vh) / 2;

    const state = {
      pan: { x: initialPanX(), y: initialPanY() },
      target: { x: initialPanX(), y: initialPanY() },
      velocity: { x: 0, y: 0 },
      isDragging: false,
      dragStart: null,
      didDrag: false,
      moveHistory: [],
      cursor: { x: vw / 2, y: vh / 2 },
    };

    const onResize = () => {
      const oldVw = vw, oldVh = vh;
      vw = window.innerWidth;
      vh = window.innerHeight;
      state.pan.x = state.pan.x / oldVw * vw;
      state.pan.y = state.pan.y / oldVh * vh;
      state.target.x = state.target.x / oldVw * vw;
      state.target.y = state.target.y / oldVh * vh;
    };

    const startDrag = (cx, cy, target) => {
      if (target?.closest && target.closest("[data-no-drag]")) return false;
      state.isDragging = true;
      state.didDrag = false;
      state.dragStart = { mouse: { x: cx, y: cy }, pan: { ...state.target } };
      state.moveHistory = [{ x: cx, y: cy, t: performance.now() }];
      state.velocity = { x: 0, y: 0 };
      setDragMode("grabbing");
      return true;
    };

    const moveDrag = (cx, cy) => {
      state.cursor.x = cx;
      state.cursor.y = cy;
      if (state.isDragging) {
        const moved = Math.hypot(cx - state.dragStart.mouse.x, cy - state.dragStart.mouse.y);
        if (moved > 5) state.didDrag = true;
        state.target.x = state.dragStart.pan.x + (cx - state.dragStart.mouse.x);
        state.target.y = state.dragStart.pan.y + (cy - state.dragStart.mouse.y);
        state.moveHistory.push({ x: cx, y: cy, t: performance.now() });
        if (state.moveHistory.length > 6) state.moveHistory.shift();
      }
    };

    const endDrag = () => {
      if (!state.isDragging) return;
      state.isDragging = false;
      setDragMode("grab");
      const h = state.moveHistory;
      if (h.length >= 2 && state.didDrag) {
        const last = h[h.length - 1], first = h[0];
        const dt = last.t - first.t;
        if (dt > 0 && dt < 200) {
          state.velocity.x = (last.x - first.x) / dt * 16;
          state.velocity.y = (last.y - first.y) / dt * 16;
        }
      }
    };

    const onMouseDown = (e) => { startDrag(e.clientX, e.clientY, e.target); };
    const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();

    const onTouchStart = (e) => {
      const t = e.touches[0]; if (!t) return;
      startDrag(t.clientX, t.clientY, e.target);
    };
    const onTouchMove = (e) => {
      const t = e.touches[0]; if (!t) return;
      moveDrag(t.clientX, t.clientY);
    };
    const onTouchEnd = () => endDrag();

    const onClickCapture = (e) => {
      if (state.didDrag) {
        e.stopPropagation();
        e.preventDefault();
        state.didDrag = false;
      }
    };

    const tick = () => {
      if (!state.isDragging) {
        state.target.x += state.velocity.x;
        state.target.y += state.velocity.y;
        state.velocity.x *= 0.92;
        state.velocity.y *= 0.92;
        if (Math.abs(state.velocity.x) < 0.05) state.velocity.x = 0;
        if (Math.abs(state.velocity.y) < 0.05) state.velocity.y = 0;
      }

      state.target.x = Math.max(minPanX(), Math.min(maxPanX, state.target.x));
      state.target.y = Math.max(minPanY(), Math.min(maxPanY, state.target.y));

      const lerp = state.isDragging ? 0.32 : 0.12;
      state.pan.x += (state.target.x - state.pan.x) * lerp;
      state.pan.y += (state.target.y - state.pan.y) * lerp;

      canvas.style.transform = `translate3d(${state.pan.x.toFixed(2)}px, ${state.pan.y.toFixed(2)}px, 0)`;

      // Compute scale based on viewport. Reference width 1440 (typical Mac browser).
      // Clamp wider on the small side so laptops don't shrink things to oblivion.
      const scale = Math.max(0.7, Math.min(1.3, vw / 1440));
      document.documentElement.style.setProperty("--cluster-scale", scale.toFixed(3));

      // Cluster proximity (positions in canvas coordinates, account for inner scale)
      const cursorCanvasX = state.cursor.x - state.pan.x;
      const cursorCanvasY = state.cursor.y - state.pan.y;
      const els = canvas.querySelectorAll("[data-cluster]");
      els.forEach((el) => {
        const fx = parseFloat(el.dataset.fx);
        const fy = parseFloat(el.dataset.fy);
        const cx = fx * vw * SCALE * scale;
        const cy = fy * vh * SCALE * scale;
        const dx = cursorCanvasX - cx;
        const dy = cursorCanvasY - cy;
        const dist = Math.hypot(dx, dy);
        // Magnet radius scales with cards
        const prox = Math.max(0, Math.min(1, 1 - dist / (540 * scale)));
        const proxSmooth = prox * prox * (3 - 2 * prox);
        el.style.setProperty("--prox", proxSmooth.toFixed(3));
        // Inverse-scale the cursor offset so card pull feels right at any zoom
        el.style.setProperty("--cdx", (dx / scale).toFixed(0));
        el.style.setProperty("--cdy", (dy / scale).toFixed(0));
      });

      // Bottom nav reveal
      const np = Math.max(0, Math.min(1, (state.cursor.y / vh - 0.72) / 0.22));
      document.documentElement.style.setProperty("--np", np.toFixed(3));

      raf = requestAnimationFrame(tick);
    };

    setDragMode("grab");
    window.addEventListener("resize", onResize);
    wrapper.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    wrapper.addEventListener("click", onClickCapture, true);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      wrapper.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      wrapper.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      wrapper.removeEventListener("click", onClickCapture, true);
      cancelAnimationFrame(raf);
    };
  }, [setDragMode]);

  return (
    <div ref={wrapperRef}
      className="fixed inset-0 overflow-hidden select-none"
      style={{ touchAction: "none" }}>
      <div ref={canvasRef}
        className="absolute top-0 left-0"
        style={{ width: "150vw", height: "150vh", willChange: "transform" }}>
        <div style={{
          width: "100%", height: "100%",
          transform: "scale(var(--cluster-scale, 1))",
          transformOrigin: "0 0",
        }}>
          <DoodleBG />
          {CLUSTERS.map((cluster) => (
            <ClusterCanvas key={cluster.id} cluster={cluster} onOpen={onOpenCluster} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPANDED CLUSTER VIEW
// ─────────────────────────────────────────────────────────────────────────────

function ExpandedView({ cluster, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const cards = cluster.cards;
  const active = cards[activeIdx];

  return (
    <div data-no-drag data-cursor="default"
      className="fixed inset-0 z-[200] flex flex-col px-4 py-8 md:px-10 md:py-10"
      style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="absolute inset-0 bg-black/92 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 flex items-end gap-3 overflow-x-auto pb-4 mb-4 border-b border-[#c9a961]/15"
        style={{ animation: "riseIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
        {cards.map((c, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
            data-cursor="link"
            className={`shrink-0 border transition-all ${
              i === activeIdx ? "border-[#c9a961]" : "border-[#c9a961]/15 hover:border-[#c9a961]/50"
            }`} style={{
              width: "110px",
              aspectRatio: c.kind === "landscape" ? "1.75" : c.kind === "closeup" ? "1" : c.kind === "frame" ? "0.91" : "0.71",
              opacity: i === activeIdx ? 1 : 0.5,
            }}>
            <CardArt kind={c.kind} palette={cluster.palette} numeral={cluster.numeral} idx={i} img={c.img} />
          </button>
        ))}
        <button onClick={onClose} data-cursor="link"
          className="ml-auto shrink-0 text-[#ede1c8]/70 hover:text-[#c9a961] transition-colors text-xs tracking-[0.4em] self-end pb-2"
          style={{ fontFamily: '"Cinzel", serif' }}>
          CLOSE ✕
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-8 min-h-0"
        style={{ animation: "riseIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s backwards" }}>
        <div className="flex-1 relative overflow-hidden border border-[#c9a961]/25"
          style={{ background: `linear-gradient(160deg, ${cluster.palette.from} 0%, ${cluster.palette.to} 100%)`, minHeight: "240px" }}>
          {active.kind === "poster" ? (
            cluster.trailer ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="w-full" style={{ maxHeight: "78vh", aspectRatio: String(cluster.trailer.aspect ?? 16 / 9), maxWidth: `calc(78vh * ${cluster.trailer.aspect ?? 16 / 9})` }}>
                  <iframe
                    src={cluster.trailer.url}
                    title={`${cluster.title} — trailer`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#ede1c8]/60">
                <div className="w-16 h-16 rounded-full border border-[#ede1c8]/30 flex items-center justify-center mb-5">
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5 L11 7 L3 12.5 Z" fill="currentColor" /></svg>
                </div>
                <p style={{ font: '400 11px "Cinzel", serif', letterSpacing: "0.4em" }}>
                  TRAILER · {cluster.numeral}
                </p>
                <p className="mt-3 text-xs italic opacity-50" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  add a trailer object to this cluster
                </p>
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="max-w-full" style={{ maxHeight: "70vh" }}>
                <CardArt kind={active.kind} palette={cluster.palette} numeral={cluster.numeral} idx={activeIdx} img={active.img} />
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4 text-[#ede1c8]/40"
            style={{ fontFamily: '"Caveat", cursive', fontSize: 14, transform: "rotate(-3deg)" }}>
            slate · take 1
          </div>
        </div>

        <div className="md:w-80 shrink-0 flex flex-col">
          <p style={{ font: '500 10px "Cinzel", serif', letterSpacing: "0.4em", color: "#c9a961" }}>
            OPVS · {cluster.numeral}
          </p>
          <h3 className="mt-3 text-3xl text-[#ede1c8]"
            style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
            {cluster.title}
          </h3>
          <p className="mt-2 text-sm text-[#ede1c8]/55 italic"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {cluster.year} · {cluster.runtime} · {cluster.format}
          </p>
          <p className="mt-6 text-[#ede1c8]/85 text-base leading-relaxed"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {cluster.synopsis}
          </p>
          <p className="mt-6 text-[#c9a961]/70"
            style={{ fontFamily: '"Caveat", cursive', fontSize: 18 }}>
            {cluster.note}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION OVERLAYS
// ─────────────────────────────────────────────────────────────────────────────

function Visualizer({ active }) {
  return (
    <div className="flex items-end gap-1 h-6">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="w-[3px] bg-[#c9a961]"
          style={{
            height: active ? "60%" : "10%",
            animation: active ? `bar 0.8s ease-in-out infinite ${i * 0.1}s alternate` : undefined,
            opacity: active ? 1 : 0.3,
          }} />
      ))}
    </div>
  );
}

function ScoresOverlay({ onClose }) {
  const [activeIdx, setActiveIdx] = useState(null);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div data-no-drag data-cursor="default"
      className="fixed inset-0 z-[200] overflow-y-auto bg-[#0a0908] px-6 md:px-10 py-10"
      style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="max-w-5xl mx-auto" style={{ animation: "riseIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-[#c9a961] text-[10px] tracking-[0.4em] mb-4"
              style={{ fontFamily: '"Cinzel", serif' }}>III — THE SCORES</p>
            <h2 className="text-5xl md:text-7xl text-[#ede1c8]"
              style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
              SCORES<span className="italic text-[#c9a961]/70" style={{ fontFamily: '"Cormorant Garamond", serif' }}>,</span>{" "}
              <span className="italic text-[#ede1c8]/85" style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400 }}>etc</span>.
            </h2>
          </div>
          <button onClick={onClose} data-cursor="link"
            className="text-[#ede1c8]/70 hover:text-[#c9a961] transition-colors text-xs tracking-[0.4em]"
            style={{ fontFamily: '"Cinzel", serif' }}>CLOSE ✕</button>
        </div>

        <ul className="space-y-2">
          {SCORES.map((track, i) => {
            const isActive = activeIdx === i;
            const sizeClass = track.size === "xl" ? "text-4xl md:text-6xl"
              : track.size === "lg" ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl";
            return (
              <li key={i} data-cursor={isActive ? "pause" : "play"}
                className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-6 py-4 border-b border-[#c9a961]/10 cursor-pointer hover:bg-[#c9a961]/[0.025]"
                onClick={() => setActiveIdx(isActive ? null : i)}>
                <span style={{ font: '500 11px "Cinzel", serif', letterSpacing: "0.36em", color: "#c9a961" }}>
                  {track.num}
                </span>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className={`${sizeClass} transition-colors`}
                    style={{
                      fontFamily: track.italic ? '"Cormorant Garamond", serif' : '"Cinzel", serif',
                      fontStyle: track.italic ? "italic" : "normal",
                      fontWeight: track.italic ? 400 : 500,
                      letterSpacing: track.italic ? "0" : "0.03em",
                      color: isActive ? "#c9a961" : "#ede1c8",
                    }}>{track.title}</span>
                  <span className="text-sm italic text-[#ede1c8]/45"
                    style={{ fontFamily: '"Caveat", cursive', fontSize: 18 }}>
                    {track.inst} · from {track.film}
                  </span>
                  {isActive && <Visualizer active />}
                </div>
                <span className="text-sm tabular-nums text-[#ede1c8]/55"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {track.duration}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 text-[#c9a961]/65"
          style={{ fontFamily: '"Caveat", cursive', fontSize: 20 }}>
          ↑ wire each track to a real audio file in the SCORES array.
        </p>
      </div>
    </div>
  );
}

function ManifestoOverlay({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div data-no-drag data-cursor="default"
      className="fixed inset-0 z-[200] overflow-y-auto bg-[#0a0908] px-6 md:px-10 py-10"
      style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="max-w-6xl mx-auto" style={{ animation: "riseIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-[#c9a961] text-[10px] tracking-[0.4em] mb-4"
              style={{ fontFamily: '"Cinzel", serif' }}>I — MANIFESTO</p>
            <h2 className="text-4xl md:text-6xl text-[#ede1c8]"
              style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
              WHAT WE BELIEVE.
            </h2>
            <span className="block mt-4 text-[#c9a961]/70"
              style={{ fontFamily: '"Caveat", cursive', fontSize: 22, transform: "rotate(-2deg)", display: "inline-block" }}>
              (mostly.)
            </span>
          </div>
          <button onClick={onClose} data-cursor="link"
            className="text-[#ede1c8]/70 hover:text-[#c9a961] transition-colors text-xs tracking-[0.4em]"
            style={{ fontFamily: '"Cinzel", serif' }}>CLOSE ✕</button>
        </div>

        <div className="space-y-7 text-[#ede1c8]/85 text-lg md:text-xl leading-relaxed max-w-3xl"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          <p>
            <span className="float-left text-7xl text-[#c9a961] mr-3 mt-1 leading-none"
              style={{ fontFamily: '"Cinzel", serif', fontWeight: 500 }}>W</span>
            e make short films the way our forebears made altarpieces — slowly,
            patiently, and for the room they belong in.
          </p>
          <p className="italic text-[#ede1c8]/65 relative pl-6">
            <span className="absolute left-0 top-1 text-[#c9a961]/70"
              style={{ fontFamily: '"Caveat", cursive', fontSize: 28 }}>"</span>
            We believe in the long take, the held silence, the wool of weather, and
            the small congregation of people who still want to sit in the dark.
          </p>
          <p>
            We do not believe in <CrossOut className="text-[#ede1c8]/60">trends</CrossOut>{" "}
            <span className="text-[#c9a961]" style={{ fontFamily: '"Caveat", cursive', fontSize: 28 }}>noise</span>,
            algorithms, or the rule that says short films should be loud to be seen.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactOverlay({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div data-no-drag data-cursor="default"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0908] px-6"
      style={{ animation: "fadeIn 0.4s ease-out" }}>
      <button onClick={onClose} data-cursor="link"
        className="absolute top-10 right-10 text-[#ede1c8]/70 hover:text-[#c9a961] transition-colors text-xs tracking-[0.4em]"
        style={{ fontFamily: '"Cinzel", serif' }}>CLOSE ✕</button>
      <div className="max-w-4xl text-center relative" style={{ animation: "riseIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#c9a961]/55">
          <Halo size={120} />
        </div>
        <p className="text-[#c9a961] text-[10px] tracking-[0.4em] mb-6 mt-8"
          style={{ fontFamily: '"Cinzel", serif' }}>IV — CORRESPONDENCE</p>
        <h2 className="text-4xl md:text-6xl text-[#ede1c8] mb-10"
          style={{ font: '500 1em "Cinzel", serif', letterSpacing: "0.04em" }}>
          WRITE TO<br />
          <span className="italic text-[#ede1c8]/85" style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400 }}>
            the flock.
          </span>
        </h2>
        <p className="text-xl md:text-2xl italic text-[#ede1c8]/75 mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          For festival submissions, commissions, or to enquire about a private screening.
        </p>
        <a href="mailto:hello@holyflock.film" data-cursor="mail"
          className="inline-flex items-center gap-3 px-8 py-4 border border-[#c9a961]/40 text-[#ede1c8] hover:bg-[#c9a961]/10 hover:border-[#c9a961] transition-all"
          style={{ font: '500 11px "Cinzel", serif', letterSpacing: "0.36em" }}>
          HELLO@HOLYFLOCK.FILM
        </a>
        <div className="mt-16 flex justify-center gap-8 items-center text-[#c9a961]/50">
          <Sheep size={40} /><Fleuron size={28} /><Sheep size={40} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────────────────────────────────────────

function BottomNav({ onSection }) {
  const items = [
    { label: "MANIFESTO", action: () => onSection("manifesto") },
    { label: "FILMS",     action: () => onSection(null) },
    { label: "SCORES",    action: () => onSection("scores") },
    { label: "WRITE",     action: () => onSection("contact") },
  ];
  return (
    <div data-no-drag
      className="hidden md:block fixed bottom-0 left-0 right-0 z-[120] pointer-events-none"
      style={{ transform: "translateY(calc((1 - var(--np, 0)) * 100%))", transition: "transform 0.05s linear" }}>
      <div className="bg-gradient-to-t from-[#0a0908] via-[#0a0908]/95 to-transparent pt-32 pb-4 pointer-events-auto">
        <div className="px-4 flex items-baseline justify-between gap-2 leading-none">
          {items.map((it, i) => (
            <button key={i} onClick={it.action} data-no-drag data-cursor="link"
              className="flex-1 text-center text-[#ede1c8] hover:text-[#c9a961] transition-colors"
              style={{
                fontFamily: '"Cinzel", serif', fontWeight: 500,
                fontSize: "clamp(1.6rem, 7.5vw, 7.5rem)", letterSpacing: "0.02em",
              }}>{it.label}</button>
          ))}
        </div>
        <div className="px-6 mt-3 text-[10px] tracking-[0.4em] text-[#ede1c8]/40 flex items-center justify-between"
          style={{ fontFamily: '"Cinzel", serif' }}>
          <span>HOLY FLOCK FILMS · CAERDYDD</span>
          <span style={{ fontFamily: '"Caveat", cursive', fontSize: 16, letterSpacing: 0 }} className="text-[#c9a961]/50">
            move cursor up to dismiss ↑
          </span>
          <span>EST. MMXXV</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function HolyFlockFilms() {
  const [openCluster, setOpenCluster] = useState(null);
  const [section, setSection] = useState(null);
  const [dragMode, setDragMode] = useState("grab");
  const [logoClicks, setLogoClicks] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { if (logoClicks >= 7) setRevealed(true); }, [logoClicks]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full text-[#ede1c8] overflow-hidden"
      style={{ backgroundColor: "#0a0908", fontFamily: '"Spectral", "Cormorant Garamond", Georgia, serif' }}
      data-cursor="default">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=Spectral:ital,wght@0,300;0,400;0,500;1,400&family=Caveat:wght@400;500;700&display=swap');
        :root { --np: 0; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes bar { from { height: 15% } to { height: 90% } }

        /* CLUSTER CARDS — magnet effect.
           --bx,--by  = base offset (px)
           --sx,--sy  = unit-vector spread direction
           --rot      = base rotation
           --depth-z  = per-card scale depth (0.1 back .. 0.42 front)
           --prox     = 0..1 cursor proximity to cluster centre
           --cdx,--cdy = signed cursor offset (canvas coords)
           --hover-boost = small extra scale when cursor sits on a specific card
        */
        .cluster-card {
          --hover-boost: 0;
          transform:
            translate(
              calc(var(--bx, 0) * 1px + var(--sx, 0) * var(--prox, 0) * 80px + var(--cdx, 0) * 0.06px),
              calc(var(--by, 0) * 1px + var(--sy, 0) * var(--prox, 0) * 80px + var(--cdy, 0) * 0.06px)
            )
            scale(calc(1 + var(--prox, 0) * var(--depth-z, 0.2) + var(--hover-boost, 0)))
            rotate(calc(var(--rot, 0deg) * (1 - var(--prox, 0) * 0.5)));
          transform-origin: center center;
          will-change: transform;
        }
        .cluster-card:hover { --hover-boost: 0.06; }

        /* Title fades in slightly when cluster is hovered */
        .cluster-title { opacity: 0.6; transition: opacity 0.4s ease; }
        .cluster:hover .cluster-title { opacity: 1; }

        .cluster { transition: filter 0.3s; }
        .cluster:hover { filter: brightness(1.06); }

        @media (pointer: fine) { html, body { cursor: none } a, button { cursor: none } }
      `}</style>

      {/* Film grain + vignette */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
        }} />
      <div className="pointer-events-none fixed inset-0 z-30"
        style={{ background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 100%)" }} />

      <CanvasNavigator onOpenCluster={setOpenCluster} dragMode={dragMode} setDragMode={setDragMode} />

      <div className="fixed top-6 left-6 md:top-8 md:left-10 z-[100] flex items-center gap-3" data-no-drag>
        <button data-cursor="link" onClick={() => setLogoClicks((c) => c + 1)}
          className="flex items-center gap-3 group">
          <span className="text-[#c9a961] text-xl">❦</span>
          <span className="text-[10px] tracking-[0.4em] text-[#ede1c8]/70 group-hover:text-[#c9a961] transition-colors"
            style={{ fontFamily: '"Cinzel", serif' }}>HOLY FLOCK FILMS</span>
          {revealed && (
            <span className="text-[#c9a961] ml-2"
              style={{ fontFamily: '"Caveat", cursive', fontSize: 16 }}>← you found it</span>
          )}
        </button>
      </div>

      <div className="fixed top-6 right-6 md:top-8 md:right-10 z-[100] text-right max-w-[18rem]" data-no-drag>
        <p className="italic text-[#ede1c8]/55 text-sm"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          Click & drag to wander.<br />Hover any cluster — they answer the cursor.
        </p>
        <p className="text-[#c9a961]/55 mt-1"
          style={{ fontFamily: '"Caveat", cursive', fontSize: 18 }}>
          ↓ move cursor near the bottom for nav
        </p>
      </div>

      <CustomCursor dragMode={dragMode} />

      <BottomNav onSection={setSection} />

      {openCluster && <ExpandedView cluster={openCluster} onClose={() => setOpenCluster(null)} />}
      {section === "manifesto" && <ManifestoOverlay onClose={() => setSection(null)} />}
      {section === "scores" && <ScoresOverlay onClose={() => setSection(null)} />}
      {section === "contact" && <ContactOverlay onClose={() => setSection(null)} />}
    </div>
  );
}
