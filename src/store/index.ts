import Vue from 'vue';
import Vuex from 'vuex';

import language from './language';
import auth from './auth';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        language,
        auth,
    },
});

export default store;
