const languageLocalStorageKey = 'rest_finder_language';
const availableLanguages = ['ua', 'ru'];
const defaultLanguage = 'ua';

class LanguageService {
    private currentLanguage: string = defaultLanguage;

    constructor() {
        const language = localStorage.getItem(languageLocalStorageKey);

        if (language && availableLanguages.includes(language)) {
            this.currentLanguage = language;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return availableLanguages;
    }

    setCurrentLanguage(language: string) {
        this.currentLanguage = language;
        this.saveLocale(language);
    }

    private saveLocale(locale: string) {
        localStorage.setItem(languageLocalStorageKey, locale);
    }
}

export default new LanguageService();
