import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '@/core/api/baseApi';
import appTestReducer from './slices/appTestSlice';

export const rootReducer = combineReducers({
    appTest: appTestReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;