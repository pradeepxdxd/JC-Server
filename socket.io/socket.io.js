export const runSocketIO = (io, users) => {
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
}