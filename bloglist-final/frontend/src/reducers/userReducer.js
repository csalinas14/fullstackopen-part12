import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { setNotification } from './notificationReducer'

const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      return user
    },
    checkIfLoggedIn() {
      const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
      console.log('here')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        blogService.setToken(user.token)
        return user
      }
    },
    logout() {
      window.localStorage.removeItem('loggedNoteappUser')
      return null
    },
  },
})

export const { setUser, checkIfLoggedIn, logout } = userSlice.actions

export const login = (userInfo) => {
  return async (dispatch) => {
    try {
      const loggedInUser = await loginService.login(userInfo)
      //console.log(loggedInUser)
      dispatch(setUser(loggedInUser))
    } catch (exception) {
      //console.log(exception)
      dispatch(setNotification('Wrong credentials', 10))
    }
  }
}

export default userSlice.reducer
