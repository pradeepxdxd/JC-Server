import { sendMessageService, getMessagesService } from '../services/chats/chat.service.js'

export const sendMessage = async (req, res) => await sendMessageService(req, res);

export const getMessages = async (req, res) => await getMessagesService(req, res);