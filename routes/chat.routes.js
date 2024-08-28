import {Router} from 'express'
import { sendMessage, getMessages } from '../controllers/chat.controller.js';

const router = Router();

router.post('/send', sendMessage);
router.get('/:id', getMessages);

export default router;