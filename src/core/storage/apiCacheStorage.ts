import { storageService } from './storage';

import type {
    CachedDoctors,
    CachedProducts,
    CachedHealthRecords,
} from './apiCache.types';

const API_CACHE_KEYS = {
    DOCTORS: 'api_cache_doctors',
    PRODUCTS: 'api_cache_products',
    HEALTH_RECORDS: 'api_cache_health_records',
} as const;

export function saveDoctorsCache(
    cache: CachedDoctors,
): void {
    storageService.setJson(
        API_CACHE_KEYS.DOCTORS,
        cache,
    );
}

export function loadDoctorsCache(): CachedDoctors | null {
    return storageService.getJson<CachedDoctors>(
        API_CACHE_KEYS.DOCTORS,
    );
}

export function saveProductsCache(
    cache: CachedProducts,
): void {
    storageService.setJson(
        API_CACHE_KEYS.PRODUCTS,
        cache,
    );
}

export function loadProductsCache(): CachedProducts | null {
    return storageService.getJson<CachedProducts>(
        API_CACHE_KEYS.PRODUCTS,
    );
}

export function saveHealthRecordsCache(
    cache: CachedHealthRecords,
): void {
    storageService.setJson(
        API_CACHE_KEYS.HEALTH_RECORDS,
        cache,
    );
}

export function loadHealthRecordsCache(): CachedHealthRecords | null {
    return storageService.getJson<CachedHealthRecords>(
        API_CACHE_KEYS.HEALTH_RECORDS,
    );
}
