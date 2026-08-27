import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { env } from '@/app/config/env';
import type { ApiError } from './apiErrors';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: env.apiBaseUrl,
    timeout: env.apiTimeoutMs,
    prepareHeaders: headers => {
        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json');

        return headers;
    },
});

export const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    ApiError
> = async (args, api, extraOptions) => {
    try {
        const result = await rawBaseQuery(args, api, extraOptions);

        if (result.error) {
            return {
                error: normalizeApiError(result.error),
            };
        }

        return result;
    } catch (error) {
        return {
            error: {
                code: 'UNKNOWN',
                message:
                    error instanceof Error ? error.message : 'Unexpected API error',
                details: error instanceof Error ? error.message : undefined,
            },
        };
    }

};

function normalizeApiError(error: FetchBaseQueryError): ApiError {
    if (typeof error.status === 'number') {
        switch (error.status) {
            case 401:
                return {
                    status: 401,
                    code: 'UNAUTHORIZED',
                    message: 'Your session has expired.',
                };

            case 403:
                return {
                    status: 403,
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to perform this action.',
                };

            case 404:
                return {
                    status: 404,
                    code: 'NOT_FOUND',
                    message: 'Requested resource was not found.',
                };

            case 409:
                return {
                    status: 409,
                    code: 'CONFLICT',
                    message: 'The requested operation conflicts with current data.',
                };

            default:
                if (error.status >= 500) {
                    return {
                        status: error.status,
                        code: 'SERVER_ERROR',
                        message: 'The server encountered an error.',
                    };
                }

                return {
                    status: error.status,
                    code: 'UNKNOWN',
                    message: 'Request failed.',
                    details: error.data,
                };
        }
    }

    if (error.status === 'FETCH_ERROR') {
        return {
            code: 'NETWORK_ERROR',
            message: 'Unable to connect to the server.',
            details: error.error,
        };
    }

    if (error.status === 'TIMEOUT_ERROR') {
        return {
            code: 'TIMEOUT',
            message: 'The request timed out. Please try again.',
            details: error.error,
        };
    }

    if (error.status === 'PARSING_ERROR') {
        return {
            code: 'INVALID_RESPONSE',
            message: 'The server returned an invalid response.',
            details: error.data,
        };
    }

    return {
        code: 'UNKNOWN',
        message: 'An unexpected API error occurred.',
        details: error,
    };
}