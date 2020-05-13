<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('emailConfirmation') }}
        </template>

        <div class="confirm-page">
            <p class="confirm-page__message" v-html="translateText('thanksForRegistration')"></p>

            <div class="confirm-page__buttons">
                <button class="btn btn-primary" type="button" @click="checkConfirmation">
                    {{ translateText('checkConfirmation') }}
                </button>

                <button class="btn btn-secondary" type="button" @click="sendEmailAgain">
                    {{ translateText('sendEmailAgain') }}
                </button>
            </div>

            <router-link class="confirm-page__back-to-login" :to="{ name: 'login' }">{{
                translateText('backToLoginPage')
            }}</router-link>
        </div>
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import eventBus from '@/eventBus';
import authService from '@/service/authService';
import { TokenData } from '@/index.d';
import BasePageLayout from './BasePageLayout.vue';

import axios from '../axios';

@Component({
    name: 'EmailConfirmationPage',
    components: {
        BasePageLayout,
    },
})
export default class EmailConfirmationPage extends Vue {
    userHash = '';

    created() {
        this.userHash = this.$route.query.userHash as string;
    }

    async checkConfirmation() {
        try {
            const response = await axios.get(`/auth/check_verification/${this.userHash}`);
            const { tokenData } = response.data;

            if (tokenData) {
                authService.saveTokenData(tokenData as TokenData);
                this.$router.replace({ name: 'home' });
            } else {
                eventBus.$emit('notify-error', this.translateText('emailIsNotConfirmed'));
            }
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
        }
    }

    async sendEmailAgain() {
        try {
            const response = await axios.post(`/auth/resend_confirmation/${this.userHash}`);
            const { userHash } = response.data;

            this.userHash = userHash;

            eventBus.$emit('notify-success', this.translateText('emailHasBeenSentAgain'));
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
        }
    }
}
</script>

<style scoped lang="scss">
.confirm-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 60px 12px;

    &__message {
        text-align: center;
    }

    &__buttons {
        display: flex;
        justify-content: center;
        margin: 24px 0;
    }

    &__buttons .btn {
        margin: 0 6px;
    }

    &__back-to-login {
        display: block;
        text-align: center;
    }
}
</style>
