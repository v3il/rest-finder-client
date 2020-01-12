<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('resetPasswordPageTitle') }}
        </template>

        <div class="reset-password">
            <form class="reset-password-form" @submit.prevent="resetPassword">
                <div class="form-group">
                    <label for="user-email">{{ translateText('yourEmail') }}</label>

                    <input
                        type="text"
                        class="form-control"
                        id="user-email"
                        v-model="userEmail"
                        required
                    />
                </div>

                <div class="reset-password__actions">
                    <button class="btn btn-primary left-button" type="submit">
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
import axios from '@/axios';
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
    userEmail = '';

    @authModule.Action('login') login!: Function;

    @authModule.Action('register') register!: Function;

    @authModule.Action('loginWithGoogle') loginWithGoogle!: Function;

    @authModule.Action('loginWithFacebook') loginWithFacebook!: Function;

    @authModule.Mutation('SET_TOKEN') setToken!: Function;

    async resetPassword() {
        try {
            await axios.post('/user/reset_password', { email: this.userEmail });
            eventBus.$emit('notify-success', this.translateText('resetPasswordNotification'));
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
        }
    }
}
</script>

<style scoped lang="scss">
.reset-password {
    display: flex;
    align-items: center;
    height: 100%;
}

.reset-password-form {
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

.reset-password__actions {
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
