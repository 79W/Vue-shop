import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登陆组件
import Login from '../components/Login.vue'
// home 组件
import Home from '../components/Home.vue'
//
import Welcome from "../components/Welcome.vue"
import Users from "../components/user/Users.vue"
import Rights from "../components/power/Rights.vue"
import Roles from "../components/power/Roles.vue"
// 路由
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/home',redirect : '/welcome', component: Home ,children:[
    { path:'/welcome' ,component: Welcome},
    { path:'/users' ,component: Users},
    { path:'/rights' ,component: Rights},
    { path:'/roles' ,component: Roles}
  ] }
]
const router = new VueRouter({
  routes
})
// 路由守卫 不登陆不让进
router.beforeEach((to, from, next) => {
  // to 去哪里
  // from 哪里来个
  // 函数 放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
