import { useGetHealthRecordsQuery } from '../api/healthRecordsApi';

import type { HealthRecordListParams } from '../types/health-record.types';

export function useHealthRecords(
    params: HealthRecordListParams,
) {
    return useGetHealthRecordsQuery(params);
}
