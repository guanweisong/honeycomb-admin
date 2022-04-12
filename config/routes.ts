export default [
  {
    layout: false,
    name: '登录',
    path: '/login',
    component: './login',
    hideInMenu: true,
  },
  {
    path: '/dashboard',
    name: '控制台',
    icon: 'appstore',
    component: './dashboard',
  },
  {
    path: '/post',
    name: '文章',
    icon: 'fileText',
    routes: [
      {
        path: '/post/edit',
        name: '添加新文章',
        component: './post/edit',
      },
      {
        path: '/post/list',
        name: '文章列表',
        component: './post/list',
      },
      {
        path: '/post/category',
        name: '分类目录',
        component: './post/category',
      },
    ],
  },
  {
    path: '/page',
    name: '页面',
    icon: 'file',
    routes: [
      {
        path: '/page/edit',
        name: '添加新页面',
        component: './page/edit',
      },
      {
        path: '/page/list',
        name: '页面列表',
        component: './page/list',
      },
    ],
  },
  {
    path: '/media',
    name: '媒体',
    icon: 'picture',
    component: './media',
  },
  {
    path: '/menu',
    name: '菜单',
    icon: 'unorderedList',
    component: './menu',
  },
  {
    path: '/tag',
    name: '标签',
    icon: 'tag',
    component: './tag',
  },
  {
    path: '/comment',
    name: '评论',
    icon: 'comment',
    component: './comment',
  },
  {
    path: '/user',
    name: '用户',
    icon: 'user',
    component: './user',
  },
  {
    path: '/link',
    name: '友情链接',
    icon: 'link',
    component: './link',
  },
  {
    path: '/setting',
    name: '设置',
    icon: 'setting',
    component: './setting',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
];
