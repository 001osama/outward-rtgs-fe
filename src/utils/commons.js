import router from '@/router'
import axios from '@/axiosInstance.js'
import { ElMessageBox } from 'element-plus'

const signOff = async () => {
  ElMessageBox.confirm('Are you Sure, You want to Sign Out?', 'Warning', {
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    showCancelButton: true,
    showClose: false,
    autofocus: false,
    center: true,
    draggable: true,
    closeOnClickModal: false,
  })
    .then(async () => {
      try {
        const response = await axios.post(`/start`, { transition: 'SIGNOFF' })
        if (response.status == 200) {
          const { data } = response
          if (data.success) {
            localStorage.removeItem('token')
            localStorage.removeItem('messageShown')
            router.push('/')
          } else {
            console.error(data.message)
          }
        } else {
          console.error(response.message)
        }
      } catch (error) {
        console.error(error)
      }
    })
    .catch(() => {})
}

export { signOff }
