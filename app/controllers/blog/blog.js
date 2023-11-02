const { statusCode } = require('../../config/config');
const { handleAsyncErrors } = require('../../helpers/handlers/error');
const { templates, replaceDefaultRoute, replaceTemplate } = require('../../services/web-template');
const { sendResponse } = require('../../helpers/handlers/response');
const Blog = require('../../models/blog');

class BlogController {

    constructor() {
        this.getBlogPosts = handleAsyncErrors(this.getBlogPosts.bind(this));
        this.postBlog = handleAsyncErrors(this.postBlog.bind(this));
    }

    async getBlogPosts(req, res, next) {
        const blogs = await Blog.find().populate('author', 'firstName lastName').populate('user', 'firstName lastName');

        sendResponse(res, statusCode.created, blogs);
    }

    async postBlog(req, res, next) {
        const blogData = req.body;

        if (blogData) {
            const blog = new Blog(blogData);
            await blog.save();
        }

        sendResponse(res, statusCode.created, '', 'Blog submited successfully');
    }

    homePage(req, res) {
        const blogPostsRoute = templates.blog.index.replace(/{%BLOG_POSTS%}/g, templates.blog.list);

        const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, 'Blog'), blogPostsRoute);

        res.status(statusCode.ok).end(updatedIndex);
    }
}

module.exports = BlogController;
