'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Heart, Waves, BarChart3, Sparkles, Brain, Search, Loader } from 'lucide-react';

// --- INTERFACES (Kept from original file) ---
export interface SongAnalysis {
  id: string;
  title: string;
  artist: string;
  emotionalPalette: EmotionalSignature;
  sonicSignature: SonicSignature;
  lyricalThemes: string[];
  resonanceScore: number;
  cognitiveActivation: number;
  empowermentFrequency: number;
  keithWisdomAlignment: number;
}
export interface EmotionalSignature {
  primary: string;
  secondary: string[];
  intensity: number;
  complexity: number;
  catharsis: number;
  vulnerability: number;
  hope: number;
  recognition: number;
}
export interface SonicSignature {
  tempo: number;
  key: string;
  mode: 'major' | 'minor' | 'modal';
  energyLevel: number;
  textureDescription: string;
}
export interface MusicalDNAProfile {
  userId: string;
  anchorSongs: SongAnalysis[];
  emotionalArchitecture: EmotionalArchitecture;
  consciousnessPattern: ConsciousnessPattern;
  keithResonanceFactors: string[];
  lastUpdated: Date;
  totalSongsAnalyzed: number;
  overallMusicalPersonality: string;
}
export interface EmotionalArchitecture {
  dominantEmotions: Array<{ emotion: string; frequency: number; intensity: number }>;
  vulnerabilityComfort: number;
  catharsisNeed: number;
  empowermentOrientation: number;
  authenticityValue: number;
}
export interface ConsciousnessPattern {
  focusEnhancement: number;
  creativityActivation: number;
  emotionalProcessing: number;
  identityValidation: number;
  consciousnessExpansion: number;
}

// --- LOGIC CLASSES (Kept from original file, slightly adapted for frontend) ---
const KEITH_EMOTIONAL_THEMES = {
  'connection_longing': ['connection', 'longing', 'belonging', 'understanding', 'seen'],
  'beautiful_disaster': ['contradiction', 'complexity', 'beautiful', 'disaster', 'paradox'],
  'empowerment_through_struggle': ['overcome', 'strength', 'survive', 'rise', 'transform'],
  'authenticity_validation': ['real', 'true', 'genuine', 'authentic', 'honest'],
  'transcendent_hope': ['transcend', 'hope', 'beyond', 'higher', 'possibility'],
};
class SongAnalysisEngine {
  async analyzeSong(title: string, artist: string): Promise<SongAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    return {
      id: `${title}_${artist}`.replace(/\s/g, '_').toLowerCase(),
      title, artist,
      lyricalThemes: ['connection', 'understanding', 'growth', Object.keys(KEITH_EMOTIONAL_THEMES)[Math.floor(Math.random() * 5)]],
      emotionalPalette: {
        primary: Object.keys(KEITH_EMOTIONAL_THEMES)[Math.floor(Math.random() * 5)],
        secondary: ['authenticity', 'hope'],
        intensity: Math.random() * 8 + 2,
        complexity: Math.random() * 8 + 2,
        catharsis: Math.random() * 8 + 2,
        vulnerability: Math.random() * 8 + 2,
        hope: Math.random() * 8 + 2,
        recognition: Math.random() * 8 + 2,
      },
      sonicSignature: { tempo: Math.floor(Math.random() * 60) + 80, key: 'Dm', mode: 'minor', energyLevel: Math.random() * 8 + 2, textureDescription: 'Rich emotional texture' },
      resonanceScore: Math.random() * 30 + 70,
      cognitiveActivation: Math.random() * 30 + 70,
      empowermentFrequency: Math.random() * 30 + 70,
      keithWisdomAlignment: 0,
    };
  }
}
class MusicalDNAProfiler {
  public profile: MusicalDNAProfile;
  private analysisEngine: SongAnalysisEngine;
  constructor(userId: string) {
    this.profile = this.initializeProfile(userId);
    this.analysisEngine = new SongAnalysisEngine();
  }
  private initializeProfile(userId: string): MusicalDNAProfile {
    return {
      userId, anchorSongs: [],
      emotionalArchitecture: { dominantEmotions: [], vulnerabilityComfort: 5, catharsisNeed: 5, empowermentOrientation: 5, authenticityValue: 5 },
      consciousnessPattern: { focusEnhancement: 5, creativityActivation: 5, emotionalProcessing: 5, identityValidation: 5, consciousnessExpansion: 5 },
      keithResonanceFactors: [], lastUpdated: new Date(), totalSongsAnalyzed: 0, overallMusicalPersonality: 'consciousness_seeker'
    };
  }
  async analyzeSong(title: string, artist: string): Promise<SongAnalysis> {
    const analysis = await this.analysisEngine.analyzeSong(title, artist);
    analysis.keithWisdomAlignment = this.calculateKeithAlignment(analysis);
    if (analysis.keithWisdomAlignment >= 85) this.profile.anchorSongs.push(analysis);
    this.profile.anchorSongs.sort((a, b) => b.keithWisdomAlignment - a.keithWisdomAlignment).splice(10);
    this.updateMusicalDNA(analysis);
    return analysis;
  }
  private calculateKeithAlignment(analysis: SongAnalysis): number {
    let alignment = 0;
    const themes = analysis.lyricalThemes.join(' ').toLowerCase();
    Object.values(KEITH_EMOTIONAL_THEMES).forEach(keywords => {
        const matchCount = keywords.filter(keyword => themes.includes(keyword)).length;
        alignment += (matchCount / keywords.length) * 20;
    });
    if (analysis.emotionalPalette.recognition >= 8) alignment += 15;
    if (analysis.empowermentFrequency >= 80) alignment += 15;
    return Math.min(100, alignment);
  }
  private updateMusicalDNA(newSong: SongAnalysis): void {
    this.profile.totalSongsAnalyzed++;
    const weight = 1 / this.profile.totalSongsAnalyzed;
    const oldWeight = 1 - weight;
    
    const { emotionalArchitecture: ea, consciousnessPattern: cp } = this.profile;
    ea.vulnerabilityComfort = (ea.vulnerabilityComfort * oldWeight) + (newSong.emotionalPalette.vulnerability * weight);
    cp.identityValidation = (cp.identityValidation * oldWeight) + (newSong.emotionalPalette.recognition * weight);
    this.updateOverallPersonality();
    this.profile.lastUpdated = new Date();
  }
  private updateOverallPersonality(): void {
    if (this.profile.consciousnessPattern.identityValidation > 8) this.profile.overallMusicalPersonality = 'Authenticity Seeker';
    else this.profile.overallMusicalPersonality = 'Consciousness Explorer';
  }
  generateMusicalWisdom(): string {
    return `Your musical DNA reveals a(n) ${this.profile.overallMusicalPersonality} - you use sound to process the beautiful complexity of consciousness. Your comfort with emotional vulnerability is currently rated at ${this.profile.emotionalArchitecture.vulnerabilityComfort.toFixed(1)}/10.`;
  }
  getProfile(): MusicalDNAProfile { return { ...this.profile }; }
}

