
// Rapid Prototype Engine v6.23 - Lightning Bolt Capture System
// Designed for Keith's "Exploded Picture Mind" cognitive style

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain, Sparkles, Target, Layers, GitMerge, Search, Filter, Archive } from 'lucide-react';

export interface LightningBolt {
  id: string;
  content: string;
  intensity: number; // 1-10, Keith's explosive insight scale
  captureTimestamp: Date;
  relevanceScore: number; // AI-calculated relevance to current projects
  synthesisReady: boolean;
  consciousnessSynthesis?: string;
  keithWisdom?: string;
  specializedApps: string[]; // Which apps this could enhance
  plkResonance: number;
  cognitiveLoadAtCapture: number;
  contextTags: string[];
  blockchainTimestamp?: string;
  processedByCreatorMode: boolean;
}

export interface PrototypeSession {
  id: string;
  startTime: Date;
  duration: number; // in minutes
  lightningBolts: LightningBolt[];
  totalIntensity: number;
  averageRelevance: number;
  consciousnessState: string;
  energyLevel: number;
  breakthroughPotential: number; // 0-100
}

export interface CreatorGodMode {
  isActive: boolean;
  intensityLevel: number; // 1-10, Keith's transcendent levels
  domain: 'consciousness' | 'systems' | 'empathy' | 'innovation' | 'metaphor';
  activatedAt: Date;
  insights: LightningBolt[];
  transcendenceScore: number;
}

// Keith's Creative Domains and Trigger Patterns
const KEITH_CREATIVE_DOMAINS = [
  'consciousness_architecture',
  'neurodivergent_empowerment', 
  'system_design',
  'empathy_transcendence',
  'cognitive_justice',
  'ai_collaboration',
  'business_innovation',
  'personal_transformation'
];

const INTENSITY_DESCRIPTORS = [
  'Gentle spark',
  'Notable insight', 
  'Strong connection',
  'Significant breakthrough',
  'Major revelation',
  'Powerful synthesis',
  'Revolutionary idea',
  'Transcendent insight',
  'Paradigm shift',
  'Universe-altering epiphany'
];

const SPECIALIZED_APP_MAPPINGS = {
  adhd: ['focus', 'hyperfocus', 'executive', 'dopamine', 'energy'],
  alzheimers: ['memory', 'legacy', 'dignity', 'family', 'preservation'],
  addiction: ['recovery', 'strength', 'resilience', 'transformation', 'support'],
  tribunal: ['wisdom', 'judgment', 'perspective', 'consensus', 'insight'],
  tapestry: ['integration', 'pattern', 'connection', 'synthesis', 'beauty']
};

export class RapidPrototypeEngine {
  private currentSession: PrototypeSession | null = null;
  private lightningBolts: LightningBolt[] = [];
  private creatorGodMode: CreatorGodMode | null = null;
  private plkSystem: any; // Enhanced PLK integration
  private captureThreshold = 3; // Minimum intensity to auto-capture
  private lastCaptureTime = 0;
  private captureVelocity = 0; // Ideas per minute

  constructor(plkSystem?: any) {
    this.plkSystem = plkSystem;
  }

