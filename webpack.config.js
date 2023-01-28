const path = require("path");
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
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
      
    ],
    mode: "development"
});