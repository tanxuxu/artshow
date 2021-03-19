import Vue from 'vue'
import VueRouter from 'vue-router'
import main from '../components/main.vue'
import info from "../components/info"
// import gallery from "../components/gallery"
import detail from "../components/detail.vue"
// import share from "../components/share.vue"
import other from "../components/other.vue"
import youxiu from "../components/youxiu.vue"

Vue.use(VueRouter)
/* eslint-disable */
const routes = [{
        path: '/',
        name: 'main',
        component: main,
        meta: {
            title: '童享不凡-粤澳&希望乡村联合巡回画展',
            keepAlive: true,
            hideBar: true
        }
    },{
        path: '/info',
        name: 'info',
        component: info,
        meta: {
            title: '活动介绍',
            keepAlive: true
        }
    },{
        path: '/hight',
        name: 'hight',
        component: youxiu,
        meta: {
            title: '高年级组',
            keepAlive: true
        }
    },
    {
        path: '/low',
        name: 'low',
        component: other,
        meta: {
            title: '低年级组',
            keepAlive: true
        }
    },{
        path: '/detail',
        name: 'detail',
        component: detail,
        meta: {
            title: '作品介绍',
            keepAlive: true
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
