import { motion } from 'framer-motion'

// size="sm"  → dentro del círculo floral
// size="md"  → default, uso general
export default function CountUnit({ value, label, size = 'md' }) {
  const display = String(value).padStart(2, '0')

  const sizes = {
    sm: {
      card: 'w-10 h-12',
      text: 'text-lg',
      label: 'text-[7px]',
    },
    md: {
      card: 'w-16 h-20 md:w-20 md:h-24',
      text: 'text-3xl md:text-4xl',
      label: 'text-[9px] md:text-[11px]',
    },
  }

  const s = sizes[size]

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        key={display}
        className={`relative ${s.card} flex items-center justify-center`}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ perspective: 400 }}
      >
        {/* Tarjeta con los colores suaves */}
        <div className="absolute inset-0 rounded-2xl border border-[#c8886a]/30 shadow-md"
          style={{ background: 'linear-gradient(160deg, #8b3a3a 0%, #5c1f1f 100%)' }}
        />
        {/* Brillo superior */}
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl bg-white/8" />
        {/* Línea central */}
        <div className="absolute bottom-[49%] left-2 right-2 h-px bg-black/20" />
        {/* Número */}
        <span className={`relative font-serif ${s.text} text-[#c9a97a] drop-shadow`}>
          {display}
        </span>
      </motion.div>
      <span className={`${s.label} tracking-[3px] uppercase text-[#8b3a3a]/60`}>
        {label}
      </span>
    </div>
  )
}