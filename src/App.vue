<template>
    <div id="app">
        <router-view :key="$route.fullPath" />
    </div>
</template>

<style lang="scss">
@import '../node_modules/flag-icon-css/css/flag-icon.css';
</style>
