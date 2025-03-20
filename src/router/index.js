import {createMemoryHistory, createRouter} from 'vue-router';
import LoginScreen from "../screens/LoginScreen.vue"; 
import LoginScreen2 from "../screens/LoginScreen2.vue"; 


const routes = [
    {path: '/', component: LoginScreen},
    { path: '/dummyLoginScreen', component: LoginScreen2 },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});


export default router;