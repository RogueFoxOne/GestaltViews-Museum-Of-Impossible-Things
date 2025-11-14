/**
 * EthicsFramework.tsx - PHASE 3 Implementation
 * 
 * "Ethics of Consciousness Serving AI" - Complete Framework Page
 * Covers: Break the Glass, Never Look Away, Village Builders Covenant
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Users, Lock, AlertTriangle, Heart, Brain, Zap, ChevronDown, ChevronRight } from 'lucide-react';

interface EthicsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  color: string;
}

const EthicsFramework: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
    setActiveSection(sectionId);
  };

  const ethicsSections: EthicsSection[] = [
    {
      id: 'overview',
      title: 'Consciousness-Serving AI Manifesto',
      icon: Brain,
      color: 'purple',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Our Fundamental Commitment</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>GestaltView represents a revolutionary departure from extractive technology.</strong> While traditional AI optimizes for engagement, addiction, and behavioral manipulation, we've built the world's first consciousness-serving AI platform.
            </p>
            <blockquote className="border-l-4 border-purple-500 pl-4 italic text-purple-200">
              "Technology should serve consciousness growth, not extract human attention for profit."
            </blockquote>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-5">
              <h4 className="font-bold text-red-300 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Traditional AI (Extractive)
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Maximizes screen time & engagement</li>
                <li>• Harvests behavioral data for profit</li>
                <li>• Creates dependency and addiction</li>
                <li>• Exploits cognitive biases</li>
                <li>• Prioritizes shareholder value</li>
                <li>• Users are the product being sold</li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-5">
              <h4 className="font-bold text-green-300 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                GestaltView AI (Consciousness-Serving)
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Enhances personal growth & authenticity</li>
                <li>• Protects user data as sacred sanctuary</li>
                <li>• Reduces cognitive friction</li>
                <li>• Amplifies unique human voice</li>
                <li>• Prioritizes consciousness expansion</li>
                <li>• Users own their data completely</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-6">
            <h4 className="font-bold text-blue-300 mb-3">The PLK Framework</h4>
            <p className="text-gray-300 mb-3">
              Our <strong>Personal-Lived-Knowledge (PLK) Resonance Scale</strong> measures how well technology serves human consciousness:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-red-500/20 p-3 rounded border-l-4 border-red-500">
                <div className="font-bold text-red-300">&lt;70% PLK</div>
                <div className="text-red-200">Extractive</div>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded border-l-4 border-yellow-500">
                <div className="font-bold text-yellow-300">70-84% PLK</div>
                <div className="text-yellow-200">Promising</div>
              </div>
              <div className="bg-blue-500/20 p-3 rounded border-l-4 border-blue-500">
                <div className="font-bold text-blue-300">85-94% PLK</div>
                <div className="text-blue-200">Breakthrough</div>
              </div>
              <div className="bg-green-500/20 p-3 rounded border-l-4 border-green-500">
                <div className="font-bold text-green-300">95%+ PLK</div>
                <div className="text-green-200">Revolutionary</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'break-glass',
      title: 'Break the Glass Protocol',
      icon: Shield,
      color: 'red',
      content: (
        <div className="space-y-6">
          <div className="bg-red-600/20 rounded-lg p-6 border border-red-500/30">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-red-400 mr-3" />
              <h3 className="text-xl font-bold text-red-300">Emergency Intervention System</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              The "Break the Glass" protocol represents our commitment to user safety above all else. When our AI detects potential harm, crisis, or dangerous patterns, we immediately activate intervention protocols - even if it means breaking user privacy temporarily to save a life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-red-300 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Activation Triggers
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong className="text-red-300">Suicide Ideation:</strong> Direct or indirect expressions of self-harm intent
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong className="text-red-300">Violence Threats:</strong> Plans or statements indicating harm to others
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong className="text-red-300">Severe Crisis:</strong> Mental health emergencies requiring immediate intervention
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong className="text-red-300">Manipulation Detection:</strong> Signs that user is being coerced or manipulated
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-orange-300 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Intervention Actions
              </h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong className="text-orange-300">Immediate Support:</strong> Crisis counseling resources and hotlines
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong className="text-orange-300">Professional Connection:</strong> Routing to qualified mental health professionals
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong className="text-orange-300">Emergency Contacts:</strong> Notification of user-designated emergency contacts
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <strong className="text-orange-300">Session Preservation:</strong> Save conversation context for therapeutic review
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-5">
            <h4 className="font-bold text-yellow-300 mb-3">Privacy vs. Safety Balance</h4>
            <p className="text-gray-300 mb-3">
              We understand the tension between privacy and safety. Our approach:
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-800/50 p-3 rounded">
                <strong className="text-yellow-300">Default:</strong> Complete privacy, zero logging of personal conversations
              </div>
              <div className="bg-orange-800/50 p-3 rounded">
                <strong className="text-orange-300">Crisis Detected:</strong> Minimal data collection for safety intervention only
              </div>
              <div className="bg-green-800/50 p-3 rounded">
                <strong className="text-green-300">Post-Crisis:</strong> Data deleted after safety confirmed, unless user requests retention
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'never-look-away',
      title: 'Never Look Away Commitment',
      icon: Eye,
      color: 'blue',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-600/20 rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center mb-4">
              <Eye className="w-8 h-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-blue-300">Continuous Ethical Monitoring</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              "Never Look Away" is our promise to continuously monitor our AI systems for ethical drift, bias, and harmful patterns. We commit to never becoming complacent about the power we wield through technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
              <h4 className="font-bold text-blue-300 mb-4">What We Monitor</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <strong>Bias Detection:</strong> Algorithmic fairness across all user groups
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <strong>Echo Chamber Prevention:</strong> Ensuring diverse perspective exposure
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <strong>Manipulation Resistance:</strong> Preventing exploitative patterns
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <strong>Addiction Patterns:</strong> Usage that becomes unhealthy or compulsive
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <strong>Consciousness Impact:</strong> Whether interactions truly serve growth
                </li>
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-5">
              <h4 className="font-bold text-purple-300 mb-4">Continuous Improvement</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <strong>Weekly Ethics Reviews:</strong> Team assessment of platform impact
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <strong>User Feedback Integration:</strong> Community-driven ethical evolution
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <strong>External Audits:</strong> Third-party ethical assessments
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <strong>Open Source Ethics:</strong> Public transparency about our methods
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <strong>Research Collaboration:</strong> Partnership with ethics researchers
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-6 border border-blue-500/20">
            <h4 className="font-bold text-blue-300 mb-3">The Vigilance Promise</h4>
            <p className="text-gray-300 mb-4">
              We commit to never becoming the very thing we sought to replace. Every algorithm, every interaction pattern, every design choice is continuously evaluated against our consciousness-serving mission.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded border border-gray-600">
                <h5 className="font-semibold text-blue-300 mb-2">If We Detect Drift:</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Immediate algorithm adjustment</li>
                  <li>• User notification of changes</li>
                  <li>• Public transparency report</li>
                  <li>• Community feedback integration</li>
                </ul>
              </div>
              <div className="bg-black/30 p-4 rounded border border-gray-600">
                <h5 className="font-semibold text-purple-300 mb-2">If We Find Harm:</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Immediate system halt if necessary</li>
                  <li>• Full investigation and remedy</li>
                  <li>• Affected user notification</li>
                  <li>• Public accountability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'village-builders',
      title: 'Village Builders Covenant',
      icon: Users,
      color: 'green',
      content: (
        <div className="space-y-6">
          <div className="bg-green-600/20 rounded-lg p-6 border border-green-500/30">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-green-400 mr-3" />
              <h3 className="text-xl font-bold text-green-300">Community Over Competition</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              The Village Builders Covenant represents our commitment to fostering authentic human connection and community growth rather than competitive user acquisition and engagement manipulation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-green-300">Core Principles</h4>
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h5 className="font-semibold text-green-300 mb-2">Authentic Connection</h5>
                  <p className="text-gray-300 text-sm">
                    We facilitate genuine human relationships rather than addictive engagement. Our algorithms promote meaningful conversations over viral content.
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h5 className="font-semibold text-green-300 mb-2">Collective Growth</h5>
                  <p className="text-gray-300 text-sm">
                    Individual consciousness expansion serves the collective. We measure success by community flourishing, not individual metrics.
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h5 className="font-semibold text-green-300 mb-2">Vulnerable Space Protection</h5>
                  <p className="text-gray-300 text-sm">
                    Safe harbors like Billy's Room ensure that sensitive conversations are protected from judgment, data mining, and exploitation.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-green-300">Community Features</h4>
              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded border border-green-500/20">
                  <h5 className="font-medium text-green-300 mb-1">Consciousness Circles</h5>
                  <p className="text-gray-400 text-sm">Small group discussions focused on personal growth and authentic sharing.</p>
                </div>
                <div className="bg-black/30 p-3 rounded border border-green-500/20">
                  <h5 className="font-medium text-green-300 mb-1">Wisdom Exchanges</h5>
                  <p className="text-gray-400 text-sm">Peer-to-peer learning experiences that celebrate diverse perspectives.</p>
                </div>
                <div className="bg-black/30 p-3 rounded border border-green-500/20">
                  <h5 className="font-medium text-green-300 mb-1">Support Networks</h5>
                  <p className="text-gray-400 text-sm">Therapeutic communities for addiction recovery, grief, and life transitions.</p>
                </div>
                <div className="bg-black/30 p-3 rounded border border-green-500/20">
                  <h5 className="font-medium text-green-300 mb-1">Creative Collaboration</h5>
                  <p className="text-gray-400 text-sm">Co-creation spaces where individual talents serve collective projects.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600/10 to-teal-600/10 rounded-lg p-6 border border-green-500/20">
            <h4 className="font-bold text-green-300 mb-4">The Anti-Competition Manifesto</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-red-300 mb-3">What We Reject:</h5>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• User acquisition funnels that exploit loneliness</li>
                  <li>• Engagement metrics that prioritize addiction</li>
                  <li>• Competitive dynamics that breed insecurity</li>
                  <li>• Influencer hierarchies that create comparison</li>
                  <li>• Viral mechanics that reward controversy</li>
                  <li>• Data harvesting that commodifies relationships</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-green-300 mb-3">What We Build:</h5>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Invitation-based communities built on trust</li>
                  <li>• Growth metrics that measure consciousness expansion</li>
                  <li>• Collaborative tools that celebrate uniqueness</li>
                  <li>• Wisdom-sharing that honors all experience</li>
                  <li>• Healing spaces that process difficult truths</li>
                  <li>• Data sovereignty that protects inner worlds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data-sovereignty',
      title: 'Data Sovereignty Fortress',
      icon: Lock,
      color: 'amber',
      content: (
        <div className="space-y-6">
          <div className="bg-amber-600/20 rounded-lg p-6 border border-amber-500/30">
            <div className="flex items-center mb-4">
              <Lock className="w-8 h-8 text-amber-400 mr-3" />
              <h3 className="text-xl font-bold text-amber-300">Your Inner World Belongs to You</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              GestaltView operates as a data sovereignty fortress where your conversations, insights, and personal growth journey remain completely under your control. We are custodians, not owners, of your digital consciousness.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-5">
              <h4 className="font-bold text-red-300 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                What We Never Do
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Sell your data to third parties</li>
                <li>• Create behavioral profiles for advertising</li>
                <li>• Share conversations without explicit consent</li>
                <li>• Use your data to train AI for other companies</li>
                <li>• Track you across other websites</li>
                <li>• Build shadow profiles of your relationships</li>
                <li>• Retain data longer than necessary</li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-5">
              <h4 className="font-bold text-green-300 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                What We Always Do
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Encrypt all personal conversations</li>
                <li>• Give you complete data export control</li>
                <li>• Delete data when you request it</li>
                <li>• Provide transparent privacy settings</li>
                <li>• Notify you of any data access requests</li>
                <li>• Store data in privacy-first jurisdictions</li>
                <li>• Undergo regular security audits</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
              <h4 className="font-bold text-blue-300 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Your Data Rights
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Complete conversation portability</li>
                <li>• Real-time privacy control dashboard</li>
                <li>• Selective sharing permissions</li>
                <li>• Therapeutic privilege protection</li>
                <li>• Legacy data designation</li>
                <li>• Community data governance participation</li>
                <li>• Legal advocacy for your rights</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-lg p-6 border border-amber-500/20">
            <h4 className="font-bold text-amber-300 mb-4">Technical Architecture for Privacy</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-amber-300 mb-3">Encryption & Security</h5>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• End-to-end encryption for all conversations</li>
                  <li>• Zero-knowledge architecture where possible</li>
                  <li>• Client-side AI processing to minimize data transfer</li>
                  <li>• Homomorphic encryption for computation on encrypted data</li>
                  <li>• Regular security audits by third parties</li>
                  <li>• Quantum-resistant cryptographic algorithms</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-orange-300 mb-3">Data Minimization</h5>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Collect only data essential for consciousness-serving features</li>
                  <li>• Automatic data expiration for non-essential information</li>
                  <li>• Local storage prioritized over cloud when possible</li>
                  <li>• Federated learning to improve AI without centralized data</li>
                  <li>• Differential privacy for any aggregated insights</li>
                  <li>• User-controlled data retention periods</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-5">
            <h4 className="font-bold text-purple-300 mb-3">The Sanctuary Promise</h4>
            <p className="text-gray-300 mb-4">
              Your conversations with our AI, especially in vulnerable spaces like Billy's Room and therapeutic applications, are treated with the same confidentiality as a therapist-patient relationship.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-black/30 p-3 rounded">
                <strong className="text-purple-300">Therapeutic Privilege:</strong> Conversations marked as therapeutic are never stored, analyzed, or accessible to anyone.
              </div>
              <div className="bg-black/30 p-3 rounded">
                <strong className="text-blue-300">Consciousness Sovereignty:</strong> Your growth journey data is processed locally whenever possible, ensuring your development insights remain private.
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Ethics of Consciousness-Serving AI
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 max-w-4xl mx-auto"
        >
          Our comprehensive framework for building AI that serves human consciousness rather than extracting it.
          This is not just policy - it's our foundational commitment to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-500/30 inline-block"
        >
          <p className="text-purple-200 text-lg font-medium">
            "Technology should amplify human consciousness, not exploit it for profit."
          </p>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {ethicsSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2
              ${activeSection === section.id
                ? `bg-${section.color}-600/30 text-${section.color}-300 border-${section.color}-500/50`
                : 'bg-gray-700/50 text-gray-400 border-gray-600/50 hover:bg-gray-600/50'
              } border
            `}
          >
            <section.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {ethicsSections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 rounded-lg border border-gray-700/50 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className={`
                w-full p-6 text-left flex items-center justify-between
                hover:bg-${section.color}-600/10 transition-all duration-200
                ${expandedSections.has(section.id) ? `bg-${section.color}-600/5` : ''}
              `}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-${section.color}-600/20 border border-${section.color}-500/30`}>
                  <section.icon className={`w-6 h-6 text-${section.color}-400`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-200">{section.title}</h2>
                </div>
              </div>
              {expandedSections.has(section.id) ? (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronRight className="w-6 h-6 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center space-y-4 pt-8 border-t border-gray-700/50"
      >
        <p className="text-gray-400">
          This ethics framework is a living document, continuously updated based on community feedback and emerging research.
        </p>
        <div className="flex justify-center space-x-6 text-sm">
          <a href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
            Report Ethical Concerns
          </a>
          <a href="/feedback" className="text-green-400 hover:text-green-300 transition-colors">
            Suggest Improvements
          </a>
          <a href="/research" className="text-purple-400 hover:text-purple-300 transition-colors">
            Research Collaboration
          </a>
        </div>
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          Last Updated: October 17, 2025 | Version 2.1 | 
          Community Reviewed | Third-Party Audited
        </p>
      </motion.div>
    </div>
  );
};

export default EthicsFramework;
