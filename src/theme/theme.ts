import type { ColorSchemeName } from 'react-native';

import { darkTheme, lightTheme } from './colors';
import type { AppTheme, ThemeMode } from './theme.types';

export function resolveTheme(
    mode: ThemeMode,
    systemScheme: ColorSchemeName | null | undefined,
): AppTheme {
    if (mode === 'dark') {
        return darkTheme;
    }


    if (mode === 'light') {
        return lightTheme;
    }

    return systemScheme === 'dark'
        ? darkTheme
        : lightTheme;
}
