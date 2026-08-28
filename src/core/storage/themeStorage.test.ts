import {
    saveThemeMode,
    loadThemeMode,
    clearThemeMode,
} from './themeStorage';

describe('themeStorage', () => {
    beforeEach(() => {
        clearThemeMode();
    });

    it('defaults to system when nothing is stored', () => {
        expect(loadThemeMode()).toBe('system');
    });

    it('saves and loads theme mode correctly', () => {
        saveThemeMode('dark');
        expect(loadThemeMode()).toBe('dark');

        saveThemeMode('light');
        expect(loadThemeMode()).toBe('light');
    });
});
