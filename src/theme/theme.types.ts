export type ThemeMode = 'light' | 'dark' | 'system';

export type AppTheme = {
    mode: 'light' | 'dark';
    colors: {
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        primary: string;
        danger: string;
        warning: string;
        success: string;
        disabled: string;
    };
};
