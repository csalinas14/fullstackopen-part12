import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

const UserLine = ({ userInfo }) => {
  return (
    <tr>
      <td>
        <Link to={`/users/${userInfo.id}`}>{userInfo.name}</Link>
      </td>
      <td>{userInfo.blogs.length}</td>
    </tr>
  )
}

const UserList = ({ users }) => {
  //console.log(users)

  return (
    <div>
      <Typography variant="h3">Users</Typography>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map((user) => (
            <UserLine key={user.id} userInfo={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
