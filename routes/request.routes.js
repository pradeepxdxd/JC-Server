import express from 'express';
import {
    rejectFriendRequest,
    sendFriendRequest,
    unSendFriendRequest,
    acceptFriendRequest,
    getFriendRequests
}
    from '../controllers/request.controller.js';

const router = express.Router();

router.get('/:id', getFriendRequests);
router.post('/send', sendFriendRequest);
router.delete('/unsend', unSendFriendRequest);
router.patch('/accept', acceptFriendRequest);
router.delete('/reject', rejectFriendRequest);

export default router;