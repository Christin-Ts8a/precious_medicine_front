import Vue from 'vue'
import Router from 'vue-router'
import Index from '../pages/Index.vue'
import Login from "@/pages/Login";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            children: []
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            children: []
        }
    ]
})