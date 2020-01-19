const glob = require('glob')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/reset.scss";
          @import "@/assets/styles.scss";`,
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessWatch: glob.sync('./src/api/**/*.ts')
    }
  }
}
