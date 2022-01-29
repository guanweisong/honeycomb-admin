import React from 'react';
import { Tag } from 'antd';

export const enableStatusMap = [
  {
    text: '禁用',
    tag: <Tag color="gray">禁用</Tag>,
    value: 0,
  },
  {
    text: '启用',
    tag: <Tag color="blue">启用</Tag>,
    value: 1,
  },
  {
    text: '已删除',
    tag: <Tag color="lightgray">已删除</Tag>,
    value: -1,
  },
];

export const menuTypeMap = {
  0: '分类',
  1: '页面',
};
