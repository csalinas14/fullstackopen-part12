const totalLikes = require('../utils/list_helper').totalLikes

describe('totalLikes', () => {

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f2',
      title: 'Random text here',
      author: 'Me',
      url: 'test',
      likes: 2,
      __v: 0
    }
  ]


  test('of one value is the value itself', () => {
    expect(totalLikes(listWithOneBlog)).toBe(5)
  })

  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('of a bigger list is calculated right', () => {
    expect(totalLikes(listWithManyBlogs)).toBe(7)
  })

})