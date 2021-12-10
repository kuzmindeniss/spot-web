const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  target: "web",
  cache: false,
  entry: path.join(__dirname, "src", "index.tsx"),
  devtool: 'source-map',
  output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: '/',
      filename: "index.js"
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      Svgs: path.resolve(__dirname, 'src/assets/svgs'),
      Rdx: path.resolve(__dirname, 'src/rdx'),
      Utils: path.resolve(__dirname, 'src/utils'),
      Hooks: path.resolve(__dirname, 'src/hooks'),
      Providers: path.resolve(__dirname, 'src/providers'),
    }
  },
  devServer: {
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", {
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        }, {
          loader: "sass-loader",
          options: {
              sourceMap: true,
          }
        }],
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      cache: false
    }),
    new CopyPlugin({
      patterns: [
          {
              from: "assets/**/*",
              context: path.resolve(__dirname, "src"),
          },
      ],
    }),
  ],
}