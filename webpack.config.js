const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

const RemoveConsolePlugin = require('remove-console-webpack-plugin');
module.exports = (env) => {
    console.log ("env", env);
    return {
        entry: './index.ts',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist')
        },


        devServer: {
            static: {
                directory: __dirname,
            },
            compress: true,
            port: 9000,
            open: true,
            hot: true
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