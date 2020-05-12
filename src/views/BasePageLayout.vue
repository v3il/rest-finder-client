<template>
    <div class="page-layout">
        <header class="page-layout__header">
            <nav class="navbar navbar-dark bg-dark">
                <h1 class="navbar-brand">
                    <slot name="pageTitle"></slot>
                </h1>
            </nav>
        </header>

        <main class="page-layout__main">
            <slot></slot>

            <div class="page-layout__language-switcher">
                <span
                    v-for="(language, index) in languages"
                    :key="index"
                    :class="[
                        `flag-icon-${language}`,
                        { 'flag-icon-disabled': currentLanguage === language },
                    ]"
                    class="flag-icon"
                    @click="switchLanguage(language)"
                ></span>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import languageService from '@/service/languageService';

@Component({
    name: 'BasePageLayout',
})
export default class BasePageLayout extends Vue {
    currentLanguage: string = languageService.getCurrentLanguage();

    languages: string[] = languageService.getAvailableLanguages();

    switchLanguage(language: string) {
        if (language !== this.currentLanguage) {
            this.currentLanguage = language;
            languageService.setCurrentLanguage(language);

            this.$router.go(0);
        }
    }
}
</script>

<style scoped lang="scss">
.page-layout {
    &__language-switcher {
        position: fixed;
        right: 10px;
        bottom: 10px;
        display: flex;
        flex-direction: column;
        padding: 6px;
        border-radius: 20px;
        background-color: rgb(232, 240, 254);
    }

    &__main {
        height: calc(100vh - 64px);
    }
}

.flag-icon {
    cursor: pointer;
    width: 30px;
    height: 30px;
    background-size: cover;
    margin: 6px 0;
    border-radius: 50%;
    border: 2px solid #007bff !important;
}

.flag-icon-disabled {
    opacity: 0.7;
    cursor: default;
    filter: brightness(0.5);
}
</style>
