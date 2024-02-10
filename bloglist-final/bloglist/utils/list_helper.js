const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    //console.log(item)
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {

  const reducer = (max, item) => {
    //console.log(max)
    if (item.likes > max.likes){
      return {
        title: item.title,
        author: item.author,
        likes: item.likes
      }
    }else{
      return max
    }
  }

  //console.log(blogs)
  const temp = {
    title: 'dummy',
    author: 'dummy',
    likes: -1
  }

  return blogs.length === 0
    ? 'No blogs'
    : blogs.reduce(reducer, temp)
}


const mostBlogs = blogs => {

  if (blogs.length === 0){
    return 'No blogs'
  }

  const authorsWithBlogs = _.countBy(blogs, 'author')
  //console.log(authorsWithBlogs)

  let max = 0
  let temp = {}
  _.each(authorsWithBlogs, (value, key) => {
    if (value > max){
      max = value
      temp = {
        author: key,
        blogs: value
      }
    }
  })

  return temp

}

const mostLikes = blogs => {

  if (blogs.length === 0){
    return 'No blogs'
  }

  const reducer = (sum, item) => {
    //console.log(item)
    return sum + item.likes
  }

  const authorWithLikes = _.groupBy(blogs, 'author')

  //console.log(authorWithLikes)
  let max = 0
  let temp = {}
  _.each(authorWithLikes, (value, key) => {

    var likes = value.reduce(reducer, 0)
    //console.log(likes)
    if (likes > max){
      max = likes
      temp = {
        author: key,
        likes: likes
      }
    }
  })

  return temp
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}