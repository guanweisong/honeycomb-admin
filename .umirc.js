// ref: https://umijs.org/config/
export default {
  antd: {},
  dynamicImport: {
    loading: '@/components/Loader',
  },
  analytics: {
    ga: 'UA-158268354-3',
  },
  title: '管理系统',
  ignoreMomentLocale: true,
  hash: true,
  favicon: '/images/favicon.ico',
  extraBabelPlugins: ['jsx-control-statements'],
}
