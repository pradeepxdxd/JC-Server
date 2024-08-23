import jwt from "jsonwebtoken";

export const createToken = payload => jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '78h' })