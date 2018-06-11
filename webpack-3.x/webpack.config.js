const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const purifyCssPlugin = require('purifycss-webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const entry = require('./webpack_config/entry_webpack.js');

console.log(encodeURIComponent(process.env.type));
if (process.env.type == 'build') {
  var website = {
    publicPath: "http://172.26.1.163:7000/"
  }
} else {
  var website = {
    publicPath: "http://localhost:7000/"
  }
}

module.exports = {
  devtool: 'source-map',
  entry: {
    entry: './src/entry.js',
    jquery: 'jquery',
    vue: 'vue'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: extractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader", 
          options: {importLoaders: 1}
          },
          "postcss-loader"
        ]
      })
    },{
      test: /\.less$/,
      use: extractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader"
        }, {
          loader: "less-loader"
        }]
      })
    },{
      test: /\.scss$/,
      use: extractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }]
      })
    },{
      test: /\.styl$/,
      use: extractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader"
        }, {
          loader: "stylus-loader"
        }]
      })
    },{
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 5000,
          outputPath: 'img/'
        }
      }]
    }, {
      test: /\.(htm|html)$/,
      use: ['html-withimg-loader']
    }, {
      test: /\.(jsx|js)$/,
      use: {
        loader: "babel-loader"
      },
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['jquery', 'vue'],
      filename: 'assets/js/[name].js',
      minChunks: 2
    }),
    new webpack.ProvidePlugin({
      $: 'jquery'
    }),
    new htmlPlugin({
      minify: {
        removeAttributeQuotes: true
      },
      hash: true,
      template: './src/index.html'
    }),
    new extractTextPlugin("css/index.css"),
    new purifyCssPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*'))
    }),
    new webpack.BannerPlugin('Au_'),
    new copyWebpackPlugin([{
      from: __dirname + '/src/public',
      to: './public'
    }])
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: website.publicPath
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost',
    compress: true,
    port: 7000
  },
  watchOptions: {
    poll: 1000,
    aggregeateTimeout: 500,
    ignored: /mdoe_modules/,
  }
}