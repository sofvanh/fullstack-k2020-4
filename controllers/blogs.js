const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog(request.body)
    blog.user = user._id
    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (blog && (!request.token || !decodedToken.id || decodedToken.id.toString() !== blog.user.toString())) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (blog) await blog.remove()
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = {
        likes: request.body.likes
    }
    const newBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(newBlog)
})

module.exports = blogsRouter