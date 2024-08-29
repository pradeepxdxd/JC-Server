import {
    sendMessageService,
    getMessagesService,
    updateReadStatusService
} from '../services/chats/chat.service.js'

export const sendMessage = async (req, res) => await sendMessageService(req, res);

export const getMessages = async (req, res) => await getMessagesService(req, res);

export const updateReadStatus = async (req, res) => await updateReadStatusService(req, res)