import Vue from 'vue';
import Vuex from 'vuex';

import language from './language';
import auth from './auth';
import user from './user';
import filters from './filters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        language,
        auth,
        user,
        filters,
    },
});

export default store;
