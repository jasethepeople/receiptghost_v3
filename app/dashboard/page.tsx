'use client'
import { useEffect, useState } from 'react'
import ReceiptUploader from '@/components/ReceiptUploader'
import { supabase } from '@/lib/supabase'
export default function Dashboard(){
  const [receipts,setReceipts]=useState<any[]>([]); const [tier,setTier]=useState('free')
  useEffect(()=>{ supabase.from('receipts').select('*').order('created_at',{ascending:false}).then(({data})=> setReceipts(data||[])) },[])
  async function saveParsed(d:any){
    // check limit
    const month = new Date().getMonth()+1; const year=new Date().getFullYear()
    const count = receipts.filter(r=> new Date(r.created_at).getMonth()+1===month).length
    if(tier==='free' && count>=10){ alert('Free tier limit 10/mo - upgrade to Pro'); return }
    const {data:user}= await supabase.auth.getUser()
    const userId = user.user?.id || '00000000-0000-0000-0000-000000000000' // replace with real auth
    const {data,error}= await supabase.from('receipts').insert({
      user_id:userId, merchant:d.merchant, total:d.total, date:d.date||new Date().toISOString().slice(0,10),
      category:d.category, needs_review:d.needs_review, review_reason:d.review_reason,
      raw_ocr_text:d.raw_ocr_text, line_items:d.line_items, ocr_confidence_avg:d.ocr_confidence_avg
    }).select().single()
    if(!error && data) setReceipts([data,...receipts])
  }
  return <main className="max-w-xl mx-auto p-4 pb-24">
    <header className="flex justify-between items-center py-4"><h1 className="font-black text-2xl">👻 ReceiptGhost</h1><span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">{receipts.length}/10 free</span></header>
    <ReceiptUploader onParsed={saveParsed}/>
    <div className="mt-6 space-y-3">
      {receipts.map(r=> <div key={r.id} className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <div className="flex justify-between"><b>{r.merchant||'Unknown'}</b><span className="text-lime-400">${r.total}</span></div>
        <div className="text-xs text-zinc-400">{r.category} • {r.date} {r.needs_review && <span className="text-amber-400">• Needs review: {r.review_reason}</span>}</div>
        {r.line_items && <div className="mt-2 text-xs">{r.line_items.map((li:any,i:number)=><div key={i} className="flex justify-between"><span>{li.desc}</span><span>${li.amount}</span></div>)}</div>}
      </div>)}
    </div>
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-zinc-800 flex gap-2 max-w-xl mx-auto">
      <button onClick={()=> window.location.href='/api/export'} className="flex-1 bg-zinc-800 py-3 rounded-full text-sm">Export CSV {tier==='free' && '🔒 Pro'}</button>
      <button onClick={async()=>{ const r=await fetch('/api/stripe/checkout',{method:'POST'}); const j=await r.json(); window.location.href=j.url}} className="flex-1 bg-lime-400 text-black py-3 rounded-full font-bold text-sm">Upgrade $9/mo</button>
    </div>
  </main>
}
