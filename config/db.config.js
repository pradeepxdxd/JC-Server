import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
console.log({ port: process.env.MONGODB_URI })

export default function dbConnection() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('db connected successfully'))
        .catch(() => console.log('db connection failed'))
}