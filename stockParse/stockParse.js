/**
 * Created by zhouma on 2017/5/15.
 */

const http = require('http');
const util = require('util');
const path = require('path');

exports.aaa=function(){

}
//http://hq.sinajs.cn/list=sh601003,sz300104,sh601001,sh601002,sz000002
var getSinaStock = function(){

}
var proxy_capitals = function(sendData,callback){
    var result = JSON.stringify(sendData) ;
    console.log( path.basename(__filename), "http_post",JSON.stringify( result) ) ;
    var options = {
        host:'111.206.209.27',
        port: 8080,
        path: '/account/detail?',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var req = http.request(options, function(res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log('Body: ' + body);
            if(callback){
                callback(body);
            }
        });
    });


    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(result);
    req.end();
};


var proxy_stock = function(callback){
    stock_load = true;
    var url = 'http://111.206.211.60/code.json';
    http.get(url,function(res){
        // console.log("content-type",res.headers['content-type'] );
        var result="";
        res.setEncoding("utf8");
        res.on("data",function(chunk){
            result += chunk;
        });
        res.on("end",function(){
            stock_load = false;
            if(callback){
                callback(result);
            }

        });
    }).on("error",function(err){
        if(callback){
            callback(null);
        }
        stock_load = false;
        console.log("error>>>",err);
    })
};