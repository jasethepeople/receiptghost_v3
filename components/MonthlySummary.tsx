
'use client'
export default function MonthlySummary({receipts}:{receipts:any[]}){
  const cats = ['meals','travel','software','office_supplies','other']
  const totals: any = {}
  cats.forEach(c=> totals[c]=0)
  receipts.forEach(r=>{ totals[r.category||'other'] += Number(r.total||0) })
  const max = Math.max(...Object.values(totals) as number[], 1)
  return <div className="bg-zinc-900 rounded-[20px] p-5 border border-zinc-800">
    <h3 className="font-bold mb-4">This Month — ${receipts.reduce((s,r)=>s+Number(r.total||0),0).toFixed(2)}</h3>
    <div className="space-y-2">
      {cats.map(c=>{
        const val = totals[c]; const w = (val/max)*100
        return <div key={c} className="flex items-center gap-2 text-xs">
          <span className="w-20 capitalize text-zinc-400">{c.replace('_',' ')}</span>
          <div className="flex-1 bg-black h-3 rounded-full overflow-hidden"><div className="bg-lime-400 h-3" style={{width:`${w}%`}} /></div>
          <span className="w-14 text-right">${val.toFixed(0)}</span>
        </div>
      })}
    </div>
  </div>
}
