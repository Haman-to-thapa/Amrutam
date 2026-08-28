import { baseApi } from '@/core/api/baseApi';
import type { PaginatedResponse } from '@/core/api/api.types';
import { getProducts } from '@/mocks/repositories';

import type {
    Product,
    ProductListParams,
} from '../types/shop.types';

export const shopApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query<
            PaginatedResponse<Product>,
            ProductListParams
        >({
            async queryFn(params) {
                try {
                    const response = await getProducts(params);

                    return {
                        data: response.data,
                    };
                } catch (error) {
                    return {
                        error: {
                            code: 'UNKNOWN',
                            message:
                                error instanceof Error
                                    ? error.message
                                    : 'Unable to load products.',
                            details:
                                error instanceof Error
                                    ? error.message
                                    : undefined,
                        },
                    };
                }
            },


            providesTags: result =>
                result
                    ? [
                        {
                            type: 'Product' as const,
                            id: 'LIST',
                        },
                        ...result.data.map(product => ({
                            type: 'Product' as const,
                            id: product.id,
                        })),
                    ]
                    : [
                        {
                            type: 'Product' as const,
                            id: 'LIST',
                        },
                    ],
        }),
    }),
});

export const {
    useGetProductsQuery,
} = shopApi;