import type { RootState } from '@/store/rootReducer';

export const selectWishlistItems = (
    state: RootState,
) => state.wishlist.items;

export const selectIsProductWishlisted = (
    productId: string,
) => (state: RootState) =>
    state.wishlist.items.some(
        item => item.productId === productId,
    );
