import type { UserEntity } from '@/pages/user/types/user.entity';
import type { PaginationResponse } from '@/types/PaginationResponse';

export interface UserIndexResponse extends PaginationResponse<UserEntity[]> {}
