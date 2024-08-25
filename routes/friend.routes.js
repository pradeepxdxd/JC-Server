import express from 'express';
import {
    sendFriendRequest,
    acceptFriendRequest,
    blockUser,
    unblockUser
}
    from '../controllers/friend.controller.js';

const router = express.Router();

router.post('/send', sendFriendRequest);
router.patch('/accept', acceptFriendRequest);
router.patch('/block', blockUser);
router.patch('/unblock', unblockUser);

export default router;