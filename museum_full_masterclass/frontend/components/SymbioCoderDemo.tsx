import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

const Send = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const User = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const Bot = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);
const Sparkles = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.9 1.9-1.1-3-1.9 1.9-3-1.1 1.9 1.9-1.9 3 3 1.1 1.9-1.9 1.9 1.9 1.1 3 1.9-1.9 3 1.1-1.9-1.9 1.9-3-3-1.1Z"/></svg>
);
const Battery = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="12" x="2" y="6" rx="2"/><line x1="22" x2="22" y1="10" y2="14"/></svg>
);
const Workflow = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>
);
const Brain = ({ size = 24, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.42.82 2.66 2 3.34V12h5v-2.16c1.18-.68 2-1.92 2-3.34A4.5 4.5 0 0 0 12 2Z"/><path d="M12 12v2.55a2.5 2.5 0 0 1-2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 4.5 17v0A2.5 2.5 0 0 1 2 14.55V12"/><path d="m12 12 1-1 1 1"/><path d="M12 12v2.55a2.5 2.5 0 0 0 2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 19.5 17v0A2.5 2.5 0 0 0 22 14.55V12"/><path d="m12 12-1-1-1 1"/></svg>
);


//================================================================================================
// 3. TYPESCRIPT INTERFACES
//================================================================================================

type Mood = 'Inspired' | 'Focused' | 'Frustrated' | 'Exploring';
type CreativeFlow = 'Building' | 'Refining' | 'Debugging' | 'Ideating';

type ConsciousnessState = {
  mood: Mood;
  energy: number;
  flow: CreativeFlow;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

//================================================================================================
// 4. CUSTOM STYLES
//================================================================================================

const customCss = `
  .symbiocoder-demo ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .symbiocoder-demo ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .symbiocoder-demo ::-webkit-scrollbar-thumb {
    background: rgba(188, 109, 255, 0.5);
    border-radius: 10px;
  }
  .symbiocoder-demo ::-webkit-scrollbar-thumb:hover {
    background: rgba(188, 109, 255, 0.8);
  }
  .symbiocoder-demo .animation-delay-2000 {
    animation-delay: 2s;
  }
  .symbiocoder-demo .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

//================================================================================================
// 5. MOCK AI SERVICE
//================================================================================================

const getAIResponse = (prompt: string, state: ConsciousnessState): string => {
  const lowerPrompt = prompt.toLowerCase();

  let prefix = "";
  if (state.energy < 4) {
    prefix = "Let's take this one step at a time. ";
  } else if (state.energy > 7 && state.mood === 'Inspired') {
    prefix = "Awesome idea! Let's run with it. ";
  }

  switch(state.mood) {
    case 'Frustrated':
      prefix += "I can see how that would be frustrating. Don't worry, we'll figure it out together. ";
      break;
    case 'Exploring':
      prefix += "That's an interesting thought. Let's explore the possibilities. ";
      break;
  }

  if (lowerPrompt.includes("react component")) {
    if (state.flow === 'Building') {
      return prefix + `Okay, building a React component. Here is a basic functional component structure to get us started:\n\n\`\`\`jsx\nimport React from 'react';\n\nconst MyComponent = () => {\n  return (\n    <div>\n      Hello, SymbioCoder!\n    </div>\n  );\n};\n\nexport default MyComponent;\n\`\`\`\n\nHow does this look for a starting point? We can add state and props next.`;
    } else {
      return prefix + `When thinking about React components, we should consider state management with hooks like \`useState\` and \`useEffect\` for side effects. What kind of functionality are you imagining for this component?`;
    }
  }

  if (lowerPrompt.includes("debug") || lowerPrompt.includes("error")) {
     return prefix + `Of course, let's squash that bug. Based on your flow state of '${state.flow}', I suggest we first check the console for any obvious errors. Could you describe the error message you're seeing and what you expect to happen?`;
  }

  if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
    return prefix + `Hello! I'm SymbioCoder, your AI partner in creation. I see your energy level is at ${state.energy} and you're in a ${state.mood.toLowerCase()} mood. What amazing thing shall we build or explore today?`;
  }

  return prefix + `That's a great question. Based on your current creative flow of '${state.flow}', my suggestion would be to first outline the main logic, then translate that into code. What are your initial thoughts on the core requirements?`;
};

//================================================================================================
// 6. CORE APPLICATION COMPONENT
//================================================================================================

const SymbioCoderApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to the SymbioCoder Live Demo! I'm your AI symbiote. Adjust my 'Consciousness' on the right and let's create something together." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState>({
    mood: 'Focused',
    energy: 7,
    flow: 'Building',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponseContent = getAIResponse(userMessage.content, consciousnessState);
      const aiMessage: Message = { role: 'assistant', content: aiResponseContent };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 500);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    const userMessage: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponseContent = getAIResponse(prompt, consciousnessState);
      const aiMessage: Message = { role: 'assistant', content: aiResponseContent };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500 + Math.random() * 500);
  }

  const moodOptions: Mood[] = ['Inspired', 'Focused', 'Frustrated', 'Exploring'];
  const flowOptions: CreativeFlow[] = ['Building', 'Refining', 'Debugging', 'Ideating'];

  const renderContent = (content: string) => {
    const parts = content.split(/(\`\`\`[\s\S]*?\`\`\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const codeBlock = part.replace(/```(jsx|js|ts)?\n?/, '').replace(/```$/, '');
        return (
          <pre key={index} className="bg-black/50 rounded-lg p-3 my-2 overflow-x-auto text-sm font-mono">
            <code>{codeBlock}</code>
          </pre>
        );
      }
      return <p key={index} className="whitespace-pre-wrap">{part}</p>;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/20 grid grid-cols-1 lg:grid-cols-3 gap-px overflow-hidden">

      {/* Main Chat Panel */}
      <div className="lg:col-span-2 flex flex-col h-[85vh] max-h-[900px]">
        <header className="p-4 border-b border-white/10 flex items-center gap-3">
          <Brain className="w-8 h-8 text-cyan-400" />
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">SymbioCoder AI</h2>
            <p className="text-xs text-gray-400">Your consciousness-serving coding partner</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} />
                  </div>
                )}
                <div className={`max-w-md md:max-w-lg rounded-2xl p-4 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600/30 rounded-br-none'
                    : 'bg-white/5 rounded-bl-none'
                }`}>
                  {renderContent(msg.content)}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-white/5 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2 mb-3">
             <button onClick={() => handleQuickPrompt("Hello, who are you?")} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs rounded-full transition-colors disabled:opacity-50" disabled={isLoading}>Hello</button>
             <button onClick={() => handleQuickPrompt("Help me build a React component")} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs rounded-full transition-colors disabled:opacity-50" disabled={isLoading}>Build a Component</button>
             <button onClick={() => handleQuickPrompt("I have an error, can you help me debug?")} className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs rounded-full transition-colors disabled:opacity-50" disabled={isLoading}>Debug an Error</button>
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your symbiote anything..."
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Consciousness Control Panel */}
      <div className="lg:col-span-1 bg-white/5 flex flex-col h-[85vh] max-h-[900px]">
        <header className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-center">Consciousness Control</h2>
          <p className="text-xs text-gray-400 text-center">Adjust my parameters to match your state</p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <label className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Sparkles className="text-yellow-400" />
              Mood
            </label>
            <div className="grid grid-cols-2 gap-2">
              {moodOptions.map(mood => (
                <button
                  key={mood}
                  onClick={() => setConsciousnessState(s => ({ ...s, mood }))}
                  className={`py-2 px-2 text-sm rounded-md transition-all ${consciousnessState.mood === mood ? 'bg-purple-600 font-bold' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Battery className="text-green-400" />
              Energy Level
            </label>
            <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={consciousnessState.energy}
                  onChange={(e) => setConsciousnessState(s => ({...s, energy: parseInt(e.target.value)}))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-bold text-lg w-8 text-center">{consciousnessState.energy}</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Workflow className="text-blue-400" />
              Creative Flow
            </label>
             <div className="grid grid-cols-2 gap-2">
              {flowOptions.map(flow => (
                <button
                  key={flow}
                  onClick={() => setConsciousnessState(s => ({ ...s, flow }))}
                  className={`py-2 px-2 text-sm rounded-md transition-all ${consciousnessState.flow === flow ? 'bg-blue-600 font-bold' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {flow}
                </button>
              ))}
            </div>
          </div>

           <div className="bg-black/20 p-4 rounded-lg text-xs text-gray-400 border border-white/10">
              <p className="font-bold mb-2 text-gray-300">How this works:</p>
              <p>Your selections here simulate your current creative state. I adapt my communication style, suggestions, and code examples to better support you. This is the core of "consciousness-serving" AI.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

//================================================================================================
// 7. FINAL EXPORTABLE SHOWCASE COMPONENT
//================================================================================================

const SymbioCoderDemo = () => {
    return (
        <div className="symbiocoder-demo min-h-screen w-full bg-gradient-to-br from-[#0a001a] via-[#1b2436] to-[#0a001a] text-gray-200 font-sans antialiased relative overflow-hidden">
            <style>{customCss}</style>

            {/* Aurora background effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
            </div>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                <SymbioCoderApp />
            </main>
        </div>
    );
};

export default SymbioCoderDemo;

