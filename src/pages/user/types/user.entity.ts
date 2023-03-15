import type { UserLevel } from '@/pages/user/types/UserLevel';
import type { UserStatus } from '@/pages/user/types/UserStatus';
import type { BaseEntity } from '@/types/BaseEntity';

export interface UserEntity extends BaseEntity {
  id: string;
  email: string;
  level: UserLevel;
  name: string;
  password: string;
  status: UserStatus;
}
