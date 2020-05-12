export default class GoogleAuthService {
    private static instance?: object;

    static async getInstance(): Promise<any> {
        if (this.instance) {
            return Promise.resolve(this.instance);
        }

        return new Promise((resolve) => {
            window.gapi.load('auth2', () => {
                this.instance = window.gapi.auth2.init({
                    // eslint-disable-next-line
                    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
                });

                resolve(this.instance);
            });
        });
    }
}
