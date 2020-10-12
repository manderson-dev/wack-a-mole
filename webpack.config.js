const path = require('path')

module.exports = {
    entry: './src/mole.js',
    mode: 'production',
    output: {
        filename: 'mole.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}