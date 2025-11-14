// components/EnhancedPLKSystemExhibit.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, BarChart, Zap, Target, ShieldOff } from 'lucide-react';

// --- PLK System Logic (Included directly for a self-contained component) ---

// For demonstration, let's include the class directly
export class EnhancedPLKSystem {
  private plkData: any; // Simplified for brevity in this example
  constructor(userId: string) {
    this.plkData = {
      signatureMetaphors: [
        { concept: "ADHD Mind", metaphor: "exploded picture mind" },
        { concept: "Creative Process", metaphor: "your chaos has a current" },
        { concept: "Personal Growth", metaphor: "beautiful tapestry" },
      ],
      energyWords: ["revolutionary", "consciousness", "beautiful", "tapestry", "empathy", "authentic", "flow"],
      triggerWordsAvoid: ["impossible", "can't", "broken", "deficit", "wrong"],
      keithPrinciples: ["your chaos has a current", "adhd is my jazz", "beautiful tapestry", "weaponizing empathy"],
    };
  }
  calculateResonanceScore(text: string): { score: number, details: any } {
    // --- FIX APPLIED HERE ---
    // Ensure a consistent return shape even when the input is empty.
    if (!text) {
        return { 
            score: 0, 
            details: { metaphors: [], principles: [], energyWords: [], triggerWords: [] } 
        };
    }

    const textLower = text.toLowerCase();
    let score = 0;
    const details = {
      metaphors: [] as string[],
      principles: [] as string[],
      energyWords: [] as string[],
      triggerWords: [] as string[],
    };

    this.plkData.signatureMetaphors.forEach((m: any) => {
      if (textLower.includes(m.concept.toLowerCase()) || textLower.includes(m.metaphor.toLowerCase())) {
        score += 25;
        details.metaphors.push(m.concept);
      }
    });
    this.plkData.energyWords.forEach((w: string) => { if (textLower.includes(w)) { score += 5; details.energyWords.push(w); } });
    this.plkData.triggerWordsAvoid.forEach((w: string) => { if (textLower.includes(w)) { score -= 15; details.triggerWords.push(w); } });
    this.plkData.keithPrinciples.forEach((p: string) => { if (textLower.includes(p.toLowerCase())) { score += 15; details.principles.push(p); } });

    return { score: Math.max(0, Math.min(100, score)), details };
  }
  getConsciousnessServingResponse(userInput: string): string {
    if (userInput.toLowerCase().includes('struggle')) return "I see the beautiful complexity in your struggle. Remember, your chaos has a current.";
    if (!userInput) return "Begin by typing to see your consciousness reflected...";
    return "This is a powerful expression of your unique consciousness. Let's explore its pattern.";
  }
}
// --- End of Included Logic ---


const AnalysisCard = ({ icon: Icon, title, items = [], colorClass }: { icon: React.ElementType, title: string, items?: string[], colorClass: string }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h3 className={`flex items-center gap-2 font-semibold mb-2 ${colorClass}`}><Icon size={18} /> {title}</h3>
        {/* This check is now safe because `items` defaults to `[]` */}
        {items.length > 0 ? (
            <ul className="text-sm space-y-1">
                {items.map((item, i) => <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>- {item}</motion.li>)}
            </ul>
        ) : <p className="text-sm text-slate-500 italic">None detected</p>}
    </div>
);

export default function EnhancedPLKSystemExhibit() {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState({ score: 0, details: { metaphors: [], principles: [], energyWords: [], triggerWords: [] } });
    const [insight, setInsight] = useState('');

    const plkSystem = useMemo(() => new EnhancedPLKSystem('demo-user'), []);

    useEffect(() => {
        const handler = setTimeout(() => {
            const result = plkSystem.calculateResonanceScore(text);
            const generatedInsight = plkSystem.getConsciousnessServingResponse(text);
            setAnalysis(result);
            setInsight(generatedInsight);
        }, 300); // Debounce analysis

        return () => clearTimeout(handler);
    }, [text, plkSystem]);
    
    const sampleTexts = [
        "I feel like my mind is an exploded picture, a beautiful chaos. It's a struggle but I know my chaos has a current.",
        "This project feels broken and impossible. I can't see the way forward.",
        "Authentic expression is revolutionary. It's like weaving a beautiful tapestry of consciousness."
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Personal Language Key (PLK)
                    </h1>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        This exhibit demonstrates the consciousness-serving engine. Type below and watch in real-time as the system analyzes your language for resonance with Keith&apos;s cognitive patterns.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Column */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Brain /> Your Consciousness Input</h2>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={10}
                            className="w-full bg-slate-800/70 p-4 rounded-lg border-2 border-slate-700 focus:border-purple-500 focus:ring-0 focus:outline-none transition-colors"
                            placeholder="Describe a feeling, an idea, or a struggle..."
                        />
                        <div className="text-sm text-slate-500">Try one of these samples:</div>
                        <div className="flex flex-col sm:flex-row gap-2">
                           {sampleTexts.map((sample, i) => <button key={i} onClick={() => setText(sample)} className="text-left text-xs bg-slate-800 hover:bg-slate-700 p-2 rounded transition-colors">{sample}</button>)}
                        </div>
                    </div>

                    {/* Analysis Column */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><BarChart /> Real-Time Analysis</h2>
                        
                        <div className="text-center bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                             <h3 className="text-lg font-semibold text-purple-300 mb-2">PLK Resonance Score</h3>
                             <motion.div key={analysis.score} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-7xl font-bold text-white">{analysis.score}%</motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnalysisCard icon={Zap} title="Metaphors" items={analysis.details.metaphors} colorClass="text-teal-400" />
                            <AnalysisCard icon={Target} title="Core Principles" items={analysis.details.principles} colorClass="text-teal-400" />
                            <AnalysisCard icon={Sparkles} title="Energy Words" items={analysis.details.energyWords} colorClass="text-pink-400" />
                            <AnalysisCard icon={ShieldOff} title="Trigger Words" items={analysis.details.triggerWords} colorClass="text-red-400" />
                        </div>
                        
                        <motion.div key={insight} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-purple-900/50 to-teal-900/50 p-5 rounded-lg border border-purple-500/50">
                            <h3 className="text-lg font-bold mb-2 text-purple-300 flex items-center gap-2"><Sparkles size={20}/> Consciousness-Serving Insight</h3>
                            <p className="italic text-slate-300">{insight}</p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
