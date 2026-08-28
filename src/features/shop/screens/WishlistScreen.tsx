import React, { useCallback } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearWishlist } from '@/store/slices/wishlistSlice';
import { selectWishlistItems } from '@/store/selectors/wishlistSelectors';
import { EmptyState } from '@/components/feedback/EmptyState';
import type { ShopStackParamList } from '@/app/navigation/ShopNavigator';
import type { Product } from '../types/shop.types';
import { WishlistItemCard } from '../components/WishlistItemCard';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@/app/providers/ThemeProvider';

export function WishlistScreen() {
    const { t } = useTranslation();
    const { theme } = useAppTheme();
    const dispatch = useAppDispatch();
    const navigation =
        useNavigation<NativeStackNavigationProp<ShopStackParamList, 'Wishlist'>>();
    const wishlistItems = useAppSelector(selectWishlistItems);

    const handleProductPress = useCallback(
        (product: Product) => {
            navigation.navigate('ProductDetails', {
                productId: product.id,
            });
        },
        [navigation],
    );

    const handleClearAll = useCallback(() => {
        Alert.alert(
            t('common.clear'),
            'Are you sure you want to remove all items from your wishlist?',
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.clear'),
                    style: 'destructive',
                    onPress: () => dispatch(clearWishlist()),
                },
            ],
        );
    }, [dispatch, t]);

    const renderItem = useCallback(
        ({
            item,
        }: {
            item: (typeof wishlistItems)[number];
        }) => {
            return (
                <WishlistItemCard
                    productId={item.productId}
                    onPress={handleProductPress}
                />
            );
        },
        [handleProductPress],
    );

    if (wishlistItems.length === 0) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
                <EmptyState
                    title={t('shop.emptyWishlist')}
                    message={t('shop.emptyWishlistDesc')}
                />
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Explore shop"
                    onPress={() => navigation.navigate('Products')}
                    style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.exploreButtonText}>Explore Remedies →</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.topBar, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.itemCountText, { color: theme.colors.text }]}>
                    {wishlistItems.length} {t('shop.items')} ({t('shop.wishlist')})
                </Text>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear wishlist"
                    onPress={handleClearAll}
                    style={styles.clearButton}>
                    <Text style={[styles.clearButtonText, { color: theme.colors.danger }]}>{t('common.clear')}</Text>
                </Pressable>
            </View>

            <FlashList
                data={wishlistItems}
                renderItem={renderItem}
                keyExtractor={item => item.productId}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    exploreButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        elevation: 3,
    },

    exploreButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },

    itemCountText: {
        fontSize: 13,
        fontWeight: '700',
    },

    clearButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    clearButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },

    listContent: {
        paddingVertical: 8,
    },
});


