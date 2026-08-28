import { useEffect } from 'react';

import { useAppSelector } from '@/store/hooks';
import { saveWishlist } from '@/core/storage/wishlistStorage';

export function useWishlistPersistence() {
    const items = useAppSelector(
        state => state.wishlist.items,
    );

    const hydrated = useAppSelector(
        state => state.wishlist.hydrated,
    );

    useEffect(() => {
        if (!hydrated) {
            return;
        }

        saveWishlist(items);
    }, [items, hydrated]);
}
