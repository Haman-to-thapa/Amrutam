import { baseApi } from '@/core/api/baseApi';
import type { PaginatedResponse } from '@/core/api/api.types';
import {
    loadDoctorsCache,
    saveDoctorsCache,
} from '@/core/storage/apiCacheStorage';
import { createCacheKey } from '@/core/utils/cacheKey';
import {
    getDoctorSlots,
    getDoctors,
    getDoctorById,
    createBooking,
} from '@/mocks/repositories';
import type {
    Doctor,
    DoctorListParams,
    DoctorSlot,
    CreateBookingRequest,
    Booking,
} from '../types/consultation.types';

export const consultationApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getDoctors: builder.query<
            PaginatedResponse<Doctor>,
            DoctorListParams
        >({
            async queryFn(params) {
                const paramsKey = createCacheKey(params);

                try {
                    const response = await getDoctors(params);

                    saveDoctorsCache({
                        paramsKey,
                        data: response.data,
                        savedAt: Date.now(),
                    });

                    return {
                        data: response.data,
                    };
                } catch (error) {
                    const cached = loadDoctorsCache();

                    if (
                        cached &&
                        cached.paramsKey === paramsKey
                    ) {
                        return {
                            data: cached.data,
                        };
                    }

                    return {
                        error: {
                            code: 'UNKNOWN',
                            message:
                                error instanceof Error
                                    ? error.message
                                    : 'Unable to load doctors.',
                            details:
                                error instanceof Error
                                    ? error.message
                                    : undefined,
                        },
                    };
                }
            },

            providesTags: result =>
                result
                    ? [
                        { type: 'Doctor' as const, id: 'LIST' },
                        ...result.data.map(doctor => ({
                            type: 'Doctor' as const,
                            id: doctor.id,
                        })),
                    ]
                    : [{ type: 'Doctor' as const, id: 'LIST' }],
        }),

        getDoctorById: builder.query<Doctor, string>({
            async queryFn(doctorId) {
                try {
                    const doctor = await getDoctorById(doctorId);

                    return {
                        data: doctor,
                    };
                } catch (error) {
                    return {
                        error: {
                            code: 'NOT_FOUND',
                            message: 'Doctor could not be found.',
                            details:
                                error instanceof Error
                                    ? error.message
                                    : undefined,
                        },
                    };
                }
            },
            providesTags: (_result, _error, doctorId) => [
                {
                    type: 'Doctor' as const,
                    id: doctorId,
                },
            ],
        }),

        getDoctorSlots: builder.query<
            DoctorSlot[],
            {
                doctorId: string;
                date: string;
            }
        >({
            async queryFn(params) {
                try {
                    const response = await getDoctorSlots(
                        params.doctorId,
                        params.date,
                    );

                    return {
                        data: response,
                    };
                } catch (error) {
                    return {
                        error: {
                            code: 'UNKNOWN',
                            message:
                                error instanceof Error
                                    ? error.message
                                    : 'Unable to load slots.',
                            details:
                                error instanceof Error
                                    ? error.message
                                    : undefined,
                        },
                    };
                }
            },
            providesTags: (_result, _error, arg) => [
                {
                    type: 'Slot' as const,
                    id: `${arg.doctorId}-${arg.date}`,
                },
            ],
        }),

        createBooking: builder.mutation<
            Booking,
            CreateBookingRequest
        >({
            async queryFn(request) {
                try {
                    const booking = await createBooking(request);

                    return {
                        data: booking,
                    };
                } catch (error) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : 'Unable to create booking.';

                    if (message === 'SLOT_EXPIRED') {
                        return {
                            error: {
                                code: 'VALIDATION_ERROR',
                                message:
                                    'This consultation slot has expired.',
                            },
                        };
                    }

                    if (
                        message === 'BOOKING_CONFLICT' ||
                        message === 'SLOT_UNAVAILABLE'
                    ) {
                        return {
                            error: {
                                code: 'CONFLICT',
                                message:
                                    'This consultation slot is no longer available.',
                            },
                        };
                    }

                    if (message === 'DUPLICATE_BOOKING') {
                        return {
                            error: {
                                code: 'CONFLICT',
                                message:
                                    'You have already booked this consultation slot.',
                            },
                        };
                    }

                    if (message === 'DOCTOR_NOT_FOUND') {
                        return {
                            error: {
                                code: 'NOT_FOUND',
                                message: 'Doctor could not be found.',
                            },
                        };
                    }

                    if (message === 'SLOT_NOT_FOUND') {
                        return {
                            error: {
                                code: 'NOT_FOUND',
                                message: 'Consultation slot could not be found.',
                            },
                        };
                    }

                    return {
                        error: {
                            code: 'UNKNOWN',
                            message: 'Unable to create booking.',
                        },
                    };
                }
            },

            invalidatesTags: (_result, _error, request) => [
                {
                    type: 'Slot' as const,
                    id: `${request.doctorId}-${request.date}`,
                },
                {
                    type: 'Booking' as const,
                    id: 'LIST',
                },
            ],

        }),
    }),
});

export const {
    useGetDoctorsQuery,
    useGetDoctorByIdQuery,
    useGetDoctorSlotsQuery,
    useCreateBookingMutation,
} = consultationApi;

