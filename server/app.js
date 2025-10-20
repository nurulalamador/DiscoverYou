const database = require('./config/database.js');
const express = require('express');
const routes = require('./routes/route.js');
const coockieParser = require('cookie-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require("http");
const { setIO, onlineUsers } = require('./socket.js');

database.connect(function (error) {
    if (error) {
        console.error('Database connection failed:', error);
    } else {
        console.log('Database connected successfully.');
    }
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(coockieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use('/', routes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

setIO(io);

io.on("connection", (socket) => {
    //console.log("New user connected:", socket.id);
    socket.emit("register_again", { message: "Please register again." });

    socket.on("register", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log("User registered:", userId);
    });

    // socket.on("private_message", (data) => {
    //     const { receiverId, content } = data;
    //     const receiverSocketId = onlineUsers.get(receiverId);

    //     if (receiverSocketId) {
    //         io.to(receiverSocketId).emit("receive_message", {
    //             senderId,
    //             message,
    //         });
    //     }

    //     console.log(`${senderId} -> ${receiverId}: ${content}`);
    // });

    socket.on("disconnect", () => {
        for (let [userId, id] of onlineUsers.entries()) {
            if (id === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log("User disconnected:", socket.id);
    });
});

module.exports = { server, io, onlineUsers };