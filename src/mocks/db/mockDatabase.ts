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

let _doctors: Doctor[] | null = null;
let _products: Product[] | null = null;
let _healthRecords: HealthRecord[] | null = null;
let _bookings: Booking[] = [];

export const mockDatabase: MockDatabase = {
    get doctors() {
        if (!_doctors) {
            _doctors = generateDoctors(
                MOCK_DATA_CONFIG.doctors,
                MOCK_DATA_CONFIG.seed + 1,
            );
        }
        return _doctors;
    },
    set doctors(val: Doctor[]) {
        _doctors = val;
    },

    get products() {
        if (!_products) {
            _products = generateProducts(
                MOCK_DATA_CONFIG.products,
                MOCK_DATA_CONFIG.seed + 2,
            );
        }
        return _products;
    },
    set products(val: Product[]) {
        _products = val;
    },

    get healthRecords() {
        if (!_healthRecords) {
            _healthRecords = generateHealthRecords(
                MOCK_DATA_CONFIG.healthRecords,
                MOCK_DATA_CONFIG.seed + 3,
            );
        }
        return _healthRecords;
    },
    set healthRecords(val: HealthRecord[]) {
        _healthRecords = val;
    },

    get bookings() {
        return _bookings;
    },
    set bookings(val: Booking[]) {
        _bookings = val;
    },
};