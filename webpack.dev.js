"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = {
  /**
   * 对象 entry 是多入口；数组 entry 是多个文件合成一个入口
   * 如果entry是对象代表双入口，那么不能多入口共用同一个固定输出文件名
   */
  entry: {
    index: "./src/index.js",
    search: "./src/search.js",
  },
  mode: "development",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.less$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10240,
          },
        },
      },
      {
        test: /\.(woff|woff2|ttf|otf)$/i,
        type: "javascript/auto",
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[contenthash:8].[ext]",
            esModule: false,
          },
        },
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new CleanWebpackPlugin()],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
  },
};
