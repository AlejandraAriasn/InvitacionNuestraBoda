import { useParams } from "react-router-dom";
import { useInvitations } from "../hooks/useInvitations";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { WEDDING_CONFIG } from "../data/weddingConfig";

/* ─────────────────────────────────────────
   PARTÍCULAS FLOTANTES
───────────────────────────────────────── */
function FloatingParticles({ count = 18 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 7 + Math.random() * 10,
      delay: Math.random() * 8,
      driftX: (Math.random() - 0.5) * 40,
      driftY: -(25 + Math.random() * 50),
      symbol: i % 4 === 0 ? "✦" : i % 4 === 1 ? "❀" : i % 4 === 2 ? "·" : "✿",
    }))
  ).current;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size * 4,
            opacity: 0,
            color: p.id % 2 === 0 ? "#c9a97a" : "#c8886a",
          }}
          animate={{ y: [0, p.driftY], x: [0, p.driftX], opacity: [0, 0.45, 0.2, 0], scale: [0.5, 1, 0.7, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}>
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   PÉTALOS CAYENDO
───────────────────────────────────────── */
function FallingPetals({ count = 9 }) {
  const petals = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 110 - 5,
      duration: 12 + Math.random() * 14,
      delay: Math.random() * 16,
      size: 6 + Math.random() * 9,
      rotation: Math.random() * 360,
      drift: (Math.random() - 0.5) * 120,
      color: i % 3 === 0
        ? "rgba(201,169,122,0.35)"
        : i % 3 === 1
        ? "rgba(200,136,106,0.3)"
        : "rgba(219,112,112,0.25)",
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
            background: p.color,
            rotate: p.rotation,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift],
            rotate: [p.rotation, p.rotation + 360],
            opacity: [0, 0.8, 0.5, 0],
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
    <div className="flex items-center gap-3 my-5">
      <motion.div
        className="flex-1 h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        style={{ originX: 0, background: "linear-gradient(to right, transparent, #c9a97a)" }}
      />
      <motion.span
        className="text-[11px] tracking-[4px]"
        style={{ color: "#c9a97a" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}>
        ✦ ✦ ✦
      </motion.span>
      <motion.div
        className="flex-1 h-px"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        style={{ originX: 1, background: "linear-gradient(to left, transparent, #c9a97a)" }}
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
      className="text-[9px] tracking-[5px] uppercase font-bold mb-2"
      style={{ color: "#c8886a" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}>
      — {children} —
    </motion.p>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function RsvpPage() {
  const { id } = useParams();
  const { getInvitation } = useInvitations();

  const [invitation, setInvitation]   = useState(null);
  const [responses, setResponses]     = useState({});
  const [sent, setSent]               = useState(false);
  const [confirmNo, setConfirmNo]     = useState(null);
  const [celebrateId, setCelebrateId] = useState(null);
  const [submitting, setSubmitting]   = useState(false);

  const responsesRef = useRef({});
  const audioRef     = useRef(null);
  const cfg          = WEDDING_CONFIG;

  useEffect(() => {
    const load = async () => {
      const data = await getInvitation(id);
      setInvitation(data);
      if (data) {
        const initial = {};
        (data.rsvp         || []).forEach(name => { initial[name] = true;  });
        (data.rsvpDeclined || []).forEach(name => { initial[name] = false; });
        responsesRef.current = initial;
        setResponses(initial);
      }
    };
    load();
  }, [id]);

  const handleResponse = async (name, value) => {
    const updated = { ...responsesRef.current, [name]: value };
    responsesRef.current = updated;
    setResponses(updated);
    if (value === true) {
      setCelebrateId(name);
      setTimeout(() => setCelebrateId(null), 1200);
    }
    await savePartial(updated);
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const finalResponses = responsesRef.current;
    const asistentes     = Object.keys(finalResponses).filter(n => finalResponses[n] === true);
    const rechazaron     = Object.keys(finalResponses).filter(n => finalResponses[n] === false);
    const status         = asistentes.length > 0 ? "confirmed" : "declined";

    await updateDoc(doc(db, "invitations", id), {
      rsvp:           asistentes,
      rsvpDeclined:   rechazaron,
      rsvpStatus:     status,
      confirmedCount: asistentes.length,
      declinedCount:  rechazaron.length,
      respondedAt:    new Date().toISOString(),
    });

    playSound();
    setSubmitting(false);
    setSent(true);
  };

  const savePartial = async (updatedResponses) => {
    const asistentes = Object.keys(updatedResponses).filter(n => updatedResponses[n] === true);
    const rechazaron = Object.keys(updatedResponses).filter(n => updatedResponses[n] === false);
    await updateDoc(doc(db, "invitations", id), {
      rsvp:           asistentes,
      rsvpDeclined:   rechazaron,
      confirmedCount: asistentes.length,
      declinedCount:  rechazaron.length,
    });
  };

  const goToInvitation = () => { window.location.href = `/invite/${id}`; };

  const answeredCount = Object.keys(responses).length;
  const totalGuests   = invitation?.guests?.length || 0;
  const allAnswered   = totalGuests > 0 && answeredCount === totalGuests;
  const progress      = totalGuests > 0 ? (answeredCount / totalGuests) * 100 : 0;

  /* ── LOADING ── */
  if (!invitation) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #fdf8f2 0%, #f5ece0 100%)" }}>
        <motion.div
          className="text-center"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <p className="font-serif text-2xl mb-4" style={{ color: "#c9a97a", fontStyle: "italic" }}>
            Cargando invitación
          </p>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: "#c9a97a" }}
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #fdf8f2 0%, #faf3ea 50%, #f5ece0 100%)" }}>

      <FloatingParticles count={18} />
      <FallingPetals count={9} />
      <audio ref={audioRef} src="/sounds/confirm.mp3" />

      {/* Manchas de color decorativas de fondo */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(201,169,122,0.18) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(200,136,106,0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 11, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(219,112,112,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 13, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* ── HEADER ── */}
      <div
        className="relative z-10 pt-12 pb-8 px-6 text-center"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.55), transparent)",
          borderBottom: "1px solid rgba(201,169,122,0.2)",
        }}>

        {/* Corona ornamental superior */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}>
          <div style={{ height: 1, width: 40, background: "linear-gradient(to right, transparent, #c9a97a)" }} />
          <span style={{ color: "#c9a97a", fontSize: 14, letterSpacing: 6 }}>✦ ❀ ✦</span>
          <div style={{ height: 1, width: 40, background: "linear-gradient(to left, transparent, #c9a97a)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}>
          <Label>Confirmación de asistencia</Label>
        </motion.div>

        <motion.h1
          className="font-serif text-4xl"
          style={{ color: "#8b5e3c", fontStyle: "italic", textShadow: "0 1px 0 rgba(255,255,255,0.8)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}>
          {cfg.bride} & {cfg.groom}
        </motion.h1>

        <motion.p
          className="text-[10px] tracking-[5px] uppercase mt-2 font-medium"
          style={{ color: "#c8886a" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}>
          {cfg.dateDisplay}
        </motion.p>

        {/* Barra de progreso mejorada */}
        {!sent && totalGuests > 0 && (
          <motion.div
            className="mt-7 max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}>
            <div className="flex justify-between text-[9px] tracking-[2px] uppercase mb-2 font-semibold"
              style={{ color: "#8b5e3c" }}>
              <span>Progreso</span>
              <span style={{ color: allAnswered ? "#15803d" : "#8b5e3c" }}>
                {answeredCount} / {totalGuests} {allAnswered ? "✓" : ""}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(139,94,60,0.12)", border: "1px solid rgba(201,169,122,0.25)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #c8886a, #c9a97a, #8b5e3c)" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* ── CONTENIDO ── */}
      <div className="relative z-10 max-w-md mx-auto px-5 pb-44 pt-7">
        <AnimatePresence mode="wait">

          {/* ════ FORMULARIO ════ */}
          {!sent && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>

              <motion.p
                className="text-[9px] tracking-[3px] uppercase text-center mb-7 font-semibold"
                style={{ color: "#c8886a" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>
                — Toca una opción por persona —
              </motion.p>

              <div className="space-y-4">
                {invitation.guests.map((g, i) => {
                  const value         = responses[g];
                  const isCelebrating = celebrateId === g;

                  return (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.55 }}
                      className="relative rounded-2xl overflow-hidden"
                      style={{
                        background: value === true
                          ? "linear-gradient(135deg, #052e16, #14532d)"
                          : value === false
                          ? "linear-gradient(135deg, #450a0a, #7f1d1d)"
                          : "#ffffff",
                        border: value === true
                          ? "1.5px solid rgba(34,197,94,0.5)"
                          : value === false
                          ? "1.5px solid rgba(220,38,38,0.4)"
                          : "1.5px solid rgba(201,169,122,0.35)",
                        boxShadow: isCelebrating
                          ? "0 0 32px rgba(34,197,94,0.25), 0 8px 32px rgba(0,0,0,0.08)"
                          : value === true
                          ? "0 6px 24px rgba(21,128,61,0.2), 0 2px 8px rgba(0,0,0,0.05)"
                          : value === false
                          ? "0 6px 24px rgba(185,28,28,0.2), 0 2px 8px rgba(0,0,0,0.05)"
                          : "0 4px 20px rgba(139,94,60,0.1), 0 1px 4px rgba(0,0,0,0.04)",
                      }}>

                      {/* Franja lateral de color */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                        style={{
                          background: value === true
                            ? "linear-gradient(to bottom, #22c55e, #16a34a)"
                            : value === false
                            ? "linear-gradient(to bottom, #ef4444, #dc2626)"
                            : "linear-gradient(to bottom, #c9a97a, #c8886a)",
                        }}
                      />

                      {/* Flash de celebración */}
                      <AnimatePresence>
                        {isCelebrating && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
                            initial={{ x: "-100%" }}
                            animate={{ x: "200%" }}
                            transition={{ duration: 0.7 }}
                          />
                        )}
                      </AnimatePresence>

                      <div className="pl-5 pr-4 py-4">
                        {/* Nombre + indicador */}
                        <div className="flex items-center gap-3 mb-3">
                          <motion.div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: value === true
                                ? "rgba(34,197,94,0.2)"
                                : value === false
                                ? "rgba(239,68,68,0.2)"
                                : "linear-gradient(135deg, rgba(201,169,122,0.2), rgba(200,136,106,0.15))",
                              border: value === true
                                ? "1.5px solid rgba(34,197,94,0.5)"
                                : value === false
                                ? "1.5px solid rgba(239,68,68,0.4)"
                                : "1.5px solid rgba(201,169,122,0.4)",
                              color: value === true ? "#4ade80" : value === false ? "#f87171" : "#c9a97a",
                            }}>
                            {value === true ? "✓" : value === false ? "✕" : "✦"}
                          </motion.div>
                          <p
                            className="text-sm tracking-wide font-medium"
                            style={{
                              color: value === true || value === false
                                ? "rgba(255,248,240,0.92)"
                                : "#4a2e12",
                            }}>
                            {g}
                          </p>
                          {value === true && (
                            <motion.span
                              className="ml-auto text-[10px] font-semibold tracking-widest uppercase"
                              style={{ color: "#4ade80" }}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}>
                              Asiste
                            </motion.span>
                          )}
                          {value === false && (
                            <motion.span
                              className="ml-auto text-[10px] font-semibold tracking-widest uppercase"
                              style={{ color: "#f87171" }}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}>
                              No asiste
                            </motion.span>
                          )}
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.93 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleResponse(g, true)}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{
                              background: value === true
                                ? "linear-gradient(135deg, #15803d, #22c55e)"
                                : "rgba(255,255,255,0.9)",
                              color: value === true ? "#fff" : "#15803d",
                              border: value === true
                                ? "none"
                                : "1.5px solid rgba(34,197,94,0.5)",
                              boxShadow: value === true
                                ? "0 4px 14px rgba(34,197,94,0.4)"
                                : "0 2px 8px rgba(34,197,94,0.1)",
                            }}>
                            {value === true ? "✓ Sí asiste" : "💖 Sí asiste"}
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.93 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setConfirmNo(g)}
                            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                            style={{
                              background: value === false
                                ? "linear-gradient(135deg, #991b1b, #ef4444)"
                                : "rgba(255,255,255,0.9)",
                              color: value === false ? "#fff" : "#b91c1c",
                              border: value === false
                                ? "none"
                                : "1.5px solid rgba(239,68,68,0.4)",
                              boxShadow: value === false
                                ? "0 4px 14px rgba(239,68,68,0.4)"
                                : "0 2px 8px rgba(239,68,68,0.1)",
                            }}>
                            {value === false ? "✕ No asiste" : "😔 No asiste"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ════ PANTALLA DE ÉXITO ════ */}
          {sent && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-center py-12">

              {/* Confeti */}
              <div className="relative h-28 mb-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    style={{ fontSize: 12 + Math.random() * 14, color: i % 2 === 0 ? "#c9a97a" : "#c8886a" }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: (Math.random() - 0.5) * 220,
                      y: -80 - Math.random() * 100,
                      opacity: 0,
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 1.4, delay: i * 0.06, ease: "easeOut" }}>
                    {i % 3 === 0 ? "✦" : i % 3 === 1 ? "❀" : "✿"}
                  </motion.div>
                ))}
                <motion.p
                  className="absolute inset-0 flex items-center justify-center text-6xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.75, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}>
                  💌
                </motion.p>
              </div>

              <motion.div
                className="rounded-3xl p-8 mx-2"
                style={{
                  background: "#ffffff",
                  border: "1.5px solid rgba(201,169,122,0.35)",
                  boxShadow: "0 8px 40px rgba(139,94,60,0.12)",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}>
                <Label>Respuesta registrada</Label>
                <h2 className="font-serif text-4xl mb-1" style={{ color: "#8b5e3c", fontStyle: "italic" }}>
                  ¡Gracias por responder!
                </h2>
                <OrnamentalLine />
                <p className="text-sm leading-relaxed mt-2" style={{ color: "#6b4226" }}>
                  Tu confirmación nos ayuda mucho con la organización
                  y hace que todo sea más especial para nosotros. 🙏<br /><br />
                  Con todo nuestro amor,
                </p>
                <p className="font-serif text-lg mt-2" style={{ color: "#c9a97a", fontStyle: "italic" }}>
                  {cfg.bride} & {cfg.groom}
                </p>
              </motion.div>

              <motion.button
                onClick={goToInvitation}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-6 py-4 rounded-2xl text-[11px] tracking-[4px] uppercase font-bold transition-all"
                style={{
                  background: "linear-gradient(135deg, #8b5e3c, #c9a97a)",
                  color: "#fff8f0",
                  boxShadow: "0 6px 24px rgba(139,94,60,0.35)",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ boxShadow: "0 12px 40px rgba(139,94,60,0.5)", scale: 1.02 }}>
                💌 Ver invitación
              </motion.button>

              <motion.div
                className="mt-10 text-3xl"
                style={{ color: "#c9a97a" }}
                animate={{ scale: [1, 1.28, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity }}>
                ❤
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTÓN FLOTANTE FINALIZAR ── */}
      <AnimatePresence>
        {!sent && allAnswered && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 px-5 pb-8 pt-8"
            style={{ background: "linear-gradient(to top, #f5ece0 60%, transparent)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}>

            <motion.button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 rounded-2xl text-[11px] tracking-[4px] uppercase font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #8b5e3c, #c9a97a)",
                color: "#fff8f0",
                boxShadow: "0 6px 28px rgba(139,94,60,0.4)",
              }}
              whileHover={{ scale: submitting ? 1 : 1.02, boxShadow: "0 14px 40px rgba(139,94,60,0.55)" }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 6px 28px rgba(139,94,60,0.3)",
                  "0 6px 38px rgba(139,94,60,0.55)",
                  "0 6px 28px rgba(139,94,60,0.3)",
                ],
              }}
              transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}>
              {submitting ? (
                <span className="flex items-center justify-center gap-3">
                  <motion.span
                    className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  Guardando...
                </span>
              ) : (
                "💌 Finalizar confirmación"
              )}
            </motion.button>

            <p className="text-center text-[9px] tracking-[2px] uppercase mt-3 font-medium"
              style={{ color: "rgba(139,94,60,0.45)" }}>
              Podrás cambiar tu respuesta volviendo a esta página
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante ver invitación */}
      {!sent && !allAnswered && (
        <motion.button
          onClick={goToInvitation}
          className="fixed bottom-6 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-[10px] tracking-[3px] uppercase font-bold"
          style={{
            background: "linear-gradient(135deg, #8b5e3c, #c9a97a)",
            color: "#fff8f0",
            boxShadow: "0 6px 24px rgba(139,94,60,0.4)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.06, boxShadow: "0 10px 32px rgba(139,94,60,0.5)" }}
          whileTap={{ scale: 0.96 }}>
          💌 Ver invitación
        </motion.button>
      )}

      {/* ── MODAL CONFIRMAR NO ── */}
      <AnimatePresence>
        {confirmNo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "rgba(60,20,5,0.65)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="w-full max-w-sm text-center rounded-3xl p-8"
              style={{
                background: "#fff8f2",
                border: "1.5px solid rgba(201,169,122,0.4)",
                boxShadow: "0 32px 80px rgba(80,20,5,0.3)",
              }}
              initial={{ scale: 0.84, y: 32 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.84, y: 32 }}
              transition={{ type: "spring", damping: 20, stiffness: 310 }}>

              <motion.p
                className="text-5xl mb-4"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                💔
              </motion.p>

              <Label>Un momento</Label>
              <h3 className="font-serif text-2xl mb-1" style={{ color: "#8b5e3c", fontStyle: "italic" }}>
                ¿Estás segurito?
              </h3>
              <OrnamentalLine />
              <p className="text-sm mb-2 leading-relaxed" style={{ color: "#6b4226" }}>
                Nos hará falta verte ese día 🥺
              </p>
              <p className="text-xs mb-7 font-semibold" style={{ color: "#c8886a" }}>
                {confirmNo}
              </p>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setConfirmNo(null)}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    border: "1.5px solid rgba(201,169,122,0.45)",
                    color: "#8b5e3c",
                    background: "transparent",
                  }}
                  whileHover={{ background: "rgba(201,169,122,0.1)" }}>
                  No, volver
                </motion.button>
                <motion.button
                  onClick={() => { handleResponse(confirmNo, false); setConfirmNo(null); }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #991b1b, #ef4444)",
                    boxShadow: "0 4px 16px rgba(239,68,68,0.35)",
                  }}
                  whileHover={{ boxShadow: "0 6px 22px rgba(239,68,68,0.5)" }}>
                  Sí, no asistiré
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
