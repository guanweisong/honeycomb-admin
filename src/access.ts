/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import { UserEntity } from '@/pages/user/types/user.entity';
import { UserLevel } from '@/pages/user/types/UserLevel';

export default function access(initialState: { userInfo?: UserEntity } | undefined) {
  const { userInfo } = initialState ?? {};
  return {
    canAdmin: userInfo && userInfo.user_level === UserLevel.ADMIN,
    canEditor: userInfo && userInfo.user_level === UserLevel.EDITOR,
    canGuest: userInfo && userInfo.user_level === UserLevel.GUEST,
  };
}
