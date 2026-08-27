export type MockHttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';

export type MockRequest = {
    method: MockHttpMethod;
    path: string;
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
};

export type MockResponse<T> = {
    status: number;
    data: T;
};