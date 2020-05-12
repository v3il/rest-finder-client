<template>
    <div class="auth-form" :key="$route.name">
        <form class="form-signin" @submit.prevent="auth">
            <div class="text-center mb-4">
                <h1 class="h3 mb-3 font-weight-normal">
                    {{
                        isLoginAction
                            ? uSign('translate', 'Вход на сайт')
                            : uSign('translate', 'Регистрация')
                    }}
                </h1>
            </div>

            <div class="form-label-group">
                <label for="inputEmail">{{ uSign('translate', 'Email') }}</label>

                <input
                    type="text"
                    id="inputEmail"
                    class="form-control"
                    :placeholder="uSign('translate', 'Email')"
                    v-model="userEmail"
                    autofocus
                />
            </div>

            <div class="form-label-group">
                <label for="inputPassword">{{ uSign('translate', 'Пароль') }}</label>

                <input
                    type="password"
                    id="inputPassword"
                    class="form-control"
                    :placeholder="uSign('translate', 'Пароль')"
                    v-model="userPassword"
                />
            </div>

            <div class="alert alert-danger" role="alert" v-if="authError">{{ authError }}</div>

            <div class="form-auth-buttons">
                <button class="btn btn-primary btn-block" type="submit">
                    {{
                        isLoginAction
                            ? uSign('translate', 'Войти')
                            : uSign('translate', 'Зарегистрироваться')
                    }}
                </button>

                <button class="btn btn-primary js-login-with-google" type="button">
                    <font-awesome-icon :icon="['fab', 'google']" />
                </button>

                <button class="btn btn-primary" type="button" @click="loginWithFacebook">
                    <font-awesome-icon :icon="['fab', 'facebook-f']" />
                </button>
            </div>

            <div class="text-center auth-form__register-link">
                <router-link :to="{ name: 'register' }" v-if="isLoginAction">
                    {{ uSign('translate', 'Зарегистрироваться') }}
                </router-link>

                <router-link :to="{ name: 'login' }" v-else>
                    {{ uSign('translate', 'Войти') }}
                </router-link>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';

import authService from '@/service/authService';
// import googleAuthService from '@/service/googleAuthService';
// import facebookAuthService from '@/service/facebookAuthService';

@Component({
    name: 'AuthPage',
})
export default class AuthPage extends Vue {
    isLoginAction = true;

    userEmail = '';

    userPassword = '';

    authError = '';

    mounted() {
        this.isLoginAction = this.$route.name === 'login';
        this.initGoogleAuth();
    }

    async auth() {
        try {
            this.authError = '';

            const requestData = {
                email: this.userEmail,
                password: this.userPassword,
            };

            if (this.isLoginAction) {
                await authService.login(requestData);
            } else {
                await authService.register(requestData);
            }

            this.$router.replace({ name: 'home' });
        } catch (error) {
            console.error(error);
            this.authError = error.response.data.error;
        }
    }

    async initGoogleAuth() {
        // const instance = (await googleAuthService.getInstance()) as any;
        //
        // instance.attachClickHandler(
        //     document.querySelector('.js-login-with-google'),
        //     {},
        //     async (googleUser: any) => {
        //         try {
        //             const idToken = googleUser.getAuthResponse().id_token;
        //             await authService.loginWithGoogle(idToken);
        //             this.$router.replace({ name: 'home' });
        //         } catch (error) {
        //             this.authError = error.message;
        //         }
        //     },
        //     (error: any) => {
        //         this.authError = error.message;
        //     },
        // );
    }

    async loginWithFacebook() {
        // const fb = facebookAuthService.getInstance();
        // fb.login(async (response: any) => {
        //     const { accessToken } = response.authResponse;
        //     const userId = response.authResponse.userID;
        //     await authService.loginWithFacebook(accessToken, userId);
        //     this.$router.replace({ name: 'home' });
        // });
    }
}
</script>

<style scoped lang="scss">
.auth-form {
    display: flex;
    align-items: center;
    min-height: 100vh;

    &__register-link {
        margin-top: 12px;
    }
}

.form-signin {
    width: 100%;
    max-width: 420px;
    padding: 15px;
    margin: auto;
}

.form-label-group {
    position: relative;
    margin-bottom: 1rem;
}

.form-label-group > label {
    font-weight: bold;
}

.form-auth-buttons {
    display: flex;

    .btn {
        margin-right: 9px;
        min-width: 50px;
    }

    .btn:last-child {
        margin-right: 0;
    }
}
</style>
