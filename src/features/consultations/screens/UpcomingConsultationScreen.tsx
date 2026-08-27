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

import { useGetUpcomingBookingsQuery } from '../api/bookingApi';
import { useCancelBookingMutation } from '../api/cancelBookingApi';
import { UpcomingBookingCard } from '../components/UpcomingBookingCard';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';
import type { Booking } from '../types/consultation.types';

export function UpcomingConsultationScreen() {
    const dispatch = useAppDispatch();

    const {
        data: bookings = [],
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetUpcomingBookingsQuery();

    const [
        cancelBooking,
        {
            isLoading: isCancelling,
        },
    ] = useCancelBookingMutation();

    const handleCancel = useCallback(
        async (booking: Booking) => {
            try {
                await cancelBooking({
                    bookingId: booking.id,
                }).unwrap();

                dispatch(
                    showToast({
                        type: 'success',
                        message:
                            'Consultation cancelled successfully.',
                    }),
                );
            } catch (err) {
                const message =
                    err &&
                        typeof err === 'object' &&
                        'message' in err &&
                        typeof err.message === 'string'
                        ? err.message
                        : 'Unable to cancel consultation.';

                dispatch(
                    showToast({
                        type: 'error',
                        message,
                    }),
                );
            }
        },
        [cancelBooking, dispatch],
    );

    const renderItem = useCallback(
        ({ item }: { item: Booking }) => (
            <UpcomingBookingCard
                booking={item}
                onCancel={handleCancel}
                isCancelling={isCancelling}
            />
        ),
        [handleCancel, isCancelling],
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
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching && !isLoading}
                        onRefresh={() => {
                            refetch();
                        }}
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
        backgroundColor: '#f8f9fa',
    },

    content: {
        padding: 16,
        paddingBottom: 32,
    },

    refreshing: {
        paddingHorizontal: 16,
        paddingTop: 10,
        fontSize: 12,
        color: '#6b7280',
    },
});