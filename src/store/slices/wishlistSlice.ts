import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { WishlistItem } from '@/features/shop/types/shop.types';

type WishlistState = {
    items: WishlistItem[];
    hydrated: boolean;
};

const initialState: WishlistState = {
    items: [],
    hydrated: false,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist(
            state,
            action: PayloadAction<WishlistItem>,
        ) {
            const exists = state.items.some(
                item => item.productId === action.payload.productId,
            );

            if (!exists) {
                state.items.push(action.payload);
            }
        },

        removeFromWishlist(
            state,
            action: PayloadAction<string>,
        ) {
            state.items = state.items.filter(
                item => item.productId !== action.payload,
            );
        },

        clearWishlist(state) {
            state.items = [];
        },

        setWishlistHydrated(
            state,
            action: PayloadAction<WishlistItem[]>,
        ) {
            state.items = action.payload;
            state.hydrated = true;
        },
    },
});

export const {
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    setWishlistHydrated,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
