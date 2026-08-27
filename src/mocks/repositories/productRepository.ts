import type {
    Product,
    ProductListParams,
} from '@/features/shop/types/shop.types';

import { mockDatabase } from '@/mocks/db/mockDatabase';
import { mockTransport } from '@/mocks/transport/mockTransport';
import { paginate } from './pagination';

export async function getProducts(
    params: ProductListParams,
) {
    return mockTransport(
        {
            method: 'GET',
            path: '/products',
        },
        () => {
            let products = [...mockDatabase.products];

            if (params.search?.trim()) {
                const query = params.search.trim().toLowerCase();

                products = products.filter(product =>
                    [
                        product.name,
                        product.description,
                        product.category,
                        ...product.tags,
                    ]
                        .join(' ')
                        .toLowerCase()
                        .includes(query),
                );
            }

            if (params.filters?.categories?.length) {
                const categories = params.filters.categories;

                products = products.filter(product =>
                    categories.includes(product.category),
                );
            }

            if (params.filters?.minPrice !== undefined) {
                products = products.filter(
                    product =>
                        product.price >= params.filters!.minPrice!,
                );
            }

            if (params.filters?.maxPrice !== undefined) {
                products = products.filter(
                    product =>
                        product.price <= params.filters!.maxPrice!,
                );
            }

            if (params.filters?.minRating !== undefined) {
                products = products.filter(
                    product =>
                        product.rating >= params.filters!.minRating!,
                );
            }

            if (params.filters?.inStockOnly) {
                products = products.filter(
                    product => product.inStock,
                );
            }

            switch (params.sort) {
                case 'price_low_to_high':
                    products.sort((a, b) => a.price - b.price);
                    break;

                case 'price_high_to_low':
                    products.sort((a, b) => b.price - a.price);
                    break;

                case 'rating_high_to_low':
                    products.sort((a, b) => b.rating - a.rating);
                    break;

                default:
                    break;
            }

            return paginate(
                products,
                params.page,
                params.pageSize,
            );
        },
    );
}

export async function getProductById(
    productId: string,
): Promise<Product> {
    return mockTransport(
        {
            method: 'GET',
            path: `/products/${productId}`,
        },
        () => {
            const product = mockDatabase.products.find(
                item => item.id === productId,
            );

            if (!product) {
                throw new Error('PRODUCT_NOT_FOUND');
            }

            return product;
        },
    ).then(response => response.data);
}