import React, { memo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    Pressable,
    View,
} from 'react-native';

import type {
    DoctorSpecialization,
} from '../types/consultation.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

const FILTERS: readonly (
    | 'All'
    | DoctorSpecialization
)[] = [
        'All',
        'Ayurvedic Physician',
        'Panchakarma',
        'Dermatology',
        'Digestive Health',
        'Women Health',
        'Stress Management',
    ];

type Props = {
    selected?: DoctorSpecialization;
    onChange: (
        value: DoctorSpecialization | undefined,
    ) => void;
};

function DoctorFiltersComponent({
    selected,
    onChange,
}: Props) {
    const { theme } = useAppTheme();

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                {FILTERS.map(filter => {
                    const isAll = filter === 'All';
                    const active = isAll
                        ? selected === undefined
                        : selected === filter;

                    return (
                        <Pressable
                            key={filter}
                            accessibilityRole="button"
                            accessibilityLabel={`Filter by ${filter}`}
                            onPress={() =>
                                onChange(
                                    isAll
                                        ? undefined
                                        : (filter as DoctorSpecialization),
                                )
                            }
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
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        color: active
                                            ? '#FFFFFF'
                                            : theme.colors.text,
                                        fontWeight: active ? '700' : '500',
                                    },
                                ]}>
                                {filter}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export const DoctorFilters = memo(
    DoctorFiltersComponent,
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },

    content: {
        paddingHorizontal: 0,
    },

    chip: {
        marginRight: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderRadius: 20,
    },

    text: {
        fontSize: 13,
    },
});