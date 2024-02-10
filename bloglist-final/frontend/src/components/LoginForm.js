import { useState } from 'react'

//redux
/*
import { useDispatch } from 'react-redux'
import { login } from '../reducers/userReducer'
*/
import { login, useUserDispatch } from '../UserContext'
import { useNotificationDispatch } from '../NotificationContext'

import { TextField, Button } from '@mui/material'

const LoginForm = () => {
  //redux
  //const dispatch = useDispatch()
  const userDispatch = useUserDispatch()
  const notificationDispatch = useNotificationDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    //redux
    /*
    dispatch(
      login({
        username,
        password,
      })
    )
    */
    //react context
    login({ username, password }, userDispatch, notificationDispatch)
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          id="username"
          value={username}
          label="username"
          size="small"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          id="password"
          type="password"
          value={password}
          label="password"
          size="small"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        id="login-button"
        type="submit"
      >
        login
      </Button>
    </form>
  )
}

export default LoginForm
