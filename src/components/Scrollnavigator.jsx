import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Sparkle({ x, y, delay, size }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, #f5e0a0 0%, #c9a97a 60%, transparent 100%)',
        left: x,
        top: y,
      }}
      animate={{
        opacity: [0, 1, 0.6, 0],
        scale: [0.2, 1.4, 0.8, 0],
        y: [0, -8, -14, -18],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    />
  )
}

export default function ScrollNavigator({ containerRef }) {
  const [atBottom, setAtBottom] = useState(false)
  const [atTop, setAtTop] = useState(true)

  const sparkles = useRef([
    { x: -8, y: 10, delay: 0, size: 4 },
    { x: 30, y: 0, delay: 0.6, size: 3 },
    { x: 55, y: 12, delay: 1.1, size: 4 },
    { x: 10, y: 30, delay: 1.7, size: 2.5 },
    { x: 42, y: 28, delay: 0.3, size: 3 },
    { x: -4, y: 50, delay: 1.4, size: 2.5 },
    { x: 58, y: 45, delay: 0.9, size: 3.5 },
  ]).current

  useEffect(() => {
    const getEl = () => containerRef?.current ?? null

    const check = () => {
      const el = getEl()

      if (el) {
        const maxScroll = el.scrollHeight - el.clientHeight
        if (maxScroll < 10) return
        setAtBottom(maxScroll - el.scrollTop <= 40)
        setAtTop(el.scrollTop <= 40)
      } else {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight
        if (maxScroll < 10) return
        setAtBottom(maxScroll - window.scrollY <= 40)
        setAtTop(window.scrollY <= 40)
      }
    }

    const el = getEl()
    const initTimer = setTimeout(check, 500)

    if (el) {
      el.addEventListener('scroll', check, { passive: true })
      window.addEventListener('resize', check)
      return () => {
        clearTimeout(initTimer)
        el.removeEventListener('scroll', check)
        window.removeEventListener('resize', check)
      }
    } else {
      window.addEventListener('scroll', check, { passive: true })
      window.addEventListener('resize', check)
      return () => {
        clearTimeout(initTimer)
        window.removeEventListener('scroll', check)
        window.removeEventListener('resize', check)
      }
    }
  }, [containerRef])

  const handleNext = () => {
    const el = containerRef?.current
    if (!el) {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
      return
    }
    const sections = Array.from(el.querySelectorAll('.snap-section'))
    if (!sections.length) return
    const currentScroll = el.scrollTop
    const nextSection = sections.find(s => s.offsetTop > currentScroll + 50)
    if (nextSection) el.scrollTo({ top: nextSection.offsetTop, behavior: 'smooth' })
  }

  const handlePrev = () => {
    const el = containerRef?.current
    if (!el) {
      window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })
      return
    }
    const sections = Array.from(el.querySelectorAll('.snap-section'))
    if (!sections.length) return
    const currentScroll = el.scrollTop
    let prevSection = sections[0]
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop < currentScroll - 50) prevSection = sections[i]
    }
    el.scrollTo({ top: prevSection.offsetTop, behavior: 'smooth' })
  }

  /* ── Estilos compartidos para las etiquetas de texto ── */
 const labelStyle = {
  fontFamily: 'Georgia, serif',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '3px',
  color: '#fff',
  textTransform: 'uppercase',

  textShadow: `
    0 0 8px rgba(255,255,255,0.9),
    0 0 16px rgba(255,215,180,0.8),
    0 2px 8px rgba(0,0,0,0.9)
  `,

  background:
    'linear-gradient(135deg, rgba(139,58,58,0.92), rgba(201,169,122,0.92))',

  backdropFilter: 'blur(8px)',
  padding: '7px 16px',
  borderRadius: '30px',
  border: '1px solid rgba(255,255,255,0.35)',

  boxShadow: `
    0 4px 15px rgba(139,58,58,0.35),
    0 0 12px rgba(201,169,122,0.4)
  `,

  whiteSpace: 'nowrap',
}

  return (
    <>
      {/* ═══════════════════════════════════
          BOTÓN BAJAR — "ver más"
      ═══════════════════════════════════ */}
      <AnimatePresence>
        <motion.div
          className="fixed z-50 flex flex-col items-center"
          style={{ right: 14, bottom: '12%' }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: atBottom ? 0 : 1,
            scale: atBottom ? 0.7 : 1,
            pointerEvents: atBottom ? 'none' : 'auto',
          }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <motion.button
            onClick={handleNext}
            className="relative flex flex-col items-center gap-2"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
              {sparkles.map((s, i) => (
                <Sparkle key={i} {...s} />
              ))}
            </div>

            <motion.div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 52,
                height: 52,
                background: 'rgba(253,246,239,0.92)',
                border: '1.5px solid rgba(200,136,106,0.5)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(139,58,58,0.15), 0 0 14px rgba(201,169,122,0.25)',
              }}
            >
              <motion.svg
                width="18" height="18" viewBox="0 0 18 18" fill="none"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <path d="M9 2L9 14" stroke="#c8886a" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M3 9L9 15L15 9" stroke="#c8886a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.div>

        <motion.span
  style={labelStyle}
  animate={{
    scale: [1, 1.08, 1],
    opacity: [0.85, 1, 0.85],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  VER MÁS
</motion.span>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* ═══════════════════════════════════
          BOTÓN SUBIR
      ═══════════════════════════════════ */}
      <AnimatePresence>
        <motion.div
          className="fixed z-50 flex flex-col items-center"
          style={{ left: 14, bottom: '12%' }}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{
            opacity: atTop ? 0 : 1,
            scale: atTop ? 0.7 : 1,
            y: atTop ? 20 : 0,
            pointerEvents: atTop ? 'none' : 'auto',
          }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            onClick={handlePrev}
            className="relative flex flex-col items-center gap-2"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 52,
                height: 52,
                background: 'rgba(253,246,239,0.92)',
                border: '1.5px solid rgba(139,58,58,0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <motion.svg
                width="18" height="18" viewBox="0 0 18 18" fill="none"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <path d="M9 16L9 4" stroke="#8b3a3a" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M3 9L9 3L15 9" stroke="#8b3a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.div>

            <motion.span
  style={labelStyle}
  animate={{
    scale: [1, 1.08, 1],
    opacity: [0.85, 1, 0.85],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
 Subir
</motion.span>
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </>
  )
}