import { motion } from 'framer-motion'

export default function EventCard({ icon, title, hour, place, address, mapUrl, extraNote }) {
  return (
    <motion.div
      className="relative border rounded-2xl p-8 text-center overflow-hidden group"
      style={{
        background: 'linear-gradient(160deg, #fff8f4 0%, #f5e6dc 100%)',
        borderColor: 'rgba(200,136,106,0.25)',
      }}
      whileHover={{ y: -6, borderColor: 'rgba(200,136,106,0.6)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Brillo hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#c8886a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Ícono flotante */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl border"
        style={{ background: '#f5e6dc', borderColor: 'rgba(200,136,106,0.4)' }}
      >
        {icon}
      </div>

      {/* Título */}
      <h3 className="font-serif text-2xl mt-4 mb-1" style={{ color: '#8b3a3a' }}>
        {title}
      </h3>

      {/* Hora */}
      <p className="text-xs tracking-[3px] uppercase mb-6" style={{ color: '#c8886a' }}>
        {hour}
      </p>

      {/* Lugar */}
      <p className="font-medium text-lg" style={{ color: '#4a2c2a' }}>
        {place}
      </p>

      {/* Dirección */}
      <p className="text-sm mt-1" style={{ color: '#7a5c4d' }}>
        {address}
      </p>

      {/* Botón mapa */}
      {mapUrl && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[3px] uppercase font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              border: '1px solid rgba(200,136,106,0.5)',
              color: '#8b3a3a',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#c8886a'
              e.currentTarget.style.color = '#fff8f4'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#8b3a3a'
            }}
          >
            📍 Ver en mapa
          </a>

          {extraNote && (
            <p className="mt-3 text-[9px] tracking-[3px] uppercase font-semibold italic" style={{ color: '#b06b4f' }}>
              {extraNote}
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}