import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useInvitations } from "../hooks/useInvitations";
import { useCountdown } from "../hooks/useCountdown";
import { WEDDING_CONFIG } from "../data/weddingConfig";
import CountUnit from "../components/CountUnit";
import FadeSection from "../components/FadeSection";
import EventCard from "../components/EventCard";
import ScrollNavigator from "../components/Scrollnavigator";
import Cancion from "../assets/Hasta_ese_dia.mp3";

import FondoSobre from "../assets/sobre.png";
import Nosotros from "../assets/nosotros.jpeg";
import Foto0 from "../assets/foto0.jpeg";
import Foto4 from "../assets/foto4.jpeg";
import Foto5 from "../assets/foto5.jpeg";
import Foto7 from "../assets/foto7.jpeg";
import Foto8 from "../assets/foto8.jpeg";
import ImgCirculoContador from "../assets/img_circuloContador01.png";
import VideoNuestraBoda from "../assets/NuestraBoda.mp4";
import Sello from "../assets/sello.png";

/* ─────────────────────────────────────────
   REPRODUCTOR MINIMAL — esquina superior izquierda
   shouldPlay: true = iniciar reproducción (triggered por clic en sobre)
───────────────────────────────────────── */
function MusicPlayer({ src, shouldPlay }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const startedRef = useRef(false);

  // Inicia la música la primera vez que shouldPlay se vuelve true
  useEffect(() => {
    if (!shouldPlay || startedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    startedRef.current = true;
    audio.volume = 0.55;

    // Pequeño delay para que el gesto del usuario siga "activo" en el navegador
    const t = setTimeout(async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }, 80);

    return () => clearTimeout(t);
  }, [shouldPlay]);

  // Reproducción única: al terminar, se detiene y no vuelve a iniciar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {}
    }
  }, [isPlaying]);

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />
      <motion.button
        onClick={togglePlay}
        className="fixed z-50"
        style={{
          top: 18,
          left: 18,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.22)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: shouldPlay ? 1 : 0, scale: shouldPlay ? 1 : 0.6 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.12, background: "rgba(0,0,0,0.35)" }}
        whileTap={{ scale: 0.92 }}
        title={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying && (
          <motion.div
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: "50%",
              border: "1.5px solid rgba(201,169,122,0.7)",
              pointerEvents: "none",
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.svg
              key="pause"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <rect x="2" y="2" width="3.5" height="10" rx="1" fill="rgba(255,240,210,0.92)" />
              <rect x="8.5" y="2" width="3.5" height="10" rx="1" fill="rgba(255,240,210,0.92)" />
            </motion.svg>
          ) : (
            <motion.svg
              key="play"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <path d="M3.5 2.2 L12 7 L3.5 11.8 Z" fill="rgba(255,240,210,0.92)" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

/* ─────────────────────────────────────────
   PARTÍCULAS FLOTANTES DE FONDO
───────────────────────────────────────── */
function FloatingParticles({ count = 18, color = "#c8886a" }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 6,
      driftX: (Math.random() - 0.5) * 40,
      driftY: -(20 + Math.random() * 50),
      symbol: ["✦", "·", "✦", "·", "✦"][Math.floor(Math.random() * 5)],
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size * 4, color, opacity: 0 }}
          animate={{ y: [0, p.driftY], x: [0, p.driftX], opacity: [0, 0.55, 0.3, 0], scale: [0.5, 1, 0.8, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PÉTALOS CAYENDO
───────────────────────────────────────── */
function FallingPetals({ count = 12 }) {
  const petals = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 110 - 5,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 12,
      size: 6 + Math.random() * 10,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 120,
    }))
  ).current;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: "-40px",
            width: p.size,
            height: p.size * 1.3,
            borderRadius: "50% 0 50% 0",
            background: "radial-gradient(ellipse, rgba(160,30,60,0.3) 0%, rgba(201,169,122,0.15) 100%)",
            rotate: p.rotation,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift],
            rotate: [p.rotation, p.rotation + 360],
            opacity: [0, 0.6, 0.4, 0],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   LÍNEA ORNAMENTAL
