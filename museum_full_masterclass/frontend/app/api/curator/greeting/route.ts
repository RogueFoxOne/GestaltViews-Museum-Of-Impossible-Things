import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const GREETINGS = [
  "Welcome, traveler of consciousness...",
  "Greetings. You stand at the threshold of impossible things...",
  "Enter freely, and leave with your mind expanded...",
  "Step through the veil. These exhibits await those who dare to see.",
  "The museum recognizes you. Your journey begins now.",
  "Reality bends here. Prepare to witness the impossible."
];

export async function GET() {
  const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  return NextResponse.json({ 
    greeting,
    timestamp: new Date().toISOString()
  });
}

