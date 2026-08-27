import React, { memo } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { formatTime } from '@/core/utils/date';
import type { Booking } from '../types/consultation.types';


type Props = {
    booking: Booking;
    doctorName?: string;
    onCancel: (booking: Booking) => void;
    isCancelling: boolean;
};

function UpcomingBookingCardComponent({
    booking,
    doctorName,
    onCancel,
    isCancelling,
}: Props) {
    const handleCancelPress = () => {
        Alert.alert(
            'Cancel consultation',
            'Are you sure you want to cancel this consultation?',
            [
                {
                    text: 'Keep',
                    style: 'cancel',
                },
                {
                    text: 'Cancel consultation',
                    style: 'destructive',
                    onPress: () => onCancel(booking),
                },
            ],
        );
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>
                Upcoming Consultation
            </Text>

            <Text style={styles.row}>
                Doctor: {doctorName ?? booking.doctorId}
            </Text>


            <Text style={styles.row}>
                Date:{' '}
                {new Date(
                    booking.scheduledAt,
                ).toLocaleDateString('en-IN')}
            </Text>

            <Text style={styles.row}>
                Time: {formatTime(booking.scheduledAt)}
            </Text>

            <Text style={styles.row}>
                Mode: {booking.mode}
            </Text>

            <Text style={styles.row}>
                Patient: {booking.patientName}
            </Text>

            <Text style={styles.status}>
                {booking.status}
            </Text>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Cancel consultation for ${booking.patientName}`}
                disabled={isCancelling}
                onPress={handleCancelPress}
                style={[
                    styles.cancelButton,
                    isCancelling && styles.disabled,
                ]}>
                <Text style={styles.cancelText}>
                    {isCancelling
                        ? 'Cancelling...'
                        : 'Cancel Consultation'}
                </Text>
            </Pressable>
        </View>
    );
}

export const UpcomingBookingCard = memo(
    UpcomingBookingCardComponent,
);

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
    },

    row: {
        marginTop: 6,
        fontSize: 14,
    },

    status: {
        marginTop: 10,
        fontWeight: '700',
        textTransform: 'capitalize',
    },

    cancelButton: {
        marginTop: 16,
        minHeight: 46,
        borderWidth: 1,
        borderColor: '#b91c1c',
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },

    disabled: {
        opacity: 0.5,
    },

    cancelText: {
        color: '#b91c1c',
        fontWeight: '700',
    },
});