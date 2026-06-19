import { motion } from 'framer-motion'

export default function FadeSection({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}

      initial={{
        opacity: 0,
        y: 40,
        filter: 'blur(10px)'
      }}

      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)'
      }}

      viewport={{
        once: true,
        margin: '-100px'
      }}

      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 1, 0.5, 1]
      }}
    >
      {children}
    </motion.div>
  )
}