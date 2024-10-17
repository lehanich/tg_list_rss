const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PugPlugin = require('pug-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const webpack = require('webpack');

const pubProdPath = isDevelopment ? '' : '';
const assetDirPath = 'assets/';

const dotenv = require('dotenv');

require('dotenv').config({ path: ['.env.bot.local', '.env'] });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const env = dotenv.config({ path: ['.env.bot.local', '.env'] }).parsed || {};
console.log(env);

module.exports = {
  entry: {
    // define Pug files here
    index: './src/index.pug', // => dist/index.html
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle-[hash].js',
    // publicPath: '/',
    publicPath: '/' + pubProdPath,
    path: path.join(__dirname, 'dist', pubProdPath),    
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin({/* options: see below */})]
  },
  devServer: {
    // static: 'vendor',
    // client: {
    //   overlay: true
    // },
    // historyApiFallback: true,
    // static: path.resolve(__dirname, 'dist'),
    // static: path.join(__dirname, 'dist'),
    // static: {
    //     directory: path.join(__dirname, "./")
    //   }
    // contentBase: 'dist',
    compress: true,
    port: 3002,
    proxy: {
      '/api-public': {
        target: {
          host: 'api.telegram.org',
          protocol: 'https:',
          port: 443
        },
        pathRewrite: {
          '^/api-public': `/bot${process.env.BOT_KEY}`,
          '^/api-private': '/private-api/v1'
        }
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader
        //☝🏽 Load Pug files
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {},
          // },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|ico)(\?v=\d+\.\d+\.\d+)?$/,
        generator: {
          filename: assetDirPath + '[hash][ext][query]'
        },
        type: 'asset/resource'
        // type: 'asset/inline'
      },
      {
        test: /\.(wav)(\?v=\d+\.\d+\.\d+)?$/,
        // generator: {
        //   filename: 'webcall/[name][ext][query]'
        // },
        type: 'asset/resource'
        // type: 'asset/inline'
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__dirname, 'src', 'assets'),
          // to: './assets',
          to: './' + assetDirPath,
        },
      ],
    }),
    new PugPlugin({
      pretty: true,
      template: 'src/index.pug',
      filename: 'index.html',
      js: {
        // output filename of extracted JS file from source script
        // filename: 'assets/js/[name].[contenthash:8].js', //.[contenthash:8]
        filename: assetDirPath + '[name].[contenthash:8].js',
      },
      css: {
        // output filename of extracted CSS file from source style
        // filename: 'assets/css/[name].[contenthash:8].css',
        filename: assetDirPath + '[name].[contenthash:8].css'
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'style-[hash].css',
    }),
    new webpack.DefinePlugin({
      blabla: '{"ttt":1}',
      'process.env': JSON.stringify(env)
    }),
  ],
};