───────────────────────────────────────── */
function OrnamentalLine() {
  return (
    <div className="flex items-center gap-3 my-4">
      <motion.div
        className="flex-1 h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        style={{ originX: 0, background: "linear-gradient(to right, transparent, #c9a97a88)" }}
      />
      <motion.span
        className="text-[#c9a97a] text-xs tracking-[6px]"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ✦ ✦ ✦
      </motion.span>
      <motion.div
        className="flex-1 h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        style={{ originX: 1, background: "linear-gradient(to left, transparent, #c9a97a88)" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   LABEL
───────────────────────────────────────── */
function Label({ children }) {
  return (
    <motion.p
      className="text-xs tracking-[6px] uppercase font-bold mb-3"
      style={{ color: "#c8886a" }}
      initial={{ opacity: 0, y: 10, letterSpacing: "2px" }}
      whileInView={{ opacity: 1, y: 0, letterSpacing: "6px" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      — {children} —
    </motion.p>
  );
}

/* ─────────────────────────────────────────
   HEXAGON MAGIC — SVG animado especial
───────────────────────────────────────── */
function MagicHexagon({ children, size = 320, dark = false }) {
  const heartD     = "M150,270 C80,220 20,175 20,108 C20,63 55,28 95,28 C118,28 138,42 150,58 C162,42 182,28 205,28 C245,28 280,63 280,108 C280,175 220,220 150,270 Z";
  const heartInner = "M150,248 C92,200 38,160 38,103 C38,65 67,40 100,40 C121,40 139,52 150,66 C161,52 179,40 200,40 C233,40 262,65 262,103 C262,160 208,200 150,248 Z";
  const heartMini  = "M150,226 C104,182 56,148 56,98 C56,66 79,52 105,52 C123,52 139,62 150,74 C161,62 177,52 195,52 C221,52 244,66 244,98 C244,148 196,182 150,226 Z";
  const heartPath  = "M150,270 C80,220 20,175 20,108 C20,63 55,28 95,28 C118,28 138,42 150,58 C162,42 182,28 205,28 C245,28 280,63 280,108 C280,175 220,220 150,270 Z";
  const glowPoints = [[150,270],[20,108],[280,108],[60,52],[240,52]];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, maxWidth: "82vw", maxHeight: "82vw" }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dark
            ? "radial-gradient(ellipse 85% 85% at 50% 55%, rgba(201,169,122,0.25) 0%, transparent 70%)"
            : "radial-gradient(ellipse 85% 85% at 50% 55%, rgba(201,169,122,0.20) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.13, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ scale: [1, 1.04, 1, 1.04, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="heartGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="heartGlowStrong" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0d080" />
              <stop offset="35%" stopColor="#c9a97a" />
              <stop offset="65%" stopColor="#e8c878" />
              <stop offset="100%" stopColor="#b8894a" />
            </linearGradient>
            <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.22)"} />
              <stop offset="100%" stopColor={dark ? "rgba(201,169,122,0.06)" : "rgba(201,169,122,0.05)"} />
            </linearGradient>
            <path id="heartPath" d={heartPath} fill="none" />
          </defs>

          <motion.path d={heartD} fill="url(#fillGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }} />
          <motion.path d={heartD} fill="none" stroke="url(#goldGrad)" strokeWidth="2.2" strokeLinejoin="round" filter="url(#heartGlow)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 2, ease: "easeInOut" }} />
          <motion.path d={heartInner} fill="none" stroke="url(#goldGrad)" strokeWidth="0.9" strokeOpacity="0.55" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: 0.8, duration: 1.8, ease: "easeInOut" }} />
          <motion.path d={heartMini} fill="none" stroke="#c9a97a" strokeWidth="0.45" strokeOpacity="0.3" strokeDasharray="5 7" strokeLinejoin="round" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0.25, 0.5] }} transition={{ delay: 1.1, duration: 4, repeat: Infinity }} />

          {glowPoints.map(([cx, cy], i) => (
            <g key={i}>
              <motion.circle cx={cx} cy={cy} r="4" fill="#f0d080" filter="url(#heartGlowStrong)" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0.7], scale: [0, 1.4, 1] }} transition={{ delay: 1.6 + i * 0.14, duration: 0.7 }} />
              <motion.circle cx={cx} cy={cy} r="8" fill="none" stroke="#f0d080" strokeWidth="1" strokeOpacity="0.35" animate={{ r: [6, 14, 6], opacity: [0.5, 0, 0.5] }} transition={{ delay: 2.2 + i * 0.22, duration: 2.8, repeat: Infinity }} />
            </g>
          ))}

          <motion.line x1="150" y1="28" x2="150" y2="270" stroke="url(#goldGrad)" strokeWidth="0.4" strokeOpacity="0.15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 2, duration: 1.4 }} />

          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={`travel-${i}`} r="2.8" fill="#f5e090">
              <animate attributeName="opacity" values="0;0.95;0" dur="5s" begin={`${i * 0.82}s`} repeatCount="indefinite" />
              <animateMotion dur="5s" begin={`${i * 0.82}s`} repeatCount="indefinite" rotate="auto">
                <mpath href="#heartPath" />
              </animateMotion>
            </circle>
          ))}
        </svg>
      </motion.div>

      <div className="relative z-10 text-center px-6" style={{ maxWidth: "62%", marginTop: "8px" }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SPARKLES — destellos dorados flotantes
───────────────────────────────────────── */
function Sparkles({ count = 22 }) {
  const sparks = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 6 + Math.random() * 14,
      dur: 2.5 + Math.random() * 4,
      delay: Math.random() * 5,
      symbol: ["✦", "✧", "·", "✦", "✧", "★"][Math.floor(Math.random() * 6)],
      color: ["#f0d080", "#c9a97a", "#e8c878", "#fff8e0", "#d4a060"][Math.floor(Math.random() * 5)],
    }))
  ).current;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute select-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: s.size, color: s.color, opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.3, 0.4], rotate: [0, 45, 0], y: [0, -18, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          {s.symbol}
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   GLITTER TRANSITION — explosión de destellos
───────────────────────────────────────── */
function GlitterTransition({ active, onDone }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const COLORS = ["#f0d080","#fff8e0","#c9a97a","#ffe8a0","#ffd060","#e8c878","#ffffff","#f5c842"];
    const SYMBOLS = ["✦","✧","★","·","✦","✦","✧"];

    const burst = Array.from({ length: 90 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 90 + (Math.random() - 0.5) * 0.3;
      const speed = 180 + Math.random() * 420;
      const size = 4 + Math.random() * 18;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1, size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 8,
        decay: 0.6 + Math.random() * 0.8,
        trail: [],
      };
    });

    const rays = Array.from({ length: 16 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 16,
      maxLength: Math.max(W, H) * 0.85,
      width: 2 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.7,
    }));

    const TOTAL_DURATION = 2200;

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / TOTAL_DURATION, 1);
      ctx.clearRect(0, 0, W, H);

      let flashAlpha = 0;
      if (elapsed < 200) flashAlpha = elapsed / 200;
      else if (elapsed < 380) flashAlpha = 1;
      else flashAlpha = Math.max(0, 1 - (elapsed - 380) / 600);

      if (flashAlpha > 0) {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
        grad.addColorStop(0, `rgba(255,248,220,${flashAlpha * 0.95})`);
        grad.addColorStop(0.3, `rgba(240,208,128,${flashAlpha * 0.6})`);
        grad.addColorStop(0.65, `rgba(201,169,122,${flashAlpha * 0.25})`);
        grad.addColorStop(1, `rgba(201,169,122,0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      const rayT = Math.min(elapsed / 800, 1);
      rays.forEach((ray) => {
        const len = ray.maxLength * rayT;
        const alpha = ray.alpha * (1 - Math.pow(rayT, 1.5)) * 0.55;
        if (alpha <= 0) return;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ray.angle);
        const rg = ctx.createLinearGradient(0, 0, len, 0);
        rg.addColorStop(0, `rgba(255,248,200,${alpha})`);
        rg.addColorStop(0.4, `rgba(240,208,128,${alpha * 0.6})`);
        rg.addColorStop(1, `rgba(201,169,122,0)`);
        ctx.strokeStyle = rg;
        ctx.lineWidth = ray.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(len, 0);
        ctx.stroke();
        ctx.restore();
      });

      const dt = 1 / 60;
      burst.forEach((p) => {
        if (p.alpha <= 0) return;
        p.trail.unshift({ x: p.x, y: p.y, alpha: p.alpha });
        if (p.trail.length > 5) p.trail.pop();
        p.trail.forEach((pt, ti) => {
          const ta = (pt.alpha * (1 - ti / 5)) * 0.4;
          if (ta <= 0) return;
          ctx.globalAlpha = ta;
          ctx.fillStyle = p.color;
          ctx.font = `${p.size * (1 - ti * 0.15)}px serif`;
          ctx.fillText("·", pt.x, pt.y);
        });
        p.vy += 60 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.rotSpeed * dt;
        p.alpha = Math.max(0, p.alpha - p.decay * dt);
        p.vx *= 0.97;
        p.vy *= 0.97;
        if (p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.font = `bold ${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 1.5;
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
        ctx.globalAlpha = 1;
      });

      const curtainT = t < 0.35 ? t / 0.35 : 1 - (t - 0.35) / 0.65;
      const curtainH = H * curtainT;
      if (curtainH > 0) {
        const cg = ctx.createLinearGradient(0, 0, 0, curtainH);
        cg.addColorStop(0, `rgba(240,208,128,${0.92 * curtainT})`);
        cg.addColorStop(0.5, `rgba(255,248,220,${0.85 * curtainT})`);
        cg.addColorStop(1, `rgba(201,169,122,0)`);
        ctx.fillStyle = cg;
        ctx.fillRect(0, 0, W, curtainH);
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,200,${0.9 * curtainT})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = "#f0d080";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(0, curtainH);
        ctx.lineTo(W, curtainH);
        ctx.stroke();
        ctx.restore();
        const edgeCount = 7;
        for (let i = 0; i < edgeCount; i++) {
          const ex = (W / (edgeCount - 1)) * i;
          ctx.save();
          ctx.globalAlpha = curtainT * (0.5 + 0.5 * Math.sin(ts / 200 + i));
          ctx.fillStyle = "#fff8e0";
          ctx.font = `${12 + 6 * Math.sin(ts / 300 + i)}px serif`;
          ctx.textAlign = "center";
          ctx.shadowColor = "#f0d080";
          ctx.shadowBlur = 14;
          ctx.fillText("✦", ex, curtainH - 2);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;

      if (t < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, W, H);
        if (onDone) onDone();
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [active]);

  if (!active) return null;

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none", width: "100%", height: "100%" }}
    />
  );
}

