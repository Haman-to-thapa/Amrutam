import type { AppTheme } from './theme.types';

export const lightTheme: AppTheme = {
    mode: 'light',

    colors: {
        background: '#F7F7F5',
        surface: '#FFFFFF',
        text: '#171717',
        textSecondary: '#666666',
        border: '#E2E2E2',
        primary: '#1F6F43',
        danger: '#B91C1C',
        warning: '#B45309',
        success: '#1F7A4D',
        disabled: '#A3A3A3',
    },
};

export const darkTheme: AppTheme = {
    mode: 'dark',

    colors: {
        background: '#121212',
        surface: '#1E1E1E',
        text: '#F5F5F5',
        textSecondary: '#B5B5B5',
        border: '#3A3A3A',
        primary: '#63C58A',
        danger: '#F87171',
        warning: '#FBBF24',
        success: '#6EE7A1',
        disabled: '#737373',
    },
};
