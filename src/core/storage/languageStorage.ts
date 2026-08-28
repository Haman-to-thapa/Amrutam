import { storageService } from './storage';

import type { Language } from '@/store/slices/languageSlice';

const LANGUAGE_KEY = 'language';

export function saveLanguage(
    language: Language,
): void {
    storageService.setString(
        LANGUAGE_KEY,
        language,
    );
}

export function loadLanguage(): Language {
    const value = storageService.getString(
        LANGUAGE_KEY,
    );

    return value === 'hi' ? 'hi' : 'en';
}
