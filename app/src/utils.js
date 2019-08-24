import axios from 'axios'

const kedjaServer = axios.create({
  baseURL: process.env.API_SERVER + process.env.API_PATH,
  headers: {
    Authorization: localStorage.auth
  }
})

function makeAPICall (endpoint, data, method = 'get') {
  return kedjaServer[method](endpoint, data)
}

function setAuthToken (authToken) {
  localStorage.auth = authToken
  kedjaServer.defaults.headers.common['Authorization'] = authToken
}

export {
  setAuthToken,
  makeAPICall
}
