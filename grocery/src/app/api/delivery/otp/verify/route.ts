import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import { sendMail } from "@/lib/mailer";
import DeliveryAssigment from "@/models/deliveryAssigment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectDb()
        const { orderId, otp } = await req.json()
        // console.log(orderId, otp)
        if(!orderId || !otp){
            return NextResponse.json(
            {message: "orderId and Otp not found"},
            {status:400}
        ) 
        }

        const order = await Order.findById(orderId)
        if(!order){
            return NextResponse.json(
                {message:"order not found"},
                {status:400}
            )
        }

        if(order.deliveryOtp !== otp){
            return NextResponse.json(
                {message:"Incorrect or expired Otp"},
                {status:400}
            )
        }

        order.status = "delivered"
        order.deliveryOtpVefication = true
        order.deliveredAt = new Date()
        await order.save()

        await emitEventHandler("order-status-update",{orderId:order._id, status:order.status})

        await DeliveryAssigment.updateOne(
            {order:orderId},
            {$set:{assignedTo:null, status:"completed"}}
        )

        return NextResponse.json(
            {message: "Delivery successfully completed"},
            {status:200}
        )       
    } catch (error) {
        return NextResponse.json(
            {message: `verify otp error ${error}`},
            {status:500}
        )   
    }
}