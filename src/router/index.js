import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/Index.vue')
  },
  {
    path: '/user/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/Home.vue'),
    children: [
      {
        path: '/welcome',
        component: () => import('../components/Welcome.vue')
      },
      {
        path: '/shops',
        component: () => import('../components/shop/Shop.vue')
      },
      {
        path: '/banners',
        component: () => import('../components/banner/Banner.vue')
      },
      {
        path: '/users',
        component: () => import('../components/user/Users.vue')
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles.vue')
      },
      {
        path: '/products',
        component: () => import('../components/goods/List.vue')
      },
      {
        path: '/orders',
        component: () => import('../components/order/Order.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/user/login') {
    return next()
  }
  const token = localStorage.getItem('token')
  if (!token) {
    return next('/user/login')
  }
  next()
})

export default router
