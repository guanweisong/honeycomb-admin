import * as SettingService from '@/app/(root)/(dashboard)/setting/service';
import { SettingEntity } from '@/app/(root)/(dashboard)/setting/types/setting.entity';
import { createGlobalStore } from 'hox';
import { useState } from 'react';

export const [useSettingStore, getSettingStore] = createGlobalStore(() => {
  const [setting, setSetting] = useState<SettingEntity>();

  const querySetting = async () => {
    SettingService.querySetting().then((result) => {
      setSetting(result.data);
    });
  };

  return { setting, querySetting };
});
