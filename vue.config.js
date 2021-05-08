module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['clipboard']
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
