import { storageService } from './storage';
import type { ThemeMode } from '@/theme/theme.types';

const THEME_KEY = 'theme_mode';

const VALID_MODES: readonly ThemeMode[] = [
    'light',
    'dark',
    'system',
];

export function saveThemeMode(
    mode: ThemeMode,
): void {
    storageService.setString(
        THEME_KEY,
        mode,
    );
}

export function loadThemeMode(): ThemeMode {
    const value = storageService.getString(THEME_KEY);

    if (
        value &&
        VALID_MODES.includes(value as ThemeMode)
    ) {
        return value as ThemeMode;
    }

    return 'system';
}

export function clearThemeMode(): void {
    storageService.remove(THEME_KEY);
}
