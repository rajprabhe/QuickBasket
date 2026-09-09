import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import DeliveryAssigment from "@/models/deliveryAssigment.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";



export async function GET(){
    console.log("Order model:", Order);
    console.log("Registered models:", mongoose.modelNames());
    try {
        await connectDb()
        const session = await auth()
        const deliveryBoyId = session?.user?.id

        const activeAssignment = await DeliveryAssigment.findOne({
            assignedTo:deliveryBoyId,
            status:"assigned"
        }).populate(
            {
                path:"order",
                populate:{path:"address"}
            }
        ).lean()

        if(!activeAssignment){
            return NextResponse.json(
                {active:false},
                {status:400}
            )
        }

        return NextResponse.json(
            {active:true, assignment:activeAssignment},
            {status:200}
        )


    } catch (error:any) {
        // console.log(error.message)
        // console.log(error.name)
        return NextResponse.json(
            {message:`current order error ${error}`},
            {status:500}
        )
        
    }
}