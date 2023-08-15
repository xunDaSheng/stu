// webpack.base.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"],
    alias: {
      "@": path.join(__dirname, "../src"),
    },
  },
  // 持久化缓存，可提高第二次及后面的打包速度
  // 在webpack5之前做缓存是使用babel-loader缓存解决js的解析结果,cache-loader缓存css等资源的解析结果
  // ,还有模块缓存插件hard-source-webpack-plugin,配置好缓存后第二次打包,通过对文件做哈希对比来验证文
  // 件前后是否一致,如果一致则采用上一次的缓存,可以极大地节省时间.
  // webpack5 较于 webpack4,新增了持久化缓存、改进缓存算法等优化,通过配置 webpack 持久化缓存,来缓存生成的 webpack 模块和 chunk,

  // 缓存的存储位置在node_modules/.cache/webpack,里面又区分了development和production缓存
  cache: {
    type: "filesystem", // 使用文件缓存
  },
  // 一般第三库都是已经处理好的,不需要再次使用loader去解析,可以按照实际情况合理配置loader的作用范围,来减少不必要的loader解析,
  // 节省时间,通过使用 include和exclude 两个配置项,
  //   include：只解析该选项配置的模块
  //   exclude：不解该选项配置的模块,优先级更高
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, "../src")], //只对项目src文件的ts,tsx进行loader解析
        test: /.(ts|tsx)$/,
        // thread-loader 开启多进程解析loader  开启多线程也是需要启动时间,大约600ms左右,所以适合规模比较大的项目
        use: ["thread-loader", "babel-loader"],
      },
      {
        test: /.(c|le)ss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            // css3低版本浏览器兼容  postcss-loader：处理css时自动加前缀  autoprefixer：决定添加哪些浏览器前缀到css中
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
            },
          },
          "less-loader",
        ],
      },
      // 对于图片文件,webpack4使用file-loader和url-loader来处理的,但webpack5不使用这两个loader了,而是采用自带的asset-module来处理
      {
        test: /.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/images/[name][ext]", // 文件输出目录和命名
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/fonts/[name][ext]", // 文件输出目录和命名
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: "static/media/[name][ext]", // 文件输出目录和命名
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    }),
    // 将环境变量注入到业务代码中
    new webpack.DefinePlugin({
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
    }),
  ],
};
