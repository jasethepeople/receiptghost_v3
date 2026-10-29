import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
export async function POST(req: Request){
  const body = await req.text(); const sig = req.headers.get('stripe-signature')!
  try{
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    if(event.type==='checkout.session.completed'){
      const session = event.data.object as any
      const customer = session.customer
      // find user by customer and set pro
      const supa = supabaseAdmin()
      await supa.from('profiles').update({subscription_tier:'pro', stripe_customer_id:customer}).eq('stripe_customer_id', customer)
    }
    return new Response('ok')
  }catch(e:any){ return new Response(e.message,{status:400}) }
}
