<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('emailConfirmation') }}
        </template>

        <div>Email confirmation, {{ userHash }}</div>
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import BasePageLayout from './BasePageLayout.vue';

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
}
</script>

<style scoped></style>
