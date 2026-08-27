export type AppErrorCode =
    | 'NETWORK_ERROR'
    | 'TIMEOUT'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'VALIDATION_ERROR'
    | 'SERVER_ERROR'
    | 'INVALID_RESPONSE'
    | 'UNKNOWN';

export class AppError extends Error {
    readonly code: AppErrorCode;
    readonly status?: number;
    readonly details?: unknown;

    constructor(
        code: AppErrorCode,
        message: string,
        options?: {
            status?: number;
            details?: unknown;
            cause?: unknown;
        },
    ) {
        super(message);

        this.name = 'AppError';
        this.code = code;
        this.status = options?.status;
        this.details = options?.details;

        if ('cause' in Error.prototype && options?.cause !== undefined) {
            Object.defineProperty(this, 'cause', {
                value: options.cause,
                enumerable: false,
                configurable: true,
            });
        }

        Object.setPrototypeOf(this, AppError.prototype);
    }
}