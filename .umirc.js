// ref: https://umijs.org/config/
export default {
  antd: {},
  dynamicImport: {
    loading: '@/components/Loader',
  },
  title: '管理系统',
  ignoreMomentLocale: true,
  hash: true,
  favicon: '/images/favicon.ico',
  extraBabelPlugins: ['jsx-control-statements'],
}
