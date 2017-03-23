const webpack = require('webpack'); //to access built-in plugins

module.exports = {
    entry: './app/index.js',
    plugins: [
        new webpack.ProvidePlugin({
            _: '../vendor/lodash.core'
        })
    ],
    output: {
        filename: 'bundle.js',
        path: './dist'
    },
    devtool: "source-map",
    watch: true,
    performance: {
        hints: false
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    }
}
