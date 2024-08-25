import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    friendId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    viewed: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })

export default mongoose.model('request', requestSchema);