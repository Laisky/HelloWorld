var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

// 3rd plugins
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
// require("bootstrap-loader");

// get env and set __DEV__
var devFlagPlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

module.exports = {
    entry: {
        sites: './static/jsx/main.jsx',
        vendor: [
            'jquery',
            'bootstrap',
            'react',
            'react-dom',
            'react-router',
            'redux',
            'react-redux'
        ]
    },
    // entry: [
    //     './static/jsx/main.jsx'
    // ],
    output: {
        filename: './build/sites.js'
    },
    module: {
        loaders: [
            // load jsx parse by babel and react
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2016&presets[]=es2015&presets[]=react'
            },
            // load css to inline
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader"
                    // "postcss-loader"
                )
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader",
                    // "postcss-loader",
                    "sass-loader"
                )
                // loader: "style-loader!raw-loader!sass-loader?includePaths[]=" + path.resolve(__dirname, "./node_modules/compass-mixins/lib")
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // uglify js output
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', './build/vendor.js'),
        new webpack.ProvidePlugin({
            '$': "jquery",
            'jQuery': "jquery",
            'React': 'react',
            'ReactDOM': 'react-dom',
            'ReactRouter': 'react-router',
            'Redux': 'redux',
            'ReactRedux': 'react-redux'
        }),
        new ExtractTextPlugin("./build/sites.css"),
        // new OpenBrowserPlugin({
        //     url: 'http://localhost:8080'
        // }),
        devFlagPlugin
    ]
};
