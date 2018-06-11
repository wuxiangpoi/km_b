const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require("path");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConf = require('./webpack.base.config');

module.exports = merge(baseConf, {
    devServer: {
        port: 9090,
        hot: true,
        inline: true,
        open: true,
        proxy: {
            '/api': {
                target: 'http://192.168.1.158:9090',
                secure: false
            },
            '/client': {
                target: 'http://192.168.1.158:9090',
                secure: false
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"dev"'
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
});