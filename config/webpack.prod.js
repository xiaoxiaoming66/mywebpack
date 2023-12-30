// webpack4和5的区别 webpack5内置了图片处理的loader 可以直接配置使用  webpack4 需要下载 file-loader 和url-loader
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const EslintWebpackPlugin = require('eslint-webpack-plugin')
// 提取css并通过link引入
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// css压缩支持缓存和并发
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const os = require('os')
// webpack内置的插件
const TerserWebpackPlugin = require('terser-webpack-plugin')
const threads = os.cpus().length

// 添加PWA
const WorkboxPlugin = require('workbox-webpack-plugin');

console.log(555,threads);

function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env'
          ],
        }
      }
    },
    pre
  ].filter(Boolean)
}



module.exports = {
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src")
    }
  },
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
    // 这个和下面的generator只需要设置一个
    // assetModuleFilename: 'static/[name].[hash:5][ext][query]',
    chunkFilename:"js/[name].[hash:5].js",
    clean: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    },
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),

      // 压缩图片 有损压缩和无损压缩
    ],
  },
  module: {
    rules: [
      {
        oneOf:[
          {
            test: /\.css$/,
            use: getStyleLoader()
          },
          {
            test: /\.less$/,
            use: getStyleLoader("less-loader")
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoader("sass-loader")
          },
          {
            test: /\.styl$/,
            use: getStyleLoader("stylus-loader")
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024
              }
            },
            generator: {
              filename: 'static/images/[name].[hash:10][ext][query]'
            }
          },
          {
            test: /\.(ttf|woff2?)$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/fonts/[name].[hash:10][ext][query]'
            }
          },
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: 'asset/resource',
            generator: {
              filename: 'static/media/[name].[hash:10][ext][query]'
            }
          },
          {
            test: /\.m?js$/,
            // exclude: /(node_modules|bower_components)/,
            // 或者只处理src
            include:path.resolve(__dirname,'../src'),
            use: [
              {
                loader:'thread-loader',
                options:{
                  works: threads
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  // .babelrc.js文件中有了
                  // presets: ['@babel/preset-env'],
                  // 开启babel缓存 ，并关闭缓存的压缩
                  cacheDirectory: true,
                  cacheCompression: false,
                  plugins:['@babel/plugin-transform-runtime'] //babel使用tree-sharking
                },
              },
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      template: 'public/index.html'
    }),
    new WebpackBar({
      color: 'yellow'
    }),
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude:"node_modules",
      cache:true,
      threads //开启多进程打包
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/index.css',
      chunkFilename:'static/css/[name].chunk.css'
    }),
    new TerserWebpackPlugin({
      parallel: threads
    }),
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ]

}


