export async function categorizeWithOllama(text: string, avgConf: number) {
  const prompt = `You are a receipt parser. Return ONLY valid JSON:
{"merchant": string, "total": number, "date": "YYYY-MM-DD", "category": "meals|travel|software|office_supplies|other", "line_items": [{"desc": string, "amount": number}], "needs_review": boolean, "review_reason": string}
Rules: meals=restaurant/food, travel=uber/hotel/airline, software=SaaS/subscription, office_supplies=staples/etc. needs_review if total>500 or unclear. OCR: ${text.slice(0,2000)} CONF:${avgConf}`;
  const res = await fetch(`${process.env.OLLAMA_URL || 'http://localhost:11434'}/api/generate`, {
    method: 'POST',
    body: JSON.stringify({ model: 'llama3.1', prompt, format: 'json', stream: false })
  })
  const j = await res.json()
  return JSON.parse(j.response)
}
