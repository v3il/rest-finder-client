<template>
    <div class="page-layout">
        <header class="page-layout__header">
            <nav class="navbar navbar-dark bg-dark">
                <h1 class="navbar-brand">
                    <slot name="pageTitle"></slot>
                </h1>

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
            </nav>
        </header>

        <main class="page-layout__main">
            <slot></slot>

            <transition name="fade">
                <div
                    class="page-layout__error alert"
                    :class="[errorData.status === 'success' ? 'alert-success' : 'alert-danger']"
                    v-if="errorData"
                >
                    {{ errorData.message }}
                </div>
            </transition>
        </main>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import languageService from '@/service/languageService';
import eventBus from '@/eventBus';
import { NotificationData } from '@/index.d';

@Component({
    name: 'BasePageLayout',
})
export default class BasePageLayout extends Vue {
    currentLanguage: string = languageService.getCurrentLanguage();

    languages: string[] = languageService.getAvailableLanguages();

    errorData: NotificationData | null = null;

    timeoutId = 0;

    mounted() {
        eventBus.$on('notify-success', (message: string) => {
            this.success(message);
        });

        eventBus.$on('notify-error', (message: string) => {
            this.error(message);
        });

        this.$on('hook:beforeDestroy', () => {
            eventBus.$off('notify-success');
            eventBus.$off('notify-error');
        });
    }

    switchLanguage(language: string) {
        if (language !== this.currentLanguage) {
            this.currentLanguage = language;
            languageService.setCurrentLanguage(language);

            this.$router.go(0);
        }
    }

    success(message: string) {
        this.showNotification({
            message,
            status: 'success',
        });
    }

    error(message: string) {
        this.showNotification({
            message,
            status: 'error',
        });
    }

    private showNotification(data: NotificationData) {
        this.errorData = data;

        clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
            this.errorData = null;
        }, 5000);
    }
}
</script>

<style scoped lang="scss">
.page-layout {
    &__language-switcher {
        right: 10px;
        top: 80px;
        display: flex;
        padding: 3px;
        border-radius: 20px;
    }

    &__main {
        height: calc(100vh - 64px);
    }

    &__error {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px 24px;
        margin: 0;
        border-radius: 0;
    }
}

.flag-icon {
    cursor: pointer;
    width: 30px;
    height: 30px;
    background-size: cover;
    border-radius: 50%;
    border: 2px solid rgb(232, 240, 254);
}

.flag-icon:last-child {
    margin-left: 6px;
}

.flag-icon-disabled {
    opacity: 0.7;
    cursor: default;
    filter: brightness(0.5);
}
</style>
