import {
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';

import type { ThemeMode } from '@/theme/theme.types';

type ThemeState = {
    mode: ThemeMode;
    hydrated: boolean;
};

const initialState: ThemeState = {
    mode: 'system',
    hydrated: false,
};

const themeSlice = createSlice({
    name: 'theme',

    initialState,

    reducers: {
        setThemeMode(
            state,
            action: PayloadAction<ThemeMode>,
        ) {
            state.mode = action.payload;
        },

        hydrateTheme(
            state,
            action: PayloadAction<ThemeMode>,
        ) {
            state.mode = action.payload;
            state.hydrated = true;
        },
    },
});

export const {
    setThemeMode,
    hydrateTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
