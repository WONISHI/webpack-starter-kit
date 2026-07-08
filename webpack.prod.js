"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  /**
   * 对象 entry 是多入口；数组 entry 是多个文件合成一个入口
   * 如果entry是对象代表双入口，那么不能多入口共用同一个固定输出文件名
   */
  entry: {
    index: "./src/index.js",
    search: "./src/search.js",
  },
  mode: "production",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]_[chunkhash:8].js",
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
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /.less$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 1024,
            name: "[name]_[contenthash:8].[ext]",
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
            name: "[name]_[contenthash:8].[ext]",
            esModule: false,
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
    }),
    new CssMinimizerPlugin(),
  ],
};
