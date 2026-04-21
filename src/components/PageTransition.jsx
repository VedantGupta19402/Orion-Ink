import React from 'react'
import { motion } from 'motion/react'

const PageTransition = () => {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[99999] bg-[#06050a]"
        initial={{ y: "100%" }}
        animate={{ y: "100%" }}
        exit={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: 'none' }}
      />
      <motion.div
        className="fixed inset-0 z-[99999] bg-[#06050a]"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: 'none' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <span 
              className="text-[#d4a96a] text-sm tracking-[0.3em] uppercase opacity-50"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              ORION BLACK
            </span>
        </div>
      </motion.div>
    </>
  )
}

export default PageTransition
