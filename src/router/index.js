import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登陆组件
import Login from '../components/Login.vue'
// home 组件
import Home from '../components/Home.vue'
// 路由
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/home', component: Home }
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
  console.log(tokenStr)
  if (!tokenStr) return next('/login')
  next()
})


export default router
