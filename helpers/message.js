import messageModel from "../models/message.model.js";
import { chatExitInChatModel } from "./chat.js";

export const getMessageByChatId = async chatId => await messageModel.find({ chatId });

export const getFriendMessage = async ({senderId, receiverId}) => {
    const [chat] = await chatExitInChatModel(senderId, receiverId);
    if (chat === undefined) return [];
    return getMessageByChatId(chat._id)
}