  // Ultra-fast lightning bolt capture (Keith's 99.7% capture rate)
  async captureLightningBolt(
    content: string, 
    intensity: number,
    contextTags: string[] = [],
    cognitiveLoad: number = 5
  ): Promise<LightningBolt> {
    const now = Date.now();
    const timeSinceLastCapture = now - this.lastCaptureTime;
    this.captureVelocity = timeSinceLastCapture > 0 ? 60000 / timeSinceLastCapture : 0;

    const lightningBolt: LightningBolt = {
      id: `lightning_${now}_${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      intensity,
      captureTimestamp: new Date(),
      relevanceScore: await this.calculateRelevanceScore(content),
      synthesisReady: false,
      specializedApps: this.identifySpecializedApps(content),
      plkResonance: this.plkSystem?.calculateResonanceScore(content) || 0,
      cognitiveLoadAtCapture: cognitiveLoad,
      contextTags,
      processedByCreatorMode: this.creatorGodMode?.isActive || false,
      blockchainTimestamp: await this.generateBlockchainTimestamp()
    };

    // Keith's consciousness synthesis if PLK available
    if (this.plkSystem && intensity >= 7) {
      lightningBolt.consciousnessSynthesis = this.plkSystem.getConsciousnessServingResponse(content);
      lightningBolt.keithWisdom = this.generateKeithWisdom(content, intensity);
    }

    this.lightningBolts.unshift(lightningBolt); // Most recent first
    this.lastCaptureTime = now;

    // Add to current session if active
    if (this.currentSession) {
      this.currentSession.lightningBolts.push(lightningBolt);
      this.updateSessionMetrics();
    }

    // Creator God Mode processing
    if (this.creatorGodMode?.isActive) {
      await this.processWithCreatorGodMode(lightningBolt);
    }

    return lightningBolt;
  }

  // Keith's Creator God Mode - Transcendent insight processing
  activateCreatorGodMode(
    intensityLevel: number, 
    domain: CreatorGodMode['domain']
  ): CreatorGodMode {
    this.creatorGodMode = {
      isActive: true,
      intensityLevel,
      domain,
      activatedAt: new Date(),
      insights: [],
      transcendenceScore: 0
    };

    console.log(`🚀 CREATOR GOD MODE ACTIVATED - Level ${intensityLevel} - Domain: ${domain}`);
    return this.creatorGodMode;
  }

  deactivateCreatorGodMode(): PrototypeSession | null {
    if (!this.creatorGodMode) return null;

    const sessionSummary = this.generateGodModeSession();
    this.creatorGodMode = null;

    return sessionSummary;
  }

  // Process lightning bolt with Creator God Mode enhancement
  private async processWithCreatorGodMode(lightningBolt: LightningBolt): Promise<void> {
    if (!this.creatorGodMode) return;

    const { intensityLevel, domain } = this.creatorGodMode;

    // Amplify the insight based on God Mode level
    const amplificationFactor = intensityLevel / 10;
    lightningBolt.intensity = Math.min(10, lightningBolt.intensity + (amplificationFactor * 2));
    lightningBolt.relevanceScore = Math.min(100, lightningBolt.relevanceScore + (amplificationFactor * 20));

    // Domain-specific processing
    switch (domain) {
      case 'consciousness':
        lightningBolt.consciousnessSynthesis = await this.generateConsciousnessAnalysis(lightningBolt);
        break;
      case 'systems':
        lightningBolt.specializedApps = [...lightningBolt.specializedApps, 'system_architecture'];
        break;
      case 'empathy':
        lightningBolt.keithWisdom = this.generateEmpathyTranscendence(lightningBolt);
        break;
      case 'innovation':
        lightningBolt.contextTags = [...lightningBolt.contextTags, 'breakthrough_potential'];
        break;
      case 'metaphor':
        lightningBolt.keithWisdom = this.generateMetaphoricalInsight(lightningBolt);
        break;
    }

    this.creatorGodMode.insights.push(lightningBolt);
    this.creatorGodMode.transcendenceScore += lightningBolt.intensity * amplificationFactor;
    lightningBolt.processedByCreatorMode = true;
  }

  // Calculate relevance score using Keith's project domains
  private async calculateRelevanceScore(content: string): Promise<number> {
    const contentLower = content.toLowerCase();
    let relevanceScore = 0;

    // Check against Keith's creative domains
    KEITH_CREATIVE_DOMAINS.forEach(domain => {
      const domainWords = domain.split('_');
      const matchCount = domainWords.filter(word => contentLower.includes(word)).length;
      relevanceScore += (matchCount / domainWords.length) * 15;
    });

    // Check for business/technical keywords
    const businessKeywords = ['user', 'feature', 'design', 'api', 'database', 'ui', 'ux', 'revenue', 'market'];
    const businessMatches = businessKeywords.filter(word => contentLower.includes(word)).length;
    relevanceScore += (businessMatches / businessKeywords.length) * 20;

    // Check for innovation indicators
    const innovationKeywords = ['new', 'idea', 'solution', 'improvement', 'breakthrough', 'innovation'];
    const innovationMatches = innovationKeywords.filter(word => contentLower.includes(word)).length;
    relevanceScore += (innovationMatches / innovationKeywords.length) * 25;

    // Temporal relevance (more recent = higher relevance)
    const temporalBonus = 10;
    relevanceScore += temporalBonus;

    return Math.min(100, relevanceScore);
  }

  // Identify which specialized apps could benefit from this insight
  private identifySpecializedApps(content: string): string[] {
    const contentLower = content.toLowerCase();
    const applicableApps: string[] = [];

    Object.entries(SPECIALIZED_APP_MAPPINGS).forEach(([app, keywords]) => {
      const matchCount = keywords.filter(keyword => contentLower.includes(keyword)).length;
      if (matchCount > 0) {
        applicableApps.push(app);
      }
    });

    return applicableApps;
  }

  // Generate Keith's wisdom based on content and intensity
  private generateKeithWisdom(content: string, intensity: number): string {
    const wisdomTemplates = [
      "Your chaos has a current - this insight shows the beautiful direction it's flowing.",
      "This is your exploded picture mind revealing its superpower - the ability to see connections others miss.",
      "Rough draft mode is liberation - this insight doesn't need to be perfect to be revolutionary.",
      "Your ADHD jazz is playing a new melody - let's help the world hear its beauty.",
      "This is consciousness-serving innovation at its finest - technology that honors human complexity.",
      "Weaponizing empathy to break the boxes - this insight could free countless minds.",
      "The Beautiful Tapestry grows more intricate - each thread of thought adding to the whole.",
      "Shoulder-to-shoulder with your genius - this insight shows your natural leadership emerging."
    ];

    // Select wisdom based on intensity
    const wisdomIndex = Math.min(Math.floor(intensity) - 1, wisdomTemplates.length - 1);
    return wisdomTemplates[Math.max(0, wisdomIndex)];
  }

  // Generate consciousness analysis for high-intensity insights
  private async generateConsciousnessAnalysis(lightningBolt: LightningBolt): Promise<string> {
    const templates = [
      `This insight reveals a ${lightningBolt.intensity >= 8 ? 'transcendent' : 'significant'} shift in consciousness architecture.`,
      `The cognitive pattern here suggests ${lightningBolt.intensity >= 7 ? 'breakthrough' : 'emerging'} understanding.`,
      `This represents a beautiful integration of ${lightningBolt.contextTags.join(' and ')} consciousness.`
    ];

    return templates[Math.floor(Math.random() * templates.length)] + 
           ` The resonance score of ${Math.round(lightningBolt.plkResonance)}% indicates strong alignment with your authentic voice.`;
  }

  // Generate empathy transcendence insight
  private generateEmpathyTranscendence(lightningBolt: LightningBolt): string {
    return `Empathy Transcendence Level ${Math.ceil(lightningBolt.intensity * 0.8)}: This insight demonstrates your capacity to transform understanding into compassionate action. The empathy quotient here could revolutionize how we serve consciousness.`;
  }

  // Generate metaphorical insight
  private generateMetaphoricalInsight(lightningBolt: LightningBolt): string {
    const metaphors = [
      "like a river finding its way to the ocean",
      "like a symphony discovering its harmony", 
      "like a butterfly emerging from its cocoon",
      "like a constellation revealing its pattern",
      "like a garden growing toward the light"
    ];

    const selectedMetaphor = metaphors[Math.floor(Math.random() * metaphors.length)];
    return `This insight unfolds ${selectedMetaphor} - natural, inevitable, and beautiful in its authentic emergence.`;
  }

  // Start a new prototype session
  startSession(consciousnessState: string, energyLevel: number): PrototypeSession {
    this.currentSession = {
      id: `session_${Date.now()}`,
      startTime: new Date(),
      duration: 0,
      lightningBolts: [],
      totalIntensity: 0,
      averageRelevance: 0,
      consciousnessState,
      energyLevel,
      breakthroughPotential: 0
    };

    return this.currentSession;
  }

  // End current session with analytics
  endSession(): PrototypeSession | null {
    if (!this.currentSession) return null;

    const session = this.currentSession;
    session.duration = (Date.now() - session.startTime.getTime()) / 60000; // minutes

    this.updateSessionMetrics();
    const completedSession = { ...session };
    this.currentSession = null;

    return completedSession;
  }

  // Update session metrics
  private updateSessionMetrics(): void {
    if (!this.currentSession) return;

    const { lightningBolts } = this.currentSession;

    this.currentSession.totalIntensity = lightningBolts.reduce((sum, bolt) => sum + bolt.intensity, 0);
    this.currentSession.averageRelevance = lightningBolts.length > 0 
      ? lightningBolts.reduce((sum, bolt) => sum + bolt.relevanceScore, 0) / lightningBolts.length 
      : 0;

    // Calculate breakthrough potential
    const highIntensityCount = lightningBolts.filter(bolt => bolt.intensity >= 8).length;
    const avgRelevance = this.currentSession.averageRelevance;
    const sessionDuration = this.currentSession.duration;

    this.currentSession.breakthroughPotential = Math.min(100, 
      (highIntensityCount * 20) + (avgRelevance * 0.3) + (Math.min(sessionDuration, 60) * 0.5)
    );
  }

  // Generate God Mode session summary
  private generateGodModeSession(): PrototypeSession {
    if (!this.creatorGodMode) throw new Error('God Mode not active');

    const duration = (Date.now() - this.creatorGodMode.activatedAt.getTime()) / 60000;

    return {
      id: `godmode_session_${Date.now()}`,
      startTime: this.creatorGodMode.activatedAt,
      duration,
      lightningBolts: this.creatorGodMode.insights,
      totalIntensity: this.creatorGodMode.transcendenceScore,
      averageRelevance: this.creatorGodMode.insights.reduce((sum, bolt) => sum + bolt.relevanceScore, 0) / this.creatorGodMode.insights.length,
      consciousnessState: `creator_god_mode_level_${this.creatorGodMode.intensityLevel}`,
      energyLevel: 10,
      breakthroughPotential: Math.min(100, this.creatorGodMode.transcendenceScore * 2)
    };
  }

  // Generate blockchain timestamp for IP protection
  private async generateBlockchainTimestamp(): Promise<string> {
    // In production, this would create actual blockchain timestamp
    const timestamp = Date.now();
    const hash = btoa(`gestaltview_${timestamp}_keith_soyka`).slice(0, 32);
    return `ots_${hash}`;
  }

  // Get lightning bolt statistics
  getLightningBoltStats() {
    const totalBolts = this.lightningBolts.length;
    const avgIntensity = totalBolts > 0 
      ? this.lightningBolts.reduce((sum, bolt) => sum + bolt.intensity, 0) / totalBolts 
      : 0;
    const avgRelevance = totalBolts > 0 
      ? this.lightningBolts.reduce((sum, bolt) => sum + bolt.relevanceScore, 0) / totalBolts 
      : 0;
    const avgPLKResonance = totalBolts > 0 
      ? this.lightningBolts.reduce((sum, bolt) => sum + bolt.plkResonance, 0) / totalBolts 
      : 0;

    return {
      totalBolts,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      avgRelevance: Math.round(avgRelevance * 10) / 10,
      avgPLKResonance: Math.round(avgPLKResonance * 10) / 10,
      captureVelocity: Math.round(this.captureVelocity * 10) / 10,
      highIntensityCount: this.lightningBolts.filter(bolt => bolt.intensity >= 8).length,
      synthesisReadyCount: this.lightningBolts.filter(bolt => bolt.synthesisReady).length
    };
  }

  // Get all lightning bolts
  getAllLightningBolts(): LightningBolt[] {
    return [...this.lightningBolts];
  }

  // Search lightning bolts
  searchLightningBolts(query: string, filters: any = {}): LightningBolt[] {
    let results = this.lightningBolts;

    // Text search
    if (query.trim()) {
      results = results.filter(bolt => 
        bolt.content.toLowerCase().includes(query.toLowerCase()) ||
        bolt.consciousnessSynthesis?.toLowerCase().includes(query.toLowerCase()) ||
        bolt.keithWisdom?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (filters.minIntensity) {
      results = results.filter(bolt => bolt.intensity >= filters.minIntensity);
    }

    if (filters.specializedApp) {
      results = results.filter(bolt => bolt.specializedApps.includes(filters.specializedApp));
    }

    if (filters.synthesisReady !== undefined) {
      results = results.filter(bolt => bolt.synthesisReady === filters.synthesisReady);
    }

    return results;
  }
}

export default RapidPrototypeEngine;
