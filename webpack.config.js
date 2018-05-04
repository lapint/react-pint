const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var path = require('path');

var SERVER_URL = "//localhost/"; // switch this to your production build url when ready
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    SERVER_URL = "//localhost/";
}
module.exports = {
    cache: true,
    entry: {
        polyfill: 'babel-polyfill', // required for IE to work with Promise and such
        app: path.join(__dirname, 'src/js/main'),
    }
    ,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader", // Uses the html-loader to process the index.html file referenced in HtmlWebPackPlugin
                        options: { minimize: true } // minimize the resulting index.html output file
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ],
    },
    optimization: {
        runtimeChunk: true, // <-- to avoid all hashes of generated file change every time a piece of code change in 1 file ... (and spare 4kb)
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: 4, // run this many parallel processes to make uglify work faster (it's suggested to set it equal to the number of CPUs)
                uglifyOptions: {
                    compress: true,
                    ecma: 6,
                    mangle: true,
                    output: {
                        comments: false,
                        beautify: false,
                    }
                },
                sourceMap: false,
            })
        ],
        splitChunks: {
            chunks: "all" // keeps our bundles all separately chunked instead of in one vendor file
        },
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            'examplejs': path.resolve('example-src/js'), // Enables "import XYZ from 'litejs/XYZ'" which resolves to simplified-src/js/XYZ from anywhere
        }
    },
    plugins: [
        // new WebpackBundleSizeAnalyzerPlugin(path.join(__dirname, 'reports/plain-report.txt')), //Analyzes the webpack bundle sizes
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery", // makes $ available throughout the app as a jquery reference
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
            // "SERVER_URL": JSON.stringify("//localhost/")
            "SERVER_URL": JSON.stringify(SERVER_URL)
        }),
        new HtmlWebPackPlugin({ // This sets up our main index.html page to be processed and have appropriate js files inserted
            template: "src/index.html", // webpack is smart and starts with the JS files, then it looks for the mount point configured in main.js in this index.html file
            filename: "./index.html" // the resulting index.html file is then minimized
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[name].css"
        }),
    ],
    devtool: 'source-map',
    devServer: {
        contentBase: './dist', // If there is additional content that needs served up, place it in the ./dist dir and it will be available
        historyApiFallback: true, // 404s fallback to /index.html
        hot: true, // auto reloads when changes are made
        port: 3000, // runs at localhost:3000
        compress: true, // Enables GZIP compression on dev server
        disableHostCheck: true,   // Allow the dev server to be accessed outside localhost
    }
}

