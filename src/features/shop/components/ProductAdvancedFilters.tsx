import React, { memo, useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRICE_PRESETS: readonly {
    label: string;
    min?: number;
    max?: number;
}[] = [
        { label: 'All Prices', min: undefined, max: undefined },
        { label: 'Under ₹500', min: undefined, max: 500 },
        { label: '₹500 - ₹1,000', min: 500, max: 1000 },
        { label: '₹1,000 - ₹2,000', min: 1000, max: 2000 },
        { label: 'Above ₹2,000', min: 2000, max: undefined },
    ];

const RATING_PRESETS: readonly {
    label: string;
    rating?: number;
}[] = [
        { label: 'All Ratings', rating: undefined },
        { label: '⭐ 4.5 & up', rating: 4.5 },
        { label: '⭐ 4.0 & up', rating: 4.0 },
        { label: '⭐ 3.0 & up', rating: 3.0 },
    ];

type Props = {
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    onApply: (filters: {
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
    }) => void;
};

function ProductAdvancedFiltersComponent({
    minPrice,
    maxPrice,
    minRating,
    onApply,
}: Props) {
    const insets = useSafeAreaInsets();
    const bottomInset = Math.max(insets.bottom, 16);

    const [visible, setVisible] = useState(false);
    const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
    const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);
    const [draftMinRating, setDraftMinRating] = useState(minRating);


    const activeFilterCount =
        (minPrice !== undefined || maxPrice !== undefined ? 1 : 0) +
        (minRating !== undefined ? 1 : 0);

    const openModal = () => {
        setDraftMinPrice(minPrice);
        setDraftMaxPrice(maxPrice);
        setDraftMinRating(minRating);
        setVisible(true);
    };

    const handleReset = () => {
        setDraftMinPrice(undefined);
        setDraftMaxPrice(undefined);
        setDraftMinRating(undefined);
    };

    const apply = () => {
        onApply({
            minPrice: draftMinPrice,
            maxPrice: draftMaxPrice,
            minRating: draftMinRating,
        });
        setVisible(false);
    };

    return (
        <>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open advanced filters"
                onPress={openModal}
                style={[
                    styles.triggerButton,
                    activeFilterCount > 0 && styles.activeTriggerButton,
                ]}>
                <Text style={styles.triggerIcon}>🎛️</Text>
                <Text
                    style={[
                        styles.triggerText,
                        activeFilterCount > 0 && styles.activeTriggerText,
                    ]}>
                    Filters
                </Text>
                {activeFilterCount > 0 ? (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{activeFilterCount}</Text>
                    </View>
                ) : null}
            </Pressable>

            <Modal
                visible={visible}
                animationType="fade"
                transparent
                onRequestClose={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setVisible(false)}
                    />

                    <View style={styles.sheet}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Filter Products</Text>
                            <View style={styles.headerActions}>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={handleReset}
                                    style={styles.resetButton}>
                                    <Text style={styles.resetText}>Reset All</Text>
                                </Pressable>
                                <Pressable
                                    accessibilityRole="button"
                                    onPress={() => setVisible(false)}
                                    style={styles.closeButton}>
                                    <Text style={styles.closeIcon}>✕</Text>
                                </Pressable>
                            </View>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.body}>
                            {/* Price Range Section */}
                            <Text style={styles.sectionTitle}>💰 Price Range</Text>
                            <View style={styles.pillGrid}>
                                {PRICE_PRESETS.map(preset => {
                                    const isSelected =
                                        draftMinPrice === preset.min &&
                                        draftMaxPrice === preset.max;

                                    return (
                                        <Pressable
                                            key={preset.label}
                                            accessibilityRole="button"
                                            onPress={() => {
                                                setDraftMinPrice(preset.min);
                                                setDraftMaxPrice(preset.max);
                                            }}
                                            style={[
                                                styles.pill,
                                                isSelected
                                                    ? styles.activePill
                                                    : styles.inactivePill,
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.pillText,
                                                    isSelected
                                                        ? styles.activePillText
                                                        : styles.inactivePillText,
                                                ]}>
                                                {preset.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Rating Section */}
                            <Text style={styles.sectionTitle}>⭐ Customer Rating</Text>
                            <View style={styles.pillGrid}>
                                {RATING_PRESETS.map(preset => {
                                    const isSelected = draftMinRating === preset.rating;

                                    return (
                                        <Pressable
                                            key={preset.label}
                                            accessibilityRole="button"
                                            onPress={() => setDraftMinRating(preset.rating)}
                                            style={[
                                                styles.pill,
                                                isSelected
                                                    ? styles.activePill
                                                    : styles.inactivePill,
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.pillText,
                                                    isSelected
                                                        ? styles.activePillText
                                                        : styles.inactivePillText,
                                                ]}>
                                                {preset.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Apply Button */}
                        <View style={[styles.footer, { paddingBottom: bottomInset + 12 }]}>
                            <Pressable
                                onPress={apply}
                                style={styles.applyButton}
                                accessibilityRole="button">
                                <Text style={styles.applyText}>Apply Filters</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export const ProductAdvancedFilters = memo(
    ProductAdvancedFiltersComponent,
);

const styles = StyleSheet.create({
    triggerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        height: 48,
        minWidth: 48,
    },

    activeTriggerButton: {
        backgroundColor: '#e8f5e9',
        borderColor: '#1f6f43',
    },

    triggerIcon: {
        fontSize: 16,
    },

    triggerText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },

    activeTriggerText: {
        color: '#1f6f43',
    },

    badge: {
        marginLeft: 6,
        backgroundColor: '#1f6f43',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },

    badgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
    },

    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    backdrop: {
        flex: 1,
    },

    sheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '82%',
    },


    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },

    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    resetButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 8,
    },

    resetText: {
        color: '#b91c1c',
        fontSize: 13,
        fontWeight: '600',
    },

    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },

    closeIcon: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '700',
    },

    body: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 10,
        marginBottom: 12,
    },

    pillGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10,
    },

    pill: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 12,
    },

    inactivePill: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    activePill: {
        backgroundColor: '#1f6f43',
        borderWidth: 1,
        borderColor: '#1f6f43',
    },

    pillText: {
        fontSize: 13,
        fontWeight: '500',
    },

    inactivePillText: {
        color: '#4b5563',
    },

    activePillText: {
        color: '#ffffff',
        fontWeight: '600',
    },

    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },

    applyButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: '#1f6f43',
        shadowColor: '#1f6f43',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },

    applyText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});