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

            return paginate(
                records,
                params.page,
                params.pageSize,
            );
        },
    );
}