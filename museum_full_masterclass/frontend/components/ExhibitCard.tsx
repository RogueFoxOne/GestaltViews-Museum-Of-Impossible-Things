// /components/ExhibitCard.tsx
// ✅ FIXED & ENHANCED VERSION
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface ExhibitCardProps {
  exhibit: {
    id: string
    title: string
    subtitle: string
    description: string
    technologies: string[]
    plkResonance: number
    vibeAlignment: number
    category: string
    longDescription?: string // Optional for featured card
  }
  onClick?: () => void
  isFeatured?: boolean // <-- ✅ FIX: Added the missing prop
}

const ExhibitCard: React.FC<ExhibitCardProps> = ({ exhibit, onClick, isFeatured = false }) => {
  // Render a special, more detailed card for featured exhibits
  if (isFeatured) {
    return (
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.01 }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-900/50 p-8 shadow-2xl shadow-purple-500/10 border-2 border-emerald-400/30 transition-all duration-300 hover:border-emerald-400/60"
      >
        <div className="md:flex md:gap-8">
          <div className="md:w-2/3">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-400/30 to-purple-400/20 text-emerald-300 border-emerald-400/40">
              ✨ Featured Exhibit
            </Badge>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              {exhibit.title}
            </h3>
            <p className="text-lg text-cream/80 italic mb-4">{exhibit.subtitle}</p>
            <p className="text-slate-300 leading-relaxed">
              {exhibit.longDescription || exhibit.description}
            </p>
          </div>
          <div className="mt-6 md:mt-0 md:w-1/3 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-slate-300 mb-3">Key Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {exhibit.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="bg-slate-700/50 text-slate-300">{tech}</Badge>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <div className="text-white font-bold group-hover:translate-x-2 transition-transform flex items-center text-lg">
                <span>Explore the Codex</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render the standard card for all other exhibits
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      className="h-full bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
            {exhibit.category}
          </span>
          <Badge variant="outline" className="text-xs border-slate-600">
            PLK {exhibit.plkResonance}%
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold text-slate-100 mb-1">
          {exhibit.title}
        </h3>
        
        <p className="text-sm text-slate-400 italic mb-4">
          {exhibit.subtitle}
        </p>
        
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {exhibit.description}
        </p>
      </div>

      <div className="flex-shrink-0">
        <div className="flex flex-wrap gap-2 mt-4">
          {exhibit.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="bg-slate-800 text-slate-400">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ExhibitCard
