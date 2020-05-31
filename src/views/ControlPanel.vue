<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('controlPanel') }}
        </template>

        <template slot="topMenu">
            <button class="btn btn-success btn-sm" @click="$router.push('/')">
                {{ translateText('backToSite') }}
            </button>
        </template>

        Control panel
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import eventBus from '@/eventBus';
import { namespace } from 'vuex-class';
import BasePageLayout from './BasePageLayout.vue';

import axios from '../axios';

const authModule = namespace('auth');

@Component({
    name: 'EmailConfirmationPage',
    components: {
        BasePageLayout,
    },
})
export default class EmailConfirmationPage extends Vue {}
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
