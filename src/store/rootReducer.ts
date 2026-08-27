import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '@/core/api/baseApi';
import appTestReducer from './slices/appTestSlice';
import toastReducer from './slices/toastSlice';

export const rootReducer = combineReducers({
    appTest: appTestReducer,
    toast: toastReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;