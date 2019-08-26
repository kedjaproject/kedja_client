import axios from 'axios'

const kedjaAPI = axios.create({
  baseURL: process.env.API_SERVER + process.env.API_PATH,
  headers: {
    Authorization: localStorage.auth
  }
})

// Default error handler here.
kedjaAPI.interceptors.response.use(response => response, error => {
  if (process.env.NODE_ENV === 'development') {
    console.log(error)
  }
  return Promise.reject(error)
})

function setAuthToken (authToken) {
  localStorage.auth = authToken
  kedjaAPI.defaults.headers['Authorization'] = authToken
}

export {
  setAuthToken,
  kedjaAPI
}
