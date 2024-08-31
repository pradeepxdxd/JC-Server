export const runSocketIO = (io, users, userToVideoCallRoom) => {
    io.on('connection', (socket) => {
        socket.on('register', userId => {
            users[userId] = socket.id
        })

        socket.on('join room', ({ userId1, userId2 }) => {
            const roomId = getRoomId(userId1, userId2);
            socket.join(roomId);
        });

        socket.on('private message', ({ userId1, userId2, message }) => {
            const roomId = getRoomId(userId1, userId2);
            socket.to(roomId).emit('private message', { ...message, userId1, userId2 });
        });

        socket.on('join-video-call', ({user1, user2, call_url, profileImage, name}) => {
            const roomId = getRoomId(user1, user2);
            socket.broadcast.emit('incoming-call', {user1, user2, call_url, profileImage, name});
        })

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