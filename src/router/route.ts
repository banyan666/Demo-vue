const route = [
    {
        path: '/',
        name: '',
        redirect: "/page1",
        component: () => import('../views/Home.vue') ,
        children:[
            {
                path:'/page1',
                name:'页面1',
                component: () => import('../views/Page1/index.vue') ,
            },
            {
                path:'/page2',
                name:'页面2',
                component: () => import('../views/Page2/index.vue') ,
            },
            {
                path:'/page3',
                name:'页面3',
                component: () => import('../views/Page3/index.vue') ,
            },
            {
                path:'/page4',
                name:'页面4',
                component: () => import('../views/Page4/index.vue') ,
            },
            {
                path:'/page5',
                name:'页面5',
                component: () => import('../views/Page5/index.vue') ,
            }
        ]
    }
]
export default route