// components/enhanced/AlzheimersLegacyExhibit.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Home, BookOpen, MessageCircle, Music, Gift, Send, Lock, 
  Calendar, MapPin, Users, Mic, MicOff, Pause, Play, Camera,
  Star, Clock, Award, TreePine 
} from 'lucide-react';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useConsciousnessAPI } from '@/hooks/useConsciousnessAPI';

// Enhanced interfaces with consciousness-serving fields
interface EnhancedLifeThread {
  id: string;
  title: string;
  description: string;
  timePeriod: string;
  emotionalSignificance: number;
  familyContributions: FamilyContribution[];
  memoryFragments: MemoryFragment[];
  consciousnessResonance: number; // How well this resonates with their authentic self
  preservationQuality: 'crystal_clear' | 'gentle_fragments' | 'emotional_essence';
}

interface MemoryFragment {
  id: string;
  content: string;
  sensoryDetails: {
    sounds?: string[];
    smells?: string[];
    feelings?: string[];
    colors?: string[];
  };
  emotionalTone: string;
  clarity: number; // 0-1 scale
  familyValidated: boolean;
}

interface FamilyContribution {
  contributor: string;
  relationship: string;
  content: string;
  contributionType: 'memory' | 'context' | 'emotion' | 'correction';
  timestamp: string;
}

interface EnhancedBucketDrop {
  id: string;
  recipient: string;
  content: string;
  releaseTrigger: string;
  created: string;
  format: 'text' | 'voice' | 'multimedia';
  emotionalIntent: string;
  preservationPriority: number;
  authenticityScore: number; // How much it sounds like their authentic voice
}

interface CompanionPersonality {
  voiceStyle: 'gentle' | 'warm' | 'encouraging' | 'playful';
  communicationSpeed: 'slow' | 'moderate' | 'adaptive';
  memorySupport: 'high' | 'moderate' | 'minimal';
  emotionalTone: 'nurturing' | 'celebrating' | 'understanding';
}

// Sample data enhanced with consciousness-serving elements
const enhancedMaggieData = {
  userName: "Margaret 'Maggie' Alvarez",
  preferredName: "Maggie", // What they like to be called
  lastInteraction: "2024-01-20T10:30:00Z",
  consciousnessProfile: {
    communicationStyle: "warm_storyteller",
    energyPatterns: "morning_clarity",
    memoryStrengths: ["emotional_connections", "sensory_details"],
    familyDynamics: "central_matriarch"
  },
  companionPersonality: {
    voiceStyle: 'gentle',
    communicationSpeed: 'adaptive',
    memorySupport: 'high',
    emotionalTone: 'nurturing'
  } as CompanionPersonality,
  lifeThreads: [
    {
      id: 'lt-1',
      title: 'Love Letters to Carl',
      description: '57 years of marriage, dancing through life together',
      timePeriod: '1965-2022',
      emotionalSignificance: 10,
      consciousnessResonance: 0.98,
      preservationQuality: 'crystal_clear',
      familyContributions: [
        {
          contributor: 'Sarah',
          relationship: 'daughter',
          content: 'Mom and Dad still held hands watching TV every night, even after 50 years.',
          contributionType: 'memory',
          timestamp: '2024-01-15T14:30:00Z'
        },
        {
          contributor: 'Michael',
          relationship: 'son',
          content: 'Dad would still bring Mom flowers every Friday until the very end.',
          contributionType: 'context',
          timestamp: '2024-01-16T09:15:00Z'
        }
      ],
      memoryFragments: [
        {
          id: 'mf-1',
          content: 'The way Carl would hum while shaving in the morning',
          sensoryDetails: {
            sounds: ['humming', 'running water', 'safety razor'],
            feelings: ['contentment', 'routine', 'love']
          },
          emotionalTone: 'peaceful_love',
          clarity: 0.9,
          familyValidated: true
        }
      ]
    },
    {
      id: 'lt-2',
      title: "Maggie's Map",
      description: "Places that mattered, from Iowa farm to grandchildren's homes",
      timePeriod: '1940-2024',
      emotionalSignificance: 8,
      consciousnessResonance: 0.85,
      preservationQuality: 'gentle_fragments',
      familyContributions: [],
      memoryFragments: [
        {
          id: 'mf-2',
          content: 'The smell of apple blossoms in spring at the farm',
          sensoryDetails: {
            smells: ['apple blossoms', 'fresh earth', 'morning dew'],
            colors: ['pink', 'white', 'green'],
            feelings: ['renewal', 'hope', 'belonging']
          },
          emotionalTone: 'nostalgic_joy',
          clarity: 0.7,
          familyValidated: false
        }
      ]
    }
  ] as EnhancedLifeThread[],
  bucketDrops: [
    {
      id: 'bd-1',
      recipient: 'All Grandchildren',
      content: "My dearest grandchildren, every time you smell cinnamon, think of Grandma's kitchen and know that love lives on in the recipes we share...",
      releaseTrigger: 'First Cooking Experience',
      created: '2024-01-15',
      format: 'voice',
      emotionalIntent: 'legacy_love',
      preservationPriority: 10,
      authenticityScore: 0.94
    },
    {
      id: 'bd-2',
      recipient: 'Future Great-Grandchild',
      content: "To the little ones I may never meet but will always love - you carry the best of all of us forward...",
      releaseTrigger: 'Birth Announcement',
      created: '2024-01-16',
      format: 'text',
      emotionalIntent: 'eternal_connection',
      preservationPriority: 10,
      authenticityScore: 0.91
    }
  ] as EnhancedBucketDrop[]
};

