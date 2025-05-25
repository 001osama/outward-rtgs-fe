import { createWebHistory, createRouter, createMemoryHistory } from 'vue-router'
import LoginScreen from '../screens/LoginScreen.vue'
import AuthLayout from '../screens/AuthLayout.vue'
import RemittanceScreen from '../screens/RemittanceScreen.vue'
import MainMenuScreen from '../screens/MainMenuScreen.vue'
import SBPOutwardCancel from '../screens/SBPOutwardCancelScreen.vue'
import SBPOutwardAuth from '../screens/SBPOutwardAuthScreen.vue'
import SBPOutwardTransfer from '../screens/SBPOutwardTransferScreen.vue'
import RTGSInquiryReportScreen from '@/screens/RTGSInquiryReportScreen.vue'

const routes = [
  {
    path: '/',
    component: LoginScreen,
    name: 'Login',
  },
  {
    path: '/authLayout',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: MainMenuScreen,
        name: 'MainMenu',
        meta: { title: 'Main Menu', componentName: 'MainMenu' },
      },
      {
        path: '/remittance',
        component: RemittanceScreen,
        name: 'Remittance',
        meta: { title: 'Remittance', componentName: 'Remittance' },
      },
      {
        path: '/rtgsinquiry',
        component: RTGSInquiryReportScreen,
        name: 'RTGSInquiry',
        meta: { title: 'RTGS Inquiry', componentName: 'RTGSInquiry' },
      },
      {
        path: '/sbpoutwardcancel',
        component: SBPOutwardCancel,
        name: 'SBPOutwardCancel',
        meta: { title: 'Cancel Voucher', componentName: 'SBPOutwardCancel' },
      },
      {
        path: '/sbpoutwardauth',
        component: SBPOutwardAuth,
        name: 'SBPOutwardAuth',
        meta: { title: 'Authorize Voucher', componentName: 'SBPOutwardCancel' },
      },
      {
        path: '/sbpoutwardtransfer',
        component: SBPOutwardTransfer,
        name: 'SBPOutwardTransfer',
        meta: { title: 'SBP Cheque Outward Lodgement', componentName: 'SBPOutwardCancel' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// const routerPush()
// {
//   headerStore.setHeaderTitle()
// }

router.beforeEach(async (to, from) => {
  const isAuthenticated = localStorage.getItem('token')
  if (!isAuthenticated && to.path !== '/') {
    return { path: '/' }
  }
})

export default router
