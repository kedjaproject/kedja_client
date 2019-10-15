import axios from 'axios'
import Vue from 'vue'

const fakeUsers = [
  { data: { first_name: 'Fanny', last_name: 'Lindh' }, rid: 1 },
  { data: { first_name: 'Anders', last_name: 'Hultman' }, rid: 2 },
  { data: { first_name: 'Fanny', last_name: 'Berggren' }, rid: 3 },
  { data: { first_name: 'Martin', last_name: 'Törnros' }, rid: 4 },
  { data: { first_name: 'Maja', last_name: 'Fjällbäck' }, rid: 5 },
  { data: { first_name: 'Johan', last_name: 'Schiff' }, rid: 6 },
  { data: { first_name: 'Robin', last_name: 'Harms Oredsson' }, rid: 7 },
  { data: { first_name: 'Ronja', last_name: 'Brandt' }, rid: 8 }
]

const userColors = [
  '#85B96D',
  '#27CBFF',
  '#517480',
  '#FF2741',
  '#00D6A2'
]

function getUserColor (index) {
  return userColors[index % userColors.length]
}

const eventBus = new Vue()

const kedjaAPI = axios.create({
  baseURL: process.env.API_SERVER + process.env.API_PATH,
  headers: {
    Authorization: localStorage.auth
  }
})

function openDialog (params) {
  eventBus.$emit('dialogOpen', params)
}

function openDeleteDialog ({message, action}) {
  openDialog({
    title: '',
    message,
    buttons: [
      {
        text: 'Radera',
        classes: 'btn-warning',
        action
      },
      {
        text: 'Avbryt',
        classes: 'btn-primary'
      }
    ]
  })
}

function openModal (component, data) {
  eventBus.$emit('modalOpen', {component, data})
}

function closeModal () {
  eventBus.$emit('modalClose')
}

// Default error handler here.
// FIXME: This should be only for dev, so callers get to handle errors.
kedjaAPI.interceptors.response.use(response => response, error => {
  if (process.env.NODE_ENV === 'development_') {
    console.log(error.response)
    openDialog({title: 'Dev message', message: error})
  } else {
    switch (error.response.status) {
      case 401:
        openDialog({
          message: '',
          title: 'Sidan kräver inloggning',
          dismissable: false,
          buttons: [
            {
              text: 'Logga in',
              classes: 'btn-primary',
              routeTo: '/login'
            }
          ]
        })
        break
      case 403:
        openDialog({
          title: 'Behörighet saknas',
          message: 'Du saknar rättigheter till den här funktionen.'
        })
        break
      case 404:
        openDialog({
          title: 'Sidan kunde inte hittas',
          message: 'Kontrollera webbadressen.',
          dismissable: false,
          buttons: [
            {
              text: 'Till Kedja',
              classes: 'btn-primary',
              routeTo: '/'
            }
          ]
        })
        break
      default:
        openDialog()
    }
  }
  return Promise.reject(error)
})

function setAuthToken (authToken) {
  localStorage.auth = authToken
  kedjaAPI.defaults.headers['Authorization'] = authToken
}

if (process.env.NODE_ENV === 'development') {
  window.APIget = path => {
    kedjaAPI.get(path)
      .then(reponse => console.log(reponse))
  }
}

export {
  setAuthToken,
  kedjaAPI,
  eventBus,
  getUserColor,
  fakeUsers,
  openDialog,
  openDeleteDialog,
  openModal,
  closeModal
}
