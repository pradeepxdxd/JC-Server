import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'

import route from './routes/index.js';
import dbConnection from './config/db.config.js';

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
io.on('connection', (socket) => {
    socket.on('register', userId => {
        users[userId] = socket.id
    })

    // Handle sending a message to a specific user
    socket.on('private message', ({ to, message }) => {
        const recipientSocketId = users[message.from];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('private message', message);
        }
    });
    
    socket.on('disconnect', () => {
        // Remove the user from the list on disconnect
        for (const [userId, socketId] of Object.entries(users)) {
            if (socketId === socket.id) {
                delete users[userId];
                break;
            }
        }
    });
})

server.listen(PORT, (_, err) => {
    if (err) console.log('Something went wrong')
    else console.log('Server connected successfully', PORT)
})