import messageModel from "../models/message.model.js";

export const getMessageByChatId = async chatId => await messageModel.find({ chatId });