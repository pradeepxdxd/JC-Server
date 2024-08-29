import mongoose from "mongoose";
import { PROFILE_IMAGE } from "../constants/avatar.js";
import { createToken } from "../helpers/token.js";
import { hashingPassword, getUserByUserName, decodedPassword } from "../helpers/user.js";
import userModel from "../models/user.model.js"
import { getUserInfoByFriendSide, getUserInfoByUserSide } from "../schemas/userQueries/user.js";

export const resgister = async (req, res) => {
    try {
        const { username, firstname, lastname, password, profileImage } = req.body;

        const isUserExist = await getUserByUserName(userModel, username);
        if (!!isUserExist) {
            res.send({ statusCode: 401, error: 'User Already Exist!' })
        }
        else {
            const saltRounds = 11;
            const hashPassword = await hashingPassword(password, saltRounds)
            if (!!hashPassword) {
                let newUser = await userModel.create({ username, firstname, lastname, password: hashPassword, profileImage })
                res.send({ statusCode: 201, message: 'User created successfully', data: newUser })
            }
            else {
                res.send({ statusCode: 400, message: 'Something went wrong, Please try again' })
            }
        }
    }
    catch (error) {
        console.log(error)
        res.send({ statusCode: 500, message: 'Internal Server Error' })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const isUserExist = await getUserByUserName(userModel, username);
        if (!!isUserExist === false) {
            return res.status(401).send({ statusCode: 401, message: 'Username and Passowrd are incorrect' })
        }
        const verifyUser = await decodedPassword(password, isUserExist.password)
        if (!!verifyUser) {
            const token = createToken({ userId: isUserExist._id, name: isUserExist.firstname });
            res.status(200).send({ statusCode: 200, message: 'LoggedIn Successfully', token })
        }
        else {
            return res.status(401).send({ statusCode: 401, message: 'Username and Passowrd are incorrect' })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ statusCode: 500, message: 'Internal Server Error' })
    }
}

export const searchUser = async (req, res) => {
    try {
        const { name, userId } = req.query;

        const mainUser = await userModel.findById(userId);

        const users = await userModel.aggregate([
            {
                $match: {
                    username: { $regex: name, $options: "i" }
                }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    firstname: 1,
                    lastname: 1,
                    visiblity: 1,
                    profileImage: 1
                }
            }
        ]);

        const userSide = await getUserInfoByUserSide(userId);
        const friendSide = await getUserInfoByFriendSide(userId);

        await users.forEach((user, index) => {
            let userExist = undefined;
            let friendExist = undefined;

            for (let i = 0; i < userSide.length; i++) {
                if (userSide[i]?._id.toString() === user?._id.toString()) {
                    userExist = userSide[i];
                    break;
                }
            }
            for (let i = 0; i < friendSide.length; i++) {
                if (friendSide[i]?._id.toString() === user?._id.toString()) {
                    friendExist = friendSide[i];
                    break;
                }
            }

            if (!!userExist) {
                users[index] = { ...user, profileImage: userExist?.profileImage }
            }
            else if (!!friendExist) {
                users[index] = { ...user, profileImage: friendExist?.profileImage }
            }
            else {
                if (user?.visiblity === 'PRIVATE' || user?.visiblity === 'PROTECTED') {
                    users[index] = { ...user, profileImage: PROFILE_IMAGE }
                }
            }

            if (userId.toString() === users[index]?._id.toString()) {
                users[index] = { ...users[index], profileImage: mainUser?.profileImage }
            }
        })

        if (users && users.length > 0) {
            res.status(200).send({ statusCode: 200, message: 'User search list fetch successfully', users });
        }
        else {
            res.status(404).send({ statusCode: 404, message: 'Users not found' });
        }
    }
    catch (err) {
        console.log(err)
        res.send({ statusCode: 500, message: 'Internal Server Error' })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (user) {
            res.status(200).send({ user, message: 'User get successfully' });
        }
        else res.status(404).send({ message: 'User not found' });
    }
    catch (err) {
        console.log(err)
        res.send({ statusCode: 500, message: 'Internal Server Error' })
    }
}

