//import { useState } from 'react'
import PropTypes from 'prop-types'

//redux
/*
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { addOneLike, delBlog } from '../reducers/blogReducer'
*/
//react query
//import { useMutation, useQueryClient } from '@tanstack/react-query'
//import { useNotificationDispatch } from '../NotificationContext'
//import blogService from '../services/blogs'

//react context
//import { useUserValue } from '../UserContext'

import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  /**
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  */
  /*
  //redux
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)


  //react context
  const userData = useUserValue()
  const notificationDispatch = useNotificationDispatch()

  //needed for react query
  const sortBlogs = (blogsArray) => blogsArray.sort((a, b) => b.likes - a.likes)

  //react query
  const queryClient = useQueryClient()

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (delBlog, variables) => {
      const blogs = queryClient.getQueryData({ queryKey: ['blogs'] })
      //console.log(variables)
      const newBlogs = sortBlogs(blogs.filter((b) => b.id !== variables))
      queryClient.setQueryData({ queryKey: ['blogs'] }, newBlogs)
    },
  })

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const showDeleteButton = {
    display: userData.user.username === blog.user.username ? '' : 'none',
  }
  //console.log(showDeleteButton)

  const deleteBlog = (event) => {
    event.preventDefault()
    //removeBlog(blog)
    const ok = window.confirm(`remove ${blog.title} by ${blog.author}?`)
    if (ok) {
      //redux
      /*
      dispatch(delBlog(blog.id))
      dispatch(setNotification(`you removed ${blog.title}`, 10))
      //react query
      deleteBlogMutation.mutate(blog.id)
      notificationDispatch({
        type: 'SHOW',
        payload: `blog '${blog.title}' deleted`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div style={hideWhenVisible}>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {blog.title}
        <button onClick={toggleVisibility}>hide</button>
        <br />
        {blog.url + '\n'}
        <br />
        {'likes ' + blog.likes}
        <button className="blogLikeButton" onClick={addLikes}>
          like
        </button>
        <br />
        {blog.author}
        <br />
        {blog.user.name}
        <br />
        <div style={showDeleteButton}>
          <button className="blogDeleteButton" onClick={deleteBlog}>
            delete
          </button>
        </div>
      </div>
    </div>
  )*/

  return (
    <Link to={`/blogs/${blog.id}`}>
      {blog.title} {blog.author}
    </Link>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  //increaseLikes: PropTypes.func.isRequired,
  //removeBlog: PropTypes.func.isRequired,
  //username: PropTypes.string.isRequired,
}

export default Blog
