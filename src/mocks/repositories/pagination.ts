export type PaginatedResult<T> = {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    hasNextPage: boolean;
};

export function paginate<T>(
    items: T[],
    page: number,
    pageSize: number,
): PaginatedResult<T> {
    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);

    const startIndex = (safePage - 1) * safePageSize;
    const endIndex = startIndex + safePageSize;

    const data = items.slice(startIndex, endIndex);

    return {
        data,
        page: safePage,
        pageSize: safePageSize,
        total: items.length,
        hasNextPage: endIndex < items.length,
    };
}