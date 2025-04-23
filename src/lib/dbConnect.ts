import mongoose from "mongoose";
import { buffer } from "node:stream/consumers";

const MONGODB_URI = process.env.MONGODB_URI!;  //basically here
//is a typescript error which may occur , so we use ! , not ensure that its variable is there and not null.

if(!MONGODB_URI){
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}
//we can do something like in node environemnt , do we hv mongoDB connection??
// so in node js there is global object which is used to store global variables
//usually global is empty object

let cached = global.mongoose; // so from global we want mongoose
//and since we r using typescript we need to define the type of global
//and we hv to create special types , to make sure type is exists ,whats the value in it?? dont know , but it exists
//thats why we use declare global , in types.d.ts

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}; //so we create a new object
}

export async function dbConnect(){
    if(cached.conn){  // to check if database is already connected
        //if yes then we return the connection
        return cached.conn;
    }
    if(!cached.promise){ // this checkes if the promise is already there
        const opts = {
            bufferCommands:true,
            maxPoolSize: 10,
        }
        cached.promise = mongoose.connect(`${MONGODB_URI}/reelsApp`,opts).then(()=>mongoose.connection)
    }
    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null;
        throw new Error("Check your connection string")
    }
    return cached.conn;
}