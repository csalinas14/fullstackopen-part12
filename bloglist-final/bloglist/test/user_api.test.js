const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
mongoose.set('bufferTimeoutMS', 30000)

describe('when there is initialally one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'user_test', name: 'SuperUser', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Admin',
      password: 'banana'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    //console.log(usersAtEnd)
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'user_test',
      name: 'SuperUser',
      password: 'apple'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')
    //console.log(result.body.error)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message is username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'no',
      name: 'SuperUser',
      password: 'apple'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    //console.log(result.body.error)
    expect(result.body.error).toContain('Path `username` (`no`) is shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)

  })

  test('creation fails with proper statuscode and message is invalid password length', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'SuperUser',
      password: 'no'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid password length')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message when no user is defined', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'SuperUser',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    //console.log(result.body.error)
    expect(result.body.error).toContain('Path `username` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message when no password is defined', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'SuperUser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('no password defined')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
