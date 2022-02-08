import type { PaginationRequest } from '@/types/PaginationRequest';

export interface UserIndexRequest extends PaginationRequest {
  user_email?: string;
  user_name?: string;
}
