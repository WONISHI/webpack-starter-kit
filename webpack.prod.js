"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
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
  mode: "none",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]_[chunkhash:8].js",
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
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("autoprefixer")({
                    // browsers 是老写法，建议用 overrideBrowserslist
                    overrideBrowserslist: [
                      "last 2 versions",
                      "> 1%",
                      "iOS >= 7",
                    ],
                  }),
                ],
              },
            },
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
          "less-loader",
        ],
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
    ...htmlWebpackPlugins,
    new CleanWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: "react",
    //       entry: "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
    //       global: "React",
    //     },
    //     {
    //       module: "react-dom",
    //       entry:
    //         "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
    //       global: "ReactDOM",
    //     },
    //   ],
    // }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
