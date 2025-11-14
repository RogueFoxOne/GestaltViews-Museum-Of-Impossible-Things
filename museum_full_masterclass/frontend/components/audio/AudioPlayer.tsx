// /components/audio/AudioPlayer.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WordTimestamp {
  word: string
  startTime: number
  endTime: number
  index: number
}

interface AudioPlayerProps {
  audioUrl: string
  transcript: string
  wordTimestamps: WordTimestamp[]
  title: string
}

export function AudioPlayer({ 
  audioUrl, 
  transcript, 
  wordTimestamps,
  title 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Update current time and highlight active word
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      
      // Find active word based on current time
      const activeWord = wordTimestamps.find(
        w => w.startTime <= audio.currentTime && w.endTime >= audio.currentTime
      )
      setActiveWordIndex(activeWord?.index ?? null)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', () => {})
    }
  }, [wordTimestamps])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-midnight-blue/50 rounded-lg backdrop-blur">
      <h3 className="text-2xl font-bold text-gold mb-6">{title}</h3>
      
      {/* Audio Element */}
      <audio ref={audioRef} src={audioUrl} />

      {/* Transcript with Highlighting */}
      <div className="mb-6 p-6 bg-black/30 rounded-lg max-h-96 overflow-y-auto">
        <p className="text-cream leading-relaxed text-lg">
          {transcript.split(' ').map((word, idx) => (
            <span
              key={idx}
              className={`transition-all duration-200 ${
                activeWordIndex === idx
                  ? 'text-gold font-bold scale-110 inline-block'
                  : 'text-cream'
              }`}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>

      {/* Player Controls */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-2 bg-forest-green/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="px-6 py-3 bg-gold text-midnight-blue rounded-lg font-bold hover:bg-gold/80 transition"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <div className="text-cream">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
