import bcrypt from 'bcrypt'
import userModel from '../models/user.model.js'
import { PROFILE_IMAGE } from '../constants/avatar.js'

export const getUserByUserName = async (userModel, username) => {
    try {
        return await userModel.findOne({ username })
    } catch (error) {
        console.log({ error })
        throw new Error(error)
    }
}

export const hashingPassword = async (password, saltRounds) => {
    return await bcrypt.hashSync(password, saltRounds, function (err, hash) {
        if (err) throw new Error(err)
        else return hash
    });
}

export const decodedPassword = async (clientPassword, userPassword) => {
    return await bcrypt.compare(clientPassword, userPassword);
}

export const getUserInfo = async (res, findStatus, friendId, flag) => {
    const user = await userModel.findById(friendId);

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Determine the profile image to return based on visibility and friend status
    let profileImage;

    if (user.visiblity === 'PUBLIC') {
        // If visibility is public, return the user's profile image
        profileImage = user.profileImage;
    }
    else if (user.visiblity === 'PRIVATE') {
        // If visibility is private, return the default image
        profileImage = PROFILE_IMAGE;
    }
    else if (user.visiblity === 'PROTECTED') {
        // If visibility is protected, check the friend status
        if (findStatus && findStatus?.accept) {
            // If the friend request is accepted, return the user's profile image
            profileImage = user.profileImage;
        } else {
            // If the friend request is not accepted, return the default image
            profileImage = PROFILE_IMAGE;
        }
    } else {
        // In case of an unknown visibility status, return a default image
        profileImage = PROFILE_IMAGE;
    }

    // Return the profile image and other user info as needed
    return res.status(200).send({
        flag,
        message: 'friend info fetch successfully',
        data: {
            friendId,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            accept: findStatus.accept,
            profileImage
        }
    });
}

export const getUserInfoOfNoConnection = async (res, friendId) => {
    const user = await userModel.findById(friendId);

    let profileImage;

    if (user.visiblity === 'PUBLIC') {
        profileImage = user.profileImage;
    }
    else if (user.visiblity === 'PRIVATE' || user.visiblity === 'PROTECTED') {
        profileImage = PROFILE_IMAGE;

    } else {
        profileImage = PROFILE_IMAGE;
    }

    return {
        friendId : user._id,
        firstname : user.firstname,
        lastname : user.lastname,
        username : user.username,
        firstname : user.firstname,
        profileImage,
    }
}