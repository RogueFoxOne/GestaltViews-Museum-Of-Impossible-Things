// ENHANCED: Consciousness-serving error boundaries
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Museum Error Boundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-emerald-900 flex items-center justify-center p-6"
        >
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-6">🔮</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Something Impossible Happened
            </h1>
            <p className="text-gray-300 mb-6">
              Even in the Museum of Impossible Things, some errors are too impossible to display.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-purple-400 text-slate-900 font-bold rounded-full hover:scale-105 transition-transform"
            >
              Return to the Possible
            </button>
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}
