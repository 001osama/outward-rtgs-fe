import axios from 'axios'
import router from '@/router/index'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_FSM_URL}`,
  timeout: 100000,
})

let buttonsState = new Map()

const disableAllButtons = () => {
  const buttons = document.querySelectorAll('button')
  buttons.forEach((button) => {
    buttonsState.set(button, button.disabled)
    button.disabled = true
  })
}

const enableAllButtons = () => {
  const buttons = document.querySelectorAll('button')
  buttons.forEach((button) => {
    const wasOriginallyDisabled = buttonsState.get(button)
    if (wasOriginallyDisabled !== undefined) {
      button.disabled = wasOriginallyDisabled
    }
  })
  buttonsState.clear()
}

axiosInstance.interceptors.request.use(
  (config) => {
    disableAllButtons()
    const token = localStorage.getItem('token')
    if (token) config.headers['Authorization'] = `Bearer ${token}`

    return config
  },
  (error) => {
    console.log(`Error occurred while sending request`)
    enableAllButtons()
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('getting repsonse')
    enableAllButtons()

    return response
  },
  (error) => {
    console.log('getting error', error)
    enableAllButtons()
    if (error.status == 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('messageShown')
      router.push('/')
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
