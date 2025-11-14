// NEW FILE: Enhanced accessibility features
'use client'

import { useEffect, useState } from 'react'

export function AccessibilityEnhancements() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    // Check user preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(contrastQuery.matches)

    // Listen for changes
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    const handleContrastChange = (e: MediaQueryListEvent) => setHighContrast(e.matches)
    
    mediaQuery.addEventListener('change', handleMotionChange)
    contrastQuery.addEventListener('change', handleContrastChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [])

  return (
    <>
      {/* Screen reader announcements */}
      <div id="live-region" className="sr-only" aria-live="polite" aria-atomic="true"></div>
      
      {/* Skip navigation for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-400 focus:text-slate-900 focus:rounded-md"
      >
        Skip to main content
      </a>
      
      {/* Accessibility controls */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        <button
          onClick={() => document.body.classList.toggle('reduce-motion')}
          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-full border border-emerald-400/50 text-emerald-400 text-sm"
          aria-label="Toggle reduced motion"
        >
          🎭
        </button>
        
        <button
          onClick={() => document.body.classList.toggle('high-contrast')}
          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-full border border-emerald-400/50 text-emerald-400 text-sm"
          aria-label="Toggle high contrast"
        >
          🔆
        </button>
      </div>

      <style jsx>{`
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .high-contrast {
          filter: contrast(150%);
        }
      `}</style>
    </>
  )
}
