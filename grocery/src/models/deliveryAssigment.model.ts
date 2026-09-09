import mongoose from "mongoose";

export interface IDeliveryAssigment{
    _id?:mongoose.Types.ObjectId,
    order:mongoose.Types.ObjectId,
    brodcastedTo:mongoose.Types.ObjectId[],
    assignedTo:mongoose.Types.ObjectId | null,
    status: "brodcasted" | "assigned" | "completed",
    acceptedAt: Date,
    createdAt?:Date,
    updateAt?:Date
}

const deliveryAssigmentSchema = new mongoose.Schema<IDeliveryAssigment>({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    brodcastedTo:[
       { 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        }
    ],
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:[ "brodcasted" , "assigned" , "completed"],
        default:"brodcasted"
    },
    acceptedAt:{
        type:Date
    }

},{timestamps:true})


const DeliveryAssigment = mongoose.models.DeliveryAssigment || mongoose.model("DeliveryAssigment",deliveryAssigmentSchema )
export default DeliveryAssigment