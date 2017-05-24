/**
 * Created by zhouma on 2017/5/17.
 */

const cp = require('child_process');
const path = require("path");
const bean = require(path.join(__dirname,'bean','bean_entity'));
const fs = require('fs');

//var workers = process.env.WORKERS || require('os').cpus().length;

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var dispatcher = function(){
    this.workers = [];
    this.processTotal = 10;
    var count = this.processTotal;
    this.dispatch = function(){
        console.log('fork Parse.js');
        while (count > 0){
            count--;
            this.workers[count] = cp.fork("./crawler/crawler_stock.js",['count'+count],{'env':{'id':count}});

            this.workers[count].on("close",function(code,s){
                console.log('master process close',code,s);
            });

            this.workers[count].on('exit',function(code){
                console.log("master process exit", code );
            });

            this.workers[count].on("error",function(err){
                console.log("master process error", err);
            });

            this.workers[count].on("message",function(msg){
                //console.log('master process msg',msg.type,msg.action);//JSON.stringify(msg.data).substr(0,30);
                switch( msg.type ){
                    case bean.STOCKDATA:
                        // msg.type
                        // msg.data

                        for(var elm in msg.data){
                            if(self.stock_list.hasOwnProperty(elm)){
                                self.stock_list[elm] = msg.data[elm];
                            }
                        }

                        break;
                }
            });
        }

    };

    this.broadcast = function(msg){
        //console.log('broadcast',msg.type);
        switch( msg.type ){
            case bean.STOCKCODE:
                var obj_stock = JSON.parse(msg.data);
                var dtL = obj_stock.length;
                //console.log("obj_stock.length",dtL);
                var avDtL = Math.ceil(dtL/this.processTotal);
                //console.log("avDtL.length",avDtL);
                var obj_stock_sun = [];
                var index = 0;
                for( var i = 0; i < this.processTotal; i++ ){
                    if(obj_stock.length>avDtL){
                        obj_stock_sun[index++] = obj_stock.splice(0,avDtL);
                    }else{
                        obj_stock_sun[index++]=obj_stock;
                    }
                }
                var sendDate = null;
                for( var i = 0; i < this.processTotal; i++ ){
                    // if( i==0   ){//|| i == 1
                        if(this.workers[i].channel){
                            sendDate = new bean.stock();
                            sendDate.type = bean.STOCKCODE;
                            sendDate.data = obj_stock_sun[i];
                            this.workers[i].send(sendDate);
                        }
                    // }
                }

                break;
            case bean.STOCKDOWN:
                for( var i = 0; i < this.processTotal; i++ ){
                     // if(i==0 ){// || i == 1
                        if(this.workers[i].channel){
                            this.workers[i].send(msg);
                        }
                     // }
                }
                break;

        }
    };

    this.printPid=function(){
        var self = this;
        for(var i = 0; i < self.workers.length; i++){
            console.log('printPid', self.workers[i].pid );
        }
    };

    this.IntervalId;
    this.heartbeat = function(){
        if( this.IntervalId == null ){
            var self_disp = this;
            this.IntervalId = setInterval(function(){


                if(null == self.preDate ){

                    self.preDate = Math.floor(new Date().getTime()/1000)*1000;
                    self_disp.handlerHeartbeat();

                }else{
                    var date = new Date();
                    if(date.getTime()-self.preDate >=6000){
                        self.preDate = Math.floor(new Date().getTime()/1000)*1000;
                        self_disp.handlerHeartbeat();
                    }
                }


            },500);
        }
    };

    this.sendDate = null;
    this.handlerHeartbeat = function(){


        self.stock_list[self.preDate] = {};

        self.timeStamp.push(String(self.preDate));
        if( self.timeStamp.length > 11 ){
            self.timeStamp.shift();
            for(var elm in self.stock_list){
                if(self.timeStamp.indexOf(elm)==-1){
                    self.stock_list[elm] = null;
                    delete self.stock_list[elm];
                }
            }
        }

        //delete pre sendDate
        if(this.sendDate){
            for(var elm in this.sendDate){
                if(this.sendDate[elm] && typeof(this.sendDate[elm]) == 'object'){
                    for(var inelm in this.sendDate[elm]){
                        if(this.sendDate[elm][inelm]){
                            this.sendDate[elm][inelm] = null;
                        }
                        delete this.sendDate[elm][inelm];
                    }
                }
                if(this.sendDate[elm]){this.sendDate[elm] = null;}
                delete this.sendDate[elm];
            }
        }

        this.sendDate = new bean.stock();
        this.sendDate.type = bean.STOCKDOWN;
        this.sendDate.data = {'timestamp':self.preDate};
        disp.broadcast(this.sendDate);
        self.sendWebData();
    };
};

var disp = new dispatcher();
disp.dispatch();
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/**
 *		  		stock_list              obj
 *		        ／      \
 *		       ／        \
 *		      timestamp  timestamp      obj
 *		    	/
 *		       /
 *		        stock_code              obj
 *		    	/
 *		       /
 *		       detail                   array
 */
this.stock_list = {};
this.timeStamp = [];
this.preDate = null;
var self = this;

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
process.on('message', function(msg) {
    console.log('>>>>>>>msg',msg);
});

process.on('exit', function(msg) {
    disp.printPid();
    console.log("master process received a message: ",JSON.stringify(msg));
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
this.web_worker = cp.fork("./httpServer/web_server.js");

this.web_worker.on("close",function(code,s){
    console.log('web process close',code,s);
});

this.web_worker.on('exit',function(code){
    console.log("web process exit", code );
});

this.web_worker.on("error",function(err){
    console.log("web process error", err);
});

this.web_worker.on("message",function(msg){

    switch( msg.type ){
        case bean.STOCKCODE:
            disp.broadcast(msg);
            disp.heartbeat();
            break;

    }

});

this.sendWebData = function(){
    var sendDate = new bean.stock();
    sendDate.type = bean.STOCKDATA;
    sendDate.data = {'timestamp':this.timeStamp,'stock_list':this.stock_list};
    if(this.web_worker && this.web_worker.hasOwnProperty('channel')){
        this.web_worker.send(sendDate);
    }
};