import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.SECRETKEY, (err, decode) => {
                if (err) {
                    return res.status(403).send({ // 401
                        statusCode: 403,
                        msg: 'Invalid or expired token'
                    });
                }
                if (!decode) {
                    return res.status(403).send({
                        statusCode: 403,
                        msg: 'User not authorized'
                    });
                }
                req.user = decode;
                next();
            });
        } else {
            return res.status(403).send({   // 401
                statusCode: 403,
                msg: 'Authorization token is required'
            });
        }
    } catch (err) {
        return res.status(403).send({
            statusCode: 403,
            msg: 'Unauthorized user!'
        });
    }
}

export default auth;
