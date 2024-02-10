import { Link } from 'react-router-dom'
import { useUserValue, useUserDispatch } from '../UserContext'
import { AppBar, Toolbar, Button } from '@mui/material'

const Menu = () => {
  const user = useUserValue()
  const userDispatch = useUserDispatch()
  console.log(user)

  /*
  const padding = {
    paddingRight: 5,
  }*/
  const logoutEvent = (event) => {
    event.preventDefault()
    //dispatch(logout())--redux

    //react context
    userDispatch({ type: 'LOGOUT' })
  }

  if (!user || user.error) {
    return null
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <em>{user.user.name} logged in</em>
        <Button color="inherit" onClick={logoutEvent}>
          logout
        </Button>
        {/*
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        <em>{user.user.name} logged in</em>
        <button onClick={logoutEvent}>logout</button>
  */}
      </Toolbar>
    </AppBar>
  )
}

export default Menu
