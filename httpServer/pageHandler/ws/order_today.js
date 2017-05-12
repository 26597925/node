/**
 * Created by zhouma on 2017/5/11.
 */
const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,'..','controllers',"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

var _ws = null;
var isopen = false;



exports.message = function(){
    console.log('ws',JSON.stringify(this.data));
    this.alias = path.basename(__filename);
    _ws = this.ws;
    this.ws.on('close', close);
    sendData(this.data);
};



var close = function(){
    for(var elm in this){
        this[elm] = null;
        delete this[elm];
    }
    console.log('close order_today');
};

var sendData = function(sendData){
    _ws.send(JSON.stringify(sendData));
};