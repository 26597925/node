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
}

var add_newUser = function(context){
    var self = context;
    var result = {'success':true,'message':'登录成功'};
    if(self.req.post){
        if( self.req.post["UENAME"]
            &&self.req.post["UCNAME"]
            &&self.req.post["PHONENUMBER"]
            &&self.req.post["PASSWORD"]
            &&self.req.post["ADDRESS"]
            &&self.req.post["ZIPCODE"]
            // &&this.req.post.hasOwnProperty("")
            ){

            //INSERT INTO `tb_user_basic` (`USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `ONLINE`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES ('0', '0', 'test3', '测试3', '15801278254', '111111', 'zvxvc', 'qweqwe', '0', '0', NULL, '0', CURRENT_TIMESTAMP, '0000-00-00 00:00:00.000000', 'sdasdsda');
            
            var sql = "INSERT INTO `tb_user_basic` "
            +"( `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`,`MODTIME`)"
            +" VALUES ( '"+self.req.post["UENAME"]+"', '"
                +self.req.post["UCNAME"]+"', '"
                +self.req.post["PHONENUMBER"]+"', '"
                +self.req.post["PASSWORD"]+"', '"
                +self.req.post["ADDRESS"]+"', '"
                +self.req.post["ZIPCODE"]+"', '"
                +unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")+"')";
            db.query(sql,function(){
                console.log("insert",JSON.stringify(arguments));
                if(arguments.length==1){
                    var sql2 = "select USERID from tb_user_basic where `PHONENUMBER` = '"+self.req.post["PHONENUMBER"]+"' and `PASSWORD` = '"+self.req.post["PASSWORD"]+"'";
                    db.query(sql2,function(){
                        if(arguments.length==1){
                            debugger
                            updateUserLoginTime(arguments["USERID"],self,"USERID");
                         }else{
                            result = {'success':false,'message':'数据存在问题，请联系管理员'};
                            self.responseDirect(200,"text/json",JSON.stringify(result));
                        }
                    });
                }else{
                    result = {'success':false,'message':'数据存在问题，请联系管理员'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }
            })
        }else{
            result = {'success':false,'message':'数据非法1'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    }
}

exports.logup_submit = function(){
    var self = this;
    var result = {'success':true,'message':'登录成功'};
    if(self.req.post){
        var sql = "SELECT `USERID`, `GROUPID`, `UENAME`, `PASSWORD`  FROM `tb_user_basic` where `UENAME`='"+this.req.post["UENAME"]+"' and `PASSWORD`='"+this.req.post["PASSWORD"]+"'";
        db.query(sql,function(){
            
            if(arguments.length==0){
                add_newUser(self);
            }else if(arguments.length==1){
                result = {'success':false,'message':'该用户名已经注册过'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }else{
                result = {'success':false,'message':'数据查询有问题，请联系管理员'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
        })
        
    }else{
        result = {'success':false,'message':'数据非法0'};
        self.responseDirect(200,"text/json",JSON.stringify(result));
    }
}

MyConvertDateToSqlTs = function(d) {
    var val_tsDate = (d.getFullYear()).toString() + '-' + (d.getMonth() + 1).toString() + '-' + (d.getDate()).toString();
    var val_tsDateTime = val_tsDate + ' ' + d.toLocaleTimeString();
    return val_tsDateTime;
};

exports.exit = function(){
    var self = this;
    var sess = sessions.validate(self.req);
    if(sess){
        sess.destory();
    }
    self.responseDirect(200,'text/json','');
};

exports.login = function(args){
    
	var self = this;
    var usr = args["usr"] || null;
    var psw = args["psw"] || null;
    // SELECT `USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, 
    //`PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `MODTIME`, 
    //`ONLINE`, `ADDTIME`, `MODTIME`, `REMARK` FROM `tb_user_basic`
    
    if(usr && psw){
        var sql = "SELECT `USERID`, `GROUPID`, `UENAME`, `PASSWORD`  FROM `tb_user_basic` where `UENAME`='"+usr+"' and `PASSWORD`='"+psw+"'";
        var result = {'success':true,'message':'登录成功'};
        db.query(sql,function(){
            if( arguments.length==1 ){
                updateUserLoginTime(arguments[0][0]['USERID'],self);
            }else{
                result = {'success':false,'message':'用户名或密码错误，请重新登录'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
        });

	}else{
		self.handler404(self.req,self.res);
	}
};

var updateUserLoginTime = function(USERID,context){
    console.log(path.basename(__filename),'updateUserLoginTime',arguments.length);
    var self = null;
    if(context){self = context;}
    var req = self.req;
    var res = self.res;
    var SID = sessions.createSID();
    sessions.setCookie(req,res,SID,USERID);
    var sql2 = "UPDATE `tb_user_basic` SET `LASTLOGIN` = '"+SID+"' WHERE `tb_user_basic`.`USERID` = "+USERID+" ";

    var result = {'success':true,'message':'登录成功'};
    db.query(sql2,function(){
        console.log("updateUserLoginTime",arguments);
        if(arguments.length==1){
            self.responseDirect(200,'text/json',JSON.stringify(result));
        }else{
            result = {'success':false,'message':'用户已经过期，请重新登录'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    });

};

exports.updateLoginTime = function(USERID){
    updateUserLoginTime(USERID,this);
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
    //get authority
    //parse and set user browing context
    // var sess = sessions.validate(this.req);
    self.responseDirect(200,"text/html",renderPage());
};
