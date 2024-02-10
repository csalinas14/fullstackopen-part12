import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const sortBlogs = (blogsArray) => blogsArray.sort((a, b) => b.likes - a.likes)

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const changedBlog = action.payload
      return sortBlogs(
        state.map((blog) => (blog.id !== changedBlog.id ? blog : changedBlog))
      )
    },
    removeBlog(state, action) {
      const blogToRemoveId = action.payload
      return state.filter((blog) => blog.id !== blogToRemoveId)
    },
  },
})

export const { appendBlog, setBlogs, updateBlog, removeBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    //console.log(blogs)
    dispatch(setBlogs(sortBlogs(blogs)))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(appendBlog(newBlog))
    } catch (exception) {
      dispatch(setNotification('Invalid Blog', 10))
    }
  }
}

export const addOneLike = (blog) => {
  return async (dispatch) => {
    const changedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    const blogToChange = await blogService.update(changedBlog)
    dispatch(updateBlog(blogToChange))
  }
}

export const delBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export default blogSlice.reducer
