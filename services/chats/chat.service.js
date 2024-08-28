import { chatExitInChatModel, createChat, updateCreateChat } from "../../helpers/chat.js";
import { getFriendMessage } from "../../helpers/message.js";
import { usersExist } from "../common/common.js";
import { createMessage } from "../messages/message.service.js";

export const sendMessageService = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;
        const {
            time: lastTime,
            message: lastMessage,
        } = req.body;

        if (usersExist(senderId, receiverId)) {
            return res.status(404).send({ message: 'User not found' });
        }

        const chatExist = await chatExitInChatModel(senderId, receiverId);
        if (chatExist && chatExist.length > 0) {
            const updateExistedChat = await updateCreateChat({ senderId, receiverId, lastMessage, lastTime })
            if (!!updateExistedChat?._id) {
                const sentChat = await createMessage({ chatId: updateExistedChat?._id, senderId, message: lastMessage, time: lastTime });
                if (!!sentChat?._id) {
                    res.status(201).send({ message: 'Message send successfully' });
                }
                else {
                    res.status(400).send({ message: 'Something went wrong, message not sent to the receiver' });
                }
            }
            else {
                res.status(400).send({ message: 'Something went wrong, message not delivered' });
            }
        }
        else {
            const sentMessage = await createChat({ senderId, receiverId, lastMessage, lastTime });
            if (!!sentMessage?.senderId) {
                const sentChat = await createMessage({ chatId: sentMessage?._id, senderId, message: lastMessage, time: lastTime });
                if (!!sentChat?._id) {
                    res.status(201).send({ message: 'Message send successfully' });
                }
                else {
                    res.status(400).send({ message: 'Something went wrong, message not sent to the receiver' });
                }
            }
            else {
                res.status(400).send({ message: 'Something went wrong, message not delivered' });
            }
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const getMessagesService = async (req, res) => {
    try {
        const messages = await getFriendMessage(req.query);
        if (messages && messages.length > 0) {
            res.status(200).send({ message: 'Messages fetched successfully', data: messages })
        }
        else {
            res.status(404).send({ message: 'No messages found' })
        }
    }
    catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}