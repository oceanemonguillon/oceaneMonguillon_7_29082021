import { createRouter, createWebHashHistory } from 'vue-router'
import login from '../views/login.vue'
import signup from '../views/signup.vue'
import posts from '../views/posts.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/signup',
    name: 'signup',
    component: signup
  },
  {
    path: '/posts',
    name: 'posts',
    component: posts
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
