import { UserEntity } from '@/app/(root)/(dashboard)/user/types/user.entity';
import * as CommonService from '@/services/common';
import { createGlobalStore } from 'hox';
import { useState } from 'react';

export const [useUserStore, getUserStore] = createGlobalStore(() => {
  const [user, setUser] = useState<UserEntity | false>();

  const queryUser = async () => {
    CommonService.queryUser().then((result) => {
      if (result.data.id) {
        setUser(result.data);
      } else {
        setUser(false);
      }
    });
  };

  return { user, queryUser, setUser };
});
