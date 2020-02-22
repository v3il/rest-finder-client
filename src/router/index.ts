import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import store from '@/store';

import MainPage from '@/views/MainPage.vue';
import ControlPanel from '@/views/ControlPanel.vue';
import RestorePassword from '@/views/RestorePassword.vue';
import AuthPage from '../views/AuthPage.vue';
import EmailConfirmationPage from '../views/EmailConfirmationPage.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/login',
        name: 'login',
        component: AuthPage,
    },
    {
        path: '/register',
        name: 'register',
        component: AuthPage,
    },
    {
        path: '/email_confirmation',
        name: 'email_confirmation',
        component: EmailConfirmationPage,
    },
    {
        path: '/restore_password',
        name: 'restore_password',
        component: RestorePassword,
    },
    {
        path: '/',
        name: 'home',
        component: MainPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/admin',
        name: 'admin',
        component: ControlPanel,
        meta: {
            requiresAuth: true,
            forAdmin: true,
        },
    },
];

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async (to, from, next) => {
    const isAuthorized = store.getters['auth/isAuthorized'];

    if (['login', 'register'].includes(to.name || '') && isAuthorized) {
        return next({ name: 'home' });
    }

    if (to.meta.requiresAuth) {
        if (isAuthorized) {
            next();
        } else {
            next({ name: 'login' });
        }
    } else {
        next();
    }
});

export default router;
