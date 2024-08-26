import { getUserInfo, getUserInfoOfNoConnection, getAllUnBlockedFriends } from "../helpers/user.js";
import friendModel from "../models/friend.model.js";

export const sendFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.status(404).send({ message: 'User not found' });
        }

        const requestSent = await friendModel.create({ userId: friendId, friendId: userId });

        if (requestSent) {
            res.status(201).send({ message: 'Request sent' })
        }
        else res.status(404).send({ message: 'User not found' })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.status(404).send({ message: 'User not found' });
        }
        const acceptRequest = await friendModel.findOneAndUpdate({ userId, friendId }, { accept: true, viewed: true }, { new: true });

        if (acceptRequest) {
            res.status(203).send({ message: 'Request accepted' })
        }
        else res.status(404).send({ message: 'User not found' })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const blockUser = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.status(404).send({ message: 'User not found' });
        }

        const Userblocked = await friendModel.findOneAndUpdate({ userId, friendId }, { block: true, accept: false })

        if (Userblocked) {
            res.status(200).send({ message: 'User blocked' })
        }
        else res.status(404).send({ message: 'User not found' })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const unblockUser = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.status(404).send({ message: 'User not found' });
        }

        const Userblocked = await friendModel.findOneAndUpdate({ userId, friendId }, { block: false, accept: false });

        if (Userblocked) {
            res.status(200).send({ message: 'User unblocked' })
        }
        else return res.status(404).send({ message: 'User not found' });
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const getFriendInfo = async (req, res) => {
    try {
        const { userId, friendId } = req.query;

        if (!userId || !friendId) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Find the friend status from the friendModel
        const findStatusFromFriendSide = await friendModel.findOne({ userId, friendId });

        if (!!findStatusFromFriendSide) {
            return await getUserInfo(res, findStatusFromFriendSide, friendId, 'FRIEND SIDE');
        }

        const findStatusFromUserSide = await friendModel.findOne({ userId: friendId, friendId: userId });  // myside

        if (!!findStatusFromUserSide) {
            return await getUserInfo(res, findStatusFromUserSide, friendId, 'USER SIDE')
        }

        else {
            const user = await getUserInfoOfNoConnection(res, friendId)
            res.status(200).send({ message: 'No connection established', flag: 'NO CONNECTION', data: user });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const userId = req?.params?.id;
        
        if (!!userId) {
            const getUsers = await getAllUnBlockedFriends(userId);
    
            if (getUsers && getUsers.length > 0) {
                res.status(200).send({ message: 'Friend List fetched successfully', data: getUsers })
            }
            else {
                res.status(404).send({ message: 'You dont have connection yet!' })
            }
        }
        else {
            res.status(404).send({ message: 'User not found' })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}