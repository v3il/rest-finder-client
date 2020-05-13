import { TokenData } from '@/index.d';
import axios from '@/axios';
import GoogleAuthService from '@/service/GoogleAuthService';
import FacebookAuthService from '@/service/FacebookAuthService';

const tokenLocalStorageKey = 'rest_finder_token';

function getTokenFromLocalStorage(): TokenData | null {
    const data = localStorage.getItem(tokenLocalStorageKey);

    if (data) {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
        }
    }

    return null;
}

export default {
    namespaced: true,

    state: {
        tokenData: getTokenFromLocalStorage(),
    },

    getters: {
        isAuthorized(state: any) {
            return state.tokenData ? state.tokenData.expires * 1000 > Date.now() : false;
        },
    },

    mutations: {
        SET_TOKEN(state: any, payload: TokenData | null) {
            state.tokenData = payload;
            localStorage.setItem(tokenLocalStorageKey, JSON.stringify(payload));
        },
    },

    actions: {
        login(context: any, user: object) {
            return axios.post('/auth/local', user);
        },

        register(context: any, user: object) {
            return axios.post('/auth/register', user);
        },

        async loginWithGoogle(context: any, googleIdToken: string) {
            const response = await axios.post('/auth/google', { token: googleIdToken });
            const { tokenData } = response.data;

            context.commit('SET_TOKEN', tokenData);
        },

        async loginWithFacebook(context: any, payload: object) {
            const response = await axios.post('/auth/facebook', payload);
            const { tokenData } = response.data;

            context.commit('SET_TOKEN', tokenData);
        },

        async logout(context: any) {
            localStorage.removeItem(tokenLocalStorageKey);

            try {
                (await GoogleAuthService.getInstance()).disconnect();
                await FacebookAuthService.getInstance().logout();
            } catch (error) {
                console.log(error);
            }

            context.commit('SET_TOKEN', null);
        },
    },
};
