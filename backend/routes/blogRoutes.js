const express = require('express');
const { createblog, getAllblog, updateblog, getblog,deleteblog } = require('../controllers/blogController');


const router = express.Router();

router.post('/api/createblog', createblog);
router.get('/api/getAllblog', getAllblog);

// Forgot password - send reset token via email
router.get('/api/blogs/:id', getblog);

// Reset password with token
router.put('/api/blogs/:id', updateblog);
router.delete('/api/blogs/:id', deleteblog);

module.exports = router;

