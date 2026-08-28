import themeReducer, {
    setThemeMode,
    hydrateTheme,
} from './themeSlice';

describe('themeSlice', () => {
    it('handles hydrateTheme', () => {
        const state = themeReducer(
            { mode: 'system', hydrated: false },
            hydrateTheme('dark'),
        );

        expect(state.hydrated).toBe(true);
        expect(state.mode).toBe('dark');
    });

    it('handles setThemeMode', () => {
        const state = themeReducer(
            { mode: 'light', hydrated: true },
            setThemeMode('dark'),
        );

        expect(state.mode).toBe('dark');
    });
});
