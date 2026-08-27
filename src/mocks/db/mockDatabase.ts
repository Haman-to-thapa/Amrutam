import type {
    Booking,
    Doctor,
} from '@/features/consultations/types/consultation.types';
import type { Product } from '@/features/shop/types/shop.types';
import type { HealthRecord } from '@/features/health-records/types/health-record.types';

import {
    generateDoctors,
    generateHealthRecords,
    generateProducts,
} from '@/mocks/generators';

import { MOCK_DATA_CONFIG } from '@/mocks/seed';

export type MockDatabase = {
    doctors: Doctor[];
    products: Product[];
    healthRecords: HealthRecord[];
    bookings: Booking[];
};

export const mockDatabase: MockDatabase = {
    doctors: generateDoctors(
        MOCK_DATA_CONFIG.doctors,
        MOCK_DATA_CONFIG.seed + 1,
    ),

    products: generateProducts(
        MOCK_DATA_CONFIG.products,
        MOCK_DATA_CONFIG.seed + 2,
    ),

    healthRecords: generateHealthRecords(
        MOCK_DATA_CONFIG.healthRecords,
        MOCK_DATA_CONFIG.seed + 3,
    ),

    bookings: [],
};