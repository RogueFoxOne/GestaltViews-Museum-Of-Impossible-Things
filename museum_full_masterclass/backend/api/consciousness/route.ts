// NEW FILE: Comprehensive consciousness-serving API endpoints
import { NextRequest, NextResponse } from 'next/server'
import { consciousnessEngine } from '@/lib/plk-engine'
import { consciousnessRouter } from '@/lib/llm-router'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'

// Request validation schemas
const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  task: z.enum([
    'general-conversation',
    'recovery-support', 
    'adhd-assistance',
    'creativity-boost',
    'consciousness-expansion',
    'neurodivergent-support'
  ]).optional(),
  userProfile: z.object({
    neurodivergenceType: z.string().optional(),
    recoveryStage: z.string().optional(),
    preferredCommunicationStyle: z.string().optional(),
    adhd: z.boolean().optional()
  }).optional(),
  stream: z.boolean().optional()
})

const InsightRequestSchema = z.object({
  recentExperiences: z.array(z.string()).max(10),
  currentChallenges: z.array(z.string()).max(10),
  growthAreas: z.array(z.string()).max(10)
})

// Rate limiting - consciousness-serving limits
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

// POST /api/consciousness/chat
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    await limiter.check(request, 10, 'CONSCIOUSNESS_CHAT') // 10 per minute
    
    const body = await request.json()
    const { message, task, userProfile, stream } = ChatRequestSchema.parse(body)
    
    if (stream) {
      // Streaming response
      const streamResponse = await consciousnessRouter.streamConsciousnessResponse(
        message,
        { 
          task: task || 'general-conversation', 
          userProfile: userProfile || {} 
        }
      )
      
      return new Response(streamResponse.toAIStream(), {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'X-Consciousness-Serving': 'true'
        }
      })
    } else {
      // Regular response
      const result = await consciousnessRouter.routeConsciousnessRequest(
        message,
        { 
          task: task || 'general-conversation', 
          userProfile: userProfile || {} 
        }
      )
      
      return NextResponse.json({
        response: result.response,
        provider: result.provider,
        metrics: result.metrics,
        consciousnessServing: true
      })
    }
  } catch (error) {
    console.error('Consciousness chat error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Consciousness-serving AI temporarily unavailable' },
      { status: 500 }
    )
  }
}

// POST /api/consciousness/insights
export async function POST(request: NextRequest) {
  try {
    await limiter.check(request, 3, 'CONSCIOUSNESS_INSIGHTS') // 3 per minute
    
    const body = await request.json()
    const { recentExperiences, currentChallenges, growthAreas } = InsightRequestSchema.parse(body)
    
    const insights = await consciousnessEngine.generateConsciousnessInsights({
      recentExperiences,
      currentChallenges,
      growthAreas
    })
    
    return NextResponse.json({
      insights,
      generatedAt: new Date().toISOString(),
      consciousnessServing: true
    })
  } catch (error) {
    console.error('Consciousness insights error:', error)
    
    return NextResponse.json(
      { error: 'Insight generation temporarily unavailable' },
      { status: 500 }
    )
  }
}

// GET /api/consciousness/health
export async function GET(request: NextRequest) {
  try {
    const providerStatus = consciousnessRouter.getProviderStatus()
    const metrics = consciousnessEngine.getConsciousnessMetrics()
    
    return NextResponse.json({
      status: 'operational',
      providers: providerStatus,
      consciousnessMetrics: metrics,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'degraded', error: 'Health check failed' },
      { status: 500 }
    )
  }
}
