import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ProductSortOption } from '../types/shop.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

const OPTIONS: readonly {
    value: ProductSortOption;
    label: string;
    icon: string;
}[] = [
        {
            value: 'relevance',
            label: 'Popular',
            icon: '⚡',
        },
        {
            value: 'price_low_to_high',
            label: 'Price: Low to High',
            icon: '📉',
        },
        {
            value: 'price_high_to_low',
            label: 'Price: High to Low',
            icon: '📈',
        },
        {
            value: 'rating_high_to_low',
            label: 'Top Rated',
            icon: '⭐',
        },
        {
            value: 'newest',
            label: 'Newest',
            icon: '✨',
        },
    ];

type Props = {
    value: ProductSortOption;
    inStockOnly: boolean;
    onChange: (value: ProductSortOption) => void;
    onStockToggle: (inStock: boolean) => void;
};

function ProductSortComponent({
    value,
    inStockOnly,
    onChange,
    onStockToggle,
}: Props) {
    const { theme } = useAppTheme();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}>
            {/* In-Stock Toggle Chip */}
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle in-stock filter"
                onPress={() => onStockToggle(!inStockOnly)}
                style={[
                    styles.chip,
                    {
                        backgroundColor: inStockOnly
                            ? theme.mode === 'dark' ? '#1f3d2b' : '#e8f5e9'
                            : theme.colors.surface,
                        borderColor: inStockOnly
                            ? theme.colors.primary
                            : theme.colors.border,
                    },
                ]}>
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor: inStockOnly
                                ? theme.colors.primary
                                : theme.colors.textSecondary,
                        },
                    ]}
                />
                <Text
                    style={[
                        styles.text,
                        {
                            color: inStockOnly
                                ? theme.colors.primary
                                : theme.colors.text,
                        },
                    ]}>
                    In Stock
                </Text>
            </Pressable>

            {/* Sort Chips */}
            {OPTIONS.map(option => {
                const active = option.value === value;

                return (
                    <Pressable
                        key={option.value}
                        accessibilityRole="button"
                        accessibilityLabel={`Sort by ${option.label}`}
                        onPress={() => onChange(option.value)}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: active
                                    ? theme.colors.primary
                                    : theme.colors.surface,
                                borderColor: active
                                    ? theme.colors.primary
                                    : theme.colors.border,
                            },
                        ]}>
                        <Text style={styles.icon}>{option.icon}</Text>
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: active
                                        ? '#FFFFFF'
                                        : theme.colors.text,
                                },
                            ]}>
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

export const ProductSort = memo(
    ProductSortComponent,
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        alignItems: 'center',
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 16,
        borderWidth: 1,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 6,
    },

    icon: {
        fontSize: 12,
        marginRight: 5,
    },

    text: {
        fontSize: 12,
        fontWeight: '700',
    },
});
