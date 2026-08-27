import React, { memo } from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { Doctor } from '../types/consultation.types';

type Props = {
    doctor: Doctor;
    onPress?: () => void;
};

function DoctorCardComponent({ doctor, onPress }: Props) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View profile of ${doctor.name}`}
            onPress={onPress}
            style={styles.card}>
            <Image
                source={{ uri: doctor.avatarUrl }}
                style={styles.avatar}
            />

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {doctor.name}
                </Text>

                <Text style={styles.specialization} numberOfLines={1}>
                    {doctor.specialization}
                </Text>

                <Text style={styles.meta}>
                    {doctor.experienceYears} years • ⭐ {doctor.rating}
                </Text>

                <Text style={styles.meta}>
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
        borderRadius: 12,
        backgroundColor: '#ffffff',
        elevation: 2,
    },

    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#eeeeee',
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
        marginTop: 4,
        fontSize: 14,
    },

    meta: {
        marginTop: 4,
        fontSize: 12,
    },
});