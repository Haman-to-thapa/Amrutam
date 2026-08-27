import type {
    Booking,
    DoctorSlot,
} from '../types/consultation.types';

export function hasBookingConflict(
    bookings: Booking[],
    slotId: string,
): boolean {
    return bookings.some(
        booking =>
            booking.slotId === slotId &&
            booking.status === 'confirmed',
    );
}

export function hasDuplicateBooking(
    bookings: Booking[],
    slotId: string,
    patientName: string,
): boolean {
    const normalizedName = patientName.trim().toLowerCase();

    return bookings.some(
        booking =>
            booking.slotId === slotId &&
            booking.status === 'confirmed' &&
            booking.patientName.trim().toLowerCase() ===
            normalizedName,
    );
}

export function canCancelBooking(
    booking: Booking,
    now = new Date(),
): boolean {
    if (booking.status !== 'confirmed') {
        return false;
    }

    return (
        new Date(booking.scheduledAt).getTime() >
        now.getTime()
    );
}

export function canCreateBooking(
    slot: DoctorSlot,
    now = new Date(),
): boolean {
    if (slot.status !== 'available') {
        return false;
    }

    return new Date(slot.endsAt).getTime() >
        now.getTime();
}