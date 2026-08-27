import type { Doctor } from '@/features/consultations/types/consultation.types';
import type {
    Product,
} from '@/features/shop/types/shop.types';
import type {
    HealthRecord,
} from '@/features/health-records/types/health-record.types';

export type MockDatabase = {
    doctors: Doctor[];
    products: Product[];
    healthRecords: HealthRecord[];
};

export const mockDatabase: MockDatabase = {
    doctors: [],
    products: [],
    healthRecords: [],
};