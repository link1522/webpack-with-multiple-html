const path = require('path')
// plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = env => {
  let mode = 'development'
  let target = 'web'
  let devtool = 'source-map'

  if (env.production) {
    mode = 'production'
    target = 'browserslist'
    devtool = false
  }

  // ***** multiple html page *****
  const htmlPageNames = ['index', 'aboutUs', 'projects', 'nftPage']
  const multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
      template: `./src/${name}.html`, // relative path to the HTML files
      filename: `${name}.html`, // output HTML files
      chunks: [`${name}`] // respective JS files
    })
  });
  const multipleEntry = htmlPageNames.map(name => ({
    [name]: `./src/js/${name}.ts`
  }))
  const entry  = Object.assign(...multipleEntry)

  return {
    mode,
    target,
    entry,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash:10].js',
      clean: true,
      assetModuleFilename: 'images/[hash][ext][query]'
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            // 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['postcss-preset-env']
                }
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: 'babel-loader'
        },
        {
          test: /\.tsx?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset'
        }
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.tsx', '.ts', '.js']
    },
    devtool,
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist')
      },
      port: 3000,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true
    },
    plugins: [
      ...multipleHtmlPlugins,
      new MiniCssExtractPlugin({
        filename: 'css/main.css'
      }),
      new ESLintPlugin(),
    ]
  }
}
