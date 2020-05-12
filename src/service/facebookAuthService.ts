class FacebookAuthService {
    // constructor() {
    //     window.FB.init({
    //         appId: process.env.VUE_APP_FACEBOOK_CLIENT_ID,
    //         cookie: true,
    //         xfbml: true,
    //         version: 'v6.0',
    //     });
    // }

    getInstance() {
        return window.FB;
    }
}

export default new FacebookAuthService();
