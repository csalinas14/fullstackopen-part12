const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/Blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
mongoose.set('bufferTimeoutMS', 30000)

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', name: 'SuperUser', passwordHash })

  const savedUser = await user.save()

  const blogsWithTestUser = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: savedUser._id,
  }))

  //console.log(blogsWithTestUser)

  const blogObjects = blogsWithTestUser.map((blog) => new Blog(blog))

  const promiseArray = blogObjects.map((blog) => blog.save())
  const savedBlogs = await Promise.all(promiseArray)
  //console.log(savedBlogs)
  savedBlogs.map((blog) => (savedUser.blogs = savedUser.blogs.concat(blog._id)))
  //console.log(savedUser)
  await savedUser.save()

  const loggedIn = await api.post('/api/login/').send({
    username: 'root',
    password: 'secret',
  })

  //console.log(loggedIn.body.token)
  token = 'bearer ' + loggedIn.body.token
}, 10000)

describe('when we have blogs added', () => {
  test('blogs are correct length and JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)
      .expect(200)

    expect(response.body).toHaveLength(6)
  })

  test('blogs have an unique identifier property named "id"', async () => {
    const response = await api.get('/api/blogs')

    for (const blog of response.body) {
      //console.log(blog)
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    }
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const testUsers = await helper.usersInDb()
    const testUser = testUsers[0]
    //console.log(testUsers)

    console.log(token)

    const newBlog = {
      title: 'test if a valid blog works',
      author: 'me',
      url: 'testing',
      user: testUser.id,
      likes: 34,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //const response = await api.get('/api/blogs')

    const blogs = await helper.blogsInDb()
    //console.log(blogs)
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogs).toContainEqual(newBlog)
  })

  test('a blog with missing "likes" property can be added', async () => {
    const testUsers = await helper.usersInDb()
    const testUser = testUsers[0]

    const newBlog = {
      title: 'test if a blog without likes works',
      author: 'me',
      url: 'testing',
      user: testUser.id,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    /**

    const response = await api.get('/api/blogs')

    const blogs = response.body.map(blog => {
        delete blog.id
        return blog
    })
    */
    //console.log(blogs)
    const blogs = await helper.blogsInDb()
    newBlog.likes = 0

    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogs).toContainEqual(newBlog)
  })

  test('a blog with missing "title" property should not be added', async () => {
    const testUsers = await helper.usersInDb()
    const testUser = testUsers[0]

    const newBlog = {
      author: 'me',
      url: 'testing',
      likes: 2,
      user: testUser.id,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(400)

    //console.log(response.status)

    const blogs = await helper.blogsInDb()
    //console.log(blogs)
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog with missing "url" property should not be added', async () => {
    const testUsers = await helper.usersInDb()
    const testUser = testUsers[0]

    const newBlog = {
      title: 'blog with a missing url',
      author: 'me',
      likes: 2,
      user: testUser.id,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(400)

    //console.log(response.status)

    const blogs = await helper.blogsInDb()
    //console.log(blogs)
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog cannot be added when token is not provided and returns with 401 status code', async () => {
    const testUsers = await helper.usersInDb()
    const testUser = testUsers[0]

    const newBlog = {
      title: 'test if a blog without token works',
      author: 'me',
      url: 'testing',
      user: testUser.id,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', '')
      .send(newBlog)
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDbWithId()
    const blogToDelete = blogsAtStart[0]

    //console.log(blogToDelete)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    expect(blogsAtEnd).not.toContainEqual(blogToDelete)
    //console.log(blogsAtEnd)
  })

  test('succeeds with no changes in db when using a non-existing blog', async () => {
    const nonExistingId = await helper.nonExistingId()
    //console.log(nonExistingId)
    const blogsAtStart = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', token)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    expect(blogsAtEnd).toEqual(blogsAtStart)

    //console.log(blogsAtEnd)
  })
})

describe('updating a blog', () => {
  test('succeeds in updating the number of likes', async () => {
    const blogsAtStart = await helper.blogsInDbWithId()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes = 99999

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDbWithId()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    expect(blogsAtEnd).toContainEqual(blogToUpdate)

    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
    expect(updatedBlog.likes).toBe(99999)
  }, 30000)
})

describe('comments in blogs', () => {
  test.only('adding a comment', async () => {
    const blogsAtStart = await helper.blogsInDbWithId()
    const blogToUpdate = blogsAtStart[0]

    const comment = 'test'

    await api
      .post(`/api/blogs/${blogToUpdate.id}/comments`)
      .send({
        comment: comment,
      })
      .expect(201)

    const blogsAtEnd = await helper.blogsInDbWithId()
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
    expect(updatedBlog.comments[0]).toBe(comment)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
