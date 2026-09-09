import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        connectDb()
        const user = await User.find({
            role:"admin"
        })

        if(user.length > 0){
            return NextResponse.json(
                {adminExist:true},
                {status:200}
            )
        }else{
            return NextResponse.json(
                {adminExist:false},
                {status:400}
            )
        }
    } catch (error) {
        return NextResponse.json(
            {adminExist:`check for admin error ${error}`},
            {status:500}
        ) 
    }
}