export type Paginator<Result> = () => Promise<PageIterator<Result>> | null;
export type PageIterator<Result> = Result & {
    next: Paginator<Result>;
    [Symbol.asyncIterator]: () => AsyncIterableIterator<Result>;
};
export declare function createPageIterator<Result>(page: Result & {
    next: Paginator<Result>;
}): {
    [Symbol.asyncIterator]: () => AsyncIterableIterator<Result>;
};
//# sourceMappingURL=operations.d.ts.map