import type {
    ConsultationMode,
    DoctorSlot,
    SlotStatus,
} from '@/features/consultations/types/consultation.types';
import { createSeededRandom } from './seededRandom';

const SLOT_MODES: readonly ConsultationMode[] = [
    'video',
    'audio',
    'chat',
];

export function generateSlotsForDoctor(
    doctorId: string,
    date: Date,
    seed = 4001,
): DoctorSlot[] {
    const random = createSeededRandom(
        seed + Number.parseInt(doctorId.replace(/\D/g, ''), 10),
    );

    const slots: DoctorSlot[] = [];

    for (let hour = 9; hour <= 17; hour += 1) {
        for (const minute of [0, 30]) {
            const startsAt = new Date(date);
            startsAt.setHours(hour, minute, 0, 0);

            const endsAt = new Date(startsAt);
            endsAt.setMinutes(endsAt.getMinutes() + 30);

            let status: SlotStatus = 'available';

            const availabilityRoll = random.next();

            if (availabilityRoll < 0.12) {
                status = 'booked';
            } else if (availabilityRoll < 0.15) {
                status = 'blocked';
            }

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            slots.push({
                id: `slot-${doctorId}-${dateStr}-${hour}-${minute}`,
                doctorId,
                startsAt: startsAt.toISOString(),
                endsAt: endsAt.toISOString(),
                status,
                mode: random.pick(SLOT_MODES),
            });

        }
    }

    return slots;
}