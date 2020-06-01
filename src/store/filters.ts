import { FiltersData } from '@/index.d';
import eventBus from '@/eventBus';
import axios from '../axios';

export default {
    namespaced: true,

    state: {
        filters: {
            categories: [],
            costs: [],
            restDurations: [],
            companySizes: [],
        },

        dataLoading: false,
        dataLoaded: false,
    },

    mutations: {
        SET_FILTERS_DATA(state: any, filters: FiltersData) {
            state.filters = filters;
        },

        SET_LOADING_STATE(state: any, payload: boolean) {
            state.dataLoading = payload;
        },
    },

    actions: {
        async loadFilters(context: any) {
            if (context.state.filters.categories.length) {
                return;
            }

            context.commit('SET_LOADING_STATE', true);

            try {
                const response = await axios.get('/filters');
                const filters = response.data;

                filters.categories = filters.categories.map((category: any, index: number) => {
                    return { ...category, isSelected: index === 0 };
                });

                context.commit('SET_FILTERS_DATA', filters);
            } catch (error) {
                eventBus.$emit('notify-error', error.response.data.error);
            }

            context.commit('SET_LOADING_STATE', false);
        },
    },
};
