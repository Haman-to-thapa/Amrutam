import { useGetDoctorByIdQuery } from '../api/consultationApi';

export function useUpcomingBookingDoctor(
    doctorId: string,
) {
    return useGetDoctorByIdQuery(doctorId);
}