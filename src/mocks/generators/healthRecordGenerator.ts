import type {
    Attachment,
    HealthRecord,
    HealthRecordType,
} from '@/features/health-records/types/health-record.types';

import { createSeededRandom } from './seededRandom';

const RECORD_TYPES: readonly HealthRecordType[] = [
    'lab_report',
    'prescription',
    'consultation',
    'vaccination',
    'allergy',
];

const TAGS = [
    'general',
    'wellness',
    'blood-test',
    'follow-up',
    'preventive',
    'ayurveda',
];

const DOCTORS = [
    'Dr. Ananya Sharma',
    'Dr. Rohan Das',
    'Dr. Priya Verma',
    'Dr. Meera Patel',
    'Dr. Arjun Singh',
];

function createDate(
    random: ReturnType<typeof createSeededRandom>,
    index: number,
): string {
    const now = new Date();
    const daysAgo = random.integer(0, 730);

    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    date.setHours(
        8 + (index % 10),
        (index * 7) % 60,
        0,
        0,
    );

    return date.toISOString();
}

function createAttachments(
    random: ReturnType<typeof createSeededRandom>,
    index: number,
): Attachment[] {
    if (!random.boolean(0.6)) {
        return [];
    }

    const type = random.boolean()
        ? 'image'
        : 'pdf';

    return [
        {
            id: `attachment-${index}`,
            type,
            uri:
                type === 'image'
                    ? `https://picsum.photos/seed/record-${index}/800/1000`
                    : `https://example.invalid/files/record-${index}.pdf`,
            thumbnailUri:
                type === 'image'
                    ? `https://picsum.photos/seed/record-${index}/150/200`
                    : undefined,
            fileName:
                type === 'image'
                    ? `report-${index}.jpg`
                    : `report-${index}.pdf`,
            mimeType:
                type === 'image'
                    ? 'image/jpeg'
                    : 'application/pdf',
            sizeBytes: random.integer(50_000, 4_000_000),
        },
    ];
}

export function generateHealthRecords(
    count: number,
    seed = 3001,
): HealthRecord[] {
    const random = createSeededRandom(seed);

    return Array.from({ length: count }, (_, index) => {
        const type = random.pick(RECORD_TYPES);

        return {
            id: `record-${String(index + 1).padStart(5, '0')}`,
            type,
            title:
                type === 'lab_report'
                    ? 'Blood Test Report'
                    : type === 'prescription'
                        ? 'Ayurvedic Prescription'
                        : type === 'consultation'
                            ? 'Doctor Consultation'
                            : type === 'vaccination'
                                ? 'Vaccination Record'
                                : 'Allergy Record',
            description:
                'Patient health record maintained for longitudinal care.',
            date: createDate(random, index),
            doctorName: random.pick(DOCTORS),
            facilityName: 'Amrutam Wellness Center',
            tags: [
                ...new Set([
                    random.pick(TAGS),
                    random.pick(TAGS),
                ]),
            ],
            attachments: createAttachments(random, index),
            metadata: {
                source: 'mock',
                recordVersion: '1',
            },
        };
    });
}