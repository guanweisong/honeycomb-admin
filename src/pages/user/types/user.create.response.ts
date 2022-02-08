import type { BaseResponse } from '@/types/BaseResponse';
import type { UserEntity } from '@/pages/user/types/user.entity';

export interface UserCreateResponse extends BaseResponse<UserEntity> {}
