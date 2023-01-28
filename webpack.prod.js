const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const RemoveConsolePlugin = require('remove-console-webpack-plugin');
module.exports = (env) => {
    return {
        entry: './index.ts',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist')
        },


        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [

            
                { test: /\.tsx?$/, loader: "ts-loader" },
                {
                    test: /\babylon.dynamicTerrain.js\.js$/,
                    use: ['imports-loader?BABYLON=>require("babylonjs")']
                }
            ]

        },
        plugins: [
            new webpack.ProvidePlugin({
                "CANNON": "cannon"
            }),

            new CopyPlugin({
                patterns: [
                  { from: "audio", to: "audio" },
                  { from: "textures", to: "textures" },

                ],
              }),

            new RemoveConsolePlugin(),




            new webpack.ProvidePlugin({
                'BABYLON': 'babylonjs',
            }),
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve('./', "index.html"),
            }),
        ],
        mode: "development"
    };

};