const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

exports.index = function(){
    this.render(['login.html','login.js'], {message:''});
};

exports.logup =function(){
    this.render(['login_up.html','login_up.js'], {message:''});
};

exports.findpassword =function(){
    this.render(['findPwd.html','findPwd.js'], {message:''});
};

MyConvertDateToSqlTs = function(d) {
    var val_tsDate = (d.getFullYear()).toString() + '-' + (d.getMonth() + 1).toString() + '-' + (d.getDate()).toString();
    var val_tsDateTime = val_tsDate + ' ' + d.toLocaleTimeString();
    return val_tsDateTime;
};

var renderPage = function(){

    var nvgJsonFile = fs.readFileSync(path.join(__dirname,"..",'views','navigation.json'),'utf-8');
    var nvgJson = JSON.parse(nvgJsonFile);
    // <h5><a href='#'>帐号管理</a></h5>
    // <div>
    // <a id="svr_rtmfp" href="#">用户券商管理 </a> <br />
    // </div>
    // <h5><a href='#'>历史数据</a></h5>
    // <div>
    // <a href='#' id='historydata_onlineuser_here'> 在线用户</a> <br />
    // <a href='#' id='historydata_pl_here'> 卡顿率</a><br />
    // </div>
    var nvgHtml = "";
    var nvgClick = "";
    var jsRegist = "";
    var jsState = "";
    var htmlDoc = "";
    var firstPage = "";
    //var hideAllPanel = function ()
    // {
    //     $("#historydata").hide();
    //}
    var hideAllPanel = "var hideAllPanel = function (){\n";
    
    for(var i = 0; i< nvgJson.length;i++){
        for(var navigator in nvgJson[i]){
            nvgHtml += "<h5><a href='#'>"+navigator+"</a></h5>";
            nvgHtml += "<div>";
            for(var element=0; element < nvgJson[i][navigator].length; element++){
                nvgHtml += 
                "<a id=\""+nvgJson[i][navigator][element]["id"]
                +"\" href=\""+nvgJson[i][navigator][element]["href"]
                +"\">"+nvgJson[i][navigator][element]["name"]
                +" </a> <br />";

                nvgClick += '  $("#'+nvgJson[i][navigator][element]["id"]+'").click(function(){\n'
                    +'      hideAllPanel();\n'
                    +'      $("#'+nvgJson[i][navigator][element]["id"]+'_panel").show();\n'
                    +'    });\n';
                // if(i==0&&element==0){
                // if(i==0&&element==1){
                if(i==2 && element==0){
                // if(i==2 && element==1){
                    // console.log(">>>>>>",nvgJson[i][navigator][element]["id"])
                    firstPage = '   $("#'+nvgJson[i][navigator][element]["id"]+'_panel").show();\n'
                }
    
                if(String(nvgJson[i][navigator][element]["jsState"]).length>1){
                    jsState += fs.readFileSync(path.join(__dirname,"..",'views',nvgJson[i][navigator][element]["jsState"]),'utf-8');
                }
                // jsRegist += fs.readFileSync(path.join(__dirname,"..",'views',nvgJson[i][navigator][element]["jsRegist"]),'utf-8');

                hideAllPanel += '   $("#'+(nvgJson[i][navigator][element]["id"]+"_panel")+'").hide();\n';

                htmlDoc += '<div id="'+(nvgJson[i][navigator][element]["id"]+"_panel")+'" class="content">';
                if(String(nvgJson[i][navigator][element]["htmlDoc"]).length>1){
                    htmlDoc += fs.readFileSync(path.join(__dirname,"..",'views',nvgJson[i][navigator][element]["htmlDoc"]),'utf-8');
                }
                htmlDoc += '</div>';

                jsState += "\n";
                htmlDoc += "\n";
            }
            nvgHtml += "</div>"
        }
    }

    hideAllPanel += '}\n';
    jsState += hideAllPanel+"\n";
    jsRegist += nvgClick+"\n";
    jsRegist += firstPage+"\n";

    var js_templates = fs.readFileSync(path.join(__dirname,"..",'views','main.js'),'utf-8');
    var js_content = ejs.render(js_templates,{"jsState":jsState,"jsRegist":jsRegist});
    // var js_content = ejs.render(js_templates,{"jsState":jsState});
    
    var html_templates = fs.readFileSync(path.join(__dirname,"..",'views','main.html'),'utf-8');
    var html_content = ejs.render(html_templates,{panel:htmlDoc,navigation:nvgHtml});

    
    var layout = fs.readFileSync(path.join(__dirname,'..','views','layout.html'),'utf-8');
    var output = ejs.render(layout,{script:js_content,body:html_content});
    return output;
};

exports.main = function(){
    var self = this;
    self.responseDirect(200,"text/html",renderPage());
};

var renderCommonPage = function(file_js,file_html,common_js){
    var js_state = fs.readFileSync(path.join(__dirname,"..",'views',file_js),'utf-8');
    var file_html = fs.readFileSync(path.join(__dirname,"..",'views',file_html),'utf-8');
    var common_js = fs.readFileSync(path.join(__dirname,"..",'views',common_js),'utf-8');

    var js_content = ejs.render(common_js,{"jsState":js_state});
    var layout = fs.readFileSync(path.join(__dirname,'..','views','layout.html'),'utf-8');
    var output = ejs.render(layout,{script:js_content,body:file_html});
    return output;
};


exports.detailOrder = function(){
    // console.log("detailOrder");
    var self = this;
    self.responseDirect( 200,"text/html",renderCommonPage("detailOrder.js","detailOrder.html","common.js") );
};

exports.detailStock = function(){
    // console.log("detailStock");
    var self = this;
    self.responseDirect( 200,"text/html",renderCommonPage("detailStock.js","detailStock.html","common.js") );
};

