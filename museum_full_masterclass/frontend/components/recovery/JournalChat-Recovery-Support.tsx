// /components/recovery/JournalChat-Recovery-Support.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, MessageCircle, Mic, Save, Calendar, Sparkles, Shield, Volume2 } from 'lucide-react';
import VoiceInputUniversal from '@/components/VoiceInput-Universal';

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  timestamp: Date;
  tags: string[];
  supportLevel: number;
}

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai' | 'system';
  timestamp: Date;
  supportLevel?: 'low' | 'medium' | 'high' | 'crisis';
}

const JournalChatRecoverySupport: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentMood, setCurrentMood] = useState('neutral');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello. I'm here to support you on your recovery journey. This is a safe, judgment-free space. How are you feeling today?",
      type: 'ai',
      timestamp: new Date(),
      supportLevel: 'medium'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const moods = [
    { value: 'great', label: 'Great', color: 'bg-green-500' },
    { value: 'good', label: 'Good', color: 'bg-blue-500' },
    { value: 'neutral', label: 'Neutral', color: 'bg-gray-500' },
    { value: 'difficult', label: 'Difficult', color: 'bg-yellow-500' },
    { value: 'struggling', label: 'Struggling', color: 'bg-red-500' }
  ];

  const commonTags = [
    'gratitude', 'progress', 'challenge', 'trigger', 'support',
    'meditation', 'therapy', 'family', 'work', 'self-care',
    'milestone', 'reflection', 'goal', 'recovery', 'healing'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const addJournalEntry = () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentEntry,
      mood: currentMood,
      timestamp: new Date(),
      tags: currentTags,
      supportLevel: calculateSupportLevel(currentEntry)
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry('');
    setCurrentTags([]);

    const systemMessage: ChatMessage = {
      id: Date.now().toString() + '_system',
      content: `Journal entry saved. I notice you're feeling ${currentMood} today. Would you like to talk about what you wrote?`,
      type: 'system',
      timestamp: new Date(),
      supportLevel: 'medium'
    };

    setChatMessages(prev => [...prev, systemMessage]);
  };

  const calculateSupportLevel = (content: string): number => {
    const concerningWords = ['struggling', 'difficult', 'overwhelmed', 'trigger', 'relapse', 'crisis'];
    const positiveWords = ['grateful', 'progress', 'better', 'healing', 'strong', 'hopeful'];
    
    let score = 5;
    
    concerningWords.forEach(word => {
      if (content.toLowerCase().includes(word)) score -= 1;
    });
    
    positiveWords.forEach(word => {
      if (content.toLowerCase().includes(word)) score += 1;
    });
    
    return Math.max(1, Math.min(10, score));
  };

  const sendChatMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      type: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    setTimeout(() => {
      const aiResponse = generateSupportiveResponse(message);
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '_ai',
        content: aiResponse.content,
        type: 'ai',
        timestamp: new Date(),
        supportLevel: aiResponse.level
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateSupportiveResponse = (userMessage: string): { content: string; level: 'low' | 'medium' | 'high' | 'crisis' } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hurt myself') || lowerMessage.includes('suicide') || lowerMessage.includes('end it all')) {
      return {
        content: "I'm very concerned about what you've shared. Your life has value, and there are people who want to help. Please reach out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988. You don't have to go through this alone.",
        level: 'crisis'
      };
    }

    if (lowerMessage.includes('relapse') || lowerMessage.includes('using again') || lowerMessage.includes('can\'t cope')) {
      return {
        content: "Thank you for being honest with me. What you're feeling right now is temporary, even though it doesn't feel that way. Reaching out shows incredible strength. Have you been able to connect with your sponsor or therapist today?",
        level: 'high'
      };
    }

    if (lowerMessage.includes('difficult') || lowerMessage.includes('struggling') || lowerMessage.includes('trigger')) {
      return {
        content: "I hear that you're going through a challenging time. That takes courage to acknowledge. What's one small thing that has helped you get through difficult moments before?",
        level: 'medium'
      };
    }

    if (lowerMessage.includes('good') || lowerMessage.includes('progress') || lowerMessage.includes('grateful')) {
      return {
        content: "It's wonderful to hear about the positive changes you're experiencing. Celebrating these moments, no matter how small, is an important part of recovery. What feels different for you today?",
        level: 'low'
      };
    }

    return {
      content: "Thank you for sharing that with me. I'm here to listen without judgment. Recovery is a journey with ups and downs, and every step forward matters. How are you taking care of yourself today?",
      level: 'medium'
    };
  };

  const handleVoiceInput = (transcript: string) => {
    sendChatMessage(transcript);
  };

  const toggleTag = (tag: string) => {
    setCurrentTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3"
        >
          <Heart className="w-8 h-8 text-pink-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Recovery Support Journal
          </h1>
          <Shield className="w-8 h-8 text-purple-500" />
        </motion.div>
        
        <p className="text-slate-400 max-w-2xl mx-auto">
          A safe, judgment-free space for reflection and support on your recovery journey.
        </p>

        <div className="flex justify-center space-x-2">
          <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
            <Heart className="w-3 h-3 mr-1" />
            Compassionate AI
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Shield className="w-3 h-3 mr-1" />
            Privacy First
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Journal Section */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-pink-500/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-pink-300">
              <MessageCircle className="h-5 w-5" />
              <span>Journal Entry</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Express your thoughts in this safe space
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">How are you feeling?</label>
              <div className="flex flex-wrap gap-2">
                {moods.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setCurrentMood(mood.value)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      currentMood === mood.value
                        ? `${mood.color} text-white`
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="Share what's on your mind..."
                className="min-h-32 bg-slate-800/50 border-slate-600 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {commonTags.map(tag => (
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

            <Button
              onClick={addJournalEntry}
              disabled={!currentEntry.trim()}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          </CardContent>
        </Card>

        {/* Chat Support Section */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-purple-300">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>AI Support</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowVoiceInput(!showVoiceInput)}
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ScrollArea className="h-64 w-full border border-slate-600 rounded-lg">
              <div className="p-4 space-y-3">
                {chatMessages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'system'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            {showVoiceInput && (
              <VoiceInputUniversal
                onTranscriptReceived={handleVoiceInput}
                placeholder="Speak your thoughts..."
                autoSubmit={true}
                showVisualFeedback={true}
              />
            )}

            <div className="flex space-x-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Share what you're feeling..."
                className="bg-slate-800/50 border-slate-600 text-slate-200"
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage(chatInput)}
              />
              <Button
                onClick={() => sendChatMessage(chatInput)}
                disabled={!chatInput.trim()}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-300">
              <Calendar className="h-5 w-5" />
              <span>Recent Entries</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {entries.slice(0, 5).map(entry => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${
                        moods.find(m => m.value === entry.mood)?.color || 'bg-gray-500'
                      }`} />
                      <span className="text-sm text-slate-400">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Level: {entry.supportLevel}/10
                    </Badge>
                  </div>
                  
                  <p className="text-slate-300 mb-2">{entry.content}</p>
                  
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JournalChatRecoverySupport;

