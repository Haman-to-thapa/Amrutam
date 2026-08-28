import React, { PropsWithChildren } from 'react';

import { useWishlistHydration } from '@/features/shop/hooks/useWishlistHydration';
import { useWishlistPersistence } from '@/features/shop/hooks/useWishlistPersistence';

export function PersistenceBridge({
    children,
}: PropsWithChildren) {
    useWishlistHydration();
    useWishlistPersistence();

    return <>{children}</>;
}
