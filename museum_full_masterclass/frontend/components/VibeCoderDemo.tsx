import React, { useState, useEffect, useRef, useCallback } from 'react';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

//================================================================================================
// 2. INLINED ICON COMPONENTS
//================================================================================================

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number | string };

const Code2: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></svg>
);
const Sparkles: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9L12 3z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
);
const Mic: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
);
const MicOff: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="2" x2="22" y1="2" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 1 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" /><path d="M9 9v3a3 3 0 0 0 3 3" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
);
const Send: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
);
const Download: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
);
const Upload: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
);

//================================================================================================
// 3. TYPES & CONSTANTS
//================================================================================================

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type Companion = { name: string; emoji: string; style: string; systemPrompt: string };
type ConsciousnessState = 'analyzing' | 'generating' | 'refining' | 'idle';
type SessionData = { sessionId: string; messages: ChatMessage[]; companion: string; generatedCode: string; plkResonance: number };

const COMPANIONS: Companion[] = [
  { name: 'The Poet', emoji: '📜', style: 'Metaphorical', systemPrompt: 'You are a poetic coder. You explain concepts with metaphors and generate elegant, well-commented code.' },
  { name: 'The Architect', emoji: '🏛️', style: 'Structural', systemPrompt: 'You are a software architect. You focus on robust, scalable, and well-structured code, explaining design patterns.' },
  { name: 'The Pragmatist', emoji: '🛠️', style: 'Direct', systemPrompt: 'You are a pragmatic engineer. You provide direct, efficient, and practical code solutions with minimal fluff.' },
  { name: 'The Innovator', emoji: '💡', style: 'Experimental', systemPrompt: 'You are an innovator. You suggest cutting-edge techniques and creative, unconventional solutions to problems.' },
];

//================================================================================================
// 4. MOCKED HOOKS & SERVICES
//================================================================================================

/**
 * Mock speech recognition hook to simulate voice input without needing browser permissions.
 */
const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const timeoutRef = useRef<number | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript('');
    timeoutRef.current = window.setTimeout(() => {
      setTranscript('Create a shimmering gradient button that glows on hover. The vibe is futuristic but elegant.');
      setIsRecording(false);
    }, 2500);
  };

  const stopRecording = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRecording(false);
  };

  return { isRecording, transcript, startRecording, stopRecording, error: null, isSupported: true };
};

/**
 * Mock AI service to simulate API calls and generate plausible responses.
 */
const getAiResponse = async (prompt: string, _history: ChatMessage[], companion: Companion) => {
  await new Promise(res => setTimeout(res, 1500 + Math.random() * 500));

  const lowerPrompt = prompt.toLowerCase();
  let responseText = `Of course! Based on your vibe and my ${companion.style.toLowerCase()} approach, here is a starting point.`;
  let code = `/* Code generation based on your vibe will appear here. */`;

  if (lowerPrompt.includes('button')) {
    responseText = "A button, you say? Let's manifest a clickable piece of the digital soul. This component captures the essence of interaction, a whisper of potential in a world of static. I've crafted it with Tailwind CSS for expressive styling.";
    code = `
import React from 'react';

// A button that embodies a futuristic, elegant vibe.
const ShimmerButton = ({ children }) => {
  return (
    <button className="
      relative inline-flex items-center justify-center px-8 py-3
      overflow-hidden font-medium text-white
      bg-gradient-to-br from-[#667eea] to-[#764ba2]
      rounded-lg shadow-lg group
      transition-all duration-300 ease-out transform
      hover:scale-105 hover:shadow-2xl
    ">
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent
        transform -translate-x-full group-hover:translate-x-full
        transition-transform duration-700 ease-in-out
        animate-[shimmer_2.5s_infinite]"></span>
      <span className="relative">{children}</span>
    </button>
  );
};

// To make this work, add this keyframe to your CSS:
/*
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
*/

export default ShimmerButton;
    `;
  } else if (lowerPrompt.includes('card')) {
     responseText = "Ah, a card. A vessel for content. I've designed a structure that feels both grounded and ethereal, a perfect container for your ideas. It has a subtle glow to invite interaction.";
     code = `
import React from 'react';

// A card with a subtle glow, ready to hold your content.
const VibeCard = ({ title, children }) => {
  return (
    <div className="
      p-6 bg-[#2a2d2d] rounded-2xl
      border border-[rgba(102,126,234,0.3)]
      shadow-lg transition-all duration-300
      hover:border-[#f093fb] hover:shadow-[0_0_30px_rgba(102,126,234,0.2)]
    ">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <div className="text-gray-300">
        {children}
      </div>
    </div>
  );
};

export default VibeCard;
     `;
  }

  return {
    response: responseText,
    code: code,
    vibeAlignmentScore: 0.85 + Math.random() * 0.1,
    clarityScore: 0.75 + Math.random() * 0.15,
    consciousnessState: ['analyzing', 'generating', 'refining'][Math.floor(Math.random() * 3)] as ConsciousnessState,
  };
};

