import SingleForm from './SingleForm'
import { useState } from 'react'
import { Button } from '@mui/material'

//redux
/*
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
*/
//react query
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from '../NotificationContext'
import blogService from '../services/blogs'

const BlogForm = (toggableRef) => {
  //const dispatch = useDispatch() --redux

  //react query
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData({ queryKey: ['blogs'] })
      queryClient.setQueryData({ queryKey: ['blogs'] }, blogs.concat(newBlog))
      notificationDispatch({
        type: 'SHOW',
        payload: `blog '${newBlog.title}' created`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    },
    onError: (error) => {
      console.log(error.message)
      notificationDispatch({ type: 'SHOW', payload: error.message })
      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    },
  })

  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  //console.log(formsList)

  const blogForms = [
    {
      value: blogTitle,
      name: 'Title',
      handleChange: setBlogTitle,
    },
    {
      value: blogAuthor,
      name: 'Author',
      handleChange: setBlogAuthor,
    },
    {
      value: blogUrl,
      name: 'Url',
      handleChange: setBlogUrl,
    },
  ]

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    }

    //createBlog(blogObject)--original

    //redux
    //dispatch(createBlog(blogObject))
    //dispatch(setNotification(`you created ${blogTitle}`, 10))

    //react query
    newBlogMutation.mutate(blogObject)

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
    toggableRef.blogFormRef.current.toggleVisibility()
  }

  return (
    <form onSubmit={addBlog}>
      {blogForms.map((form) => (
        <SingleForm
          key={form.name}
          name={form.name}
          value={form.value}
          handleChange={form.handleChange}
        />
      ))}
      <Button id="blogFormCreateButton" type="submit">
        create
      </Button>
    </form>
  )
}

export default BlogForm