export const getUsers = async (req, res) => {
    try {
        // Get page and limit from query parameters, with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Find users with pagination
        const users = await userModel.find({})
            .skip(skip)
            .limit(limit);

        // Get total number of documents
        const totalUsers = await userModel.countDocuments({});

        if (users.length > 0) {
            res.status(200).send({
                users,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                message: 'Users retrieved successfully',
            });
        } else {
            res.status(404).send({ message: 'Users not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findByIdAndDelete(id);

        if (user) {
            res.status(204).send({ message: 'User deleted successfully' });
        }
        else res.status(404).send({ message: 'User not found' });
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' });
    }
}

// export const searchUser = async (req, res) => {
//     try {
//         const { name, userId } = req.query;

//         const users = await userModel.aggregate([
//             {
//                 $match: {
//                     username: { $regex: name, $options: "i" }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'friends', // Collection name of friendModel
//                     let: { userId: "$_id" },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $or: [
//                                         { $and: [{ $eq: ["$userId", new mongoose.Types.ObjectId(userId)] }, { $eq: ["$friendId", "$$userId"] }] },
//                                         { $and: [{ $eq: ["$friendId", new mongoose.Types.ObjectId(userId)] }, { $eq: ["$userId", "$$userId"] }] }
//                                     ]
//                                 }
//                             }
//                         },
//                         {
//                             $match: {
//                                 block: false
//                             }
//                         },
//                         {
//                             $limit: 1
//                         }
//                     ],
//                     as: 'friendship'
//                 }
//             },
//             {
//                 $addFields: {
//                     accept: {
//                         $ifNull: [{ $arrayElemAt: ["$friendship.accept", 0] }, null]
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     username: 1,
//                     firstname: 1,
//                     lastname: 1,
//                     profileImage: {
//                         $cond: [
//                             // If friendship exists
//                             { $gt: [{ $size: "$friendship" }, 0] },
//                             {
//                                 $cond: [
//                                     {
//                                         $or: [
//                                             // If accept is true and visibility is PRIVATE, show PROFILE_IMAGE
//                                             {
//                                                 $and: [
//                                                     { $eq: ["$accept", true] },
//                                                     { $eq: ["$visiblity", "PRIVATE"] }
//                                                 ]
//                                             },
//                                             // If accept is false and visibility is not PUBLIC, show PROFILE_IMAGE
//                                             {
//                                                 $and: [
//                                                     { $eq: ["$accept", false] },
//                                                     { $ne: ["$visiblity", "PUBLIC"] }
//                                                 ]
//                                             },
//                                             // If visibility is PROTECTED and accept is false, show PROFILE_IMAGE
//                                             {
//                                                 $and: [
//                                                     { $eq: ["$visiblity", "PORTECTED"] },
//                                                     { $eq: ["$accept", false] }
//                                                 ]
//                                             }
//                                         ]
//                                     },
//                                     PROFILE_IMAGE,
//                                     // Otherwise, show the database profile image
//                                     "$profileImage"
//                                 ]
//                             },
//                             // If no friendship exists
//                             {
//                                 $cond: [
//                                     {
//                                         $or: [
//                                             { $eq: ["$visiblity", "PRIVATE"] },
//                                             { $eq: ["$visiblity", "PORTECTED"] }
//                                         ]
//                                     },
//                                     PROFILE_IMAGE,
//                                     "$profileImage"
//                                 ]
//                             }
//                         ]
//                     },
//                     visiblity: 1
//                 }
//             }
//         ]);

//         if (users && users.length > 0) {
//             res.status(200).send({ statusCode: 200, message: 'User fetched successfully', users });
//         } else {
//             res.status(404).send({ statusCode: 404, message: 'Users not found' });
//         }
//     } catch (err) {
//         console.log(err);
//         res.send({ statusCode: 500, message: 'Internal Server Error' });
//     }
// }
