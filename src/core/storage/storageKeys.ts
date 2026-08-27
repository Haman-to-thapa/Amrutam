export const STORAGE_KEYS = {
    CART: 'cart',
    WISHLIST: 'wishlist',
    OFFLINE_QUEUE: 'offline_queue',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const;

export type StorageKey =
    (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];