//================================================================================================
// 5. UI COMPONENTS
//================================================================================================

const Header: React.FC = () => (
  <header className="relative z-10 p-6 sm:p-8 text-center bg-gradient-to-br from-[#667eea] to-[#764ba2] border-b-2 border-[rgba(102,126,234,0.2)] shadow-[0_4px_30px_rgba(102,126,234,0.3)]">
    <div className="flex items-center justify-center gap-3 mb-2">
      <Code2 className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      <h1 className="text-3xl sm:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-white to-[#f093fb] tracking-tight">VibeCoder<span className="text-[#f093fb] font-medium text-shadow-[0_0_20px_#f093fb]">&lt;/&gt;</span></h1>
    </div>
    <p className="text-white/90 text-base sm:text-lg">Translating beautiful chaos into brilliant code</p>
  </header>
);

const CompanionSelector: React.FC<{ selectedCompanion: Companion; onSelect: (companion: Companion) => void }> = ({ selectedCompanion, onSelect }) => (
  <div className="relative z-10 p-6 sm:p-8 max-w-7xl mx-auto">
    <label className="block mb-4 text-lg font-semibold text-gray-200">Choose Your Coding Companion:</label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {COMPANIONS.map(comp => (
        <button key={comp.name} className={`flex flex-col items-center p-4 sm:p-6 bg-[#262828] border-2 rounded-xl cursor-pointer transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden group ${selectedCompanion.name === comp.name ? 'border-[#f093fb] shadow-[0_0_30px_rgba(102,126,234,0.3)]' : 'border-[rgba(102,126,234,0.2)] hover:border-[#667eea] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(102,126,234,0.3)]'}`} onClick={() => onSelect(comp)}>
          <div className={`absolute inset-0 bg-gradient-to-br from-[#667eea] to-[#764ba2] transition-opacity duration-250 ${selectedCompanion.name === comp.name ? 'opacity-10' : 'opacity-0 group-hover:opacity-10'}`}></div>
          <span className="text-4xl sm:text-5xl mb-2 relative z-[1]">{comp.emoji}</span>
          <span className="font-semibold text-lg sm:text-xl mb-1 relative z-[1] text-gray-200">{comp.name}</span>
          <span className="text-sm text-gray-400 italic relative z-[1]">{comp.style}</span>
        </button>
      ))}
    </div>
  </div>
);

