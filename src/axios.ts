import axios from 'axios';

import authService from './service/authService';

import router from './router';

const instance = axios.create({
    baseURL: process.env.VUE_API_URL,
});

instance.interceptors.request.use((config) => {
    // eslint-disable-next-line
    config.headers.authorization = `Bearer ${authService.getToken()}`;
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 403) {
            authService.logout();
            router.replace({ name: 'login' });
        } else {
            return Promise.reject(error);
        }
    },
);

export default instance;
