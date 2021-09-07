import { createRouter, createWebHashHistory } from 'vue-router'
import login from '../views/login.vue'
import signup from '../views/signup.vue'
import posts from '../views/posts.vue'
import post from '../views/post.vue'
import addPost from '../views/addPost.vue'
import modifypost from '../views/modifyPost.vue'

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
  {
    path: '/post/:id',
    name: 'post',
    component: post
  },
  {
    path: '/addpost',
    name: 'addpost',
    component: addPost
  },
  {
    path: '/modifypost/:id',
    name: 'modifypost',
    component: modifypost
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
