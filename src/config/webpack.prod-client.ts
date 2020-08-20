import path from "path";
import webpack from "webpack";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import BrotliPlugin from "brotli-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ReactLoadablePlugin } from 'react-loadable/webpack';

module.exports = {
  name: "client",
  mode: "production",
  entry: {
    vendor: ["react", "lodash"],
    main: ["./client/main.ts"]
  },
  output: {
    filename: "[name]-bundle.js",
    chunkFilename: "[name].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/"
  },
  optimization: {    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "images/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"]
  },
  plugins: [
    new ReactLoadablePlugin({
      filename: './react-loadable.json',
    }),

    new MiniCssExtractPlugin({
      filename: "global.css",
      chunkFilename: "[name].css"
    }),    
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        WEBPACK: true
      }
    }),
    new UglifyJSPlugin(),
    new CompressionPlugin({
      algorithm: "gzip"
    }),
    new BrotliPlugin(),
    /*
    new BundleAnalyzerPlugin({
      generateStatsFile: true
    })
    */
  ]
}
