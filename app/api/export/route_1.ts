import { supabaseAdmin } from '@/lib/supabase'
export async function GET(){
  const supa = supabaseAdmin()
  const {data} = await supa.from('receipts').select('*').limit(1000)
  // TODO check tier via auth
  const rows = [['id','merchant','date','total','category','needs_review','review_reason','created_at']]
  data?.forEach(r=> rows.push([r.id,r.merchant,r.date,r.total,r.category,r.needs_review,r.review_reason,r.created_at].join(',')))
  return new Response(rows.join('\n'),{headers:{'Content-Type':'text/csv','Content-Disposition':'attachment; filename=receiptghost-'+new Date().toISOString().slice(0,7)+'.csv'}})
}
