import { Space } from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  return (
    <Space>
      <Avatar />
    </Space>
  );
};
export default GlobalHeaderRight;
