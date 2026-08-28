import { useGetHealthRecordByIdQuery } from '../api/healthRecordsApi';

export function useHealthRecordDetails(recordId: string) {
    return useGetHealthRecordByIdQuery(recordId);
}
