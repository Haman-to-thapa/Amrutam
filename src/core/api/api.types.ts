export type PaginationParams = {
    page: number;
    pageSize: number;
};

export type PaginatedResponse<T> = {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    hasNextPage: boolean;
};

export type ApiSuccess<T> = {
    data: T;
};