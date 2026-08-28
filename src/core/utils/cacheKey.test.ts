import { createCacheKey } from './cacheKey';

describe('createCacheKey', () => {
    it('creates the exact same key for the same query object', () => {
        const first = createCacheKey({
            page: 1,
            pageSize: 30,
            search: 'ashwagandha',
        });

        const second = createCacheKey({
            page: 1,
            pageSize: 30,
            search: 'ashwagandha',
        });

        expect(first).toBe(second);
    });

    it('creates distinct keys for different parameters', () => {
        const first = createCacheKey({ page: 1, search: 'ayurveda' });
        const second = createCacheKey({ page: 2, search: 'ayurveda' });

        expect(first).not.toBe(second);
    });
});
