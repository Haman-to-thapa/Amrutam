import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from 'react';

import i18n from '@/core/i18n/i18n';
import {
    loadLanguage,
    saveLanguage,
} from '@/core/storage/languageStorage';

import {
    useAppDispatch,
    useAppSelector,
} from '@/store/hooks';

import {
    hydrateLanguage,
    setLanguage,
    type Language,
} from '@/store/slices/languageSlice';

type LanguageContextValue = {
    language: Language;
    changeLanguage: (
        language: Language,
    ) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(
    null,
);

export function LanguageProvider({
    children,
}: React.PropsWithChildren) {
    const dispatch = useAppDispatch();

    const language = useAppSelector(
        state => state.language.language,
    );

    const hydrated = useAppSelector(
        state => state.language.hydrated,
    );

    useEffect(() => {
        if (hydrated) {
            return;
        }

        const stored = loadLanguage();

        dispatch(hydrateLanguage(stored));

        i18n.changeLanguage(stored).catch(() => {
            // fallback
        });
    }, [dispatch, hydrated]);

    const changeLanguage = useCallback(
        (nextLanguage: Language) => {
            saveLanguage(nextLanguage);
            dispatch(setLanguage(nextLanguage));
            i18n.changeLanguage(nextLanguage).catch(() => {
                // fallback
            });
        },
        [dispatch],
    );

    const value = useMemo(
        () => ({
            language,
            changeLanguage,
        }),
        [language, changeLanguage],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}


export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            'useLanguage must be used inside LanguageProvider',
        );
    }

    return context;
}
