import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products.vue')
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/ProductDetail.vue')
      },
      {
        path: 'order/query',
        name: 'OrderQuery',
        component: () => import('@/views/OrderQuery.vue')
      },
      {
        path: 'user',
        name: 'UserCenter',
        component: () => import('@/views/user/Index.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: 'orders',
            name: 'UserOrders',
            component: () => import('@/views/user/Orders.vue')
          },
          {
            path: 'distribution',
            name: 'Distribution',
            component: () => import('@/views/user/Distribution.vue')
          },
          {
            path: 'withdraw',
            name: 'Withdraw',
            component: () => import('@/views/user/Withdraw.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/Products.vue')
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/Orders.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue')
      },
      {
        path: 'withdrawals',
        name: 'AdminWithdrawals',
        component: () => import('@/views/admin/Withdrawals.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
  } else if (to.meta.requiresAdmin && !userStore.isAdmin()) {
    next('/')
  } else {
    next()
  }
})

export default router
