<template>
    <div id="app">
        <router-view :key="$route.fullPath" />
    </div>
</template>

<style lang="scss">
@import '../node_modules/flag-icon-css/css/flag-icon.css';
@import '../node_modules/vue-slider-component/theme/antd.css';

.fade3-enter-active,
.fade3-leave-active {
    transition: opacity 0.3s;
}
.fade3-enter,
.fade3-leave-to {
    opacity: 0;
}

.vue-slider-process {
    background-color: #007bff;
}

.vue-slider-dot-handle {
    border-color: #007bff;
}

.bold-label {
    display: block;
    color: #686a6e;
    font-weight: 700;
    font-size: 0.9em;
}

.left-button {
    margin-right: 12px;
}
</style>
