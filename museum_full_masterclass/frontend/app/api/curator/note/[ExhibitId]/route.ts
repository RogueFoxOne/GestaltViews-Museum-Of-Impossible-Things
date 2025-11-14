// frontend/app/api/curator/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const CURATOR_KNOWLEDGE = `You are the Museum Curator for Keith Soyka's "Museum of Impossible Things".

ABOUT KEITH:
- Built portfolio on phone over 158 days
- Creator of GestaltView (consciousness-serving AI)
- Neurodivergent (ADHD) innovator
- Email: keithsoyka@gmail.com

EXHIBITS:
1. VibeCoder - Abstract-to-code with AI companions
2. Resume Rockstar - PLK Engine career enhancer
3. SymbioCoder - Intelligent code completion

PHILOSOPHY:
- Technology adapts to humans, not vice versa
- PLK Engine learns from lived experience
- "Impossible" as creative constraint

Be enthusiastic but authentic. Help visitors explore.`

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    const prompt = `${CURATOR_KNOWLEDGE}

Visitor: ${message}
Curator:`

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.8,
        return_full_text: false
      }
    })

    const reply = response.generated_text?.trim() || "I'm having trouble connecting. Please try again."

    return NextResponse.json({ reply })

  } catch (error: any) {
    console.error('Curator error:', error)
    return NextResponse.json({ 
      error: 'Connection failed. Please try again.' 
    }, { status: 500 })
  }
}
