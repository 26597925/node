const path = require('path');
var log4js = require('log4js');

var Config = function Config()
{
	this.log4jConfig ={
        appenders: [
            {
                type: "console",
                category: "console",
            }
            ,{
                category: 'main',
                type: 'file',
                filename:path.join(__dirname,'logs','main.log'),
                maxLogSize:80*1024*1024, 
                backups:10
            }
            ,{
                category: 'es',
                type: 'file',
                filename:path.join(__dirname,'logs','es.log'),
                maxLogSize:80*1024*1024, 
                backups:10
            }
            ,{
                category: 'httprequest',
                type: 'file',
                filename: path.join(__dirname,'logs','httprequest.log'),
                maxLogSize:80*1024*1024, 
                backups:10
            }
            ,{
                category: 'email',
                type: 'file',
                filename: path.join(__dirname,'logs','email.log'),
                maxLogSize:80*1024*1024, 
                backups:10
            }
            ,{
                category: 'phantom',
                type: 'file',
                filename: path.join(__dirname,'logs','phantom.log'),
                maxLogSize:80*1024*1024, 
                backups:10
            }
            ,{
                category: 'webserver',
                type: 'file',
                filename: path.join(__dirname,'logs','webserver.log'),
                maxLogSize:80*1024*1024, 
                backups:10
            }
        ],
        "replaceConsole":true,
        levels:{
            "console":"ALL"
            // ,"master":"INFO"
            // ,"worker":"INFO"
            // ,"redis":"INFO"
            // ,"web":"INFO"
        }
    };

    log4js.configure(this.log4jConfig);
    this.main = log4js.getLogger("main");
    this.httprequest = log4js.getLogger("httprequest");
    this.es = log4js.getLogger("es");
    this.console = log4js.getLogger("console");

    
    this.test = function(){
        // console.log(">>>"+__dirname);
    	// log4js.configure(this.log4jConfig);
        
       
    	var logger = log4js.getLogger("es");
    	logger.info("info");
    	logger.warn("warn");
    	logger.error("error");

    	var logger = log4js.getLogger("httprequest");
    	logger.info("info");
    	logger.warn("warn");
    	logger.error("error");

        var logger = log4js.getLogger("email");
        logger.info("info");
        logger.warn("warn");
        logger.error("error");

        var logger = log4js.getLogger("phantom");
        logger.info("info");
        logger.warn("warn");
        logger.error("error");

    	var logger = log4js.getLogger("console");
    	logger.info("info");
    	logger.warn("warn");
    	logger.error("error");
    }
    // this.test();
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