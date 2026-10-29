import { NextRequest } from 'next/server'
import { categorizeWithOllama } from '@/lib/ollama'
export async function POST(req: NextRequest){
  const {text, avgConf} = await req.json()
  const result = await categorizeWithOllama(text, avgConf)
  return Response.json(result)
}
