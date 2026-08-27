import type { ID, ISODateString } from '@/types/common';

export type ProductCategory =
    | 'Supplements'
    | 'Herbal Oils'
    | 'Digestive Care'
    | 'Skin Care'
    | 'Hair Care'
    | 'Wellness';

export type Product = {
    id: ID;
    name: string;
    description: string;
    shortDescription: string;
    category: ProductCategory;
    price: number;
    originalPrice?: number;
    currency: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    thumbnailUrl: string;
    inStock: boolean;
    stockQuantity: number;
    tags: string[];
};

export type CartItem = {
    productId: ID;
    quantity: number;
    addedAt: ISODateString;
};

export type WishlistItem = {
    productId: ID;
    addedAt: ISODateString;
};

export type ProductSortOption =
    | 'relevance'
    | 'price_low_to_high'
    | 'price_high_to_low'
    | 'rating_high_to_low'
    | 'newest';

export type ProductFilters = {
    categories?: ProductCategory[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStockOnly?: boolean;
};

export type ProductListParams = {
    page: number;
    pageSize: number;
    search?: string;
    filters?: ProductFilters;
    sort?: ProductSortOption;
};