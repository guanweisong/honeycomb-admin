import { UserEntity } from '@/app/(root)/(dashboard)/user/types/user.entity';
import CommonService from '@/services/common';
import { create } from 'zustand';

type Store = {
  user?: UserEntity | false;
  setUser: (data: UserEntity | false) => void;
  queryUser: () => void;
};

export const useUserStore = create<Store>((set) => ({
  user: undefined,
  setUser: (data) => {
    set(() => ({ user: data }));
  },
  queryUser: async () => {
    CommonService.queryUser().then((result) => {
      if (result.data.id) {
        set(() => ({ user: result.data }));
      } else {
        set(() => ({ user: false }));
      }
    });
  },
}));
