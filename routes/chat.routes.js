import {Router} from 'express'
import { sendMessage, getMessages } from '../controllers/chat.controller.js';

const router = Router();

router.post('/send', sendMessage);
router.get('/messages', getMessages);

export default router;