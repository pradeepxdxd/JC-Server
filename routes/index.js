import express from 'express'
import authRoute from './auth.routes.js'

const route = express()

route.use('/auth', authRoute);

export default route;