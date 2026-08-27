export type ID = string;

export type ISODateString = string;

export type SortDirection = 'asc' | 'desc';

export type LoadingState =
    | 'idle'
    | 'loading'
    | 'success'
    | 'error';

export type PaginationParams = {
    page: number;
    pageSize: number;
};