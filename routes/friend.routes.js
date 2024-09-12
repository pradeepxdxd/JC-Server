import express from 'express';
import {
    sendFriendRequest,
    acceptFriendRequest,
    blockUser,
    unblockUser,
    getFriendInfo,
    getUserFriends
}
    from '../controllers/friend.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/info', auth, getFriendInfo);
router.post('/send', auth, sendFriendRequest);
router.patch('/accept', auth, acceptFriendRequest);
router.patch('/block', auth, blockUser);
router.patch('/unblock', auth, unblockUser);
router.get('/:id', auth, getUserFriends);

export default router;