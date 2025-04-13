import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_FSM_URL}`,
  timeout: 100000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers['Authorization'] = `Bearer ${token}`

    return config
  },
  (error) => {
    console.log(`Error occurred while sending request`)
    return Promise.reject(error)
  },
)

export default axiosInstance
