import type {
    Product,
    ProductListParams,
} from '../types/shop.types';

export function filterProducts(
    products: Product[],
    params: ProductListParams,
): Product[] {
    let result = products;

    if (params.search?.trim()) {
        const query = params.search.trim().toLowerCase();

        result = result.filter(product =>
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
        result = result.filter(product =>
            params.filters!.categories!.includes(product.category),
        );
    }

    if (params.filters?.minPrice !== undefined) {
        result = result.filter(
            product => product.price >= params.filters!.minPrice!,
        );
    }

    if (params.filters?.maxPrice !== undefined) {
        result = result.filter(
            product => product.price <= params.filters!.maxPrice!,
        );
    }

    if (params.filters?.minRating !== undefined) {
        result = result.filter(
            product => product.rating >= params.filters!.minRating!,
        );
    }

    if (params.filters?.inStockOnly) {
        result = result.filter(product => product.inStock);
    }

    return result;
}
