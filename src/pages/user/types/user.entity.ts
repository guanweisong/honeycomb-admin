import type { UserLevel } from '@/pages/user/types/UserLevel';
import type { UserState } from '@/pages/user/types/UserState';

export interface UserEntity {
  _id: string;
  user_email: string;
  user_level: UserLevel;
  user_name: string;
  user_password: string;
  user_status: UserState;
}
