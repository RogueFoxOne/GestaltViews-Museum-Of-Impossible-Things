// /components/MuseumHeader.tsx
// ✅ FIXED & ENHANCED VERSION
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Brain, Heart, Shield } from 'lucide-react';
import { MUSEUM_EXHIBITS } from '@/app/data/exhibits'; // Import the single source of truth

const MuseumHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Key exhibits to feature in the nav
  const featuredNavItems = MUSEUM_EXHIBITS.filter(ex => 
    ['vibecoder-demo', 'resume-rockstar-demo', 'musical-dna', 'addiction-recovery'].includes(ex.slug)
  );

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-purple-500/20' : 'bg-transparent'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  Museum of Impossible Things
                </h1>
                <p className="text-xs text-slate-400 -mt-1">
                  A Keith Soyka Creation
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors">
                Main Hall
              </Link>
              {featuredNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/exhibits/${item.slug}`}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                >
                  {item.title.split(' ')[0]} {/* Show first word for brevity */}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer to prevent content from being hidden behind the fixed header */}
      <div className="h-20" />

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
              onClick={toggleMenu}
            />
            
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-80 max-w-[90vw] h-full bg-slate-950 border-l border-purple-500/20 z-[100] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-bold text-white">Navigation</h2>
                  <button onClick={toggleMenu} className="p-1"><X className="w-6 h-6 text-slate-400" /></button>
                </div>

                <div className="space-y-2">
                  <Link href="/" onClick={toggleMenu} className="flex items-center gap-4 p-3 rounded-md hover:bg-slate-800/50">
                    <Home className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-slate-200">Main Hall</span>
                  </Link>

                  <div className="pt-4 mt-2 border-t border-slate-700/50">
                    <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Exhibits</h3>
                    {/* ✨ DYNAMICALLY GENERATED from exhibits.ts */}
                    {MUSEUM_EXHIBITS.map((item) => (
                      <Link
                        key={item.id}
                        href={`/exhibits/${item.slug}`}
                        onClick={toggleMenu}
                        className="flex items-start gap-4 p-3 rounded-md hover:bg-slate-800/50"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {item.category.includes('Recovery') ? <Heart className="w-5 h-5 text-green-400" /> : <Shield className="w-5 h-5 text-teal-400" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{item.title}</p>
                          <p className="text-sm text-slate-400">{item.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MuseumHeader;
