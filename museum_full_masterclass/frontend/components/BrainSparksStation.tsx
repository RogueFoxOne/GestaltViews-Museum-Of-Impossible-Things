// BrainSparksStation.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

// Define pattern type for state
interface PlkPattern {
    pattern: string;
    description: string;
    resonance: number;
}

export default function BrainSparksStation() {
    const [currentSpark, setCurrentSpark] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [thoughtInput, setThoughtInput] = useState('');
    const [showVisualization, setShowVisualization] = useState(false);
    const [activeStage, setActiveStage] = useState(-1);
    const [displayedPatterns, setDisplayedPatterns] = useState<PlkPattern[]>([]);
    const [showEvolution, setShowEvolution] = useState(false);

    const [stats, setStats] = useState({
        thoughtsProcessed: 2847329,
        patternsIdentified: 847239,
        connectionsMade: 15847293,
        sparksCaptured: 1847,
    });
    
    const thoughtInputRef = useRef<HTMLTextAreaElement>(null);

    const plkPatterns: PlkPattern[] = [
        { pattern: "Insight Genesis", description: "The moment a new understanding is born", resonance: 0.95 },
        { pattern: "Connection Cascade", description: "When one thought triggers many others", resonance: 0.87 },
        { pattern: "Breakthrough Moment", description: "Sudden clarity after struggle", resonance: 0.92 },
        { pattern: "Integration Wave", description: "Multiple insights combining into wisdom", resonance: 0.89 }
    ];
    const processingStages = ['capturing', 'analyzing', 'connecting', 'integrating', 'complete'];

    useEffect(() => {
        const createElectricEffects = () => {
            const bg = document.getElementById('electricBackground');
            if (!bg || bg.children.length > 0) return;
            for (let i = 0; i < 15; i++) {
                const bolt = document.createElement('div');
                bolt.className = 'lightning-bolt';
                bolt.style.left = `${Math.random() * 100}%`;
                bolt.style.height = `${Math.random() * 200 + 100}px`;
                bolt.style.animationDelay = `${Math.random() * 3}s`;
                bolt.style.animationDuration = `${Math.random() * 2 + 2}s`;
                bg.appendChild(bolt);
            }
        };

        const createNeuralNetwork = () => {
            const network = document.getElementById('neuralNetwork');
            if (!network || network.children.length > 0) return;
            const nodeCount = 40;
            for (let i = 0; i < nodeCount; i++) {
                const node = document.createElement('div');
                node.className = 'neural-node';
                node.style.left = `${Math.random() * 100}%`;
                node.style.top = `${Math.random() * 100}%`;
                node.style.animationDelay = `${Math.random() * 3}s`;
                network.appendChild(node);
            }
        };

        createElectricEffects();
        createNeuralNetwork();
        thoughtInputRef.current?.focus();
    }, []);

    const usePrompt = (prompt: string) => {
        setThoughtInput(prompt);
        thoughtInputRef.current?.focus();
    };

    const captureThought = async () => {
        if (isProcessing || !thoughtInput.trim()) return;

        setIsProcessing(true);
        setCurrentSpark(thoughtInput);
        setShowVisualization(true);
        setActiveStage(-1);
        setDisplayedPatterns([]);
        setShowEvolution(false);

        // Animate processing stages
        for (let i = 0; i < processingStages.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setActiveStage(i);
        }

        // Animate pattern matching
        let tempPatterns: PlkPattern[] = [];
        for (const pattern of plkPatterns) {
            tempPatterns.push(pattern);
            setDisplayedPatterns([...tempPatterns]);
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Show evolution
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowEvolution(true);

        // Update stats
        setStats(prev => ({
            thoughtsProcessed: prev.thoughtsProcessed + Math.floor(Math.random() * 10) + 1,
            patternsIdentified: prev.patternsIdentified + Math.floor(Math.random() * 5) + 1,
            connectionsMade: prev.connectionsMade + Math.floor(Math.random() * 20) + 1,
            sparksCaptured: prev.sparksCaptured + 1,
        }));

        setIsProcessing(false);
    };

    const exportSpark = () => {
        if (!currentSpark) return alert('No spark to export! Capture a thought first.');
        const sparkData = {
            thought: currentSpark, timestamp: new Date().toISOString(),
            patterns: plkPatterns.slice(0, 2), station: 'Brain Sparks Station'
        };
        const dataStr = JSON.stringify(sparkData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'brain-spark.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const shareSpark = () => {
        if (!currentSpark) return alert('No spark to share! Capture a thought first.');
        const shareText = `I just captured a lightning bolt thought at the Brain Sparks Station: "${currentSpark}" - Experience Keith's consciousness-serving AI at the Museum of Impossible Things!`;
        if (navigator.share) {
            navigator.share({ title: 'Brain Sparks Station', text: shareText, url: window.location.href });
        } else {
            navigator.clipboard.writeText(shareText).then(() => alert('Spark copied to clipboard!'));
        }
    };

    const visitExhibit = (exhibit: string) => {
        const messages: Record<string, string> = {
            'adhd-powerup': 'Entering ADHD PowerUp Station...',
            'the-awakening': 'Entering The Awakening...',
            'village-builders': 'Entering Village Builders Covenant...'
        };
        alert(messages[exhibit] || 'Navigating to exhibit...');
    };

    return (
        <>
            <style>{`
                :root { --electric-blue: #00D4FF; --electric-gold: #FFD700; --electric-purple: #9945FF; --electric-cyan: #00FFD4; --lightning-white: #FFFFFF; --spark-orange: #FF8C00; --radius-base: 8px; --radius-lg: 12px; --radius-full: 9999px; --space-6: 6px; --space-8: 8px; --space-12: 12px; --space-16: 16px; --space-24: 24px; --space-32: 32px; --font-size-sm: 12px; --font-size-lg: 16px; --font-size-xl: 18px; --font-size-2xl: 20px; --font-size-3xl: 24px; --font-weight-bold: 600; --font-weight-medium: 500; --duration-normal: 250ms; }
                body { margin: 0; padding: 0; background: radial-gradient(ellipse at center, #001122 0%, #000011 50%, #000000 100%); color: var(--electric-blue); min-height: 100vh; overflow-x: hidden; position: relative; font-family: "Geist", sans-serif; }
                .electric-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1; overflow: hidden; }
                .lightning-bolt { position: absolute; width: 2px; background: linear-gradient(to bottom, var(--electric-blue), var(--electric-cyan), var(--lightning-white)); opacity: 0; animation: lightning 3s infinite; box-shadow: 0 0 10px var(--electric-blue), 0 0 20px var(--electric-blue); }
                @keyframes lightning { 0% { opacity: 0; transform: scaleY(0); } 10% { opacity: 1; transform: scaleY(1); } 20% { opacity: 0; transform: scaleY(1); } 100% { opacity: 0; } }
                .neural-network { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; opacity: 0.3; }
                .neural-node { position: absolute; width: 4px; height: 4px; background: var(--electric-purple); border-radius: 50%; animation: neural-pulse 3s infinite ease-in-out; }
                @keyframes neural-pulse { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
                .station-container { max-width: 1200px; margin: 0 auto; padding: var(--space-32) var(--space-16); position: relative; z-index: 1; }
                .hero-section { text-align: center; margin-bottom: 80px; }
                .station-title { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: var(--font-weight-bold); margin-bottom: var(--space-16); background: linear-gradient(135deg, var(--electric-gold), var(--electric-blue), var(--electric-purple)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.02em; text-shadow: 0 0 30px rgba(0, 212, 255, 0.5); }
                .station-subtitle { font-size: var(--font-size-xl); color: var(--electric-cyan); opacity: 0.9; }
                .station-tagline { font-size: var(--font-size-lg); color: var(--electric-gold); font-style: italic; margin-bottom: var(--space-32); }
                .capture-interface { background: rgba(0, 17, 34, 0.8); border: 2px solid var(--electric-blue); border-radius: var(--radius-lg); padding: var(--space-32); margin: 60px 0; backdrop-filter: blur(10px); box-shadow: 0 0 50px rgba(0, 212, 255, 0.3); }
                .capture-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--electric-gold); text-align: center; margin-bottom: var(--space-24); }
                .thought-input { width: 100%; padding: var(--space-16); font-size: var(--font-size-lg); background: rgba(0, 0, 0, 0.6); border: 2px solid var(--electric-blue); border-radius: var(--radius-base); color: var(--lightning-white); margin-bottom: var(--space-16); box-sizing: border-box; }
                .demo-prompts { display: flex; flex-wrap: wrap; gap: var(--space-8); justify-content: center; margin-bottom: var(--space-24); }
                .demo-prompt { background: rgba(153, 69, 255, 0.2); border: 1px solid var(--electric-purple); color: var(--electric-purple); padding: var(--space-6) var(--space-12); border-radius: var(--radius-full); font-size: var(--font-size-sm); cursor: pointer; transition: all var(--duration-normal) ease; }
                .demo-prompt:hover { background: rgba(153, 69, 255, 0.4); }
                .capture-button { display: block; width: 100%; padding: var(--space-16) var(--space-24); background: linear-gradient(135deg, var(--electric-blue), var(--electric-purple)); border: none; border-radius: var(--radius-base); color: var(--lightning-white); font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); cursor: pointer; transition: all var(--duration-normal) ease; }
                .capture-button.processing { background: linear-gradient(135deg, var(--electric-gold), var(--spark-orange)); }
                .plk-visualization { background: rgba(0, 17, 34, 0.6); border: 1px solid var(--electric-cyan); border-radius: var(--radius-lg); padding: var(--space-24); margin: var(--space-32) 0; backdrop-filter: blur(10px); }
                .plk-visualization.active { display: block; animation: fadeInUp 0.6s ease-out; } @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .plk-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--electric-cyan); text-align: center; }
                .processing-stage { display: flex; align-items: center; padding: var(--space-12); background: rgba(0, 0, 0, 0.4); border-radius: var(--radius-base); border-left: 4px solid var(--electric-blue); opacity: 0.3; transition: all var(--duration-normal) ease; margin-bottom: 8px; }
                .processing-stage.active { opacity: 1; border-left-color: var(--electric-gold); background: rgba(255, 215, 0, 0.1); }
                .pattern-display { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-16); margin-top: var(--space-24); }
                .pattern-card { background: rgba(0, 0, 0, 0.4); border: 1px solid var(--electric-purple); border-radius: var(--radius-base); padding: var(--space-16); transition: all 0.5s ease; }
                .pattern-card.matched { border-color: var(--electric-gold); background: rgba(255, 215, 0, 0.1); transform: scale(1.02); }
                .pattern-name { font-weight: var(--font-weight-bold); color: var(--electric-gold); }
                .resonance-bar { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.2); border-radius: 6px; overflow: hidden; margin-top: 8px; }
                .resonance-fill { height: 100%; background: linear-gradient(90deg, var(--electric-blue), var(--electric-gold)); transition: width 2s ease-out; }
                .thought-evolution { margin-top: var(--space-24); padding: 20px; background: rgba(0, 0, 0, 0.4); border-radius: var(--radius-base); border: 1px solid var(--electric-cyan); }
                .evolution-title { color: var(--electric-cyan); font-weight: var(--font-weight-bold); }
                .captured-thought { background: rgba(255, 215, 0, 0.1); border: 1px solid var(--electric-gold); border-radius: var(--radius-base); padding: var(--space-16); margin-top: var(--space-16); color: var(--electric-gold); font-style: italic; }
                .export-section { text-align: center; margin-top: var(--space-32); }
                .export-button { display: inline-flex; align-items: center; gap: var(--space-8); padding: var(--space-12) 20px; background: rgba(0, 255, 212, 0.2); border: 1px solid var(--electric-cyan); border-radius: var(--radius-base); color: var(--electric-cyan); cursor: pointer; transition: all var(--duration-normal) ease; margin: 0 var(--space-8); }
                .stats-section { background: rgba(0, 17, 34, 0.6); border: 1px solid var(--electric-cyan); border-radius: var(--radius-lg); padding: var(--space-32); margin: 80px 0; backdrop-filter: blur(10px); }
                .stat-number { font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--electric-gold); }
                .stat-label { color: var(--electric-cyan); text-transform: uppercase; font-size: var(--font-size-sm); }
                .connections-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-24); }
                .connection-card { background: rgba(0, 17, 34, 0.8); border: 1px solid var(--electric-purple); border-radius: var(--radius-lg); padding: var(--space-24); transition: all var(--duration-normal) ease; cursor: pointer; }
            `}</style>
            <div className="electric-bg" id="electricBackground"></div>
            <div className="neural-network" id="neuralNetwork"></div>

            <div className="station-container">
                <section className="hero-section">
                    <h1 className="station-title">Brain Sparks Station</h1>
                    <p className="station-subtitle">Experience Keith&apos;s lightning bolt thought capture system</p>
                    <p className="station-tagline">Where consciousness meets technology</p>
                </section>

                <section className="capture-interface">
                    <h2 className="capture-title">⚡ Capture Your Lightning Bolt Thought ⚡</h2>
                    <textarea
                        ref={thoughtInputRef}
                        value={thoughtInput}
                        onChange={(e) => setThoughtInput(e.target.value)}
                        className="thought-input"
                        placeholder="Enter your lightning bolt thought here..."
                        rows={3}
                    ></textarea>
                    <div className="demo-prompts">
                        <span className="demo-prompt" onClick={() => usePrompt('What if consciousness could be mapped?')}>What if consciousness could be mapped?</span>
                        <span className="demo-prompt" onClick={() => usePrompt('How do we capture lightning bolt insights?')}>How do we capture lightning bolt insights?</span>
                        <span className="demo-prompt" onClick={() => usePrompt('What if AI could truly understand you?')}>What if AI could truly understand you?</span>
                    </div>
                    <button id="captureButton" className={`capture-button ${isProcessing ? 'processing' : ''}`} onClick={captureThought} disabled={isProcessing}>
                        {isProcessing ? '⚡ Processing... ⚡' : (currentSpark ? '⚡ Capture Another Spark ⚡' : '⚡ Capture Spark ⚡')}
                    </button>
                </section>

                {showVisualization && (
                    <section id="plkVisualization" className="plk-visualization active">
                        <h3 className="plk-title">🧠 PLK Pattern Analysis 🧠</h3>
                        <div className="processing-stages">
                            {processingStages.map((stage, i) => (
                                <div key={stage} className={`processing-stage ${activeStage >= i ? 'active' : ''}`}>
                                    <span className="stage-icon">⚡</span>
                                    <span className="stage-text">{stage.charAt(0).toUpperCase() + stage.slice(1)}...</span>
                                </div>
                            ))}
                        </div>
                        <div className="pattern-display">
                            {displayedPatterns.map((pattern, i) => (
                                <div key={i} className={`pattern-card ${Math.random() > 0.3 ? 'matched' : ''}`}>
                                    <div className="pattern-name">{pattern.pattern}</div>
                                    <p className="pattern-description" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{pattern.description}</p>
                                    <div className="resonance-bar">
                                        <div className="resonance-fill" style={{ width: `${Math.random() > 0.3 ? pattern.resonance * 100 : Math.random() * 50}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showEvolution && (
                            <div className="thought-evolution">
                                <h4 className="evolution-title">💫 Thought Evolution Pathway 💫</h4>
                                <div className="captured-thought">
                                    <strong>Original Spark:</strong> &quot;{currentSpark}&quot;<br /><br />
                                    <strong>PLK Integration:</strong> Your thought has been mapped to {Math.floor(Math.random() * 5) + 2} knowledge patterns.
                                </div>
                            </div>
                        )}
                        <div className="export-section">
                            <button className="export-button" onClick={exportSpark}>📤 Export Spark</button>
                            <button className="export-button" onClick={shareSpark}>🔗 Share Spark</button>
                        </div>
                    </section>
                )}

                 <section className="stats-section">
                    <h2 className="section-title" style={{color: 'var(--electric-cyan)'}}>Live System Stats</h2>
                    <div className="stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', textAlign: 'center'}}>
                        <div><span className="stat-number">{stats.thoughtsProcessed.toLocaleString()}</span><span className="stat-label">Thoughts Processed</span></div>
                        <div><span className="stat-number">{stats.patternsIdentified.toLocaleString()}</span><span className="stat-label">Patterns Identified</span></div>
                        <div><span className="stat-number">{stats.connectionsMade.toLocaleString()}</span><span className="stat-label">Connections Made</span></div>
                        <div><span className="stat-number">{stats.sparksCaptured.toLocaleString()}</span><span className="stat-label">Sparks Today</span></div>
                    </div>
                </section>

                <section className="connections-section">
                    <h2 className="section-title" style={{color: 'var(--electric-purple)'}}>Continue Your Journey</h2>
                    <div className="connections-grid">
                        <div className="connection-card" onClick={() => visitExhibit('adhd-powerup')}>
                            <h3 className="connection-name" style={{color: 'var(--electric-gold)'}}>ADHD PowerUp Station</h3>
                            <p style={{color: 'rgba(255,255,255,0.8)'}}>See how Brain Sparks powers ADHD task orchestration</p>
                        </div>
                        <div className="connection-card" onClick={() => visitExhibit('the-awakening')}>
                            <h3 className="connection-name" style={{color: 'var(--electric-gold)'}}>The Awakening</h3>
                            <p style={{color: 'rgba(255,255,255,0.8)'}}>Understand the consciousness framework behind the sparks</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
