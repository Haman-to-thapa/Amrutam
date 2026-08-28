import { baseApi } from '@/core/api/baseApi';
import type { PaginatedResponse } from '@/core/api/api.types';
import {
    loadProductsCache,
    saveProductsCache,
} from '@/core/storage/apiCacheStorage';
import { createCacheKey } from '@/core/utils/cacheKey';
import {
    getProductById,
    getProducts,
} from '@/mocks/repositories';

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
                const paramsKey = createCacheKey(params);

                try {
                    const response = await getProducts(params);

                    saveProductsCache({
                        paramsKey,
                        data: response.data,
                        savedAt: Date.now(),
                    });

                    return {
                        data: response.data,
                    };
                } catch (error) {
                    const cached = loadProductsCache();

                    if (
                        cached &&
                        cached.paramsKey === paramsKey
                    ) {
                        return {
                            data: cached.data,
                        };
                    }

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

        getProductById: builder.query<Product, string>({
            async queryFn(productId) {
                try {
                    const product = await getProductById(productId);

                    return {
                        data: product,
                    };
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : 'Unable to load product.';

                    if (message === 'PRODUCT_NOT_FOUND') {
                        return {
                            error: {
                                code: 'NOT_FOUND',
                                message: 'Product could not be found.',
                            },
                        };
                    }

                    return {
                        error: {
                            code: 'UNKNOWN',
                            message: 'Unable to load product.',
                        },
                    };
                }
            },

            providesTags: (_result, _error, productId) => [
                {
                    type: 'Product' as const,
                    id: productId,
                },
            ],
        }),

        getProductsByIds: builder.query<Product[], string[]>({
            async queryFn(productIds) {
                try {
                    const products = await Promise.all(
                        productIds.map(id => getProductById(id)),
                    );

                    return {
                        data: products,
                    };
                } catch {
                    return {
                        error: {
                            code: 'UNKNOWN',
                            message: 'Unable to load cart products.',
                        },
                    };
                }
            },

            providesTags: (_result, _error, productIds) =>
                productIds.map(productId => ({
                    type: 'Product' as const,
                    id: productId,
                })),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetProductsByIdsQuery,
} = shopApi;
