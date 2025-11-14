// app/components/exhibits/InvocationAudioPlayer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface TextSegment {
  text: string
  startTime: number
  endTime: number
}

interface InvocationAudioPlayerProps {
  audioUrl: string
  title: string
  segments: TextSegment[]
}

export function InvocationAudioPlayer({ 
  audioUrl, 
  title, 
  segments 
}: InvocationAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      const time = audio.currentTime
      setCurrentTime(time)
      
      const activeIndex = segments.findIndex(
        seg => time >= seg.startTime && time < seg.endTime
      )
      if (activeIndex !== activeSegmentIndex) {
        setActiveSegmentIndex(activeIndex !== -1 ? activeIndex : null)
      }
    }

    const setAudioDuration = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', setAudioDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', setAudioDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [segments, activeSegmentIndex])

  // Auto-scroll effect
  useEffect(() => {
    if (activeSegmentIndex !== null && textContainerRef.current) {
      const activeElement = document.getElementById(`segment-${activeSegmentIndex}`)
      activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeSegmentIndex]);


  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="p-8 bg-gradient-to-br from-[--color-midnight-blue]/80 to-[--color-forest-green]/80 rounded-2xl backdrop-blur-lg border border-gold/20 shadow-2xl mb-8">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gold mb-2">{title}</h3>
          <p className="text-cream/70 text-sm">Seven voices. One sacred convergence.</p>
        </div>

        <div className="flex justify-center mb-6">
          <motion.button
            onClick={togglePlay}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-24 h-24 rounded-full flex items-center justify-center bg-gold hover:bg-amber-400 disabled:bg-gray-500 transition-all duration-300 shadow-2xl hover:shadow-gold/70 disabled:opacity-50 border-4 border-cream/20"
          >
            {isLoading ? ( <span className="text-lg font-bold text-midnight-blue">...</span> ) : 
             isPlaying ? ( <svg className="w-10 h-10 text-midnight-blue" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg> ) : 
             ( <svg className="w-10 h-10 text-midnight-blue ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> )}
          </motion.button>
        </div>

        <div className="mb-6">
          <div className="relative h-3 bg-midnight-blue/50 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-gold to-cream" style={{ width: `${progress}%` }} />
            <input type="range" min={0} max={duration || 0} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
          </div>
          <div className="flex justify-between mt-2 text-cream/70 text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div ref={textContainerRef} className="max-h-[600px] overflow-y-auto bg-midnight-blue/30 rounded-2xl p-8 backdrop-blur border border-gold/10">
        {segments.map((segment, index) => (
          <motion.p
            key={index}
            id={`segment-${index}`}
            animate={{ opacity: activeSegmentIndex === index ? 1 : 0.5, scale: activeSegmentIndex === index ? 1.02 : 1 }}
            transition={{ duration: 0.3 }}
            className={`text-lg leading-relaxed mb-6 transition-opacity duration-300 ${activeSegmentIndex === index ? 'text-gold font-semibold' : 'text-cream/70'}`}
          >
            {segment.text}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
