import {Router} from 'express'
import { sendMessage, getMessages, updateReadStatus } from '../controllers/chat.controller.js';

const router = Router();

router.post('/send', sendMessage);
router.get('/messages', getMessages);
router.patch('/update/read-status/:id', updateReadStatus);

export default router;