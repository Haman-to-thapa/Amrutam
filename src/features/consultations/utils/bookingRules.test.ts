import {
    canCancelBooking,
    canCreateBooking,
    hasBookingConflict,
    hasDuplicateBooking,
} from './bookingRules';

describe('bookingRules', () => {
    const futureDate = new Date(
        '2099-01-01T10:00:00.000Z',
    ).toISOString();

    const futureEndDate = new Date(
        '2099-01-01T10:30:00.000Z',
    ).toISOString();

    it('allows a future available slot', () => {
        const result = canCreateBooking(
            {
                id: 'slot-1',
                doctorId: 'doctor-1',
                startsAt: futureDate,
                endsAt: futureEndDate,
                status: 'available',
                mode: 'video',
            },
            new Date('2098-01-01T00:00:00.000Z'),
        );

        expect(result).toBe(true);
    });

    it('rejects a booked slot', () => {
        const result = canCreateBooking(
            {
                id: 'slot-1',
                doctorId: 'doctor-1',
                startsAt: futureDate,
                endsAt: futureEndDate,
                status: 'booked',
                mode: 'video',
            },
            new Date('2098-01-01T00:00:00.000Z'),
        );

        expect(result).toBe(false);
    });

    it('detects booking conflict', () => {
        expect(
            hasBookingConflict(
                [
                    {
                        id: 'booking-1',
                        doctorId: 'doctor-1',
                        slotId: 'slot-1',
                        patientName: 'Patient',
                        mode: 'video',
                        status: 'confirmed',
                        createdAt: futureDate,
                        updatedAt: futureDate,
                        scheduledAt: futureDate,
                    },
                ],
                'slot-1',
            ),
        ).toBe(true);
    });

    it('detects duplicate booking', () => {
        expect(
            hasDuplicateBooking(
                [
                    {
                        id: 'booking-1',
                        doctorId: 'doctor-1',
                        slotId: 'slot-1',
                        patientName: 'John Doe',
                        mode: 'video',
                        status: 'confirmed',
                        createdAt: futureDate,
                        updatedAt: futureDate,
                        scheduledAt: futureDate,
                    },
                ],
                'slot-1',
                ' john doe ',
            ),
        ).toBe(true);
    });

    it('allows cancellation of a future confirmed booking', () => {
        expect(
            canCancelBooking(
                {
                    id: 'booking-1',
                    doctorId: 'doctor-1',
                    slotId: 'slot-1',
                    patientName: 'John Doe',
                    mode: 'video',
                    status: 'confirmed',
                    createdAt: futureDate,
                    updatedAt: futureDate,
                    scheduledAt: futureDate,
                },
                new Date('2098-01-01T00:00:00.000Z'),
            ),
        ).toBe(true);
    });

    it('rejects cancellation of a past booking', () => {
        expect(
            canCancelBooking(
                {
                    id: 'booking-1',
                    doctorId: 'doctor-1',
                    slotId: 'slot-1',
                    patientName: 'John Doe',
                    mode: 'video',
                    status: 'confirmed',
                    createdAt: futureDate,
                    updatedAt: futureDate,
                    scheduledAt: '2097-01-01T10:00:00.000Z',
                },
                new Date('2098-01-01T00:00:00.000Z'),
            ),
        ).toBe(false);
    });
});