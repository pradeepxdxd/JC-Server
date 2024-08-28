import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const messageModel = mongoose.model('message', messageSchema);
export default messageModel;