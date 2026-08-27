import React, { useCallback } from 'react';
import {
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { formatTime } from '@/core/utils/date';

import { useGetUpcomingBookingsQuery } from '../api/bookingApi';
import type { Booking } from '../types/consultation.types';

export function UpcomingConsultationScreen() {
    const {
        data: bookings = [],
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetUpcomingBookingsQuery();

    const renderItem = useCallback(
        ({ item }: { item: Booking }) => (
            <View style={styles.card}>
                <Text style={styles.title}>
                    Consultation
                </Text>

                <Text style={styles.row}>
                    Doctor ID: {item.doctorId}
                </Text>

                <Text style={styles.row}>
                    Date:{' '}
                    {new Date(item.scheduledAt).toLocaleDateString(
                        'en-IN',
                    )}
                </Text>

                <Text style={styles.row}>
                    Time: {formatTime(item.scheduledAt)}
                </Text>

                <Text style={styles.row}>
                    Mode: {item.mode}
                </Text>

                <Text style={styles.row}>
                    Patient: {item.patientName}
                </Text>

                <Text style={styles.status}>
                    {item.status}
                </Text>
            </View>
        ),
        [],
    );

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return (
            <ErrorState
                message={
                    error &&
                        typeof error === 'object' &&
                        'message' in error &&
                        typeof error.message === 'string'
                        ? error.message
                        : 'Unable to load consultations.'
                }
                onRetry={refetch}
            />
        );
    }

    if (bookings.length === 0) {
        return (
            <EmptyState
                title="No upcoming consultations"
                message="Your confirmed consultations will appear here."
            />
        );
    }

    return (
        <View style={styles.container}>
            {isFetching ? (
                <Text style={styles.refreshing}>
                    Updating...
                </Text>
            ) : null}

            <FlashList
                data={bookings}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                // estimatedItemSize={170}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching && !isLoading}
                    // onRefresh={refetch}
                    />
                }
                contentContainerStyle={styles.content}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        padding: 16,
    },

    refreshing: {
        paddingHorizontal: 16,
        paddingTop: 10,
        fontSize: 12,
    },

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
        marginBottom: 8,
    },

    row: {
        marginTop: 5,
        fontSize: 14,
    },

    status: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
});