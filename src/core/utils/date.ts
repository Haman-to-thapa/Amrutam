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

export function formatDateLabel(date: Date): string {
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
    });
}

export function formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
    });
}