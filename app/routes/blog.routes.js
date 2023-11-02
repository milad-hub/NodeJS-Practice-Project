const helmet = require('helmet');
const express = require('express');
const router = express.Router();

const { helmetOptions } = require('../config/config');
const BlogController = require('../controllers/blog/blog');

const blogController = new BlogController();

router
    .get('/', blogController.homePage)
    .get('/blogs', blogController.getBlogPosts)
    .post('/blog', blogController.postBlog);

module.exports = router;