const express = require('express')
const router = express.Router()
const redis = require('../redis')

const configs = require('../util/config')

let visits = 0
console.log('hello')

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits,
  })
})

router.get('/statistics', async (_req, res) => {
  const addedToDos = await redis.getAsync('added_todos')
  if (!addedToDos) {
    await redis.setAsync('added_todos', 0)
  }
  const addedJson = await redis.getAsync('added_todos')
  res.send({ added_todos: addedJson })
})

module.exports = router
