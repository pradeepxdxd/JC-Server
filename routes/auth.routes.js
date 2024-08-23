import express from 'express';
import {resgister, login} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', resgister);
router.post('/login', login);

export default router;