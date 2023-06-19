import type { BaseEntity } from '@/types/BaseEntity';
import type { UserLevel } from './UserLevel';
import type { UserStatus } from './UserStatus';

export interface UserEntity extends BaseEntity {
  id: string;
  email: string;
  level: UserLevel;
  name: string;
  password: string;
  status: UserStatus;
}
