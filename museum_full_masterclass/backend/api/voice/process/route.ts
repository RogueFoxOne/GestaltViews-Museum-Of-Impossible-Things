// ENHANCED: Voice processing with consciousness-serving AI
import { NextRequest, NextResponse } from 'next/server'
import { consciousnessRouter } from '@/lib/llm-router'
import { z } from 'zod'

const VoiceRequestSchema = z.object({
  audioData: z.string(), // Base64 encoded audio
  task: z.enum(['transcription', 'voice-chat', 'recovery-support', 'adhd-assistance']),
  userProfile: z.object({
    adhd: z.boolean().optional(),
    recoveryStage: z.string().optional(),
    preferredTone: z.enum(['supportive', 'energetic', 'calm', 'professional']).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audioData, task, userProfile } = VoiceRequestSchema.parse(body)
    
    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(audioData, 'base64')
    
    // Transcribe audio using consciousness-serving AI
    const transcription = await transcribeAudio(audioBuffer)
    
    if (task === 'transcription') {
      return NextResponse.json({ transcription })
    }
    
    // Generate consciousness-serving voice response
    const response = await consciousnessRouter.routeConsciousnessRequest(
      transcription,
      {
        task: task === 'voice-chat' ? 'general-conversation' : task,
        userProfile: userProfile || {}
      }
    )
    
    // Convert text response to speech
    const speechData = await synthesizeSpeech(
      response.response,
      userProfile?.preferredTone || 'supportive'
    )
    
    return NextResponse.json({
      transcription,
      response: response.response,
      speechData: speechData.toString('base64'),
      provider: response.provider,
      metrics: response.metrics
    })
    
  } catch (error) {
    console.error('Voice processing error:', error)
    return NextResponse.json(
      { error: 'Voice processing temporarily unavailable' },
      { status: 500 }
    )
  }
}

async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  // Implement OpenAI Whisper or similar transcription
  // This is a placeholder - implement with your preferred service
  return "Transcribed audio content"
}

async function synthesizeSpeech(text: string, tone: string): Promise<Buffer> {
  // Implement text-to-speech with consciousness-serving tone
  // This is a placeholder - implement with your preferred service
  return Buffer.from("Speech audio data")
}
