import type { PaginationRequest } from '@/types/PaginationRequest';

export interface LinkIndexRequest extends PaginationRequest {
  link_url?: string;
}
