export type ApiErrorCode =
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

export type ApiError = {
    status?: number;
    code: ApiErrorCode;
    message: string;
    details?: unknown;
};