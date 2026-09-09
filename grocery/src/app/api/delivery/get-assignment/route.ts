import { auth } from "@/auth";
import connectDb from "@/lib/db";
import DeliveryAssigment from "@/models/deliveryAssigment.model";
import { NextResponse } from "next/server";
import Order from "@/models/order.model";

export async function GET() {
    try {
        await connectDb()
        const session =await auth()
        const assignments = await DeliveryAssigment.find({
            brodcastedTo:session?.user?.id,
            status:"brodcasted"
        }).populate('order')

        return NextResponse.json(
            assignments,
            {status:200}
        )

    } catch (error:any) {
        // console.log("MESSAGE:", error?.message);
        // console.log("NAME:", error?.name);
        // console.log("STACK:", error?.stack);
        return NextResponse.json(
            {message:`get assignment error ${error}`},
            {status:500}
        )
    }
    
}