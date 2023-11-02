const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: String,
    date: {
        type: Date,
        default: Date.now,
    },
    replies: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: String,
        date: {
            type: Date,
            default: Date.now,
        },
    }],
}, { _id: false });

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    contentBrief: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    comments: {
        type: [commentSchema],
        default: null
    },
});

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;