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
import { useAppTheme } from '@/app/providers/ThemeProvider';

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
    const { theme } = useAppTheme();

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
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                },
            ]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Confirmed Consultation
                </Text>
                <View style={[styles.badge, { backgroundColor: theme.mode === 'dark' ? '#1f3d2b' : '#e6f4ea' }]}>
                    <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                        {booking.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <Text style={[styles.row, { color: theme.colors.text }]}>
                👨‍⚕️ Doctor: <Text style={styles.bold}>{doctorName ?? booking.doctorId}</Text>
            </Text>

            <Text style={[styles.row, { color: theme.colors.text }]}>
                🗓️ Date:{' '}
                <Text style={styles.bold}>
                    {new Date(booking.scheduledAt).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}
                </Text>
            </Text>

            <Text style={[styles.row, { color: theme.colors.text }]}>
                ⏰ Time: <Text style={styles.bold}>{formatTime(booking.scheduledAt)}</Text>
            </Text>

            <Text style={[styles.row, { color: theme.colors.text }]}>
                📹 Mode: <Text style={[styles.bold, styles.capitalize]}>{booking.mode}</Text>
            </Text>

            <Text style={[styles.row, { color: theme.colors.text }]}>
                👤 Patient: <Text style={styles.bold}>{booking.patientName}</Text>
            </Text>

            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Cancel consultation for ${booking.patientName}`}
                disabled={isCancelling}
                onPress={handleCancelPress}
                style={[
                    styles.cancelButton,
                    { borderColor: theme.colors.danger },
                    isCancelling && styles.disabled,
                ]}>
                <Text style={[styles.cancelText, { color: theme.colors.danger }]}>
                    {isCancelling ? 'Cancelling...' : 'Cancel Consultation'}
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
        borderRadius: 14,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    title: {
        fontSize: 16,
        fontWeight: '700',
    },

    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },

    badgeText: {
        fontSize: 11,
        fontWeight: '800',
    },

    row: {
        marginTop: 6,
        fontSize: 14,
    },

    bold: {
        fontWeight: '600',
    },

    capitalize: {
        textTransform: 'capitalize',
    },

    cancelButton: {
        marginTop: 16,
        minHeight: 44,
        borderWidth: 1.5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    disabled: {
        opacity: 0.5,
    },

    cancelText: {
        fontWeight: '700',
        fontSize: 14,
    },
});