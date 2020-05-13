<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ isLoginAction ? translateText('login') : translateText('registration') }}
        </template>

        <div class="auth-form" :key="$route.name">
            <form class="form-signin" @submit.prevent="auth">
                <div class="form-label-group">
                    <label for="inputEmail">{{ translateText('email') }}</label>

                    <input
                        type="text"
                        id="inputEmail"
                        class="form-control"
                        :placeholder="translateText('email')"
                        v-model="userEmail"
                        autofocus
                    />
                </div>

                <div class="form-label-group">
                    <label for="inputPassword">{{ translateText('password') }}</label>

                    <input
                        type="password"
                        id="inputPassword"
                        class="form-control"
                        :placeholder="translateText('password')"
                        v-model="userPassword"
                    />

                    <small id="emailHelp" class="form-text text-muted">{{
                        translateText('passwordHint')
                    }}</small>
                </div>

                <div class="form-auth-buttons">
                    <button class="btn btn-primary btn-block" type="submit">
                        {{ isLoginAction ? translateText('logIn') : translateText('register') }}
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
                        {{ translateText('register') }}
                    </router-link>

                    <router-link :to="{ name: 'login' }" v-else>
                        {{ translateText('logIn') }}
                    </router-link>
                </div>
            </form>
        </div>
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import authService from '@/service/authService';
import GoogleAuthService from '@/service/GoogleAuthService';
import FacebookAuthService from '@/service/FacebookAuthService';
import { TokenData } from '@/index.d.ts';
import BasePageLayout from '@/views/BasePageLayout.vue';

import eventBus from '@/eventBus';

@Component({
    name: 'AuthPage',
    components: {
        BasePageLayout,
    },
})
export default class AuthPage extends Vue {
    isLoginAction = true;

    userEmail = '';

    userPassword = '';

    mounted() {
        this.isLoginAction = this.$route.name === 'login';
        this.initGoogleAuth();
    }

    async auth() {
        try {
            const requestData = {
                email: this.userEmail,
                password: this.userPassword,
            };

            if (this.isLoginAction) {
                const response = await authService.login(requestData);
                const { tokenData, userHash } = response.data;

                if (userHash) {
                    this.$router.replace({
                        name: 'email_confirmation',
                        query: { userHash },
                    });
                } else {
                    authService.saveTokenData(tokenData as TokenData);
                    this.$router.replace({ name: 'home' });
                }
            } else {
                const response = await authService.register(requestData);
                const { userHash } = response.data;

                this.$router.replace({
                    name: 'email_confirmation',
                    query: { userHash },
                });
            }
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
        }
    }

    async initGoogleAuth() {
        const instance: any = await GoogleAuthService.getInstance();

        instance.attachClickHandler(
            document.querySelector('.js-login-with-google'),
            {},
            async (googleUser: any) => {
                try {
                    const idToken = googleUser.getAuthResponse().id_token;
                    await authService.loginWithGoogle(idToken);
                    this.$router.replace({ name: 'home' });
                } catch (error) {
                    eventBus.$emit('notify-error', error.message);
                }
            },
            (error: any) => {
                eventBus.$emit('notify-error', error.message);
            },
        );
    }

    async loginWithFacebook() {
        const instance: any = FacebookAuthService.getInstance();

        instance.login(async (response: any) => {
            const { accessToken, userID: userId } = response.authResponse;
            await authService.loginWithFacebook(accessToken, userId);
            this.$router.replace({ name: 'home' });
        });
    }
}
</script>

<style scoped lang="scss">
.auth-form {
    display: flex;
    align-items: center;
    height: 100%;

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
