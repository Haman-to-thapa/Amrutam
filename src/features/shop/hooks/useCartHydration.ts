import { useEffect } from 'react';

import { loadCart } from '@/core/storage/cartStorage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCartHydrated } from '@/store/slices/cartSlice';

export function useCartHydration() {
    const dispatch = useAppDispatch();

    const hydrated = useAppSelector(
        state => state.cart.hydrated,
    );

    useEffect(() => {
        if (hydrated) {
            return;
        }

        dispatch(setCartHydrated(loadCart()));
    }, [dispatch, hydrated]);
}
