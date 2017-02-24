"use strict";

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        "stockChart": "./src/charts/stock/index.ts",
        "base": "./src/core/canvas.ts"
    },
    context: path.join(__dirname, "./"),
    output: {
        filename: "./dist/charts/[name].js",
        library: "chart",
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".webpack.js", ".ts", ".js"]
    },
    module: {
        rules: [
            { 
                test: /\.ts?$/, 
                use: [
                    "babel-loader?presets[]=es2015",
                    "ts-loader"
                ]
            }
        ]
    }
}