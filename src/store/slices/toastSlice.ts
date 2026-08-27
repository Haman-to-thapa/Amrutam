import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export type ToastState = {
    visible: boolean;
    type: ToastType;
    message: string;
};

const initialState: ToastState = {
    visible: false,
    type: 'info',
    message: '',
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast(
            state,
            action: PayloadAction<{
                type: ToastType;
                message: string;
            }>,
        ) {
            state.visible = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },

        hideToast(state) {
            state.visible = false;
            state.message = '';
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;