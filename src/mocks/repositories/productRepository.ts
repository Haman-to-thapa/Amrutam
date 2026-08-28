import type {
    Product,
    ProductListParams,
} from '@/features/shop/types/shop.types';

import { mockDatabase } from '@/mocks/db/mockDatabase';
import { mockTransport } from '@/mocks/transport/mockTransport';
import { paginate } from './pagination';
import { filterProducts } from '@/features/shop/utils/productFilters';

export async function getProducts(
    params: ProductListParams,
) {
    return mockTransport(
        {
            method: 'GET',
            path: '/products',
        },
        () => {
            let products = filterProducts(
                mockDatabase.products,
                params,
            );

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