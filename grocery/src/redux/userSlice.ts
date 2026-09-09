import { createSlice } from "@reduxjs/toolkit";


interface IUser{
    _id?:string,
    name: string,
    email: string,
    password?: string,
    mobile?: string,
    role: 'user' | 'deliverBoy' | 'admin',
    image?: string
}

interface IuserSlice{
    userData:IUser | null
}

const initialState:IuserSlice={
    userData:null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
       setUserData:(state, action)=>{
        state.userData = action.payload
       } 
    }
})


export const { setUserData } = userSlice.actions
export default userSlice.reducer
