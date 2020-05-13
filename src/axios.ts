import axios from 'axios';

import store from '@/store';
import router from '@/router';

import { TokenData } from '@/index.d';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
});

instance.interceptors.request.use((config) => {
    const token: TokenData | null = (store.state as any).auth.tokenData;

    // eslint-disable-next-line
    config.headers.authorization = `Bearer ${token ? token.token : ''}`;

    // eslint-disable-next-line
    config.params = { ...config.params, locale: (store.state as any).language.currentLanguage };

    return config;
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 403) {
            await store.dispatch('auth/logout');
            router.replace({ name: 'login' });
        } else {
            return Promise.reject(error);
        }
    },
);

export default instance;
