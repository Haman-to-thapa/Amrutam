import { performanceMonitor } from './performance';

describe('performanceMonitor', () => {
    it('should start and end timer without throwing', () => {
        const timer = performanceMonitor.start('test-timer', { items: 100 });
        expect(timer).toBeDefined();
        expect(typeof timer.end).toBe('function');
        expect(() => timer.end({ resultCount: 50 })).not.toThrow();
    });
});
