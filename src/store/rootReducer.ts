import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '@/core/api/baseApi';
import appTestReducer from './slices/appTestSlice';
import toastReducer from './slices/toastSlice';
import wishlistReducer from './slices/wishlistSlice';
import cartReducer from './slices/cartSlice';
import offlineQueueReducer from './slices/offlineQueueSlice';
import themeReducer from './slices/themeSlice';
import networkReducer from './slices/networkSlice';

export const rootReducer = combineReducers({
    appTest: appTestReducer,
    toast: toastReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    offlineQueue: offlineQueueReducer,
    theme: themeReducer,
    network: networkReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;



