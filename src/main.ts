import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from './router';
import App from './App.vue';

library.add(faGoogle, faFacebookF);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        uSign(signId, defaultValue, replacements = []) {
            let sign = defaultValue;

            replacements.forEach((replacement: string[]) => {
                sign = sign.replace('%s', replacement);
            });

            return sign;
        },
    },
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
