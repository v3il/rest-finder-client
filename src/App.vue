<template>
    <div id="app">
        <router-view :key="$route.fullPath" />
    </div>
</template>

<style lang="scss">
@import '../node_modules/flag-icon-css/css/flag-icon.css';
@import '../node_modules/vue-slider-component/theme/antd.css';

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.vue-slider-process {
    background-color: #007bff;
}

.vue-slider-dot-handle {
    border-color: #007bff;
}
</style>
