import { useEffect } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'

import Home from './components/Home'
import UserList from './components/UserList'
import User from './components/User'
import BlogView from './components/BlogView'
import Menu from './components/Menu'
import Notification from './components/Notification'
//redux
//import { useDispatch, useSelector } from 'react-redux'
//import { initializeBlogs } from './reducers/blogReducer'
//import { checkIfLoggedIn, logout } from './reducers/userReducer'

//react query and context
//import { useNotificationDispatch } from './NotificationContext'
import { useUserDispatch } from './UserContext'
//import { useQuery } from '@tanstack/react-query'
import userService from './services/users'
import blogService from './services/blogs'

import { useList } from './hooks/list'

//MUI
import { Container } from '@mui/material'

const App = () => {
  //react query and context
  //const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()

  //redux
  //const dispatch = useDispatch()
  //const user = useSelector(({ user }) => user)

  useEffect(() => {
    //dispatch(initializeBlogs())

    //dispatch(checkIfLoggedIn())--redux
    userDispatch({ type: 'SIGNEDIN' })
  }, [])

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')
  const {
    status: userStatus,
    data: userData,
    error: userError,
  } = useList('users', userService)
  const {
    status: blogStatus,
    data: blogData,
    error: blogError,
  } = useList('blogs', blogService)
  //console.log(userStatus)

  if (userStatus === 'loading' || blogStatus === 'loading') {
    return <div>loading data...</div>
  }

  if (userError === 'error' || blogError === 'error') {
    return <div>service is not available due to problems in server</div>
  }
  /*

  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })
  const match = useMatch('/users/:id')
  //console.log(result)

  if (result.isLoading) {
    return <div>loading data... </div>
  }

  if (result.isError) {
    return <div>blog service is not available due to problems in server</div>
  }
  */

  const users = userData
  //console.log(users)
  const userId = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null

  const blogs = blogData
  const blogId = blogMatch
    ? blogs.find((u) => u.id === blogMatch.params.id)
    : null

  //console.log(userMatch)

  return (
    <Container>
      <div>
        <Menu />
        <Notification />
        <Routes>
          <Route
            path="/blogs/:id"
            element={<BlogView blogData={blogId} />}
          ></Route>
          <Route path="/users/:id" element={<User userData={userId} />}></Route>
          <Route path="/users" element={<UserList users={users} />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Container>
  )
}

export default App
