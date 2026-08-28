import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { BookingQueueItem } from '@/core/sync/sync.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

type Props = {
    item: BookingQueueItem;
};

function PendingBookingCardComponent({ item }: Props) {
    const { theme } = useAppTheme();
    const isSyncing = item.status === 'syncing';
    const isFailed = item.status === 'failed';
    const isConflict = item.status === 'conflict';

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: isConflict
                        ? theme.colors.danger
                        : isFailed
                            ? theme.colors.warning
                            : theme.colors.border,
                },
            ]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    {isConflict
                        ? '⚠️ Booking Conflict'
                        : isFailed
                            ? '🔄 Booking Pending Retry'
                            : isSyncing
                                ? '⚡ Syncing Consultation...'
                                : '⏳ Queued Consultation'}
                </Text>
                <View
                    style={[
                        styles.badge,
                        {
                            backgroundColor: isConflict
                                ? theme.mode === 'dark' ? '#3b1818' : '#fee2e2'
                                : isFailed
                                    ? theme.mode === 'dark' ? '#382310' : '#fed7aa'
                                    : theme.mode === 'dark' ? '#1f3d2b' : '#e6f4ea',
                        },
                    ]}>
                    <Text
                        style={[
                            styles.badgeText,
                            {
                                color: isConflict
                                    ? theme.colors.danger
                                    : isFailed
                                        ? theme.colors.warning
                                        : theme.colors.primary,
                            },
                        ]}>
                        {isSyncing
                            ? 'Syncing'
                            : isConflict
                                ? 'Conflict'
                                : isFailed
                                    ? `Retry (${item.retryCount})`
                                    : 'Offline Queued'}
                    </Text>
                </View>
            </View>

            <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>
                Patient: <Text style={[styles.bold, { color: theme.colors.text }]}>{item.request.patientName}</Text>
            </Text>
            <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>
                Date: <Text style={[styles.bold, { color: theme.colors.text }]}>{item.request.date}</Text>
            </Text>
            <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>
                Mode: <Text style={[styles.bold, { color: theme.colors.text }]}>{item.request.mode.toUpperCase()}</Text>
            </Text>

            {item.lastError ? (
                <Text style={[styles.errorText, { color: theme.colors.danger }]}>
                    {item.lastError === 'BOOKING_CONFLICT'
                        ? 'This slot was booked by another patient while you were offline.'
                        : `Notice: ${item.lastError}`}
                </Text>
            ) : (
                <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
                    Will automatically sync with the server once internet is restored.
                </Text>
            )}
        </View>
    );
}

export const PendingBookingCard = memo(
    PendingBookingCardComponent,
);

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    title: {
        fontSize: 15,
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

    detail: {
        fontSize: 13,
        marginBottom: 3,
    },

    bold: {
        fontWeight: '600',
    },

    hint: {
        marginTop: 8,
        fontSize: 11,
        fontStyle: 'italic',
    },

    errorText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
    },
});

