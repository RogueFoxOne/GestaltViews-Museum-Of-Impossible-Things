// frontend/components/ExhibitModal.tsx
'use client'

import { useState } from 'react'
import { getDemoComponent } from './demoRegistry' // <-- IMPORT the registry function

interface Exhibit {
  id: string
  title: string
  subtitle: string
  description: string
  longDescription: string
  features: string[]
  technologies: string[]
  plkResonance: number
  vibeAlignment: number
  category: string
  curatorNote: string
  githubUrl?: string
  demoUrl?: string
}

interface ExhibitModalProps {
  exhibit: Exhibit | null
  onClose: () => void
}

export default function ExhibitModal({ exhibit, onClose }: ExhibitModalProps) {
  const [viewingDemo, setViewingDemo] = useState(false)

  if (!exhibit) return null

  // --- REPLACED LOGIC ---
  // This is now much cleaner. It gets the component from our registry.
  const DemoComponent = getDemoComponent(exhibit);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-900/95 via-black/95 to-teal-900/95 backdrop-blur-sm p-6 border-b border-purple-500/30 z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-widest text-purple-400 mb-2">
                {exhibit.category}
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
                {exhibit.title}
              </h2>
              <p className="text-lg text-gray-300">{exhibit.subtitle}</p>
            </div>
            
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors ml-4 text-3xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-sm text-gray-300">
                PLK Resonance: <span className="text-purple-400 font-bold">{exhibit.plkResonance}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse"></div>
              <span className="text-sm text-gray-300">
                Vibe Alignment: <span className="text-teal-400 font-bold">{exhibit.vibeAlignment}%</span>
              </span>
            </div>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setViewingDemo(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !viewingDemo
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              📖 Exhibit Details
            </button>
            {/* Only show the Demo button if a component exists for it */}
            {DemoComponent && (
              <button
                onClick={() => setViewingDemo(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewingDemo
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                🎮 Live Demo
              </button>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!viewingDemo ? (
            /* Exhibit Details View */
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">About This Exhibit</h3>
                <p className="text-gray-300 leading-relaxed">{exhibit.longDescription}</p>
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-teal-900/30 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-sm uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-2">
                  <span>🎭</span> Curator&apos;s Note
                </h4>
                <p className="text-gray-300 italic leading-relaxed">{exhibit.curatorNote}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {exhibit.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-teal-400 mt-1">✦</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {exhibit.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-purple-400 rounded-full text-sm border border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Only show launch button if a demo exists */}
              {DemoComponent && (
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    onClick={() => setViewingDemo(true)}
                    className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg font-medium hover:from-teal-500 hover:to-teal-600 transition-all shadow-lg shadow-teal-500/30"
                  >
                    🎮 Launch Live Demo
                  </button>
                  {exhibit.githubUrl && (
                    <a href={exhibit.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-500 hover:to-purple-600 transition-all text-center shadow-lg shadow-purple-500/30">
                      💻 View Source Code
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Live Demo View */
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-900/30 to-purple-900/30 border border-teal-500/30 rounded-xl p-4">
                <h4 className="text-sm uppercase tracking-wider text-teal-400 mb-2 flex items-center gap-2">
                  <span>🎮</span> Interactive Demo
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This is a live demonstration of {exhibit.title}. Try it out below!
                </p>
              </div>

              {/* --- DYNAMIC COMPONENT RENDERING --- */}
              <div className="bg-gray-900/50 rounded-xl p-0 md:p-6 border border-gray-700 overflow-hidden">
                {DemoComponent ? <DemoComponent /> : (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-lg mb-2">🎮 Demo Coming Soon</p>
                    <p className="text-sm">This exhibit is being prepared for interactive exploration.</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setViewingDemo(false)}
                className="w-full px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all border border-gray-700"
              >
                ← Back to Exhibit Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
