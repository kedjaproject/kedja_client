import axios from 'axios'

const kedjaAPI = axios.create({
  baseURL: process.env.API_SERVER + process.env.API_PATH,
  headers: {
    Authorization: localStorage.auth
  }
})

function makeAPICall (endpoint, data, method = 'get') {
  return kedjaAPI[method](endpoint, data)
}

function setAuthToken (authToken) {
  localStorage.auth = authToken
  kedjaAPI.defaults.headers.common['Authorization'] = authToken
}

export {
  setAuthToken,
  makeAPICall,
  kedjaAPI
}