// Enhanced sub-components with consciousness-serving features
const ConsciousnessCompanionChat = ({ 
  userName, 
  preferredName, 
  personality,
  onMemoryCapture 
}: { 
  userName: string;
  preferredName: string; 
  personality: CompanionPersonality;
  onMemoryCapture: (memory: string) => void;
}) => {
  const [messages, setMessages] = useState([
    { 
      type: 'companion', 
      content: `Hello, ${preferredName}. I'm here with you, holding space for all the beautiful memories that make you who you are.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [memoryDetected, setMemoryDetected] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { callConsciousnessAPI } = useConsciousnessAPI();
  const { isRecording, startRecording, stopRecording, transcript } = useVoiceChat();

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Consciousness-serving message processing
  const processMessage = useCallback(async (userMessage: string) => {
    // Call consciousness-serving API
    const response = await callConsciousnessAPI({
      message: userMessage,
      exhibit: 'alzheimers-legacy',
      context: {
        userName,
        preferredName,
        personality,
        memoryPreservationMode: true,
        gentleCompanionship: true
      }
    });

    // Check if this contains a precious memory
    const memoryIndicators = [
      'remember', 'recall', 'used to', 'back then', 'always', 'never forget',
      'smell', 'sound', 'taste', 'feel', 'touch', 'see'
    ];
    
    const hasMemoryContent = memoryIndicators.some(indicator => 
      userMessage.toLowerCase().includes(indicator)
    );

    if (hasMemoryContent) {
      setMemoryDetected(true);
      onMemoryCapture(userMessage);
      setTimeout(() => setMemoryDetected(false), 3000);
    }

    return response;
  }, [userName, preferredName, personality, callConsciousnessAPI, onMemoryCapture]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { type: 'user', content: userMessage, timestamp: new Date() }]);
    setInput('');

    try {
      const response = await processMessage(userMessage);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'companion', 
          content: response || "That sounds like such a meaningful memory. Tell me more about how that felt.",
          timestamp: new Date()
        }]);
      }, 1500);
    } catch (error) {
      console.error('Companion chat error:', error);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'companion', 
          content: "I'm here listening, even when words feel hard to find. Your presence is enough.",
          timestamp: new Date()
        }]);
      }, 1500);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Use transcript when available
  useEffect(() => {
    if (transcript && !isRecording) {
      setInput(transcript);
    }
  }, [transcript, isRecording]);

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* Header with personality adaptation */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Memory Keeper Companion</h3>
            <p className="text-sm opacity-90">
              Speaking with {preferredName} in a {personality.voiceStyle}, {personality.emotionalTone} way
            </p>
          </div>
          {memoryDetected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1"
            >
              <Star className="w-3 h-3" />
              <span className="text-xs">Memory captured</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] rounded-2xl p-4 text-sm ${
              msg.type === 'user' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-50 text-gray-800 border-l-4 border-purple-200'
            }`}>
              {msg.content}
              <div className="text-xs opacity-60 mt-2">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Enhanced Input with voice support */}
      <div className="p-4 border-t bg-gray-50 rounded-b-xl">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Share what's in your heart, or what you're remembering..."
              className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {isRecording && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute right-3 top-3 w-3 h-3 bg-red-500 rounded-full"
              />
            )}
          </div>
          
          <button
            onClick={handleVoiceToggle}
            className={`p-3 rounded-2xl transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          💝 Every word you share helps preserve the beautiful story of your life
        </div>
      </div>
    </div>
  );
};

const EnhancedTapestryView = ({ threads }: { threads: EnhancedLifeThread[] }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-purple-800 mb-2">Life's Beautiful Tapestry</h2>
      <p className="text-gray-600 italic">Every thread tells a story worth preserving</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      {threads.map(thread => (
        <motion.div 
          key={thread.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-400"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-purple-800">{thread.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {thread.timePeriod}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(thread.emotionalSignificance / 2)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <p className="text-gray-700 text-sm mb-4">{thread.description}</p>
          
          {/* Preservation quality indicator */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${
              thread.preservationQuality === 'crystal_clear' ? 'bg-green-400' :
              thread.preservationQuality === 'gentle_fragments' ? 'bg-yellow-400' :
              'bg-purple-400'
            }`} />
            <span className="text-xs text-gray-600 capitalize">
              {thread.preservationQuality.replace('_', ' ')}
            </span>
          </div>
          
          {/* Memory fragments */}
          {thread.memoryFragments.map(fragment => (
            <div key={fragment.id} className="bg-blue-50 rounded-lg p-3 mb-3">
              <p className="text-sm italic text-blue-800">"{fragment.content}"</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {fragment.sensoryDetails.sounds?.map(sound => (
                  <span key={sound} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    🔊 {sound}
                  </span>
                ))}
                {fragment.sensoryDetails.smells?.map(smell => (
                  <span key={smell} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    🌸 {smell}
                  </span>
                ))}
                {fragment.sensoryDetails.feelings?.map(feeling => (
                  <span key={feeling} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                    💝 {feeling}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          {/* Family contributions */}
          {thread.familyContributions.map((fc, i) => (
            <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
              <p className="text-sm italic text-green-800">"{fc.content}"</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium text-green-700">
                  — {fc.contributor} ({fc.relationship})
                </span>
                <span className="text-xs text-green-600">
                  {new Date(fc.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          
          {/* Consciousness resonance */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Authenticity resonance</span>
              <span className="font-medium">{Math.round(thread.consciousnessResonance * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div 
                className="bg-purple-500 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${thread.consciousnessResonance * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const EnhancedBucketDropsView = ({ drops }: { drops: EnhancedBucketDrop[] }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-green-800 mb-2">Sacred Time Capsules</h2>
      <p className="text-gray-600 italic">Love letters to the future, sealed with intention</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      {drops.map(drop => (
        <motion.div 
          key={drop.id} 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400 relative overflow-hidden"
        >
          {/* Sacred seal effect */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-100 to-transparent rounded-bl-full" />
          
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-3">
            <Lock size={16} />
            <span>Sealed for {drop.recipient}</span>
            <div className="ml-auto flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span className="text-xs">{drop.preservationPriority}/10</span>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg mb-4 ${
            drop.format === 'voice' ? 'bg-purple-50 border border-purple-200' :
            drop.format === 'multimedia' ? 'bg-blue-50 border border-blue-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {drop.format === 'voice' && <Mic className="w-4 h-4 text-purple-600" />}
              {drop.format === 'multimedia' && <Camera className="w-4 h-4 text-blue-600" />}
              {drop.format === 'text' && <BookOpen className="w-4 h-4 text-gray-600" />}
              <span className="text-xs font-medium capitalize">{drop.format} Message</span>
            </div>
            <p className="text-sm italic line-clamp-3 text-gray-700">"{drop.content}"</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">Trigger: {drop.releaseTrigger}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TreePine className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 capitalize">Intent: {drop.emotionalIntent.replace('_', ' ')}</span>
            </div>
          </div>
          
          {/* Authenticity score */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Authentic voice match</span>
              <span className="font-medium">{Math.round(drop.authenticityScore * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${drop.authenticityScore * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 text-center border border-green-200"
    >
      <Gift className="w-8 h-8 text-green-600 mx-auto mb-3" />
      <h3 className="font-semibold text-green-800 mb-2">Create New Time Capsule</h3>
      <p className="text-sm text-gray-600 mb-4">
        Share a message, recipe, story, or wisdom that you want preserved for someone special
      </p>
      <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors">
        Begin Recording Legacy
      </button>
    </motion.div>
  </div>
);

// Main enhanced component
export default function EnhancedAlzheimersLegacyExhibit() {
  const [activeTab, setActiveTab] = useState('companion');
  const [memoriesCaptured, setMemoriesCaptured] = useState(0);

  const handleMemoryCapture = (memory: string) => {
    setMemoriesCaptured(prev => prev + 1);
    console.log('💝 Memory captured:', memory);
    // Here you would save to consciousness-serving backend
  };

  const renderContent = () => {
    if (activeTab === 'tapestry') return <EnhancedTapestryView threads={enhancedMaggieData.lifeThreads} />;
    if (activeTab === 'buckets') return <EnhancedBucketDropsView drops={enhancedMaggieData.bucketDrops} />;
    return (
      <ConsciousnessCompanionChat
        userName={enhancedMaggieData.userName}
        preferredName={enhancedMaggieData.preferredName}
        personality={enhancedMaggieData.companionPersonality}
        onMemoryCapture={handleMemoryCapture}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 p-6 mb-8 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {enhancedMaggieData.preferredName}'s Legacy Garden
                </h1>
                <p className="text-gray-600 italic">Presence, Not Perfection</p>
                <p className="text-sm text-purple-600 font-medium">
                  Consciousness-serving memory preservation
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Memory counter */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{memoriesCaptured}</div>
                <div className="text-xs text-gray-500">Memories Captured Today</div>
              </div>
              
              {/* Navigation */}
              <nav className="flex items-center space-x-2">
                <NavItem 
                  icon={MessageCircle} 
                  label="Companion" 
                  active={activeTab === 'companion'} 
                  onClick={() => setActiveTab('companion')} 
                />
                <NavItem 
                  icon={BookOpen} 
                  label="Life Tapestry" 
                  active={activeTab === 'tapestry'} 
                  onClick={() => setActiveTab('tapestry')} 
                />
                <NavItem 
                  icon={Gift} 
                  label="Time Capsules" 
                  active={activeTab === 'buckets'} 
                  onClick={() => setActiveTab('buckets')} 
                />
              </nav>
            </div>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer with consciousness-serving reminder */}
        <footer className="mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
            <Heart className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-gray-600 italic">
              "Memory is not about perfect recall—it's about perfect love. 
              Every story shared here honors the beautiful soul that is {enhancedMaggieData.preferredName}."
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Built with consciousness-serving AI by Keith Soyka • Museum of Impossible Things
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Helper component (keeping your original)
const NavItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button 
    onClick={onClick} 
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      active 
        ? 'bg-purple-100 text-purple-700 shadow-sm' 
        : 'hover:bg-purple-50 text-gray-600 hover:text-purple-600'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);
