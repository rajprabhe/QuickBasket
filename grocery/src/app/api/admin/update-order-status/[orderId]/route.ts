import connectDb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssigment from "@/models/deliveryAssigment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, context:{params: Promise<{
    orderId:string}>
}){
    try {
        await connectDb()
        const { orderId } = await context.params
        const { status } = await req.json()
        const order = await Order.findById(orderId).populate("user")
        console.log(order)

        if(!order){
            return NextResponse.json(
                {message:"order not found"},
                {status:400}
            )
        }
        order.status = status

        let deliveryBoysPayload: any = []
        if(status === 'out of delivery' && !order.assignment){
            const {latitude, lontitude} = order.address
            const nearByDeliveryBoys = await User.find({
                role:"deliverBoy",
                // mongoDb location index
                location:{
                    $near:{
                        $geometry:{
                            type:"Point",
                            coordinates:[Number(lontitude),Number(latitude)],
                            // 10000 --> 10km
                            $maxDistance:10000
                        }
                    }
                }
            })

            // onlt id store in nearByIds
            const nearByIds = nearByDeliveryBoys.map((b)=>b._id)
            
            // filter busy id in model
            const busyid = await DeliveryAssigment.find({
                // in --> present in array
                assignedTo:{$in: nearByIds },
                // nin --> not equal
                status:{$nin:["brodcasted" ,"completed"]}
            }).distinct("assignedTo")
            // distinct --> only return assignedTo filed

            const busyIdSet = new Set(busyid.map(b=>String(b)))
            const availableDeliveryBoys = nearByDeliveryBoys.filter(
                b => !busyIdSet.has(String(b._id))
            )

            const candidates = availableDeliveryBoys.map(b=>b._id)
            if(candidates.length == 0){
                await order.save()

                await emitEventHandler("order-status-update",{orderId:order._id, status:order.status})
                return NextResponse.json(
                    {message:"there is no available Delivery boys"},
                    {status:200}
                )
            }


            const deliveryAssigment = await DeliveryAssigment.create({
                order:order._id,
                brodcastedTo:candidates,
                status:"brodcasted"
            })

            await deliveryAssigment.populate('order')

            for(const boyId of candidates){
                const boy = await User.findById(boyId)
                if(boy.socketId){
                    await emitEventHandler("new-assignment", deliveryAssigment, boy.socketId
                    )
                }
            }

            order.assignment = deliveryAssigment._id

            deliveryBoysPayload = availableDeliveryBoys.map(b=>({
                id:b._id,
                name:b.name,
                mobile:b.mobile,
                latitude:b.location.coordinates[1],
                longitude:b.location.coordinates[0],

            }))
            await deliveryAssigment.populate("order")
        }

        await order.save()
        await order.populate("user")

        await emitEventHandler("order-status-update",{orderId:order._id, status:order.status})


        return NextResponse.json({
            assignment:order.assignment?._id,
            availableBoys:deliveryBoysPayload
        },{status:200})


    } catch (error:any) {
        // console.log("MESSAGE:", error?.message);
        // console.log("NAME:", error?.name);
        // console.log("STACK:", error?.stack);
        return NextResponse.json(
            {message:`update status error ${error}`},
            {status:500}
        )
        
    }

}