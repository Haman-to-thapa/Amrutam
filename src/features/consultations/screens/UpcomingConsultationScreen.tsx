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
import { PendingBookingCard } from '../components/PendingBookingCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectBookingQueue } from '@/store/selectors/offlineQueueSelectors';
import { showToast } from '@/store/slices/toastSlice';
import type { Booking } from '../types/consultation.types';
import { useAppTheme } from '@/app/providers/ThemeProvider';

export function UpcomingConsultationScreen() {
    const { theme } = useAppTheme();
    const dispatch = useAppDispatch();
    const queuedBookings = useAppSelector(selectBookingQueue);

    const visibleQueue = queuedBookings.filter(
        item =>
            item.status === 'pending' ||
            item.status === 'syncing' ||
            item.status === 'failed' ||
            item.status === 'conflict',
    );

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

    if (isLoading && visibleQueue.length === 0) {
        return <LoadingState />;
    }

    if (isError && visibleQueue.length === 0) {
        return (
            <ErrorState
                message={
                    error &&
                        typeof error === 'object' &&
                        'error' in error &&
                        typeof error.error === 'string'
                        ? error.error
                        : 'Unable to load consultations.'
                }
                onRetry={refetch}
            />
        );
    }

    if (bookings.length === 0 && visibleQueue.length === 0) {
        return (
            <EmptyState
                title="No upcoming consultations"
                message="Your confirmed consultations will appear here."
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {isFetching ? (
                <Text style={[styles.refreshing, { color: theme.colors.textSecondary }]}>
                    Updating...
                </Text>
            ) : null}

            <FlashList
                data={bookings}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={

                    visibleQueue.length > 0 ? (
                        <View style={styles.queueContainer}>
                            <Text style={[styles.queueHeader, { color: theme.colors.warning }]}>
                                Offline & Pending Bookings ({visibleQueue.length})
                            </Text>
                            {visibleQueue.map(item => (
                                <PendingBookingCard
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </View>
                    ) : null
                }
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
    },

    content: {
        paddingVertical: 16,
        paddingBottom: 32,
    },

    queueContainer: {
        marginBottom: 8,
    },

    queueHeader: {
        fontSize: 14,
        fontWeight: '700',
        marginHorizontal: 16,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    refreshing: {
        paddingHorizontal: 16,
        paddingTop: 10,
        fontSize: 12,
    },
});