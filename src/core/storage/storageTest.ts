import { storageService } from './storage';
import { STORAGE_KEYS } from './storageKeys';

export function runStorageTest(): boolean {
    const testValue = {
        name: 'Amrutam',
        version: 1,
    };

    storageService.setJson(STORAGE_KEYS.THEME, testValue);

    const result = storageService.getJson<typeof testValue>(
        STORAGE_KEYS.THEME,
    );

    storageService.remove(STORAGE_KEYS.THEME);

    return result?.name === 'Amrutam' && result?.version === 1;
}