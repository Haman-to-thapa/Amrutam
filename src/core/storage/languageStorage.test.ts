import { loadLanguage, saveLanguage } from './languageStorage';
import { storageService } from './storage';

describe('languageStorage', () => {
    afterEach(() => {
        storageService.clearAll();
    });

    it('should default to en when no stored language', () => {
        expect(loadLanguage()).toBe('en');
    });

    it('should save and load language correctly', () => {
        saveLanguage('hi');
        expect(loadLanguage()).toBe('hi');

        saveLanguage('en');
        expect(loadLanguage()).toBe('en');
    });
});
