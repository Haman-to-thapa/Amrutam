import { useGetProductsQuery } from '../api/shopApi';
import type { ProductListParams } from '../types/shop.types';

export function useProducts(
    params: ProductListParams,
) {
    return useGetProductsQuery(params);
}