
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Auth(){
  const [email,setEmail]=useState(''); const [sent,setSent]=useState(false)
  async function login(e:any){
    e.preventDefault()
    await supabase.auth.signInWithOtp({email, options:{emailRedirectTo: window.location.origin+'/dashboard'}})
    setSent(true)
  }
  return <div className="min-h-screen flex items-center justify-center p-6">
    <form onSubmit={login} className="bg-zinc-900 p-8 rounded-[24px] w-full max-w-sm border border-zinc-800">
      <h1 className="text-2xl font-black mb-2">👻 ReceiptGhost</h1>
      <p className="text-zinc-400 text-sm mb-6">Magic link login — no passwords</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" className="w-full bg-black border border-zinc-800 rounded-full px-4 py-3 mb-3"/>
      <button className="w-full bg-lime-400 text-black font-bold py-3 rounded-full">{sent ? 'Check your email!' : 'Send magic link'}</button>
    </form>
  </div>
}
