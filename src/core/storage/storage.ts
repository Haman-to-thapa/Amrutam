import { createMMKV } from 'react-native-mmkv';
import type { StorageService } from './storage.types';

const storage = createMMKV({
    id: 'amrutam-storage',
});

export const storageService: StorageService = {
    setString(key: string, value: string) {
        storage.set(key, value);
    },

    getString(key: string) {
        return storage.getString(key);
    },

    setNumber(key: string, value: number) {
        storage.set(key, value);
    },

    getNumber(key: string) {
        return storage.getNumber(key);
    },

    setBoolean(key: string, value: boolean) {
        storage.set(key, value);
    },

    getBoolean(key: string) {
        return storage.getBoolean(key);
    },

    remove(key: string) {
        storage.remove(key);
    },



    contains(key: string) {
        return storage.contains(key);
    },

    clearAll() {
        storage.clearAll();
    },

    setJson<T>(key: string, value: T) {
        storage.set(key, JSON.stringify(value));
    },

    getJson<T>(key: string) {
        const value = storage.getString(key);

        if (!value) {
            return null;
        }

        try {
            return JSON.parse(value) as T;
        } catch {
            return null;
        }
    },
};