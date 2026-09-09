import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const {userId, items, totalAmount, paymentMethod, address} = await req.json()
        if(!userId || !items || !totalAmount || !paymentMethod || !address){
            return NextResponse.json(
                {message:"please send all credentials"},
                {status:400}
            )
        }

        const user = await User.findById(userId)
        if(!user){
            return NextResponse.json(
                {message:"User not found"},
                {status:400}
            )
        }

        const newOrder = await Order.create({
            user:userId,
            items,
            paymentMethod,
            totalAmount,
            address
        })

        // socket.io implementation
        await emitEventHandler("new-order", newOrder)

        return NextResponse.json(
            newOrder,
            {status:201}
        )

    } catch (error) {
        // console.log(error)
        return NextResponse.json(    
            {message:`place order error ${error}`},
            {status:500}
        )    
    }
}