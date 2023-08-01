import { SortOrder } from '@/types/SortOrder';

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: SortOrder;
}
