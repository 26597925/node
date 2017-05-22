const WebSocket = require('ws');
const http = require('http');
const url = require("url");
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');
const querystring = require("querystring");
const captchapng = require('captchapng');

const bean = require(path.join(__dirname,'..','bean','bean_entity'));

const web_DB_config = require(path.join(__dirname,"web_DB.js"));
const pgconfig = require(path.join(__dirname,'pageHandler','models','PageConfig'));
const route = require(path.join(__dirname,'pageHandler','models','Route'));
const wsconfig = require(path.join(__dirname,'pageHandler','models','WSSConfig'));
const wssRoute = require(path.join(__dirname,'pageHandler','models','WSSRoute'));



var self = this;
self.wss = null;

this.broadcast = function (data) {

	if(data && data.hasOwnProperty('type') && data.hasOwnProperty('action')){
        if(self.wss){
            self.wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify(data));
                }
            });
        }
	}
};

exports.runPageServer = function( port )
{
	port = port || 80;
    // port = port || 20080;
	console.log('Collector Server 127.0.0.1:'+ port );
	var server = http.createServer(function(req, res){
		if(req.url == '/upload' && req.method.toLowerCase() == 'post'){

            var controller = require(path.join(__dirname,'pageHandler','controllers','upload.js'));
            var ct = new controllerContext(req, res);
            controller['upload'].apply(ct);

		}else if(req.url == '/checkImg' && req.method.toLowerCase() == 'get'){
			var random = parseInt(9*Math.random()+1)*10000+parseInt(10000*Math.random());
            var p = new captchapng(80,30,random); // width,height,numeric captcha
            p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
            p.color(0, 0, 80, 255); // Second color: paint (red, green, blue, alpha)

            var img = p.getBase64();
            var imgbase64 = new Buffer(img,'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.end(imgbase64);
			console.log("需要把验证吗存储在数据库中");
            // var controller = require(path.join(__dirname,'pageHandler','controllers','upload.js'));
            // var ct = new controllerContext(req, res);
            // controller['upload'].apply(ct);

        }else
        {
            // console.log(path.basename(__filename),"url:", req.url);
            var _bufData = '';
            req.on('data', function (chunkData) {
                _bufData += chunkData;
            })
			.on('end', function () {
				var reqData = "";
				//console.log(JSON.stringify(req.headers));
				if ("POST" == req.method.toUpperCase()) {
					if ( (req.headers.hasOwnProperty('content-type') && req.headers['content-type'].indexOf('application/json') != -1)
						|| req.headers.accept.indexOf('application/json') != -1) {

						if (_bufData.length > 0) {
							try {

                                _bufData = _bufData.replace(/\\n/g,"");
                                _bufData = _bufData.replace(/\\/g, "");
								reqData = JSON.parse(_bufData);

							} catch (err) {
								console.log("not json format",err);
							}
						} else {
							reqData = {};
						}
					} else {
						reqData = querystring.parse(_bufData.toString());
					}
				}
				req.post = reqData;
				handlerRequest(req, res);
			});
        }
	}).listen(port);

    self.wss = new WebSocket.Server({ server });
    self.wss.on('connection', function (ws) {
        handlerWss(ws);
    });
};

var handlerWss = function(ws){
    // ws.onopen = open;
    // ws.onmessage = message;
    // ws.onclose = close;

    ws.on('open',function(){
        console.log('open');
    });

    ws.on('message',function(data){
    	try{
			var clientData = JSON.parse(data);
			console.log('type',clientData.type);
            // ws.mz_type = clientData.type;
            // ws.mz_aciton = clientData.action;
			var actionInfo_ws = wssRoute.getActionInfo(clientData.type);

			if(actionInfo_ws){
				var controller_ws = require(path.join(__dirname,'pageHandler','ws',actionInfo_ws.controller));
				if(controller_ws[actionInfo_ws.action]){
					var ws_ct = new ws_context(ws,clientData);
					controller_ws[actionInfo_ws.action].apply(ws_ct);
				}
			}
        }catch(err){console.log('error',err.message)}
    });

    ws.on('close',function(){
        console.log('close root');
    });
};

var handlerRequest = function(req, res){
  	var actionInfo = route.getActionInfo(req.url, req.method);
    if(actionInfo.action){
        var controller = require(path.join(__dirname,'pageHandler','controllers',actionInfo.controller));
        if(controller[actionInfo.action]){
            var ct = new controllerContext(req, res);
            controller[actionInfo.action].apply(ct, actionInfo.args);
        }else{
            handler500(req, res, 'Error: controller "' + actionInfo.controller + '" without action "' + actionInfo.action + '"')
        }
    }else{
      staticFileServer (req, res);
    }
};

var stocks = {'date':new Date(),'data':null};
var count = 0;
var cumulation = function(){
	if(count>=10000){
		count = 0;
	}
	return count++;
};

var setStocks = function(data){
    stocks.date = new Date();
    stocks.data = data;
    if(process.hasOwnProperty('send')){
        var sendDate = new bean.stock();
        sendDate.type = bean.STOCKCODE;
        sendDate.data = data;
        process.send( sendDate );
    }
};

var getStocks = function(data){
    return stocks
};

var getStock_market = function(id){
    var sendDate = new bean.stock();
    sendDate.type = bean.STOCKDATA;
    sendDate.data = data;
	process.send(sendDate);
};

var ws_context = function(ws,data){
    this.alias = "root";
    this.root = self;
    this.ws = ws;
    this.data = data;
};


var controllerContext = function(req, res){
	this.alias = "root";
    this.req = req;
    this.res = res;
    this.root = self;
    this.setStocks = setStocks;
    this.getStocks = getStocks;
	this.cumulation = cumulation;
    this.handler404 = handler404;
    this.handler500 = handler500;
};


controllerContext.prototype.render = function(viewName, context){
    viewEngine.render(this.req, this.res, viewName, context);
};



controllerContext.prototype.renderJson = function(json){
    viewEngine.renderJson(this.req, this.res, json);
};


controllerContext.prototype.responseDirect = function(status,content_type,data){
    viewEngine.responseDirect(this.req,this.res,status,content_type,data);
};


var viewEngine = {
	render:function(req,res,viewNames,ctx){
		
		var hfile = path.join(__dirname,'pageHandler','views',viewNames[0]);
		var templates = fs.readFileSync(hfile,'utf-8');
		var jsfile = viewNames.length > 1 ? path.join(__dirname,'pageHandler','views',viewNames[1]) : null;
		var js = jsfile != null ? fs.readFileSync(jsfile,'utf-8') : '';
	
	// Use ejs render views
		try{
			var content = ejs.render(templates,ctx);
			var layout = fs.readFileSync(path.join(__dirname,'pageHandler','views','layout.html'),'utf-8');
	    	var output = ejs.render(layout,{script:js,body:content});
	    	res.writeHead(200,{'Content-type' : 'text/html'});
			res.end(output);
	  	}catch(err){
	      	handler500(req, res, err);
	      	return;
 	 	}
	},
	renderLayout:function(req,res,content_type,data){
		var layout = fs.readFileSync(path.join(__dirname,'pageHandler','views','layout.html'),'utf-8');
	    var output = ejs.render(layout,data);
  		res.writeHead(200,{'Content-type' : 'text/html'});
  		res.end(output);
	},
	responseDirect:function(req,res,status,content_type,data){
  		res.writeHead(status,{'content-type':content_type});
  		res.end(data);
	}

};

var handler404 = function(req, res){

	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('Page Not Found');
};

var handler500 = function(req, res, err){
  res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end(err);
};

/**
 * Static files handler.
 */
var staticFileServer = function(req, res, filePath){
	if(!filePath){
	filePath = path.join(__dirname,"staticFile", url.parse(req.url).pathname);
  }

  fs.exists(filePath, function(exists) {
    if(!exists) {  
        handler404(req, res);  
        return;  
    }  

    fs.readFile(filePath, "binary", function(err, file) {  
      	if(err) {  
          	handler500(req, res, err);
          	return;  
      	}
      
      	var ext = path.extname(filePath);
      	ext = ext ? ext.slice(1) : 'html';
      	res.writeHead(200, {'Content-Type': contentTypes[ext] || 'text/html'});
      	res.write(file, "binary");
      	res.end();
    });  
  });
};


var s_runPage = this.runPageServer(  );
//load stock

require(path.join(__dirname,'pageHandler','controllers','proxy')).stock_load(function(data){
    setStocks(data);
});


// process.argv.forEach((val, index) => {
//     console.log(`${index}: ${val}`);
// });

process.on("message",function(msg){
    switch( msg.type ){
        case bean.STOCKDATA:
            var sendDate = new bean.entity_wss();
            sendDate.type = bean.STOCKDOWN;
            //self.broadcast()
        	break;
    }

});





/**
 * All content types.
 */
var contentTypes = {
    "aiff": "audio/x-aiff",
    "arj": "application/x-arj-compressed",
    "asf": "video/x-ms-asf",
    "asx": "video/x-ms-asx",
    "au": "audio/ulaw",
    "avi": "video/x-msvideo",
    "bcpio": "application/x-bcpio",
    "ccad": "application/clariscad",
    "cod": "application/vnd.rim.cod",
    "com": "application/x-msdos-program",
    "cpio": "application/x-cpio",
    "cpt": "application/mac-compactpro",
    "csh": "application/x-csh",
    "css": "text/css",
    "deb": "application/x-debian-package",
    "dl": "video/dl",
    "doc": "application/msword",
    "drw": "application/drafting",
    "dvi": "application/x-dvi",
    "dwg": "application/acad",
    "dxf": "application/dxf",
    "dxr": "application/x-director",
    "etx": "text/x-setext",
    "ez": "application/andrew-inset",
    "fli": "video/x-fli",
    "flv": "video/x-flv",
    "gif": "image/gif",
    "gl": "video/gl",
    "gtar": "application/x-gtar",
    "gz": "application/x-gzip",
    "hdf": "application/x-hdf",
    "hqx": "application/mac-binhex40",
    "html": "text/html",
    "ice": "x-conference/x-cooltalk",
    "ief": "image/ief",
    "igs": "model/iges",
    "ips": "application/x-ipscript",
    "ipx": "application/x-ipix",
    "jad": "text/vnd.sun.j2me.app-descriptor",
    "jar": "application/java-archive",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "latex": "application/x-latex",
    "lsp": "application/x-lisp",
    "lzh": "application/octet-stream",
    "m": "text/plain",
    "m3u": "audio/x-mpegurl",
    "man": "application/x-troff-man",
    "me": "application/x-troff-me",
    "midi": "audio/midi",
    "mif": "application/x-mif",
    "mime": "www/mime",
    "movie": "video/x-sgi-movie",
    "mp4": "video/mp4",
    "mpg": "video/mpeg",
    "mpga": "audio/mpeg",
    "ms": "application/x-troff-ms",
    "nc": "application/x-netcdf",
    "oda": "application/oda",
    "ogm": "application/ogg",
    "pbm": "image/x-portable-bitmap",
    "pdf": "application/pdf",
    "pgm": "image/x-portable-graymap",
    "pgn": "application/x-chess-pgn",
    "pgp": "application/pgp",
    "pm": "application/x-perl",
    "png": "image/png",
    "pnm": "image/x-portable-anymap",
    "ppm": "image/x-portable-pixmap",
    "ppz": "application/vnd.ms-powerpoint",
    "pre": "application/x-freelance",
    "prt": "application/pro_eng",
    "ps": "application/postscript",
    "qt": "video/quicktime",
    "ra": "audio/x-realaudio",
    "rar": "application/x-rar-compressed",
    "ras": "image/x-cmu-raster",
    "rgb": "image/x-rgb",
    "rm": "audio/x-pn-realaudio",
    "rpm": "audio/x-pn-realaudio-plugin",
    "rtf": "text/rtf",
    "rtx": "text/richtext",
    "scm": "application/x-lotusscreencam",
    "set": "application/set",
    "sgml": "text/sgml",
    "sh": "application/x-sh",
    "shar": "application/x-shar",
    "silo": "model/mesh",
    "sit": "application/x-stuffit",
    "skt": "application/x-koan",
    "smil": "application/smil",
    "snd": "audio/basic",
    "sol": "application/solids",
    "spl": "application/x-futuresplash",
    "src": "application/x-wais-source",
    "stl": "application/SLA",
    "stp": "application/STEP",
    "sv4cpio": "application/x-sv4cpio",
    "sv4crc": "application/x-sv4crc",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tar": "application/x-tar",
    "tcl": "application/x-tcl",
    "tex": "application/x-tex",
    "texinfo": "application/x-texinfo",
    "tgz": "application/x-tar-gz",
    "tiff": "image/tiff",
    "tr": "application/x-troff",
    "tsi": "audio/TSP-audio",
    "tsp": "application/dsptype",
    "tsv": "text/tab-separated-values",
    "txt": "text/plain",
    "unv": "application/i-deas",
    "ustar": "application/x-ustar",
    "vcd": "application/x-cdlink",
    "vda": "application/vda",
    "vivo": "video/vnd.vivo",
    "vrm": "x-world/x-vrml",
    "wav": "audio/x-wav",
    "wax": "audio/x-ms-wax",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "wmx": "video/x-ms-wmx",
    "wrl": "model/vrml",
    "wvx": "video/x-ms-wvx",
    "xbm": "image/x-xbitmap",
    "xlw": "application/vnd.ms-excel",
    "xml": "text/xml",
    "xpm": "image/x-xpixmap",
    "xwd": "image/x-xwindowdump",
    "xyz": "chemical/x-pdb",
    "zip": "application/zip"
};