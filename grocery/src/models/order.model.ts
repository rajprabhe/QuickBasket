import mongoose from "mongoose";

export interface IOrder{
    _id?:mongoose.Types.ObjectId,
    user:mongoose.Types.ObjectId,
    items:[
        {
        grocery :mongoose.Types.ObjectId,
        name: string,
        price:string,
        unit:string,
        image: string
        quantity:number 
        }
    ],
    isPaid:boolean,
    totalAmount:number,
    paymentMethod: "cod" | "online",
    address:{
        fullName:string,
        mobile:string,
        city:string,
        state:string,
        pincode:string,
        fullAddress:string,
        latitude:number,
        lontitude:number
    },
    assignment?:mongoose.Types.ObjectId,
    assignedDeliveryBoy?:mongoose.Types.ObjectId,
    status: "pending" | "out of delivery" | "delivered",
    createdAt?:Date,
    updatedAt?:Date,
    deliveryOtp:string | null,
    deliveryOtpVefication: boolean,
    deliveredAt:Date
}


const orderSchema = new mongoose.Schema<IOrder>({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    items:[
        {
            grocery:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
                ref:"Grocery"
            },
            name:String,
            price:String,
            unit:String,
            image:String,
            quantity:Number
        }
    ],
    paymentMethod:{
        type:String,
        enum:["cod", "online"],
        default:"cod"
    },
    address:{
        fullName:String,
        mobile:String,
        city:String,
        state:String,
        pincode:String,
        fullAddress:String,
        latitude:Number,
        lontitude:Number
    },
    status:{
        type:String,
        enum:["pending" , "out of delivery" , "delivered"],
        default:"pending"
    },
    totalAmount:Number,
    isPaid:{
        type:Boolean,
        default:false
    },
    assignedDeliveryBoy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryAssigment",
        default:null
    },
    deliveryOtp:{
        type:String,
        default:null
    },
    deliveryOtpVefication:{
        type:Boolean,
        default:false
    },
    deliveredAt:{
        type:Date
    }
},
{   timestamps:true

})

const Order = mongoose.models.Order || mongoose.model("Order",orderSchema)
export default Order
