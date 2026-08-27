import { mockDatabase } from './db/mockDatabase';

export function getMockDatasetStats() {
    return {
        doctors: mockDatabase.doctors.length,
        products: mockDatabase.products.length,
        healthRecords: mockDatabase.healthRecords.length,
    };
}