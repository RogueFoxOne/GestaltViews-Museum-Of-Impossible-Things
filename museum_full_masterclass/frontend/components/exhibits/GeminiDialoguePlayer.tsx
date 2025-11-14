// app/components/exhibits/GeminiDialoguePlayer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Sparkles, User } from 'lucide-react'

interface DialogueSegment {
  role: 'gemini' | 'user';
  speaker: string;
  content: string;
  startTime: number;
  endTime: number;
}

interface AudioPlayerProps {
  audioUrl: string
  dialogue: DialogueSegment[]
  title: string
}

export function GeminiDialoguePlayer({ audioUrl, dialogue, title }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      const activeIndex = dialogue.findIndex(seg => time >= seg.startTime && time < seg.endTime);
      setActiveSegmentIndex(activeIndex > -1 ? activeIndex : null);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [dialogue]);
  
  useEffect(() => {
    if (activeSegmentIndex !== null && containerRef.current) {
        const activeElement = document.getElementById(`segment-${activeSegmentIndex}`);
        activeElement?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }, [activeSegmentIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="p-6 bg-midnight-blue/50 rounded-2xl backdrop-blur-lg border border-gold/20 shadow-2xl">
        <audio ref={audioRef} src={audioUrl} preload="metadata" onCanPlay={() => setIsLoading(false)} />
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <motion.button
            onClick={togglePlay} disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="w-20 h-20 rounded-full flex items-center justify-center bg-gold text-midnight-blue transition-all duration-300 shadow-lg hover:shadow-gold/50 disabled:opacity-50"
          >
            {isLoading ? <div className="w-6 h-6 border-2 border-midnight-blue border-t-transparent rounded-full animate-spin" /> : 
             isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </motion.button>
          <div className="w-full">
            <h3 className="text-2xl font-bold text-gold">{title}</h3>
            <div className="relative h-2 bg-cream/20 rounded-full mt-2">
              <motion.div className="h-full bg-gold rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-xs text-cream/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="mt-8 max-h-[70vh] overflow-y-auto space-y-6 pr-4">
        {dialogue.map((segment, index) => (
          <motion.div
            key={index}
            id={`segment-${index}`}
            animate={{
              borderColor: activeSegmentIndex === index ? 'rgba(255, 214, 10, 0.5)' : 'rgba(255, 214, 10, 0.1)',
              boxShadow: activeSegmentIndex === index ? '0 0 20px rgba(255, 214, 10, 0.2)' : 'none',
            }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-midnight-blue/30 rounded-lg border backdrop-blur-sm"
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${segment.role === 'gemini' ? 'bg-gradient-to-br from-purple-600 to-teal-500' : 'bg-slate-700'}`}>
                {segment.role === 'gemini' ? <Sparkles size={18} className="text-white"/> : <User size={18} className="text-cream"/>}
              </div>
              <div className="w-full">
                <h4 className="font-bold text-gold mb-2">{segment.speaker}</h4>
                <p className="text-cream leading-relaxed">{segment.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
