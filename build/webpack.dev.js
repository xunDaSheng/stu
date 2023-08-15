const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
  mode: "development", // 开发模式,打包更加快速,省了代码优化步骤
  devtool: "eval-cheap-module-source-map", // 源码调试模式,后面会讲
  devServer: {
    port: 3000, // 服务端口号
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    // 修改App.tsx,浏览器会自动刷新后再显示修改后的内容，如果不想刷新浏览器并且能保持react组件的状态  需要借助@pmmmwh/react-refresh-webpack-plugin插件来实现,该插件又依赖于react-refresh
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置  webpack需要插件HotModuleReplacementPlugin配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
    },
  },
  plugins: [
    new ReactRefreshWebpackPlugin(), // 添加热更新插件
  ],
});
