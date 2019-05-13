
var gulp = require('gulp');
var business_config = require('./config/business_config');
var staticSource = business_config.src_path+'/webStatic/**/*.*';



if(process.argv[2] == "--watch"){
    gulp.watch(staticSource, function(){
        compileStaticSource();
    });
}


//编译静态资源
function compileStaticSource(){
    console.log(' staticSource --编译开始')
    gulp.src(staticSource)
        .pipe(gulp.dest(business_config.dist_path+'/webStatic/'));
    console.log(' staticSource --编译结束')


    var weixin = business_config.src_path+'/MP_verify_3r048Gsj7qpqa85z.txt';
    gulp.src(weixin)
        .pipe(gulp.dest(business_config.dist_path+'/'));
}


module.exports = compileStaticSource;




