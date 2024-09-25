import axios from "axios";
import userModel from "../models/user.model.js";

export const getOAuth2ClientUserToken = async token => await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);

export const isUserExists = async email => await userModel.findOne({ username: email });

export const createUser = async data => await userModel.create({
    firstname: data.given_name || data.name.split(' ')[0],
    lastname: data.family_name || data.name.split(' ')[1],
    username: data.email,
    profileImage: data.picture
})