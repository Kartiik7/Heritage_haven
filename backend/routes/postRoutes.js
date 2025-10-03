
const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, likePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createPost).get(getAllPosts);
router.route('/:id/like').put(protect, likePost);

module.exports = router;
