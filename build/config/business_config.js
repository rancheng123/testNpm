/*path start*/
var path = require('path');
var current_path = path.resolve(__dirname);
var src_path = path.resolve(current_path, '../../frontEnd/business/src');
var dist_path = path.resolve(current_path, '../../frontEnd/business/dist');
/*path end*/


function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

var ip = getIPAdress();

var host = 'local-dream.mxj360.com'


module.exports = {
    src_path,
    dist_path,
    host: ip,
    port: 8388
}