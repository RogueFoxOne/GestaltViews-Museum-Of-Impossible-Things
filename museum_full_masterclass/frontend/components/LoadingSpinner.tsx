// /components/LoadingSpinner.tsx
'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Code, Sparkles } from 'lucide-react'

export const LoadingSpinner: React.FC = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center border border-white/20"
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-cyan-400/20 rounded-full"
            >
              <Brain className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-purple-400/20 rounded-full"
            >
              <Code className="w-8 h-8 text-purple-400" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-yellow-400/20 rounded-full"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg font-semibold text-white mb-2">Processing...</p>
            <p className="text-sm text-gray-400">Your AI symbiote is thinking</p>
          </motion.div>
          
          {/* Animated dots */}
          <motion.div className="flex justify-center space-x-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 bg-cyan-400 rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
