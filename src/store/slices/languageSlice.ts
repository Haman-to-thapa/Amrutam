import {
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';

export type Language = 'en' | 'hi';

export type LanguageState = {
    language: Language;
    hydrated: boolean;
};

const initialState: LanguageState = {
    language: 'en',
    hydrated: false,
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,

    reducers: {
        setLanguage(
            state,
            action: PayloadAction<Language>,
        ) {
            state.language = action.payload;
        },

        hydrateLanguage(
            state,
            action: PayloadAction<Language>,
        ) {
            state.language = action.payload;
            state.hydrated = true;
        },
    },
});

export const {
    setLanguage,
    hydrateLanguage,
} = languageSlice.actions;

export default languageSlice.reducer;
