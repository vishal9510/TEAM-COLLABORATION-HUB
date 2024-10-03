const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// console.log('Mongo URI:', process.env.MONGO_URI);


// Connect to Database
connectDB();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const router = require('./routes/auth');
const adminAccess = require('./routes/userRoutes');
const userAccess = require('./routes/userRoutes');
const taskAccess = require('./routes/taskRoutes');




// Use Routes
app.use('/api/auth', router);

app.use('/api/admin', adminAccess);
app.use('/api/user', userAccess);
app.use('/api/task', taskAccess);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

