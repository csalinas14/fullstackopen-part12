import { createContext, useReducer, useContext } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

/* eslint-disable */
const userReducer = (state, action) => {
  switch (action.type) {
    case 'SIGNEDIN':
      const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
      console.log(loggedUserJSON)
      if (loggedUserJSON) {
        console.log('what')
        const user = JSON.parse(loggedUserJSON)
        blogService.setToken(user.token)
        return { user: user }
      } else {
        return null
      }
    case 'LOGIN':
      window.localStorage.setItem(
        'loggedNoteappUser',
        JSON.stringify(action.payload)
      )

      blogService.setToken(action.payload.token)
      return { user: action.payload }
    case 'LOGOUT':
      window.localStorage.removeItem('loggedNoteappUser')
      return null
    case 'ERROR':
      return { error: 'Wrong Credentials' }
    default:
      return null
  }
}
/* eslint-enable */
const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[0]
}

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[1]
}

export const login = async (userInfo, dispatch, notiDispatch) => {
  console.log(userInfo)
  try {
    const loggedInUser = await loginService.login(userInfo)
    console.log(loggedInUser)
    dispatch({ type: 'LOGIN', payload: loggedInUser })
  } catch (exception) {
    dispatch({ type: 'ERROR' })
    notiDispatch({ type: 'SHOW', payload: 'Wrong Credentials' })
    setTimeout(() => {
      notiDispatch({ type: 'HIDE' })
    }, 5000)
  }
}

export default UserContext
