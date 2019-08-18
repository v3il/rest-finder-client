<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('resetPasswordPageTitle') }}
        </template>

        <div class="reset-password">
            <form class="reset-password-form" @submit.prevent="changePassword">
                <div class="form-group">
                    <label for="new-password">{{ translateText('yourEmail') }}</label>

                    <input
                        type="password"
                        class="form-control"
                        id="new-password"
                        v-model="newPassword"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="new-password-confirmation">{{ translateText('yourEmail') }}</label>

                    <input
                        type="password"
                        class="form-control"
                        id="new-password-confirmation"
                        v-model="newPasswordConfirmation"
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
import BasePageLayout from '@/views/BasePageLayout.vue';

import eventBus from '@/eventBus';
import axios from '@/axios';

@Component({
    name: 'SetNewPassword',
    components: {
        BasePageLayout,
    },
})
export default class SetNewPassword extends Vue {
    newPassword = '';

    newPasswordConfirmation = '';

    async changePassword() {
        try {
            // await axios.post('/user/reset_password', { email: this.userEmail });
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