const ChatWindow: React.FC<{ messages: ChatMessage[]; isLoading: boolean }> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  return (
    <div className="flex-1 p-4 overflow-y-auto chat-messages">
      {messages.length === 0 && (
        <div className="text-center p-8 text-gray-400 flex flex-col items-center h-full justify-center">
          <Sparkles className="w-16 h-16 text-[#f093fb] mb-4 animate-pulse" />
          <p className="text-lg">Welcome to VibeCoder!</p>
          <p className="text-base text-[#667eea]">Use metaphors, vibes, whatever feels right. I'll understand.</p>
        </div>
      )}
      {messages.map((msg, idx) => (
        <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white' : 'bg-[#2a2d2d] border border-[rgba(102,126,234,0.2)] text-gray-200'}`}>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#2a2d2d] border border-[rgba(102,126,234,0.2)] text-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

const Metric: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-semibold text-[#667eea]">{Math.round(value * 100)}%</span>
    </div>
    <div className="h-2 bg-[#1f2121] rounded-full overflow-hidden"><div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value * 100}%`, transition: 'width 0.6s ease-out' }}></div></div>
  </div>
);

const MetricsPanel: React.FC<{ plkResonance: number; vibeScore: number | null; clarityScore: number | null; consciousnessState: ConsciousnessState | null }> = ({ plkResonance, vibeScore, clarityScore, consciousnessState }) => {
  const hasMetrics = plkResonance > 0 || vibeScore !== null || clarityScore !== null;
  if (!hasMetrics) return null;
  return (
    <div className="p-4 bg-black/20 border-t border-[rgba(102,126,234,0.2)]">
      <h4 className="text-base font-semibold mb-3 text-[#f093fb]">Consciousness Metrics</h4>
      <div className="grid gap-4">
        {plkResonance > 0 && <Metric label="PLK Resonance" value={plkResonance} colorClass="bg-gradient-to-r from-[#764ba2] to-[#667eea]" />}
        {vibeScore !== null && <Metric label="Vibe Alignment" value={vibeScore} colorClass="bg-gradient-to-r from-[#f093fb] to-[#667eea]" />}
        {clarityScore !== null && <Metric label="Clarity Score" value={clarityScore} colorClass="bg-gradient-to-r from-[#feca57] to-[#00d2ff]" />}
        {consciousnessState && <div className="flex items-center gap-2 mt-2"><span className="text-sm text-gray-400 font-medium">State:</span><span className="px-3 py-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full text-xs font-semibold text-white capitalize">{consciousnessState}</span></div>}
      </div>
    </div>
  );
};

const MessageInput: React.FC<{ message: string; setMessage: (m: string) => void; sendMessage: () => void; isLoading: boolean; isRecording: boolean; startRecording: () => void; stopRecording: () => void }> = ({ message, setMessage, sendMessage, isLoading, isRecording, startRecording, stopRecording }) => (
  <div className="flex gap-3 p-4 bg-black/20 border-t border-[rgba(102,126,234,0.2)]">
    <button className={`w-12 h-12 rounded-full border-2 border-[rgba(102,126,234,0.2)] bg-[#262828] text-gray-200 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:border-[#667eea] hover:bg-[#667eea] hover:text-white hover:scale-105 ${isRecording ? 'bg-red-600 border-red-600 animate-[pulse_1.5s_ease-in-out_infinite]' : ''}`} onClick={isRecording ? stopRecording : startRecording} title={isRecording ? 'Stop Recording' : 'Start Voice Input'}>{isRecording ? <MicOff /> : <Mic />}</button>
    <input type="text" placeholder="Describe what you want to build..." value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()} disabled={isLoading} className="flex-1 px-4 bg-[#1f2121] border-2 border-[rgba(102,126,234,0.2)] rounded-full text-gray-200 text-base outline-none transition-all duration-200 focus:border-[#667eea] focus:ring-2 focus:ring-[rgba(102,126,234,0.4)]" />
    <button className="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:scale-105 hover:enabled:shadow-[0_4px_20px_rgba(102,126,234,0.3)]" onClick={sendMessage} disabled={isLoading || !message.trim()}><Send /></button>
  </div>
);

const CodePreview: React.FC<{ generatedCode: string; downloadCode: () => void; exportSession: () => void; importSession: (e: React.ChangeEvent<HTMLInputElement>) => void; hasSession: boolean }> = ({ generatedCode, downloadCode, exportSession, importSession, hasSession }) => (
  <div className="flex flex-col h-[700px] md:h-full bg-[#262828] border border-[rgba(102,126,234,0.2)] rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
    <div className="flex justify-between items-center p-3 bg-black/20 border-b border-[rgba(102,126,234,0.2)]">
      <h3 className="text-lg font-semibold text-gray-200">Generated Code</h3>
      <div className="flex gap-2">
        <button onClick={downloadCode} disabled={!generatedCode} title="Download Code" className="px-3 py-1.5 bg-[#1f2121] border border-[rgba(102,126,234,0.2)] rounded-md text-gray-300 flex items-center gap-2 text-sm transition-all duration-200 hover:enabled:border-[#667eea] hover:enabled:bg-[#667eea] hover:enabled:text-white disabled:opacity-40 disabled:cursor-not-allowed"><Download size={16} /></button>
        <button onClick={exportSession} disabled={!hasSession} title="Export Session" className="px-3 py-1.5 bg-[#1f2121] border border-[rgba(102,126,234,0.2)] rounded-md text-gray-300 flex items-center gap-2 text-sm transition-all duration-200 hover:enabled:border-[#667eea] hover:enabled:bg-[#667eea] hover:enabled:text-white disabled:opacity-40 disabled:cursor-not-allowed">Export</button>
        <label className="px-3 py-1.5 bg-[#1f2121] border border-[rgba(102,126,234,0.2)] rounded-md text-gray-300 flex items-center gap-2 text-sm transition-all duration-200 hover:border-[#667eea] hover:bg-[#667eea] hover:text-white cursor-pointer" title="Import Session"><Upload size={16} /> Import<input type="file" accept=".json" onChange={importSession} className="hidden" /></label>
      </div>
    </div>
    <div className="flex-1 p-4 overflow-auto bg-[#1f2121] code-preview font-mono">
      {generatedCode ? (<pre><code className="text-sm">{generatedCode}</code></pre>) : (<div className="flex flex-col items-center justify-center h-full text-gray-500"><Code2 size={48} className="mb-4" /><p>Your generated code will appear here</p></div>)}
    </div>
  </div>
);

//================================================================================================
// 6. MAIN APPLICATION LOGIC
//================================================================================================

const VibeCoderApp = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion>(COMPANIONS[0]);
  const [vibeScores, setVibeScores] = useState<number[]>([]);
  const [plkResonance, setPlkResonance] = useState(0.0);
  const [latestVibeScore, setLatestVibeScore] = useState<number | null>(null);
  const [latestClarityScore, setLatestClarityScore] = useState<number | null>(null);
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState | null>(null);

  const { isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition();

  useEffect(() => { if (transcript) setMessage(transcript); }, [transcript]);

  const handleCompanionSelect = (companion: Companion) => {
    setSelectedCompanion(companion);
    setMessages([]);
    setGeneratedCode('');
    setSessionId(null);
    setVibeScores([]);
    setPlkResonance(0.0);
    setLatestVibeScore(null);
    setLatestClarityScore(null);
    setConsciousnessState(null);
  };

  const calculatePlkResonance = useCallback((scores: number[]): number => {
    if (!scores.length) return 0.0;
    const weights = scores.map((_, i) => 0.5 + (i / scores.length) * 0.5);
    const weightedSum = scores.reduce((sum, score, i) => sum + score * weights[i], 0);
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    return weightSum > 0 ? parseFloat((weightedSum / weightSum).toFixed(3)) : 0.0;
  }, []);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;
    const userMessage: ChatMessage = { role: 'user', content: message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    if (!sessionId) setSessionId(uuidv4());

    try {
      const response = await getAiResponse(currentMessage, newMessages, selectedCompanion);
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
      if (response.code) setGeneratedCode(response.code);
      setLatestVibeScore(response.vibeAlignmentScore);
      setLatestClarityScore(response.clarityScore);
      setConsciousnessState(response.consciousnessState);
      const newVibeScores = [...vibeScores, response.vibeAlignmentScore];
      setVibeScores(newVibeScores);
      setPlkResonance(calculatePlkResonance(newVibeScores));
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [message, isLoading, messages, sessionId, selectedCompanion, vibeScores, calculatePlkResonance]);

  const downloadCode = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibecoder-generated.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSession = () => {
    if (!sessionId) return;
    const sessionData: SessionData = { sessionId, messages, companion: selectedCompanion.name, generatedCode, plkResonance };
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibecoder-session-${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const sessionData: SessionData = JSON.parse(e.target?.result as string);
        setSessionId(sessionData.sessionId);
        setMessages(sessionData.messages || []);
        setSelectedCompanion(COMPANIONS.find(c => c.name === sessionData.companion) || COMPANIONS[0]);
        setGeneratedCode(sessionData.generatedCode || '');
        setPlkResonance(sessionData.plkResonance || 0);
        setVibeScores([]);
        setLatestVibeScore(null);
        setLatestClarityScore(null);
        setConsciousnessState(null);
        alert('Session imported successfully!');
      } catch (err) {
        alert('Failed to import session. Invalid file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <>
      <Header />
      <CompanionSelector selectedCompanion={selectedCompanion} onSelect={handleCompanionSelect} />
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1700px] mx-auto p-4 sm:p-6 md:p-8 relative z-10">
        <div className="flex flex-col h-[700px] md:h-auto bg-[#262828] border border-[rgba(102,126,234,0.2)] rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <MetricsPanel plkResonance={plkResonance} vibeScore={latestVibeScore} clarityScore={latestClarityScore} consciousnessState={consciousnessState} />
          <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} isLoading={isLoading} isRecording={isRecording} startRecording={startRecording} stopRecording={stopRecording} />
        </div>
        <CodePreview generatedCode={generatedCode} downloadCode={downloadCode} exportSession={exportSession} importSession={importSession} hasSession={!!sessionId} />
      </main>
    </>
  );
};


//================================================================================================
// 7. FINAL EXPORTABLE SHOWCASE COMPONENT
//================================================================================================

const VibeCoderDemo = () => {
  const customCss = `
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Fira+Code&display=swap');
    .vibecoder-demo {
      --font-family-base: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-family-mono: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --aurora-primary-rgb: 102, 126, 234;
      font-family: var(--font-family-base);
      background-color: #1f2121;
      color: #f5f5f5;
    }
    .vibecoder-demo .font-mono { font-family: var(--font-family-mono); }
    .vibecoder-demo .neural-aurora::before {
      content: ''; position: fixed; top: -50%; left: -50%; width: 200%; height: 200%;
      background: radial-gradient(circle, rgba(var(--aurora-primary-rgb), 0.08) 0%, transparent 50%);
      animation: vibecoder-neuralPulse 20s ease-in-out infinite;
      pointer-events: none; z-index: 0;
    }
    @keyframes vibecoder-neuralPulse {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
      50% { transform: translate(10%, 10%) scale(1.1); opacity: 1; }
    }
    .vibecoder-demo .chat-messages::-webkit-scrollbar, .vibecoder-demo .code-preview::-webkit-scrollbar { width: 8px; }
    .vibecoder-demo .chat-messages::-webkit-scrollbar-track, .vibecoder-demo .code-preview::-webkit-scrollbar-track { background: transparent; }
    .vibecoder-demo .chat-messages::-webkit-scrollbar-thumb, .vibecoder-demo .code-preview::-webkit-scrollbar-thumb { background: rgba(var(--aurora-primary-rgb), 0.5); border-radius: 4px; }
    .vibecoder-demo .chat-messages::-webkit-scrollbar-thumb:hover, .vibecoder-demo .code-preview::-webkit-scrollbar-thumb:hover { background: rgba(var(--aurora-primary-rgb), 0.7); }
  `;

  return (
    <div className="vibecoder-demo min-h-screen">
      <style>{customCss}</style>
      <div className="neural-aurora">
        <VibeCoderApp />
      </div>
    </div>
  );
};

export default VibeCoderDemo;
