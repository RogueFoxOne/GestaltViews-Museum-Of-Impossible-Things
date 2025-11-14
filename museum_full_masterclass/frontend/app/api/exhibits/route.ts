import { NextResponse } from 'next/server'

const EXHIBITS = [
  {
    id: 'vibecoder',
    title: 'VibeCoder v2.0',
    description: 'AI-powered coding assistant built for neurodivergent minds',
    technologies: ['TypeScript', 'Next.js', 'AI'],
    completed: true
  },
  {
    id: 'plk',
    title: 'Personal Language Key',
    description: 'Revolutionary framework for consciousness-serving AI',
    technologies: ['Python', 'NLP', 'Machine Learning'],
    completed: true
  },
  {
    id: 'bucket-drops',
    title: 'Bucket Drops',
    description: 'Neurodivergent-friendly note-taking system',
    technologies: ['React', 'TypeScript', 'LocalStorage'],
    completed: true
  }
]

export async function GET() {
  return NextResponse.json({ exhibits: EXHIBITS })
}
