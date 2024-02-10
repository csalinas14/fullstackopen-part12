const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if(!password){
    return response.status(400).json({
      error: 'no password defined'
    })
  }

  if(password.length < 3){
    return response.status(400).json({
      error: 'invalid password length'
    })
  }



  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  //console.log(passwordHash)
  const user = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
  })
  //console.log(user)
  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

module.exports = usersRouter