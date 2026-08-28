import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import {
    setWishlistHydrated,
} from '@/store/slices/wishlistSlice';

import { loadWishlist } from '@/core/storage/wishlistStorage';

export function useWishlistHydration() {
    const dispatch = useAppDispatch();

    const hydrated = useAppSelector(
        state => state.wishlist.hydrated,
    );

    useEffect(() => {
        if (hydrated) {
            return;
        }

        dispatch(
            setWishlistHydrated(loadWishlist()),
        );
    }, [dispatch, hydrated]);
}
