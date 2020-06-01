import Vue from 'vue';

import '../node_modules/leaflet/dist/leaflet';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faStar, faTrash, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import translateText from '@/translateTextMixin';

import router from './router';
import store from './store';
import App from './App.vue';

library.add(faGoogle, faFacebookF, faStar, faTrash, faPen, faCheck);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.mixin({
    methods: { translateText },
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
