import { useEffect } from 'react';

import { saveCart } from '@/core/storage/cartStorage';
import { useAppSelector } from '@/store/hooks';

export function useCartPersistence() {
    const items = useAppSelector(
        state => state.cart.items,
    );

    const hydrated = useAppSelector(
        state => state.cart.hydrated,
    );

    useEffect(() => {
        if (!hydrated) {
            return;
        }

        saveCart(items);
    }, [items, hydrated]);
}
