import express from 'express'
import authRoute from './auth.routes.js'
import friendRoute from './friend.routes.js'

const route = express()

route.use('/auth', authRoute);
route.use('/friend', friendRoute);

export default route;