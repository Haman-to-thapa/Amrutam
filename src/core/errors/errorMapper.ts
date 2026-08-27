import { AppError, type AppErrorCode } from './AppError';

type UnknownError = {
    code?: unknown;
    status?: unknown;
    message?: unknown;
    details?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function toAppError(error: unknown): AppError {
    if (error instanceof AppError) {
        return error;
    }

    if (isRecord(error)) {
        const value = error as UnknownError;

        if (typeof value.code === 'string') {
            return new AppError(
                normalizeErrorCode(value.code),
                typeof value.message === 'string'
                    ? value.message
                    : 'An unexpected error occurred.',
                {
                    status:
                        typeof value.status === 'number' ? value.status : undefined,
                    details: value.details,
                    cause: error,
                },
            );
        }
    }

    if (error instanceof Error) {
        return new AppError('UNKNOWN', error.message, {
            cause: error,
        });
    }

    return new AppError('UNKNOWN', 'An unexpected error occurred.', {
        cause: error,
    });
}

function normalizeErrorCode(value: string): AppErrorCode {
    const allowedCodes: AppErrorCode[] = [
        'NETWORK_ERROR',
        'TIMEOUT',
        'UNAUTHORIZED',
        'FORBIDDEN',
        'NOT_FOUND',
        'CONFLICT',
        'VALIDATION_ERROR',
        'SERVER_ERROR',
        'INVALID_RESPONSE',
        'UNKNOWN',
    ];

    return allowedCodes.includes(value as AppErrorCode)
        ? (value as AppErrorCode)
        : 'UNKNOWN';
}