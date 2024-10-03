const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { adminAccess, userAccess } = require('../controllers/userController');
const route = express.Router();

// Protected routes
route.get('/admin', protect, authorize('admin'), adminAccess);
route.get('/user', protect, authorize('user'), userAccess);

module.exports = route;
