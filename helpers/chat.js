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

export const updateChat = async props => await chatModel.findOneAndUpdate({ ...props.ids }, { ...props.data }, { new: true });

export const updateCreateChat = async (props) => {
    const { senderId, receiverId, lastMessage, lastTime } = props;

    const [chatIds] = await chatExitInChatModel(senderId, receiverId);

    if (!chatIds) {
        throw new Error('Chat not found'); // Optional: Handle case where chat does not exist
    }

    const searchingIDS = senderId.toString() === chatIds.senderId.toString()
        ? { senderId, receiverId } : { senderId: receiverId, receiverId: senderId }

    return await updateChat({
        searchingIDS,
        data: {
            senderId,
            receiverId,
            lastMessage,
            lastTime,
            senderStatus: 'DELIVERED',
            receiverStatus: 'INCOMING'
        }
    });
};