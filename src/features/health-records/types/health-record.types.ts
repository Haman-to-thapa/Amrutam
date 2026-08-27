import type { ID, ISODateString } from '@/types/common';

export type HealthRecordType =
    | 'lab_report'
    | 'prescription'
    | 'consultation'
    | 'vaccination'
    | 'allergy';

export type AttachmentType = 'image' | 'pdf';

export type Attachment = {
    id: ID;
    type: AttachmentType;
    uri: string;
    thumbnailUri?: string;
    fileName: string;
    mimeType: string;
    sizeBytes?: number;
};

export type HealthRecord = {
    id: ID;
    type: HealthRecordType;
    title: string;
    description: string;
    date: ISODateString;
    doctorName?: string;
    facilityName?: string;
    tags: string[];
    attachments: Attachment[];
    metadata: Record<string, string>;
};

export type HealthRecordFilters = {
    types?: HealthRecordType[];
    tags?: string[];
    fromDate?: string;
    toDate?: string;
};

export type HealthRecordListParams = {
    page: number;
    pageSize: number;
    search?: string;
    filters?: HealthRecordFilters;
};