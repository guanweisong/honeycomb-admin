
// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true
      },
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/Loader/Loader'
      },
      title: '管理系统',
      dll: false,
      routes: {
        exclude: [
          /model\.(j|t)sx?$/,
          /service\.(j|t)sx?$/,
          /models\//,
          /components\//,
          /services\//,
        ],
      },
      hardSource: true,
    }],
  ],
  extraBabelPlugins: [
    "jsx-control-statements"
  ],
}
