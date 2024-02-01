import SettingService from '@/app/(root)/(dashboard)/setting/service';
import { SettingEntity } from '@/app/(root)/(dashboard)/setting/types/setting.entity';
import { create } from 'zustand';

type Store = {
  setting?: SettingEntity;
  querySetting: () => void;
};

export const useSettingStore = create<Store>((set) => ({
  setting: undefined,
  querySetting: async () => {
    SettingService.querySetting().then((result) => {
      set(() => ({ setting: result.data }));
    });
  },
}));
