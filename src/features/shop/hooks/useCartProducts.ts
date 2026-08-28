import {
    useGetProductByIdQuery,
    useGetProductsByIdsQuery,
} from '../api/shopApi';

export function useCartProduct(productId: string) {
    return useGetProductByIdQuery(productId);
}

export function useCartProducts(productIds: string[]) {
    return useGetProductsByIdsQuery(productIds, {
        skip: productIds.length === 0,
    });
}
