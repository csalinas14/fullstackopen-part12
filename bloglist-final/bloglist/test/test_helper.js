const Blog = require('../models/Blog')
const User = require('../models/user')
//const app = require('../app')
//const { application } = require('express')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})

  const blogsJSON = blogs.map(blog =>
    blog.toJSON()
  )

  const blogsNoId = blogsJSON.map(blog => {
    delete blog.id
    blog.user = blog.user.toString()
    return blog
  }
  )

  return blogsNoId
}

const blogsInDbWithId = async () => {
  const blogs = await Blog.find({})

  const blogsJSON = blogs.map(blog =>
    blog.toJSON()
  )

  return blogsJSON
}

const nonExistingId = async () => {
  const blog = new Blog(
    {
      title: 'willremovethissoon',
      author: 'me',
      url: 'willremove',
      likes: 9999
    })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})

  const usersJSON = users.map(user =>
    user.toJSON()
  )

  return usersJSON
}

module.exports = {
  initialBlogs, blogsInDb, blogsInDbWithId, nonExistingId, usersInDb
}