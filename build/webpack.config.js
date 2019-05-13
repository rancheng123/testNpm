



//目录结构
var dir={
    js: './js/',
    css: './style/',
    images: './images/'
};



var path = require('path');
var fs = require('fs');



//开发或生产环境
var isOnline = (process.env.NODE_ENV.trim() == 'production');


if(process.env.NODE_SOURCEMAP){
    var isNoSourceMap = (process.env.NODE_SOURCEMAP.trim() == 'noSourceMap');
}else{
    var isNoSourceMap = false;
}







var config = require('./config/'+ process.env.APP_ENV.trim() +'_config');
var src_path = config.src_path;
var dist_path = config.dist_path;


/*webpack插件 start*/
var webpack = require('webpack');

var HtmlWebpackPlugin= require('html-webpack-plugin');
var browserslist = require('browserslist');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
/*webpack插件 end*/
const HappyPack = require('happypack');


var indexHtml = new HtmlWebpackPlugin({
	template: path.resolve(src_path,'index.html'),
	hash: true,
    ipDebug: process.env.IP_DEBUG === true ? true: false,
});



var dllConfig = require('./webpack.dll.config');
var DllReferencePlugins = []
for(var name in dllConfig.entry){
    DllReferencePlugins.push(new webpack.DllReferencePlugin({
        //需要跟之前保持一致，这个用来指导webpack匹配manifest.json中库的路径；
        context: '.',
        //引入生成的manifest.json。
        manifest: require( path.resolve(src_path,'./webStatic/'+ name +'.manifest.json') ),
    }))
}



var plugins = [
    indexHtml,
    //热更新插件
    /*new webpack.HotModuleReplacementPlugin({

    }),*/

    new ExtractTextPlugin({
        //filename: isOnline ? dir.css+'styles[contenthash].css' : dir.css+'styles.css'  ,
        filename: isOnline ? 'styles[contenthash].css' : 'styles.css'  ,
        allChunks: true
    }),
    new HappyPack({
      // HappyPack 实例的id
      id: 'happyBabel',
      //开启4个进程
      threads: 4,
      loaders: [ {
        loader: 'babel-loader',
        options: {
          presets: ['env','es2015','react','stage-3'],
            plugins: [
                'babel-plugin-transform-object-rest-spread',
                "transform-class-properties",
                "transform-decorators-legacy"
            ]
        }
      } ]
    }),
    ...DllReferencePlugins
];





/*
require("babel-core").transform("code", {
    plugins: ["transform-object-rest-spread"]
});
*/





const cssLoaders = [
    /*{
     loader: 'style-loader'
     },*/
    {
        loader: 'css-loader',
        options: {
            sourceMap: true
        }
    },
    //注意事项：
    //postcss-loader需要放在style-loader,css-loader之前 ，sass-loader之后
    {
        loader: 'postcss-loader',
        options: {
            plugins: [
                //require('postcss-smart-import')({ /* ...options */ }),
                //require('precss')({ /* ...options */ }),
                require('autoprefixer')({
                    browsers: browserslist('> 1%')
                })
            ],
            sourceMap: true
        }
    }
];
const sassLoaders = cssLoaders.concat([
    /*{
        loader: 'sass-loader',
        options: {
            sourceMap: true
        }
    },*/

    {
        loader: 'fast-sass-loader',
        options: {
            //includePaths: [ ... ]
            sourceMap: true
        }
    }
])


const lessLoaders = cssLoaders.concat([
    {
        loader: 'less-loader',
        options: {
            sourceMap: true,
            javascriptEnabled: true,
        }
    }
])





