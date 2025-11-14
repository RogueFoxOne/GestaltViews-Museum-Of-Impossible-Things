'use client'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeVariant = 'soft' | 'bright' | 'high-contrast'

interface ThemeContextValue {
  variant: ThemeVariant
  setVariant: (v: ThemeVariant) => void
  blendGradient: (weights?: Record<string, number>) => string
  reduceMotion: boolean
  toggleReduceMotion: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function AuroraThemeProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<ThemeVariant>('soft')
  const [reduceMotion, setReduceMotion] = useState<boolean>(false)

  useEffect(() => {
    try {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setReduceMotion(prefersReduced)
    } catch (e) {}
  }, [])

  function toggleReduceMotion() {
    setReduceMotion((s) => !s)
  }

  const blendGradient = useMemo(() => {
    return (weights: Record<string, number> = { purple: 0.4, teal: 0.4, pink: 0.2 }) => {
      const stops = Object.entries(weights).map(([k, w]) => {
        const c = k === 'purple' ? '#BC6DFF' : k === 'teal' ? '#06B6D4' : '#F345B5'
        return `${c} ${Math.round(w * 100)}%`
      })
      return `linear-gradient(135deg, ${stops.join(', ')})`
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ variant, setVariant, blendGradient, reduceMotion, toggleReduceMotion }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useAuroraTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useAuroraTheme must be used within AuroraThemeProvider')
  return ctx
}
