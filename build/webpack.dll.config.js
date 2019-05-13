// dynamic link library（动态链接库）

//使用时，直接引入


var path = require('path');


var config = require('./config/'+ process.env.APP_ENV.trim() +'_config');
var src_path = config.src_path;
var dist_path = config.dist_path;


const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    mode: 'production',
    //此处需要进一步研究
    optimization: {
        // 代码压缩
        //minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: false,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                },
            }),
        ]
    },


    entry: {
        bundle1: [
            "react",
            "react-dom",
            "react-redux",
            "react-router",
        ],
        bundle2: [
            "react-draft-wysiwyg",
        ],
        bundle3: [
            "antd",


        ],

        bundle4: [
            "axios",
            "classnames",
            "draft-js",
            "draftjs-to-html",
            "es6-promise",
            "history",
            "lodash",

        ],


        bundle5: [
            "redux",
            "redux-devtools",
            "redux-devtools-dock-monitor",
            "redux-devtools-log-monitor",
            "redux-logger",
            "redux-thunk",

            "lodash-decorators",
            "moment",
            "rmc-cascader",
            "underscore",
            "validator"
        ],

        bundle6: [
            "svg.draggable.js",
            "svg.draggy.js",
            "svg.draw.js",
            "svg.easing.js",
            "svg.filter.js",
            "svg.js",
            "svg.panzoom.js",
            "svg.pathmorphing.js",
            "svg.resize.js",
            "svg.select.js",
            "@svgdotjs/svg.draggable.js",
            "@svgdotjs/svg.filter.js",
            "@svgdotjs/svg.panzoom.js",
        ],



        /*bundle: [
            "@svgdotjs/svg.draggable.js",
            "@svgdotjs/svg.filter.js",
            "@svgdotjs/svg.panzoom.js",
            "antd",
            "axios",
            "classnames",
            "draft-js",
            "draftjs-to-html",
            "es6-promise",
            "history",
            "lodash",
            "lodash-decorators",
            "moment",
            "react",
            "react-addons-css-transition-group",
            "react-addons-transition-group",
            "react-dom",
            "react-draft-wysiwyg",
            "react-iscroll",
            "react-lazyload",
            "react-redux",
            "react-router",
            "react-swipes",
            "react-validation",
            "redux",
            "redux-devtools",
            "redux-devtools-dock-monitor",
            "redux-devtools-log-monitor",
            "redux-logger",
            "redux-thunk",
            "rmc-cascader",
            "svg.draggable.js",
            "svg.draggy.js",
            "svg.draw.js",
            "svg.easing.js",
            "svg.filter.js",
            "svg.js",
            "svg.panzoom.js",
            "svg.pathmorphing.js",
            "svg.resize.js",
            "svg.select.js",
            "underscore",
            "validator"
        ],*/
    },
    output: {
        path: path.resolve(src_path,'webStatic/'),
        filename: '[name].js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            //告诉webpack指定库在项目中的位置,从而直接引入，不将其打包在内。

            //输出路径（被生成 manifest.json）
            path:   path.resolve(src_path,'webStatic')+ '/[name].manifest.json',

            // dll暴露的对象名，要跟output.library保持一致;
            name: '[name]_library',

            //context：解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致
        })
    ]
};