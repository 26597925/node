p2p$.ns('com.enter');
p2p$.com.enter.H5P2P=JClass.extend_({
onprepared : null,
onbufferstart : null,
onbufferend : null,
oncomplete : null,
onerror : null,

player_:null,
url_:"/commonfrag/new_h5p2p_player.inc",//配置文件地址
params_:{},//selector播放参数
tag_:"com::enter::H5P2P",
gTime_:-1,
loadSelectorTime_:-1,
global_:null,

init:function()
{
//初始化参数
if(arguments.length>0&&typeof(arguments[0])=="object")
{
p2p$.apply(this.params_,arguments[0]);
}
//提取参数
var logLevel = this.params_.hasOwnProperty("logLevel") ? this.params_["logLevel"] : 0;
var logType = this.params_.hasOwnProperty("logType") ? this.params_["logType"] : 3;
var logServer = "http://" + (this.params_["logServer"] || "10.58.132.159:8000");
var uploadLog = this.params_.hasOwnProperty("uploadLog") ? this.params_["uploadLog"] : null;
this.url_ = this.params_.hasOwnProperty("config") ? this.params_["config"] : this.url_;
//从调度地址从新获取参数
var url = new p2p$.com.common.Url();
url.fromString_(this.params_["playUrl"]);
logLevel = url.getParams().get("logLevel") ? url.getParams().get("logLevel") : logLevel;
logType = url.getParams().get("logType") ? url.getParams().get("logType") : logType;
logServer = url.getParams().get("logServer") ? url.getParams().get("logServer") : logServer;
uploadLog = url.getParams().get("uploadLog") ? url.getParams().get("uploadLog") : uploadLog;
this.url_ = url.getParams().get("config") ? url.getParams().get("config") : this.url_;
p2p$.com.common.Log.init(logLevel, logType, uploadLog == "1" ? logServer : null);
this.global_ = p2p$.com.common.Global;
this.gTime_ = this.global_.getMilliTime_();
this.loadConfig_();
},
//加载配置文件
loadConfig_:function()
{
if(this.url_.indexOf("http://")!=0)
{
var url = new p2p$.com.common.Url();
url.fromString_(document.location.href);
if(this.url_.indexOf("/")==0)
{
this.url_ = "http://"+url.host_+":"+(url.port_!=""?url.port_:"")+this.url_;
}
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::loadConfig_ 加载配置文件...url({1})",this.tag_,this.url_));
var loader = new p2p$.com.loaders.HttpDownLoader({"url_":this.url_,"scope_":this,"tag_":"h5::config"});
loader.load_();
},
//加载console处理模块
loadTool_:function()
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::loadTool_ 加载console模块...",this.tag_));
var loader = new p2p$.com.loaders.HttpDownLoader({"url_":this.url_,"scope_":this,"tag_":"h5::tool"});
loader.load_();
},
//解析配置文件
onHttpDownloadCompleted_:function(downloader)
{
var tag_=downloader.tag_;
if(!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onHttpDownloadCompleted_ {1}数据加载失败！",this.tag_,tag_));
return false;
}
switch(tag_)
{
case "h5::config":
var str_=downloader.responseData_;
var reg_=/src=\"(\w.*\.\w.*)\"/;
var temp_=str_.match(reg_);
if(temp_!=null&&temp_.length>1)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onHttpDownloadCompleted_ 分析配置文件，提取地址:{1}",this.tag_,temp_[1]));
this.loadSelector_(temp_[1]);
}
break;
case "h5::tool":

default:
break;
}
},
//加载选择器
loadSelector_: function(){
if(arguments.length==0||arguments[0]==null)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::loadSelector_ 播放器判断选择器不存在！",this.tag_));
return;
}
var url_=arguments[0];
var isJs = /(\.js)$/.exec(url_);
if(!isJs)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::loadSelector_ 不是合法的选择器文件！",this.tag_));
return;
}
var me = this;
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = script.onreadystatechange = function () {
me.player_ = new p2p$.com.selector.Selector(me.params_);
me.loadSelectorTime_ = me.global_.getMilliTime_()-me.gTime_;
//增加事件
};
script.src = encodeURI(url_);
document.getElementsByTagName('head')[0].appendChild(script);
},
openUrl_:function(url)
{
if(!this.player_)
{
this.loadConfig_();
return;
}
this.player_.openUrl_(url);
}
});
