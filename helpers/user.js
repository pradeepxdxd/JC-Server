import bcrypt from 'bcrypt'

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
    console.log({ clientPassword, userPassword })
    return await bcrypt.compare(clientPassword, userPassword);
}