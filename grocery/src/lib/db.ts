import mongoose from "mongoose"
const mongodbUrl = process.env.MONGODB_URL

if(!mongodbUrl){
    throw new Error('db error')
}

let cached = global.mongoose
if(!cached){
    cached = global.mongoose = { conn: null, promise: null}
}

const connectDb = async ()=> {
    // connection found then return
    if(cached.conn){
        return cached.conn
    }

    // if promise not found and conn is null
    // connected to mongodb cloud server
    if(!cached.promise){
        cached.promise = mongoose.connect(mongodbUrl).then((conn)=> conn.connection)
    }

    // waiting for promise
    // if promise resolve then return
    try {
        const conn = await cached.promise
        return conn
    } catch (error) {
        console.log(error)
    }
}

export default connectDb