import axios from 'axios'

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
    enableAllButtons()
    return response
  },
  (error) => {
    enableAllButtons()
    return Promise.reject(error)
  },
)

export default axiosInstance
