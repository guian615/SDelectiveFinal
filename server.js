const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getTownUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Facebook ';

// Run when client connects
io.on('connection', socket => {

    socket.on("nagtypeba", (data) => {
        socket.broadcast.emit("nagtypeba", data)
    })

    socket.on('joinTown', ({ username, town }) => {
        const user = userJoin(socket.id, username, town);

        socket.join(user.town);

        socket.emit('user', user.username)

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to Facebook!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.town)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        // Send users and room info
        io.to(user.town).emit('townUsers', {
            town: user.town,
            users: getTownUsers(user.town)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.town).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.town).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.town).emit('townUsers', {
                town: user.town,
                users: getTownUsers(user.town)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));