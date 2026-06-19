import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export default function Divider() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className="flex items-center gap-4 my-10">
      <motion.div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a97a]/50"
        initial={{ scaleX: 0 }} animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 1 }} style={{ originX: 0 }} />
      <motion.span className="text-[#c9a97a] text-xl"
        animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
        ✦
      </motion.span>
      <motion.div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a97a]/50"
        initial={{ scaleX: 0 }} animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 1 }} style={{ originX: 1 }} />
    </div>
  )
}