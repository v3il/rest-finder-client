<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('emailConfirmation') }}
        </template>

        Main page
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import BasePageLayout from './BasePageLayout.vue';

@Component({
    name: 'MainPage',
    components: {
        BasePageLayout,
    },
})
export default class MainPage extends Vue {}
</script>

<style scoped></style>
