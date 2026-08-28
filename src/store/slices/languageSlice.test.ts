import languageReducer, {
    setLanguage,
    hydrateLanguage,
} from './languageSlice';

describe('languageSlice', () => {
    it('should return initial state', () => {
        const state = languageReducer(undefined, { type: 'unknown' });
        expect(state).toEqual({
            language: 'en',
            hydrated: false,
        });
    });

    it('should handle setLanguage', () => {
        const state = languageReducer(
            { language: 'en', hydrated: true },
            setLanguage('hi'),
        );
        expect(state.language).toBe('hi');
    });

    it('should handle hydrateLanguage', () => {
        const state = languageReducer(
            { language: 'en', hydrated: false },
            hydrateLanguage('hi'),
        );
        expect(state.language).toBe('hi');
        expect(state.hydrated).toBe(true);
    });
});
