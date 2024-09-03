const users = {};
const activeUsers = {};
const typingUsers = new Map();
const userCurrentMessages = new Map();

export const runSocketIO = io => {
    io.on('connection', (socket) => {
        socket.on('active', uid => {
            console.log(`User comes online ${uid}`)
            activeUsers[uid] = socket.id
        })

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

        socket.on('join-video-call', ({ user1, user2, call_url, profileImage, name }) => {
            socket.broadcast.emit('incoming-call', { user1, user2, call_url, profileImage, name });
        })

        socket.on('typing', ({ userId, friendId, isTyping }) => {
            const friendSocketId = activeUsers[friendId];
            typingUsers.set(userId, isTyping);
            const typingUsersData = Object.fromEntries(typingUsers)
            socket.to(friendSocketId).emit('friend-typing', typingUsersData);
        })

        socket.on('send-current-message', ({userId, friendId, message, time}) => {
            const friendSocketId = activeUsers[friendId];
            userCurrentMessages.set(userId, {message, time});
            const userMessages = Object.fromEntries(userCurrentMessages);
            socket.to(friendSocketId).emit('show-current-message', userMessages);
        })

        socket.on('disconnect', () => {
            // Remove the user from the list on disconnect
            for (const [userId, socketId] of Object.entries(users)) {
                if (socketId === socket.id) {
                    delete users[userId];
                    break;
                }
            }
            for (const [uid, socketId] of Object.entries(users)) {
                if (socketId === socket.id) {
                    delete activeUsers[uid];
                    break;
                }
            }
        });
    })
}

function getRoomId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
}