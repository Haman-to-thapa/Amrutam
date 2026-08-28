import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import {
    useColorScheme,
} from 'react-native';

import {
    loadThemeMode,
    saveThemeMode,
} from '@/core/storage/themeStorage';

import {
    useAppDispatch,
    useAppSelector,
} from '@/store/hooks';

import {
    hydrateTheme,
    setThemeMode,
} from '@/store/slices/themeSlice';

import { resolveTheme } from '@/theme/theme';

import type {
    AppTheme,
    ThemeMode,
} from '@/theme/theme.types';

type ThemeContextValue = {
    theme: AppTheme;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
};

const ThemeContext =
    createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
    children,
}: React.PropsWithChildren) {
    const dispatch = useAppDispatch();

    const systemScheme = useColorScheme();

    const mode = useAppSelector(
        state => state.theme.mode,
    );

    const hydrated = useAppSelector(
        state => state.theme.hydrated,
    );

    useEffect(() => {
        if (hydrated) {
            return;
        }

        dispatch(
            hydrateTheme(loadThemeMode()),
        );
    }, [dispatch, hydrated]);

    const setMode = useCallback(
        (nextMode: ThemeMode) => {
            saveThemeMode(nextMode);
            dispatch(setThemeMode(nextMode));
        },
        [dispatch],
    );

    const theme = useMemo(
        () =>
            resolveTheme(
                hydrated ? mode : 'system',
                systemScheme,
            ),
        [hydrated, mode, systemScheme],
    );

    const value = useMemo(
        () => ({
            theme,
            mode,
            setMode,
        }),
        [theme, mode, setMode],
    );


    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useAppTheme() {
    const context =
        useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useAppTheme must be used inside ThemeProvider',
        );
    }

    return context;
}
