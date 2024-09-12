import {Router} from 'express'
import { sendMessage, getMessages, updateReadStatus } from '../controllers/chat.controller.js';
import auth from '../middlewares/auth.js';

const router = Router();

router.post('/send', auth, sendMessage);
router.get('/messages', auth, getMessages);
router.patch('/update/read-status/:id', auth, updateReadStatus);

export default router;