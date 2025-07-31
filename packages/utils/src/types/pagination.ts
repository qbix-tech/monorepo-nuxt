export type Paginated<T> = {
  records: Array<T>;
  totalCount: number;
  page: number;
  pageSize: number;
};