/* ─────────────────────────────────────────
   TARJETA — contenido del sobre
───────────────────────────────────────── */
function CardContent({ guests, onReadyToTransition }) {
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowRest(true), 3600);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!showRest) return;
    const t = setTimeout(() => { if (onReadyToTransition) onReadyToTransition(); }, 2500);
    return () => clearTimeout(t);
  }, [showRest, onReadyToTransition]);

  const sparks = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      angle: (360 / 14) * i,
      dist: 55 + Math.random() * 35,
      size: 7 + Math.random() * 9,
      dur: 1.8 + Math.random() * 2,
      delay: 0.5 + Math.random() * 1.2,
      symbol: ["✦", "✧", "·", "✦"][Math.floor(Math.random() * 4)],
      color: ["#f0d080", "#c9a97a", "#fff8e0"][Math.floor(Math.random() * 3)],
    }))
  ).current;

  return (
    <motion.div
      style={{
        width: "-40%",
        bottom: "-40%",
        background: "linear-gradient(160deg, #fffcf5 0%, #fef6e4 50%, #fdf0d8 100%)",
        borderRadius: "6px",
        border: "1px solid rgba(201,169,122,0.5)",
        padding: "22px 20px 20px",
        textAlign: "center",
        boxShadow: "0 -12px 50px rgba(0,0,0,0.35), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: "-90%", opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <span style={{ position: "absolute", top: 8, left: 10, fontSize: 10, color: "#c9a97a", opacity: 0.6 }}>✦</span>
      <span style={{ position: "absolute", top: 8, right: 10, fontSize: 10, color: "#c9a97a", opacity: 0.6 }}>✦</span>
      <span style={{ position: "absolute", bottom: 8, left: 10, fontSize: 10, color: "#c9a97a", opacity: 0.6 }}>✦</span>
      <span style={{ position: "absolute", bottom: 8, right: 10, fontSize: 10, color: "#c9a97a", opacity: 0.6 }}>✦</span>
      <div style={{ height: 2, background: "linear-gradient(to right, transparent, #d4a860, #f0c878, #d4a860, transparent)", marginBottom: 14, borderRadius: 2 }} />

      <AnimatePresence mode="wait">
        {!showRest ? (
          <motion.div
            key="titulo-grande"
            style={{ position: "relative", margin: "18px 0 22px" }}
            exit={{ opacity: 0, scale: 0.92, y: -8, transition: { duration: 0.45, ease: "easeIn" } }}
          >
            {sparks.map((s) => {
              const rad = (s.angle * Math.PI) / 180;
              const tx = Math.cos(rad) * s.dist;
              const ty = Math.sin(rad) * s.dist;
              return (
                <motion.span
                  key={s.id}
                  style={{ position: "absolute", top: "50%", left: "50%", fontSize: s.size, color: s.color, textShadow: `0 0 10px ${s.color}`, pointerEvents: "none", zIndex: 2, lineHeight: 1 }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0.7, 0], x: [0, tx * 0.6, tx], y: [0, ty * 0.6, ty], scale: [0, 1.3, 0.8, 0], rotate: [0, 45, 90] }}
                  transition={{ delay: s.delay, duration: s.dur, repeat: Infinity, repeatDelay: 1.5 + Math.random() * 2, ease: "easeOut" }}
                >
                  {s.symbol}
                </motion.span>
              );
            })}
            <motion.div
              style={{ position: "absolute", inset: "-10px", borderRadius: "8px", background: "radial-gradient(ellipse, rgba(240,208,128,0.25) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1, 0.5] }}
              transition={{ delay: 0.4, duration: 3, repeat: Infinity }}
            />
            <motion.p
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "relative", zIndex: 1, fontFamily: "Georgia, serif", fontSize: "clamp(1.7rem, 8vw, 2.2rem)", fontWeight: 700, fontStyle: "italic", color: "#6a1528", letterSpacing: "0.02em", textShadow: "0 2px 18px rgba(106,21,40,0.25)", margin: 0, lineHeight: 1.1 }}
            >
              ¡Nos vamos a casar!
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="contenido-completo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: "0.7rem", color: "#c9a97a", letterSpacing: 5, marginBottom: 10 }}>
              ✦ ✦ ✦
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(0.7rem, 3vw, 0.85rem)", fontStyle: "italic", color: "#8b4a2a", opacity: 0.85, lineHeight: 1.5, marginBottom: 4 }}>
              {guests.length === 1 ? "Queremos compartir este día contigo" : "Queremos compartir este día con ustedes"}
            </motion.p>
            {/* <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.2rem, 6vw, 1.6rem)", fontWeight: 700, fontStyle: "italic", color: "#6a1528", textShadow: "0 1px 10px rgba(106,21,40,0.25)", lineHeight: 1.2, marginBottom: 10 }}>
              {guests.map((g, i) => <div key={i}>{g}</div>)}
            </motion.p> */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.3, duration: 0.5 }}
              style={{ fontFamily: "Georgia, serif", fontSize: "0.55rem", letterSpacing: "3px", color: "#9a7050", textTransform: "uppercase", marginTop: 8 }}>
              Con todo nuestro amor
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ height: 1.5, background: "linear-gradient(to right, transparent, #d4a860, #f0c878, #d4a860, transparent)", marginTop: 14, borderRadius: 2, opacity: 0.7 }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   ENVELOPE SCREEN
   onStartMusic: callback que dispara la música al primer clic
───────────────────────────────────────── */
function EnvelopeScreen({ firstName, guests, onOpen, transitioning, onStartMusic }) {
  const [phase, setPhase] = useState("idle");
  const musicFiredRef = useRef(false);

  const handleTap = useCallback(() => {
    if (phase !== "idle") return;

    // ── Disparar música en el gesto del usuario (primer clic) ──
    if (!musicFiredRef.current) {
      musicFiredRef.current = true;
      onStartMusic();
    }

    setPhase("opening");
    setTimeout(() => setPhase("rising"), 1000);
    setTimeout(() => { onOpen(); }, 8800);
    setTimeout(() => setPhase("done"), 9000);
  }, [phase, onOpen, onStartMusic]);

  const W = 300, H = 210;

  return (
    <motion.div
      key="sobre"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "linear-gradient(160deg, #fffaf5 0%, #fdf5ec 50%, #fef9f3 100%)" }}
      exit={{
        opacity: 0,
        scale: 1.02,
        filter: "blur(8px)",
        transition: {
          duration: 1.8,
          ease: [0.4, 0, 0.2, 1],
          opacity: { duration: 1.8, ease: [0.4, 0, 0.2, 1] },
          filter: { duration: 1.4, ease: "easeInOut" },
          scale: { duration: 1.8, ease: [0.25, 1, 0.5, 1] },
        },
      }}
    >
      {/* Precarga forzada */}
      <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none", zIndex: -1 }}>
        <img src={Foto7} alt="" /><img src={Foto4} alt="" /><img src={Foto5} alt="" />
        <img src={Foto8} alt="" /><img src={Foto0} alt="" /><img src={Nosotros} alt="" />
      </div>

      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(-45deg, rgba(201,169,122,0.05) 0px, rgba(201,169,122,0.05) 1px, transparent 1px, transparent 16px)` }} />

      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(201,169,122,0.09) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }} />

      <Sparkles count={18} />

      <motion.div
        className="relative z-10 text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: phase === "rising" || phase === "done" ? 0 : 1, y: phase === "rising" || phase === "done" ? -30 : 0 }}
        transition={{ delay: 0.5, duration: 0.9 }}
      >
        <p className="font-serif italic" style={{ fontSize: "clamp(1.15rem, 5vw, 1.5rem)", color: "#7a4a2a", textShadow: "0 1px 12px rgba(201,169,122,0.3)", letterSpacing: "0.04em" }}>
          Tenemos una noticia...
        </p>
        <motion.p className="mt-2 text-[9px] tracking-[6px] uppercase font-bold" style={{ color: "#c9a97a" }}
          animate={{ opacity: phase === "idle" ? [0.35, 1, 0.35] : 0 }}
          transition={{ duration: 2.2, repeat: Infinity }}>
          ✦ Pulsa para abrir ✦
        </motion.p>
      </motion.div>

      <motion.div
        className="relative z-10 cursor-pointer"
        style={{ width: W, maxWidth: "86vw" }}
        onClick={handleTap}
        animate={
          phase === "idle" ? { y: [0, -7, 0] }
          : phase === "done" ? { y: 70, opacity: 0, scale: 0.88 }
          : {}
        }
        transition={
          phase === "idle" ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.7, ease: "easeIn" }
        }
        whileHover={phase === "idle" ? { scale: 1.04, y: -10 } : {}}
        whileTap={phase === "idle" ? { scale: 0.96 } : {}}
      >
        <motion.div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full blur-2xl"
          style={{ width: "80%", height: 28, background: "rgba(0,0,0,0.45)" }}
          animate={{ scaleX: [0.9, 1.05, 0.9], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 3.2, repeat: Infinity }} />

        <div style={{ position: "relative", width: "100%", paddingBottom: `${(H / W) * 100}%`, perspective: "900px" }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 16px 48px rgba(0,0,0,0.5)) drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
            <defs>
              <linearGradient id="envBodyDark" x1="0%" y1="0%" x2="10%" y2="100%">
                <stop offset="0%" stopColor="#f5e8d8" /><stop offset="50%" stopColor="#ecdcc8" /><stop offset="100%" stopColor="#dcc8b0" />
              </linearGradient>
              <linearGradient id="envFoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c8b090" /><stop offset="100%" stopColor="#b09878" />
              </linearGradient>
              <linearGradient id="envSideL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c8b090" stopOpacity="0.7" /><stop offset="100%" stopColor="#e0ccb0" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="envSideR" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e0ccb0" stopOpacity="0.3" /><stop offset="100%" stopColor="#b09878" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" /><stop offset="30%" stopColor="#d4a860" />
                <stop offset="70%" stopColor="#f0c878" /><stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width={W} height={H} rx="5" fill="url(#envBodyDark)" />
            <polygon points={`0,${H} ${W},${H} ${W / 2},${H * 0.54}`} fill="url(#envFoldDark)" opacity="0.85" />
            <polygon points={`0,0 0,${H} ${W / 2},${H * 0.54}`} fill="url(#envSideL)" />
            <polygon points={`${W},0 ${W},${H} ${W / 2},${H * 0.54}`} fill="url(#envSideR)" />
            <line x1="0" y1="1.5" x2={W} y2="1.5" stroke="url(#goldEdge)" strokeWidth="2" opacity="0.9" />
            <line x1="0" y1={H - 1.5} x2={W} y2={H - 1.5} stroke="url(#goldEdge)" strokeWidth="1.5" opacity="0.6" />
            <line x1="1.5" y1="0" x2="1.5" y2={H} stroke="#c9a97a" strokeWidth="1.5" opacity="0.4" />
            <line x1={W - 1.5} y1="0" x2={W - 1.5} y2={H} stroke="#c9a97a" strokeWidth="1.5" opacity="0.4" />
            <rect x="6" y="6" width={W - 12} height={H - 12} rx="3" fill="none" stroke="#c9a97a" strokeWidth="0.5" opacity="0.25" />
          </svg>

          <motion.div
            style={{ position: "absolute", top: 0, left: 0, width: "100%", transformOrigin: "50% 0%", transformStyle: "preserve-3d", zIndex: 5 }}
            animate={phase === "opening" || phase === "rising" || phase === "done" ? { rotateX: -170 } : { rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox={`0 0 ${W} ${H * 0.56}`} style={{ width: "100%", display: "block" }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="flapRich" x1="0%" y1="0%" x2="20%" y2="100%">
                  <stop offset="0%" stopColor="#f8edd8" /><stop offset="60%" stopColor="#edd8c0" /><stop offset="100%" stopColor="#d8c0a0" />
                </linearGradient>
              </defs>
              <polygon points={`0,0 ${W},0 ${W / 2},${H * 0.56}`} fill="url(#flapRich)" stroke="#c9a97a" strokeWidth="0.6" strokeLinejoin="round" />
              <line x1={W * 0.12} y1="8" x2={W * 0.88} y2="8" stroke="#c9a97a" strokeWidth="0.9" opacity="0.55" />
              <line x1={W * 0.18} y1="14" x2={W * 0.82} y2="14" stroke="#c9a97a" strokeWidth="0.4" opacity="0.3" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute z-10"
            style={{ width: "27%", left: "35%", bottom: "30%", transform: "translateX(-50%)" }}
            animate={
              phase === "idle" ? {
                scale: [1, 1.05, 1],
                filter: ["drop-shadow(0 4px 16px rgba(120,20,40,0.6)) drop-shadow(0 0 8px rgba(201,169,122,0.4))", "drop-shadow(0 6px 28px rgba(120,20,40,0.8)) drop-shadow(0 0 20px rgba(240,200,80,0.7))", "drop-shadow(0 4px 16px rgba(120,20,40,0.6)) drop-shadow(0 0 8px rgba(201,169,122,0.4))"],
              }
              : phase === "opening" ? { scale: [1, 1.18, 0.85, 1.1], rotate: [-3, 4, -4, 0], filter: "drop-shadow(0 8px 32px rgba(180,40,60,0.9)) drop-shadow(0 0 30px rgba(255,200,80,0.9))" }
              : { scale: 0.7, opacity: 0 }
            }
            transition={
              phase === "idle" ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
              : phase === "opening" ? { duration: 0.8, ease: "easeOut" }
              : { duration: 0.4 }
            }
          >
            <img src={Sello} alt="Sello de lacre" style={{ width: "100%", height: "auto", display: "block" }} draggable={false} />
          </motion.div>
        </div>

        <AnimatePresence>
          {(phase === "rising" || phase === "done") && (
            <CardContent guests={guests} onReadyToTransition={onOpen} />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "idle" ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}>
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="rounded-full" style={{ width: 6, height: 6, background: "#c9a97a" }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }} />
        ))}
      </motion.div>

      <motion.div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(201,169,122,0.03) 20deg, transparent 40deg, rgba(240,200,80,0.04) 80deg, transparent 100deg, rgba(201,169,122,0.03) 160deg, transparent 180deg, rgba(240,200,80,0.03) 240deg, transparent 260deg, rgba(201,169,122,0.02) 320deg, transparent 360deg)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
const GALLERY_IMAGES = [Foto7, Foto4, Foto5, Foto0];

function NosCosamosHero({ cfg, isRevealing }) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlideIndex((i) => (i + 1) % GALLERY_IMAGES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="snap-section relative overflow-hidden flex items-center justify-center" style={{ minHeight: "100svh", background: "#1a0510" }}>
      <motion.div className="absolute inset-0 pointer-events-none z-40" style={{ background: "#0e020a" }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isRevealing ? 0 : 1 }}
        transition={{ duration: isRevealing ? 2.2 : 0, ease: [0.4, 0, 0.2, 1], delay: isRevealing ? 0.3 : 0 }} />

      {GALLERY_IMAGES.map((src, i) => (
        <motion.div key={i} className="absolute inset-0"
          initial={{ opacity: i === 0 ? 1 : 0 }}
          animate={{ opacity: slideIndex === i ? 1 : 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}>
          <img src={src} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 20%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(50,10,20,0.45) 0%, rgba(90,15,35,0.25) 45%, rgba(60,8,22,0.72) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(30,5,15,0.55) 100%)" }} />
        </motion.div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-6">
        <MagicHexagon size={300} dark>
          <motion.h1 className="font-serif leading-tight"
            style={{ fontSize: "clamp(2.2rem, 10vw, 3.4rem)", color: "#fff", fontStyle: "italic", fontWeight: 700, textShadow: "0 2px 24px rgba(0,0,0,0.8), 0 0 50px rgba(201,169,122,0.5), 0 4px 8px rgba(0,0,0,0.9)", letterSpacing: "0.02em" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: isRevealing ? 1 : 0, y: isRevealing ? 0 : 18 }}
            transition={{ delay: isRevealing ? 0.8 : 0, duration: 1, ease: [0.25, 1, 0.5, 1] }}>
            {cfg.bride}
          </motion.h1>
          <motion.div className="flex items-center justify-center gap-3 my-1"
            initial={{ opacity: 0 }} animate={{ opacity: isRevealing ? 1 : 0 }}
            transition={{ delay: isRevealing ? 1.1 : 0, duration: 0.7 }}>
            <div className="h-px w-7" style={{ background: "rgba(255,255,255,0.7)" }} />
            <span className="font-serif" style={{ fontSize: "1.4rem", fontStyle: "italic", color: "#f0d080", textShadow: "0 0 20px rgba(240,208,128,0.9), 0 0 40px rgba(201,169,122,0.6)", fontWeight: 700 }}>&</span>
            <div className="h-px w-7" style={{ background: "rgba(255,255,255,0.7)" }} />
          </motion.div>
          <motion.h1 className="font-serif leading-tight"
            style={{ fontSize: "clamp(2.2rem, 10vw, 3.4rem)", color: "#fff", fontStyle: "italic", fontWeight: 700, textShadow: "0 2px 24px rgba(0,0,0,0.8), 0 0 50px rgba(201,169,122,0.5), 0 4px 8px rgba(0,0,0,0.9)", letterSpacing: "0.02em" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: isRevealing ? 1 : 0, y: isRevealing ? 0 : 18 }}
            transition={{ delay: isRevealing ? 1.3 : 0, duration: 1, ease: [0.25, 1, 0.5, 1] }}>
            {cfg.groom}
          </motion.h1>
        </MagicHexagon>
        <motion.p className="mt-4 text-[11px] tracking-[8px] uppercase font-bold"
          style={{ color: "#f0d080", textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 0 30px rgba(240,208,128,0.6)", letterSpacing: "0.5em" }}
          initial={{ opacity: 0 }} animate={{ opacity: isRevealing ? 1 : 0 }}
          transition={{ delay: isRevealing ? 1.55 : 0, duration: 1 }}>
          05 · 09 · 2026
        </motion.p>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 z-30">
        {GALLERY_IMAGES.map((_, i) => (
          <motion.button key={i} onClick={() => setSlideIndex(i)} className="rounded-full border-0 cursor-pointer"
            style={{ background: slideIndex === i ? "#f0d080" : "rgba(255,255,255,0.45)" }}
            animate={{ width: slideIndex === i ? 24 : 8, height: 8 }}
            transition={{ duration: 0.4 }} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function InvitationPage() {
  const { id } = useParams();
  const { getInvitation, markOpened } = useInvitations();
  const [abrir, setAbrir] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [glitterActive, setGlitterActive] = useState(false);
  // ── NUEVO: controla si la música debe iniciar ──
  const [musicStarted, setMusicStarted] = useState(false);
  const countdown = useCountdown(WEDDING_CONFIG.date);
  const cfg = WEDDING_CONFIG;

  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 80]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, -40]);

  const [invitation, setInvitation] = useState(null);
  const invitacionRef = useRef(null);

  const goToRsvp = () => { window.location.href = `/rsvp/${id}`; };

  useEffect(() => {
    const load = async () => {
      const data = await getInvitation(id);
      setInvitation(data);
      if (data) markOpened(id);
    };
    load();
  }, [id]);

  useEffect(() => {
    [Foto7, Foto4, Foto5, Nosotros, Foto8, Foto0].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Callback que dispara la música — llamado desde EnvelopeScreen al primer clic
  const handleStartMusic = useCallback(() => {
    setMusicStarted(true);
  }, []);

  // Maneja la transición sobre → glitter → hero
  const handleOpen = useCallback(() => {
    markOpened(id);
    setGlitterActive(true);
    setTimeout(() => { setTransitioning(true); }, 350);
    setTimeout(() => { setAbrir(true); }, 2400);
  }, [id, markOpened]);

  const handleGlitterDone = useCallback(() => {
    setGlitterActive(false);
  }, []);

  if (invitation === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8ede3" }}>
        <motion.div className="text-center" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
          <p className="font-serif text-2xl text-[#8b3a3a] mb-2">Cargando</p>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="w-2 h-2 rounded-full bg-[#c8886a]"
                animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8ede3" }}>
        <p className="font-serif text-xl text-[#8b3a3a]">Invitación no encontrada</p>
      </div>
    );
  }

  const guests = invitation.guests;
  const firstName = guests[0]?.split(" ")[0] || "Estimado invitado";

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── DESTELLOS DE TRANSICIÓN ── */}
      <GlitterTransition active={glitterActive} onDone={handleGlitterDone} />

      {/* ── REPRODUCTOR DE MÚSICA
           Ahora solo inicia cuando musicStarted=true (primer clic en sobre) ── */}
      {invitation && (
        <MusicPlayer src={Cancion} shouldPlay={musicStarted} />
      )}

      {/* ══ INVITACIÓN — siempre montada detrás del sobre ══ */}
      {invitation && (
        <div
          className="overflow-x-hidden snap-container"
          style={{
            background: "#1a0510",
            height: "100svh",
            overflowY: abrir ? "auto" : "hidden",
            overscrollBehavior: "none",
            WebkitOverflowScrolling: "touch",
            opacity: 1,
            pointerEvents: abrir ? "auto" : "none",
            position: "absolute",
            inset: 0,
            zIndex: abrir ? 10 : 1,
          }}
          ref={invitacionRef}
        >
          <FallingPetals count={10} />
          <ScrollNavigator containerRef={invitacionRef} />

          <style>{`
            @media (max-width: 767px) {
              html, body { overscroll-behavior: none; }
              .snap-container {
                scroll-snap-type: y proximity;
                overflow-y: auto;
                height: 100svh;
                overscroll-behavior-y: none;
                -webkit-overflow-scrolling: touch;
              }
              .snap-section {
                scroll-snap-align: start;
                min-height: 100svh;
              }
            }
          `}</style>

          <NosCosamosHero cfg={cfg} isRevealing={transitioning} />

          {/* ══ CUENTA REGRESIVA ══ */}
          <section className="snap-section relative py-16 px-6 flex flex-col items-center text-center overflow-hidden scroll-mt-0"
            style={{ background: "linear-gradient(180deg, #fdf6ef 0%, #f5ebe0 100%)", minHeight: "100svh", justifyContent: "center" }}>
            <FloatingParticles count={10} color="#c9a97a" />
            <FadeSection className="w-full flex flex-col items-center relative z-10">
              <Label>nos casamos el</Label>
              <motion.h2 className="font-serif text-3xl md:text-5xl text-[#8b3a3a] mb-2"
                style={{ textShadow: "0 2px 16px rgba(139,58,58,0.2)", fontWeight: 700 }}
                initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.9 }}>
                5 de Septiembre · 2026
              </motion.h2>
              <OrnamentalLine />
              <div className="relative flex items-center justify-center w-[280px] h-[280px] md:w-[340px] md:h-[340px] mt-4">
                <motion.img src={ImgCirculoContador} alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                  style={{ zIndex: 1 }}
                  animate={{ rotate: [0, 1.5, -1.5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute inset-8 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(201,169,122,0.08) 0%, transparent 70%)" }}
                  animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                <div className="relative z-10 flex flex-col items-center justify-center gap-1" style={{ marginTop: "-16px" }}>
                  <motion.p className="font-serif text-base text-[#8b3a3a] font-bold mb-2"
                    style={{ textShadow: "0 1px 8px rgba(139,58,58,0.2)" }}
                    animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }}>
                    Faltan
                  </motion.p>
                  <div className="flex justify-center items-end gap-1">
                    <CountUnit value={countdown.days}    label="días" size="sm" />
                    <span className="text-[#c8886a]/40 text-sm mb-3">·</span>
                    <CountUnit value={countdown.hours}   label="hs"   size="sm" />
                    <span className="text-[#c8886a]/40 text-sm mb-3">·</span>
                    <CountUnit value={countdown.minutes} label="min"  size="sm" />
                    <span className="text-[#c8886a]/40 text-sm mb-3">·</span>
                    <CountUnit value={countdown.seconds} label="seg"  size="sm" />
                  </div>
                  <motion.div className="mt-2 text-[#c8886a]"
                    animate={{ scale: [1, 1.35, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}>❤</motion.div>
                </div>
              </div>
            </FadeSection>
          </section>

          {/* ══ CEREMONIA ══ */}
          <section className="snap-section relative px-6 overflow-hidden"
            style={{ background: "linear-gradient(160deg, #f5ebe0 0%, #ecdacc 100%)", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <FloatingParticles count={6} color="#c9a97a" />
            <motion.div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(232,196,176,0.35)" }}
              animate={{ x: [0, 25, 0], y: [0, -15, 0] }} transition={{ duration: 9, repeat: Infinity }} />
            <FadeSection className="relative z-10 w-full max-w-sm mx-auto text-center">
              <Label>Ceremonia</Label>
              <motion.div className="mb-6" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <motion.span className="text-5xl block" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 3, repeat: Infinity }}>⛪</motion.span>
              </motion.div>
              <EventCard icon="⛪" title="Ceremonia" hour={cfg.ceremony.hour} place={cfg.ceremony.place} address={cfg.ceremony.address} mapUrl={cfg.ceremony.mapUrl} />
            </FadeSection>
          </section>

          {/* ══ RECEPCIÓN ══ */}
          <section className="snap-section relative px-6 overflow-hidden"
            style={{ background: "linear-gradient(160deg, #ecdacc 0%, #e0c8b4 100%)", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <FloatingParticles count={6} color="#c8886a" />
            <motion.div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(201,169,122,0.22)" }}
              animate={{ x: [0, -25, 0], y: [0, 18, 0] }} transition={{ duration: 11, repeat: Infinity }} />
            <FadeSection className="relative z-10 w-full max-w-sm mx-auto text-center">
              <Label>Recepción</Label>
              <motion.div className="mb-6" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <motion.span className="text-5xl block" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}>🥂</motion.span>
              </motion.div>
              <EventCard icon="🥂" title="Recepción" hour={cfg.reception.hour} place={cfg.reception.place} address={cfg.reception.address} mapUrl={cfg.reception.mapUrl} extraNote="💌 Lluvia de sobres" />
              <FadeSection className="mt-8" delay={0.3}>
                <motion.div className="inline-flex flex-col items-center gap-2 px-8 py-3 border border-[#c8886a]/40 rounded-full"
                  style={{ background: "rgba(200,136,106,0.06)" }}
                  whileHover={{ scale: 1.03, borderColor: "rgba(200,136,106,0.7)", background: "rgba(200,136,106,0.10)" }}
                  transition={{ duration: 0.3 }}>
                  <div className="inline-flex items-center gap-3">
                    <span className="text-[#c9a97a] text-sm">✦</span>
                    <p className="text-[#8b3a3a] text-[10px] tracking-[4px] uppercase font-bold">Vestimenta · {cfg.dresscode}</p>
                    <span className="text-[#c9a97a] text-sm">✦</span>
                  </div>
                </motion.div>
              </FadeSection>
            </FadeSection>
          </section>

          {/* ══ INVITADOS ══ */}
          <section className="snap-section relative py-16 px-6 overflow-hidden"
            style={{ background: "linear-gradient(160deg, #f5ebe0 0%, #edd8c8 100%)", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <motion.div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(232,196,176,0.45)" }} animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 9, repeat: Infinity }} />
            <motion.div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(201,169,122,0.25)" }} animate={{ x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 11, repeat: Infinity }} />
            <FadeSection className="relative z-10 max-w-md mx-auto text-center">
              <Label>Sus lugares están reservados</Label>
              <motion.h2 className="font-serif text-4xl md:text-5xl text-[#8b3a3a] mb-2"
                style={{ textShadow: "0 2px 16px rgba(139,58,58,0.2)", fontWeight: 700 }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                Invitados
              </motion.h2>
              <OrnamentalLine />
              <motion.div className="mt-6 rounded-3xl p-6 border border-[#c8886a]/25"
                style={{ background: "rgba(255,252,248,0.82)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(139,58,58,0.1)" }}
                whileHover={{ y: -3 }} transition={{ duration: 0.4 }}>
                <p className="text-[#8b3a3a] text-[9px] tracking-[4px] uppercase font-bold mb-4">Esta invitación es para</p>
                <motion.div className="w-16 h-16 rounded-full border-2 border-[#c8886a]/50 flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(200,136,106,0.08)" }}
                  animate={{ boxShadow: ["0 0 0px rgba(200,136,106,0)", "0 0 22px rgba(200,136,106,0.4)", "0 0 0px rgba(200,136,106,0)"] }}
                  transition={{ duration: 3, repeat: Infinity }}>
                  <span className="font-serif text-2xl text-[#8b3a3a] font-bold">{guests.length}</span>
                </motion.div>
                <div className="space-y-2">
                  {guests.map((nombre, i) => (
                    <motion.div key={i} className="flex items-center gap-3 rounded-xl px-5 py-3 border border-[#c8886a]/20"
                      style={{ background: "rgba(200,136,106,0.06)" }}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 * i + 0.3, duration: 0.7 }}
                      whileHover={{ x: 5, borderColor: "rgba(200,136,106,0.4)" }}>
                      <motion.span className="text-[#c8886a]/60 text-xs" animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>✦</motion.span>
                      <span className="text-[#4a2c2a] font-semibold tracking-wide text-sm">{nombre}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </FadeSection>
          </section>

          {/* ══ CIERRE / CTA ══ */}
          <section className="snap-section relative px-6 text-center overflow-hidden"
            style={{ background: "linear-gradient(180deg, #f5ebe0 0%, #e8d0bc 50%, #dfc0a8 100%)", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "80px", paddingBottom: "80px" }}>
            <FloatingParticles count={14} color="#8b3a3a" />
            <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#c9a97a]/15 pointer-events-none"
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 6, repeat: Infinity }} />
            <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-[#c9a97a]/20 pointer-events-none"
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1 }} />
            <FadeSection className="relative z-10">
              <Label>Con todo nuestro amor</Label>
              <motion.h2 className="font-serif text-5xl md:text-7xl text-[#8b3a3a] mb-2 leading-tight"
                style={{ fontWeight: 700, textShadow: "0 2px 20px rgba(139,58,58,0.2)" }}
                animate={{ textShadow: ["0 0 0px rgba(139,58,58,0)", "0 0 35px rgba(139,58,58,0.22)", "0 0 0px rgba(139,58,58,0)"] }}
                transition={{ duration: 5, repeat: Infinity }}>
                ¡Los<br/>esperamos!
              </motion.h2>
              <OrnamentalLine />
              <motion.p className="text-[#7a5c4d]/70 text-sm mt-4 mb-8 max-w-xs mx-auto leading-relaxed font-medium"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                Tu confirmación es muy importante para nosotros.<br />
                Nos haría muy felices contar contigo 💕
              </motion.p>
              <motion.button onClick={goToRsvp}
                className="relative group inline-flex items-center gap-3 px-10 py-4 rounded-full overflow-hidden"
                style={{ border: "1.5px solid rgba(200,136,106,0.75)", color: "#7a1a35", background: "rgba(255,248,240,0.82)", backdropFilter: "blur(12px)", fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase", fontWeight: "700" }}
                whileHover={{ scale: 1.06, boxShadow: "0 12px 40px rgba(200,136,106,0.4)" }}
                whileTap={{ scale: 0.97 }}
                animate={{ boxShadow: ["0 0 0px rgba(200,136,106,0)", "0 0 28px rgba(200,136,106,0.35)", "0 0 0px rgba(200,136,106,0)"] }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}>
                <motion.div className="absolute inset-0 -skew-x-12"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)", left: "-100%" }}
                  animate={{ left: ["−100%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }} />
                <span>💕</span>
                <span>Confirmar asistencia</span>
              </motion.button>
              <motion.div className="mt-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <p className="text-[#7a5c4d]/55 italic text-sm tracking-wide font-medium">Con todo nuestro amor,</p>
                <p className="font-serif text-3xl text-[#c8886a] mt-1 font-bold" style={{ textShadow: "0 2px 12px rgba(200,136,106,0.3)" }}>
                  {cfg.bride} & {cfg.groom}
                </p>
              </motion.div>
              <motion.div className="mt-8 text-[#c8886a] text-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>❤</motion.div>
            </FadeSection>
          </section>
        </div>
      )}

      {/* ══ SOBRE — encima del hero ══ */}
      <AnimatePresence>
        {!abrir && invitation && (
          <motion.div
            key="sobre-wrapper"
            style={{ position: "fixed", inset: 0, zIndex: 20 }}
            exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.6, 1], delay: 0.1 } }}
          >
            <motion.div
              style={{ position: "absolute", inset: 0, background: "#0e020a", zIndex: 10, pointerEvents: "none" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: abrir ? 1 : 0 }}
            />
            <EnvelopeScreen
              firstName={firstName}
              guests={guests}
              onOpen={handleOpen}
              transitioning={transitioning}
              onStartMusic={handleStartMusic}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}