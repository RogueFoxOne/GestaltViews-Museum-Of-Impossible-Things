import React, { useState, useEffect, useRef, useCallback } from 'react';

const customCss = `
  .resume-rockstar-demo ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .resume-rockstar-demo ::-webkit-scrollbar-track {
    background: #0f172a; /* slate-900 */
  }
  .resume-rockstar-demo ::-webkit-scrollbar-thumb {
    background: #334155; /* slate-700 */
    border-radius: 4px;
  }
  .resume-rockstar-demo ::-webkit-scrollbar-thumb:hover {
    background: #475569; /* slate-600 */
  }
  .resume-rockstar-demo .glass-card {
    background: rgba(15, 23, 42, 0.6); /* bg-slate-900/60 */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(51, 65, 85, 0.5); /* border-slate-700/50 */
  }
  .resume-rockstar-demo .neural-aurora-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    z-index: 0;
    overflow: hidden;
  }
  .resume-rockstar-demo .neural-aurora-bg div {
    position: absolute;
    border-radius: 9999px;
    filter: blur(80px);
  }
`;

//================================================================================================
// 2. TYPESCRIPT INTERFACES
//================================================================================================

type IconProps = {
  className?: string;
};

type Message = {
  id: string;
  type: 'ai' | 'user';
  content: string;
  resonanceScore?: number;
};

type Experience = {
  title: string;
  bulletPoints: string[];
};

type ResumeData = {
  summary: string;
  skills: string[];
  experience: Experience[];
};

//================================================================================================
// 3. MOCK AI SERVICE
//================================================================================================

/**
 * A mock AI service to simulate generating responses and extracting resume data.
 */
const generateAiResponse = async (userInput: string): Promise<{
  response: string;
  resonanceScore: number;
  extractedSkills: string[];
  newExperienceBullet: string | null;
}> => {
  // Simulate network delay for realism
  await new Promise(res => setTimeout(res, 1500));

  const lowerInput = userInput.toLowerCase();
  const allPossibleSkills = ['Project Management', 'React', 'TypeScript', 'Agile Methodologies', 'Leadership', 'Sales Strategy', 'UI/UX Design', 'Data Analysis'];
  const extractedSkills = allPossibleSkills.filter(skill => lowerInput.includes(skill.toLowerCase().split(' ')[0]));

  const resonanceScore = Math.random() * 20 + 75; // 75-95%

  let response = "That's a fantastic experience! Let's break that down using the STAR method. What was the specific *Situation* you were in?";
  let newExperienceBullet = null;

  if (lowerInput.includes('led a team') || lowerInput.includes('managed a project')) {
    response = "Excellent example of leadership. How did you measure the *Result* of that project? What was the quantifiable impact?";
    newExperienceBullet = `Spearheaded a cross-functional team to deliver a key project ahead of schedule, resulting in a 15% increase in user engagement.`;
    if (!extractedSkills.includes('Team Leadership')) extractedSkills.push('Team Leadership');
  } else if (lowerInput.includes('react') || lowerInput.includes('frontend')) {
     response = "Great! It sounds like you have strong technical skills. Can you tell me more about the *Task* you were assigned in that project? What was the goal?";
     newExperienceBullet = `Developed and launched a new user-facing feature using React and TypeScript, improving application performance by 25%.`;
  } else if (lowerInput.includes('sales') || lowerInput.includes('revenue')) {
    response = "That's impactful! What *Actions* did you personally take to achieve that result? Let's get specific.";
    newExperienceBullet = `Drove a 40% increase in quarterly revenue by implementing a new, targeted sales strategy and nurturing key client relationships.`;
    if (!extractedSkills.includes('Sales Strategy')) extractedSkills.push('Sales Strategy');
  }

  return {
    response,
    resonanceScore,
    extractedSkills,
    newExperienceBullet,
  };
};

//================================================================================================
// 4. ICON COMPONENTS
//================================================================================================

const SendIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/></svg>
);

const BrainIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.42.82 2.66 2 3.34V12h5v-2.16c1.18-.68 2-1.92 2-3.34A4.5 4.5 0 0 0 12 2Z"/><path d="M12 12v2.55a2.5 2.5 0 0 1-2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 4.5 17v0A2.5 2.5 0 0 1 2 14.55V12"/><path d="m12 12 1-1 1 1"/><path d="M12 12v2.55a2.5 2.5 0 0 0 2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 19.5 17v0A2.5 2.5 0 0 0 22 14.55V12"/><path d="m12 12-1-1-1 1"/></svg>
);

const SparklesIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 1.9-1.1-3-1.9 1.9-3-1.1 1.9 1.9-1.9 3 3 1.1 1.9-1.9 1.9 1.9 1.1 3 1.9-1.9 3 1.1-1.9-1.9 1.9-3-3-1.1Z"/></svg>
);

const DownloadIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

//================================================================================================
// 5. UI PANEL COMPONENTS
//================================================================================================

//--- ChatPanel and its sub-components ---//

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <div className={`mb-6 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-xl p-4 rounded-2xl ${
        message.type === 'user'
          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-br-md'
          : 'glass-card text-gray-100 rounded-bl-md'
      }`}
    >
      <p className="whitespace-pre-wrap">{message.content}</p>
      {message.resonanceScore && (
        <div className="mt-2 text-xs opacity-70 flex items-center gap-1">
          <SparklesIcon className="w-3 h-3" />
          Resonance: {Math.round(message.resonanceScore)}%
        </div>
      )}
    </div>
  </div>
);

const LoadingIndicator: React.FC = () => (
  <div className="flex justify-start mb-6">
    <div className="glass-card p-4 rounded-2xl rounded-bl-md">
      <div className="flex items-center gap-2">
        <BrainIcon className="w-5 h-5 text-teal-400 animate-pulse" />
        <span className="text-gray-300">Thinking with consciousness...</span>
      </div>
    </div>
  </div>
);

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  inputValue,
  onInputChange,
  onSendMessage,
  messagesEndRef,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl w-full lg:w-3/5">
      <header className="glass-card p-6 m-4 rounded-2xl flex-shrink-0">
        <h1 className="text-2xl font-bold text-white mb-1">Discovery Chat</h1>
        <p className="text-gray-300">Let's uncover your professional superpowers</p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {messages.map(message => <ChatMessage key={message.id} message={message} />)}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 flex-shrink-0">
        <div className="glass-card p-2 rounded-2xl">
          <div className="flex items-end gap-3 p-2">
            <textarea
              value={inputValue}
              onChange={onInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Tell me about your experience..."
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[40px] max-h-[120px]"
              rows={Math.min(5, inputValue.split('\n').length)}
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              onClick={onSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg transition-all"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};


//--- ResumePreviewPanel and its sub-components ---//

interface ResumePreviewPanelProps {
  resumeData: ResumeData;
}

const exportToHTML = (resumeData: ResumeData) => {
    const resumeContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Resume Rockstar Export</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #111; line-height: 1.6; }
            h1, h2, h3 { color: #0d9488; }
            h1 { font-size: 2.5em; text-align: center; }
            h2 { border-bottom: 2px solid #0d9488; padding-bottom: 5px; margin-top: 30px;}
            .skills { display: flex; flex-wrap: wrap; gap: 10px; padding: 10px 0;}
            .skill-tag { background: #14b8a6; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; }
            ul { padding-left: 20px; }
            li { margin-bottom: 10px; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <h1>Resume Built with Resume Rockstar</h1>
          <section>
            <h2>Professional Summary</h2>
            <p>${resumeData.summary || "Your beautiful tapestry summary will appear here."}</p>
          </section>
          <section>
            <h2>Key Skills</h2>
            <div class="skills">
              ${resumeData.skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('') || 'Skills will be extracted from our conversation.'}
            </div>
          </section>
          <section>
            <h2>Experience</h2>
            ${resumeData.experience.map(exp => `
                <div>
                    <h3>${exp.title}</h3>
                    <ul>
                        ${exp.bulletPoints.map(bullet => `<li>${bullet}</li>`).join('')}
                    </ul>
                </div>
            `).join('') || '<em>Experience details will be structured from your stories using the STAR methodology...</em>'}
          </section>
          <div class="footer">
            <p>Powered by GestaltView's consciousness-serving AI • Created By Keith Soyka</p>
          </div>
        </body>
        </html>
    `;
    const blob = new Blob([resumeContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-rockstar.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};


const ResumePreviewPanel: React.FC<ResumePreviewPanelProps> = ({ resumeData }) => {
  return (
    <div className="w-full lg:w-2/5 p-4">
      <div className="glass-card p-6 rounded-2xl h-full overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">Resume Preview</h2>
          <button
            onClick={() => exportToHTML(resumeData)}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            aria-label="Download Resume"
          >
            <DownloadIcon />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-teal-400" />
              Extracted Skills
            </h3>
            {resumeData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">Skills will appear as we chat...</p>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 text-black text-sm">
            <h4 className="font-bold text-lg mb-2 text-gray-800">Professional Summary</h4>
            <p className="mb-4 text-gray-700 leading-relaxed">
              {resumeData.summary ||
                "Your beautiful tapestry summary will appear here as we discover your experiences together..."}
            </p>

            <h4 className="font-bold mb-2 text-gray-800">Experience</h4>
            {resumeData.experience.length > 0 ? resumeData.experience.map((exp, index) => (
                <div key={index} className="mt-2">
                    <h5 className="font-semibold text-gray-800">{exp.title}</h5>
                    <ul className="list-disc pl-5 text-gray-700">
                        {exp.bulletPoints.map((bullet, i) => <li key={i}>{bullet}</li>)}
                    </ul>
                </div>
            )) : (
                 <p className="text-gray-400 italic">Experience details will be structured from your stories using the STAR methodology...</p>
            )}

            <div className="mt-4 p-3 bg-slate-50 rounded border-l-4 border-teal-500">
              <div className="text-xs text-gray-600 font-medium mb-1">Consciousness-Serving AI</div>
              <div className="text-xs text-gray-500">
                Built on GestaltView's principles • PLK v6.23
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


//================================================================================================
// 6. CORE APPLICATION LOGIC
//================================================================================================

const ResumeRockstarApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      type: 'ai',
      content: `🌟 Welcome to Resume Rockstar! I'm your consciousness-serving career coach.\n\nI'm here to help you discover your professional superpowers through authentic conversation. We'll use the STAR methodology (Situation, Task, Action, Result) to transform your experiences into compelling resume content.\n\nYour chaos has a current - let's find it together! What's your current role or an accomplishment you're proud of?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    summary: '',
    skills: [],
    experience: [],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      type: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResult = await generateAiResponse(trimmedInput);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResult.response,
        type: 'ai',
        resonanceScore: aiResult.resonanceScore,
      };
      setMessages(prev => [...prev, aiMessage]);

      setResumeData(prev => {
        const newSkills = new Set([...prev.skills, ...aiResult.extractedSkills]);

        let newExperience = [...prev.experience];
        if (aiResult.newExperienceBullet) {
            const currentRole = "Professional Experience"; // This is hardcoded for the showcase
            let roleExperience = newExperience.find(exp => exp.title === currentRole);
            if(roleExperience){
                roleExperience.bulletPoints.push(aiResult.newExperienceBullet);
            } else {
                newExperience.push({
                    title: currentRole,
                    bulletPoints: [aiResult.newExperienceBullet],
                });
            }
        }

        const updatedSummary = `A dynamic professional with expertise in ${Array.from(newSkills).slice(0, 3).join(', ')}. Proven ability to drive results and innovate in challenging environments.`;

        return {
          ...prev,
          summary: newSkills.size > 0 ? updatedSummary : prev.summary,
          skills: Array.from(newSkills),
          experience: newExperience,
        };
      });

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having a brief connection moment, but I'm still here! Let me ask you this: What's one professional accomplishment you're really proud of?",
        type: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-transparent">
      <ChatPanel
        messages={messages}
        isLoading={isLoading}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />
      <ResumePreviewPanel resumeData={resumeData} />
    </div>
  );
};


//================================================================================================
// 7. FINAL EXPORTABLE SHOWCASE COMPONENT
//================================================================================================

/**
 * A self-contained showcase component for the Resume Rockstar application.
 *
 * IMPORTANT: This component requires Tailwind CSS. Ensure the Tailwind CDN script
 * is included in your portfolio's main HTML file for proper styling.
 * `<script src="https://cdn.tailwindcss.com"></script>`
 */
const ResumeRockstarDemo = () => {
  return (
    <div className="resume-rockstar-demo relative w-full h-full bg-slate-950 text-slate-100 antialiased overflow-hidden">
      <style>{customCss}</style>

      <div className="neural-aurora-bg">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_2s_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_4s_infinite]"></div>
      </div>

      <div className="relative z-10 h-full">
        <ResumeRockstarApp />
      </div>
    </div>
  );
};

export default ResumeRockstarDemo;
