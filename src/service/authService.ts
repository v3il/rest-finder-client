import axios from '../axios';

import googleAuthService from './googleAuthService';
import facebookAuthService from './facebookAuthService';

const tokenLocalStorageKey = 'rest_finder_token';
const userLocalStorageKey = 'rest_finder_user';

class AuthService {
    tokenData: any;

    userData: any;

    constructor() {
        try {
            this.tokenData = JSON.parse(localStorage.getItem(tokenLocalStorageKey) || '') || {};
            this.userData = JSON.parse(localStorage.getItem(userLocalStorageKey) || '') || {};
        } catch (error) {
            this.tokenData = {};
            this.userData = {};
        }
    }

    _saveData(tokenData: object, userData: object) {
        this.tokenData = tokenData;
        this.userData = userData;

        localStorage.setItem(tokenLocalStorageKey, JSON.stringify(tokenData));
        localStorage.setItem(userLocalStorageKey, JSON.stringify(userData));
    }

    _removeData() {
        this.tokenData = {};
        this.userData = {};

        localStorage.removeItem(tokenLocalStorageKey);
        localStorage.removeItem(userLocalStorageKey);
    }

    getUser() {
        return this.userData;
    }

    getToken() {
        return this.tokenData.token;
    }

    isAuthorized() {
        return this.tokenData.expires && this.tokenData.expires * 1000 > Date.now();
    }

    login(user: object) {
        return this._authRequest('/login/local', user);
    }

    register(user: object) {
        return this._authRequest('/register', user);
    }

    loginWithGoogle(googleIdToken: string) {
        return this._authRequest('/login/google', { token: googleIdToken });
    }

    loginWithFacebook(accessToken: string, userId: string) {
        return this._authRequest('/login/facebook', { accessToken, userId });
    }

    async logout() {
        this._removeData();

        const instance = (await googleAuthService.getInstance()) as any;
        instance.disconnect();

        const facebookInstance = facebookAuthService.getInstance() as any;
        facebookInstance.logout();
    }

    async _authRequest(url: string, data: object) {
        const response = await axios.post(url, data);
        const { tokenData, userData } = response.data;

        this._saveData(tokenData, userData);
    }
}

export default new AuthService();
