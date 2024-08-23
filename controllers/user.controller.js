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
            return res.send({ statusCode: 401, error: 'Username and Passowrd are incorrect' })
        }
        const verifyUser = await decodedPassword(password, isUserExist.password)
        if (!!verifyUser) {
            const token = createToken({ username: isUserExist.username })
            res.send({ statusCode: 200, message: 'LoggedIn Successfully', token })
        }
        else {
            return res.send({ statusCode: 401, error: 'Username and Passowrd are incorrect' })
        }
    }
    catch (error) {
        console.log(error)
        res.send({ statusCode: 500, message: 'Internal Server Error' })
    }
}