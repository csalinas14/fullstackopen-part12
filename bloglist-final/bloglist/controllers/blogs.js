require('express-async-errors')
const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')
//const jwt = require('jsonwebtoken')

/**
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('bearer ')){
    return authorization.replace('bearer ', '')
  }
  return null
}
*/

blogsRouter.get('/', async (request, response) => {
  /**
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      */
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  //console.log(blogs)
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  //console.log(request.get('authorization'))
  /**
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      response.status(401).json({error: 'token invalid'})
    }
    //console.log(body)
    */
  if (!body.title || !body.url) {
    response.status(400).end()
  } else {
    //const user = await User.findById(body.userId)
    //const user = await User.findById(decodedToken.id)
    //const user = users[0]
    const user = await User.findById(request.user)
    //console.log(user)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id,
    })
    /**
      blog
        .save()
        .then(result => {
          response.status(201).json(result)
        })
        */
    const savedBlog = await blog.save()
    const popBlog = await savedBlog.populate('user')
    console.log(popBlog)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  /**
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      response.status(401).json({error: 'token invalid'})
    }
    console.log(decodedToken)
    */
  console.log(request.params.id)
  const blog = await Blog.findById(request.params.id)
  console.log(blog)
  //const user = await User.findById(decodedToken.id)
  const user = await User.findById(request.user)

  if (blog && blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'invalid user' })
  }

  if (blog) {
    user.blogs = user.blogs.filter((b) => b.toString() !== blog.id.toString())

    await user.save()
  }
  //await blog.remove()

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  await updatedBlog.populate('user')
  console.log(updatedBlog)
  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  console.log(request)
  const body = request.body
  if (!body.comment) {
    response.status(400).end()
  }

  const blog = await Blog.findById(request.params.id)
  //console.log(body)
  blog.comments = blog.comments.concat(body.comment)
  await blog.save()
  response.status(201).end()
})

module.exports = blogsRouter
