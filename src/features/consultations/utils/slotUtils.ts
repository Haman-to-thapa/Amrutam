import type { DoctorSlot } from '../types/consultation.types';

export function isSlotExpired(slot: DoctorSlot, now = new Date()): boolean {
    return new Date(slot.endsAt).getTime() <= now.getTime();
}

export function isSlotBookable(
    slot: DoctorSlot,
    now = new Date(),
): boolean {
    if (slot.status !== 'available') {
        return false;
    }

    return !isSlotExpired(slot, now);
}

export function getEffectiveSlotStatus(
    slot: DoctorSlot,
    now = new Date(),
): DoctorSlot['status'] {
    if (
        slot.status === 'available' &&
        isSlotExpired(slot, now)
    ) {
        return 'expired';
    }

    return slot.status;
}