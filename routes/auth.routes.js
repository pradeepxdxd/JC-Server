import express from 'express';
import {resgister, login, searchUser, getUserById, getUsers, deleteUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/search', searchUser);
router.get('/:id', getUserById);
router.get('/', getUsers);
router.post('/register', resgister);
router.post('/login', login);
router.delete('/delete/:id', deleteUser);
router.put('/:id', updateUser);

export default router;