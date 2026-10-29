import { NextRequest } from 'next/server'
export async function POST(req: NextRequest){
  const {text, avgConf} = await req.json()
  const prompt = `Return ONLY JSON: {"merchant": string, "total": number, "date": "YYYY-MM-DD", "category": "meals|travel|software|office_supplies|other", "line_items": [{"desc": string, "amount": number}], "needs_review": boolean, "review_reason": string}. Rules: meals if restaurant, travel if uber/hotel, software if SaaS, office_supplies if staples. Flag if total>500 or merchant unclear. OCR: ${text.slice(0,3000)} CONF:${avgConf}`
  try{
    const ollamaRes = await fetch(`${process.env.OLLAMA_URL||'http://localhost:11434'}/api/generate`,{method:'POST', body: JSON.stringify({model:'llama3.1', prompt, format:'json', stream:false})})
    const {response} = await ollamaRes.json()
    return new Response(response, {headers:{'Content-Type':'application/json'}})
  }catch(e){
    // fallback if no Ollama running
    return Response.json({merchant:'Unknown', total:0, category:'other', line_items:[], needs_review:true, review_reason:'Ollama offline'})
  }
}
