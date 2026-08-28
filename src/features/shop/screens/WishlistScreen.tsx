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

export function WishlistScreen() {
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
            'Clear Wishlist',
            'Are you sure you want to remove all items from your wishlist?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => dispatch(clearWishlist()),
                },
            ],
        );
    }, [dispatch]);

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
            <View style={styles.emptyContainer}>
                <EmptyState
                    title="Your Wishlist is Empty"
                    message="Explore authentic Ayurvedic remedies and tap the heart icon to save them here."
                />
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Explore shop"
                    onPress={() => navigation.navigate('Products')}
                    style={styles.exploreButton}>
                    <Text style={styles.exploreButtonText}>Explore Products 🌿</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.itemCountText}>
                    {wishlistItems.length} Saved {wishlistItems.length === 1 ? 'Item' : 'Items'}
                </Text>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear wishlist"
                    onPress={handleClearAll}
                    style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear All</Text>
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
        backgroundColor: '#f8f9fa',
    },

    emptyContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    exploreButton: {
        marginTop: 20,
        backgroundColor: '#1f6f43',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#1f6f43',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
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
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    itemCountText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
    },

    clearButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    clearButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#b91c1c',
    },

    listContent: {
        paddingVertical: 8,
    },
});

