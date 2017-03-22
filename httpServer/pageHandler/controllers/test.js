const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const readline = require("readline");

var test = function(){

	var nvgJsonFile = fs.readFileSync(path.join(__dirname,"..",'views','navigation.json'),'utf-8');
    var nvgJson = JSON.parse(nvgJsonFile);
    var nvgHtml = "";
    var jsRegist = "";
    var jsState = "";
    var htmlDoc = "";

    for(var i = 0; i< nvgJson.length;i++){
        for(var navigator in nvgJson[i]){
        	nvgHtml += "<h5><a href='#'>"+navigator+"</a></h5>";
        	nvgHtml += "<div>"
        	for(var element in nvgJson[i][navigator]){
        		nvgHtml += 
        		"<a id=\""+nvgJson[i][navigator][element]["id"]
        		+"\" href=\""+nvgJson[i][navigator][element]["href"]
        		+"\">"+nvgJson[i][navigator][element]["name"]
        		+" </a> <br />";
        		jsState += fs.readFileSync(path.join(__dirname,"..",'views',nvgJson[i][navigator][element]["jsState"]),'utf-8');
        		jsRegist += fs.readFileSync(path.join(__dirname,"..",'views',nvgJson[i][navigator][element]["jsRegist"]),'utf-8');
        		htmlDoc += fs.readFileSync(path.join(__dirname,"..",'views',nvgJson[i][navigator][element]["htmlDoc"]),'utf-8');	
        	}
        	nvgHtml += "</div>"
        }
    }

    var js_templates = fs.readFileSync(path.join(__dirname,"..",'views','main1.js'),'utf-8');
    var js_content = ejs.render(js_templates,{"jsState":jsState,"jsRegist":jsRegist});
    
    var html_templates = fs.readFileSync(path.join(__dirname,"..",'views','main1.html'),'utf-8');
    var html_content = ejs.render(html_templates,{panel:htmlDoc,navigation:nvgHtml});


    var layout = fs.readFileSync(path.join(__dirname,'..','views','layout.html'),'utf-8');
	var output = ejs.render(layout,{script:js_content,body:html_content});

    
	var tmpJs = fs.createWriteStream("tmp.js");
	tmpJs.write(output);
	
}

// <h5><a href='#'>帐号管理</a></h5>
// <div>
// <a id="svr_rtmfp" href="#">用户券商管理 </a> <br />
// </div>
// <h5><a href='#'>历史数据</a></h5>
// <div>
// <a href='#' id='historydata_onlineuser_here'> 在线用户</a> <br />
// <a href='#' id='historydata_pl_here'> 卡顿率</a><br />
// </div>

test();