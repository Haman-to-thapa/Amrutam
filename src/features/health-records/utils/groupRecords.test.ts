import { groupRecordsByMonthYear } from './groupRecords';
import type { HealthRecord } from '../types/health-record.types';

describe('groupRecordsByMonthYear', () => {
    it('groups records by month and year in descending chronological order', () => {
        const records: HealthRecord[] = [
            {
                id: 'record-1',
                type: 'lab_report',
                title: 'Blood Test Report',
                description: 'Complete blood count',
                date: '2026-08-10T10:00:00.000Z',
                tags: ['blood', 'routine'],
                attachments: [],
                metadata: {},
            },
            {
                id: 'record-2',
                type: 'prescription',
                title: 'Ayurvedic Herb Prescription',
                description: 'Ashwagandha and Brahmi',
                date: '2026-08-20T10:00:00.000Z',
                tags: ['ayurveda'],
                attachments: [],
                metadata: {},
            },
            {
                id: 'record-3',
                type: 'vaccination',
                title: 'Flu Vaccination',
                description: 'Annual booster',
                date: '2026-07-05T10:00:00.000Z',
                tags: ['immunity'],
                attachments: [],
                metadata: {},
            },
        ];

        const result = groupRecordsByMonthYear(records);

        expect(result).toHaveLength(2);

        expect(result[0].title).toContain('August');
        expect(result[0].year).toBe(2026);
        expect(result[0].data).toHaveLength(2);

        expect(result[1].title).toContain('July');
        expect(result[1].year).toBe(2026);
        expect(result[1].data).toHaveLength(1);
    });

    it('handles empty records array gracefully', () => {
        const result = groupRecordsByMonthYear([]);
        expect(result).toEqual([]);
    });

    it('sorts records newest first inside a month', () => {
        const records: HealthRecord[] = [
            {
                id: 'record-old',
                type: 'lab_report',
                title: 'Old',
                description: '',
                date: '2026-08-01T10:00:00.000Z',
                tags: [],
                attachments: [],
                metadata: {},
            },
            {
                id: 'record-new',
                type: 'lab_report',
                title: 'New',
                description: '',
                date: '2026-08-20T10:00:00.000Z',
                tags: [],
                attachments: [],
                metadata: {},
            },
        ];

        const result = groupRecordsByMonthYear(records);

        expect(result[0].data[0].id).toBe('record-new');
        expect(result[0].data[1].id).toBe('record-old');
    });
});

