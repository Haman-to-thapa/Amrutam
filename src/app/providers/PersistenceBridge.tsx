import React, { PropsWithChildren } from 'react';

import { useWishlistHydration } from '@/features/shop/hooks/useWishlistHydration';
import { useWishlistPersistence } from '@/features/shop/hooks/useWishlistPersistence';
import { useCartHydration } from '@/features/shop/hooks/useCartHydration';
import { useCartPersistence } from '@/features/shop/hooks/useCartPersistence';
import { useBookingQueuePersistence } from '@/features/consultations/hooks/useBookingQueuePersistence';

export function PersistenceBridge({
    children,
}: PropsWithChildren) {
    useWishlistHydration();
    useWishlistPersistence();

    useCartHydration();
    useCartPersistence();

    useBookingQueuePersistence();

    return <>{children}</>;
}


