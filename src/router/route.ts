import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import CreateProduct from '@/components/CreateProduct.vue';
import CreateCategory from '@/components/CreateCategory.vue';
import Products from '@/components/Products.vue';
import Categories from '@/components/Categories.vue';
import { isAuthenticated } from '@/utils/auth';

const routes = [
  {
    path: '/',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/create-product',
    name: 'CreateProduct',
    component: CreateProduct,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-category',
    name: 'CreateCategory',
    component: CreateCategory,
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      from
      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
