const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {plugins} = require("@babel/preset-env/lib/plugins-compat-data");

module.exports = {
    entry: './src/app.js', // Точка входа
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        watchFiles: ['src/**/*'],
        liveReload: true,
        compress: true,
        port: 8080,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Шаблон HTML
        }),
    ],
};