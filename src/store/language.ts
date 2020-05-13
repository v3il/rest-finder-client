const languageLocalStorageKey = 'rest_finder_language';
const availableLanguages = ['ua', 'ru'];
const defaultLanguage = 'ua';

function getLocaleFromLocalStorage(): string {
    const language = localStorage.getItem(languageLocalStorageKey) || '';
    return availableLanguages.includes(language) ? language : defaultLanguage;
}

export default {
    namespaced: true,

    state: {
        currentLanguage: getLocaleFromLocalStorage(),
        availableLanguages,
    },

    mutations: {
        SET_LANGUAGE(state: any, payload: string) {
            state.currentLanguage = payload;
        },
    },

    actions: {
        setCurrentLanguage(context: any, language: string) {
            localStorage.setItem(languageLocalStorageKey, language);
            context.commit('SET_LANGUAGE', language);
        },
    },
};
