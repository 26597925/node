/**
 * Created by zhouma on 2017/5/11.
 */
const http = require('http');
const util = require('util');
const path = require('path');
const WebSocket = require('ws');

const sessions = require(path.join(__dirname,'..','controllers',"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const hp_order_today = require(path.join(__dirname,'..','controllers',"order_today.js"));
var _ws = null;
var isopen = false;

/*** action
 client  <-->    server
 null    <-->    new_data
 list    <-->    list

 dt{type,action,data}
 */
exports.message = function(){
    var self = this;

    this.parentAlias = this.alias;
    this.alias = path.basename(__filename);
    _ws = this.ws;
    
    self.uID = this.data.uID;
    if(self.data && self.data.hasOwnProperty('action')){
        switch(this.data.action){
            case 'list':
                console.log("action list");
                self.responseDirect = responseDirect;
                hp_order_today.select_preorder.apply(self);
                break;
        }
    }
    this.ws.on('close', close);
};

var responseDirect=function(status,content_type,data){
    if(_ws && _ws.readyState === WebSocket.OPEN){
    sendData({'type':'order_today','action':'list','data':JSON.parse(data)});
    }
};

var close = function(){
    for(var elm in this){
        this[elm] = null;
        delete this[elm];
    }
    _ws = null;
    console.log('close order_today');
};

var sendData = function(sendData){
    _ws.send(JSON.stringify(sendData));
};

//exports.message
