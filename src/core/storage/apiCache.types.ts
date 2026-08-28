import type { Doctor } from '@/features/consultations/types/consultation.types';
import type { Product } from '@/features/shop/types/shop.types';
import type { HealthRecord } from '@/features/health-records/types/health-record.types';

import type { PaginatedResponse } from '@/core/api/api.types';

export type CachedDoctors = {
    paramsKey: string;
    data: PaginatedResponse<Doctor>;
    savedAt: number;
};

export type CachedProducts = {
    paramsKey: string;
    data: PaginatedResponse<Product>;
    savedAt: number;
};

export type CachedHealthRecords = {
    paramsKey: string;
    data: PaginatedResponse<HealthRecord>;
    savedAt: number;
};
