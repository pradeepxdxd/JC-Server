import express from 'express'
import authRoute from './auth.routes.js'
import friendRoute from './friend.routes.js'
import chatRoute from './chat.routes.js'

const route = express()

route.use('/auth', authRoute);
route.use('/friend', friendRoute);
route.use('/chat', chatRoute);

export default route;