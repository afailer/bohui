const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const ExtractTextPlugin=require('extract-text-webpack-plugin');
const Webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin")
const px2remLoader = {
  loader: 'px2rem-loader',
  options: {
    //一般设置75
    remUnit: 35
  }
}
module.exports = {
  entry: path.join(__dirname, "src/main.js"), //调用main.js作为入口文件
  output: {
    //打包完的js文件会在bundle.js中，这个文件待会会自动生成的
    filename: "bundle.js",
    path: path.join(__dirname, "dist") //用来存放bundle.js文件的地址，自己定义
  },

  // module: {
  //   rules: [
  //     {
  //       test: /.vue$/,
  //       loader: "vue-loader"
  //     },
  //     {
  //       test: /.css$/,
  //       use: ["style-loader", "css-loader"]
  //     },
  //     {
  //       //less文件
  //       test: /\.less$/,
  //       use: ["style-loader", "css-loader", "less-loader"]
  //     },
  //     {
  //       //sass文件
  //       test: /\.sass$/,
  //       use: ["style-loader", "css-loader", "sass-loader"]
  //     },
  //     {
  //       //图片文件
  //       test: /\.(jpg|gif|png|jpeg|svg|bmp)$/,
  //       use: [
  //         {
  //           loader: "url-loader",
  //           options: {
  //             limit: 1024,
  //             name: "[name].[ext]"
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       //字体文件
  //       test: /\.(woff|woff2|eot|ttf)$/,
  //       use: ["url-loader"]
  //     },
  //     {
  //       test: /\.js$/,
  //       loader: "babel-loader",
  //       exclude: __dirname + "node_modules",
  //       include: __dirname + "src",
  //       options: {
  //         presets: ["env"]
  //       }
  //     }

  //     // {
  //     //   //ES6
  //     //   test: /\.js$/,
  //     //   //排除node_modules中的内容
  //     //   exclude: /node_modules/,
  //     //   use: ["babel-loader"]
  //     // }
  //   ]
  // },
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: "vue-loader"
      },
      // {
      //   test: /.css$/,
      //   use: ["style-loader", "css-loader"]
      // },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        //less文件
        test: /\.less$/,
        use: ["style-loader", "css-loader","px2remLoader", "less-loader",]
      },
      {
        //sass文件
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },

      {
        //图片文件
        test: /\.(jpg|gif|png|jpeg|svg|bmp)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              name: "image/[name].[ext]",
            }
          }
        ]
      },
      {
        //字体文件
        test: /\.(woff|woff2|eot|ttf)$/,
        use: ["url-loader"]
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: __dirname + "node_modules",
        include: __dirname + "src",
        options: {
          presets: ["env"]
        }
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      //将src目录下的index.html作为模板，每次在打包的时候，都会将其复制到dist目录下，并且自动为其引入bundle.js
      template: path.join(__dirname, "index.html")
    }),
    //这边是给dev-server设置一个插件，如果没有这个插件则热更新会报错
    new Webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("[name].css")
  ]
};
