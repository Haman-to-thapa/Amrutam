import { baseApi } from '@/core/api/baseApi';
import { cancelBooking } from '@/mocks/repositories';

import type {
    Booking,
    CancelBookingRequest,
} from '../types/consultation.types';

export const cancelBookingApi =
    baseApi.injectEndpoints({
        endpoints: builder => ({
            cancelBooking: builder.mutation<
                Booking,
                CancelBookingRequest
            >({
                async queryFn(request) {
                    try {
                        const booking =
                            await cancelBooking(request);

                        return {
                            data: booking,
                        };
                    } catch (error) {
                        const message =
                            error instanceof Error
                                ? error.message
                                : 'Unable to cancel booking.';

                        switch (message) {
                            case 'BOOKING_NOT_FOUND':
                                return {
                                    error: {
                                        code: 'NOT_FOUND',
                                        message:
                                            'Consultation booking was not found.',
                                    },
                                };

                            case 'BOOKING_ALREADY_CANCELLED':
                                return {
                                    error: {
                                        code: 'CONFLICT',
                                        message:
                                            'This consultation is already cancelled.',
                                    },
                                };

                            case 'BOOKING_NOT_CANCELLABLE':
                                return {
                                    error: {
                                        code: 'VALIDATION_ERROR',
                                        message:
                                            'This consultation cannot be cancelled.',
                                    },
                                };

                            case 'BOOKING_EXPIRED':
                                return {
                                    error: {
                                        code: 'VALIDATION_ERROR',
                                        message:
                                            'A past consultation cannot be cancelled.',
                                    },
                                };

                            default:
                                return {
                                    error: {
                                        code: 'UNKNOWN',
                                        message:
                                            'Unable to cancel consultation.',
                                    },
                                };
                        }
                    }
                },

                invalidatesTags: result => [
                    {
                        type: 'Booking' as const,
                        id: 'LIST',
                    },
                    ...(result
                        ? [
                            {
                                type: 'Slot' as const,
                                id: `${result.doctorId}-${result.scheduledAt.slice(0, 10)}`,
                            },
                        ]
                        : []),
                ],

            }),
        }),
    });

export const {
    useCancelBookingMutation,
} = cancelBookingApi;