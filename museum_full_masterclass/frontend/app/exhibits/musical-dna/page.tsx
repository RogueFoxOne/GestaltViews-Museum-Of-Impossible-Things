// app/exhibits/musical-dna/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import SpotifyIntegration from '@/components/musical-dna/SpotifyIntegration';
import MusicalDNAVisualizer from '@/components/musical-dna/MusicalDNAVisualizer';
import VoiceInputChat from '@/components/voice/VoiceInputChat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Dna, Brain, Sparkles, Volume2, Loader2, TestTube2 } from 'lucide-react';
import { AuroraBackground } from '@/components/AuroraBackground'; // ✅ 1. IMPORT AURORA

// A fallback component to show while the main Spotify component loads
const SpotifyIntegrationFallback = () => (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-purple-500/30">
        <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-300">
                <Music className="h-6 w-6" />
                <span>Spotify Musical DNA Analysis</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-slate-400" />
            <p className="text-slate-500 mt-2">Loading Spotify integration...</p>
        </CardContent>
    </Card>
);

// Mock data for the "Development Mode" bypass
const mockMusicalProfile = {
  plkResonance: 98,
  personalityTraits: { openness: 92, conscientiousness: 78, extraversion: 45, agreeableness: 85, neuroticism: 20 },
  playlists: [],
};

export default function MusicalDNAPage() {
  const [musicalProfile, setMusicalProfile] = useState<any>(null); // Changed to any to accept mock data easily
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  const handleAnalysisComplete = (profile: any) => { // Changed to any to accept profile
    setMusicalProfile(profile);
    setIsAnalyzing(false);
  };

  const handleDevModeBypass = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
        setMusicalProfile(mockMusicalProfile);
        setIsAnalyzing(false);
    }, 1500);
  };

  return (
    // ✅ 2. UPDATE MAIN CONTAINER FOR BACKGROUND AND PADDING
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden py-24 px-4">
      <AuroraBackground /> {/* ✅ 3. ADD THE AURORA BACKGROUND */}
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Musical DNA
          </h1>
          <p className="text-lg md:text-xl text-slate-300">
            Decode the consciousness patterns hidden in your musical taste.
          </p>
        </motion.div>

        {!musicalProfile && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Suspense fallback={<SpotifyIntegrationFallback />}>
              <SpotifyIntegration onAnalysisComplete={handleAnalysisComplete} />
            </Suspense>
            
            {/* Dev Mode Bypass Button */}
            <div className="text-center mt-4">
              <Button onClick={handleDevModeBypass} variant="ghost" className="text-slate-500 hover:text-slate-300">
                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube2 className="mr-2 h-4 w-4" />}
                Enter Development Mode
              </Button>
            </div>
          </motion.div>
        )}

        {isAnalyzing && !musicalProfile && (
            <div className="text-center text-slate-400 flex items-center justify-center">
                <Loader2 className="mr-2 animate-spin" />
                <p>Analyzing your musical consciousness...</p>
            </div>
        )}

        {musicalProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MusicalDNAVisualizer profile={musicalProfile} />
            <div className="text-center mt-8">
              <Button onClick={() => setShowVoiceChat(!showVoiceChat)} variant="outline" className="bg-transparent text-white border-purple-500 hover:bg-purple-500/20">
                <Sparkles className="mr-2 h-4 w-4" />
                Discuss Your Results with AI
              </Button>
            </div>
          </motion.div>
        )}

        {showVoiceChat && musicalProfile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200">AI Companion Chat</CardTitle>
                <CardDescription className="text-slate-400">Ask about your musical DNA. Use your voice for a natural conversation.</CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceInputChat 
                    placeholder="Ask 'What does my music say about me?'"
                    autoSubmit={true}
                    onTranscriptReceived={(transcript) => console.log("Voice query:", transcript)}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
