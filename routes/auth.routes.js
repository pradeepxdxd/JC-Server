import express from 'express';
import {resgister, login} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', resgister);
router.post('/login', login);
router.get('/demo', (req, res) => res.send('<h1>Hii Pradeep</h1>'));

export default router;