import { createToken } from "../helpers/token.js";
import { hashingPassword, getUserByUserName, decodedPassword } from "../helpers/user.js";
import userModel from "../models/user.model.js"

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
            const token = createToken({ userId: isUserExist._id });
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
        const { name } = req.query;

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
                    profileImage: 1
                }
            }
        ]);

        if (users && users.length > 0) {
            res.status(200).send({ statusCode: 200, message: 'User fetched successfully', users });
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
