import type {
    HealthRecordListParams,
} from '@/features/health-records/types/health-record.types';


import { mockDatabase } from '@/mocks/db/mockDatabase';
import { mockTransport } from '@/mocks/transport/mockTransport';
import { paginate } from './pagination';

export async function getHealthRecords(
    params: HealthRecordListParams,
) {
    return mockTransport(
        {
            method: 'GET',
            path: '/health-records',
        },
        () => {
            let records = [...mockDatabase.healthRecords];

            if (params.search?.trim()) {
                const query = params.search.trim().toLowerCase();

                records = records.filter(record =>
                    [
                        record.title,
                        record.description,
                        record.doctorName ?? '',
                        record.facilityName ?? '',
                        ...record.tags,
                    ]
                        .join(' ')
                        .toLowerCase()
                        .includes(query),
                );
            }

            if (params.filters?.types?.length) {
                records = records.filter(record =>
                    params.filters!.types!.includes(record.type),
                );
            }

            if (params.filters?.tags?.length) {
                records = records.filter(record =>
                    params.filters!.tags!.some(tag =>
                        record.tags.includes(tag),
                    ),
                );
            }

            if (params.filters?.fromDate) {
                const from = new Date(params.filters.fromDate).getTime();
                records = records.filter(
                    record => new Date(record.date).getTime() >= from,
                );
            }

            if (params.filters?.toDate) {
                const to = new Date(params.filters.toDate).getTime();
                records = records.filter(
                    record => new Date(record.date).getTime() <= to,
                );
            }

            return paginate(
                records,
                params.page,
                params.pageSize,
            );
        },
    );
}

export async function getHealthRecordById(
    recordId: string,
) {
    return mockTransport(
        {
            method: 'GET',
            path: `/health-records/${recordId}`,
        },
        () => {
            const record = mockDatabase.healthRecords.find(
                item => item.id === recordId,
            );

            if (!record) {
                throw new Error('HEALTH_RECORD_NOT_FOUND');
            }

            return record;
        },
    ).then(response => response.data);
}
