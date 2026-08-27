import { baseApi } from '@/core/api/baseApi';
import { getUpcomingBookings } from '@/mocks/repositories';

import type { Booking } from '../types/consultation.types';

export const bookingApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getUpcomingBookings: builder.query<
            Booking[],
            void
        >({
            async queryFn() {
                try {
                    return {
                        data: getUpcomingBookings(),
                    };
                } catch {
                    return {
                        error: {
                            code: 'UNKNOWN',
                            message:
                                'Unable to load upcoming consultations.',
                        },
                    };
                }
            },

            providesTags: [
                {
                    type: 'Booking' as const,
                    id: 'LIST',
                },
            ],
        }),
    }),
});

export const {
    useGetUpcomingBookingsQuery,
} = bookingApi;