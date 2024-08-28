import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    lastTime: {
        type: String,
        required: true
    },
    lastMessage: {
        type: String,
        required: true
    },
    senderStatus: {
        type: String,
        enum: ['READ', 'SENT', 'DELIVERED', 'INCOMING'],
        default : 'DELIVERED'
    },
    receiverStatus: {
        type: String,
        enum: ['READ', 'SENT', 'DELIVERED', 'INCOMING'],
        default : 'INCOMING'
    }
}, {
    timestamps: true
})

const chatModel = mongoose.model('chat', chatSchema);
export default chatModel;