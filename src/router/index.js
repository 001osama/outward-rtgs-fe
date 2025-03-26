import {createMemoryHistory, createRouter} from 'vue-router';
// import LoginScreen from "../screens/LoginScreen.vue";
import MainMenuScreen from "../screens/AuthLayout.vue";


const routes = [
    // {path: '/', component: LoginScreen},
    // { path: '/MainMenu', component: MainMenuScreen },
    { path: '/', component: MainMenuScreen },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
});


export default router;