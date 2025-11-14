'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, BrainCircuit, Wind, Lightbulb, Coffee, ArrowLeft, RotateCw, MessageSquare, BookOpen, Send, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'

// --- Data & Constants ---
const completionMessages = ["⭐ Victory!", "🔥 Amazing!", "✨ Outstanding!", "🚀 Power-Up Complete!", "✅ Done!"];
const powerUps = [
    { category: 'Focus', title: '5-Minute Focus Sprint', description: 'Pick ONE task. Work on it without distraction for 5 solid minutes.', duration: 300, icon: BrainCircuit, color: "cyan" },
    { category: 'Focus', title: 'The Two-Minute Rule', description: 'Find a task you\'ve been avoiding. If it takes less than two minutes, do it now.', duration: 120, icon: Zap, color: "yellow" },
    { category: 'Calm', title: 'Box Breathing', description: 'Calm your nervous system. Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s.', duration: 180, icon: Wind, color: "green" },
    { category: 'Calm', title: 'Brain Dump', description: 'Grab paper and write down everything on your mind for 3 minutes. Get it all out. Don\'t filter.', duration: 180, icon: Zap, color: "purple" },
    { category: 'Energy', title: 'Energy Spark', description: 'Stand up, stretch, and do 10 jumping jacks or march in place for 60 seconds.', duration: 60, icon: Coffee, color: "red" },
    { category: 'Energy', title: 'Idea Capture', description: 'Your mind is buzzing! Capture every single idea for 3 minutes. Don\'t judge, just write.', duration: 180, icon: Lightbulb, color: "amber" },
];

type PowerUp = typeof powerUps[0];
type Category = 'All' | 'Focus' | 'Calm' | 'Energy';
type Tab = 'power-ups' | 'companion' | 'journal';
type ADHDState = "focused" | "overwhelmed" | "hyperfocus" | "understimulated";

interface ChatMessage { id: string; type: 'user' | 'ai'; content: string; feedback?: 'positive' | 'negative'; }
interface JournalEntry { id: string; content: string; timestamp: string; }

