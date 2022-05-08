module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      disableHostCheck: true,
      proxy: {
        '/employ/*': {
          target: 'http://121.48.165.113:21530', // 后端地址
          changeOrigin: true,
        }
      }
    }
  }
}
