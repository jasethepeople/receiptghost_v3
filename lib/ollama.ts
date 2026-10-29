export async function categorizeWithOllama(text: string, avgConf: number){
  const prompt = `Return ONLY JSON: {"merchant": string, "total": number, "date": "YYYY-MM-DD", "category": "meals|travel|software|office_supplies|other", "line_items": [{"desc": string, "amount": number}], "needs_review": boolean, "review_reason": string}. Rules: meals=restaurant, travel=uber/hotel/airline, software=SaaS, office_supplies=staples. Flag if total>500. OCR: ${text.slice(0,3000)} CONF:${avgConf}`
  try{
    const url = process.env.OLLAMA_URL || 'http://localhost:11434'
    const res = await fetch(`${url}/api/generate`, {method:'POST', body: JSON.stringify({model:'llama3.1', prompt, format:'json', stream:false}), signal: AbortSignal.timeout(10000)})
    if(res.ok){ const j = await res.json(); return JSON.parse(j.response) }
  }catch(e){ console.log('Ollama failed', e) }
  if(process.env.GROQ_API_KEY){
    try{
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST', headers:{'Authorization':`Bearer ${process.env.GROQ_API_KEY}`,'Content-Type':'application/json'}, body: JSON.stringify({model:'llama-3.1-8b-instant', messages:[{role:'user', content: prompt}], response_format:{type:'json_object'}})})
      const j = await res.json(); return JSON.parse(j.choices[0].message.content)
    }catch(e){ console.log('Groq failed', e) }
  }
  const totalMatch = text.match(/\$?\s?(\d+\.\d{2})/g)
  return {merchant:'Unknown', total: totalMatch ? parseFloat(totalMatch[totalMatch.length-1].replace('$','')) : 0, date: new Date().toISOString().slice(0,10), category:'other', line_items:[], needs_review:true, review_reason:'AI offline - manual check'}
}
