module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      // nodeIntegration: true,
      // externals: ['clipboard'],
      mainProcessWatch: ['src/server/*']
    }
  }
}
