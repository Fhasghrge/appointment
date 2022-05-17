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
        '/interviewAppointment/*': {
          target: 'http://meeting.uestc.cn', // 后端地址
          changeOrigin: true,
        }
      }
    }
  }
}
