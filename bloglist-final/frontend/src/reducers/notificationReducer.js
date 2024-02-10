import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      const content = action.payload
      return content
    },
    resetNotification() {
      return ''
    },
  },
})

export const { addNotification, resetNotification } = notificationSlice.actions

export const setNotification = (content, time) => {
  return async (dispatch) => {
    dispatch(addNotification(content))
    setTimeout(() => {
      dispatch(resetNotification())
    }, time * 1000)
  }
}
export default notificationSlice.reducer
