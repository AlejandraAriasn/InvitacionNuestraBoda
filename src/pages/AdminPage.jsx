import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvitations } from '../hooks/useInvitations'
import { WEDDING_CONFIG } from '../data/weddingConfig'

const BASE_URL = window.location.origin

function parseGuestList(text) {
  const groups = text.trim().split(/\n\s*\n/)
  return groups
    .map(group => group.split('\n').map(n => n.trim()).filter(Boolean))
    .filter(g => g.length > 0)
}

/* ─────────────────────────────────────────
   PARTÍCULAS FLOTANTES
───────────────────────────────────────── */
function FloatingParticles({ count = 18, color = "#c8886a" }) {
  const particles = useState(() =>
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
  )[0]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size * 4, color, opacity: 0 }}
          animate={{ y: [0, p.driftY], x: [0, p.driftX], opacity: [0, 0.4, 0.2, 0], scale: [0.5, 1, 0.8, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   LÍNEA ORNAMENTAL
───────────────────────────────────────── */
function OrnamentalLine() {
  return (
    <div className="flex items-center gap-3 my-4">
      <motion.div className="flex-1 h-px" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }}
        style={{ originX: 0, background: "linear-gradient(to right, transparent, #c9a97a55)" }} />
      <motion.span className="text-[#c9a97a] text-[10px] tracking-[6px]" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
        ✦ ✦ ✦
      </motion.span>
      <motion.div className="flex-1 h-px" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }}
        style={{ originX: 1, background: "linear-gradient(to left, transparent, #c9a97a55)" }} />
    </div>
  )
}

/* ─────────────────────────────────────────
   LABEL
───────────────────────────────────────── */
function Label({ children }) {
  return (
    <motion.p
      className="text-[9px] tracking-[5px] uppercase font-bold mb-2"
      style={{ color: "#c8886a" }}
      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.7 }}>
      — {children} —
    </motion.p>
  )
}