// --- Main Exhibit Component ---
export default function ADHDPowerUpStation() {
    const [activeTab, setActiveTab] = useState<Tab>('power-ups');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-4 sm:p-8">
            <header className="text-center mb-8 max-w-4xl mx-auto">
                <motion.h1 
                    initial={{y: -20, opacity: 0}} animate={{y:0, opacity:1}}
                    className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    ADHD Power-Up Station
                </motion.h1>
                <motion.p 
                    initial={{y: -20, opacity: 0}} animate={{y:0, opacity:1, transition: {delay: 0.2}}}
                    className="text-slate-400">
                    Your cognitive scaffolding hub. Use Power-Ups for quick resets, chat with your AI companion for clarity, or reflect in your private journal.
                </motion.p>
            </header>

            <div className="flex justify-center gap-2 mb-8">
                <TabButton id="power-ups" activeTab={activeTab} setActiveTab={setActiveTab} icon={Zap}>Power-Ups</TabButton>
                <TabButton id="companion" activeTab={activeTab} setActiveTab={setActiveTab} icon={MessageSquare}>AI Companion</TabButton>
                <TabButton id="journal" activeTab={activeTab} setActiveTab={setActiveTab} icon={BookOpen}>Journal</TabButton>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'power-ups' && <PowerUpSelector />}
                    {activeTab === 'companion' && <AICompanion />}
                    {activeTab === 'journal' && <Journal />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

const TabButton: React.FC<{id: Tab, activeTab: Tab, setActiveTab: (id: Tab) => void, icon: React.ElementType, children: React.ReactNode}> = ({ id, activeTab, setActiveTab, icon: Icon, children }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${activeTab === id ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
    >
        <Icon size={16} /> {children}
    </button>
);

// --- Power-Up Component ---
const PowerUpSelector = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [completionMessage, setCompletionMessage] = useState('');

    useEffect(() => {
        if (!isTimerRunning || timeLeft <= 0) {
            if (isTimerRunning && timeLeft <= 0) {
                setCompletionMessage(completionMessages[Math.floor(Math.random() * completionMessages.length)]);
            }
            setIsTimerRunning(false);
            return;
        }
        const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [isTimerRunning, timeLeft]);

    const handleSelectPowerUp = (powerUp: PowerUp) => {
        setSelectedPowerUp(powerUp);
        setTimeLeft(powerUp.duration);
        setCompletionMessage('');
    };

    const handleReset = () => {
        setIsTimerRunning(false);
        if(selectedPowerUp) setTimeLeft(selectedPowerUp.duration);
        setCompletionMessage('');
    };

    const handleBackToStation = () => {
        setSelectedPowerUp(null);
        setIsTimerRunning(false);
        setTimeLeft(0);
        setCompletionMessage('');
    };

    const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    
    const filteredPowerUps = activeCategory === 'All' ? powerUps : powerUps.filter(p => p.category === activeCategory);

    if (selectedPowerUp) {
        return (
            <motion.div key="timer" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center">
                 <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 w-full max-w-md mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                        <selectedPowerUp.icon size={28} className={`text-${selectedPowerUp.color}-400`} />
                        {selectedPowerUp.title}
                    </h2>
                    <p className="text-slate-400 mb-8">{selectedPowerUp.description}</p>
                    <AnimatePresence mode="wait">
                        {completionMessage ? (
                            <motion.div key="completion" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}}>
                                <p className="text-3xl font-bold text-green-400 mb-6">{completionMessage}</p>
                            </motion.div>
                        ) : (
                            <motion.div key="timer-active" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}}>
                                <div className="text-7xl font-mono font-bold text-white my-8 tracking-wider">{formatTime(timeLeft)}</div>
                                <div className="flex gap-4 justify-center">
                                    {!isTimerRunning && timeLeft > 0 && <Button onClick={() => setIsTimerRunning(true)} className={`bg-${selectedPowerUp.color}-600 hover:bg-${selectedPowerUp.color}-500 text-white font-bold py-3 px-8 rounded-lg text-lg`}>Start</Button>}
                                    {isTimerRunning && <Button onClick={() => setIsTimerRunning(false)} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg text-lg">Pause</Button>}
                                    <Button onClick={handleReset} variant="ghost" className="text-slate-400 hover:text-white"><RotateCw size={18} /></Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>
                 <Button onClick={handleBackToStation} variant="link" className="mt-8 text-slate-400 hover:text-slate-200"><ArrowLeft className="mr-2" size={16} /> Choose a different Power-Up</Button>
            </motion.div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-center gap-2 mb-6 border-b border-slate-700 pb-4">
                {(['All', 'Focus', 'Calm', 'Energy'] as Category[]).map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeCategory === cat ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{cat}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPowerUps.map((powerUp, i) => (
                    <motion.div key={powerUp.title} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0, transition: {delay: i * 0.05}}} onClick={() => handleSelectPowerUp(powerUp)} className={`bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-${powerUp.color}-500 hover:bg-slate-700/50 cursor-pointer transition-all group`}>
                        <div className="flex items-center gap-4 mb-3">
                            <div className={`p-2 bg-${powerUp.color}-500/10 rounded-md`}><powerUp.icon size={24} className={`text-${powerUp.color}-400`} /></div>
                            <h3 className={`font-bold text-lg text-white group-hover:text-${powerUp.color}-400 transition-colors`}>{powerUp.title}</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">{powerUp.description}</p>
                        <div className="text-xs text-slate-500 font-mono text-right">{powerUp.duration / 60} min</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// --- AI Companion Component ---
const AICompanion = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [energyLevel, setEnergyLevel] = useState(7);
    const [adhdState, setAdhdState] = useState<ADHDState>('focused');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => { scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (!userInput.trim() || isLoading) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), type: 'user', content: userInput };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/adhd-power-up/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput, energy_level: energyLevel, adhd_state: adhdState })
            });
            if (!res.ok) throw new Error('API request failed');
            const data = await res.json();
            const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), type: 'ai', content: data.response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), type: 'ai', content: "I'm having a bit of trouble connecting my thoughts. Could you try asking that again in a slightly different way?" };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    }, [userInput, isLoading, energyLevel, adhdState]);

    return (
        <Card className="max-w-3xl mx-auto glass-panel border-purple-500/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300"><MessageSquare /> AI Companion</CardTitle>
                <CardDescription>Your cognitive scaffolder. Talk through your thoughts, feelings, and tasks.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96 w-full border border-slate-700 rounded-lg p-4 space-y-4" ref={scrollAreaRef as any}>
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[80%] ${msg.type === 'user' ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-slate-800/50'}`}>
                                <p className="text-slate-300 whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-slate-400 italic">Thinking...</div>}
                </ScrollArea>
                <div className="mt-4 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-300">Your Energy Level: {energyLevel}/10</label>
                        <Slider value={[energyLevel]} onValueChange={(val) => setEnergyLevel(val[0])} max={10} step={1} className="mt-2" />
                    </div>
                    <div className="relative">
                        <Textarea value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Drop your 'lightning bolt' ideas or describe what feels overwhelming..." className="bg-slate-900/70 border-slate-700 pr-20" disabled={isLoading} />
                        <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="absolute right-2 bottom-2 h-10 w-10 bg-purple-600 hover:bg-purple-500"><Send size={20} /></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Journal Component ---
const Journal = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [currentEntry, setCurrentEntry] = useState('');

    useEffect(() => {
        const savedEntries = localStorage.getItem('adhdJournalEntries');
        if (savedEntries) setEntries(JSON.parse(savedEntries));
    }, []);

    const handleSave = () => {
        if (!currentEntry.trim()) return;
        const newEntry = { id: Date.now().toString(), content: currentEntry, timestamp: new Date().toISOString() };
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        localStorage.setItem('adhdJournalEntries', JSON.stringify(updatedEntries));
        setCurrentEntry('');
    };

    return (
        <Card className="max-w-3xl mx-auto glass-panel border-green-500/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-300"><BookOpen /> Private Journal</CardTitle>
                <CardDescription>A safe space for unfiltered reflection. Your data is stored locally on your device and is never sent to a server.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea value={currentEntry} onChange={e => setCurrentEntry(e.target.value)} placeholder="What's on your mind? Capture your thoughts here, judgment-free." className="bg-slate-900/70 border-slate-700 min-h-32" />
                <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-500">Save Entry</Button>
                <div className="space-y-2">
                    <h4 className="font-semibold text-slate-300">Recent Entries:</h4>
                    <ScrollArea className="h-64 border border-slate-700 rounded-lg p-2">
                        {entries.length === 0 ? <p className="text-center text-slate-500 p-4">Your journal is a fresh page.</p> :
                        entries.map(entry => (
                            <div key={entry.id} className="p-3 mb-2 bg-slate-800/50 rounded-md">
                                <p className="text-sm text-slate-300 whitespace-pre-wrap">{entry.content}</p>
                                <p className="text-xs text-slate-500 mt-2 text-right">{new Date(entry.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
};
