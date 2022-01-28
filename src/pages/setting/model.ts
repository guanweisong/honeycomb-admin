import { useState } from 'react';
import { message } from 'antd';
import { createModel } from 'hox';
import * as settingsService from './service';
import type { SettingEntity } from '@/pages/setting/types/setting.entity';

function UseSettings() {
  const [setting, setSetting] = useState<SettingEntity & { _id: string }>();

  const querySetting = async (force = false) => {
    console.log('app=>model=>querySetting');
    if (!force && setting?._id) {
      return;
    }
    const result = await settingsService.setSettingInfo();
    setSetting(result.data[0]);
  };

  const update = async (id: string, payload: SettingEntity) => {
    console.log('settings=>model=>update', payload);
    const result = await settingsService.update(id, payload);
    if (result.status === 201) {
      querySetting(true);
      message.success('更新成功');
    }
  };

  return {
    setting,
    querySetting,
    update,
  };
}

export default createModel(UseSettings);
