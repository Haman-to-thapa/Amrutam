import { baseApi } from '@/core/api/baseApi';
import type { PaginatedResponse } from '@/core/api/api.types';
import { getDoctorSlots, getDoctors } from '@/mocks/repositories';
import type {
    Doctor,
    DoctorListParams,
    DoctorSlot,
} from '../types/consultation.types';

export const consultationApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getDoctors: builder.query<
            PaginatedResponse<Doctor>,
            DoctorListParams
        >({
            async queryFn(params) {
                try {
                    const response = await getDoctors(params);

                    return {
                        data: response.data,
                    };
                } catch (error) {
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
    }),
});

export const {
    useGetDoctorsQuery,
    useGetDoctorSlotsQuery,
} = consultationApi;