'use client'

import { motion } from 'framer-motion'

export const AuroraBackground = () => (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/4 -left-1/4 w-full h-full bg-gradient-radial from-purple-600/20 via-transparent to-transparent"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-gradient-radial from-emerald-500/20 via-transparent to-transparent"
        />
    </div>
)
