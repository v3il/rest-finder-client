import axios from 'axios';

import languageService from '@/service/languageService';
import authService from './service/authService';

import router from './router';

console.log(process.env.VUE_APP_API_URL);

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
});

instance.interceptors.request.use((config) => {
    // eslint-disable-next-line
    config.headers.authorization = `Bearer ${authService.getToken()}`;

    // eslint-disable-next-line
    config.params = { ...config.params, locale: languageService.getCurrentLanguage() };

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
