<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('placesSearch') }}
        </template>

        Main page

        {{ user }}
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { UserPublicData } from '@/index.d';
import BasePageLayout from './BasePageLayout.vue';

const userModule = namespace('user');

@Component({
    name: 'MainPage',
    components: {
        BasePageLayout,
    },
})
export default class MainPage extends Vue {
    @userModule.State('user') user!: UserPublicData | null;

    @userModule.State('userDataLoading') userDataLoading!: boolean;

    @userModule.Action('loadUserData') loadUserData!: Function;

    created() {
        this.loadUserData();
    }
}
</script>

<style scoped></style>
