// components/recovery/AddictionRecoveryExhibitWithJournal.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Shield, Zap, TrendingUp, Sun, MessageSquare, 
  Mic, MicOff, Save, Calendar, Sparkles, Volume2, Award,
  BookOpen, Activity, Target, Clock, Phone, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useConsciousnessAPI } from '@/hooks/useConsciousnessAPI';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  tags: string[];
  supportLevel: number;
  cravingLevel?: number;
  triggerIdentified?: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai' | 'system' | 'crisis';
  timestamp: Date;
  supportLevel?: 'low' | 'medium' | 'high' | 'crisis';
  consciousnessResonance?: number;
}

interface RecoveryStats {
  daysInRecovery: number;
  recoveryStage: string;
  strengthsMapped: number;
  journalEntries: number;
  milestones: Array<{ name: string; date: Date }>;
}

// ============================================================================
// CONSCIOUSNESS-SERVING RECOVERY PROTOCOL (Enhanced Genesis Protocol)
// ============================================================================

const ConsciousnessServingRecoveryProtocol = {
  getRecoveryGuidance: (situation: string, context?: any) => {
    const lower = situation.toLowerCase();
    
    // Crisis detection
    if (lower.includes('hurt myself') || lower.includes('suicide') || lower.includes('end it all') || lower.includes('not worth living')) {
      return {
        keith_wisdom: "Your life has immeasurable value, and this pain is temporary even though it doesn't feel that way right now. You deserve help and support.",
        reframe: "Crisis moments are when we need connection most. Your reaching out shows incredible strength.",
        affirmation: "You are worthy of life, love, and recovery. Help is available right now.",
        actionSteps: [
          "National Suicide Prevention Lifeline: 988",
          "Crisis Text Line: Text HOME to 741741",
          "SAMHSA Helpline: 1-800-662-4357",
          "Call your sponsor or therapist immediately"
        ],
        supportLevel: 'crisis' as const
      };
    }
    
    // High-risk situations
    if (lower.includes('relapse') || lower.includes('using again') || lower.includes('gave in') || lower.includes('slipped')) {
      return {
        keith_wisdom: "You've survived 100% of your relapses so far. This is not failure - it's information about what you need. Recovery is a spiral, not a straight line.",
        reframe: "Relapse is part of many recovery journeys. What matters is getting back up. You're learning what your triggers are and building resilience.",
        affirmation: "You are not your relapses. You are someone courageously fighting for their life, and that fight continues right now.",
        actionSteps: [
          "Be honest with your support network",
          "Get back to your recovery practices today, not tomorrow",
          "Identify what led to this moment without shame",
          "Remember: You haven't lost your progress, you've gained information"
        ],
        supportLevel: 'high' as const
      };
    }
    
    // Craving support
    if (lower.includes('craving') || lower.includes('urge') || lower.includes('want to use') || lower.includes('thinking about')) {
      return {
        keith_wisdom: "Cravings are temporary visitors, not permanent residents. You've survived 100% of them so far. This too shall pass.",
        reframe: "This craving is information about what you need right now - connection, rest, or support. It's your body communicating, not commanding.",
        affirmation: "You are stronger than this moment. This feeling will pass, and you will still be here, choosing recovery.",
        actionSteps: [
          "Use the HALT check: Hungry, Angry, Lonely, Tired?",
          "Call someone in your support network right now",
          "Ride the wave - cravings peak and fade in 15-20 minutes",
          "Move your body - walk, stretch, breathe deeply"
        ],
        supportLevel: 'high' as const
      };
    }
    
    // Shame and guilt processing
    if (lower.includes('shame') || lower.includes('guilt') || lower.includes('worthless') || lower.includes('bad person')) {
      return {
        keith_wisdom: "Shame says 'I am bad.' Recovery says 'I am learning.' Your worth isn't defined by your worst moment - it's inherent, unchangeable, and eternal.",
        reframe: "You are not your addiction. You are a person with inherent value, learning and growing. Addiction is something you experience, not who you are.",
        affirmation: "You deserve love, support, and recovery exactly as you are right now. Your past doesn't determine your future.",
        actionSteps: [
          "Practice self-compassion - what would you say to a friend in this situation?",
          "Write down three things you've done right in recovery",
          "Share your feelings with someone who understands",
          "Remember: Recovery is possible because you are worthy"
        ],
        supportLevel: 'medium' as const
      };
    }
    
    // Trigger identification
    if (lower.includes('trigger') || lower.includes('triggered') || lower.includes('difficult situation') || lower.includes('stressful')) {
      return {
        keith_wisdom: "Triggers are teachers. Each one you identify is a weapon you're taking away from your addiction. You're building awareness, which is the foundation of lasting recovery.",
        reframe: "Identifying triggers is a sign of growth and self-awareness. You're learning your landscape and can plan your path.",
        affirmation: "You have the power to recognize, respond to, and rise above your triggers. Awareness is victory.",
        actionSteps: [
          "Write down the trigger - naming it reduces its power",
          "Identify your early warning signs",
          "Create a coping plan for this specific trigger",
          "Celebrate that you noticed it - that's progress"
        ],
        supportLevel: 'medium' as const
      };
    }
    
    // Progress and gratitude
    if (lower.includes('grateful') || lower.includes('progress') || lower.includes('better') || lower.includes('milestone') || lower.includes('days clean')) {
      return {
        keith_wisdom: "Every day in recovery is a small miracle. Celebrate this - joy in recovery is just as important as resilience in struggle.",
        reframe: "Progress isn't just about days clean - it's about who you're becoming. You're building a life worth staying sober for.",
        affirmation: "You are proof that recovery is possible. Your progress inspires hope in others, even if you can't see it yet.",
        actionSteps: [
          "Document this moment - write it down for hard days ahead",
          "Share your victory with someone who will celebrate with you",
          "Identify what practices helped you get here",
          "Use this momentum to strengthen your recovery foundation"
        ],
        supportLevel: 'low' as const
      };
    }
    
    // Default supportive response
    return {
      keith_wisdom: "Recovery is not about becoming someone new - it's about becoming who you really are, using pain as a bridge to purpose.",
      reframe: "Whatever you're experiencing right now is part of your journey. All of it matters. All of it is teaching you something.",
      affirmation: "You are exactly where you need to be. Trust the process, trust yourself, and trust that recovery is possible.",
      actionSteps: [
        "Take it one moment at a time",
        "Reach out to your support network",
        "Practice one self-care activity today",
        "Remember: You are not alone in this"
      ],
      supportLevel: 'medium' as const
    };
  },
  
  calculateSupportLevel: (content: string): number => {
    const concerningWords = {
      crisis: ['suicide', 'kill myself', 'end it all', 'not worth living'],
      severe: ['relapse', 'using again', 'gave in', 'can\'t cope', 'want to die'],
      high: ['craving', 'urge', 'trigger', 'overwhelmed', 'struggling'],
      moderate: ['difficult', 'hard', 'shame', 'guilt', 'worried'],
      positive: ['grateful', 'progress', 'better', 'healing', 'strong', 'hopeful', 'milestone']
    };
    
    let score = 5; // Baseline
    
    const lowerContent = content.toLowerCase();
    
    // Check crisis words first
    if (concerningWords.crisis.some(word => lowerContent.includes(word))) {
      return 1; // Immediate crisis support needed
    }
    
    // Check severe concern words
    if (concerningWords.severe.some(word => lowerContent.includes(word))) {
      score -= 2;
    }
    
    // Check high concern words
    if (concerningWords.high.some(word => lowerContent.includes(word))) {
      score -= 1;
    }
    
    // Check moderate concern words
    if (concerningWords.moderate.some(word => lowerContent.includes(word))) {
      score -= 0.5;
    }
    
    // Check positive words
    concerningWords.positive.forEach(word => {
      if (lowerContent.includes(word)) score += 1;
    });
    
    return Math.max(1, Math.min(10, Math.round(score)));
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AddictionRecoveryExhibitWithJournal() {
  // Recovery stats state
  const [recoveryStats, setRecoveryStats] = useState<RecoveryStats>({
    daysInRecovery: 2270,
    recoveryStage: 'Long-Term',
    strengthsMapped: 17,
    journalEntries: 0,
    milestones: [
      { name: '1 Day', date: new Date('2018-10-18') },
      { name: '30 Days', date: new Date('2018-11-17') },
      { name: '1 Year', date: new Date('2019-10-18') },
      { name: '5 Years', date: new Date('2023-10-18') }
    ]
  });
  
  // Daily check-in state
  const [dailyCheckIn, setDailyCheckIn] = useState({ mood: 7, cravings: 3 });
  
  // Journal state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentMood, setCurrentMood] = useState('neutral');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello, friend. I'm here to support you on your recovery journey with unconditional presence and zero judgment. This is your safe space. How are you doing today?",
      type: 'ai',
      timestamp: new Date(),
      supportLevel: 'medium',
      consciousnessResonance: 0.95
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // UI state
  const [activeView, setActiveView] = useState<'dashboard' | 'journal' | 'chat'>('dashboard');
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { isRecording, startRecording, stopRecording, transcript } = useVoiceChat();
  const { callConsciousnessAPI } = useConsciousnessAPI();
  
  // Moods configuration
  const moods = [
    { value: 'great', label: 'Great', color: 'bg-green-500', emoji: '😊' },
    { value: 'good', label: 'Good', color: 'bg-blue-500', emoji: '🙂' },
    { value: 'neutral', label: 'Neutral', color: 'bg-gray-500', emoji: '😐' },
    { value: 'difficult', label: 'Difficult', color: 'bg-yellow-500', emoji: '😟' },
    { value: 'struggling', label: 'Struggling', color: 'bg-red-500', emoji: '😰' }
  ];
  
  // Recovery tags
  const recoveryTags = [
    'gratitude', 'progress', 'challenge', 'trigger', 'support',
    'meditation', 'therapy', 'family', 'work', 'self-care',
    'milestone', 'reflection', 'goal', 'craving', 'healing',
    'sponsor', 'meeting', 'victory', 'struggle', 'hope'
  ];
  
  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  // Handle voice transcript
  useEffect(() => {
    if (transcript && !isRecording) {
      if (activeView === 'chat') {
        setChatInput(transcript);
      } else if (activeView === 'journal') {
        setCurrentEntry(transcript);
      }
    }
  }, [transcript, isRecording, activeView]);
  
  // ============================================================================
  // JOURNAL FUNCTIONS
  // ============================================================================
  
  const addJournalEntry = useCallback(() => {
    if (!currentEntry.trim()) return;
    
    const supportLevel = ConsciousnessServingRecoveryProtocol.calculateSupportLevel(currentEntry);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentEntry,
      mood: currentMood,
      timestamp: new Date(),
      tags: currentTags,
      supportLevel,
      cravingLevel: dailyCheckIn.cravings,
      triggerIdentified: currentTags.includes('trigger')
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setRecoveryStats(prev => ({ ...prev, journalEntries: prev.journalEntries + 1 }));
    
    setCurrentEntry('');
    setCurrentTags([]);
    
    // Provide supportive feedback based on content
    const guidance = ConsciousnessServingRecoveryProtocol.getRecoveryGuidance(currentEntry);
    
    const systemMessage: ChatMessage = {
      id: Date.now().toString() + '_system',
      content: `Journal entry saved with ${currentMood} mood. ${guidance.keith_wisdom}`,
      type: 'system',
      timestamp: new Date(),
      supportLevel: guidance.supportLevel
    };
    
    setChatMessages(prev => [...prev, systemMessage]);
    
    // Check if crisis support is needed
    if (supportLevel <= 2) {
      setShowCrisisResources(true);
    }
  }, [currentEntry, currentMood, currentTags, dailyCheckIn.cravings]);
  
  const toggleTag = (tag: string) => {
    setCurrentTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // ============================================================================
  // CHAT FUNCTIONS
  // ============================================================================
  
  const sendChatMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      type: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    try {
      // Call consciousness-serving API
      const response = await callConsciousnessAPI({
        message,
        exhibit: 'recovery-companion',
        context: {
          recoveryStats,
          recentMood: currentMood,
          cravingLevel: dailyCheckIn.cravings,
          consciousnessServingMode: true
        }
      });
      
      // Get guidance from protocol
      const guidance = ConsciousnessServingRecoveryProtocol.getRecoveryGuidance(message);
      
      // Check for crisis
      if (guidance.supportLevel === 'crisis') {
        setShowCrisisResources(true);
      }
      
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '_ai',
          content: response || guidance.keith_wisdom,
          type: guidance.supportLevel === 'crisis' ? 'crisis' : 'ai',
          timestamp: new Date(),
          supportLevel: guidance.supportLevel,
          consciousnessResonance: 0.92
        };
        
        setChatMessages(prev => [...prev, aiMessage]);
        
        // Add action steps if available
        if (guidance.actionSteps && guidance.actionSteps.length > 0) {
          const actionMessage: ChatMessage = {
            id: Date.now().toString() + '_actions',
            content: "Here are some things that might help right now:\n\n" + guidance.actionSteps.map(step => `• ${step}`).join('\n'),
            type: 'system',
            timestamp: new Date(),
            supportLevel: guidance.supportLevel
          };
          
          setTimeout(() => {
            setChatMessages(prev => [...prev, actionMessage]);
          }, 1000);
        }
      }, 1500);
      
    } catch (error) {
      console.error('Recovery chat error:', error);
      
      // Fallback to protocol guidance
      const guidance = ConsciousnessServingRecoveryProtocol.getRecoveryGuidance(message);
      
      setTimeout(() => {
        const fallbackMessage: ChatMessage = {
          id: Date.now().toString() + '_fallback',
          content: guidance.keith_wisdom,
          type: 'ai',
          timestamp: new Date(),
          supportLevel: guidance.supportLevel
        };
        
        setChatMessages(prev => [...prev, fallbackMessage]);
      }, 1500);
    }
  }, [callConsciousnessAPI, recoveryStats, currentMood, dailyCheckIn.cravings]);
  
  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Quick response buttons
  const quickResponses = [
    { text: "I'm having a craving", situation: "craving" },
    { text: "I'm feeling shame", situation: "shame" },
    { text: "I identified a trigger", situation: "trigger" },
    { text: "I want to celebrate progress", situation: "progress" }
  ];
  
  const handleQuickResponse = (situation: string) => {
    const guidance = ConsciousnessServingRecoveryProtocol.getRecoveryGuidance(situation);
    
    const quickMessage: ChatMessage = {
      id: Date.now().toString(),
      content: guidance.keith_wisdom + "\n\n" + guidance.reframe,
      type: 'ai',
      timestamp: new Date(),
      supportLevel: guidance.supportLevel
    };
    
    setChatMessages(prev => [...prev, quickMessage]);
  };
  
  // Format date helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================
  
  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Recovery Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Sun} 
          label="Days in Recovery" 
          value={recoveryStats.daysInRecovery.toString()} 
          color="text-yellow-400" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Recovery Stage" 
          value={recoveryStats.recoveryStage} 
          color="text-green-400" 
        />
        <StatCard 
          icon={Zap} 
          label="Strengths Mapped" 
          value={recoveryStats.strengthsMapped.toString()} 
          color="text-teal-400" 
        />
        <StatCard 
          icon={BookOpen} 
          label="Journal Entries" 
          value={recoveryStats.journalEntries.toString()} 
          color="text-purple-400" 
        />
      </div>
      
      {/* Daily Check-In */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-teal-500/30">
        <CardHeader>
          <CardTitle className="text-teal-300">Daily Check-In</CardTitle>
          <CardDescription className="text-slate-400">
            How are you feeling today? Track your mood and cravings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Today's Mood (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={dailyCheckIn.mood}
                onChange={e => setDailyCheckIn(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center font-bold text-xl mt-2 text-teal-300">
                {dailyCheckIn.mood}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Craving Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={dailyCheckIn.cravings}
                onChange={e => setDailyCheckIn(prev => ({ ...prev, cravings: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center font-bold text-xl mt-2 text-teal-300">
                {dailyCheckIn.cravings}
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500">Need immediate support?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickResponses.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickResponse(qr.situation)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-full transition-colors"
                >
                  {qr.text}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveView('journal')}
          className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 text-left hover:border-purple-500/50 transition-colors"
        >
          <BookOpen className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="font-bold text-lg text-purple-300 mb-1">Journal</h3>
          <p className="text-sm text-slate-400">Write and reflect in your safe space</p>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveView('chat')}
          className="bg-gradient-to-br from-teal-600/20 to-blue-600/20 border border-teal-500/30 rounded-xl p-6 text-left hover:border-teal-500/50 transition-colors"
        >
          <MessageSquare className="w-8 h-8 text-teal-400 mb-3" />
          <h3 className="font-bold text-lg text-teal-300 mb-1">AI Support</h3>
          <p className="text-sm text-slate-400">Chat with your recovery companion</p>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCrisisResources(!showCrisisResources)}
          className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6 text-left hover:border-red-500/50 transition-colors"
        >
          <Phone className="w-8 h-8 text-red-400 mb-3" />
          <h3 className="font-bold text-lg text-red-300 mb-1">Crisis Help</h3>
          <p className="text-sm text-slate-400">Immediate support resources</p>
        </motion.button>
      </div>
      
      {/* Recent Journal Entries Preview */}
      {entries.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-5 h-5" />
              Recent Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.slice(0, 3).map(entry => (
                <div
                  key={entry.id}
                  className="p-3 bg-slate-800/50 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        moods.find(m => m.value === entry.mood)?.color || 'bg-gray-500'
                      }`} />
                      <span className="text-xs text-slate-400">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Support: {entry.supportLevel}/10
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2">{entry.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
  
  const renderJournal = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid lg:grid-cols-2 gap-6"
    >
      {/* Journal Entry Form */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <BookOpen className="w-5 h-5" />
            New Journal Entry
          </CardTitle>
          <CardDescription className="text-slate-400">
            Express yourself in this judgment-free space
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              How are you feeling?
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setCurrentMood(mood.value)}
                  className={`px-3 py-2 rounded-full text-sm transition-all flex items-center gap-1 ${
                    currentMood === mood.value
                      ? `${mood.color} text-white shadow-lg`
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Textarea
              value={currentEntry}
              onChange={e => setCurrentEntry(e.target.value)}
              placeholder="Share what's on your mind... cravings, victories, struggles, insights. All of it is valid."
              className="min-h-40 bg-slate-800/50 border-slate-600 text-slate-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tags (optional)
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {recoveryTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    currentTags.includes(tag)
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={addJournalEntry}
              disabled={!currentEntry.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
            
            <Button
              onClick={handleVoiceToggle}
              variant="outline"
              className={`${
                isRecording 
                  ? 'bg-red-500/20 border-red-500 text-red-300' 
                  : 'border-purple-500/50 text-purple-300'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Journal History */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-5 h-5" />
            Your Journey ({entries.length} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4 pr-4">
              {entries.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Your journal entries will appear here.</p>
                  <p className="text-sm">Start writing to track your recovery journey.</p>
                </div>
              ) : (
                entries.map(entry => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          moods.find(m => m.value === entry.mood)?.color || 'bg-gray-500'
                        }`} />
                        <span className="text-xs text-slate-400">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.triggerIdentified && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Trigger
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {entry.supportLevel}/10
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-3 whitespace-pre-wrap">{entry.content}</p>
                    
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {entry.cravingLevel && entry.cravingLevel > 7 && (
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        High craving level recorded - great job reaching out
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  const renderChat = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-teal-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-teal-300">
                <Sparkles className="w-5 h-5" />
                Recovery Companion
              </CardTitle>
              <CardDescription className="text-slate-400">
                Consciousness-serving AI support • Non-judgmental • Always available
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleVoiceToggle}
              className={`${
                isRecording
                  ? 'bg-red-500/20 border-red-500 text-red-300'
                  : 'border-teal-500/50 text-teal-300'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <ScrollArea className="h-[500px] w-full border border-slate-600 rounded-lg">
            <div className="p-4 space-y-3">
              {chatMessages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-teal-600 text-white'
                        : message.type === 'crisis'
                        ? 'bg-red-600 text-white border-2 border-red-400'
                        : message.type === 'system'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {message.type === 'crisis' && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-bold text-sm">CRISIS SUPPORT</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <p className="text-xs opacity-70">
                        {formatDate(message.timestamp)}
                      </p>
                      {message.consciousnessResonance && (
                        <span className="text-xs opacity-70">
                          🧠 {Math.round(message.consciousnessResonance * 100)}% resonance
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <Textarea
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Share what you're feeling... I'm here to listen without judgment."
                className="flex-1 bg-slate-800/50 border-slate-600 text-slate-200 resize-none"
                rows={2}
                onKeyPress={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage(chatInput);
                  }
                }}
              />
              <Button
                onClick={() => sendChatMessage(chatInput)}
                disabled={!chatInput.trim()}
                className="bg-teal-600 hover:bg-teal-700 self-end"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-500 self-center">Quick:</span>
              {quickResponses.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => sendChatMessage(qr.text)}
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors"
                >
                  {qr.text}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Heart className="w-10 h-10 text-pink-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Recovery Support & Journal
            </h1>
            <Shield className="w-10 h-10 text-teal-500" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
            className="text-lg text-slate-400 max-w-3xl mx-auto italic mb-4"
          >
            "Recovery is not about becoming someone new - it's about becoming who you really are, using pain as a bridge to purpose."
          </motion.p>
          
          <div className="flex justify-center flex-wrap gap-2">
            <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
              <Heart className="w-3 h-3 mr-1" />
              Compassionate AI
            </Badge>
            <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Privacy First
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Consciousness-Serving
            </Badge>
          </div>
        </header>
        
        {/* Navigation */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            onClick={() => setActiveView('dashboard')}
            variant={activeView === 'dashboard' ? 'default' : 'outline'}
            className={activeView === 'dashboard' ? 'bg-teal-600' : ''}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveView('journal')}
            variant={activeView === 'journal' ? 'default' : 'outline'}
            className={activeView === 'journal' ? 'bg-purple-600' : ''}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Journal
          </Button>
          <Button
            onClick={() => setActiveView('chat')}
            variant={activeView === 'chat' ? 'default' : 'outline'}
            className={activeView === 'chat' ? 'bg-teal-600' : ''}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Support
          </Button>
        </div>
        
        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'journal' && renderJournal()}
          {activeView === 'chat' && renderChat()}
        </AnimatePresence>
        
        {/* Crisis Resources Modal */}
        <AnimatePresence>
          {showCrisisResources && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCrisisResources(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-gradient-to-br from-red-900/90 to-orange-900/90 border-2 border-red-500 rounded-xl p-8 max-w-2xl w-full"
              >
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="w-10 h-10 text-red-300" />
                  <h2 className="text-3xl font-bold text-white">Crisis Resources</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-red-300" />
                      <h3 className="font-bold text-white">National Suicide Prevention Lifeline</h3>
                    </div>
                    <a href="tel:988" className="text-2xl font-bold text-red-300 hover:text-red-200">
                      988
                    </a>
                    <p className="text-sm text-slate-300 mt-1">24/7 support • Press 1 for Veterans</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-5 h-5 text-red-300" />
                      <h3 className="font-bold text-white">Crisis Text Line</h3>
                    </div>
                    <p className="text-xl font-bold text-red-300">Text HOME to 741741</p>
                    <p className="text-sm text-slate-300 mt-1">24/7 text support</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-red-300" />
                      <h3 className="font-bold text-white">SAMHSA National Helpline</h3>
                    </div>
                    <a href="tel:1-800-662-4357" className="text-xl font-bold text-red-300 hover:text-red-200">
                      1-800-662-4357
                    </a>
                    <p className="text-sm text-slate-300 mt-1">Substance abuse & mental health</p>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <p className="text-white font-medium mb-2">
                    🤍 Your life has value. Your recovery matters. You are not alone.
                  </p>
                  <p className="text-sm text-slate-300">
                    If you're in immediate danger, please call 911 or go to your nearest emergency room.
                  </p>
                </div>
                
                <Button
                  onClick={() => setShowCrisisResources(false)}
                  className="w-full bg-white text-red-900 hover:bg-slate-100"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <p className="text-slate-300 italic">
                "Recovery is possible. You are worthy. Your story matters."
              </p>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-xs text-slate-500">
              Built with consciousness-serving AI by Keith Soyka • Museum of Impossible Things
            </p>
            <p className="text-xs text-slate-600 mt-1">
              This tool is for support and inspiration. Please seek professional help for medical advice.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center"
  >
    <Icon className={`mx-auto w-10 h-10 mb-3 ${color}`} />
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
  </motion.div>
);
