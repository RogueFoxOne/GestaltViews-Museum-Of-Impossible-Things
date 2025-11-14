// NEW FILE: Specialized recovery support API
import { NextRequest, NextResponse } from 'next/server'
import { consciousnessRouter } from '@/lib/llm-router'
import { z } from 'zod'

const RecoverySupportRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  recoveryType: z.enum(['addiction', 'mental-health', 'trauma', 'general']),
  dayCount: z.number().optional(),
  supportLevel: z.enum(['crisis', 'struggling', 'stable', 'thriving']),
  anonymousMode: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, recoveryType, dayCount, supportLevel, anonymousMode } = RecoverySupportRequestSchema.parse(body)
    
    // Enhanced system prompt for recovery support
    const recoveryContext = {
      task: 'recovery-support' as const,
      userProfile: {
        recoveryStage: supportLevel,
        preferredCommunicationStyle: 'empathetic-supportive'
      },
      context: {
        recoveryType,
        dayCount,
        anonymousMode,
        safetyFirst: true
      }
    }
    
    const response = await consciousnessRouter.routeConsciousnessRequest(
      message,
      recoveryContext
    )
    
    // Add crisis resources if needed
    const resources = getCrisisResources(supportLevel, recoveryType)
    
    return NextResponse.json({
      response: response.response,
      supportLevel,
      dayCount,
      resources: supportLevel === 'crisis' ? resources : null,
      consciousnessServing: true,
      anonymous: anonymousMode
    })
    
  } catch (error) {
    console.error('Recovery support error:', error)
    
    // Always provide basic crisis resources on error
    return NextResponse.json({
      response: "I'm here to support you. If you're in crisis, please reach out to professional help immediately.",
      resources: getCrisisResources('crisis', 'general'),
      error: 'Support service temporarily limited'
    }, { status: 500 })
  }
}

function getCrisisResources(supportLevel: string, recoveryType: string) {
  const resources = {
    crisis: {
      'addiction': [
        { name: 'SAMHSA National Helpline', number: '1-800-662-4357', available: '24/7' },
        { name: 'Crisis Text Line', text: 'Text HOME to 741741', available: '24/7' }
      ],
      'mental-health': [
        { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
        { name: 'Crisis Text Line', text: 'Text HOME to 741741', available: '24/7' }
      ],
      'general': [
        { name: 'Crisis Text Line', text: 'Text HOME to 741741', available: '24/7' },
        { name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' }
      ]
    }
  }
  
  return resources.crisis[recoveryType as keyof typeof resources.crisis] || resources.crisis.general
}
