import { stripe } from '@/lib/stripe'
export async function POST(){
  const session = await stripe.checkout.sessions.create({
    mode:'subscription',
    line_items:[{price:process.env.STRIPE_PRO_PRICE_ID!, quantity:1}],
    success_url:`${process.env.NEXT_PUBLIC_URL}/dashboard?upgraded=1`,
    cancel_url:`${process.env.NEXT_PUBLIC_URL}/dashboard`,
  })
  return Response.json({url: session.url})
}
