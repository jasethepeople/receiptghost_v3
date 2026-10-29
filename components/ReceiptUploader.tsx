'use client'
import { useState } from 'react'
import { createWorker } from 'tesseract.js'
export default function ReceiptUploader({onParsed}:{onParsed:(d:any)=>void}){
  const [p,setP]=useState(0); const [s,setS]=useState('')
  async function handleFile(file:File){
    const worker = await createWorker('eng');
    setS('Scanning with Tesseract...'); 
    const {data}= await (worker as any).recognize(file, {}, { logger:(m:any)=> m.progress && setP(Math.round(m.progress*100))});
    await worker.terminate(); setS('Categorizing with Ollama...')
    const res = await fetch('/api/categorize',{method:'POST', body: JSON.stringify({text:data.text, avgConf:data.confidence})})
    const cat = await res.json()
    onParsed({raw_ocr_text:data.text, ocr_confidence_avg:data.confidence, ...cat, image_file:file})
    setS('Done!')
  }
  return <div className="border-2 border-dashed border-zinc-700 rounded-[24px] p-8 text-center bg-zinc-900">
    <input type="file" accept="image/*" capture="environment" id="ru" className="hidden" onChange={e=> e.target.files && handleFile(e.target.files[0])}/>
    <label htmlFor="ru" className="bg-white text-black px-6 py-3 rounded-full font-bold cursor-pointer">📸 Take Photo / Upload</label>
    {s && <div className="mt-4 text-sm text-zinc-300">{s} {p>0 && p<100 ? `${p}%`:''}</div>}
  </div>
}
