/**
 * Created by zhouma on 2017/5/11.
 */
const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,'..','controllers',"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const hp_order_today = require(path.join(__dirname,'..','controllers',"order_today.js"));

var _ws = null;
var isopen = false;

exports.message = function(){
    var self = this;

    this.parentAlias = this.alias;
    this.alias = path.basename(__filename);
    _ws = this.ws;

    console.log('ws',JSON.stringify(this.data));
    self.uID = this.data.uID;
    if(self.data && self.data.hasOwnProperty('action')){
        switch(this.data.action){
            case 'paginate':
                _ws.currentPage = self.data.data;
                break;
        }
    }
    self.responseDirect = responseDirect;
    self.ws.on('close', close);
    hp_order_today.select_preorder.apply(self);
};

var responseDirect=function(status,content_type,data){
   // sendData(data);
};

var close = function(){
    for(var elm in this){
        this[elm] = null;
        delete this[elm];
    }
    console.log('close market');
};

var sendData = function(sendData){
    _ws.send(JSON.stringify(sendData));
};