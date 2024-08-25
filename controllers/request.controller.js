import mongoose from "mongoose";
import requestModel from "../models/request.model.js";

export const sendFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!userId && !friendId) {
            return res.send({ statusCode: 401, message: 'User not found' });
        }

        const requestSent = await requestModel.create({ userId : friendId, friendId : userId });
        if (requestSent) {
            return res.send({ statusCode: 201, message: 'Request sent' });
        }
        else return res.send({ statusCode: 400, message: 'Something went wrong, please try again later!' });
    }
    catch (err) {
        console.log(err)
        res.json({ statusCode: 500, message: 'Internal Server Error' })
    }
}

export const unSendFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.send({ statusCode: 401, message: 'User not found' });
        }

        const requestSent = await requestModel.deleteOne({ userId : friendId, friendId : userId });
        if (requestSent.deletedCount > 0) {
            return res.status(200).send({ statusCode: 200, message: 'Request unsent' });
        } else {
            return res.status(400).send({ statusCode: 400, message: 'Something went wrong, please try again later!' });
        }
    }
    catch (err) {
        console.log(err)
        res.json({ statusCode: 500, message: 'Internal Server Error' })
    }
}

export const rejectFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.send({ statusCode: 401, message: 'User not found' });
        }

        const requestSent = await requestModel.deleteOne({ userId, friendId });
        if (requestSent.deletedCount > 0) {
            return res.status(200).send({ statusCode: 200, message: 'Request rejected' });
        } else {
            return res.status(400).send({ statusCode: 400, message: 'Something went wrong, please try again later!' });
        }
    } catch (err) {
        console.log(err)
        res.json({ statusCode: 500, message: 'Internal Server Error' })
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.send({ statusCode: 401, message: 'User not found' });
        }

        const accepted = await requestModel.findOneAndUpdate(
            { userId, friendId },
            { accepted: true, viewed: true },
            { new: true }
        );

        if (accepted) {
            res.send({ statusCode: 203, message: 'Friend request accepted' })
        }
        else
            res.send({ statusCode: 400, message: 'Something went wrong, please try again' })
    }
    catch (err) {
        console.log(err)
        res.json({ statusCode: 500, message: 'Internal Server Error' })
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        console.log({id : req.params.id})
        const { id } = req.params;

        const requests = await requestModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id),  // Match the userId with the provided id
                    accepted: false                       // Only get requests where accepted is false
                }
            },
            {
                $lookup: {
                    from: "users",                      // The collection to join with (make sure the name is correct)
                    localField: "friendId",             // Field from the request collection
                    foreignField: "_id",                // Field from the user collection
                    as: "friendData"                    // Name of the new array field that will contain the joined data
                }
            },
            {
                $unwind: "$friendData"                 // Unwind the friendData array to get an object instead of an array
            },
            {
                $project: {                            // Select the fields you want to include in the result
                    _id: 1,
                    userId: 1,
                    friendId: 1,
                    accepted: 1,
                    viewed: 1,
                    "friendData.username": 1,          // Include specific fields from the joined user document
                    "friendData.firstname": 1,
                    "friendData.lastname": 1,
                    "friendData.profileImage": 1
                }
            }
        ]);

        if (requests.length > 0) {
            res.status(200).send({ requests });
        } else {
            res.status(404).send({ message: "No friend requests found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
