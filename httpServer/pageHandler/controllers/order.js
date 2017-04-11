const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

const policy = require('./policy.js');
const user_account = require('./user_account.js');

exports.select_preorder=function(){
    console.log(path.basename(__filename),">>>>>>>>\n",arguments);
};

// exports.select_preorder=function(){
//     console.log(path.basename(__filename),">>>>>>>>\n",arguments);
// };

exports.select_userPolicyGID=function(){
    console.log(path.basename(__filename),">>>>>>>>\n",arguments);

    policy.select_alreadySubscrible.apply(this,arguments[0]);
};