/* ─────────────────────────────────────────
   SELECTOR LADO (Novio / Novia)
───────────────────────────────────────── */
function SideSelector({ value, onChange }) {
  const options = [
    {
      key: 'groom',
      label: 'Novio · Ever',
      icon: '💙',
      activeGrad: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)',
      activeBorder: 'rgba(100,160,220,0.5)',
      activeColor: '#90c4f0',
      inactiveColor: 'rgba(100,160,220,0.35)',
    },
    {
      key: 'bride',
      label: 'Novia · Alejandra',
      icon: '🌸',
      activeGrad: 'linear-gradient(135deg, #5f1e3a, #9f2d60)',
      activeBorder: 'rgba(220,100,150,0.5)',
      activeColor: '#f0a0c0',
      inactiveColor: 'rgba(220,100,150,0.35)',
    },
  ]

  return (
    <div>
      <p className="text-[9px] tracking-[4px] uppercase mb-3" style={{ color: "rgba(201,169,122,0.45)" }}>
        — ¿De parte de quién? —
      </p>
      <div className="flex gap-3">
        {options.map(opt => {
          const active = value === opt.key
          return (
            <motion.button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              whileTap={{ scale: 0.96 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] tracking-[2px] uppercase font-bold transition-all"
              style={active ? {
                background: opt.activeGrad,
                border: `1px solid ${opt.activeBorder}`,
                color: opt.activeColor,
                boxShadow: `0 4px 18px ${opt.activeBorder}`,
              } : {
                border: '1px solid rgba(201,169,122,0.15)',
                color: opt.inactiveColor,
                background: 'rgba(201,169,122,0.04)',
              }}
              whileHover={!active ? { background: 'rgba(201,169,122,0.08)' } : {}}>
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   BADGE DE LADO
───────────────────────────────────────── */
function SideBadge({ side }) {
  if (!side) return null
  const isGroom = side === 'groom'
  return (
    <span
      className="text-[10px] px-2.5 py-0.5 rounded-full border"
      style={isGroom ? {
        background: 'rgba(45,106,159,0.15)',
        color: '#90c4f0',
        borderColor: 'rgba(45,106,159,0.3)',
      } : {
        background: 'rgba(159,45,96,0.15)',
        color: '#f0a0c0',
        borderColor: 'rgba(159,45,96,0.3)',
      }}>
      {isGroom ? '💙 Ever' : '🌸 Ale'}
    </span>
  )
}

/* ─────────────────────────────────────────
   FILTRO DE LADO (pill buttons)
───────────────────────────────────────── */
function SideFilter({ value, onChange, counts }) {
  const options = [
    { key: 'all',   label: 'Todos',        icon: '✦', color: 'rgba(201,169,122,0.6)' },
    { key: 'groom', label: 'Ever',          icon: '💙', color: '#90c4f0' },
    { key: 'bride', label: 'Alejandra',     icon: '🌸', color: '#f0a0c0' },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(f => {
        const active = value === f.key
        return (
          <motion.button key={f.key} onClick={() => onChange(f.key)} whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[2px] uppercase font-bold transition-all"
            style={active ? {
              background: 'linear-gradient(135deg, rgba(139,58,58,0.6), rgba(201,169,122,0.3))',
              border: '1px solid rgba(201,169,122,0.4)',
              color: '#c9a97a',
            } : {
              border: '1px solid rgba(201,169,122,0.12)',
              color: 'rgba(201,169,122,0.35)',
              background: 'transparent',
            }}>
            <span>{f.icon}</span>
            <span>{f.label}</span>
            <span className="rounded-full px-1.5 py-0.5 text-[9px]"
              style={{ background: 'rgba(201,169,122,0.1)', color: 'rgba(201,169,122,0.6)' }}>
              {counts[f.key] ?? 0}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────
   BADGE DE ESTADO RSVP
───────────────────────────────────────── */
function RsvpBadge({ status, opened }) {
  if (status === 'declined' && opened) {
    return (
      <span className="text-[10px] px-3 py-0.5 rounded-full border"
        style={{ background: "rgba(180,30,30,0.12)", color: "#f87171", borderColor: "rgba(180,30,30,0.25)" }}>
        Rechazada · Abierta
      </span>
    )
  }
  const map = {
    pending:   { label: 'Pendiente',  bg: 'rgba(200,136,106,0.12)', color: '#c8886a',  border: 'rgba(200,136,106,0.25)' },
    confirmed: { label: 'Confirmada', bg: 'rgba(74,197,74,0.10)',   color: '#4ade80',  border: 'rgba(74,197,74,0.25)'   },
    declined:  { label: 'Rechazada',  bg: 'rgba(180,30,30,0.12)',   color: '#f87171',  border: 'rgba(180,30,30,0.25)'   },
  }
  const s = map[status] || map.pending
  return (
    <span className="text-[10px] px-3 py-0.5 rounded-full border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {s.label}
    </span>
  )
}

const FILTERS = [
  { key: 'all',       label: 'Todas',       icon: '✦' },
  { key: 'pending',   label: 'Pendientes',  icon: '○' },
  { key: 'confirmed', label: 'Confirmadas', icon: '✓' },
  { key: 'declined',  label: 'Rechazadas',  icon: '✕' },
]

const PERSON_FILTERS = [
  { key: 'all',       label: 'Todos',       icon: '✦' },
  { key: 'pending',   label: 'Pendientes',  icon: '○' },
  { key: 'confirmed', label: 'Confirmados', icon: '✓' },
  { key: 'declined',  label: 'Rechazados',  icon: '✕' },
]

export default function AdminPage() {
  const { invitations, addInvitation, deleteInvitation } = useInvitations()
  const [bulkText, setBulkText]       = useState('')
  const [preview, setPreview]         = useState([])
  const [createSide, setCreateSide]   = useState('groom')  // ← nuevo
  const [tab, setTab]                 = useState('create')
  const [filter, setFilter]           = useState('all')
  const [sideFilter, setSideFilter]   = useState('all')    // ← nuevo (lista)
  const [search, setSearch]           = useState('')
  const [reportFilter, setReportFilter]     = useState('all')
  const [reportSideFilter, setReportSideFilter] = useState('all') // ← nuevo (reportes)
  const [reportSearch, setReportSearch]     = useState('')
  const [copied, setCopied]           = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)
  const [guestModal, setGuestModal]   = useState(null)
  const cfg = WEDDING_CONFIG

  const getStatus = (inv) => {
    if (inv.rsvpStatus) return inv.rsvpStatus
    const confirmed = inv.rsvp?.length || 0
    const declined  = inv.rsvpDeclined?.length || 0
    if (confirmed > 0) return 'confirmed'
    if (declined  > 0) return 'declined'
    return 'pending'
  }

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:           invitations.length,
    guests:          invitations.reduce((s, i) => s + i.guests.length, 0),
    confirmed:       invitations.filter(i => getStatus(i) === 'confirmed').length,
    pending:         invitations.filter(i => getStatus(i) === 'pending').length,
    declined:        invitations.filter(i => getStatus(i) === 'declined').length,
    opened:          invitations.filter(i => i.opened).length,
    confirmedGuests: invitations.reduce((s, i) => s + (i.rsvp?.length || 0), 0),
    declinedGuests:  invitations.reduce((s, i) => s + (i.rsvpDeclined?.length || 0), 0),
  }), [invitations])

  /* ── Conteos por lado (lista) ── */
  const sideCounts = useMemo(() => {
    let base = invitations
    if (filter !== 'all') base = base.filter(i => getStatus(i) === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      base = base.filter(i => i.guests.some(g => g.toLowerCase().includes(q)))
    }
    return {
      all:   base.length,
      groom: base.filter(i => i.side === 'groom').length,
      bride: base.filter(i => i.side === 'bride').length,
    }
  }, [invitations, filter, search])

  /* ── Reporte: lista plana de personas con estado individual ── */
  const getPersonStatus = (inv, name) => {
    if (inv.rsvp?.includes(name)) return 'confirmed'
    if (inv.rsvpDeclined?.includes(name)) return 'declined'
    return 'pending'
  }

  const allPeople = useMemo(() => {
    const rows = []
    invitations.forEach(inv => {
      inv.guests.forEach(name => {
        rows.push({
          name,
          invitationId: inv.id,
          status: getPersonStatus(inv, name),
          groupSize: inv.guests.length,
          opened: inv.opened,
          side: inv.side || null,
        })
      })
    })
    return rows
  }, [invitations])

  const peopleStats = useMemo(() => ({
    total:     allPeople.length,
    confirmed: allPeople.filter(p => p.status === 'confirmed').length,
    pending:   allPeople.filter(p => p.status === 'pending').length,
    declined:  allPeople.filter(p => p.status === 'declined').length,
  }), [allPeople])

  /* ── Conteos por lado (reportes) ── */
  const reportSideCounts = useMemo(() => {
    let base = allPeople
    if (reportFilter !== 'all') base = base.filter(p => p.status === reportFilter)
    if (reportSearch.trim()) {
      const q = reportSearch.toLowerCase()
      base = base.filter(p => p.name.toLowerCase().includes(q))
    }
    return {
      all:   base.length,
      groom: base.filter(p => p.side === 'groom').length,
      bride: base.filter(p => p.side === 'bride').length,
    }
  }, [allPeople, reportFilter, reportSearch])

  const filteredPeople = useMemo(() => {
    let list = allPeople
    if (reportFilter !== 'all') list = list.filter(p => p.status === reportFilter)
    if (reportSideFilter !== 'all') list = list.filter(p => p.side === reportSideFilter)
    if (reportSearch.trim()) {
      const q = reportSearch.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    return list
  }, [allPeople, reportFilter, reportSideFilter, reportSearch])

  /* ── Filtrado lista ── */
  const filtered = useMemo(() => {
    let list = invitations
    if (filter !== 'all') list = list.filter(i => getStatus(i) === filter)
    if (sideFilter !== 'all') list = list.filter(i => i.side === sideFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i => i.guests.some(g => g.toLowerCase().includes(q)))
    }
    return list
  }, [invitations, filter, sideFilter, search])

  /* ── Acciones ── */
  const handlePreview   = () => setPreview(parseGuestList(bulkText))
  const handleCreateAll = async () => {
    const groups = parseGuestList(bulkText)
    // Pasamos `side` a cada invitación
    await Promise.all(groups.map(g => addInvitation(g, { side: createSide })))
    setBulkText(''); setPreview([]); setTab('list')
  }
  const getUrl     = id => `${BASE_URL}/invite/${id}`
  const getRsvpUrl = id => `${BASE_URL}/rsvp/${id}`
  const handleCopy = (id) => {
    navigator.clipboard.writeText(getUrl(id))
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }
  const formatGuestNames = (guests) => {
    if (guests.length === 0) return ''
    if (guests.length === 1) return guests[0]
    if (guests.length === 2) return guests.join(' y ')
    return `${guests.slice(0, -1).join(', ')} y ${guests[guests.length - 1]}`
  }
  const handleWhatsApp = (inv) => {
    const names = formatGuestNames(inv.guests)
    const esPlural = inv.guests.length > 1
    const msg = `Hola ${names} 💕\n\nQueremos contarte queee... ¡NOS CASAMOS! 🎉💍\n\nEl 5 de septiembre será un día muy especial para nosotros y queremos ${esPlural ? 'compartirlo con ustedes' : 'compartirlo contigo'} 🥹🤍\n\nMira tu invitación aquí 👇\n${getUrl(inv.id)}\n\nY cuéntanos si ${esPlural ? 'pueden acompañarnos' : 'puedes acompañarnos'}, para nosotros significa mucho saber 💕\n\n${getRsvpUrl(inv.id)}\n\n¡Con todo nuestro cariño!\n\nAle & Ever 🤍✨`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`)
  }
  const handleReminder = (inv) => {
    const names = inv.guests.join(' y ')
    const msg = `💌 Hola ${names} 💖\n\n¿Nos confirmas si podrás acompañarnos? 🥹✨\n\nNos haría muy felices contar contigo 💕\n\nConfirma aquí:\n${getRsvpUrl(inv.id)}\n\n¡Te esperamos! 💃`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`)
  }
  const handleDelete = (id) => { deleteInvitation(id); setShowConfirm(null) }

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #1a0c09 0%, #120807 50%, #0f0604 100%)" }}>

      <FloatingParticles count={16} color="#c9a97a" />

      {/* Halo de fondo */}
      <motion.div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(201,169,122,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 8, repeat: Infinity }} />

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-40 border-b" style={{ background: "rgba(18,8,7,0.85)", backdropFilter: "blur(16px)", borderColor: "rgba(201,169,122,0.12)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <Label>Panel de administración</Label>
            <h1 className="font-serif text-lg sm:text-xl truncate" style={{ color: "#c9a97a", fontStyle: "italic" }}>
              {cfg.bride} & {cfg.groom}
              <span className="font-sans not-italic text-xs sm:text-sm ml-2 sm:ml-3" style={{ color: "rgba(201,169,122,0.4)" }}>
                · {cfg.dateDisplay}
              </span>
            </h1>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <p className="font-serif text-2xl sm:text-3xl" style={{ color: "#c9a97a" }}>{stats.guests}</p>
            <p className="text-[9px] tracking-[3px] uppercase" style={{ color: "rgba(201,169,122,0.35)" }}>invitados totales</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-20">

        {/* ── TABS ── */}
        <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-10 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1" style={{ scrollbarWidth: "none" }}>
          {[
            { key: 'create', label: '✦ Crear invitaciones' },
            { key: 'list',   label: `✦ Lista (${invitations.length})` },
            { key: 'report', label: `✦ Reportes` },
          ].map(t => (
            <motion.button key={t.key} onClick={() => setTab(t.key)}
              whileTap={{ scale: 0.96 }}
              className="px-5 sm:px-7 py-2.5 rounded-full text-[10px] tracking-[2px] sm:tracking-[3px] uppercase font-bold transition-all flex-shrink-0 whitespace-nowrap"
              style={tab === t.key ? {
                background: "linear-gradient(135deg, #8b3a3a, #c9a97a)",
                color: "#fff8f0",
                boxShadow: "0 4px 20px rgba(139,58,58,0.35)",
              } : {
                border: "1px solid rgba(201,169,122,0.2)",
                color: "rgba(201,169,122,0.5)",
                background: "transparent",
              }}>
              {t.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ════════ TAB CREAR ════════ */}
          {tab === 'create' && (
            <motion.div key="create"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}>

              <div className="grid md:grid-cols-2 gap-10">

                {/* INPUT */}
                <div>
                  <Label>Cargar invitados</Label>
                  <h2 className="font-serif text-3xl mb-2" style={{ color: "#c9a97a", fontStyle: "italic" }}>
                    Nueva lista
                  </h2>
                  <OrnamentalLine />
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,248,240,0.35)" }}>
                    Un nombre por línea. Separa grupos con línea en blanco. Cada grupo genera una invitación independiente.
                  </p>

                  {/* Selector lado */}
                  <div className="mb-5">
                    <SideSelector value={createSide} onChange={setCreateSide} />
                  </div>

                  {/* Formato ejemplo */}
                  <div className="mb-5 p-4 rounded-2xl" style={{ background: "rgba(201,169,122,0.06)", border: "1px solid rgba(201,169,122,0.12)" }}>
                    <p className="text-[9px] tracking-[3px] uppercase mb-2" style={{ color: "rgba(201,169,122,0.5)" }}>Ejemplo</p>
                    <pre className="text-xs leading-relaxed font-mono" style={{ color: "rgba(255,248,240,0.35)" }}>{`María García\nJuan García\n\nCarlos Pérez\nAna Pérez\nLuis Pérez\n\nSofía Ramírez`}</pre>
                  </div>

                  <textarea
                    value={bulkText}
                    onChange={e => setBulkText(e.target.value)}
                    placeholder={"María García\nJuan García\n\nCarlos Pérez\nAna Pérez"}
                    rows={11}
                    className="w-full rounded-2xl p-4 text-sm font-mono resize-none focus:outline-none transition-all"
                    style={{
                      background: "rgba(201,169,122,0.05)",
                      border: "1px solid rgba(201,169,122,0.18)",
                      color: "rgba(255,248,240,0.75)",
                      caretColor: "#c9a97a",
                    }}
                    onFocus={e => { e.target.style.borderColor = "rgba(201,169,122,0.45)" }}
                    onBlur={e => { e.target.style.borderColor = "rgba(201,169,122,0.18)" }}
                  />

                  <div className="flex gap-3 mt-4">
                    <motion.button onClick={handlePreview} whileTap={{ scale: 0.96 }}
                      className="flex-1 py-3 rounded-xl text-[10px] tracking-[3px] uppercase font-bold transition-all"
                      style={{ border: "1px solid rgba(201,169,122,0.3)", color: "#c9a97a", background: "transparent" }}
                      whileHover={{ background: "rgba(201,169,122,0.08)" }}>
                      Vista previa
                    </motion.button>
                    <motion.button onClick={handleCreateAll} disabled={!bulkText.trim()} whileTap={{ scale: 0.96 }}
                      className="flex-1 py-3 rounded-xl text-[10px] tracking-[3px] uppercase font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #8b3a3a, #c9a97a)", color: "#fff8f0" }}
                      whileHover={{ boxShadow: "0 6px 24px rgba(139,58,58,0.4)" }}>
                      Crear todas
                    </motion.button>
                  </div>
                </div>

                {/* PREVIEW */}
                <div>
                  <Label>Resultado</Label>
                  <h2 className="font-serif text-3xl mb-2" style={{ color: "#c9a97a", fontStyle: "italic" }}>
                    Vista previa
                  </h2>
                  <OrnamentalLine />
                  <p className="text-sm mb-5" style={{ color: "rgba(255,248,240,0.3)" }}>
                    {preview.length > 0
                      ? `${preview.length} invitaciones · ${preview.reduce((s, g) => s + g.length, 0)} personas · ${createSide === 'groom' ? '💙 Ever' : '🌸 Alejandra'}`
                      : 'Presiona "Vista previa" para ver los grupos'}
                  </p>
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {preview.map((group, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="rounded-2xl p-4"
                          style={{ border: "1px solid rgba(201,169,122,0.14)", background: "rgba(201,169,122,0.04)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] tracking-[3px] uppercase" style={{ color: "rgba(201,169,122,0.4)" }}>
                              Invitación {i + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <SideBadge side={createSide} />
                              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(201,169,122,0.1)", color: "#c9a97a" }}>
                                {group.length} {group.length === 1 ? 'persona' : 'personas'}
                              </span>
                            </div>
                          </div>
                          {group.map((name, j) => (
                            <p key={j} className="text-sm py-1.5" style={{ color: "rgba(255,248,240,0.65)", borderBottom: "1px solid rgba(201,169,122,0.06)" }}>
                              {name}
                            </p>
                          ))}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════ TAB LISTA ════════ */}
          {tab === 'list' && (
            <motion.div key="list"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}>

              {/* ── STATS PRINCIPALES ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
                {[
                  { label: 'Total invitaciones', value: stats.total,     color: '#c9a97a',  modal: null        },
                  { label: 'Confirmadas',         value: stats.confirmed, color: '#4ade80',  modal: 'confirmed' },
                  { label: 'Pendientes',          value: stats.pending,   color: '#c8886a',  modal: null        },
                  { label: 'Rechazadas',          value: stats.declined,  color: '#f87171',  modal: 'declined'  },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => s.modal && setGuestModal(s.modal)}
                    className="rounded-2xl p-3.5 sm:p-5 text-center transition-all"
                    style={{
                      border: "1px solid rgba(201,169,122,0.1)",
                      background: "rgba(201,169,122,0.04)",
                      cursor: s.modal ? "pointer" : "default",
                    }}
                    whileHover={s.modal ? { borderColor: "rgba(201,169,122,0.28)", background: "rgba(201,169,122,0.08)", scale: 1.02 } : {}}>
                    <p className="font-serif text-3xl sm:text-4xl mb-1" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[8px] sm:text-[9px] tracking-[1px] sm:tracking-[2px] uppercase" style={{ color: "rgba(255,248,240,0.25)" }}>{s.label}</p>
                    {s.modal && (
                      <p className="text-[8px] tracking-[1px] uppercase mt-1" style={{ color: "rgba(201,169,122,0.3)" }}>
                        Ver detalle ✦
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* ── STATS EXTRAS ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-8">
                {[
                  { icon: '👥', label: 'personas confirmadas', value: stats.confirmedGuests, color: '#4ade80' },
                  { icon: '✕',  label: 'personas rechazaron',  value: stats.declinedGuests,  color: '#f87171' },
                  { icon: '👁', label: 'invitaciones abiertas', value: stats.opened,         color: '#c9a97a' },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 + i * 0.07 }}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ border: "1px solid rgba(201,169,122,0.1)", background: "rgba(201,169,122,0.04)" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: "rgba(201,169,122,0.1)", border: "1px solid rgba(201,169,122,0.15)" }}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-serif text-2xl leading-none" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[9px] tracking-[1px] uppercase mt-0.5" style={{ color: "rgba(255,248,240,0.25)" }}>{s.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <OrnamentalLine />

              {/* ── FILTROS ESTADO ── */}
              <div className="flex flex-wrap gap-2 mt-6 mb-3">
                {FILTERS.map(f => {
                  const count = f.key === 'all'
                    ? invitations.length
                    : invitations.filter(i => getStatus(i) === f.key).length
                  const active = filter === f.key
                  return (
                    <motion.button key={f.key} onClick={() => setFilter(f.key)} whileTap={{ scale: 0.94 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[2px] uppercase font-bold transition-all"
                      style={active ? {
                        background: "linear-gradient(135deg, rgba(139,58,58,0.6), rgba(201,169,122,0.3))",
                        border: "1px solid rgba(201,169,122,0.4)",
                        color: "#c9a97a",
                      } : {
                        border: "1px solid rgba(201,169,122,0.12)",
                        color: "rgba(201,169,122,0.35)",
                        background: "transparent",
                      }}>
                      <span style={{ fontFamily: "serif" }}>{f.icon}</span>
                      <span>{f.label}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-[9px]"
                        style={{ background: "rgba(201,169,122,0.1)", color: "rgba(201,169,122,0.6)" }}>
                        {count}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {/* ── FILTRO LADO ── */}
              <div className="mb-5">
                <SideFilter value={sideFilter} onChange={setSideFilter} counts={sideCounts} />
              </div>

              {/* ── BÚSQUEDA ── */}
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "rgba(201,169,122,0.3)" }}>✦</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none transition-all"
                  style={{
                    background: "rgba(201,169,122,0.05)",
                    border: "1px solid rgba(201,169,122,0.12)",
                    color: "rgba(255,248,240,0.7)",
                    caretColor: "#c9a97a",
                  }}
                  onFocus={e => { e.target.style.borderColor = "rgba(201,169,122,0.35)" }}
                  onBlur={e => { e.target.style.borderColor = "rgba(201,169,122,0.12)" }}
                />
                {search && (
                  <button onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-all"
                    style={{ color: "rgba(201,169,122,0.35)" }}>
                    ✕
                  </button>
                )}
              </div>

              {/* ── LISTA ── */}
              {filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-24 rounded-3xl"
                  style={{ border: "1px solid rgba(201,169,122,0.1)", background: "rgba(201,169,122,0.03)" }}>
                  <p className="font-serif text-5xl mb-4" style={{ color: "rgba(201,169,122,0.2)" }}>✦</p>
                  <p className="font-serif text-xl mb-2" style={{ color: "rgba(201,169,122,0.4)", fontStyle: "italic" }}>
                    {search ? 'Sin resultados' : 'Sin invitaciones aquí'}
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,248,240,0.2)" }}>
                    {search ? `No hay invitados con "${search}"` : 'Prueba con otro filtro'}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[9px] tracking-[3px] uppercase mb-4" style={{ color: "rgba(201,169,122,0.35)" }}>
                    {filtered.length} {filtered.length === 1 ? 'invitación' : 'invitaciones'}
                    {search && ` · "${search}"`}
                    {sideFilter === 'groom' && ' · 💙 Ever'}
                    {sideFilter === 'bride' && ' · 🌸 Alejandra'}
                  </p>

                  <AnimatePresence>
                    {filtered.map((inv, i) => (
                      <motion.div key={inv.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="rounded-2xl p-4 transition-all"
                        style={{ border: "1px solid rgba(201,169,122,0.1)", background: "rgba(201,169,122,0.04)" }}
                        whileHover={{ borderColor: "rgba(201,169,122,0.25)", background: "rgba(201,169,122,0.07)" }}>

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">

                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-[10px] px-3 py-0.5 rounded-full"
                                style={{ background: "rgba(201,169,122,0.1)", color: "#c9a97a", border: "1px solid rgba(201,169,122,0.2)" }}>
                                {inv.guests.length} {inv.guests.length === 1 ? 'persona' : 'personas'}
                              </span>

                              {/* Badge de lado */}
                              {inv.side && <SideBadge side={inv.side} />}

                              <RsvpBadge status={getStatus(inv)} opened={inv.opened} />

                              {inv.opened && getStatus(inv) !== 'declined' && (
                                <span className="text-[10px] px-3 py-0.5 rounded-full"
                                  style={{ background: "rgba(139,58,58,0.15)", color: "#f9a8a8", border: "1px solid rgba(139,58,58,0.2)" }}>
                                  👁 Abierta
                                </span>
                              )}

                              {getStatus(inv) === 'confirmed' && (
                                <span className="text-[10px] px-3 py-0.5 rounded-full"
                                  style={{ background: "rgba(74,197,74,0.08)", color: "#4ade80", border: "1px solid rgba(74,197,74,0.2)" }}>
                                  {inv.rsvp?.length || 0} de {inv.guests.length} confirmaron
                                </span>
                              )}

                              {getStatus(inv) === 'declined' && (inv.rsvpDeclined?.length || 0) > 0 && (
                                <span className="text-[10px] px-3 py-0.5 rounded-full"
                                  style={{ background: "rgba(180,30,30,0.1)", color: "#f87171", border: "1px solid rgba(180,30,30,0.2)" }}>
                                  {inv.rsvpDeclined.length} de {inv.guests.length} rechazaron
                                </span>
                              )}
                            </div>

                            {/* Nombres */}
                            <p className="text-sm font-light tracking-wide" style={{ color: "rgba(255,248,240,0.8)" }}>
                              {inv.guests.join(' · ')}
                            </p>

                            {inv.rsvp?.length > 0 && (
                              <p className="text-xs mt-1" style={{ color: "rgba(74,197,74,0.6)" }}>
                                ✓ Confirmaron: {inv.rsvp.join(', ')}
                              </p>
                            )}

                            {inv.rsvpDeclined?.length > 0 && (
                              <p className="text-xs mt-1" style={{ color: "rgba(248,113,113,0.6)" }}>
                                ✕ Rechazaron: {inv.rsvpDeclined.join(', ')}
                              </p>
                            )}

                            <p className="text-xs mt-1 font-mono truncate" style={{ color: "rgba(201,169,122,0.15)" }}>
                              {getUrl(inv.id)}
                            </p>
                          </div>

                          {/* ── ACCIONES ── */}
                          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                            {[
                              { icon: '📲', onClick: () => handleWhatsApp(inv), title: 'WhatsApp', color: 'rgba(74,197,74,0.15)', border: 'rgba(74,197,74,0.2)' },
                              ...(getStatus(inv) === 'pending' ? [{ icon: '🔔', onClick: () => handleReminder(inv), title: 'Recordatorio', color: 'rgba(200,136,106,0.15)', border: 'rgba(200,136,106,0.2)' }] : []),
                              { icon: copied === inv.id ? '✓' : '🔗', onClick: () => handleCopy(inv.id), title: 'Copiar enlace', color: 'rgba(201,169,122,0.1)', border: 'rgba(201,169,122,0.2)' },
                            ].map((btn, bi) => (
                              <motion.button key={bi} onClick={btn.onClick} title={btn.title} whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm sm:text-base transition-all"
                                style={{ background: btn.color, border: `1px solid ${btn.border}` }}
                                whileHover={{ scale: 1.08 }}>
                                {btn.icon}
                              </motion.button>
                            ))}

                            <motion.a href={getUrl(inv.id)} rel="noreferrer" whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm sm:text-base transition-all"
                              style={{ background: "rgba(201,169,122,0.06)", border: "1px solid rgba(201,169,122,0.12)" }}
                              whileHover={{ scale: 1.08 }}>
                              👁
                            </motion.a>

                            <motion.button onClick={() => setShowConfirm(inv.id)} whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm transition-all"
                              style={{ background: "rgba(180,30,30,0.06)", border: "1px solid rgba(180,30,30,0.12)", color: "rgba(248,113,113,0.4)" }}
                              whileHover={{ scale: 1.08, color: "#f87171" }}>
                              ✕
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {/* ════════ TAB REPORTES ════════ */}
          {tab === 'report' && (
            <motion.div key="report"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}>

              <Label>Resumen de asistencia</Label>
              <h2 className="font-serif text-3xl mb-2" style={{ color: "#c9a97a", fontStyle: "italic" }}>
                Reportes
              </h2>
              <OrnamentalLine />
              <p className="text-sm mb-8" style={{ color: "rgba(255,248,240,0.3)" }}>
                Estado individual de cada persona invitada, sin importar el grupo al que pertenezca.
              </p>

              {/* ── STATS PRINCIPALES POR PERSONA ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-8 sm:mb-10">
                {[
                  { label: 'Total invitados',  value: peopleStats.total,     color: '#c9a97a' },
                  { label: 'Confirmados',       value: peopleStats.confirmed, color: '#4ade80' },
                  { label: 'Pendientes',        value: peopleStats.pending,   color: '#c8886a' },
                  { label: 'Rechazados',        value: peopleStats.declined,  color: '#f87171' },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-2xl p-3.5 sm:p-5 text-center"
                    style={{ border: "1px solid rgba(201,169,122,0.1)", background: "rgba(201,169,122,0.04)" }}>
                    <p className="font-serif text-3xl sm:text-4xl mb-1" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[8px] sm:text-[9px] tracking-[1px] sm:tracking-[2px] uppercase" style={{ color: "rgba(255,248,240,0.25)" }}>{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* ── BARRA DE PROGRESO ── */}
              {peopleStats.total > 0 && (
                <div className="mb-8 sm:mb-10">
                  <div className="flex h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(201,169,122,0.08)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(peopleStats.confirmed / peopleStats.total) * 100}%` }}
                      transition={{ duration: 0.8 }} style={{ background: '#4ade80' }} />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(peopleStats.declined / peopleStats.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }} style={{ background: '#f87171' }} />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(peopleStats.pending / peopleStats.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }} style={{ background: '#c8886a' }} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-[9px] tracking-[1px] uppercase" style={{ color: "rgba(255,248,240,0.3)" }}>
                    <span><span style={{ color: '#4ade80' }}>●</span> Confirmados {Math.round((peopleStats.confirmed / peopleStats.total) * 100)}%</span>
                    <span><span style={{ color: '#f87171' }}>●</span> Rechazados {Math.round((peopleStats.declined / peopleStats.total) * 100)}%</span>
                    <span><span style={{ color: '#c8886a' }}>●</span> Pendientes {Math.round((peopleStats.pending / peopleStats.total) * 100)}%</span>
                  </div>
                </div>
              )}

              <OrnamentalLine />

              {/* ── FILTROS ESTADO POR PERSONA ── */}
              <div className="flex flex-wrap gap-2 mt-6 mb-3">
                {PERSON_FILTERS.map(f => {
                  const count = f.key === 'all'
                    ? allPeople.length
                    : allPeople.filter(p => p.status === f.key).length
                  const active = reportFilter === f.key
                  return (
                    <motion.button key={f.key} onClick={() => setReportFilter(f.key)} whileTap={{ scale: 0.94 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[2px] uppercase font-bold transition-all"
                      style={active ? {
                        background: "linear-gradient(135deg, rgba(139,58,58,0.6), rgba(201,169,122,0.3))",
                        border: "1px solid rgba(201,169,122,0.4)",
                        color: "#c9a97a",
                      } : {
                        border: "1px solid rgba(201,169,122,0.12)",
                        color: "rgba(201,169,122,0.35)",
                        background: "transparent",
                      }}>
                      <span style={{ fontFamily: "serif" }}>{f.icon}</span>
                      <span>{f.label}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-[9px]"
                        style={{ background: "rgba(201,169,122,0.1)", color: "rgba(201,169,122,0.6)" }}>
                        {count}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {/* ── FILTRO LADO (reportes) ── */}
              <div className="mb-5">
                <SideFilter value={reportSideFilter} onChange={setReportSideFilter} counts={reportSideCounts} />
              </div>

              {/* ── BÚSQUEDA POR PERSONA ── */}
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "rgba(201,169,122,0.3)" }}>✦</span>
                <input
                  type="text"
                  value={reportSearch}
                  onChange={e => setReportSearch(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none transition-all"
                  style={{
                    background: "rgba(201,169,122,0.05)",
                    border: "1px solid rgba(201,169,122,0.12)",
                    color: "rgba(255,248,240,0.7)",
                    caretColor: "#c9a97a",
                  }}
                  onFocus={e => { e.target.style.borderColor = "rgba(201,169,122,0.35)" }}
                  onBlur={e => { e.target.style.borderColor = "rgba(201,169,122,0.12)" }}
                />
                {reportSearch && (
                  <button onClick={() => setReportSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-all"
                    style={{ color: "rgba(201,169,122,0.35)" }}>
                    ✕
                  </button>
                )}
              </div>

              {/* ── LISTA DETALLADA DE PERSONAS ── */}
              {filteredPeople.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-24 rounded-3xl"
                  style={{ border: "1px solid rgba(201,169,122,0.1)", background: "rgba(201,169,122,0.03)" }}>
                  <p className="font-serif text-5xl mb-4" style={{ color: "rgba(201,169,122,0.2)" }}>✦</p>
                  <p className="font-serif text-xl mb-2" style={{ color: "rgba(201,169,122,0.4)", fontStyle: "italic" }}>
                    {reportSearch ? 'Sin resultados' : 'Sin invitados aquí'}
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,248,240,0.2)" }}>
                    {reportSearch ? `No hay invitados con "${reportSearch}"` : 'Prueba con otro filtro'}
                  </p>
                </motion.div>
              ) : (
                <div>
                  <p className="text-[9px] tracking-[3px] uppercase mb-4" style={{ color: "rgba(201,169,122,0.35)" }}>
                    {filteredPeople.length} {filteredPeople.length === 1 ? 'invitado' : 'invitados'}
                    {reportSearch && ` · "${reportSearch}"`}
                    {reportSideFilter === 'groom' && ' · 💙 Ever'}
                    {reportSideFilter === 'bride' && ' · 🌸 Alejandra'}
                  </p>

                  <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(201,169,122,0.1)" }}>
                    <AnimatePresence>
                      {filteredPeople.map((p, i) => (
                        <motion.div key={`${p.invitationId}-${p.name}`}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.02 }}
                          className="flex items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-5 py-3 sm:py-3.5"
                          style={{
                            background: i % 2 === 0 ? "rgba(201,169,122,0.035)" : "transparent",
                            borderBottom: i < filteredPeople.length - 1 ? "1px solid rgba(201,169,122,0.06)" : "none",
                          }}>
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <span className="text-sm font-light truncate" style={{ color: "rgba(255,248,240,0.85)" }}>
                              {p.name}
                            </span>
                            {p.groupSize > 1 && (
                              <span className="hidden sm:inline-block text-[9px] px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ background: "rgba(201,169,122,0.08)", color: "rgba(201,169,122,0.45)" }}>
                                grupo de {p.groupSize}
                              </span>
                            )}
                            {p.side && <SideBadge side={p.side} />}
                            {p.opened && (
                              <span className="text-[10px] flex-shrink-0" title="Invitación abierta" style={{ color: "rgba(201,169,122,0.3)" }}>
                                👁
                              </span>
                            )}
                          </div>
                          <RsvpBadge status={p.status} opened={false} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MODAL DETALLE INVITADOS (confirmados / rechazados) ── */}
      <AnimatePresence>
        {guestModal && (() => {
          const isConfirmed = guestModal === 'confirmed'
          const color       = isConfirmed ? '#4ade80' : '#f87171'
          const borderColor = isConfirmed ? 'rgba(74,197,74,0.2)' : 'rgba(180,30,30,0.2)'
          const bgRow       = isConfirmed ? 'rgba(74,197,74,0.07)' : 'rgba(180,30,30,0.07)'
          const icon        = isConfirmed ? '✓' : '✕'
          const title       = isConfirmed ? 'Confirmaron asistencia' : 'Rechazaron asistencia'
          const emoji       = isConfirmed ? '💚' : '💔'

          const rows = invitations
            .map(inv => ({
              inv,
              names: isConfirmed ? (inv.rsvp || []) : (inv.rsvpDeclined || []),
              others: isConfirmed ? (inv.rsvpDeclined || []) : (inv.rsvp || []),
            }))
            .filter(r => r.names.length > 0)

          const totalPersonas = rows.reduce((s, r) => s + r.names.length, 0)

          return (
            <motion.div
              className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
              style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(14px)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setGuestModal(null)}>

              <motion.div
                className="w-full max-w-md rounded-t-3xl md:rounded-3xl overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, #1c0a08, #120605)",
                  border: `1px solid ${borderColor}`,
                  boxShadow: "0 40px 80px rgba(0,0,0,0.65)",
                  maxHeight: "80vh",
                  display: "flex",
                  flexDirection: "column",
                }}
                initial={{ y: 60, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60, scale: 0.96 }}
                transition={{ type: "spring", damping: 24, stiffness: 300 }}
                onClick={e => e.stopPropagation()}>

                <div className="p-6 pb-4 text-center flex-shrink-0" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <p className="text-3xl mb-2">{emoji}</p>
                  <p className="text-[9px] tracking-[4px] uppercase mb-1" style={{ color: "rgba(201,169,122,0.4)" }}>— Detalle —</p>
                  <h3 className="font-serif text-2xl mb-1" style={{ color, fontStyle: "italic" }}>{title}</h3>
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}44)` }} />
                    <span className="text-[10px]" style={{ color }}>{totalPersonas} {totalPersonas === 1 ? 'persona' : 'personas'}</span>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${color}44)` }} />
                  </div>
                </div>

                <div className="overflow-y-auto p-4 space-y-3 flex-1">
                  {rows.length === 0 ? (
                    <p className="text-center py-10 font-serif text-lg" style={{ color: "rgba(201,169,122,0.35)", fontStyle: "italic" }}>
                      Sin respuestas aún
                    </p>
                  ) : rows.map(({ inv, names, others }, i) => (
                    <motion.div key={inv.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl p-4"
                      style={{ border: `1px solid ${borderColor}`, background: bgRow }}>

                      {inv.side && (
                        <div className="mb-2">
                          <SideBadge side={inv.side} />
                        </div>
                      )}

                      <div className="space-y-1.5 mb-2">
                        {names.map((name, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <span className="text-[10px] font-bold w-4 text-center" style={{ color }}>{icon}</span>
                            <span className="text-sm font-medium" style={{ color: "rgba(255,248,240,0.88)" }}>{name}</span>
                          </div>
                        ))}
                      </div>

                      {others.length > 0 && (
                        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(201,169,122,0.08)" }}>
                          <p className="text-[8px] tracking-[2px] uppercase mb-1" style={{ color: "rgba(201,169,122,0.3)" }}>
                            {isConfirmed ? 'Rechazaron del mismo grupo' : 'Confirmaron del mismo grupo'}
                          </p>
                          {others.map((name, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <span className="text-[10px] w-4 text-center" style={{ color: isConfirmed ? '#f87171' : '#4ade80' }}>
                                {isConfirmed ? '✕' : '✓'}
                              </span>
                              <span className="text-xs" style={{ color: "rgba(255,248,240,0.45)" }}>{name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(201,169,122,0.08)" }}>
                  <motion.button onClick={() => setGuestModal(null)} whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-xl text-[10px] tracking-[3px] uppercase font-bold transition-all"
                    style={{ border: "1px solid rgba(201,169,122,0.2)", color: "rgba(201,169,122,0.6)", background: "transparent" }}
                    whileHover={{ background: "rgba(201,169,122,0.06)" }}>
                    Cerrar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* ── MODAL ELIMINAR ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-sm text-center rounded-3xl p-8"
              style={{ background: "linear-gradient(160deg, #1c0a08, #120605)", border: "1px solid rgba(180,30,30,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}
              initial={{ scale: 0.88, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 24 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}>
              <motion.p className="text-4xl mb-4"
                animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
                🗑
              </motion.p>
              <p className="text-[9px] tracking-[4px] uppercase mb-1" style={{ color: "rgba(201,169,122,0.4)" }}>— Confirmar acción —</p>
              <h3 className="font-serif text-2xl mb-2" style={{ color: "#c9a97a", fontStyle: "italic" }}>¿Eliminar invitación?</h3>
              <OrnamentalLine />
              <p className="text-sm mb-8 leading-relaxed" style={{ color: "rgba(255,248,240,0.35)" }}>
                Esta acción no se puede deshacer.<br />El enlace dejará de funcionar.
              </p>
              <div className="flex gap-3">
                <motion.button onClick={() => setShowConfirm(null)} whileTap={{ scale: 0.96 }}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ border: "1px solid rgba(201,169,122,0.15)", color: "rgba(255,248,240,0.4)", background: "transparent" }}
                  whileHover={{ background: "rgba(201,169,122,0.06)" }}>
                  Cancelar
                </motion.button>
                <motion.button onClick={() => handleDelete(showConfirm)} whileTap={{ scale: 0.96 }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #7f1d1d, #dc2626)" }}
                  whileHover={{ boxShadow: "0 6px 20px rgba(220,38,38,0.35)" }}>
                  Eliminar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}