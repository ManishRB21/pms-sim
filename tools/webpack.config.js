const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    app: './src/server.js',
    cli: './src/cli.js',
  },
  output: {
    filename: 'pms.[name].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(process.cwd(), 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              'latest-minimal',
            ],
          },
        }],
      },
    ],
  },
};
