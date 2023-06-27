import {
  AppstoreOutlined,
  CommentOutlined,
  FileOutlined,
  FileTextOutlined,
  LinkOutlined,
  PictureOutlined,
  SettingOutlined,
  TagOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';

export const route = {
  path: '/',
  children: [
    {
      name: '控制台',
      path: '/dashboard',
      icon: <AppstoreOutlined />,
    },
    {
      name: '文章',
      path: '/post',
      icon: <FileTextOutlined />,
      children: [
        {
          name: '添加新文章',
          path: '/post/edit',
        },
        {
          name: '文章列表',
          path: '/post/list',
        },
        {
          name: '分类目录',
          path: '/post/category',
        },
      ],
    },
    {
      name: '页面',
      path: '/page',
      icon: <FileOutlined />,
      children: [
        {
          name: '添加新页面',
          path: '/page/edit',
        },
        {
          name: '页面列表',
          path: '/page/list',
        },
      ],
    },
    {
      name: '媒体',
      path: '/media',
      icon: <PictureOutlined />,
    },
    {
      name: '菜单',
      path: '/menu',
      icon: <UnorderedListOutlined />,
    },
    {
      name: '标签',
      path: '/tag',
      icon: <TagOutlined />,
    },
    {
      name: '评论',
      path: '/comment',
      icon: <CommentOutlined />,
    },
    {
      name: '用户',
      path: '/user',
      icon: <UserOutlined />,
    },
    {
      name: '友情链接',
      path: '/link',
      icon: <LinkOutlined />,
    },
    {
      name: '设置',
      path: '/setting',
      icon: <SettingOutlined />,
    },
  ],
};
