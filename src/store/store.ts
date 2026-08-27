import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '@/core/api/baseApi';
import { rootReducer } from './rootReducer';

export const store = configureStore({
    reducer: rootReducer,

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: true,
        }).concat(baseApi.middleware),

    devTools: __DEV__,
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];