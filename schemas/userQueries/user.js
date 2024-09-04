import mongoose from "mongoose";
import friendModel from "../../models/friend.model.js";
import { PROFILE_IMAGE } from "../../constants/avatar.js";
import userModel from "../../models/user.model.js";

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
                _id: '$userInfo._id',
                firstname: '$userInfo.firstname',
                lastname: '$userInfo.lastname',
                username: '$userInfo.username',
                profileImage: {
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
                _id: '$userInfo._id',
                firstname: '$userInfo.firstname',
                lastname: '$userInfo.lastname',
                username: '$userInfo.username',
                profileImage: {
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

export const getUserWithSpecificProfileImage = async userId => {
    return await userModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                _id: 1,
                username: 1,
                firstname: 1,
                lastname: 1,
                profileImage: {
                    $cond: {
                        if: {
                            $eq: ['$visiblity', 'PRIVATE']
                        },
                        then: PROFILE_IMAGE,
                        else: '$profileImage'
                    }
                }
            }
        }
    ])
}