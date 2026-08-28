import { storageService } from './storage';
import { STORAGE_KEYS } from './storageKeys';

import type { WishlistItem } from '@/features/shop/types/shop.types';

export function saveWishlist(
    items: WishlistItem[],
): void {
    storageService.setJson(
        STORAGE_KEYS.WISHLIST,
        items,
    );
}

export function loadWishlist(): WishlistItem[] {
    return (
        storageService.getJson<WishlistItem[]>(
            STORAGE_KEYS.WISHLIST,
        ) ?? []
    );
}

export function clearStoredWishlist(): void {
    storageService.remove(
        STORAGE_KEYS.WISHLIST,
    );
}
