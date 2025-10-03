const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    const { title, content, imageUrl, tags, heritageSite } = req.body;
    try {
        const post = new Post({
            title,
            content,
            imageUrl,
            tags,
            heritageSite,
            user: req.user._id,
        });

        const createdPost = await post.save();
        // Also add the post to the user's posts array
        await User.findByIdAndUpdate(req.user._id, { $push: { posts: createdPost._id } });

        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('user', 'username').populate('heritageSite', 'name');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Check if the post has already been liked by this user
        if (post.likes.includes(req.user._id)) {
            // Unlike
            post.likes.pull(req.user._id);
        } else {
            // Like
            post.likes.push(req.user._id);
        }
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
