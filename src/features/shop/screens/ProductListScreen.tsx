import React, {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';

import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types/shop.types';

const PAGE_SIZE = 30;

export function ProductListScreen() {
    const [page, setPage] = useState(1);
    const [loadedProducts, setLoadedProducts] =
        useState<Product[]>([]);

    const params = useMemo(
        () => ({
            page,
            pageSize: PAGE_SIZE,
        }),
        [page],
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
        if (
            isFetching ||
            !data?.hasNextPage
        ) {
            return;
        }

        setPage(currentPage => currentPage + 1);
    }, [data?.hasNextPage, isFetching]);

    const renderItem = useCallback(
        ({ item }: { item: Product }) => (
            <ProductCard product={item} />
        ),
        [],
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


    if (
        !isLoading &&
        loadedProducts.length === 0
    ) {
        return (
            <EmptyState
                title="No products found"
                message="There are no products available right now."
            />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Ayurvedic Products
                </Text>

                <Text style={styles.count}>
                    {loadedProducts.length}
                    {data?.total
                        ? ` of ${data.total}`
                        : ''}
                </Text>
            </View>

            <FlashList
                data={loadedProducts}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                // estimatedItemSize={118}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                refreshing={
                    isFetching && page === 1
                }
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    isFetching && page > 1 ? (
                        <View style={styles.footer}>
                            <ActivityIndicator />
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
    },

    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
    },

    count: {
        marginTop: 4,
        fontSize: 12,
    },

    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    footerText: {
        marginTop: 6,
        fontSize: 12,
    },
});