import React, {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { FlashList } from '@shopify/flash-list';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/core/utils/useDebounce';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ShopStackParamList } from '@/app/navigation/ShopNavigator';

import { useAppSelector } from '@/store/hooks';
import { selectWishlistItems } from '@/store/selectors/wishlistSelectors';
import { selectCartItemCount } from '@/store/selectors/cartSelectors';

import { ProductAdvancedFilters } from '../components/ProductAdvancedFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { ProductSort } from '../components/ProductSort';
import { useProducts } from '../hooks/useProducts';
import type {
    Product,
    ProductCategory,
    ProductSortOption,
} from '../types/shop.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

const PAGE_SIZE = 30;

export function ProductListScreen() {
    const { theme } = useAppTheme();
    const navigation =
        useNavigation<NativeStackNavigationProp<ShopStackParamList, 'Products'>>();
    const wishlistItems = useAppSelector(selectWishlistItems);
    const cartCount = useAppSelector(selectCartItemCount);



    const [page, setPage] = useState(1);
    const [loadedProducts, setLoadedProducts] =
        useState<Product[]>([]);


    const [search, setSearch] = useState('');
    const [category, setCategory] =
        useState<ProductCategory | undefined>();
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] =
        useState<ProductSortOption>('relevance');

    const [minPrice, setMinPrice] =
        useState<number | undefined>();
    const [maxPrice, setMaxPrice] =
        useState<number | undefined>();
    const [minRating, setMinRating] =
        useState<number | undefined>();

    const debouncedSearch = useDebounce(search, 350);

    const handleSearchChange = useCallback(
        (text: string) => {
            setSearch(text);
            setPage(1);
            setLoadedProducts([]);
        },
        [],
    );

    const handleCategoryChange = useCallback(
        (selectedCategory: ProductCategory | undefined) => {
            setCategory(selectedCategory);
            setPage(1);
            setLoadedProducts([]);
        },
        [],
    );

    const handleStockChange = useCallback(
        (stockOnly: boolean) => {
            setInStockOnly(stockOnly);
            setPage(1);
            setLoadedProducts([]);
        },
        [],
    );

    const handleSortChange = useCallback(
        (selectedSort: ProductSortOption) => {
            setSort(selectedSort);
            setPage(1);
            setLoadedProducts([]);
        },
        [],
    );

    const handleAdvancedFilters = useCallback(
        (filters: {
            minPrice?: number;
            maxPrice?: number;
            minRating?: number;
        }) => {
            setMinPrice(filters.minPrice);
            setMaxPrice(filters.maxPrice);
            setMinRating(filters.minRating);
            setPage(1);
            setLoadedProducts([]);
        },
        [],
    );

    const params = useMemo(
        () => ({
            page,
            pageSize: PAGE_SIZE,
            search: debouncedSearch.trim() || undefined,
            sort,
            filters: {
                category,
                inStockOnly: inStockOnly || undefined,
                minPrice,
                maxPrice,
                minRating,
            },
        }),
        [
            category,
            debouncedSearch,
            inStockOnly,
            maxPrice,
            minPrice,
            minRating,
            page,
            sort,
        ],
    );

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useProducts(params);

    React.useEffect(() => {
        if (!data) {
            return;
        }

        setLoadedProducts(currentProducts => {
            if (page === 1) {
                return data.data;
            }

            const existingIds = new Set(
                currentProducts.map(product => product.id),
            );

            const newProducts = data.data.filter(
                product => !existingIds.has(product.id),
            );

            return [...currentProducts, ...newProducts];
        });
    }, [data, page]);

    const handleEndReached = useCallback(() => {
        if (isFetching || !data?.hasNextPage) {
            return;
        }

        setPage(currentPage => currentPage + 1);
    }, [data?.hasNextPage, isFetching]);

    const handleProductPress = useCallback(
        (product: Product) => {
            navigation.navigate('ProductDetails', {
                productId: product.id,
            });
        },
        [navigation],
    );

    const renderItem = useCallback(
        ({ item }: { item: Product }) => (
            <ProductCard
                product={item}
                onPress={handleProductPress}
            />
        ),
        [handleProductPress],
    );


    const handleRefresh = useCallback(() => {
        setPage(1);
        refetch();
    }, [refetch]);

    if (isLoading && page === 1) {
        return <LoadingState />;
    }

    if (isError && page === 1) {
        return (
            <ErrorState
                message={
                    error &&
                        typeof error === 'object' &&
                        'message' in error &&
                        typeof error.message === 'string'
                        ? error.message
                        : 'Unable to load products.'
                }
                onRetry={handleRefresh}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <View style={styles.titleRow}>
                    <View style={styles.titleTextContainer}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            Ayurvedic Shop
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Authentic Wellness Formulations
                        </Text>
                    </View>
                    <View style={styles.headerActions}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Open wishlist"
                            onPress={() => navigation.navigate('Wishlist')}
                            style={[styles.headerWishlistButton, { backgroundColor: theme.mode === 'dark' ? '#3b1818' : '#fef2f2', borderColor: theme.mode === 'dark' ? '#5c2222' : '#fee2e2' }]}>
                            <Text style={styles.headerWishlistIcon}>♥</Text>
                            {wishlistItems.length > 0 ? (
                                <View style={styles.headerWishlistBadge}>
                                    <Text style={styles.headerWishlistBadgeText}>
                                        {wishlistItems.length}
                                    </Text>
                                </View>
                            ) : null}
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Open cart"
                            onPress={() => navigation.navigate('Cart')}
                            style={[styles.headerCartButton, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9', borderColor: theme.mode === 'dark' ? '#2d573d' : '#c8e6c9' }]}>
                            <Text style={styles.headerCartIcon}>🛍️</Text>
                            {cartCount > 0 ? (
                                <View style={[styles.headerCartBadge, { backgroundColor: theme.colors.primary }]}>
                                    <Text style={styles.headerCartBadgeText}>
                                        {cartCount}
                                    </Text>
                                </View>
                            ) : null}
                        </Pressable>
                    </View>
                </View>


                {/* Search + Filter Button Row */}
                <View style={styles.searchRow}>
                    <View style={styles.searchInputWrapper}>
                        <Input
                            value={search}
                            onChangeText={handleSearchChange}
                            placeholder="Search herbs, oils, skincare..."
                            accessibilityLabel="Search products"
                        />
                    </View>
                    <ProductAdvancedFilters
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        minRating={minRating}
                        onApply={handleAdvancedFilters}
                    />
                </View>

                {/* Categories Horizontal Pills */}
                <ProductFilters
                    selectedCategory={category}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Sort & In-Stock Chips */}
                <ProductSort
                    value={sort}
                    inStockOnly={inStockOnly}
                    onChange={handleSortChange}
                    onStockToggle={handleStockChange}
                />

                {/* Active Filters Summary Chips (If any applied) */}
                {(category || minPrice || maxPrice || minRating || inStockOnly) ? (
                    <View style={styles.activeTagsRow}>
                        <Text style={[styles.activeTagsLabel, { color: theme.colors.textSecondary }]}>Active:</Text>
                        {category ? (
                            <Pressable
                                onPress={() => handleCategoryChange(undefined)}
                                style={[styles.activeTag, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9', borderColor: theme.mode === 'dark' ? '#2d573d' : '#a7f3d0' }]}>
                                <Text style={[styles.activeTagText, { color: theme.colors.primary }]}>{category} ✕</Text>
                            </Pressable>
                        ) : null}
                        {minPrice || maxPrice ? (
                            <Pressable
                                onPress={() => handleAdvancedFilters({ minPrice: undefined, maxPrice: undefined, minRating })}
                                style={[styles.activeTag, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9', borderColor: theme.mode === 'dark' ? '#2d573d' : '#a7f3d0' }]}>
                                <Text style={[styles.activeTagText, { color: theme.colors.primary }]}>
                                    {minPrice && maxPrice
                                        ? `₹${minPrice}-₹${maxPrice}`
                                        : minPrice
                                            ? `From ₹${minPrice}`
                                            : `Up to ₹${maxPrice}`} ✕
                                </Text>
                            </Pressable>
                        ) : null}
                        {minRating ? (
                            <Pressable
                                onPress={() => handleAdvancedFilters({ minPrice, maxPrice, minRating: undefined })}
                                style={[styles.activeTag, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9', borderColor: theme.mode === 'dark' ? '#2d573d' : '#a7f3d0' }]}>
                                <Text style={[styles.activeTagText, { color: theme.colors.primary }]}>⭐ {minRating}+ ✕</Text>
                            </Pressable>
                        ) : null}
                        {inStockOnly ? (
                            <Pressable
                                onPress={() => handleStockChange(false)}
                                style={[styles.activeTag, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9', borderColor: theme.mode === 'dark' ? '#2d573d' : '#a7f3d0' }]}>
                                <Text style={[styles.activeTagText, { color: theme.colors.primary }]}>In Stock ✕</Text>
                            </Pressable>
                        ) : null}
                    </View>
                ) : null}

                {/* Results Count Row */}
                <View style={styles.countRow}>
                    <Text style={[styles.count, { color: theme.colors.textSecondary }]}>
                        Showing {loadedProducts.length}
                        {data?.total ? ` of ${data.total.toLocaleString('en-IN')}` : ''} products
                    </Text>
                    {isFetching && page > 1 ? (
                        <Text style={[styles.refreshing, { color: theme.colors.primary }]}>
                            Loading more...
                        </Text>
                    ) : null}
                </View>
            </View>


            <FlashList
                data={loadedProducts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                refreshing={isFetching && page === 1}
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !isLoading ? (
                        <EmptyState
                            title="No products found"
                            message="Try adjusting your search query or filters."
                        />
                    ) : null
                }
                ListFooterComponent={
                    isFetching && page > 1 ? (
                        <View style={styles.footer}>
                            <ActivityIndicator color="#1f6f43" />
                            <Text style={styles.footerText}>
                                Loading more products...
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    header: {
        backgroundColor: '#ffffff',
        paddingTop: 14,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 8,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
    },

    titleTextContainer: {
        flex: 1,
    },

    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.3,
    },

    subtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },

    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    headerWishlistButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fee2e2',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    headerWishlistIcon: {
        fontSize: 18,
        color: '#dc2626',
    },

    headerWishlistBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#dc2626',
        borderRadius: 9,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },

    headerWishlistBadgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
    },

    headerCartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#c8e6c9',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    headerCartIcon: {
        fontSize: 16,
    },

    headerCartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#1f6f43',
        borderRadius: 9,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },

    headerCartBadgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
    },



    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
        gap: 8,
    },

    searchInputWrapper: {
        flex: 1,
    },

    activeTagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 4,
        gap: 6,
    },

    activeTagsLabel: {
        fontSize: 11,
        color: '#6b7280',
        fontWeight: '600',
        marginRight: 2,
    },

    activeTag: {
        backgroundColor: '#e8f5e9',
        borderWidth: 1,
        borderColor: '#a7f3d0',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },

    activeTagText: {
        fontSize: 11,
        color: '#065f46',
        fontWeight: '600',
    },

    countRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },

    count: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '600',
    },

    refreshing: {
        fontSize: 12,
        color: '#1f6f43',
        fontWeight: '600',
    },

    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    footerText: {
        marginTop: 6,
        fontSize: 12,
        color: '#6b7280',
    },
});
