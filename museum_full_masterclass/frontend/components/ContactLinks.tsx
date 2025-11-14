// frontend/components/ContactLinks.tsx
'use client'

import { Mail, Linkedin, Music, Facebook, Twitter, Youtube } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactLinks() {
  const links = [
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:keithsoyka@gmail.com',
      color: 'from-red-500 to-pink-500',
      hoverColor: 'hover:from-red-400 hover:to-pink-400',
      description: 'Get in touch directly'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/keithsoyka413',
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-500 hover:to-blue-600',
      description: 'Professional network'
    },
    {
      name: 'Spotify',
      icon: Music,
      url: 'https://open.spotify.com/playlist/5o1BiUNmzifAiXjPnx1f6B',
      color: 'from-green-500 to-emerald-600',
      hoverColor: 'hover:from-green-400 hover:to-emerald-500',
      description: 'My creative playlist'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/share/1K8taTx9nU/',
      color: 'from-blue-500 to-indigo-600',
      hoverColor: 'hover:from-blue-400 hover:to-indigo-500',
      description: 'Social updates'
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: 'https://x.com/GestaltView',
      color: 'from-slate-700 to-slate-900',
      hoverColor: 'hover:from-slate-600 hover:to-slate-800',
      description: '@GestaltView'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@keithsoyka',
      color: 'from-red-600 to-red-700',
      hoverColor: 'hover:from-red-500 hover:to-red-600',
      description: 'Video content'
    }
  ]

  return (
    <section 
      id="contact-links" 
      className="relative py-24 bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Reach out to discuss consciousness-serving AI, innovative projects, or impossible ideas
          </p>
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {links.map((link, index) => {
            const Icon = link.icon
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${link.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {link.name}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {link.description}
                </p>

                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg 
                    className="w-5 h-5 text-cyan-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Available for consulting & collaboration</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
