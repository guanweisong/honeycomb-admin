export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'descend' | 'ascend';
}
