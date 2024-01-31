const Comment = require('../model/comment');
const User = require('../model/user');

const postComment = async (req, res) => {
    const { content, authorName, personalityTags } = req.body;

    try {
        // Find the author by name or create if not exists
        const author = await User.findOneAndUpdate(
            { name: authorName },
            { $setOnInsert: { name: authorName } },
            { upsert: true, new: true }
        );

        const newComment = new Comment({
            content,
            author: author._id,
            personalityTags
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Error posting comment', error });
    }
};

const getComments = async (req, res) => {
    const { sortBy, filterBy } = req.query;
    try {
        let query = Comment.find({});

        if (filterBy) {
            query = query.where('personalityTags').in([filterBy]);
        }

        if (sortBy === 'recent') {
            query = query.sort('-createdAt');
        } else if (sortBy === 'best') {
            query = query.sort('-likes');
        }

        const comments = await query.exec();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error getting comments', error });
    }
};

const likeComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        comment.likes += 1;
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error liking comment', error });
    }
};

const unlikeComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        comment.likes = Math.max(comment.likes - 1, 0); // Prevent negative likes
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error unliking comment', error });
    }
};

module.exports = {
    postComment,
    getComments,
    likeComment,
    unlikeComment
};
