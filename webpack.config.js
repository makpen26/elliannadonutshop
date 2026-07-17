const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
      clean: true,
    },
    devtool: isProduction ? false : 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.json$/i,
          type: 'asset/resource',
          generator: {
            filename: 'data/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        inject: 'body',
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'styles.[contenthash].css' : 'styles.css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public/admin'),
            to: path.resolve(__dirname, 'dist/admin'),
          },
        ],
      }),
    ],
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      historyApiFallback: true,
      port: 8080,
    },
    performance: {
      hints: false,
    },
  };
};
