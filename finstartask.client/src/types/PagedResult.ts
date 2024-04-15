export interface PagedResult<TEntity> {
  totalCount: number;
  items: TEntity[];
  page: number;
  pageSize: number;
}

export function EmptyPagedResult<TEntity>(pageSize: number): PagedResult<TEntity> { 
  return {page: 1, pageSize, items: [], totalCount: 0}
}