module.exports = {

  // 'development'    Enables NamedChunksPlugin and NamedModulesPlugin
  // 'production'     Enables FlagDependencyUsagePlugin , FlagIncludedChunksPlugin , ModuleConcatenationPlugin
  //                , NoEmitOnErrorsPlugin , OccurrenceOrderPlugin , SideEffectsFlagPlugin and TerserPlugin .

  mode: isOnline ?  'production' : 'development',

  //此处需要进一步研究
  optimization: {
    // 代码压缩
    minimize: isOnline?true:false,


    // 是否包含启动时间
    runtimeChunk: false,
    // webpack 的一个优化项  ？？？？？
    concatenateModules: false,
    // 编译出错时，不发射 描述语句
    noEmitOnErrors: true,
    // 给模块起名字 其区分 为了更好的调试
    namedModules: true,
    // 给chunk起名字 其区分 为了更好的调试
    namedChunks: true,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,

      // webpack优化的点 ？？？？？
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          /*name: 'vendor',
          filename: 'vendor222',
          chunks: 'initial'*/
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },




    //插件项
    plugins:plugins,
    //页面入口文件配置
    entry: {
        vendors: [
            'react',
            'react-router',
            'react-dom',
            'react-addons-css-transition-group',
            'react-redux',
            'redux',
            'redux-devtools',
            'redux-devtools-dock-monitor',
            'redux-devtools-log-monitor',
            'redux-logger',
            'redux-thunk',
            'isomorphic-fetch',
            'react-addons-transition-group',
            'rmc-cascader',
            'underscore',
            "svg.js",
            '@svgdotjs/svg.draggable.js',
            '@svgdotjs/svg.filter.js',
            '@svgdotjs/svg.panzoom.js',
            'svg.draggable.js',
            'svg.draggy.js',
            'svg.draw.js',
            "svg.easing.js",
            "svg.filter.js",

            "svg.panzoom.js",
            "svg.pathmorphing.js",
            "svg.resize.js",
            "svg.select.js",
            'antd',
            'classnames',
            'history',
            'moment'


        ],
        index : path.resolve(src_path,'js/index.js')

    },

    output: {
        path: dist_path,
        filename: isOnline ? dir.js+'[name].[chunkhash:5].js' : dir.js+'[name].js'  ,
        chunkFilename: isOnline ? dir.js+'modules/[name].[chunkhash:5].chunk.js' : dir.js+'modules/[name].chunk.js' ,
        publicPath: (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'qa') ? '/' : 'http://'+ config.host +':'+ config.port +'/'
    },
    watch: true,
    watchOptions: {
        poll: true
    },

    devtool: process.env.NODE_SOURCEMAP || '',
    //devtool: 'cheap-module-eval-source-map',
    module: {

        //noParse: /node_modules\/(antd\/lib\/index.js)/,

        //加载器配置
        rules: [
            {
                test: /\.css$/,
                include: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    use: cssLoaders
                }),
            },

            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    use: sassLoaders
                }),
            },

            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    use: lessLoaders
                }),
            },

            {
                test: /\.js$/,
                // 匹配不希望处理文件的路径
                exclude: /(node_modules|bower_components)/,

                use: 'happypack/loader?id=happyBabel',
            },


            {
                test: /\.(jpeg|jpg|png|gif)$/,
                loader: 'url-loader?limit=8192&name=images/[name].[hash:8].[ext]'

                //html中使用  <img src={require("./ran.jpg")} alt="22222222"/>

            },
            // 新增pdf-loader haoliang
            {
                test: /\.(pdf)$/,
                use: 'file-loader?name=[path][name].[ext]',
            },
              
           /* {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            },*/
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: {
                    loader: 'svg-react-loader',
                    options: {
                    },
                },
            }
           //蚂蚁金服字体 start
           /*{
                test: /\.(svg)$/i,
                loader: 'svg-sprite-loader',
                include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
            },*/
            //蚂蚁金服字体 end

        ]
    },
    //其它解决方案配置
    resolve: {
        alias: {
            // 新增@指引文件符号 haoliang
            '@': path.resolve('frontEnd/business/src'),
            '@widget': path.resolve('frontEnd/business/src/js/widget'),
            '@modules': path.resolve('frontEnd/business/src/js/components/modules'),
            '@components': path.resolve('frontEnd/business/src/js/components'),
            '@api': path.resolve('frontEnd/business/src/js/api'),
            '@space': path.resolve('frontEnd/business/src/js/page/space'),
            '@svg': path.resolve('frontEnd/business/src/image/svg'),
            AppStore : 'js/stores/AppStores.js',  //后续直接 require('AppStore') 即可
            ActionType : 'js/actions/ActionType.js',
            AppAction : 'js/actions/AppAction.js',
            test: path.resolve(src_path,'js/asset/third/test.js')
        },
        extensions: ['.web.js','.js', '.json', '.scss'],
    },

    devServer: {
        before: function(app, server) {
            app.get('/webStatic/*', function(req, res) {
                var resource = req.originalUrl.replace('/webStatic','');

                var filePath =  path.resolve(src_path,'./webStatic' + resource)

                var data = fs.readFileSync(filePath ,'utf-8');

                res.send(data)

            });
        },

        hotOnly: process.env.HOTONLY? true: false,
        host: config.host,
        port: config.port
    }
};
