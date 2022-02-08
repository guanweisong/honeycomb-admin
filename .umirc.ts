import { defineConfig } from 'umi';

export default defineConfig({
  mfsu: {},
  dynamicImport: {
    loading: '@/components/Loader',
  },
  // analytics: {
  //   ga: 'UA-158268354-3',
  // },
  title: '管理系统',
  ignoreMomentLocale: true,
  hash: true,
  favicon: '/images/favicon.ico',
  extraBabelPlugins: [['import', { libraryName: 'antd', style: true }], ['jsx-control-statements']],
});
