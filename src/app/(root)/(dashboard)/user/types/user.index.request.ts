import type { PaginationRequest } from '@/types/PaginationRequest';
import type { UserLevel } from './UserLevel';
import type { UserStatus } from './UserStatus';

export interface UserIndexRequest extends PaginationRequest {
  email?: string;
  name?: string;
  level?: UserLevel[];
  status?: UserStatus[];
}
