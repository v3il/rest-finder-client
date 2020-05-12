import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import authService from '@/service/authService';
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
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthorized = authService.isAuthorized();

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
