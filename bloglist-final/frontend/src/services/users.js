import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACKEND_URL + '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  //console.log(response)
  return response.data
}

export default { getAll }
