/**
 * Created by zhouma on 2017/5/15.
 */

const http = require('http');
const util = require('util');
const path = require('path');

//http://hq.sinajs.cn/list=sh601003,sz300104,sh601001,sh601002,sz000002

var getSinaStock = function(){

    var url = 'http://hq.sinajs.cn/list=';
    var param = 'sh601003,sz300104,sh601001,sh601002,sz000002';
    
    http.get(url+param,function(res){
    // console.log("content-type",res.headers['content-type'] );
       var result="";
       res.setEncoding("utf8");
       res.on("data",function(chunk){
            result += chunk;
       });
       res.on("end",function(){

            if(callback){
                callback(result);
            }

       });
    }).on("error",function(err){
       if(callback){
          callback(null);
       }

       console.log("error>>>",err);
    });
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


ck();