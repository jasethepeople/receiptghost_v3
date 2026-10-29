# ReceiptGhost
Next.js + Supabase + Tesseract.js + Ollama + Stripe

1. cp .env.example .env.local and fill
2. Run supabase SQL from earlier message
3. ollama pull llama3.1 && ollama serve
4. npm i && npm run dev
5. Stripe: create product $9/mo, copy price id, set webhook to /api/stripe/webhook

Free tier 10/mo enforced in dashboard/page.tsx + you should add DB function get_monthly_count.
CSV export at /api/export - gate by tier.
Mobile: component uses capture="environment" for camera.


Auth: Magic link enabled in Supabase Auth > Email. MonthlySummary component uses pure div bars - no chart lib needed.
