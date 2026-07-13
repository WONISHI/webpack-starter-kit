"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob = require("glob");

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  return {
    entry: entryFiles.reduce((prev, url) => {
      const pageName = url.match(/src\/(.*)\/index\.js/)[1];
      prev[pageName] = url;
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: [`${pageName}`],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        }),
      );
      return prev;
    }, {}),
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  /**
   * 对象 entry 是多入口；数组 entry 是多个文件合成一个入口
   * 如果entry是对象代表双入口，那么不能多入口共用同一个固定输出文件名
   */
  entry: entry,
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    ...htmlWebpackPlugins,
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
  },
};
