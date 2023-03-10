const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const RemoveConsolePlugin = require('remove-console-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
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
    
        new CopyPlugin({
            patterns: [
                { from: "audio", to: "audio" },
                { from: "textures", to: "textures" },
                { from: "icons", to: "icons" },
                { from: "assets", to: "assets" }

            ],
        }),

        new RemoveConsolePlugin(),

        new webpack.ProvidePlugin({
            'BABYLON': 'babylonjs',
        })
    ],
    mode: "development"
});