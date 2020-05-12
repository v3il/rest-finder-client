import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import AuthPage from '../views/AuthPage.vue';

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
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthorized = false; // authTokenService.isAuthorized();

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
