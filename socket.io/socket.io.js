export const runSocketIO = (io, users) => {
    io.on('connection', (socket) => {
        console.log('User connected', socket.id)
        socket.on('register', userId => {
            users[userId] = socket.id
        })

        socket.on('join room', ({ userId1, userId2 }) => {
            const roomId = getRoomId(userId1, userId2);
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on('private message', ({ userId1, userId2, message }) => {
            const roomId = getRoomId(userId1, userId2);
            console.log({userId1, userId2, roomId, msg:message?.message})
            // Broadcast the message to all users in the room except the sender
            socket.to(roomId).emit('private message', { ...message, userId1, userId2 });
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
}

function getRoomId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
}