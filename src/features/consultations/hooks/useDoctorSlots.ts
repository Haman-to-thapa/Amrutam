import { useGetDoctorSlotsQuery } from '../api/consultationApi';

type Params = {
    doctorId: string;
    date: string;
};

export function useDoctorSlots(params: Params) {
    return useGetDoctorSlotsQuery(params);
}