'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2 } from 'lucide-react'

export function WelcomeExperience() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // On mount, check if we should show the welcome screen
  useEffect(() => {
    if (sessionStorage.getItem('gestaltview_welcomed')) {
      setShowWelcome(false)
    } else {
      setShowWelcome(true)
    }
  }, [])

  const handleEnter = () => {
    // Play the audio
    audioRef.current?.play().catch(error => console.error("Audio play failed:", error));
    
    // Set the flag in session storage
    sessionStorage.setItem('gestaltview_welcomed', 'true');

    // Start the fade out animation
    setIsFadingOut(true)

    // After the animation, remove the component from the DOM
    setTimeout(() => {
      setShowWelcome(false)
    }, 1500); // Match this duration with the exit animation
  }

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isFadingOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center"
        >
          <audio ref={audioRef} src="/audio/welcome-to-gestaltview.mp3" preload="auto" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <button
              onClick={handleEnter}
              className="group relative w-48 h-48 rounded-full border-2 border-teal-500/50 bg-slate-900/50 flex flex-col items-center justify-center text-teal-300 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-2xl font-bold"
              >
                Enter
              </motion.div>
              <div className="absolute bottom-10 text-xs text-slate-400 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                <Volume2 size={14} />
                Sound On
              </div>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
