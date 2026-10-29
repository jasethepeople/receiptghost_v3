import Link from 'next/link'
export default function Home(){
 return <main className="min-h-screen flex flex-col items-center justify-center p-6">
 <h1 className="text-6xl font-black">👻 ReceiptGhost</h1>
 <p className="mt-4 text-zinc-400">Snap a receipt. OCR in-browser. Categorized by local AI.</p>
 <Link href="/dashboard" className="mt-8 bg-lime-400 text-black px-8 py-3 rounded-full font-bold">Go to Dashboard</Link>
 </main>
}
