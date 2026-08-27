import type {
    Doctor,
    DoctorListParams,
} from '@/features/consultations/types/consultation.types';
import { mockDatabase } from '@/mocks/db/mockDatabase';
import { mockTransport } from '@/mocks/transport/mockTransport';
import { paginate } from './pagination';
import { generateSlotsForDoctor } from '@/mocks/generators/slotGenerator';



export async function getDoctors(
    params: DoctorListParams,
) {
    return mockTransport(
        {
            method: 'GET',
            path: '/doctors',
        },
        () => {
            let doctors = [...mockDatabase.doctors];

            if (params.search?.trim()) {
                const query = params.search.trim().toLowerCase();

                doctors = doctors.filter(doctor =>
                    [
                        doctor.name,
                        doctor.specialization,
                        ...doctor.languages,
                    ]
                        .join(' ')
                        .toLowerCase()
                        .includes(query),
                );
            }

            if (params.filters?.specialization) {
                doctors = doctors.filter(
                    doctor =>
                        doctor.specialization ===
                        params.filters?.specialization,
                );
            }

            if (params.filters?.gender) {
                doctors = doctors.filter(
                    doctor => doctor.gender === params.filters?.gender,
                );
            }

            if (params.filters?.mode) {
                doctors = doctors.filter(doctor =>
                    doctor.consultationModes.includes(
                        params.filters!.mode!,
                    ),
                );
            }

            if (
                params.filters?.minExperienceYears !== undefined
            ) {
                doctors = doctors.filter(
                    doctor =>
                        doctor.experienceYears >=
                        params.filters!.minExperienceYears!,
                );
            }

            if (params.filters?.minRating !== undefined) {
                doctors = doctors.filter(
                    doctor =>
                        doctor.rating >= params.filters!.minRating!,
                );
            }

            return paginate(
                doctors,
                params.page,
                params.pageSize,
            );
        },
    );
}

export async function getDoctorSlots(
    doctorId: string,
    date: string,
) {
    return mockTransport(
        {
            method: 'GET',
            path: `/doctors/${doctorId}/slots`,
            query: {
                date,
            },
        },
        () => {
            const [year, month, day] = date.split('-').map(Number);
            const selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);

            const slots = generateSlotsForDoctor(
                doctorId,
                selectedDate,
            );


            return slots.map(slot => {
                const booked = mockDatabase.bookings.some(
                    booking =>
                        booking.slotId === slot.id &&
                        booking.status === 'confirmed',
                );

                return booked
                    ? {
                        ...slot,
                        status: 'booked' as const,
                    }
                    : slot;
            });
        },
    ).then(response => response.data);
}


export async function getDoctorById(
    doctorId: string,
): Promise<Doctor> {
    return mockTransport(
        {
            method: 'GET',
            path: `/doctors/${doctorId}`,
        },
        () => {
            const doctor = mockDatabase.doctors.find(
                item => item.id === doctorId,
            );

            if (!doctor) {
                throw new Error('DOCTOR_NOT_FOUND');
            }

            return doctor;
        },
    ).then(response => response.data);
}