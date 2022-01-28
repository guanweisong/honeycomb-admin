import {
  WindowsOutlined,
  FileTextOutlined,
  FileOutlined,
  PictureOutlined,
  TagOutlined,
  MessageOutlined,
  UserOutlined,
  LinkOutlined,
  SettingOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import React from 'react';

export default [
  {
    key: 'dashboard',
    label: '控制面板',
    icon: <WindowsOutlined />,
    link: '/',
  },
  {
    key: 'post',
    label: '文章',
    icon: <FileTextOutlined />,
    link: '/post',
    child: [
      {
        key: 'post/edit',
        label: '添加新文章',
        link: '/post/edit',
      },
      {
        key: 'post/list',
        label: '文章列表',
        link: '/post/list',
      },
      {
        key: 'post/category',
        label: '分类目录',
        link: '/post/category',
      },
    ],
  },
  {
    key: 'page',
    label: '页面',
    icon: <FileOutlined />,
    link: '/page',
    child: [
      {
        key: 'page/edit',
        label: '添加新页面',
        link: '/page/edit',
      },
      {
        key: 'page/list',
        label: '页面列表',
        link: '/page/list',
      },
    ],
  },
  {
    key: 'menu',
    label: '菜单',
    icon: <MenuOutlined />,
    link: '/menu',
  },
  {
    key: 'media',
    label: '多媒体',
    icon: <PictureOutlined />,
    link: '/media',
  },
  {
    key: 'tag',
    label: '标签',
    icon: <TagOutlined />,
    link: '/tag',
  },
  {
    key: 'comment',
    label: '评论',
    icon: <MessageOutlined />,
    link: '/comment',
  },
  {
    key: 'user',
    label: '用户',
    icon: <UserOutlined />,
    link: '/user',
    roleAuthority: [1, 3],
  },
  {
    key: 'link',
    label: '友情链接',
    icon: <LinkOutlined />,
    link: '/link',
  },
  {
    key: 'setting',
    label: '设置',
    icon: <SettingOutlined />,
    link: '/setting',
    roleAuthority: [1, 3],
  },
];
