import { mockDatabase } from '@/mocks/db/mockDatabase';
import { mockTransport } from '@/mocks/transport/mockTransport';

import type {
    Booking,
    CancelBookingRequest,
    CreateBookingRequest,
    DoctorSlot,
} from '@/features/consultations/types/consultation.types';

import {
    canCancelBooking,
    canCreateBooking,
    hasBookingConflict,
    hasDuplicateBooking,
} from '@/features/consultations/utils/bookingRules';
import { isSlotExpired } from '@/features/consultations/utils/slotUtils';

import { generateSlotsForDoctor } from '@/mocks/generators/slotGenerator';

function getSlot(
    doctorId: string,
    slotId: string,
    requestDate?: string,
): DoctorSlot | null {
    let date = requestDate;

    if (!date) {
        const dateMatch = slotId.match(/(\d{4}-\d{2}-\d{2})/);

        if (dateMatch) {
            date = dateMatch[1];
        }
    }

    if (!date) {
        return null;
    }

    const [year, month, day] = date.split('-').map(Number);

    const slots = generateSlotsForDoctor(
        doctorId,
        new Date(year, month - 1, day, 0, 0, 0, 0),
    );

    return (
        slots.find(slot => slot.id === slotId) ?? null
    );
}

export async function createBooking(
    request: CreateBookingRequest,
): Promise<Booking> {
    return mockTransport(
        {
            method: 'POST',
            path: '/bookings',
            body: request,
        },
        () => {
            const doctor = mockDatabase.doctors.find(
                item => item.id === request.doctorId,
            );

            if (!doctor) {
                throw new Error('DOCTOR_NOT_FOUND');
            }

            const slot = getSlot(
                request.doctorId,
                request.slotId,
                request.date,
            );

            if (!slot) {
                throw new Error('SLOT_NOT_FOUND');
            }

            if (!canCreateBooking(slot)) {
                if (isSlotExpired(slot)) {
                    throw new Error('SLOT_EXPIRED');
                }

                throw new Error('SLOT_UNAVAILABLE');
            }

            if (
                hasBookingConflict(
                    mockDatabase.bookings,
                    request.slotId,
                )
            ) {
                throw new Error('BOOKING_CONFLICT');
            }

            if (
                hasDuplicateBooking(
                    mockDatabase.bookings,
                    request.slotId,
                    request.patientName,
                )
            ) {
                throw new Error('DUPLICATE_BOOKING');
            }

            const now = new Date().toISOString();

            const booking: Booking = {
                id: `booking-${mockDatabase.bookings.length + 1}`,
                doctorId: request.doctorId,
                slotId: request.slotId,
                patientName: request.patientName.trim(),
                mode: request.mode,
                status: 'confirmed',
                createdAt: now,
                updatedAt: now,
                scheduledAt: slot.startsAt,
            };

            mockDatabase.bookings.push(booking);

            return booking;
        },
    ).then(response => response.data);
}

export function getUpcomingBookings(): Booking[] {
    const now = Date.now();

    return mockDatabase.bookings.filter(
        booking =>
            booking.status === 'confirmed' &&
            new Date(booking.scheduledAt).getTime() > now,
    );
}

export async function cancelBooking(
    request: CancelBookingRequest,
): Promise<Booking> {
    return mockTransport(
        {
            method: 'POST',
            path: `/bookings/${request.bookingId}/cancel`,
            body: request,
        },
        () => {
            const bookingIndex =
                mockDatabase.bookings.findIndex(
                    booking => booking.id === request.bookingId,
                );

            if (bookingIndex === -1) {
                throw new Error('BOOKING_NOT_FOUND');
            }

            const booking =
                mockDatabase.bookings[bookingIndex];

            if (booking.status === 'cancelled') {
                throw new Error('BOOKING_ALREADY_CANCELLED');
            }

            if (booking.status !== 'confirmed') {
                throw new Error('BOOKING_NOT_CANCELLABLE');
            }

            if (!canCancelBooking(booking)) {
                throw new Error('BOOKING_EXPIRED');
            }

            const now = new Date();


            const updatedBooking: Booking = {
                ...booking,
                status: 'cancelled',
                updatedAt: now.toISOString(),
            };

            mockDatabase.bookings[bookingIndex] =
                updatedBooking;

            return updatedBooking;
        },
    ).then(response => response.data);
}