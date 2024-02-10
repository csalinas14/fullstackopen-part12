//import { useSelector } from 'react-redux'
import { useNotificationValue } from '../NotificationContext'
import { Alert } from '@mui/material'

const Notification = ({ type }) => {
  //redux
  //const notification = useSelector((state) => state.notification)
  const notification = useNotificationValue()

  if (notification === '') {
    return null
  }

  return (
    <div>
      <Alert severity={type}>{notification}</Alert>
    </div>
  )
}

export default Notification
