import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { hi } from './locales/hi';

export const resources = {
    en: {
        translation: en,
    },
    hi: {
        translation: hi,
    },
} as const;

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
