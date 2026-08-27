import { createSlice } from '@reduxjs/toolkit';

type AppTestState = {
    initialized: boolean;
};

const initialState: AppTestState = {
    initialized: true,
};

const appTestSlice = createSlice({
    name: 'appTest',
    initialState,
    reducers: {},
});

export default appTestSlice.reducer;