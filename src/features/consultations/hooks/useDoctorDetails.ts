import { consultationApi } from '../api/consultationApi';

export function useDoctorDetails(doctorId: string) {
    return consultationApi.useGetDoctorByIdQuery(doctorId, {
        skip: !doctorId,
    });
}
