// webpack4和5的区别 webpack5内置了图片处理的loader 可以直接配置使用  webpack4 需要下载 file-loader 和url-loader
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const EslintWebpackPlugin = require('eslint-webpack-plugin')



module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "8888", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  entry: {
    app: './src/index.js'
  },
  output: {
    path:path.join(__dirname,'dist'),
    filename: 'js/[name].js',
    // 这个和下面的generator只需要设置一个
    // assetModuleFilename: 'static/[name].[hash:5][ext][query]',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use:['style-loader','css-loader']
      },
      {
        test: /\.less$/,
        use:['style-loader','css-loader','less-loader']
      },
      {
        test: /\.s[ac]ss$/,
        use:['style-loader','css-loader','sass-loader']
      },
      {
        test: /\.styl$/,
        use:['style-loader','css-loader','stylus-loader']
      },
      {
        test:/\.(png|jpe?g|gif|webp|svg)$/,
        type:'asset',
        parser: {
          dataUrlCondition:{
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/images/[name].[hash:10][ext][query]'
        }
      },
      {
        test:/\.(ttf|woff2?)$/,
        type:'asset/resource',
        generator: {
          filename: 'static/fonts/[name].[hash:10][ext][query]'
        }
      },
      {
        test:/\.(ttf|woff2?|mp3|mp4|avi)$/,
        type:'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash:10][ext][query]'
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }, 
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      title: 'My App',
      template: 'public/index.html'
    }),
    new WebpackBar({
      color:'yellow'
    }),
    new EslintWebpackPlugin({
      context: path.resolve(__dirname,'src')
    })
  ]

}


