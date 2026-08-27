export type StorageValue =
    | string
    | number
    | boolean
    | null;

export interface StorageService {
    setString(key: string, value: string): void;
    getString(key: string): string | undefined;

    setNumber(key: string, value: number): void;
    getNumber(key: string): number | undefined;

    setBoolean(key: string, value: boolean): void;
    getBoolean(key: string): boolean | undefined;

    remove(key: string): void;
    contains(key: string): boolean;
    clearAll(): void;

    setJson<T>(key: string, value: T): void;
    getJson<T>(key: string): T | null;
}