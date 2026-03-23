import express from 'express';
import Blog from '../models/blog.js';
import {userExtractor} from '../utils/middleware.js';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
    response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
    const {title, author, url, likes} = request.body;
    if (!title || !url) return response.status(400).json({error: 'title or url is missing'});
    const {user} = request;
    const blog = new Blog({title, author, url, likes, user: user._id});
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) return response.status(404).end();
    blog.likes = request.body.likes;
    const updatedBlog = await blog.save();
    response.json(updatedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) return response.status(404).json({error: 'blog not found'});
    if (blog.user.toString() !== request.user.id.toString()) return response.status(403).json({error: 'user unauthorized'});
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

export default blogsRouter;
