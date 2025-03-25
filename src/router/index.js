import {createMemoryHistory, createRouter} from 'vue-router';
// import LoginScreen2 from "../screens/LoginScreen2.vue"; 
import LoginScreen from "../screens/LoginScreen.vue"; 
import MainMenuScreen from "../screens/MainMenuScreen.vue"; 


const routes = [
    {path: '/dummy', component: LoginScreen},
    // { path: '/dummyLoginScreen', component: LoginScreen2 },
    { path: '/', component: MainMenuScreen },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});


export default router;