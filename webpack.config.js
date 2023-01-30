const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {

    devServer: {
        static: {
            directory: __dirname,
        },
        compress: true,
        port: 9000,
        host: '0.0.0.0',
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