// webpack.prod.js

const { merge } = require("webpack-merge");
const path = require("path");
const baseConfig = require("./webpack.base.js");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    // 开发环境已经在devServer中配置了static托管了public文件夹,在开发环境使用绝对路径可以访问到public
    // 下的文件,但打包构建时不做处理会访问不到,所以现在需要在打包配置文件webpack.prod.js中新增copy插件配置
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"), // 复制public下文件
          to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
          filter: (source) => {
            return !source.includes("index.html"); // 忽略index.html
          },
        },
      ],
    }),
  ],
});
