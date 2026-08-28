import { useGetProductByIdQuery } from '../api/shopApi';

export function useProductDetails(productId: string) {
    return useGetProductByIdQuery(productId);
}
