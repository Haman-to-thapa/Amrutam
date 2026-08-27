import { useGetDoctorsQuery } from '../api/consultationApi';
import type { DoctorListParams } from '../types/consultation.types';

export function useDoctors(params: DoctorListParams) {
    return useGetDoctorsQuery(params);
}