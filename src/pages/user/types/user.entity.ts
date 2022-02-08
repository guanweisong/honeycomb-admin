import type { UserLevel } from '@/pages/user/types/UserLevel';
import type { UserStatus } from '@/pages/user/types/UserState';
import type { BaseEntity } from '@/types/BaseEntity';

export interface UserEntity extends BaseEntity {
  _id: string;
  user_email: string;
  user_level: UserLevel;
  user_name: string;
  user_password: string;
  user_status: UserStatus;
}
