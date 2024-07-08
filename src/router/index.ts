import {createRouter,createWebHashHistory,RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '',
        redirect: "/page1",
        component: () => import('../views/Home.vue') ,
        children:[
            {
                path:'/page1',
                component: () => import('../views/Page1/index.vue') ,
            },
            {
                path:'/page2',
                component: () => import('../views/Page2/index.vue') ,
            }
        ]
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})


export default router