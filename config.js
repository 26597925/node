var log4js = require('log4js');
var Config = function Config()
{
	this.log4jConfig ={
        appenders: [
            {
                type: "console",
                category: "console",
            },
            {
                category: 'master',
                type: 'file',
                filename: 'collector_master.log',
                maxLogSize:80*1024*1024, 
                backups:10
            }
        ],
        "replaceConsole":true,
        levels:{
            "console":"ALL",
            "master":"INFO",
            "worker":"INFO",
            "redis":"INFO",
            "web":"INFO"
        }
    };
    this.test=function(){
    	log4js.configure(this.log4jConfig);
    	var logger = log4js.getLogger("master");
    	logger.info("info");
    	logger.warn("warn");
    	logger.error("error");
    }
}
module.exports = new Config();
//test-----------------------------------------------
//var log4js = require('log4js');
//var config = require("./config.js");
//log4js.configure(config.log4jConfig);
//var logger = log4js.getLogger("master");
//logger.info("info");
// logger.warn("warn");
// logger.error("error");