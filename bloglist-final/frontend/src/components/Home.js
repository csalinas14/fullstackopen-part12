import LoginForm from './LoginForm'
import BlogForm from './BlogForm'
//import Notification from './Notification'
import Togglable from './Togglable'
import BlogList from './BlogList'
import { useRef } from 'react'

import { Typography } from '@mui/material'

//react context
import { useUserValue } from '../UserContext'

const Home = () => {
  //react context
  const userData = useUserValue()
  //const userDispatch = useUserDispatch()

  const blogFormRef = useRef()

  /*
  const logoutEvent = (event) => {
    event.preventDefault()
    //dispatch(logout())--redux

    //react context
    userDispatch({ type: 'LOGOUT' })
  }
*/
  if (userData === null || userData.error) {
    return (
      <>
        <Typography variant="h2">login</Typography>
        <LoginForm />
      </>
    )
  }

  return (
    <div>
      {/*
      <h2>blogs</h2>
      {userData.user.name} logged in
      <button onClick={logoutEvent}>logout</button>
      <br />
  */}
      <Typography variant="h3">create new</Typography>
      <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <BlogList />
    </div>
  )
}

export default Home
