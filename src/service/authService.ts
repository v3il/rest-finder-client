import { TokenData } from '@/index.d.ts';
import axios from '../axios';

import GoogleAuthService from './GoogleAuthService';
import FacebookAuthService from './FacebookAuthService';

const tokenLocalStorageKey = 'rest_finder_token';

class AuthService {
    private tokenData: TokenData | null = null;

    constructor() {
        const data = localStorage.getItem(tokenLocalStorageKey);

        if (data) {
            try {
                this.tokenData = JSON.parse(data);
            } catch (error) {
                this.tokenData = null;
            }
        }
    }

    getToken() {
        return this.tokenData?.token;
    }

    isAuthorized() {
        return this.tokenData ? this.tokenData.expires * 1000 > Date.now() : false;
    }

    login(user: object) {
        return this.authRequest('/auth/local', user);
    }

    register(user: object) {
        return this.authRequest('/auth/register', user);
    }

    loginWithGoogle(googleIdToken: string) {
        return this.authRequest('/auth/google', { token: googleIdToken });
    }

    loginWithFacebook(accessToken: string, userId: string) {
        return this.authRequest('/auth/facebook', { accessToken, userId });
    }

    async logout() {
        this.tokenData = null;
        localStorage.removeItem(tokenLocalStorageKey);

        (await GoogleAuthService.getInstance()).disconnect();
        await FacebookAuthService.getInstance().logout();
    }

    private async authRequest(url: string, data: object) {
        const response = await axios.post(url, data);
        const { tokenData } = response.data;

        this.tokenData = tokenData;
        localStorage.setItem(tokenLocalStorageKey, JSON.stringify(tokenData));
    }
}

export default new AuthService();
