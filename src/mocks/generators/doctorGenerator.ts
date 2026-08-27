import type {
    ConsultationMode,
    Doctor,
    DoctorGender,
    DoctorSpecialization,
} from '@/features/consultations/types/consultation.types';

import { createSeededRandom } from './seededRandom';

const FIRST_NAMES = [
    'Ananya',
    'Arjun',
    'Aarav',
    'Diya',
    'Ishita',
    'Kabir',
    'Meera',
    'Neha',
    'Rohan',
    'Priya',
    'Rahul',
    'Sneha',
];

const LAST_NAMES = [
    'Sharma',
    'Verma',
    'Patel',
    'Das',
    'Bora',
    'Thapa',
    'Singh',
    'Kumar',
    'Dutta',
    'Mehta',
];

const SPECIALIZATIONS: readonly DoctorSpecialization[] = [
    'Ayurvedic Physician',
    'Panchakarma',
    'Dermatology',
    'Digestive Health',
    'Women Health',
    'Stress Management',
];

const GENDERS: readonly DoctorGender[] = [
    'male',
    'female',
    'other',
];

const MODES: readonly ConsultationMode[] = [
    'video',
    'audio',
    'chat',
];

const LANGUAGES = [
    'English',
    'Hindi',
    'Assamese',
    'Bengali',
];

export function generateDoctors(
    count: number,
    seed = 1001,
): Doctor[] {
    const random = createSeededRandom(seed);

    return Array.from({ length: count }, (_, index) => {
        const firstName = random.pick(FIRST_NAMES);
        const lastName = random.pick(LAST_NAMES);

        const modeCount = random.integer(1, MODES.length);
        const shuffledModes = [...MODES].sort(
            () => random.next() - 0.5,
        );

        const languages = [
            ...new Set([
                random.pick(LANGUAGES),
                random.pick(LANGUAGES),
                'English',
            ]),
        ];

        return {
            id: `doctor-${String(index + 1).padStart(5, '0')}`,
            name: `Dr. ${firstName} ${lastName}`,
            avatarUrl: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
            gender: random.pick(GENDERS),
            specialization: random.pick(SPECIALIZATIONS),
            experienceYears: random.integer(2, 25),
            rating: Number(
                (3.5 + random.next() * 1.5).toFixed(1),
            ),
            reviewCount: random.integer(20, 5000),
            languages,
            consultationModes: shuffledModes.slice(0, modeCount),
            consultationFee: random.integer(300, 1800),
            bio: 'Experienced Ayurvedic practitioner focused on personalized care and holistic wellness.',
            isVerified: random.boolean(0.9),
        };
    });
}