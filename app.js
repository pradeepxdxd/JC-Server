import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'

import route from './routes/index.js';
import dbConnection from './config/db.config.js';
import { runSocketIO } from './socket.io/socket.io.js'

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.APP_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    }
})

const PORT = process.env.PORT
dbConnection()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/v1', route);

// socket.io
const users = {};
runSocketIO(io, users)

server.listen(PORT, (_, err) => {
    if (err) console.log('Something went wrong')
    else console.log('Server connected successfully', PORT)
})