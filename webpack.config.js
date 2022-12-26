const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: './index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "CANNON": "cannon"
        })
    ],
    mode: "development"
};