'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Palette, Users, Heart, Brain, Zap, Music, RefreshCw, Download, ListMusic } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from 'next/image';

interface MusicalDNAVisualizerProps {
  profile: any;
  onRegenerateAnalysis?: () => void;
}

export default function MusicalDNAVisualizer({ profile, onRegenerateAnalysis }: MusicalDNAVisualizerProps) {
  if (!profile) return null;

  const personalityTraits = [
    { name: 'Openness', value: profile.personalityTraits?.openness || 0, icon: Palette, color: 'text-purple-400' },
    { name: 'Conscientiousness', value: profile.personalityTraits?.conscientiousness || 0, icon: Brain, color: 'text-blue-400' },
    { name: 'Extraversion', value: profile.personalityTraits?.extraversion || 0, icon: Users, color: 'text-green-400' },
    { name: 'Agreeableness', value: profile.personalityTraits?.agreeableness || 0, icon: Heart, color: 'text-pink-400' },
    { name: 'Emotional Stability', value: 100 - (profile.personalityTraits?.neuroticism || 0), icon: Zap, color: 'text-yellow-400' }
  ];

  const getPLKResonanceColor = (score: number) => {
    if (score >= 95) return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    if (score >= 85) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    return 'text-green-400 border-green-500/30 bg-green-500/10';
  };
  
  return (
    <div className="space-y-8">
      
      {/* PLK Resonance Score - Hero */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className={`text-center border-2 ${getPLKResonanceColor(profile.plkResonance || 0)}`}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Music className="w-8 h-8" />
              <span>Musical PLK Resonance: {Math.round(profile.plkResonance || 0)}%</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>

      {/* ✅ NEW: Playlists Section */}
      {profile.playlists && profile.playlists.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2"><ListMusic/> Your Playlists</CardTitle>
              <CardDescription className="text-slate-400">The curated soundtracks of your life.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 pb-4">
                  {profile.playlists.map((playlist: any) => (
                    <div key={playlist.id} className="w-40 shrink-0">
                      <div className="overflow-hidden rounded-md aspect-square relative">
                        <Image src={playlist.images?.[0]?.url || '/placeholder.png'} alt={playlist.name} fill className="object-cover"/>
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="font-semibold text-slate-200 truncate">{playlist.name}</p>
                        <p className="text-xs text-slate-400">{playlist.tracks.total} tracks</p>
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Musical Personality Traits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Musical Personality Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalityTraits.map(({ name, value, icon: Icon, color }, index) => (
                <motion.div key={name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.1 * index } }} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="font-medium text-slate-300">{name}</span>
                  </div>
                  <Progress value={value} />
                  <span className="text-sm text-slate-400">{Math.round(value)}%</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }} className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRegenerateAnalysis} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
          <RefreshCw className="w-4 h-4 mr-2" />
          Analyze Again
        </Button>
        <Button onClick={() => { /* Export logic */ }} className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Download className="w-4 h-4 mr-2" />
          Export Profile
        </Button>
      </motion.div>
    </div>
  );
}
