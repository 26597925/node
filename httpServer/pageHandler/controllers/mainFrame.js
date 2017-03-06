var util = require('util');
var path = require('path');

var db = require(path.join(__dirname,"..","..","web_DB_config.js"));
var server = require(path.join(__dirname,"..","..","web_worker"));
var validate = require(path.join(__dirname,"sessions")).validate;


var TABLE_RTMFP_SERVERDATA = 'server_data_overload';

var res_ver = {};
res_ver.data = new Array();
var live_table = new Array();
var vod_table = new Array();





