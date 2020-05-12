import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import languageService from '@/service/languageService';
import router from './router';
import App from './App.vue';

const ru = require('./translations/ru.json');
const ua = require('./translations/ua.json');

library.add(faGoogle, faFacebookF);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        translateText(textId: string, replacements: (string | number)[] = []): string {
            const locale = languageService.getCurrentLanguage();

            const idsParts = textId.split('.');
            const lastIdPart = idsParts.pop() || '';

            let storage = locale === 'ru' ? ru : ua;

            // eslint-disable-next-line no-restricted-syntax
            for (const idPart of idsParts) {
                const innerStorage = storage[idPart];

                if (!(innerStorage && typeof innerStorage === 'object')) {
                    return `No text with id: ${textId}`;
                }

                storage = innerStorage;
            }

            let text = storage[lastIdPart];

            if (!text) {
                return `No text with id: ${textId}`;
            }

            replacements.forEach((replacement) => {
                text = text.replace('%s', replacement.toString());
            });

            return text;
        },
    },
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
