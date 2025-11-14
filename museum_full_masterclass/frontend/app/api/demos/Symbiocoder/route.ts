// frontend/app/api/demos/SymbioCoder/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 })
    }

    const prompt = `Complete this code snippet with clean, functional JavaScript:

${text}

Completed code:`

    const response = await hf.textGeneration({
      model: 'bigcode/starcoder2-15b',
      inputs: prompt,
      parameters: {
        max_new_tokens: 400,
        temperature: 0.6,
        return_full_text: false
      }
    })

    const code = response.generated_text?.trim() || '// Code generation failed'

    return NextResponse.json({ 
      reply: 'Code completed successfully!', 
      code 
    })

  } catch (error: any) {
    console.error('SymbioCoder error:', error)
    return NextResponse.json({ 
      error: 'Code completion failed. Please try again.' 
    }, { status: 500 })
  }
}
