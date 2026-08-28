import type { HealthRecord } from '../types/health-record.types';

export type HealthRecordSection = {
    title: string;
    year: number;
    month: number;
    data: HealthRecord[];
};

export function groupRecordsByMonthYear(
    records: HealthRecord[],
): HealthRecordSection[] {
    const groups = new Map<string, HealthRecordSection>();

    for (const record of records) {
        const date = new Date(record.date);

        const year = date.getFullYear();
        const month = date.getMonth();

        const key = `${year}-${month}`;

        const existing = groups.get(key);

        if (existing) {
            existing.data.push(record);
            continue;
        }

        groups.set(key, {
            title: date.toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric',
            }),
            year,
            month,
            data: [record],
        });
    }

    return Array.from(groups.values()).sort((a, b) => {
        if (a.year !== b.year) {
            return b.year - a.year;
        }

        return b.month - a.month;
    });
}
