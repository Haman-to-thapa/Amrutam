import { storageService } from './storage';
import { STORAGE_KEYS } from './storageKeys';

import type { CartItem } from '@/features/shop/types/shop.types';

export function saveCart(items: CartItem[]): void {
    storageService.setJson(
        STORAGE_KEYS.CART,
        items,
    );
}

export function loadCart(): CartItem[] {
    return (
        storageService.getJson<CartItem[]>(
            STORAGE_KEYS.CART,
        ) ?? []
    );
}

export function clearStoredCart(): void {
    storageService.remove(STORAGE_KEYS.CART);
}
