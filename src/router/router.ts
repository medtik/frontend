import Vue from 'vue';
import Router from 'vue-router';
import LoginComponent from '../views/Login.vue';
import AuthProviderComponent from '../views/AuthProvider.vue';
import AuthComponent from '../views/Auth.vue';
import ResumeProviderComponent from '../views/ResumeProvider.vue';
import {authGuard} from './auth';

Vue.use(Router);

export const router: Router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginComponent,
      meta: {auth: false},
    },
    {
      path: '/auth/:id',
      name: 'auth',
      component: AuthProviderComponent,
      props: true,
      meta: {auth: false},
    },
    {
      path: '',
      component: AuthComponent,
      children: [
        {
          path: '/provider/:id',
          name: 'resume',
          component: ResumeProviderComponent,
          props: true,
        },
      ],
      beforeEnter: authGuard,
      meta: {auth: true},
    },
    {
      path: '*',
      redirect: '/',
    }
  ],
});
