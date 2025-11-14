// frontend/components/MuseumCurator.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'curator'
  content: string
  timestamp: Date
}

export default function MuseumCurator() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'curator',
      content: "Welcome to the Museum of Impossible Things! I'm your curator. Ask me anything about GestaltView, the exhibits, or Keith's journey.",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      const curatorMessage: Message = {
        role: 'curator',
        content: data.reply,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, curatorMessage])
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'curator',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-110 transition-all"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-50 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh] bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 p-4 border-b border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎭</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Museum Curator</h3>
                  <p className="text-xs text-gray-400">Your guide to the impossible</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                        : 'bg-slate-800 text-gray-200 border border-purple-500/20'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-gray-400 rounded-2xl px-4 py-2 border border-purple-500/20">
                    <div className="flex gap-1">
                      <div 
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" 
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div 
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" 
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div 
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" 
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-500/30 bg-slate-900/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about GestaltView..."
                  className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-500/60 placeholder-gray-500 text-sm"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
