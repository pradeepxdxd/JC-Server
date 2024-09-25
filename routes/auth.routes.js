import express from 'express';
import { resgister, login, searchUser, getUserById, getUsers, deleteUser, updateUser, googleLogin } from '../controllers/user.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/search', auth, searchUser);
router.get('/:id', auth, getUserById);
router.get('/', auth, getUsers);
router.post('/register', resgister);
router.post('/login', login);
router.delete('/delete/:id', auth, deleteUser);
router.put('/:id', auth, updateUser);
router.get('/o-auth/google', googleLogin)

export default router;