import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// stripe isko automatically call karata hai
export async function POST(req:NextRequest){

    // stripe-signature --> provide stripe automatically in header 
    // official document read
    const sig = req.headers.get("stripe-signature")
    const rawBody = await req.text()
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        ) 
    } catch (error) {
        console.log("signature verification failed", error)
    }

    if(event?.type === "checkout.session.completed"){
        // event.data.object --> jo metadata beja woh milega
        // hamane order beja
        const session = event.data.object
        await connectDb()
        await Order.findByIdAndUpdate(session?.metadata?.orderId, {
            isPaid:true
        })
    }

    return NextResponse.json(
        {received:true},
        {status:200}
    )
}
