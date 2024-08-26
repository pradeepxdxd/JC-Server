import mongoose from "mongoose";
import friendModel from "../../models/friend.model.js";
import { PROFILE_IMAGE } from "../../constants/avatar.js";

export const getUserInfoByUserSide = async (userId) => {
    return await friendModel.aggregate([
        {
            $match: {
                friendId: new mongoose.Types.ObjectId(userId),
                block: false,
                accept: true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $unwind: '$userInfo'
        },
        {
            $project: {
                _id: 0,
                friendId: '$_id', // Rename _id to friendId
                userId: '$friendId', // Rename friendId to userId
                'userInfo.firstname': 1,
                'userInfo.lastname': 1,
                'userInfo.username': 1,
                'userInfo.profileImage': {
                    $cond: {
                        if: { $eq: ['$userInfo.visiblity', 'PRIVATE'] },
                        then: PROFILE_IMAGE,
                        else: '$userInfo.profileImage'
                    }
                }
            }
        }
    ]);
}

export const getUserInfoByFriendSide = async (userId) => {
    return await friendModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                block: false,
                accept: true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'friendId',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $unwind: '$userInfo'
        },
        {
            $project: {
                _id: 0,
                friendId: '$_id', // Rename _id to friendId
                userId: '$friendId', // Rename friendId to userId
                'userInfo.firstname': 1,
                'userInfo.lastname': 1,
                'userInfo.username': 1,
                'userInfo.profileImage': {
                    $cond: {
                        if: { $eq: ['$userInfo.visiblity', 'PRIVATE'] },
                        then: PROFILE_IMAGE,
                        else: '$userInfo.profileImage'
                    }
                }
            }
        }
    ]);
}