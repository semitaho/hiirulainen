
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: './index.ts',
  plugins: [

    new webpack.ProvidePlugin({
      "CANNON": "cannon"
    }),

     new webpack.ProvidePlugin({
      'BABYLON': 'babylonjs',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('./', "index.html"),
    }),
    new WebpackPwaManifest({
      name: 'Hiirulaispeli',
      id: 'hiirulainen',
      short_name: 'Hiirulainen',
      publicPath: './',
      description: 'Lasten oma hiirulaispeli, jossa leikitään piilosta!',
      background_color: '#ffffff',
      icons: [
        {
          src: 'icons/hiirulaisicon.png',
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes

        }

      ]
    })
  ]

};