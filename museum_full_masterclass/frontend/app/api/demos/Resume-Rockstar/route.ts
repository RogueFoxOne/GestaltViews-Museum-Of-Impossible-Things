// frontend/app/api/demos/Resume-Rockstar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 })
    }

    const prompt = `You are a PLK (Personal Lived Knowledge) Engine. Transform this career narrative into a compelling, authentic version with powerful verbs and quantified achievements:

Input: "${text}"

Enhanced version:`

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false
      }
    })

    const reply = response.generated_text?.trim() || 'Enhancement failed. Please try again.'

    return NextResponse.json({ reply })

  } catch (error: any) {
    console.error('Resume Rockstar error:', error)
    return NextResponse.json({ 
      error: 'Enhancement failed. Please try again.' 
    }, { status: 500 })
  }
}
