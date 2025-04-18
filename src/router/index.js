import {createMemoryHistory, createRouter} from 'vue-router';
import LoginScreen from "../screens/LoginScreen.vue";
import AuthLayout from "../screens/AuthLayout.vue";
import RemittanceScreen from "../screens/RemittanceScreen.vue";
import MainMenuScreen from "../screens/MainMenuScreen.vue";
import SBPOutwardCancel from "../screens/SBPOutwardCancelScreen.vue";
import SBPOutwardAuth from "../screens/SBPOutwardAuthScreen.vue";
import SBPOutwardTransfer from "../screens/SBPOutwardTransferScreen.vue";
import ExceptionWindow from '@/screens/ExceptionWindow.vue';
import VoucherCreatedScreen from '@/screens/VoucherCreatedScreen.vue';
import AuthWindow from '@/screens/AuthWindow.vue';

const routes = [
    {path: '/', component: LoginScreen},
    { path: '/authlayout',
      component: AuthLayout,
      children: [
        {
          path: '',
          component: MainMenuScreen
        },
        {
          path: '/remittance',
          component: RemittanceScreen
        },
        {
          path: '/sbpoutwardcancel',
          component: SBPOutwardCancel
        },
        {
          path: '/sbpoutwardauth',
          component: SBPOutwardAuth
        },
        {
          path: '/sbpoutwardtransfer',
          component: SBPOutwardTransfer
        },
        {

          path: '/exceptionwindow',
          component: ExceptionWindow
        },
        {
          path: '/vouchercreatedscreen',
          component: VoucherCreatedScreen
        },
        {
          path: '/authWindow',
          component: AuthWindow
        },
      ]
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});


export default router;
