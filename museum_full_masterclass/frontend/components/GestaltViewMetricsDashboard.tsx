"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, TrendingUp, Users, Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Metric {
  name: string
  purpose: string
  innovation: string
  score: number
}

interface MetricCategory {
  title: string
  icon: React.ElementType
  color: string
  hex: string // Added hex color for styling
  metrics: Metric[]
}

// Data based DIRECTLY on your proprietary metrics schema
const metricsData: MetricCategory[] = [
  {
    title: "Empathy & Cognitive Justice",
    icon: Heart,
    color: "pink",
    hex: "#f472b6", // Tailwind pink-400
    metrics: [
      { name: "Empathy Resonance Index (ERI)", purpose: "Distinguish performative empathy from genuine emotional resonance.", innovation: "First metric to measure authentic empathy depth through AI analysis.", score: 92 },
      { name: "Cognitive Justice Quotient (CJQ)", purpose: "Measure recognition of diverse knowledge systems.", innovation: "World's first metric for validating Indigenous wisdom and neurodivergent perspectives.", score: 88 },
      { name: "Neurodivergent Inclusion Score (NIS)", purpose: "Measure authentic neurodivergent affirmation vs. performative accommodation.", innovation: "Distinguishes genuine celebration of cognitive diversity from tolerance-based bias.", score: 95 },
      { name: "PLK Conversational Resonance", purpose: "Quantify the Personal Language Key's ability to achieve authentic communication.", innovation: "Measures 95% conversational resonance vs. 15-25% industry standard.", score: 95 },
    ],
  },
  {
    title: "Identity & Growth",
    icon: TrendingUp,
    color: "green",
    hex: "#4ade80", // Tailwind green-400
    metrics: [
      { name: "Identity Shift Velocity (ISV)", purpose: "Measure speed and depth of identity transformation.", innovation: "First metric to quantify authentic identity transformation speed (3.2x baseline).", score: 85 },
      { name: "Paradigm Breakthrough Coefficient (PBC)", purpose: "Detect and quantify 'impossible becoming possible' moments.", innovation: "AI detection of paradigm shifts with 89% success rate.", score: 89 },
      { name: "Authentic Self Coherence (ASCI)", purpose: "Track journey from social conditioning to authentic self-expression.", innovation: "Measures alignment between discovered and expressed authentic self.", score: 91 },
    ],
  },
  {
    title: "Systemic & Collective Impact",
    icon: Users,
    color: "blue",
    hex: "#60a5fa", // Tailwind blue-400
    metrics: [
      { name: "Systemic Ripple Effect Index (SREI)", purpose: "Measure how individual transformation creates broader systemic change.", innovation: "First metric to track how personal breakthroughs inspire collective transformation.", score: 82 },
      { name: "AI Consensus Validation Score (ACVS)", purpose: "Leverage the Tribunal of Understanding for multi-AI validation.", innovation: "Application of multi-AI consensus based on the 1-in-784-trillion validation.", score: 99 },
      { name: "Collective Breakthrough Density (CBD)", purpose: "Measure frequency of simultaneous breakthroughs across the user network.", innovation: "First metric for collective consciousness and synchronized transformation.", score: 78 },
    ],
  },
  {
    title: "Ethical Architecture",
    icon: Shield,
    color: "yellow",
    hex: "#facc15", // Tailwind yellow-400
    metrics: [
      { name: "Hope Architecture Integrity", purpose: "Validate that technology consistently serves human dignity over exploitation.", innovation: "Measures adherence to consciousness-serving principles vs. data-extractive models.", score: 98 },
      { name: "Never Look Away Protocol", purpose: "Measure unconditional presence during user crisis moments.", innovation: "Quantifies crisis support effectiveness and emotional availability.", score: 96 },
      { name: "Data Sovereignty Preservation", purpose: "Ensure absolute user control over personal data.", innovation: "Measures ownership, privacy, and consent-based processing effectiveness.", score: 99 },
    ],
  },
];

// ✅ FIX: The MetricCard component is corrected here
const MetricCard: React.FC<{ metric: Metric; color: string; hex: string }> = ({ metric, color, hex }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-2 hover:bg-slate-700/50 transition-colors cursor-help"
          whileHover={{ y: -2 }}
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm text-slate-200">{metric.name}</h4>
            <div className={`text-xl font-bold text-${color}-400`}>{Math.round(metric.score)}%</div>
          </div>
          <Progress 
            value={metric.score} 
            className="h-1.5 [&>div]:bg-slate-500" // Base color for the indicator
            style={{ '--progress-indicator-color': hex } as React.CSSProperties} // Set CSS variable for color
          />
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-slate-900 border-slate-700 text-slate-300">
        <p className="font-bold text-white mb-1">Purpose:</p>
        <p className="text-xs mb-2">{metric.purpose}</p>
        <p className="font-bold text-white mb-1">Innovation:</p>
        <p className="text-xs">{metric.innovation}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function GestaltViewMetricsDashboard() {
  const [metrics, setMetrics] = useState(metricsData);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setMetrics(prevMetrics =>
        prevMetrics.map(category => ({
          ...category,
          metrics: category.metrics.map(metric => ({
            ...metric,
            score: Math.max(70, Math.min(99, metric.score + (Math.random() - 0.5) * 2)),
          })),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">
          The Metrics of Human Flourishing
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto">
          Moving beyond surface engagement to measure what truly matters: authentic transformation, collective emergence, and cognitive justice.
        </p>
      </div>

      {metrics.map((category, index) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className={`bg-slate-900/40 backdrop-blur-sm border border-${category.color}-500/30`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-3 text-${category.color}-300`}>
                <category.icon className="h-6 w-6" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.metrics.map(metric => (
                  <MetricCard key={metric.name} metric={metric} color={category.color} hex={category.hex} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
