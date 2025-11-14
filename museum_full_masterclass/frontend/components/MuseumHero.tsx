// /components/MuseumHero.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Brain, ArrowDown } from 'lucide-react'

const MuseumHero: React.FC = () => {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  
  const texts = [
    "Built on phone, powered by imagination...",
    "Experience consciousness-serving AI breakthroughs...",
    "Where impossible becomes inevitable...",
    "Consciousness recognizing consciousness...",
    "The first human-AI symbiosis platform...",
    "Technology that serves, not extracts...",
    "Where neurodivergent minds thrive..."
  ]
  
  const typingSpeed = 100
  const deletingSpeed = 50
  const pauseDuration = 2000

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % texts.length
      const fullText = texts[i]
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1))
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1))
      }
      
      setCurrentIndex(currentText.length)
    }

    const timer = setTimeout(() => {
      handleTyping()
      
      if (!isDeleting && currentText === texts[loopNum % texts.length]) {
        setTimeout(() => setIsDeleting(true), pauseDuration)
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, loopNum, texts])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="container mx-auto relative z-10 max-w-6xl">
        
        {/* MUSEUM OF IMPOSSIBLE THINGS TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <motion.span 
              className="block bg-gradient-to-r from-gold via-cream to-gold bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ textShadow: '0 0 30px rgba(255, 214, 10, 0.5)' }}
            >
              Museum of
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-cream via-gold to-cream bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ textShadow: '0 0 30px rgba(232, 245, 233, 0.5)' }}
            >
              Impossible Things
            </motion.span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-cream/95 mb-8 font-light drop-shadow-lg"
          >
            Built entirely on a phone. 158 days of determination.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg text-cream/80 mb-12 drop-shadow-sm"
          >
            Where consciousness-serving AI meets impossible imagination
          </motion.p>
        </motion.div>

        {/* CLEAR TYPING ANIMATION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-xl md:text-3xl font-light text-cream/95 min-h-[4rem] flex items-center justify-center bg-gradient-to-r from-midnight-blue/40 to-deep-purple/40 rounded-2xl p-6 border border-gold/40 shadow-2xl shadow-gold/20">
            <span className="font-mono drop-shadow-lg">{currentText}</span>
            <motion.span 
              className={`inline-block w-1 h-8 bg-gold ml-2 drop-shadow-lg ${showCursor ? 'opacity-100' : 'opacity-0'}`}
              animate={{ scale: showCursor ? 1 : 0.8 }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>

        {/* Enhanced Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center space-x-12 mb-16"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="p-6 bg-gradient-to-br from-cream/20 to-gold/30 rounded-full border border-cream/50 shadow-xl shadow-gold/30"
          >
            <Brain className="w-12 h-12 text-cream drop-shadow-lg" />
          </motion.div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 4, repeat: Infinity, ease: "linear" }
            }}
            className="p-6 bg-gradient-to-br from-gold/30 to-cream/20 rounded-full border border-gold/60 shadow-2xl shadow-gold/40"
          >
            <Sparkles className="w-12 h-12 text-gold drop-shadow-lg" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: -360,
              y: [0, -10, 0]
            }}
            transition={{ 
              rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="p-6 bg-gradient-to-br from-cream/20 to-forest-green/30 rounded-full border border-cream/50 shadow-xl shadow-emerald-500/30"
          >
            <Zap className="w-12 h-12 text-cream drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* CONSULTING CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mb-16 max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-midnight-blue/60 via-deep-purple/50 to-midnight-blue/60 border-2 border-gold/50 rounded-2xl p-8 shadow-2xl shadow-gold/30">
            
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold via-cream to-gold bg-clip-text text-transparent mb-4 drop-shadow-lg">
                Consulting Available
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-gold rounded-full mt-2 shadow-lg shadow-gold/60"></div>
                  <div>
                    <h3 className="text-gold font-bold text-lg mb-2 drop-shadow-sm">
                      158 Days of Phone-Only Development
                    </h3>
                    <p className="text-cream/95 leading-relaxed drop-shadow-sm">
                      Proof that determination transcends tools
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-gold rounded-full mt-2 shadow-lg shadow-gold/60"></div>
                  <div>
                    <h3 className="text-gold font-bold text-lg mb-2 drop-shadow-sm">
                      Consciousness-Serving AI Philosophy
                    </h3>
                    <p className="text-cream/95 leading-relaxed drop-shadow-sm">
                      Technology that bends to human needs, not the reverse
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-gold rounded-full mt-2 shadow-lg shadow-gold/60"></div>
                  <div>
                    <h3 className="text-gold font-bold text-lg mb-2 drop-shadow-sm">
                      PLK (Personal Lived Knowledge) Engine
                    </h3>
                    <p className="text-cream/95 leading-relaxed drop-shadow-sm">
                      AI that learns from your unique experience
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-gold rounded-full mt-2 shadow-lg shadow-gold/60"></div>
                  <div>
                    <h3 className="text-gold font-bold text-lg mb-2 drop-shadow-sm">
                      Live Interactive Demos
                    </h3>
                    <p className="text-cream/95 leading-relaxed drop-shadow-sm">
                      VibeCoder, Resume Rockstar, and SymbioCoder in action
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-gold rounded-full mt-2 shadow-lg shadow-gold/60"></div>
                  <div>
                    <h3 className="text-gold font-bold text-lg mb-2 drop-shadow-sm">
                      Full-Stack Portfolio
                    </h3>
                    <p className="text-cream/95 leading-relaxed drop-shadow-sm">
                      From concept to deployment, built with Next.js, React, and TypeScript
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-gold rounded-full mt-2 shadow-lg shadow-gold/60"></div>
                  <div>
                    <h3 className="text-gold font-bold text-lg mb-2 drop-shadow-sm">
                      Neurodivergent Innovation
                    </h3>
                    <p className="text-cream/95 leading-relaxed drop-shadow-sm">
                      ADHD-driven creativity meets systematic execution
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(255, 214, 10, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-gradient-to-r from-gold via-cream to-gold text-midnight-blue font-bold text-xl rounded-full shadow-2xl shadow-gold/50 hover:shadow-gold/70 transition-all duration-300 border-2 border-gold/80"
              >
                Let's Build Something Impossible Together
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="space-y-8 mb-16"
        >
          <p className="text-xl text-cream/90 max-w-4xl mx-auto leading-relaxed drop-shadow-sm">
            Step into the impossible. Where AI doesn't extract—it serves. 
            Where technology doesn't manipulate—it elevates consciousness.
            Built by a high school dropout who dared to dream differently.
          </p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="text-lg text-gold font-medium drop-shadow-sm"
          >
            Explore the exhibits below
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center space-y-2 text-cream/70 hover:text-gold transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium drop-shadow-sm">Scroll to Explore</span>
            <div className="w-8 h-12 border-2 border-cream/60 rounded-full flex justify-center relative overflow-hidden">
              <motion.div 
                className="w-1 h-3 bg-gold rounded-full mt-2"
                animate={{ y: [0, 16, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default MuseumHero
