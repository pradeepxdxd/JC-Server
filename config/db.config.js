import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export default function dbConnection() {
    try {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log('db connected successfully'))
            .catch(() => console.log('db connection failed'))
    } catch (error) {
        console.log(error)
    }
}