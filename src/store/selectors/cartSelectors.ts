import type { RootState } from '@/store/rootReducer';

export const selectCartItems = (
    state: RootState,
) => state.cart.items;

export const selectCartItemCount = (
    state: RootState,
) =>
    state.cart.items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

export const selectCartQuantity = (
    productId: string,
) => (state: RootState) => {
    const item = state.cart.items.find(
        cartItem => cartItem.productId === productId,
    );

    return item?.quantity ?? 0;
};
