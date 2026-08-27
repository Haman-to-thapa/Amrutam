import { combineReducers } from '@reduxjs/toolkit';

import appTestReducer from './slices/appTestSlice';

export const rootReducer = combineReducers({
    appTest: appTestReducer,
});

export type RootState = ReturnType<typeof rootReducer>;