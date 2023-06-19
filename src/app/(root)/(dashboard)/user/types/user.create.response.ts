import type { BaseResponse } from '@/types/BaseResponse';
import type { UserEntity } from './user.entity';

export interface UserCreateResponse extends BaseResponse<UserEntity> {}
