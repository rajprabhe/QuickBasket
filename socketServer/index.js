import express from 'express' 
import http from "http"
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import axios from 'axios'
dotenv.config()

const app = express()
app.use(express.json())

const server = http.createServer(app)
const port = process.env.PORT

const io = new Server(server, {
    cors:{
        origin:process.env.NEXT_BASE_URL
    }
})

io.on('connection',(socket)=>{
    console.log("user connected", socket.id)

    socket.on("identity",async (userId)=>{
        // console.log(userId)
        await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`,
            {userId,
            socketId:socket.id   
            }
        )
    })

    socket.on("update-location",async ({userId,latitude,longitude})=>{
        // console.log(userId)
        // console.log(latitude)
        // console.log(longitude)

        const location = {
            type:"Point",
            coordinates:[longitude, latitude]
        }

        await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`,
            {userId, location}
        )

        io.emit("update-delivery-location",{userId, location})
    })

    socket.on("join-room",(roomId)=>{
        console.log("join room with",roomId)
        socket.join(roomId)
    })

    socket.on("send-message", async (message)=>{
        // console.log(message)
        await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`, message )
        // send to msg particular group
        io.to(message.roomId).emit("send-message", message)

    })




    socket.on("disconnect", ()=>{
        console.log("user disconnected", socket.id)
    })
})


// common api for all user
app.post("/notify", (req, res)=>{
    const {event, data, socketId} = req.body
    // if socketId have send to paraticulary user
    if(socketId){
        io.to(socketId).emit(event,data)
    }else{
    // if socketId not have send to all user
        io.emit(event,data)
    }

    return res.status(200).json(
        {"success":true}
    )
})


server.listen(port, ()=>{
    console.log("server started at",port)
})