const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');


// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a room (e.g., a team or project)
    socket.on('joinRoom', ({ room }) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    // Listen for chat messages
    socket.on('chatMessage', (msg) => {
        io.to(msg.room).emit('message', msg);
    });

    // User disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Import Routes
const router = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');




// Use Routes
app.use('/api/auth', router);
app.use('/api/tasks', taskRoutes);





// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

