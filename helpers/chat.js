import mongoose from "mongoose";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";

export const createChat = async props => await chatModel.create(props);

export const chatExitInChatModel = async (senderId, receiverId) => {
    return await chatModel.aggregate([
        {
            $match: {
                $or: [
                    {
                        senderId: new mongoose.Types.ObjectId(senderId),
                        receiverId: new mongoose.Types.ObjectId(receiverId)
                    },
                    {
                        senderId: new mongoose.Types.ObjectId(receiverId),
                        receiverId: new mongoose.Types.ObjectId(senderId)
                    },
                ]
            }
        }
    ])
}

export const updateCreateChat = async ({
    senderId,
    receiverId,
    lastMessage,
    lastTime,
    chatExist: chatIds
}) => await chatModel.findByIdAndUpdate(chatIds[0]._id, {
    senderId,
    receiverId,
    lastMessage,
    lastTime,
    senderStatus: 'DELIVERED',
    receiverStatus: 'INCOMING'
}, { new: true })