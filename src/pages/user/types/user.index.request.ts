import type { PaginationRequest } from '@/types/PaginationRequest';
import type { UserLevel } from './UserLevel';
import type { UserStatus } from './UserStatus';

export interface UserIndexRequest extends PaginationRequest {
  user_email?: string;
  user_name?: string;
  user_level?: UserLevel[];
  user_status?: UserStatus[];
}
