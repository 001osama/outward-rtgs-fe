import {createMemoryHistory, createRouter} from 'vue-router';
import LoginScreen from "../screens/LoginScreen.vue";
import AuthLayout from "../screens/AuthLayout.vue";
import RemittanceScreen from "../screens/RemittanceScreen.vue";
import MainMenuScreen from "../screens/MainMenuScreen.vue";
import SBPOutwardCancel from "../screens/SBPOutwardCancelScreen.vue";


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
      ]
    },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});


export default router;