// frontend/app/api/demos/VibeCoder/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const COMPANION_PROMPTS = {
  'Curious Cat': 'You are a curious, playful AI that explores code with wonder. Use creative metaphors.',
  'Zen Master': 'You are a calm, philosophical AI that writes elegant, minimalist code.',
  'Hype Coach': 'You are an energetic, motivational AI that makes coding exciting!',
  'Wise Fool': 'You are a paradoxical AI that teaches through playful contradictions.'
}

export async function POST(req: NextRequest) {
  try {
    const { text, companion = 'Curious Cat' } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 })
    }

    const prompt = `${COMPANION_PROMPTS[companion as keyof typeof COMPANION_PROMPTS]}

Task: Translate this abstract prompt into working JavaScript code: "${text}"

Return ONLY code with brief comments. No explanations.

Code:`

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.9,
        top_p: 0.95,
        return_full_text: false
      }
    })

    const generatedText = response.generated_text || ''
    
    // Extract code
    const codeMatch = generatedText.match(/``````/)
    const code = codeMatch 
      ? codeMatch[0].replace(/``````/g, '') 
      : generatedText.trim()

    return NextResponse.json({ 
      reply: `${companion} says: Code generated!`, 
      code 
    })

  } catch (error: any) {
    console.error('VibeCoder error:', error)
    return NextResponse.json({ 
      error: 'Code generation failed. Please try again.' 
    }, { status: 500 })
  }
}
