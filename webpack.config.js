"use strict";

const path = require("path");

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
    filename: "[name].js",
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
        use: ["file-loader"],
      },
    ],
  },
};
