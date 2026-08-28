import React, { memo } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Doctor } from '../types/consultation.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    doctor: Doctor;
    onPress?: () => void;
};

function DoctorCardComponent({ doctor, onPress }: Props) {
    const { theme } = useAppTheme();

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View profile of ${doctor.name}`}
            onPress={onPress}
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
            ]}>
            <Image
                source={{ uri: doctor.avatarUrl }}
                style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.border },
                ]}
            />

            <View style={styles.content}>
                <Text
                    style={[
                        styles.name,
                        { color: theme.colors.text },
                    ]}
                    numberOfLines={1}>
                    {doctor.name}
                </Text>

                <Text
                    style={[
                        styles.specialization,
                        { color: theme.colors.primary },
                    ]}
                    numberOfLines={1}>
                    {doctor.specialization}
                </Text>

                <Text
                    style={[
                        styles.meta,
                        { color: theme.colors.textSecondary },
                    ]}>
                    {doctor.experienceYears} years • ⭐ {doctor.rating}
                </Text>

                <Text
                    style={[
                        styles.fee,
                        { color: theme.colors.text },
                    ]}>
                    From ₹{doctor.consultationFee}
                </Text>
            </View>
        </Pressable>
    );
}

export const DoctorCard = memo(DoctorCardComponent);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
    },

    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },

    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },

    name: {
        fontSize: 16,
        fontWeight: '700',
    },

    specialization: {
        marginTop: 3,
        fontSize: 13,
        fontWeight: '600',
    },

    meta: {
        marginTop: 3,
        fontSize: 12,
    },

    fee: {
        marginTop: 4,
        fontSize: 13,
        fontWeight: '700',
    },
});