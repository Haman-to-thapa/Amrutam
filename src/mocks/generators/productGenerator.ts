import type {
    Product,
    ProductCategory,
} from '@/features/shop/types/shop.types';

import { createSeededRandom } from './seededRandom';

const PRODUCT_NAMES = [
    'Ashwagandha',
    'Triphala',
    'Chyawanprash',
    'Brahmi',
    'Neem',
    'Turmeric',
    'Amla',
    'Shatavari',
    'Giloy',
    'Herbal Hair Oil',
    'Herbal Massage Oil',
    'Digestive Powder',
];

const CATEGORIES: readonly ProductCategory[] = [
    'Supplements',
    'Herbal Oils',
    'Digestive Care',
    'Skin Care',
    'Hair Care',
    'Wellness',
];

const TAGS = [
    'ayurvedic',
    'herbal',
    'natural',
    'wellness',
    'organic',
    'daily-care',
];

export function generateProducts(
    count: number,
    seed = 2001,
): Product[] {
    const random = createSeededRandom(seed);

    return Array.from({ length: count }, (_, index) => {
        const basePrice = random.integer(150, 2500);
        const hasDiscount = random.boolean(0.45);

        const originalPrice = hasDiscount
            ? basePrice + random.integer(50, 500)
            : undefined;

        const tags = [
            ...new Set([
                random.pick(TAGS),
                random.pick(TAGS),
            ]),
        ];

        const name = random.pick(PRODUCT_NAMES);
        const category = random.pick(CATEGORIES);

        return {
            id: `product-${String(index + 1).padStart(5, '0')}`,
            name: `${name} ${index + 1}`,
            description:
                'A traditional wellness product designed for everyday Ayurvedic care.',
            shortDescription:
                'Natural Ayurvedic wellness product.',
            category,
            price: basePrice,
            originalPrice,
            currency: 'INR',
            rating: Number(
                (3.2 + random.next() * 1.8).toFixed(1),
            ),
            reviewCount: random.integer(5, 10000),
            imageUrl: `https://picsum.photos/seed/product-${index}/400/400`,
            thumbnailUrl: `https://picsum.photos/seed/product-${index}/120/120`,
            inStock: random.boolean(0.9),
            stockQuantity: random.integer(0, 250),
            tags,
        };
    });
}