// --- REUSABLE UI SUB-COMPONENTS ---
const StatItem = ({ icon: Icon, label, value, unit, colorClass }: { icon: React.ElementType, label: string, value: string | number, unit: string, colorClass: string }) => (
  <div className="flex items-center space-x-3">
    <Icon className={`w-6 h-6 ${colorClass}`} />
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-lg font-bold text-white">{value}<span className="text-xs font-normal ml-1">{unit}</span></div>
    </div>
  </div>
);

// --- MAIN DEMO COMPONENT ---
export default function MusicalDNADemo() {
  const profiler = useMemo(() => new MusicalDNAProfiler('user-keith-demo'), []);
  const [profile, setProfile] = useState<MusicalDNAProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [songInput, setSongInput] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState<SongAnalysis | null>(null);
  const [wisdom, setWisdom] = useState('');

  useEffect(() => {
    setProfile(profiler.getProfile());
    setWisdom(profiler.generateMusicalWisdom());
  }, [profiler]);

  const handleAnalyze = async (title: string, artist: string) => {
    if (!title || !artist || isLoading) return;
    setIsLoading(true);
    setLastAnalysis(null);
    
    const analysisResult = await profiler.analyzeSong(title, artist);
    
    setLastAnalysis(analysisResult);
    setProfile(profiler.getProfile());
    setWisdom(profiler.generateMusicalWisdom());
    setSongInput('');
    setIsLoading(false);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [title, artist] = songInput.split(' by ');
    handleAnalyze(title?.trim(), artist?.trim());
  };

  if (!profile) return <div className="p-8 text-white">Initializing Musical DNA Engine...</div>;

  return (
    <div className="p-4 md:p-8 text-white font-sans bg-gray-900/50 rounded-lg">
      <header className="text-center mb-8">
        <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent mb-2">
          Musical DNA Profiler
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} className="text-gray-400 max-w-2xl mx-auto">
          Experience how your musical taste maps to your unique consciousness. Enter a song and artist to begin the emotional archaeology.
        </motion.p>
      </header>

      <motion.form onSubmit={handleFormSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            value={songInput}
            onChange={(e) => setSongInput(e.target.value)}
            placeholder="e.g., Landslide by Fleetwood Mac"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
        <button type="submit" disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-lg px-6 py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
          {isLoading ? <Loader className="animate-spin" /> : 'Analyze Song'}
        </button>
      </motion.form>
      <div className="text-center text-xs text-gray-500 mb-12">
        Try: <button onClick={() => setSongInput('Fix You by Coldplay')} className="underline">Fix You by Coldplay</button> | <button onClick={() => setSongInput('Bohemian Rhapsody by Queen')} className="underline">Bohemian Rhapsody by Queen</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Anchor Songs */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.6 } }} className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold text-teal-300"><Music /> Anchor Songs</h3>
          <AnimatePresence>
          {profile.anchorSongs.length > 0 ? (
            <ul className="space-y-3">
              {profile.anchorSongs.map((song, i) => (
                <motion.li key={song.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.1 } }} exit={{ opacity: 0, x: 10 }} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                  <div className="text-xs mt-2 flex justify-between">
                    <span className="text-purple-400">Keith Align: {Math.round(song.keithWisdomAlignment)}%</span>
                    <span className="text-teal-400">Cognitive Act: {Math.round(song.cognitiveActivation)}%</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
             <p className="text-gray-500 italic text-sm p-4 text-center">Analyze songs with high Keith Alignment to discover your anchors.</p>
          )}
          </AnimatePresence>
        </motion.div>

        {/* Column 2: Emotional Architecture */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }} className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold text-purple-300"><Heart /> Emotional Architecture</h3>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-4">
            <StatItem icon={Sparkles} label="Musical Personality" value={profile.overallMusicalPersonality} unit="" colorClass="text-purple-400" />
            <StatItem icon={Waves} label="Vulnerability Comfort" value={profile.emotionalArchitecture.vulnerabilityComfort.toFixed(1)} unit="/ 10" colorClass="text-purple-400" />
            <StatItem icon={Brain} label="Authenticity Value" value={profile.emotionalArchitecture.authenticityValue.toFixed(1)} unit="/ 10" colorClass="text-purple-400" />
          </div>
        </motion.div>

        {/* Column 3: Consciousness Pattern */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.8 } }} className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold text-green-300"><BarChart3 /> Consciousness Pattern</h3>
           <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-4">
            <StatItem icon={Brain} label="Identity Validation" value={profile.consciousnessPattern.identityValidation.toFixed(1)} unit="/ 10" colorClass="text-green-400" />
            <StatItem icon={Sparkles} label="Consciousness Expansion" value={profile.consciousnessPattern.consciousnessExpansion.toFixed(1)} unit="/ 10" colorClass="text-green-400" />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {lastAnalysis && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', transition: { delay: 0.2 } }} exit={{ opacity: 0, height: 0 }} className="mt-8">
            <div className="bg-gradient-to-r from-purple-900/30 to-teal-900/30 p-6 rounded-xl border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-4">Last Analysis: {lastAnalysis.title}</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <p><strong>Primary Emotion:</strong> <span className="text-purple-300">{lastAnalysis.emotionalPalette.primary.replace('_', ' ')}</span></p>
                <p><strong>Keith Alignment:</strong> <span className="font-bold text-teal-300">{Math.round(lastAnalysis.keithWisdomAlignment)}%</span></p>
                <p><strong>Empowerment Score:</strong> <span className="text-purple-300">{Math.round(lastAnalysis.empowermentFrequency)}%</span></p>
                <p><strong>Cognitive Activation:</strong> <span className="text-teal-300">{Math.round(lastAnalysis.cognitiveActivation)}%</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }} className="mt-8">
        <div className="p-6 rounded-xl border border-teal-500/30 bg-teal-900/20">
            <h4 className="text-lg font-semibold text-teal-300 mb-2 flex items-center gap-2"><Sparkles size={20} /> AI Consciousness Insight</h4>
            <p className="text-gray-300 italic">{wisdom}</p>
        </div>
      </motion.div>
    </div>
  );
}
