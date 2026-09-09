'use client'

import { getSocket } from "@/lib/socket"
import { IUser } from "@/models/user.model"
import axios from "axios"
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User, UserCheck } from "lucide-react"
import { motion } from 'motion/react'
import Image from "next/image"
import { useEffect, useState } from "react"

interface IOrder{
    _id?:string,
    user:string,
    items:[
        {
        grocery :string,
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
    assignment?:string,
    assignedDeliveryBoy?:IUser,
    status: "pending" | "out of delivery" | "delivered",
    createdAt?:Date,
    updatedAt?:Date
}


function AdminOrderCard({orders}:{orders:IOrder}) {

    const statusoption = ["pending", "out of delivery"]
    const [expanded, setExapanded] = useState(false)
    const [status, setStatus] = useState<string>('pending')

    useEffect(()=>{
       setStatus(orders.status) 

    },[orders])

    const updateStatus = async (orderId:string, status:string) => {
        try {
            const result = await axios.post(`/api/admin/update-order-status/${orderId}`, {status})
            console.log(result.data)
            setStatus(status)
        } catch (error) {
            console.log(error)
            
        }


    }


    useEffect(():any=>{
        const socket = getSocket()
        socket.on("order-status-update", (data)=>{
            // only match id status update
            // not every id status update
            if(data.orderId.toString() == orders?._id!.toString()){
                setStatus(data.status)
            }
        })
    
        return ()=> socket.off("order-status-update")
    
    },[])
    

    return (
    <motion.div
    initial={{opacity:0, y:20}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.4}}
    className="bg-white shadow-md hover:shadow-lg border
    border-gray-100 rounded-2xl p-6 transition-all"
    >

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

            {/* left div */}
            <div className="space-y-1">
                <p className="text-lg font-bold flex items-center gap-2 text-green-700">
                    <Package />
                    Order #{orders?._id?.toString().slice(-6)}
                </p>

                {/* only show when status filed not delivered */}
                {status != "delivered" && <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                    orders.isPaid
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-red-100 text-red-700 border"
                    }`}>
                    {orders.isPaid ? "Paid" : "Unpaid"}
                </span>
                }
                
                <p className="text-gray-500 text-sm">
                    {/* {new Date(orders.createdAt!).toUTCString()} */}
                    {new Date(orders.createdAt!).toLocaleString()}
                </p>

                <div className="mt-3 space-y-1 text-gray-700 text-sm">
                    <p className="flex items-center gap-2 font-semibold">
                        <User size={16} className="text-green-600"/>
                        <span>{orders?.address.fullName}</span>
                    </p>
                     <p className="flex items-center gap-2 font-semibold">
                        <Phone size={16} className="text-green-600"/>
                        <span>{orders?.address.mobile}</span>
                    </p>
                    <p className="flex items-center gap-2 font-semibold">
                        <MapPin size={16} className="text-green-600"/>
                        <span>{orders?.address.fullAddress}</span>
                    </p>
                </div>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                    <CreditCard size={16} className="text-green-600"/>
                    <span>{orders?.paymentMethod == "cod" ? "Cash On Delivery":"Online Payments"}</span>
                </p>


                {orders.assignedDeliveryBoy && <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">

                   {/*  left div  */}
                   <div className="flex items-center gap-3 text-sm text-gray-700">
                        <UserCheck className="text-blue-600" size={18}/>
                        <div className="font-semibold text-gray-800">
                            <p>Assigned to : <span>{orders?.assignedDeliveryBoy?.name}</span></p>
                            <p className="text-xs text-gray-600">📞 +91 {orders.assignedDeliveryBoy.mobile}</p>
                        </div>
                   </div>

                   {/* rigth div */}
                    <a href={`tel:${orders.assignedDeliveryBoy.mobile}`}
                    className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                    >Call
                    </a>                    
                </div>}

            </div>




            {/* rigth div */}
            <div className="flex flex-col items-start md:items-end gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                    status === 'delivered' 
                    ? "bg-green-100 text-green-700" 
                    : status === 'pending' 
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"   
                    }`}>
                    {status}
                </span>

                {status != 'delivered' && <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm
                hover:border-green-400 transition-all focus:ring-green-500 outline-none"
                value={status}
                onChange={(e)=>updateStatus(orders._id?.toString()!, e.target.value)}
                >
                    {statusoption.map((st,index)=>(
                        <option 
                        key={index}
                        value={st}
                        >{st.toUpperCase()}</option>
                    ))}

                </select> }
                
                
            </div>


        </div>


        <div className="border-t border-gray-200 pt-3 mt-3">
                <button
                onClick={()=>setExapanded((prev) => !prev)}
                className="w-full flex justify-between items-center text-sm font-medium
                text-gray-700 hover:text-green-700 transition-all"
                >
                    <span className="flex items-center gap-2">
                        <Package size={16} className="text-green-600"/>
                        {expanded ? "Hide Order Items" : `view ${orders.items.length} Items`}
                         
                    </span>

                    {expanded ? <ChevronUp size={16} className="text-green-600"/> : <ChevronDown size={16} className="text-green-600"/>}
                </button>


                <motion.div
                initial={{height:0, opacity:0}}
                animate={{
                    height: expanded ? "auto" : 0,
                    opacity: expanded ? 1 : 0
                }}
                transition={{duration:0.3}}
                >
                    <div className="mt-3 space-y-3">
                        {orders.items.map((item,index) => (
                            <div key={index}
                            className="flex justify-between items-center bg-gray-50 rounded-xl px-3
                            py-2 hover:bg-gray-100 transition"
                            >
                                {/* left div */}
                                <div className="flex items-center gap-3">
                                    <Image src={item?.image} alt={item.name} width={48} height={48}
                                    className="rounded-lg object-cover border border-gray-200"/>

                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} x {item.unit}</p>
                                    </div>

                                </div>

                                {/* rigth paragraph */}
                                <p>
                                    ₹{Number(item.price)*item.quantity}
                                </p>

                            </div>
                        ))}

                    </div>



                </motion.div>

        </div>

        <div className="border-t pt-3 mt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Truck size={16} className="text-green-600"/>
                <span>Delivery <span className="text-green-700 font-semibold">{status}</span></span>
            </div>
        
            <div>
                Total: <span className="text-green-700 font-bold">{orders.totalAmount}</span>
            </div>
        
        </div>

    </motion.div>
  )
}

export default AdminOrderCard