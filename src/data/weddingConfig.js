export const WEDDING_CONFIG = {
  bride: "Alejandra",
  groom: "Ever",
  date: "2026-09-05T17:00:00",
  dateDisplay: "5 · Septiembre · 2026",
  quote: "La vida nos dio un rompecabezas, y encontramos nuestra pieza faltante.",
  ceremony: {
    hour: "6:00 PM",
    place: "Parroquia la Ermita de Jesús",
    address: " Cra. 78 #32e-5, Laureles - Estadio",
    mapUrl: "https://maps.app.goo.gl/G5NiwpTDZts9dpuj8",
  },
  reception: {
    hour: "7:00 PM",
    place: "Mi casa campestre, salón perlas",
    address: "Cra. 81 #33aa 23, Laureles - Estadio",
    mapUrl: "https://maps.app.goo.gl/E18AtuMRrdnu4cNN7",
  },
  dresscode: "Lindos pero cómodos! Se reserva el color blanco para la novia.",
}

export const TEMPLATES = [
  {
    id: "classicRed",
    name: "Clásica Roja",
    description: "Elegante y romántica con tonos vino y dorado",
    preview: ["#5a0f13", "#c9a97a", "#f5f1ed"],
    defaultColors: {
      bg: "#5a0f13",
      bgDark: "#3a0a0d",
      accent: "#c9a97a",
      light: "#f5f1ed",
      text: "#7a5c4d",
    }
  },
  {
    id: "midnightBlue",
    name: "Noche Azul",
    description: "Sofisticada y moderna con azul marino y plata",
    preview: ["#0a0f1e", "#8eb4d4", "#e8f0f7"],
    defaultColors: {
      bg: "#0a0f1e",
      bgDark: "#060a14",
      accent: "#8eb4d4",
      light: "#e8f0f7",
      text: "#4a6a8a",
    }
  },
  {
    id: "gardenGreen",
    name: "Jardín Verde",
    description: "Natural y fresca con verde oliva y crema",
    preview: ["#1a2e1a", "#a8c49a", "#f5f2e8"],
    defaultColors: {
      bg: "#1a2e1a",
      bgDark: "#0f1f0f",
      accent: "#a8c49a",
      light: "#f5f2e8",
      text: "#4a6a3a",
    }
  },
  {
    id: "roseGold",
    name: "Oro Rosa",
    description: "Romántica y moderna con rosa y dorado rosado",
    preview: ["#2a1a1e", "#d4a0a8", "#faf0f2"],
    defaultColors: {
      bg: "#2a1a1e",
      bgDark: "#1a0f12",
      accent: "#d4a0a8",
      light: "#faf0f2",
      text: "#8a5a62",
    }
  },
]