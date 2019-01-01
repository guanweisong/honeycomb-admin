export default [
  {
    key: "dashboard",
    label: "控制面板",
    icon: "windows-o",
    link: "/",
  },
  {
    key: "post",
    label: "文章",
    icon: "file-text",
    child: [
      {
        key: "post/edit",
        label: "添加新文章",
        link: "/post/edit",
      },
      {
        key: "post/list",
        label: "文章列表",
        link: "/post/list",
      },
      {
        key: "post/category",
        label: "分类目录",
        link: "/post/category",
      }
    ]
  },
  {
    key: "page",
    label: "页面",
    icon: "file",
    child: [
      {
        key: "page/edit",
        label: "添加新页面",
        link: "/page/edit",
      },
      {
        key: "page/list",
        label: "页面列表",
        link: "/page/list",
      }
    ]
  },
  {
    key: "media",
    label: "多媒体",
    icon: "picture",
    link: "/media",
  },
  {
    key: "tag",
    label: "标签",
    icon: "tag-o",
    link: "/tag",
  },
  {
    key: "comment",
    label: "评论",
    icon: "message",
    link: "/comment",
  },
  {
    key: "user",
    label: "用户",
    icon: "user",
    link: "/user",
  },
  {
    key: "link",
    label: "友情链接",
    icon: "link",
    link: "/link",
  },
  {
    key: "setting",
    label: "设置",
    icon: "setting",
    link: "/setting",
  },
]
