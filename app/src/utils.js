import axios from 'axios'
import Vue from 'vue'

const eventBus = new Vue()

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
    eventBus.$emit('dialogOpen', {title: 'Dev message', message: error.stack})
  } else {
    eventBus.$emit('dialogOpen')
  }
  return Promise.reject(error)
})

function setAuthToken (authToken) {
  localStorage.auth = authToken
  kedjaAPI.defaults.headers['Authorization'] = authToken
}

export {
  setAuthToken,
  kedjaAPI,
  eventBus
}
