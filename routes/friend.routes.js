import express from 'express';
import {
    sendFriendRequest,
    acceptFriendRequest,
    blockUser,
    unblockUser,
    getFriendInfo
}
    from '../controllers/friend.controller.js';

const router = express.Router();

router.get('/info', getFriendInfo);
router.post('/send', sendFriendRequest);
router.patch('/accept', acceptFriendRequest);
router.patch('/block', blockUser);
router.patch('/unblock', unblockUser);

export default router;