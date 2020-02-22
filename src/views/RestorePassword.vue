<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('resetPasswordPageTitle') }}
        </template>

        <div class="auth-form">
            <form class="form-signin" @submit.prevent="auth">
                <div class="form-group">
                    <label for="user-email">{{ translateText('email') }}</label>

                    <input
                        type="text"
                        class="form-control"
                        id="user-email"
                        v-model="restorePasswordUserEmail"
                    />
                </div>

                <div>
                    <button class="btn btn-primary left-button" @click="resetPasswordRequest">
                        {{ translateText('resetPasswordButtonTitle') }}
                    </button>

                    <button class="btn btn-secondary" @click="$router.push({ name: 'login' })">
                        {{ translateText('logIn') }}
                    </button>
                </div>
            </form>
        </div>
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import GoogleAuthService from '@/service/GoogleAuthService';
import FacebookAuthService from '@/service/FacebookAuthService';
import BasePageLayout from '@/views/BasePageLayout.vue';

import eventBus from '@/eventBus';
import { namespace } from 'vuex-class';
import VDialog from '@/components/VDialog.vue';
import { Ref } from 'vue-property-decorator';

const authModule = namespace('auth');

@Component({
    name: 'RestorePassword',
    components: {
        BasePageLayout,
        VDialog,
    },
})
export default class AuthPage extends Vue {
    isLoginAction = true;

    userEmail = '';

    userPassword = '';

    restorePasswordUserEmail = '';

    @authModule.Action('login') login!: Function;

    @authModule.Action('register') register!: Function;

    @authModule.Action('loginWithGoogle') loginWithGoogle!: Function;

    @authModule.Action('loginWithFacebook') loginWithFacebook!: Function;

    @authModule.Mutation('SET_TOKEN') setToken!: Function;

    @Ref() resetPasswordDialog!: any;

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
                const response = await this.login(requestData);
                const { tokenData, userHash } = response.data;

                if (userHash) {
                    this.$router.replace({
                        name: 'email_confirmation',
                        query: { userHash },
                    });
                } else {
                    this.setToken(tokenData);
                    this.$router.replace({ name: 'home' });
                }
            } else {
                const response = await this.register(requestData);
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

                    await this.loginWithGoogle(idToken);
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

    async loginWithFB() {
        const instance: any = FacebookAuthService.getInstance();

        instance.login(async (response: any) => {
            const { accessToken, userID: userId } = response.authResponse;

            await this.loginWithFacebook({
                accessToken,
                userId,
            });

            this.$router.replace({ name: 'home' });
        });
    }

    resetPassword() {
        console.log(1);
    }

    async resetPasswordRequest() {
        return 0;
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

.form-auth-reset-password {
    margin-top: 6px;
}
</style>
