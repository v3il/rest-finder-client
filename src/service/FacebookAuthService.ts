class FacebookAuthService {
    private static instance?: object;

    static getInstance(): any {
        if (this.instance) {
            return this.instance;
        }

        window.FB.init({
            appId: process.env.VUE_APP_FACEBOOK_CLIENT_ID,
            cookie: true,
            xfbml: true,
            version: 'v6.0',
        });

        this.instance = window.FB;

        return this.instance;
    }
}

export default FacebookAuthService;
