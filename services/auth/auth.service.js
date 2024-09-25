import axios from 'axios';
import { oauth2client } from '../../config/google.config.js'
import { getOAuth2ClientUserToken, isUserExists, createUser } from '../../helpers/auth.js';
import { createToken } from '../../helpers/token.js';

export const googleLoginService = async (req, res) => {
    try {
        const { code } = req.query;

        const googleResponse = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleResponse.tokens);
        const userResponse = await getOAuth2ClientUserToken(googleResponse.tokens.access_token);

        let user = await isUserExists(userResponse.data.email);
        if (!user) {
            user = await createUser(userResponse.data);
        }
        const token = createToken({ userId: user?._id, name: user.firstname }, process.env.SECRETKEY);
        return res.status(200).send({ statusCode: 200, message: "LoggedIn Successfully", token })
    }
    catch (error) {
        res.status(500).send({ status: false, message: "Internal Server Error" });
    }
}