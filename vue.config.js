let path = require('path')
const webpack = require('webpack')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/artshow/' : '',
    outputDir: 'build',
    assetsDir: 'assets',
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src'))
    },
    configureWebpack: {
       plugins: [
           new webpack.ProvidePlugin({
               $:"jquery",
               jQuery:"jquery",
               "windows.jQuery":"jquery"
           })
       ]
   }
}
