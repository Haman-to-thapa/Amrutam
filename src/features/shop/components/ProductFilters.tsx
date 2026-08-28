import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { ProductCategory } from '../types/shop.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

const CATEGORIES: readonly { name: ProductCategory; icon: string }[] = [
    { name: 'Supplements', icon: '💊' },
    { name: 'Herbal Oils', icon: '🧴' },
    { name: 'Digestive Care', icon: '🍵' },
    { name: 'Skin Care', icon: '✨' },
    { name: 'Hair Care', icon: '💆' },
    { name: 'Wellness', icon: '🧘' },
];

type Props = {
    selectedCategory?: ProductCategory;
    onCategoryChange: (
        category: ProductCategory | undefined,
    ) => void;
};

function ProductFiltersComponent({
    selectedCategory,
    onCategoryChange,
}: Props) {
    const { theme } = useAppTheme();

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="All categories"
                    onPress={() => onCategoryChange(undefined)}
                    style={[
                        styles.chip,
                        {
                            backgroundColor: selectedCategory === undefined
                                ? theme.colors.primary
                                : theme.colors.surface,
                            borderColor: selectedCategory === undefined
                                ? theme.colors.primary
                                : theme.colors.border,
                        },
                    ]}>
                    <Text style={styles.icon}>🌿</Text>
                    <Text
                        style={[
                            styles.text,
                            {
                                color: selectedCategory === undefined
                                    ? '#FFFFFF'
                                    : theme.colors.text,
                            },
                        ]}>
                        All
                    </Text>
                </Pressable>

                {CATEGORIES.map(cat => {
                    const active = selectedCategory === cat.name;

                    return (
                        <Pressable
                            key={cat.name}
                            accessibilityRole="button"
                            accessibilityLabel={`Filter ${cat.name}`}
                            onPress={() => onCategoryChange(cat.name)}
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
                            <Text style={styles.icon}>{cat.icon}</Text>
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        color: active
                                            ? '#FFFFFF'
                                            : theme.colors.text,
                                    },
                                ]}>
                                {cat.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export const ProductFilters = memo(
    ProductFiltersComponent,
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 6,
    },

    content: {
        paddingHorizontal: 16,
        paddingVertical: 2,
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },

    icon: {
        fontSize: 14,
        marginRight: 6,
    },

    text: {
        fontSize: 13,
        fontWeight: '700',
    },
});
