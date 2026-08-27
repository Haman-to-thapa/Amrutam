import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './rootReducer';

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: true,
        }),
    devTools: __DEV__,
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];