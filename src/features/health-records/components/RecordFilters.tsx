import React, { memo } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { HealthRecordType } from '../types/health-record.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

const RECORD_TYPES: readonly {
    value: HealthRecordType | undefined;
    label: string;
    icon: string;
}[] = [
    { value: undefined, label: 'All Records', icon: '📋' },
    { value: 'lab_report', label: 'Lab Report', icon: '🧪' },
    { value: 'prescription', label: 'Prescription', icon: '💊' },
    { value: 'consultation', label: 'Consultation', icon: '👨‍⚕️' },
    { value: 'vaccination', label: 'Vaccination', icon: '💉' },
    { value: 'allergy', label: 'Allergy', icon: '⚠️' },
];

type Props = {
    selectedType?: HealthRecordType;
    onTypeChange: (
        value: HealthRecordType | undefined,
    ) => void;
};

function RecordFiltersComponent({
    selectedType,
    onTypeChange,
}: Props) {
    const { theme } = useAppTheme();

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.content}>
                {RECORD_TYPES.map(option => {
                    const active =
                        selectedType === option.value;

                    return (
                        <Pressable
                            key={option.label}
                            accessibilityRole="button"
                            accessibilityLabel={`Filter ${option.label}`}
                            onPress={() =>
                                onTypeChange(option.value)
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
        </View>
    );
}

export const RecordFilters = memo(
    RecordFiltersComponent,
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },

    content: {
        paddingHorizontal: 16,
        gap: 8,
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },

    icon: {
        fontSize: 13,
        marginRight: 6,
    },

    text: {
        fontSize: 13,
        fontWeight: '700',
    },
});

