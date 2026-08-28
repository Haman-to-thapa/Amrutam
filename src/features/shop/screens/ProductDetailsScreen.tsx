import React, { useCallback } from 'react';
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

import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { showToast } from '@/store/slices/toastSlice';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

import type { ShopStackParamList } from '@/app/navigation/ShopNavigator';
import { useProductDetails } from '../hooks/useProductDetails';
import { WishlistButton } from '../components/WishlistButton';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type ProductDetailsRouteProp = RouteProp<
    ShopStackParamList,
    'ProductDetails'
>;

export function ProductDetailsScreen() {
    const { theme } = useAppTheme();
    const dispatch = useAppDispatch();
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

    const handleAddToCart = useCallback(() => {
        if (!product || !product.inStock || product.stockQuantity <= 0) {
            dispatch(
                showToast({
                    type: 'warning',
                    message: 'This product is out of stock.',
                }),
            );
            return;
        }

        dispatch(
            addToCart({
                productId: product.id,
                quantity: 1,
                addedAt: new Date().toISOString(),
            }),
        );

        dispatch(
            showToast({
                type: 'success',
                message: `Added ${product.name} to cart.`,
            }),
        );
    }, [dispatch, product]);


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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.content, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom + 90 }]}>
                {/* Product Hero Image */}
                <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }]}>
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
                    <View style={[styles.categoryPill, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9', borderColor: theme.mode === 'dark' ? '#2d573d' : '#c8e6c9' }]}>
                        <Text style={[styles.categoryText, { color: theme.colors.primary }]}>{product.category}</Text>
                    </View>

                    {/* Product Name & Wishlist Button */}
                    <View style={styles.titleRow}>
                        <Text style={[styles.name, { color: theme.colors.text }]}>{product.name}</Text>
                        <WishlistButton product={product} />
                    </View>


                    {/* Rating & Reviews */}
                    <View style={styles.ratingRow}>
                        <View style={[styles.ratingBadge, { backgroundColor: theme.mode === 'dark' ? '#3b2f15' : '#fef3c7', borderColor: theme.mode === 'dark' ? '#5c4820' : '#fde68a' }]}>
                            <Text style={[styles.ratingText, { color: theme.mode === 'dark' ? '#fbbf24' : '#92400e' }]}>⭐ {product.rating}</Text>
                        </View>
                        <Text style={[styles.reviewsText, { color: theme.colors.textSecondary }]}>
                            ({product.reviewCount.toLocaleString('en-IN')} customer reviews)
                        </Text>
                    </View>

                    {/* Price & Discount */}
                    <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: theme.colors.primary }]}>₹{product.price}</Text>
                        {product.originalPrice ? (
                            <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
                                ₹{product.originalPrice}
                            </Text>
                        ) : null}
                        {discountPercentage > 0 ? (
                            <View style={[styles.discountBadge, { backgroundColor: theme.mode === 'dark' ? '#3b1818' : '#fee2e2' }]}>
                                <Text style={[styles.discountText, { color: theme.colors.danger }]}>{discountPercentage}% OFF</Text>
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
                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                    {/* Description */}
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About this formulation</Text>
                    <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{product.description}</Text>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 ? (
                        <>
                            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Key Benefits & Tags</Text>
                            <View style={styles.tagsContainer}>
                                {product.tags.map(tag => (
                                    <View
                                        key={tag}
                                        style={[
                                            styles.tagPill,
                                            {
                                                backgroundColor: theme.colors.surface,
                                                borderColor: theme.colors.border,
                                            },
                                        ]}>
                                        <Text style={[styles.tagText, { color: theme.colors.text }]}>🌿 {tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    ) : null}
                </View>
            </ScrollView>

            {/* Bottom Sticky Action Bar */}
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
                <View style={styles.bottomPriceColumn}>
                    <Text style={[styles.bottomPriceLabel, { color: theme.colors.textSecondary }]}>Total Price</Text>
                    <Text style={[styles.bottomPriceValue, { color: theme.colors.text }]}>₹{product.price}</Text>
                </View>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                        product.inStock ? 'Add product to cart' : 'Product out of stock'
                    }
                    disabled={!product.inStock}
                    onPress={handleAddToCart}
                    style={[
                        styles.cartButton,
                        { backgroundColor: theme.colors.primary },
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
    },

    content: {
    },

    imageContainer: {
        width: '100%',
        height: 320,
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
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },

    categoryText: {
        fontSize: 12,
        fontWeight: '700',
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },

    name: {
        flex: 1,
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 28,
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 8,
    },

    ratingBadge: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },

    ratingText: {
        fontSize: 13,
        fontWeight: '700',
    },

    reviewsText: {
        fontSize: 13,
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
    },

    originalPrice: {
        marginLeft: 10,
        fontSize: 16,
        textDecorationLine: 'line-through',
    },

    discountBadge: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },

    discountText: {
        fontSize: 12,
        fontWeight: '700',
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
        marginVertical: 18,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },

    description: {
        fontSize: 14,
        lineHeight: 22,
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
        borderWidth: 1,
    },

    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
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
        fontWeight: '600',
    },

    bottomPriceValue: {
        fontSize: 20,
        fontWeight: '800',
    },

    cartButton: {
        flex: 1,
        marginLeft: 20,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        elevation: 4,
    },

    disabledCartButton: {
        backgroundColor: '#9ca3af',
        elevation: 0,
    },

    cartButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
});

