import React from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

import type { ShopStackParamList } from '@/app/navigation/ShopNavigator';
import { useProductDetails } from '../hooks/useProductDetails';

type ProductDetailsRouteProp = RouteProp<
    ShopStackParamList,
    'ProductDetails'
>;

export function ProductDetailsScreen() {
    const insets = useSafeAreaInsets();
    const route = useRoute<ProductDetailsRouteProp>();
    const { productId } = route.params;

    const {
        data: product,
        isLoading,
        isError,
        error,
        refetch,
    } = useProductDetails(productId);

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return (
            <ErrorState
                message={
                    error &&
                        typeof error === 'object' &&
                        'message' in error &&
                        typeof error.message === 'string'
                        ? error.message
                        : 'Unable to load product.'
                }
                onRetry={refetch}
            />
        );
    }

    if (!product) {
        return (
            <EmptyState
                title="Product unavailable"
                message="This product could not be found."
            />
        );
    }

    const discountPercentage =
        product.originalPrice && product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}>
                {/* Product Hero Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.imageUrl }}
                        style={styles.image}
                        accessibilityLabel={product.name}
                        resizeMode="cover"
                    />
                    {!product.inStock ? (
                        <View style={styles.outOfStockBadge}>
                            <Text style={styles.outOfStockBadgeText}>OUT OF STOCK</Text>
                        </View>
                    ) : null}
                </View>

                {/* Details Section */}
                <View style={styles.details}>
                    {/* Category Pill */}
                    <View style={styles.categoryPill}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>

                    {/* Product Name */}
                    <Text style={styles.name}>{product.name}</Text>

                    {/* Rating & Reviews */}
                    <View style={styles.ratingRow}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>⭐ {product.rating}</Text>
                        </View>
                        <Text style={styles.reviewsText}>
                            ({product.reviewCount.toLocaleString('en-IN')} customer reviews)
                        </Text>
                    </View>

                    {/* Price & Discount */}
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{product.price}</Text>
                        {product.originalPrice ? (
                            <Text style={styles.originalPrice}>
                                ₹{product.originalPrice}
                            </Text>
                        ) : null}
                        {discountPercentage > 0 ? (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Stock Status */}
                    <View style={styles.stockRow}>
                        <View
                            style={[
                                styles.stockDot,
                                product.inStock ? styles.inStockDot : styles.outOfStockDot,
                            ]}
                        />
                        <Text
                            style={[
                                styles.stockText,
                                product.inStock ? styles.inStockText : styles.outOfStockText,
                            ]}>
                            {product.inStock
                                ? `In Stock (${product.stockQuantity} units available)`
                                : 'Currently Out of Stock'}
                        </Text>
                    </View>


                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Description */}
                    <Text style={styles.sectionTitle}>About this formulation</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 ? (
                        <>
                            <Text style={styles.sectionTitle}>Key Benefits & Tags</Text>
                            <View style={styles.tagsContainer}>
                                {product.tags.map(tag => (
                                    <View key={tag} style={styles.tagPill}>
                                        <Text style={styles.tagText}>🌿 {tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : null}
                </View>
            </ScrollView>

            {/* Bottom Sticky Action Bar */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
                <View style={styles.bottomPriceColumn}>
                    <Text style={styles.bottomPriceLabel}>Total Price</Text>
                    <Text style={styles.bottomPriceValue}>₹{product.price}</Text>
                </View>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                        product.inStock ? 'Add product to cart' : 'Product out of stock'
                    }
                    disabled={!product.inStock}
                    style={[
                        styles.cartButton,
                        !product.inStock && styles.disabledCartButton,
                    ]}>
                    <Text style={styles.cartButtonText}>
                        {product.inStock ? '🛍️ Add to Cart' : 'Out of Stock'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    content: {
        backgroundColor: '#ffffff',
    },

    imageContainer: {
        width: '100%',
        height: 320,
        backgroundColor: '#f3f4f6',
        position: 'relative',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    outOfStockBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(185, 28, 28, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },

    outOfStockBadgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    details: {
        padding: 20,
    },

    categoryPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#c8e6c9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },

    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1b5e20',
    },

    name: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        lineHeight: 28,
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
    },

    ratingBadge: {
        backgroundColor: '#fef3c7',
        borderWidth: 1,
        borderColor: '#fde68a',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },

    ratingText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#92400e',
    },

    reviewsText: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
    },

    price: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
    },

    originalPrice: {
        marginLeft: 10,
        fontSize: 16,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },

    discountBadge: {
        marginLeft: 10,
        backgroundColor: '#fee2e2',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },

    discountText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#dc2626',
    },

    stockRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },

    stockDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },

    inStockDot: {
        backgroundColor: '#16a34a',
    },

    outOfStockDot: {
        backgroundColor: '#dc2626',
    },

    stockText: {
        fontSize: 13,
        fontWeight: '600',
    },

    inStockText: {
        color: '#15803d',
    },

    outOfStockText: {
        color: '#b91c1c',
    },


    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 18,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
    },

    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#4b5563',
        marginBottom: 16,
    },

    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10,
    },

    tagPill: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 14,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    tagText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '600',
    },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 10,
    },

    bottomPriceColumn: {
        justifyContent: 'center',
    },

    bottomPriceLabel: {
        fontSize: 11,
        color: '#6b7280',
        fontWeight: '600',
    },

    bottomPriceValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },

    cartButton: {
        flex: 1,
        marginLeft: 20,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#1f6f43',
        shadowColor: '#1f6f43',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },

    disabledCartButton: {
        backgroundColor: '#9ca3af',
        shadowOpacity: 0,
        elevation: 0,
    },

    cartButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});
