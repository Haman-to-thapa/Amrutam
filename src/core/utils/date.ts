export function startOfDay(date: Date): Date {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
}

export function addDays(date: Date, days: number): Date {
    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
}

export function formatDateLabel(date: Date, locale = 'en-IN'): string {
    return date.toLocaleDateString(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
}

export function formatDateParam(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatTime(isoDate: string, locale = 'en-IN'): string {
    return new Date(isoDate).toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
    });
}
