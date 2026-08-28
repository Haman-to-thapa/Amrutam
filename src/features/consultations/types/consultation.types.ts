import type { ID, ISODateString } from '@/types/common';

export type ConsultationMode = 'video' | 'audio' | 'chat';

export type DoctorGender = 'male' | 'female' | 'other';

export type DoctorSpecialization =
    | 'Ayurvedic Physician'
    | 'Panchakarma'
    | 'Dermatology'
    | 'Digestive Health'
    | 'Women Health'
    | 'Stress Management';

export type Doctor = {
    id: ID;
    name: string;
    avatarUrl: string;
    gender: DoctorGender;
    specialization: DoctorSpecialization;
    experienceYears: number;
    rating: number;
    reviewCount: number;
    languages: string[];
    consultationModes: ConsultationMode[];
    consultationFee: number;
    bio: string;
    isVerified: boolean;
};

export type SlotStatus =
    | 'available'
    | 'booked'
    | 'expired'
    | 'blocked';

export type DoctorSlot = {
    id: ID;
    doctorId: ID;
    startsAt: ISODateString;
    endsAt: ISODateString;
    status: SlotStatus;
    mode: ConsultationMode;
};

export type BookingStatus =
    | 'confirmed'
    | 'pending_sync'
    | 'cancelled'
    | 'failed'
    | 'completed';

export type Booking = {
    id: ID;
    doctorId: ID;
    slotId: ID;
    patientName: string;
    mode: ConsultationMode;
    status: BookingStatus;
    createdAt: ISODateString;
    updatedAt: ISODateString;
    scheduledAt: ISODateString;
    idempotencyKey?: string;
};


export type DoctorFilters = {
    specialization?: DoctorSpecialization;
    gender?: DoctorGender;
    mode?: ConsultationMode;
    minExperienceYears?: number;
    minRating?: number;
};

export type DoctorListParams = {
    page: number;
    pageSize: number;
    search?: string;
    filters?: DoctorFilters;
};

export type SlotQuery = {
    doctorId: ID;
    date: string;
};

export type CreateBookingRequest = {
    doctorId: ID;
    slotId: ID;
    patientName: string;
    mode: ConsultationMode;
    date: string;
    idempotencyKey?: string;
};



export type CancelBookingRequest = {
    bookingId: ID;
    reason?: string;
};

