import { baseApi } from '@/core/api/baseApi';
import type { PaginatedResponse } from '@/core/api/api.types';
import {
    getHealthRecordById,
    getHealthRecords,
} from '@/mocks/repositories';

import type {
    HealthRecord,
    HealthRecordListParams,
} from '../types/health-record.types';

export const healthRecordsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getHealthRecords: builder.query<
            PaginatedResponse<HealthRecord>,
            HealthRecordListParams
        >({
            async queryFn(params) {
                try {
                    const response = await getHealthRecords(params);

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
                                    : 'Unable to load health records.',
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
                        {
                            type: 'HealthRecord' as const,
                            id: 'LIST',
                        },
                        ...result.data.map(record => ({
                            type: 'HealthRecord' as const,
                            id: record.id,
                        })),
                    ]
                    : [
                        {
                            type: 'HealthRecord' as const,
                            id: 'LIST',
                        },
                    ],
        }),

        getHealthRecordById: builder.query<HealthRecord, string>({
            async queryFn(recordId) {
                try {
                    const record = await getHealthRecordById(recordId);

                    return {
                        data: record,
                    };
                } catch (error) {
                    return {
                        error: {
                            code: 'NOT_FOUND',
                            message:
                                error instanceof Error
                                    ? error.message
                                    : 'Health record not found.',
                        },
                    };
                }
            },

            providesTags: (_result, _error, recordId) => [
                {
                    type: 'HealthRecord' as const,
                    id: recordId,
                },
            ],
        }),
    }),
});

export const {
    useGetHealthRecordsQuery,
    useGetHealthRecordByIdQuery,
} = healthRecordsApi;

