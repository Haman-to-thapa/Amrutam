import { baseApi } from '@/core/api/baseApi';
import type { PaginatedResponse } from '@/core/api/api.types';
import { getDoctors } from '@/mocks/repositories';
import type {
    Doctor,
    DoctorListParams,
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
                            details: error,
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
    }),
});

export const { useGetDoctorsQuery } = consultationApi;