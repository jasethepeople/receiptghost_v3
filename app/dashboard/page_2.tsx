
'use client'
import { useEffect, useState } from 'react'
import ReceiptUploader from '@/components/ReceiptUploader'
import MonthlySummary from '@/components/MonthlySummary'
import Auth from '@/components/Auth'
import { supabase } from '@/lib/supabase'
export default function Dashboard(){
  const [receipts,setReceipts]=useState<any[]>([]); const [tier,setTier]=useState('free'); const [user,setUser]=useState<any>(null); const [loading,setLoading]=useState(true)
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{ setUser(data.user); setLoading(false); if(data.user) load() })
    const {data:listener} = supabase.auth.onAuthStateChange((_,sess)=>{ setUser(sess?.user||null); if(sess?.user) load() })
    return ()=> listener.subscription.unsubscribe()
  },[])
  async function load(){
    const {data} = await supabase.from('receipts').select('*').order('created_at',{ascending:false})
    setReceipts(data||[])
    const {data:prof} = await supabase.from('profiles').select('subscription_tier').single()
    if(prof) setTier(prof.subscription_tier)
  }
  async function saveParsed(d:any){
    const month = new Date().getMonth()+1
    const count = receipts.filter(r=> new Date(r.created_at).getMonth()+1===month).length
    if(tier==='free' && count>=10){ alert('Free limit 10/mo — upgrade to Pro'); return }
    const userId = user?.id
    if(!userId) return
    // optional upload image to storage
    let image_url = null
    if(d.image_file){
      const path = `${userId}/${Date.now()}.jpg`
      await supabase.storage.from('receipts').upload(path, d.image_file)
      const {data} = supabase.storage.from('receipts').getPublicUrl(path)
      image_url = data.publicUrl
    }
    const {data,error}= await supabase.from('receipts').insert({
      user_id:userId, merchant:d.merchant, total:d.total, date:d.date||new Date().toISOString().slice(0,10),
      category:d.category, needs_review:d.needs_review, review_reason:d.review_reason,
      raw_ocr_text:d.raw_ocr_text, line_items:d.line_items, ocr_confidence_avg:d.ocr_confidence_avg, image_url
    }).select().single()
    if(!error && data) setReceipts([data,...receipts])
  }
  if(loading) return null
  if(!user) return <Auth/>
  return <main className="max-w-xl mx-auto p-4 pb-28">
    <header className="flex justify-between items-center py-4">
      <h1 className="font-black text-2xl">👻 ReceiptGhost</h1>
      <div className="flex gap-2 items-center">
        <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full">{receipts.length}/10 {tier}</span>
        <button onClick={()=> supabase.auth.signOut().then(()=>setUser(null))} className="text-xs text-zinc-500">Logout</button>
      </div>
    </header>
    <MonthlySummary receipts={receipts.filter(r=> new Date(r.created_at).getMonth()===new Date().getMonth())} />
    <div className="mt-4"><ReceiptUploader onParsed={saveParsed}/></div>
    <div className="mt-6 space-y-3">
      {receipts.map(r=> <div key={r.id} className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <div className="flex justify-between"><b>{r.merchant||'Unknown'}</b><span className="text-lime-400">${r.total}</span></div>
        <div className="text-xs text-zinc-400">{r.category} • {r.date} {r.needs_review && <span className="text-amber-400">• {r.review_reason}</span>}</div>
        {r.image_url && <img src={r.image_url} className="mt-2 rounded-xl max-h-32 object-cover"/>}
      </div>)}
    </div>
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur border-t border-zinc-800 flex gap-2 max-w-xl mx-auto">
      <button onClick={()=> window.location.href='/api/export'} className="flex-1 bg-zinc-800 py-3 rounded-full text-sm">Export CSV {tier==='free' && '🔒 Pro'}</button>
      {tier==='free' && <button onClick={async()=>{ const r=await fetch('/api/stripe/checkout',{method:'POST'}); const j=await r.json(); window.location.href=j.url}} className="flex-1 bg-lime-400 text-black py-3 rounded-full font-bold text-sm">Upgrade $9/mo</button>}
    </div>
  </main>
}
