p2p$.ns('com.tools.collector');
p2p$.com.tools.collector.ClientBase = JClass.extend_({
scope_:null,
strings_:null,
global_:null,
module_:null,
tag_:"com::tools::collector::ClientBase",
init:function()
{
this.strings_ = p2p$.com.common.String;
this.global_ = p2p$.com.common.Global;
this.module_ = p2p$.com.selector.Module;
},
tidy:function(){
},
});
p2p$.ns('com.tools.collector');
p2p$.com.tools.collector.ClientParams = p2p$.com.tools.collector.ClientBase.extend_({
params_:null,
reportParams_:null,
init : function(wrapper) {
this._super();
this.scope_=wrapper;
this.reportParams_={};
this.params_ = {};
this.tag_="com::tools::collector::ClientBase";
/*4*/
this.params_["act"] = "pf,cde,pl,s";
this.params_["p1"] = "cde,pl,time,err";
this.params_["p2"] = "cde,pl,time,err";
this.params_["platid"] = "cde,pl,time,err";
this.params_["splatid"] = "cde,pl,time,err";
this.params_["ch"] = "cde,pl,time,s,err";
this.params_["custid"] = "cde,pl,time,s,err";
this.params_["uid"] = "cde,pl,time,s,err";
this.params_["ilu"] = "cde/gslb";
this.params_["lc"] = "cde,pl,time,s,err";
/*14*/
this.params_["token"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["time"] = "pf,cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,s,err";
this.params_["did"] = "pf,cde";
this.params_["mac"] = "pf,cde";
this.params_["appid"] = "pf,cde,pl,time,err";
this.params_["nt"] = "pf,cde,pl,s,err";
this.params_["geo"] = "cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,cde/upnp,pl,time,s,err";
this.params_["iipl"] = "cde/upnp";
this.params_["dso"] = "";
this.params_["dam"] = "";
/*24*/
this.params_["dco"] = "";
this.params_["aco"] = "";
this.params_["dmo"] = "";
this.params_["amo"] = "time";
this.params_["dap"] = "";
this.params_["dsb"] = "";
this.params_["dv"] = "time";
this.params_["dt"] = "pf";
this.params_["des"] = "pf/init";
this.params_["dis"] = "pf/init";
/*34*/
this.params_["dms"] = "pf/init";
this.params_["dosv"] = "pf/init";
this.params_["dsr"] = "pf/init";
this.params_["ddpi"] = "pf/init";
this.params_["dct"] = "pf/init";
this.params_["dcr"] = "pf/init";
this.params_["dccn"] = "pf/init";
this.params_["prel"] = "cde/init,pl/init";
this.params_["gid"] = "cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["cid"] = "time,err";
/*44*/
this.params_["pid"] = "time,err";
this.params_["vid"] = "time,err";
this.params_["lid"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["sid"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["st"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["zid"] = "time";
this.params_["type"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["vt"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["pay"] = "time";
this.params_["dur"] = "cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl/play,pl/block,pl/seek,pl/tg,pl/end,time,err";
/*54*/
this.params_["vf"] = "time";
this.params_["cmfv"] = "pf,cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,err";
this.params_["plv"] = "pf,cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["cdev"] = "pf,cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,err";
this.params_["cdeport"] = "cde/init";
this.params_["lsbv"] = "pf,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,err";
this.params_["cmfid"] = "pf,time";
this.params_["cdeid"] = "pl,err";
this.params_["uuid"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
this.params_["starttime"] = "time";
/*64*/
this.params_["plid"] = "pl/init";
this.params_["ccid"] = "cde/init,time";
this.params_["err"] = "cde,pl,err";
this.params_["utime"] = "cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl/play,pl/block,pl/seek";
/*69*/
this.params_["pos"] = "pl/play,pl/block,pl/seek,pl/tg,pl/end,time,err";
this.params_["vdl"] = "pl";
this.params_["vds"] = "pl";
this.params_["r"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,s,err";
this.params_["adur"] = "pl/play,time";
this.params_["sn"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,s,err";
/*75*/
this.params_["pt"] = "time";
this.params_["vpt"] = "pl/play";
this.params_["vct"] = "pl/play";
this.params_["bcnt"] = "time";
this.params_["blen"] = "time";
this.params_["bpos"] = "time";
this.params_["pcnt"] = "time";
this.params_["plen"] = "time";
this.params_["ppos"] = "time";
this.params_["vacnt"] = "time";
/*85*/
this.params_["fscnt"] = "";
this.params_["size1"] = "";
this.params_["size2"] = "";
this.params_["det"] = "pl/play,err";
this.params_["vr"] = "pl/play";
this.params_["vc"] = "pl/play";
this.params_["ac"] = "pl/play";
this.params_["fps"] = "time";
this.params_["vfn"] = "cde/upnp";
this.params_["termid"] = "cde/init,cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,cde/pie,pl,time,err";
/*95*/
this.params_["p2p"] = "time,err";
this.params_["p-cde"] = "time";
this.params_["p-rtc"] = "time";
this.params_["p-rtmfp"] = "cde/upnp,time";
this.params_["qos"] = "cde/gslb,cde/chk,cde/cquery,cde/cload,cde/pie,pl,time,err";
this.params_["bul"] = "time";
this.params_["cabl"] = "time";
this.params_["srvver"] = "cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc";
this.params_["stage"] = "cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc";
this.params_["avgutime"] = "cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc";
/*105*/
this.params_["errcnt"] = "cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,time";
this.params_["httpinfo"] = "cde/gslb,cde/chk,cde/cquery,cde/cload,cde/sel,cde/rtm,cde/soc,cde/rtc,time";
this.params_["gip"] = "cde/soc";
this.params_["gport"] = "cde/soc";
this.params_["wrip"] = "cde/rtc";
this.params_["wrport"] = "cde/rtc";
this.params_["rip"] = "cde/rtm";
this.params_["rport"] = "cde/rtm";
this.params_["csize"] = "time";
this.params_["dsize"] = "time";
/*115*/
this.params_["tsize"] = "time";
this.params_["msize"] = "time";
this.params_["bsize"] = "time";
this.params_["dnode"] = "time";
this.params_["lnode"] = "time";
this.params_["up-rtmfp"] = "time";
this.params_["up-rtc"] = "time";
this.params_["up-cde"] = "time";
this.params_["dsize-rtc"] = "time";
this.params_["tsize-rtc"] = "time";
/*125*/
this.params_["msize-rtc"] = "time";
this.params_["bsize-rtc"] = "time";
this.params_["dsize-cde"] = "time";
this.params_["tsize-cde"] = "time";
this.params_["msize-cde"] = "time";
this.params_["bsize-cde"] = "time";
this.params_["lsize-cde"] = "time";
this.params_["lcsize"] = "time";
this.params_["lpsize"] = "time";
this.params_["dnode-rtc"] = "time";
/*135*/
this.params_["lnode-rtc"] = "time";
this.params_["dnode-cde"] = "time";
this.params_["lnode-cde"] = "time";
this.params_["chk0"] = "time";
this.params_["chk1"] = "time";
this.params_["chk2"] = "time";
this.params_["chk3"] = "time";
this.params_["chk4"] = "time";
this.params_["chk5"] = "time";
this.params_["errinfo"] = "s";
/*145*/
this.params_["ip"] = "";
this.params_["port"] = "";
this.params_["um"] = "pf/result,/pf/load";
this.params_["scmfv"] = "pf/upgrade,pf/result";
this.params_["scv"] = "pf/upgrade,pf/result";
this.params_["romv"] = "pf/upgrade,pf/result,pf/load";
this.params_["result"] = "pf/upgrade,pf/result,pf/load";
},
getReportParams_:function(value)
{
if(this.reportParams_[value]){
return this.reportParams_[value];
}
var type_ = value.split("/")[0];
var paramValue_="";
var params_=[];
for(var i in this.params_)
{
paramValue_ = this.params_[i].split(",");
for(var j=0; j<paramValue_.length;j++){
if(paramValue_[j]==type_||paramValue_[j]==value)
{
params_.push(i);
break;
}
}
}
this.reportParams_[value]=params_;
return params_;
},
//给参数赋值
getBaseParams_:function()
{
var env = this.scope_.getEnviroment_();
var context = this.scope_.getContext_();
var metaData = this.scope_.getMetaData_();
var player = this.scope_.getPlayer_();
//为参数赋值
var params={};
params["act"] = "";//播放框架动作类型
params["p1"] = context.addtionalParam1_;//一级业务线代码
params["p2"] = context.addtionalParam2_;//二级业务线代码
params["platid"] = context.platformId_;//平台ID
params["splatid"] = context.subPlatformId_;//子平台ID
params["ch"] = context.t3partyAppChannel_;//频道
params["custid"] = context.custid_;//云视频用户编号
params["uid"] = context.uid_;//乐视网的用户ID
params["ilu"] = 0;//是否为登录用户
params["lc"] = context.lc_;//乐视cookie
params["token"] = context.token_;//每次用户登录，调度服务器返回的标识，用于用户验证
params["time"] = this.global_.getMilliTime_();//上报时间
params["did"] = "";//设备id
params["mac"] = env.getLocalMacAddresses_();
params["appid"] = env.externalAppId_;
params["nt"] = env.networkType_;//上网类型
params["geo"] = context.geo_;
params["iipl"] = env.getBackupHostIps_();//内网IP地址
params["dso"] = "";//心跳上报时的设备屏幕方向
params["dam"] = "";//心跳上报时的设备可用内存大小，单位为KB
params["dco"] = "";//cpu占用率
params["aco"] = "";//应用CPu占用率
params["dmo"] = "";//心跳上报时的设备内存占用量
params["amo"] = "";//心跳上报时的设备应用内存占用量
params["dap"] = "";//心跳上报时的设备剩余电量
params["dsb"] = "";//心跳上报时的设备亮度
params["dv"] = "";//设备音量
params["dt"] = env.getDeviceType_();//设备品牌型号，字符串
params["des"] = "";//设备外部扩展存储容量
params["dis"] = "";//设备内置存储容量
params["dms"] = "";//设备内存容量
params["dosv"] = env.getOSType_();
params["dsr"] = "";//设备屏幕分辨率
params["ddpi"] = "";//设备每英寸的像素数
params["dct"] = "";//设备CPU型号
params["dcr"] = "";//cpu频率
params["dccn"] = "";//设备CPU核数
params["prel"] = "";//下载是否是预加载
params["gid"] = metaData.p2pGroupId_;
params["cid"] = context.cid_;
params["pid"] = context.pid_;
params["vid"] = context.vid_;
params["lid"] = "";
params["sid"] = context.streamId_;
params["st"] = "";//轮播台
params["zid"] = "";//专题ID
params["type"] = "";
params["vt"] = context.videoFormat_;
params["pay"] = context.pay_;
params["dur"] = metaData.totalDuration_;
params["vf"] = context.videoFormat_;
params["cmfv"] = env.moduleVersion_;
params["plv"] = context.moduleVersion_;
params["cdev"] = "";
params["cdeport"] = "";
params["lsbv"] = "";//播放框架内置的LinkShell模块的版本号
params["cmfid"] = "";//播放框架实例id
params["cdeid"] = "";
params["uuid"] = context.appUuid_;
params["starttime"] = this.global_.getMilliTime_();
params["plid"] = "";
params["ccid"] = "";
params["err"] = 0;
params["utime"] = 0;
params["pos"] = player != null ? player.playerContext_.currentPlayTime_:0;
params["vdl"] = "-";//视频播放区域左上角坐标
params["vds"] = "-";//视频播放区域尺寸
params["r"] = Math.floor(Math.random() * (1000000 + 1));
params["adur"] = 0;
params["sn"] = 0;
params["pt"] = 0;
params["vpt"] = "";
params["vct"] = 0;//视频内容类型（0：正片；1：广告）
params["bcnt"] = 0;//心跳周期内结束的卡顿的总次数
params["blen"] = 0;//心跳周期内结束的卡顿的累计时长
params["bpos"] = "";//心跳周期内卡顿开始和卡顿结束的时的时间戳和序号数组
params["pcnt"] = 0;//心跳周期内结束的暂停的次数，按照暂停结束计次
params["plen"] = 0;//心跳周期内结束的暂停累计时长
params["ppos"] = 0;//心跳周期内暂停和恢复时的时间戳和序号数组
params["vacnt"] = 0;//心跳周期内调节音量的次数
params["fscnt"] = 0;//心跳周期内全屏切换的次数
params["size1"] = 0;//前贴广告ts总数量
params["size2"] = 0;//已缓存前贴广告ts总数量
params["det"] = "";//解码器类型
params["vr"] = this.strings_.format("{0}*{1}",metaData.pictureWidth_,metaData.pictureHeight_);//视频宽高
params["vc"] = "ts";//视频编码
params["ac"] = "-";//音频编码
params["fps"] = 0;//实时帧频
params["vfn"] = 0;//播放过程中本次心跳周期由于解码慢视频被丢掉的总帧数
params["termid"] = context.termId_;
params["p2p"] = env.p2pEnabled_ ? "1" : "0";
params["p-cde"] = context.protocolWebsocketDisabled_ ? "0" : "1";
params["p-rtc"] = context.protocolWebrtcDisabled_ ? "0" : "1";
params["p-rtmfp"] = context.protocolRtmfpDisabled_ ? "0" : "1";
params["qos"] = 0;//CDN服务器给定的服务质量
params["bul"] = 0;//从播放点的连续已缓冲数据时长
params["cabl"] = 0;//从播放点的可缓冲范围时长
params["srvver"] = "";//从服务器返回的服务器版本
params["stage"] = "";//过程阶段计数器
params["avgutime"] = 0;//平均耗时
params["errcnt"] = 0;//总错误次数
params["httpinfo"] = "";//CDN质量上报所需
params["gip"] = "-";//连接的http tracker服务器的IP地址
params["gport"] = "-";//连接的http tracker服务器的端口
params["wrip"] = "-";//连接的web rtc服务器的IP地址
params["wrport"] = "-";//连接的web rtc服务器的端口号
params["rip"] = "";//连接的rtmfp服务器的IP地址
params["rport"] = "";//连接的rtmfp服务器的端口号
params["csize"] = 0;//心跳周期内CDN数据下载量
params["dsize"] = 0;//心跳周期内通过rtmfp协议从“PC”端数据下载量
params["tsize"] = 0;//心跳周期内通过rtmfp协议从“TV”端数据下载量
params["msize"] = 0;//心跳周期内通过rtmfp协议从“手机”端数据下载量
params["bsize"] = 0;//心跳周期内通过rtmfp协议从“盒子”端数据下载量
params["dnode"] = 0;//rtmfp协议，心跳周期内平均连接节点数
params["lnode"] = 0;//rtmfp协议，心跳周期内平均获得节点数
params["up-rtmfp"] = 0;//通过rtmfp协议的上传量
params["up-rtc"] = 0;//通过rtc协议的上传量
params["up-cde"] = 0;//通过cde协议的上传量
params["dsize-rtc"] = 0;//心跳周期内通过webrtc协议从PC节点下载的数据量
params["tsize-rtc"] = 0;//心跳周期内通过webrtc协议从TV节点下载的数据量
params["msize-rtc"] = 0;//心跳周期内通过webrtc协议从MObile节点下载的数据量
params["bsize-rtc"] = 0;//心跳周期内通过webrtc协议从box节点下载的数据量
params["dsize-cde"] = 0;//心跳周期内通过cde协议从PC节点下载的数据量
params["tsize-cde"] = 0;//心跳周期内通过cde协议从TV节点下载的数据量
params["msize-cde"] = 0;//心跳周期内通过cde协议从MOBILE节点下载的数据量
params["bsize-cde"] = 0;//心跳周期内通过cde协议从BOX节点下载的数据量
params["lsize-cde"] = 0;//心跳周期内通过cde协议从本地缓存下载的数据量
params["dnode-rtc"] = 0;//webrtc协议，心跳周期内平均连接节点数
params["lnode-rtc"] = 0;//webrtc协议，心跳周期内平均获得节点数
params["dnode-cde"] = 0;//cde协议，心跳周期内平均获得节点数
params["lnode-cde"] = 0;//cde协议，心跳周期内平均获得节点数
params["chk0"] = 0;//心跳周期内校验通过的piece数
params["chk1"] = 0;//心跳周期内未知下载来源校验失败的piece数
params["chk2"] = 0;//心跳周期内CDN下载的校验失败的piece数
params["chk3"] = 0;//心跳周期内rtmfp P2P下载的校验失败的piece数
params["chk4"] = 0;//心跳周期内webrtc P2P下载的校验失败的piece数
params["chk5"] = 0;//心跳周期内CDE P2P 下载的校验失败的piece数
params["errinfo"] = "";//错误信息，CDN质量上报所需，包括多个子维度
params["ip"] = "-";//错误信息相关的服务器
params["port"] = "-";//错误信息相关的服务器端口
params["um"] = "";//升级或者加载的模块
params["scmfv"] = "";//服务器上播放框架的版本号
params["scv"] = "";//服务器上的CDE版本号
params["romv"] = "";//乐视设备的rom版本
params["result"] = "";//升级结果，一组值
return params;
}
});
p2p$.ns('com.tools.collector');

p2p$.com.tools.collector.ClientTraffic = p2p$.com.tools.collector.ClientBase.extend_({

playing_ : false,
downloadSizeFromCdn_ : 0,

downloadSizeByRtmfp_ : 0,
downloadSizeByRtmfpFromPc_ : 0,
downloadSizeByRtmfpFromTv_ : 0,
downloadSizeByRtmfpFromBox_ : 0,
downloadSizeByRtmfpFromMobile_ : 0,

downloadSizeByWebsocket_ : 0,
downloadSizeByWebsocketFromPc_ : 0,
downloadSizeByWebsocketFromTv_ : 0,
downloadSizeByWebsocketFromBox_ : 0,
downloadSizeByWebsocketFromMobile_ : 0,

downloadSizeByWebrtc_ : 0,
downloadSizeByWebrtcFromPc_ : 0,
downloadSizeByWebrtcFromTv_ : 0,
downloadSizeByWebrtcFromBox_ : 0,
downloadSizeByWebrtcFromMobile_ : 0,

avgRtmfpNodes_ : 0,
avgRtmfpSessions_ : 0,
avgWebSocketNodes_ : 0,
avgWebSocketSessions_ : 0,
avgWebrtcNodes_ : 0,
avgWebrtcSessions_ : 0,

totalRtmfpNodes_ : 0,
totalRtmfpSessions_ : 0,
totalWebSocketNodes_ : 0,
totalWebSocketSessions_ : 0,
totalWebrtcNodes_ : 0,
totalWebrtcSessions_ : 0,

rtmfpNodeTimes_ : 0,
rtmfpSessionTimes_ : 0,
webSocketNodeTimes_ : 0,
webSocketSessionTimes_ : 0,
webrtcNodeTimes_ : 0,
webrtcSessionTimes_ : 0,

trackerServerIp_ : "",
trackerServerPort_ : 0,
rtmfpServerIp_ : "",
rtmfpServerPort_ : 0,
webrtcServerIp_ : "",
webrtcServerPort_ : 0,
stunServerIp_ : "",
stunServerPort_ : 0,

uploadSizeByRtmfp_ : 0,
uploadSizeByWebsocket_ : 0,
uploadSizeByWebrtc_ : 0,

checksumSuccessCount_ : 0,
checksumErrorsByCdn_ : 0,
checksumErrorsByRtmfp_ : 0,
checksumErrorsByWebsocket_ : 0,
checksumErrorsByWebrtc_ : 0,
checksumErrorsByUnknown_ : 0,

dropSizeByCdn_:0,
dropSizeByRtmfp_:0,
dropSizeByWebrtc_:0,
dropSizeByWebsocket_:0,
dropSizeByUnknown_:0,

updated_ : false,
nodesReset_ : false,
updateTime_ : 0,
lastFlushTime_ : 0,

init : function() {
this._super();
this.trackerServerPort_ = 0;
this.rtmfpServerPort_ = 0;

this.updated_ = false;
this.updateTime_ = 0;
this.lastFlushTime_ = this.global_.getMilliTime_();
this.tidy();
this.tidyNodeAndSessions_();
},

tidy : function() {
this._super();
this.nodesReset_ = true;
this.playing_ = true;
this.downloadSizeFromCdn_ = 0;
this.downloadSizeByRtmfp_ = 0;
this.downloadSizeByRtmfpFromPc_ = 0;
this.downloadSizeByRtmfpFromTv_ = 0;
this.downloadSizeByRtmfpFromBox_ = 0;
this.downloadSizeByRtmfpFromMobile_ = 0;

this.downloadSizeByWebsocket_ = 0;
this.downloadSizeByWebsocketFromPc_ = 0;
this.downloadSizeByWebsocketFromTv_ = 0;
this.downloadSizeByWebsocketFromBox_ = 0;
this.downloadSizeByWebsocketFromMobile_ = 0;

this.downloadSizeByWebrtc_ = 0;
this.downloadSizeByWebrtcFromPc_ = 0;
this.downloadSizeByWebrtcFromTv_ = 0;
this.downloadSizeByWebrtcFromBox_ = 0;
this.downloadSizeByWebrtcFromMobile_ = 0;

this.uploadSizeByRtmfp_ = 0;
this.uploadSizeByWebsocket_ = 0;
this.uploadSizeByWebrtc_ = 0;

this.checksumSuccessCount_ = 0;
this.checksumErrorsByCdn_ = 0;
this.checksumErrorsByRtmfp_ = 0;
this.checksumErrorsByWebsocket_ = 0;
this.checksumErrorsByWebrtc_ = 0;
this.checksumErrorsByUnknown_ = 0;

this.dropSizeByCdn_=0;
this.dropSizeByRtmfp_=0;
this.dropSizeByWebrtc_=0;
this.dropSizeByWebsocket_=0;
this.dropSizeByUnknown_=0;
},

tidyNodeAndSessions_ : function() {
this.avgRtmfpNodes_ = 0;
this.avgRtmfpSessions_ = 0;
this.avgWebSocketNodes_ = 0;
this.avgWebSocketSessions_ = 0;
this.avgWebrtcNodes_ = 0;
this.avgWebrtcSessions_ = 0;

this.totalRtmfpNodes_ = 0;
this.totalRtmfpSessions_ = 0;
this.totalWebSocketNodes_ = 0;
this.totalWebSocketSessions_ = 0;
this.totalWebrtcNodes_ = 0;
this.totalWebrtcSessions_ = 0;

this.rtmfpNodeTimes_ = 0;
this.rtmfpSessionTimes_ = 0;
this.webSocketNodeTimes_ = 0;
this.webSocketSessionTimes_ = 0;
this.webrtcNodeTimes_ = 0;
this.webrtcSessionTimes_ = 0;
},

getLoadParams_:function()
{
var params={};
params["csize"]=this.strings_.fromNumber(this.downloadSizeFromCdn_);
params["dsize"]=this.strings_.fromNumber(this.downloadSizeByRtmfpFromPc_);
params["tsize"]=this.strings_.fromNumber(this.downloadSizeByRtmfpFromTv_);
params["bsize"]=this.strings_.fromNumber(this.downloadSizeByRtmfpFromBox_);
params["msize"]=this.strings_.fromNumber(this.downloadSizeByRtmfpFromMobile_);
params["dnode"]=this.avgRtmfpSessions_ < 0 ? "-1" : this.strings_.fromNumber(this.avgRtmfpSessions_);
params["lnode"]=this.avgRtmfpNodes_ < 0 ? "-1" : this.strings_.fromNumber(this.avgRtmfpNodes_);
params["dnode-cde"]=this.avgWebSocketSessions_ < 0 ? "-1" : this.strings_.fromNumber(this.avgWebSocketSessions_);
params["lnode-cde"]=this.avgWebSocketNodes_ < 0 ? "-1" : this.strings_.fromNumber(this.avgWebSocketNodes_);
params["dnode-rtc"]=this.avgWebSocketSessions_ < 0 ? "-1" : this.strings_.fromNumber(this.avgWebrtcSessions_);
params["lnode-rtc"]=this.avgWebSocketNodes_ < 0 ? "-1" : this.strings_.fromNumber(this.avgWebrtcNodes_);
params["gip"]=this.trackerServerIp_;
params["gport"]=this.strings_.fromNumber(this.trackerServerPort_);
params["rip"]=this.rtmfpServerIp_;
params["rport"]=this.strings_.fromNumber(this.rtmfpServerPort_);
params["gip"]=this.webrtcServerIp_;
params["gport"]=this.strings_.fromNumber(this.webrtcServerPort_);
params["up-rtmfp"]=this.strings_.fromNumber(this.uploadSizeByRtmfp_);
params["up-cde"]=this.strings_.fromNumber(this.uploadSizeByWebsocket_);
params["up-rtc"]=this.strings_.fromNumber(this.uploadSizeByWebrtc_);
params["dsize-cde"]=this.strings_.fromNumber(this.downloadSizeByWebsocketFromPc_);
params["tsize-cde"]=this.strings_.fromNumber(this.downloadSizeByWebsocketFromTv_);
params["bsize-cde"]=this.strings_.fromNumber(this.downloadSizeByWebsocketFromBox_);
params["msize-cde"]=this.strings_.fromNumber(this.downloadSizeByWebsocketFromMobile_);
params["dsize-rtc"]=this.strings_.fromNumber(this.downloadSizeByWebrtcFromPc_);
params["tsize-rtc"]=this.strings_.fromNumber(this.downloadSizeByWebrtcFromTv_);
params["bsize-rtc"]=this.strings_.fromNumber(this.downloadSizeByWebrtcFromBox_);
params["msize-rtc"]=this.strings_.fromNumber(this.downloadSizeByWebrtcFromMobile_);
params["chk0"]=this.strings_.fromNumber(this.checksumSuccessCount_);
params["chk1"]=this.strings_.fromNumber(this.checksumErrorsByUnknown_);
params["chk2"]=this.strings_.fromNumber(this.checksumErrorsByCdn_);
params["chk3"]=this.strings_.fromNumber(this.checksumErrorsByRtmfp_);
params["chk4"]=0;
params["chk5"]=this.strings_.fromNumber(this.checksumErrorsByWebsocket_);
params["lcsize"]=this.strings_.fromNumber(this.dropSizeByCdn_);
params["lpsize"]=this.strings_.fromNumber(this.dropSizeByRtmfp_+this.dropSizeByWebrtc_+this.dropSizeByWebsocket_);
return params;
},

updateSessions_ : function(client, protocolType, count) {
var context = client.getContext_();
if (this.nodesReset_) {
this.tidyNodeAndSessions_();
this.nodesReset_ = false;
}

this.updated_ = true;
this.updateTime_ = this.global_.getMilliTime_();
switch (protocolType) {
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
this.rtmfpSessionTimes_++;
this.totalRtmfpSessions_ += count;
this.avgRtmfpSessions_ = context.p2pRtmfpPeerId_ == "" ? -1 : (this.totalRtmfpSessions_ / this.rtmfpSessionTimes_);
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
this.webSocketSessionTimes_++;
this.totalWebSocketSessions_ += count;
this.avgWebSocketSessions_ = context.trackerServerConnectedTime_ <= 0 ? -1 : (this.totalWebSocketSessions_ / this.webSocketSessionTimes_);
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
this.webrtcSessionTimes_++;
this.totalWebrtcSessions_ += count;
this.avgWebrtcSessions_ = context.webrtcServerConnectedTime_ <= 0 ? -1 : (this.totalWebrtcSessions_ / this.webrtcSessionTimes_);
break;
default:
break;
}

var nodeCount = 0;
switch (protocolType) {
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
nodeCount = context.rtmfpTotalNodeCount_;
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
nodeCount = context.websocketTotalNodeCount_;
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
nodeCount = context.webrtcTotalNodeCount_;
break;
default:
break;
}
this.updateNodes_(client, protocolType, nodeCount);
},

updateNodes_ : function(client, protocolType, count) {
this.updated_ = true;
this.updateTime_ = this.global_.getMilliTime_();
switch (protocolType) {
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
this.rtmfpNodeTimes_++;
this.totalRtmfpNodes_ += count;
this.avgRtmfpNodes_ = this.totalRtmfpNodes_ / this.rtmfpNodeTimes_;
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
this.webSocketNodeTimes_++;
this.totalWebSocketNodes_ += count;
this.avgWebSocketNodes_ = this.totalWebSocketNodes_ / this.webSocketNodeTimes_;
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
this.webrtcNodeTimes_++;
this.totalWebrtcNodes_ += count;
this.avgWebrtcNodes_ = this.totalWebrtcNodes_ / this.webrtcNodeTimes_;
break;
default:
break;
}
},

addDownloadSize_ : function(client, protocolType, terminalType, size) {
if (size <= 0) {
return;
}

this.updated_ = true;
this.updateTime_ = this.global_.getMilliTime_();
switch (protocolType) {
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
this.downloadSizeFromCdn_ += size;
break;

case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
this.downloadSizeByRtmfp_ += size;
switch (terminalType) {
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
this.downloadSizeByRtmfpFromPc_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
this.downloadSizeByRtmfpFromTv_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
this.downloadSizeByRtmfpFromBox_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
this.downloadSizeByRtmfpFromMobile_ += size;
break;
default:
this.downloadSizeByRtmfpFromPc_ += size;
break;
}
break;

case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
this.downloadSizeByWebsocket_ += size;
switch (terminalType) {
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
this.downloadSizeByWebsocketFromPc_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
this.downloadSizeByWebsocketFromTv_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
this.downloadSizeByWebsocketFromBox_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
this.downloadSizeByWebsocketFromMobile_ += size;
break;
default:
this.downloadSizeByWebsocketFromPc_ += size;
break;
}
break;

case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
this.downloadSizeByWebrtc_ += size;
switch (terminalType) {
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
this.downloadSizeByWebrtcFromPc_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
this.downloadSizeByWebrtcFromTv_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
this.downloadSizeByWebrtcFromBox_ += size;
break;
case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
this.downloadSizeByWebrtcFromMobile_ += size;
break;
default:
this.downloadSizeByWebrtcFromPc_ += size;
break;
}
break;

default:
break;
}
},

addUploadSize_ : function(client, protocolType, terminalType, size) {
if (size <= 0) {
return;
}

this.updated_ = true;
this.updateTime_ = this.global_.getMilliTime_();
switch (protocolType) {
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
this.uploadSizeByRtmfp_ += size;
break;

case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
this.uploadSizeByWebsocket_ += size;
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
this.uploadSizeByWebrtc_ += size;
break;

default:
break;
}
},

addChecksumErrors_ : function(client, protocolType, successCount, failedCount,size) {
this.checksumSuccessCount_ += successCount;
this.updateTime_ = this.global_.getMilliTime_();
switch (protocolType) {
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
this.checksumErrorsByCdn_ += failedCount;
this.dropSizeByCdn_+=size;
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
this.checksumErrorsByRtmfp_ += failedCount;
this.dropSizeByRtmfp_+=size;
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
this.checksumErrorsByWebsocket_ += failedCount;
this.dropSizeByWebsocket_+=size;
break;
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
this.checksumErrorsByWebrtc_ += failedCount;
this.dropSizeByWebrtc_+=size;
break;
default:
this.checksumErrorsByUnknown_ += failedCount;
this.dropSizeByUnknown_+=size;
break;
}
},

flush : function(client, closed) {
if (!this.updated_) {
return;
}
this.tidy();
},
getAllStatus_ : function(result) {
result["playing"] = this.playing_;
result["downloadSizeFromCdn"] = this.downloadSizeFromCdn_;
result["downloadSizeByRtmfp"] = this.downloadSizeByRtmfp_;
result["downloadSizeByRtmfpFromPc"] = this.downloadSizeByRtmfpFromPc_;
result["downloadSizeByRtmfpFromTv"] = this.downloadSizeByRtmfpFromTv_;
result["downloadSizeByRtmfpFromBox"] = this.downloadSizeByRtmfpFromBox_;
result["downloadSizeByRtmfpFromMobile"] = this.downloadSizeByRtmfpFromMobile_;
result["downloadSizeByWebsocket"] = this.downloadSizeByWebsocket_;
result["downloadSizeByWebsocketFromPc"] = this.downloadSizeByWebsocketFromPc_;
result["downloadSizeByWebsocketFromTv"] = this.downloadSizeByWebsocketFromTv_;
result["downloadSizeByWebsocketFromBox"] = this.downloadSizeByWebsocketFromBox_;
result["downloadSizeByWebsocketFromMobile"] = this.downloadSizeByWebsocketFromMobile_;
result["downloadSizeByWebrtc"] = this.downloadSizeByWebsocket_;
result["downloadSizeByWebrtcFromPc"] = this.downloadSizeByWebrtcFromPc_;
result["downloadSizeByWebrtcFromTv"] = this.downloadSizeByWebrtcFromTv_;
result["downloadSizeByWebrtcFromBox"] = this.downloadSizeByWebrtcFromBox_;
result["downloadSizeByWebrtcFromMobile"] = this.downloadSizeByWebrtcFromMobile_;

result["avgRtmfpNodes"] = this.avgRtmfpNodes_;
result["avgRtmfpSessions"] = this.avgRtmfpSessions_;
result["avgWebSocketNodes"] = this.avgWebSocketNodes_;
result["avgWebSocketSessions"] = this.avgWebSocketSessions_;
result["avgWebrtcNodes"] = this.avgWebrtcNodes_;
result["avgWebrtcSessions"] = this.avgWebrtcSessions_;

result["totalRtmfpNodes"] = this.totalRtmfpNodes_;
result["totalRtmfpSessions"] = this.totalRtmfpSessions_;
result["totalWebSocketNodes"] = this.totalWebSocketNodes_;
result["totalWebSocketSessions"] = this.totalWebSocketSessions_;
result["totalWebrtcNodes"] = this.totalWebrtcNodes_;
result["totalWebrtcSessions"] = this.totalWebrtcSessions_;

result["rtmfpNodeTimes"] = this.rtmfpNodeTimes_;
result["rtmfpSessionTimes"] = this.rtmfpSessionTimes_;
result["webSocketNodeTimes"] = this.webSocketNodeTimes_;
result["webSocketSessionTimes"] = this.webSocketSessionTimes_;
result["webrtcNodeTimes"] = this.webrtcNodeTimes_;
result["webrtcSessionTimes"] = this.webrtcSessionTimes_;

result["uploadSizeByRtmfp"] = this.uploadSizeByRtmfp_;
result["uploadSizeByWebsocket"] = this.uploadSizeByWebsocket_;
result["uploadSizeByWebrtc"] = this.uploadSizeByWebrtc_;

result["checksumSuccessCount"] = this.checksumSuccessCount_;
result["checksumErrorsByCdn"] = this.checksumErrorsByCdn_;
result["checksumErrorsByRtmfp"] = this.checksumErrorsByRtmfp_;
result["checksumErrorsByWebsocket"] = this.checksumErrorsByWebsocket_;
result["checksumErrorsByWebrtc"] = this.checksumErrorsByWebrtc_;
result["checksumErrorsByUnknown"] = this.checksumErrorsByUnknown_;

result["updated"] = this.updated_;
result["nodesReset"] = this.nodesReset_;
result["updateTime"] = this.updateTime_;
result["lastFlushTime"] = this.lastFlushTime_;
}
});
/**
* Created by letv on 2017/6/21.
*/
p2p$.ns("com.tools.collector");
p2p$.com.tools.collector.HeartBeat = p2p$.com.tools.collector.ClientBase.extend_({
sn_:0,//序列号
bcnt_:0,//卡顿次数
blen_:0,//卡顿时长
pcnt_:0,//结束暂停次数
plen_:0,//暂停时长
vacnt_:0,//调节音量次数
facnt_:0,//全屏次数
dv_:1,//设备音量
inter_:0,
playInter_:1000,
playInterId_:-1,
pt_:0,//心跳内播放时长
psn_:0,//暂停序列号
ppos_:"",
bsn_:0,
bpos_:"",
gTime_:0,
uTime_:0,
timerId_:-1,
init:function(wrapper)
{
this._super();
this.scope_ = wrapper;
this.tag_="com::tools::collector::HeartBeat";
this.gTime_ = this.global_.getMilliTime_();
this.timerId_ = -1;
this.sn_=0;
this.inter_= wrapper.getContext_().statReportInterval_ * 1000;
},
tidy : function() {
this._super();
this.bcnt_ = 0;
this.blen_ = 0;
this.pcnt_ = 0;
this.vacnt_ = 0;
this.facnt_ = 0;
this.dv_=1;
this.pt_ = 0;
this.psn_ = 0;
this.ppos_ =  0;
this.bsn_ = 0;
this.bpos_ = 0;
},
playStatus_:function(params)
{
var type_ = params["type"];
switch(type_)
{
case "VIDEO.GSLB.LOADING":
this.startHeart_();
break;
case "VIDEO.INIT":
this.gTime_ = this.global_.getMilliTime_();
break;
case "VIDEO.PLAY.PLAYING":
case "VIDEO.PLAY.FIRST":
this.startPlayTimer_();
break;
case "VIDEO.PLAY.PAUSE":
this.stopPlayTimer_();
this.psn_ += 1;
this.gTime_ = this.global_.getMilliTime_();
this.addElement_(this.strings_.format("{0}_{1}",this.gTime_,this.psn_),1)
break;
case "VIDEO.PLAY.RESUME":
this.uTime_=this.global_.getMilliTime_()-this.gTime_;
this.pcnt_ += 1;
this.plen_ += this.uTime_;
this.addElement_(this.strings_.format("{0}_{1}",this.global_.getMilliTime_(),this.psn_),1)
break;
case "VIDEO.BUFFER.START":
this.gTime_=this.global_.getMilliTime_();
this.bcnt_ += 1;
this.bsn_ += 1;
this.addElement_(this.strings_.format("{0}_{1}",this.gTime_,this.bsn_));
break;
case "VIDEO.BUFFER.END":
break;
case "VIDEO.PLAY.SEEKING":
this.stopPlayTimer_();
this.gTime_ = this.global_.getMilliTime_();
break;
case "VIDEO.PLAY.SEEKED":
this.uTime_=this.global_.getMilliTime_()-this.gTime_;
this.blen_ += this.uTime_;
this.addElement_(this.strings_.format("{0}_{1}",this.global_.getMilliTime_(),this.bsn_));
break;
case "VIDEO.PLAY.END":
this.stopPlayTimer_();
this.stopHeart_();
break;
}
},
//播放计时
startPlayTimer_:function()
{
if(this.playInterId_>-1){
return;
}
var callback = this.setPlayTime_.bind(this);
this.playInterId_ = setInterval(callback,this.playInter_);
},
stopPlayTimer_:function()
{
if(this.playInterId_>-1){
clearInterval(this.playInterId_) ;
this.playInterId_ = -1;
}
},
setPlayTime_:function()
{
this.pt_++;
},
addElement_:function(str,type)
{
if(!type){
type = 0;
}
switch(type)
{
case 0:
if(this.bpos_ == "")
{
this.bpos_ = str;
}
else
{
this.bpos_+="*"+str;
}
break;
case 1:
if(this.ppos_ == "")
{
this.ppos_ = str;
}
else
{
this.ppos_+="*"+str;
}
default:
break
}
},

startHeart_:function()
{
if(this.timerId_ < 0){
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} startHeart!",this.tag_));
var callback_ = this.timerHandler_.bind(this);
this.timerId_=setInterval(callback_,this.inter_);
}
},
stopHeart_:function()
{
this.timerHandler_();
if(this.timerId_>-1){
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} stopHeart!",this.tag_));
clearInterval(this.timerId_);
this.timerId_=-1;
}
},
timerHandler_:function()
{
this.sn_+=1;
var params_ = {
sn:this.sn_,
bcnt:this.bcnt_,
blen:this.blen_,
pcnt:this.bcnt_,
plen:this.plen_,
vacnt:this.vacnt_,
facnt:this.facnt_,
pt:this.pt_,
bpos:this.bpos_,
ppos:this.ppos_
}
this.scope_.sendStatus_({type:"VIDEO.HEART",params:params_});
this.tidy();
},
close_:function()
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} close!",this.tag_));
this.stopHeart_();
this.stopPlayTimer_();
}
});
p2p$.ns('com.tools.collector');
p2p$.com.tools.collector.Statics = p2p$.com.tools.collector.ClientBase.extend_({
clientParams_:null,
pendingReports_ : null,
http_ : null,
reportServer_ : "",
timer_ : null,
timerIntervalTime_:10*1000,
heart_:null,
reportTraffic_:null,
snObj_:{},
blockTime_:0,
blockFirstReport_:false,

init : function(wrapper) {
this._super();
this.scope_ = wrapper;
this.tag_="com::tools::collector::Statics";
this.clientParams_ = new p2p$.com.tools.collector.ClientParams(this);
this.heart_ = new p2p$.com.tools.collector.HeartBeat(this);
this.reportTraffic_ = new p2p$.com.tools.collector.ClientTraffic();
this.reportServer_ = "http://" + this.scope_.manager_.getEnviroment_().getHostDomain_("s.webp2p.letv.com");
this.pendingReports_ = [];
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init reportServer({1})",this.tag_,this.reportServer_));
},
setReportTimeout_ : function(timeoutMs) {
var me = this;
this.timer_ = setTimeout(function() {
me.onHttpTimeout_();
}, timeoutMs);
},
reportNext_ : function() {
if (this.http_ != null || this.pendingReports_.length == 0) {
return;
}

if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
this.setReportTimeout_(this.timerIntervalTime_);
var nextItem = this.pendingReports_[0];
this.pendingReports_.shift();

var url;
var postData=nextItem[1];
if (nextItem[0].indexOf("http://") == 0) {
url = nextItem[0];
} else {
url = this.reportServer_ + nextItem[0];
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Send report, {1} pending item(s) to url({2})",this.tag_,this.pendingReports_.length, url));
this.http_ = new p2p$.com.loaders.HttpDownLoader({url_:url, scope_:this, method_:"POST", type_:"text",postData_:postData, tag_:"collector::report"});
this.http_.load_();
},

onHttpTimeout_ : function() {
this.http_ = null;
this.reportNext_();
},

onHttpDownloadCompleted_ : function(downloader) {
if (this.http_ != downloader) {
// expired
return true;
}

this.http_ = null;
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
this.reportNext_();
return true;
},

getEnviroment_ : function() {
return this.scope_.manager_.getEnviroment_();
},

getContext_ : function() {
return this.scope_.context_;
},

getMetaData_ : function() {
return this.scope_.metaData_;
},

getPlayer_ : function(){
return this.scope_.player_;
},

close_ : function() {
this.reportTraffic_.flush(this, true);
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
if (this.http_ != null) {
this.http_ = null;
}
this.heart_.close_();
this.heart_ = null;
this.pendingReports_ = [];
},
/**状态处理*/
sendStatus_:function(params)
{
if(this.heart_){
this.heart_.playStatus_(params);
}
var type_ = params["type"];
var params_ = params["params"];
switch(type_)
{
case "PLAYER.INIT":
this.requestInfo_("/act/pl","pl/init",params_);
break;
case "VIDEO.INIT":
this.requestInfo_("/act/cde","cde/init",params_);
break;
case "VIDEO.GSLB.LOADING":
break;
case "VIDEO.GSLB.LOADED":
this.requestInfo_("/act/cde","cde/gslb",params_);
break;
case "VIDEO.META.LOADING":
break;
case "VIDEO.META.LOADED":
this.requestInfo_("/act/cde","cde/chk",params_);
break;
case "ACTION.SELECTOR.CONNECTED":
this.requestInfo_("/act/cde","cde/sel",params_);
break;
case "ACTION.RTMFP.CONNECTED":
this.requestInfo_("/act/cde","cde/rtm",params_);
break;
case "ACTION.SOCKET.CONNECTED":
this.requestInfo_("/act/cde","cde/soc",params_);
break;
case "ACTION.WEBRTC.CONNECTED":
this.requestInfo_("/act/cde","cde/rtc",params_);
break;
case "ACTION.FIRST.PIECE":
break;
case "ACTION.FIRST.P2P.PIECE":
this.requestInfo_("/act/cde","cde/pie",params_);
break;
case "VIDEO.TS.LOADING":
this.requestInfo_("/act/cde","cde/cquery",params_);
break;
case "VIDEO.TS.LOADED":
this.requestInfo_("/act/cde","cde/cload",params_);
break;
case "ACTION.SCHEDULE.COMPLETED":
break;
case "VIDEO.PLAY.FIRST":
this.requestInfo_("/act/pl","pl/play",params_);
break;
case "VIDEO.PLAY.SEEKED":
this.requestInfo_("/act/pl","pl/seek",params_);
break;
case "VIDEO.PLAY.END":
this.requestInfo_("/act/pl","pl/end",params_);
break;
case "VIDEO.BUFFER.START":
this.blockTime_ = this.global_.getMilliTime_();
break;
case "VIDEO.BUFFER.END":
if(!this.blockFirstReport_){
this.blockFirstReport_=true;
params_["utime"]=this.global_.getMilliTime_()-this.blockTime_;
this.requestInfo_("/act/pl","pl/block",params_);
}
break;
case "VIDEO.HEART":
var p2pParams=this.reportTraffic_.getLoadParams_();
for(var i in params_){
p2pParams[i]=params_[i];
}
this.requestInfo_("/hb","time",p2pParams);
break;
case "VIDEO.PLAY.ERROR":
var code = params["code"];
switch (code){
case 20500:
case 20501:
this.requestInfo_("/err/s","s/gslb",params_);
break;
case 20601:
this.requestInfo_("/err/s","s/chk",params_);
break;
case 30001:
this.requestInfo_("/err/s","s/cload",params_);
break;
default:
this.requestInfo_("/err/c","err",params_)
break;
}
break;
}
},
sendTraffic_:function()
{
var type_ = arguments[0];
switch(type_){
case 0://checkError
this.reportTraffic_.addChecksumErrors_(this, arguments[1], arguments[2], arguments[3],arguments[4]);
break;
case 1:
this.reportTraffic_.addDownloadSize_(this, arguments[1], arguments[2], arguments[3]);
break;
case 2:
this.reportTraffic_.updateSessions_(this, arguments[1], arguments[2]);
break;
case 3:
this.reportTraffic_.addUploadSize_(this, arguments[1], arguments[2], arguments[3]);
break;
case 4:
this.reportTraffic_.flush(this,arguments[1]);
break;
}
},

setTrafficParams_:function(params)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} setTrafficParams",this.tag_));
for(var i in params)
{
if(this.reportTraffic_.hasOwnProperty(i)){
this.reportTraffic_[i]=params[i];
}
}
},

requestInfo_:function(tag,type,params)
{
var reportParams = this.clientParams_.getReportParams_(type);//获取需要上报参数
var baseParamValues = this.clientParams_.getBaseParams_();
var info = {};
for(var i=0;i<reportParams.length;i++){
info[reportParams[i]] = baseParamValues[reportParams[i]];
}
if(info.hasOwnProperty("act")){
var act = type;
var data = type.split("/");
if(data.length>1){
act = data[1];
}
info["act"]=act;
}
//赋值携带参数
for(var i in params){
info[i] = params[i];
}
this.pendingReports_.push([tag,info]);
this.reportNext_();
}
});
p2p$.ns('com.tools.collector');

p2p$.com.tools.collector.SupportSession = {

kTimerTypeSubmit : 0,
kTimerTypeClose : 1,
kTimerTypeRedirect : 2,

serverErrorCode_ : 0,
reportInterval_ : 5,
redirectTimes_ : 0,
sessionServerTime_ : 0,
sessionExpireTime_ : 0,
sessionActiveTime_ : 0,
lastPipeLogTime_ : 0,
lastSubmitTime_ : 0,
totalSubmitTimes_ : 0,
sendPending_ : false,

serverPath_ : "/cde-console-connection",
serverUrl_ : "",
redirectServer_ : "",
sessionId_ : "",
serviceNumber_ : "",
requestParams_ : null,
callbackParams_ : null,

initialized_ : false,
timer_ : null,
callbacks_ : null,
client_ : null,
strings_:null,
tag_:"com::tools::collector::SupportSession",

init : function() {
if (this.initialized_) {
return;
}
this.initialized_ = true;
this.strings_=p2p$.com.common.String;
var env = p2p$.com.selector.Enviroment;
this.serverUrl_ = "ws://" + env.getHostDomain_("log.cde.letv.com") + this.serverPath_;
this.callbackParams_ = new p2p$.com.common.Map();
this.callbackParams_.set('needLogPipe', true);
this.callbackParams_.set('logPipeLevel', 255);
this.callbackParams_.set('logPipeLimit', 10000);
this.callbackParams_.set('segmentStartWithPlayer', 1);
},

open : function(params, callback) {
this.init();

if (!this.requestParams_) {
this.requestParams_ = {};
}
p2p$.apply(this.requestParams_, params || {});

if (this.client_) {
var nowTime = p2p$.com.common.Global.getMilliTime_();
if (this.serverErrorCode_ == p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess && this.sessionActiveTime_ + 30 * 1000 > nowTime) {
this.addCallback_(callback);
if (this.serviceNumber_) {
this.applyCallbacks_();
}
return true;
}
}

this.close(true);
this.addCallback_(callback);
this.openUrl_(this.serverUrl_);
},

close : function(clean) {
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}

if (this.client_) {
try {
this.client_.close();
} catch (e) {
}
this.client_ = null;
}
this.sessionId_ = "";
if (clean) {
this.callbacks_ = null;
}
},

addCallback_ : function(callback) {
if (!callback) {
return;
}
if (!this.callbacks_) {
this.callbacks_ = [];
}
this.callbacks_.push(callback);
},

applyCallbacks_ : function() {
for ( var i = 0; this.callbacks_ && i < this.callbacks_.length; i++) {
var item = this.callbacks_[i];
if (typeof (item) == 'function') {
item.call(this, this.serverErrorCode_, this.serviceNumber_);
} else if (item && item.fn) {
item.fn.apply(item.scope || this, (item.params || []).concat([ this.serverErrorCode_, this.serviceNumber_ ]));
}
}
this.callbacks_ = null;
},

setTimer_ : function(type) {
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}

var me = this;
switch (type) {
case this.kTimerTypeSubmit:
this.timer_ = setTimeout(function() {
me.onSubmitTimeout_();
}, Math.max(this.reportInterval_, 1) * 1000);
break;
case this.kTimerTypeClose:
this.timer_ = setTimeout(function() {
me.onCloseTimeout_();
}, 10);
break;
case this.kTimerTypeRedirect:
this.timer_ = setTimeout(function() {
me.onRedirectTimeout_();
}, 10);
default:
break;
}
},

onSubmitTimeout_ : function() {
if (!this.client_) {
return;
}

this.doLogSubmit_();
this.setTimer_(this.kTimerTypeSubmit);
},

onCloseTimeout_ : function() {
this.close(true);
},

onRedirectTimeout_ : function() {
this.close(false);

var redirectUrl = this.redirectServer_ + this.serverPath_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Redirect {1} times to open({2}) ...", this.tag_,this.redirectTimes_, redirectUrl));
this.openUrl_(redirectUrl);
},

openUrl_ : function(url) {
// reset state
this.lastPipeLogTime_ = 0;
this.lastSubmitTime_ = 0;
this.totalSubmitTimes_ = 0;
this.sendPending_ = false;

try {
this.client_ = new WebSocket(url);
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Open websocket failed: {0}",this.tag_, (e || '').toString()));
this.serverErrorCode_ = p2p$.com.webp2p.core.common.ERROR_CODE.kErrorAccessDenied;
this.applyCallbacks_();
return;
}
this.sessionActiveTime_ = p2p$.com.common.Global.getMilliTime_();

var me = this;
this.client_.onopen = function(evt) {
me.onWebSocketOpen_(evt);
};
this.client_.onclose = function(evt) {
me.onWebSocketClose_(evt);
};
this.client_.onerror = function(evt) {
me.onWebSocketClose_(evt);
};
this.client_.onmessage = function(message) {
var fileReader = new FileReader();
fileReader.onload = function() {
me.onWebSocketMessage_(new Uint8Array(this.result));
};
fileReader.readAsArrayBuffer(message.data);
};
},

onWebSocketOpen_ : function(evt) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Socket client open ok",this.tag_));
if (!this.client_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Socket client opened bu session closed",this.tag_));
return;
}

var env = p2p$.com.selector.Enviroment;
this.sessionActiveTime_ = p2p$.com.common.Global.getMilliTime_();

// send register
var registerParams = {};
registerParams["action"] = "createSessionRequest";
registerParams["deviceMac"] = "";
registerParams["deviceIp"] = env.clientIp_;
registerParams["clientTime"] = Math.floor(new Date().getTime() / 1000);
registerParams["clientVersion"] = env.moduleVersion_;
registerParams["appId"] = env.externalAppId_;
registerParams["appVersion"] = env.externalAppVersion_;
registerParams["appChannel"] = env.externalAppChannel_;
registerParams["appPackageName"] = env.externalAppPackageName_;
registerParams["hardwareType"] = env.deviceType_;
registerParams["softwareType"] = env.osType_;
registerParams["geo"] = env.clientGeo_;
registerParams["geoName"] = env.clientGeoName_;
registerParams["contact"] = this.requestParams_["contact"] || "";
registerParams["remarks"] = this.requestParams_["remarks"] || "";

var messageData = this.encodeMessage_(JSON.stringify(registerParams), "");
this.sendPending_ = true;
this.client_.send(messageData);
return true;
},

onWebSocketError_ : function(evt) {
if (!this.client_) {
return;
}

this.serverErrorCode_ = p2p$.com.webp2p.core.common.ERROR_CODE.kErrorNetworkFailed;
this.applyCallbacks_();
this.setTimer_(this.kTimerTypeClose);
return true;
},

onWebSocketMessage_ : function(message) {
this.sendPending_ = false;
if (!this.client_) {
return;
}

this.sessionActiveTime_ = p2p$.com.common.Global.getMilliTime_();
message = this.decodeMessage_(message);
if (!message) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} Decode socket message failed, size({1})"),this.tag_, size);
this.serverErrorCode_ = p2p$.com.webp2p.core.common.ERROR_CODE.kErrorDestUnreachable;
this.applyCallbacks_();
return;
}

var params = message.params || {};
if (params["serverTime"]) {
this.sessionServerTime_ = params["serverTime"];
}
if (params["expireTime"]) {
this.sessionExpireTime_ = params["expireTime"];
}
if (params["reportInterval"]) {
this.reportInterval_ = params["reportInterval"];
}
if (this.reportInterval_ <= 0) {
this.reportInterval_ = 5;
}

var action = params["action"] || "";
if (action == "createSessionResponse") {
this.serverErrorCode_ = params["errorCode"] || 0;
this.redirectServer_ = params["redirectTo"] || "";
this.sessionId_ = params["sessionId"] || "";

this.serviceNumber_ = this.sessionId_;
if (this.serviceNumber_) {
while (this.serviceNumber_.length < 10) {
this.serviceNumber_ = "0" + this.serviceNumber_;
}
}

P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Create socket session responsed, code({1}), redirect({2}), session id({3}),server time({4}), expire time({5}), interval({6} sec)", this.serverErrorCode_, this.redirectServer_, this.sessionId_,this.strings_.formatTime_(this.sessionServerTime_ * 1000, "yyyy-M-d h:m:s"), this.strings_.formatTime_(this.sessionExpireTime_ * 1000, "yyyy-M-d h:m:s"), this.reportInterval_));

if (this.redirectServer_) {
if (this.redirectTimes_ > 5) {
this.serverErrorCode_ = p2p$.com.webp2p.core.common.ERROR_CODE.kErrorDestUnreachable;
this.applyCallbacks_();
this.setTimer_(this.kTimerTypeClose);
return;
}
this.redirectTimes_++;
this.setTimer_(this.kTimerTypeRedirect);
return;
}

this.applyCallbacks_();
if (this.totalSubmitTimes_ <= 0) {
this.setTimer_(this.kTimerTypeSubmit);
this.doLogSubmit_();
}
} else if (action == "reportLogResponse") {
// TODO
} else {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Socket message action({1}) not support yet",this.tag_,action));
return;
}

if (this.sessionExpireTime_ < this.sessionServerTime_) {
this.setTimer_(this.kTimerTypeClose);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Session expired, close from action({1})",this.tag_,action));
}
},

onWebSocketClose_ : function() {
if (!this.client_) {
return;
}

P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Socket client closed",this.tag_));

if (!this.sessionId_) {
this.serverErrorCode_ = p2p$.com.webp2p.core.common.ERROR_CODE.kErrorNetworkFailed;
this.applyCallbacks_();
}

this.close(true);
return true;
},

doLogSubmit_ : function() {
if (!this.client_ || this.sendPending_) {
return;
}

var submitObject = {};

this.callbackParams_.set("logPipeTime", this.lastPipeLogTime_);
if (!window.pako && window.pako.gzip) {
this.callbackParams_.set("ignoreChannels", true);
this.callbackParams_.set('logPipeLimit', 30);
} else {
this.callbackParams_.set('logPipeLimit', 300);
}
this.lastPipeLogTime_ = p2p$.com.webp2p.core.entrance.VideoStream.getCurrentState_(this.callbackParams_, submitObject, this.lastPipeLogTime_);

var submitParams = {};
submitParams["action"] = "reportLogRequest";
submitParams["contentEncoding"] = "none";
submitParams["clientTime"] = Math.floor(new Date().getTime() / 1000);

var submitData = JSON.stringify(submitObject);
var submitLength = submitData.length;
if (window.pako && window.pako.gzip) {
var binData = this.encodeString2Utf8_(submitData);
var gzipData = window.pako.gzip(binData);
if (gzipData) {
submitData = gzipData;
submitParams["contentEncoding"] = "gzip";
}
}

if (submitParams["contentEncoding"] == "none") {
var maxLength = 1024 * 60;
if (submitData.length > maxLength) {
submitData = submitData.substr(0, maxLength);
}
}

this.lastSubmitTime_ = new Date().getTime();
this.totalSubmitTimes_++;

var messageData = this.encodeMessage_(JSON.stringify(submitParams), submitData);
this.sendPending_ = true;
this.client_.send(messageData);

try {
var totalLogCount = p2p$.com.common.Log.logPipe_.records_.length;
var timeLeft = this.sessionExpireTime_ - this.sessionServerTime_;
} catch (e) {
// IGNORE
}
},

encodeString2Utf8_ : function(value) {
var buffer = new Uint8Array(value.length * 3);
var pos = 0;
for ( var i = 0; i < value.length; i++) {
var val = value.charCodeAt(i);
var b1, b2, b3;
if (val <= 0x0000007F) {
b1 = val >> 0 & 0x7F | 0x00;
buffer[pos++] = b1;
} else if (val >= 0x00000080 && val <= 0x000007FF) {
b1 = val >> 6 & 0x1F | 0xC0;
b2 = val >> 0 & 0x3F | 0x80;
buffer[pos++] = b1;
buffer[pos++] = b2;
} else {
b1 = val >> 12 & 0x0F | 0xE0;
b2 = val >> 6 & 0x3F | 0x80;
b3 = val >> 0 & 0x3F | 0x80;
buffer[pos++] = b1;
buffer[pos++] = b2;
buffer[pos++] = b3;
}
}

return buffer.subarray(0, pos);
},

encodeMessage_ : function(params, body) {
var offset = 0;
params = this.encodeString2Utf8_(params);
if (typeof (body) == "string") {
body = this.encodeString2Utf8_(body);
}
var buffer = new Uint8Array(8 + params.length + body.length);

// copy params
buffer[offset] = (params.length >> 24) & 0xff;
buffer[offset + 1] = (params.length >> 16) & 0xff;
buffer[offset + 2] = (params.length >> 8) & 0xff;
buffer[offset + 3] = params.length & 0xff;

offset += 4;
for ( var i = 0; i < params.length; i++) {
buffer[offset + i] = params[i];
}
offset += params.length;
buffer[offset] = (body.length >> 24) & 0xff;
buffer[offset + 1] = (body.length >> 16) & 0xff;
buffer[offset + 2] = (body.length >> 8) & 0xff;
buffer[offset + 3] = body.length & 0xff;
offset += 4;
for ( var i = 0; i < body.length; i++) {
buffer[offset + i] = body[i];
}
offset += body.length;
return new Blob([ buffer ]);
},

decodeMessage_ : function(data) {
var result = {
params : null,
body : null
};
var offset = 0;

// copy params
if (offset + 4 > data.length) {
return result;
}

var paramSize = (data[offset] << 24) + (data[offset] << 16) + (data[offset] << 8) + data[offset + 3];
offset += 4;
if (offset + paramSize > data.length) {
return result;
}
var paramsData = "";
for ( var i = 0; i < paramSize; i++) {
paramsData += String.fromCharCode(data[offset + i]);
}
offset += paramSize;

try {
result.params = eval('(' + paramsData + ')');
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Decode message failed, json invalid: {1}",this.tag_,paramsData));
}

// copy body
if (offset + 4 > data.length) {
return offset;
}
var bodySize = (data[offset] << 24) + (data[offset] << 16) + (data[offset] << 8) + data[offset + 3];
if (offset + bodySize > data.length) {
return offset;
}
if (bodySize > 0) {
result.body = new Uint8Array(data, offset, bodySize);
}
offset += bodySize;

return result;
},
getAllStatus_:function(result) {
result["errorCode"] = this.serverErrorCode_;
result["serviceNumber"] = this.serviceNumber_;
result["sessionActiveTime"] = this.sessionActiveTime_;
result["sessionServerTime"] = this.sessionServerTime_;
result["sessionExpireTime"] = this.sessionExpireTime_;
result["reportInterval"] = this.reportInterval_;
result["lastPipeLogTime"] = this.lastPipeLogTime_;
result["lastSubmitTime"] = this.lastSubmitTime_;
result["totalSubmitTimes"] = this.totalSubmitTimes_;
}
};
p2p$.ns('com.tools.console');

p2p$.com.tools.console.Channel = JClass.extend_({
index : 0,
parent : null,
dom : null,
elements_ : null,
property : null,
peers : null,
peerHeaders_ : null,
segments : null,
pieces : null,
utils_:null,

init : function(data, videoStream) {
this.property = data;
this.videoStream_ = videoStream;
this.utils_ = p2p$.com.utils.Utils;
},

create : function(index, parent) {
this.index = index;
if (this.dom) {
this.destroy();
}

this.peerHeaders_ = [ {
title : "名称",
fieldIndex : "name"
} ];

this.peers = {};
this.segments = {};
this.pieces = [];
this.parent = parent;
this.dom = document.createElement("div");
this.dom.setAttribute("id", "channel-"+this.property.id);
this.dom.className="channel-item";
this.parent.appendChild(this.dom);
this.createElements_();
},

destroy : function() {
if (this.dom) {
this.dom.remove();
this.dom = null;
}
},

getTypeName_ : function() {
switch (this.property.type) {
case 'vod':
return '点播';
case 'live':
return '直播';
case 'stream':
return '实时';
case 'download':
return '下载';
default:
return '未知';
}
},

createElements_ : function() {
var title_ = document.createElement("table");
title_.className = "channel-title";
var tr_ = document.createElement("tr");
title_.appendChild(tr_);
var td_,tds_=[];
for(var i=0;i<3;i++){
td_ = document.createElement("td");
tr_.appendChild(td_);
tds_.push(td_);
}
tr_ = document.createElement("tr");
title_.appendChild(tr_);
td_ = document.createElement("td");
td_.setAttribute("colspan",3);
tr_.appendChild(td_);
tds_.push(td_);
var a_=document.createElement("a");
a_.setAttribute("href",this.utils_.format('http://{0}{1}', p2p$.com.tools.console.Index.host, (this.property.channelPlayUrl || '').replace(/debug=0/g, 'debug=1')));
a_.setAttribute("title", "查看M3U8");
a_.setAttribute("target","_blank");
a_.innerHTML=this.utils_.format("{0}频道 {1}",this.getTypeName_(), this.index);
tds_[0].appendChild(a_);
var text_= document.createElement("div");
text_.setAttribute("title",this.property.channelUrl);
text_.innerText=this.utils_.htmlEscape_((this.property.directMetaMode ? this.property.channelUrl : this.property.gslbEncryptUrl)|| this.property.channelUrl);
tds_[3].appendChild(text_)
var close=document.createElement("a");
close.setAttribute("title","关闭频道");
close.className="click-link";
close.innerHTML="X";
tds_[2].appendChild(close);
///////info
var info_=document.createElement("div");
info_.className="info";
///////
var statData_=document.createElement("table");
statData_.className="stat";
statData_.setAttribute("border", "0");
statData_.innerHTML='<tr><td colspan="18" class="title">传输统计</td></tr>' + '<tr class="row">'
+ '<td class="prefix">下载数据:</td><td class="value" colspan="4"></td>' + '<td class="prefix">上传数据:</td><td class="value" colspan="4"></td>'
+ '<td class="prefix">P2P 下载率:</td><td class="value" colspan="1"></td>'
+ '<td class="prefix" align="right">参数:</td><td class="value" colspan="2" title="Fetch Rate  % / 最大连接节点 / 紧急区时长 / P2P.P2P-UIC "></td>'
+ '<td class="prefix">上传比:</td><td class="value" colspan="1"></td>' + '</tr><tr class="row">'
+ '<td class="prefix protocol-cdn">CDN:</td> <td class="prefix2">下载:</td><td class="value"></td> '
+ '<td class="prefix2"></td><td class="value" style="padding-right:20px;"></td>'
+ '<td class="prefix protocol-webrtc">WebRTC:</td> <td class="prefix2">下载:</td><td class="value"></td> '
+ '<td class="prefix2">上传:</td><td class="value" style="padding-right:20px;"></td>'
+ '<td class="prefix protocol-websocket">SOCKET:</td> <td class="prefix2">下载:</td><td class="value"></td> '
+ '<td class="prefix2">上传:</td><td class="value" style="padding-right:20px;"></td>' + '<td class="prefix"></td><td></td><td></td>'
+ '</tr>';
/////pieces
var pieces_=document.createElement("div");
pieces_.className="pieces";
pieces_.innerHTML='<div class="switch-wrapper"><button class="switch-btn"></button></div>';
/////segments
var segments_=document.createElement("table");
segments_.className="segments";
segments_.innerHTML="<tr><td colspan='9' class='title'><span>分片(TS)列表 (从紧急区位置开始 5 个)</span><td></tr>"
+ "<tr class='header'>" + "<th>ID</th> <th>大小</th> <th>开始时间</th> <th>时长 (s)</th> <th>平均码率</th> <th>下载速度</th> <th>最后下载时间</th>"
+ "<th>等待 / 已下载 / PIECE</th> <th>完成比例</th>" + "</tr>";
//////peers
var peers_=document.createElement("table");
peers_.className="peers";
peers_.innerHTML="<tr class='title'><td colspan='13'>节点列表 (<span class='peer-type-stats'>...</span>)</td></tr>"
+ "<tr class='header'>" + "<th>名称</th> <th>类型</th> <th>节点 ID / QoS</th> <th>IP 地址</th> <th>位置</th> <th>下载速度</th> "
+ "<th>最后下载时间</th> <th>下载数据量</th> <th>下载 PIECE</th> <th>上传数据量</th> <th>上传 PIECE</th>" + "<th>队列 / 响应 / 请求 / 消息</th> <th>错误: 校验/所有</th>"
+ "</tr>";
this.elements_ = {
title : title_,
info : info_,
statData :statData_,
pieces : pieces_,
segments : segments_,
peers:peers_
};
for ( var name in this.elements_) {
this.dom.appendChild(this.elements_[name]);
}

var delegate = this;
var page = p2p$.com.tools.console.Index;
var switchWrapper = this.elements_.pieces.getElementsByClassName("switch-wrapper")[0];
var switchBtn = switchWrapper.getElementsByClassName("switch-btn")[0];
switchBtn.onclick=function() {
page.statusParams_.segmentStartWithPlayer_ = page.statusParams_.segmentStartWithPlayer_ ? 0 : 1;
delegate.reset(switchBtn, page.statusParams_.segmentStartWithPlayer_);
page.onTimer_();
};
this.reset(switchBtn, page.statusParams_.segmentStartWithPlayer_);

var closeLink = this.elements_.title.getElementsByClassName("click-link")[0];//$(this.elements_.title.find(".click-link"));
closeLink.onclick=function()
{
delegate.closeRemoteChannel_();
}
},

reset : function(switchBtn, segmentStartWithPlayer_) {
switchBtn.innerHTML=segmentStartWithPlayer_ ? '显示所有片段' : '从播放器位置显示';
if (this.pieces) {
for ( var i = 0; i < this.pieces.length; i++) {
this.pieces[i].remove();
}
}
this.pieces = [];

if (this.peers) {
for ( var id in this.peers) {
this.peers[id].remove();
}
this.peers = {};
}
},

update : function(data) {
this.property = data;
this.updateInfo_();
this.updateStatData_();
this.updatePieces_();
this.updateSegments_();
this.updatePeers_();
},

updateInfo_ : function() {
var streamName = this.property.liveStreamId || '';
if (this.property.type != 'live') {
var channelParams = this.utils_.getUrlParams_(this.property.channelUrl);
streamName = this.getVideoRateName_(channelParams['vtype']) || channelParams['rateid'];
}

// var gslbErrorDetails = this.property.gslbServerErrorDetails || this.getGslbErrorDetails_(this.property.gslbServerErrorCode,
// this.property.gslbServerErrorDetails);
var gslbErrorDetails = this.getGslbErrorDetails_(this.property.gslbServerErrorCode, this.property.gslbServerErrorDetails);

var htmls = this.utils_.format('<table>' + '<tr><td class="prefix">频道 ID:</td><td class="name" title="{1}">{0}</td></tr>'
+ '<tr><td class="prefix">创建时间:</td><td>{2}, <span class="extra">P2P Tracker:</span> {20}, '
+ '  <span class="extra">Webrtc:</span> {21} <span class="extra" title="{22}">Peer ID:</span> {23}</td></tr>'
+ '<tr><td class="prefix">最后活跃时间:</td><td>{3} <span class="extra">(与播放器交互)</span>, '
+ '  HTTP: {17}, GSLB({31}): {18}/EC:{28}, M3U8({32}): {19}</td></tr>'
+ '<tr><td class="prefix">打开耗时:</td><td>{4} ms <span class="extra">(GSLB + 第一次 M3U8)</span>, '
+ '  {30} ms<span class="extra">(GSLB)</span>, '
+ '  {36} ms<span class="extra">(GSLB总耗时)</span></td></tr>'
+ '<tr><td class="prefix">当前直播点:</td><td>{5} <span class="extra" title="GAP / M3U8刷新 / TS 跳跃 / 直播时延">(最新) GAP:</span> {29} 秒 '
+ '  <span class="extra">GSLB 加载: </span>{24}, <span class="extra">重新调度: </span>{25} 分钟后</td></tr>'
+ '<tr><td class="prefix">M3U8 信息 1:</td><td><span class="extra">加载: </span>{26}, 当前 {6} 个 TS，'
+ '  <span class="extra">范围: </span>{7} ~ {8}, {9} 个已完成, {10} 个正在下载, {11} 个可见, 共 {12} 秒</td></tr>'
+ '<tr><td class="prefix">M3U8 信息 2:</td><td>{13} 个 PIECE, <span class="extra">P2P Group ID:</span> {14}, '
+ '  <span class="extra">Stream ID/Rate:</span> {27}</td></tr>'
+ '<tr><td class="prefix">播放器:</td><td>正在请求 TS {15}, <span class="extra">第一次起播时间:</span> '
+ '  {16}, UIC: {33}::{34}, <span title="P2P 正在下载 PIECE 数量">{35}P</span></tr>' + '</table>', this.property.id
+ (this.property.context.drmEnabled ? ' - <i>DRM</i>' : '') + (this.property.paused ? ' - 已暂停' : '')/*0*/, this.property.selfRanges/*1*/,
this.utils_.formatDate_('Y-m-d H:i:s', this.property.createTime)/*2*/, this.utils_.formatDate_(
'Y-m-d H:i:s', this.property.activeTime)/*3*/, this.property.channelOpenedTime > 0 ? Math
.round((this.property.channelOpenedTime - this.property.createTime)) : '-'/*4*/, this.utils_.formatDate_('Y-m-d H:i:s',
this.property.livePlayTime * 1000)/*5*/, this.property.metaData.segmentCount/*6*/, this.property.metaData.segmentFirstId/*7*/,
this.property.metaData.segmentLastId/*8*/, this.property.metaData.segmentCompletedCount/*9*/, this.property.metaData.segmentCompletingCount/*10*/,
this.property.metaData.segmentDisplayCount/*11*/, Math.round(this.property.metaData.segmentDisplayDuration / 1000)/*12*/,
this.property.metaData.pieceCount/*13*/, this.property.metaData.p2pGroupId/*14*/, this.property.urgentSegmentId + '/' + this.property.playerSegmentId/*15*/,
this.utils_.formatDate_('Y-m-d H:i:s', this.property.mediaStartTime)/*16*/, this.utils_.format(
'<span class="{0}">{1}</span>', this.property.metaResponseCode == 200 ? 'status-ok' : 'status-error', this.property.metaResponseCode)/*17*/,
this.utils_.format('<span class="{0}">{1}</span>', this.property.gslbServerResponseCode == 200 ? 'status-ok'
: 'status-error', this.property.gslbServerResponseCode)/*18*/, this.utils_.format('<span class="{0}">{1}</span>',
this.property.metaServerResponseCode == 200 ? 'status-ok' : 'status-error', this.property.metaServerResponseCode)/*19*/,
this.property.context ? this.property.context.gatherServerHost : '-'/*20*/,
this.property.context ? this.property.context.webrtcServerHost : '-'/*21*/, this.property.context ? (this.property.context.p2pWebrtcPeerId || '...')
: '-'/*22*/, this.property.context ? (this.property.context.p2pWebrtcPeerId || '...') : '-'/*23*/, this.utils_.formatDate_(
'Y-m-d H:i:s', this.property.gslbLoadTime)/*24*/, this.property.gslbReloadInterval / 1000000 / 60/*25*/, this.utils_
.formatDate_('Y-m-d H:i:s', this.property.metaLoadTime)/*26*/, streamName/*27*/, this.utils_.format(
'<span class="{0}" title="Error Code">{1}</span>', this.property.gslbServerErrorCode == 0 ? 'status-ok' : 'status-error', [
this.property.gslbServerErrorCode, gslbErrorDetails ].toString())/*28*/, (this.property.metaData.totalGapDuration / 1000) + ' / '
+ (Math.round(this.property.playerFlushInterval / 1000) / 1000) + ' / ' + (this.property.liveSkipSegmentTime / 1000) + ' / '
+ (this.property.livePlayOffset || '-')/*29*/, this.property.gslbConsumedTime ? ((this.property.gslbConsumedTime || 0)) : '-'/*30*/,
this.property.context.gslbServerIp ? this.property.context.gslbServerIp : '...'/*31*/,
this.property.context.metaServerIp ? this.property.context.metaServerIp : '...'/*32*/,
typeof (this.property.urgentIncompleteCount) == 'number' ? this.property.urgentIncompleteCount : '-'/*33*/,
typeof (this.property.urgentSegmentEndId) == 'number' ? this.property.urgentSegmentEndId : '-'/*34*/,
typeof (this.property.otherPeerRequestCount) == 'number' ? this.property.otherPeerRequestCount : '-'/*35*/,this.property.gslbTotalUseTime/*36*/);
this.elements_.info.innerHTML=htmls;
},

updateStatData_ : function() {
if (!this.property.statData) {
return;
}

var statChildren = this.elements_.statData.getElementsByClassName("row");
var allStatDom = statChildren[0];
var protocolsDom = statChildren[1];

var uploadSuffix = '';
if (this.property.context.p2pUploadLimit) {
uploadSuffix = this.utils_.format('<span title="P2P 上传限制, I:初始值, A:平均值, N:目前值"> / I:{0}, A:{1}, N:{2}</span>',
this.utils_.speed(this.property.context.p2pUploadThrottleInit, true), this.utils_.speed(
this.property.context.p2pUploadThrottleAverage, true), this.utils_.speed(
this.property.statData.restrictedSendSpeed, true));
}

var doms = allStatDom.getElementsByClassName("value");
doms[0].innerHTML=this.utils_.size(this.property.statData.totalReceiveBytes);
doms[1].innerHTML=(this.property.statData.totalSendBytes > 0 ? this.utils_.size(this.property.statData.totalSendBytes) : '-') + uploadSuffix;
doms[2].innerHTML=(this.property.statData.shareReceiveRatio * 100).toFixed(1) + '%';
doms[3].innerHTML=(this.property.context.p2pFetchRate * 100).toFixed(1) + '% / ' + this.property.context.p2pMaxPeers + ' / ' + (this.property.context.p2pUrgentSize || '-') + 's' + ' / ' + (this.property.context.p2pMaxParallelRequestPieces || '-') + '.'+(this.property.context.p2pMaxUrgentRequestPieces || '-');
doms[4].innerHTML=((this.property.statData.shareSendRatio * 100).toFixed(1) + '%');

protocolsDom.getElementsByClassName("protocol-cdn")[0].style.color='#aa0000';
protocolsDom.getElementsByClassName("protocol-webrtc")[0].style.color=this.property.context.webrtcServerConnectedTime > 0 ? 'green' : '';
protocolsDom.getElementsByClassName("protocol-webrtc")[0].setAttribute('title', this.property.context.p2pWebrtcPeerId + "\n" + this.property.selfRanges);

var websocketName = protocolsDom.getElementsByClassName("protocol-websocket")[0];
var upnpInfo = this.utils_.format(', UPNP: {0}, Port: {1}/{2}, {3}, {4}', this.property.context.upnpMapSuccess ? 'Yes' : 'No',
this.property.context.upnpMappedInPort, this.property.context.upnpMappedOutPort, this.property.context.upnpMappedAddress,
this.utils_.formatDate_('Y-m-d H:i:s', this.property.context.upnpMapCompleteTime / 1000));
websocketName.style.color=this.property.context.trackerServerConnectedTime > 0 ? '#00bb00' : '';
websocketName.setAttribute('title', this.property.context.p2pWebsocketPeerId + upnpInfo);

var doms = protocolsDom.getElementsByClassName("value");
for ( var type = 0; type < 4; type++) {
var pdata = this.property.statData.protocols[type + 1];
if (!pdata) {
continue;
}
//
var temp = type;
if (type == 3) {
temp = 1;
}
doms[temp * 2].innerHTML=this.utils_.format('{0}, {1}%', this.utils_.size(pdata.totalReceiveBytes),(pdata.shareReceiveRatio * 100).toFixed(1));
if (temp > 0) // not cdn
{
doms[temp * 2 + 1].innerHTML=this.utils_.format('{0}, {1}%', this.utils_.size(pdata.totalSendBytes),(pdata.shareSendRatio * 100).toFixed(1));
}
}
},

updatePieces_ : function() {
var pieceCount = 0;
var page = p2p$.com.tools.console.Index;
var segments = this.property.metaData.segments;
for ( var i = 0; i < segments.length; i++) {
var segment = segments[i];
pieceCount += (segment.pieceCount + 1);
if (pieceCount > 1000 && page.statusParams_.segmentStartWithPlayer_) {
break;
}
}
if (this.pieces.length < pieceCount) {
while (this.pieces.length < pieceCount) {
var el = document.createElement("div");
el.className="piece-units";
el.innerHTML="&nbsp;";
this.pieces.push(el);
this.elements_.pieces.appendChild(el);
}
}
var pieceIndex = 0;
for ( var i = 0; i < segments.length; i++) {
var segment = segments[i];
if (pieceIndex < this.pieces.length) {
var dom = this.pieces[pieceIndex];
dom.innerHTML=this.utils_.format('<span>{0}</span>', segment.id % 10000);
dom.className=segment.discontinuity ? 'ts-discontinuity' : (segment.beginOfMeta ? 'ts-begin' : 'ts');
dom.style.backgroundColor='';
pieceIndex++;
}
for ( var j = 0; j < segment.pieces.length && pieceIndex < this.pieces.length; j++, pieceIndex++) {
var piece = segment.pieces[j];
var color = '#ddd';
if (piece.completedTime > 0) {
switch (piece.receiveProtocol) {
case 1:
color = '#aa0000';
break;
case 2:
case 4:
color = 'green';
break;
case 3:
color = '#00aa00';
break;
default:
color = '#000000';
break;
}
} else if (piece.receiveStartTime > 0) {
if (piece.receiveByStable) {
color = 'blue';
} else {
color = 'orange';
}
} else if (piece.shareInRanges > 0) {
color = '#ffdddd'; // pink';
}
var dom = this.pieces[pieceIndex];
dom.innerHTML=piece.playedTime > 0 ? '*' : '&nbsp;';
dom.className="piece-units";
dom.style.backgroundColor=color;
dom.setAttribute("title",this.utils_.format('{0}/{1}/{2}, Share In Ranges: {3}', segment.id, piece.type == 0 ? 'tn' : 'pn',
piece.id, piece.shareInRanges));
}
}

while (pieceIndex < this.pieces.length) {
var dom = this.pieces[pieceIndex];
dom.innerHTML='';
dom.className="blank";
dom.style.backgroundColor="";
pieceIndex++;
}
},

updateSegments_ : function() {
for ( var id in this.segments) {
var item = this.segments[id];
item.__removeMarked = true;
}

var inPeusdoTime = true;
var displayCount = 0;
var segments = this.property.metaData.segments;
for ( var i = 0; segments && i < segments.length && displayCount < 5; i++) {
var info = segments[i];
if (info.id < this.property.urgentSegmentId) {
continue;
}
var dom = this.segments[info.id];
if (!dom) {
dom = document.createElement("tr");
dom.className="row";
dom.setAttribute("id","segment-item-"+info.id);
dom.innerHTML='<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
this.elements_.segments.appendChild(dom);
this.segments[info.id] = dom;
}
dom.__removeMarked = false;
// dom.css('background', info.completedSize >= info.size ? 'green' : '#000');
displayCount++;

var peusdoMark = '';
if (this.property.livePseudoPlayTime > 0) {
peusdoMark = inPeusdoTime ? ' *' : '';
if (info.startTime > this.property.livePseudoPlayTime * 1000) {
inPeusdoTime = false;
}
}

var doms = dom.getElementsByTagName("td");
doms[0].innerHTML=info.id; // + (info.id > 1000000 ? (' - ' + this.utils_.formatDate_('Y-m-d H:i:s', info.id * 1000))
// :
// ''));
doms[1].innerHTML=this.utils_.size(info.size || 0);
doms[2].innerHTML=(info.startTime > 86400000 ? this.utils_.formatDate_('Y-m-d H:i:s', info.startTime) : this.utils_.formatDuration_(info.startTime / 1000)) + peusdoMark;
doms[3].innerHTML=info.duration / 1000;
doms[4].innerHTML=info.size > 0 ? this.utils_.speed(info.size * 1000 / info.duration, true) : '-';
doms[5].innerHTML=(info.receiveSpeed > 0) ? this.utils_.speed(info.receiveSpeed, true) : '-';
doms[6].innerHTML=(info.lastReceiveTime && info.lastReceiveTime > 0) ? this.utils_.formatDate_('Y-m-d H:i:s', info.lastReceiveTime) : '-';
doms[7].innerHTML=(info.pendingPieceCount || 0) + ' / ' + info.completedPieceCount + ' / ' + info.pieceCount;
doms[8].innerHTML=Math.round(info.completedSize * 100 / info.size) + '%';
}

for ( var id in this.segments) {
var item = this.segments[id];
if (item.__removeMarked) {
item.remove();
delete this.segments[id];
}
}
},

updatePeers_ : function() {
for ( var id in this.peers) {
var item = this.peers[id];
item.__removeMarked = true;
}

var ipHelper = p2p$.com.tools.console.Index.ipHelper_;
var peerTypeCounts = {};
var allPeers = this.property.stablePeers ? this.property.stablePeers.concat(this.property.otherPeers || []) : [];
for ( var i = 0; i < allPeers.length; i++) {
var info = allPeers[i];
var dom = this.peers[info.remoteId];
if (!dom) {
dom = document.createElement("tr");
dom.className="row";
dom.setAttribute("id", "peer-item-"+info.remoteId);
dom.innerHTML='<td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>'
+ '<td></td> <td></td> <td></td> <td></td> <td></td> <td></td>';
this.elements_.peers.appendChild(dom);
this.peers[info.remoteId] = dom;
}
dom.__removeMarked = false;

peerTypeCounts[info.type] = (peerTypeCounts[info.type] || 0) + 1;

var fullPeerName = info.name || info.remoteType || '';
var displayPeerName = fullPeerName;
if (displayPeerName.length > 10 && displayPeerName.indexOf('/') > 0) {
var peerNames = displayPeerName.split('/');
if (peerNames[0].length > 10) {
peerNames[0] = peerNames[0].substr(0, 8) + '...';
}
displayPeerName = peerNames.join('/');
}

var doms = dom.getElementsByTagName("td");
var col = 0;
doms[col++].innerHTML=(displayPeerName);
doms[0].setAttribute('title', fullPeerName);
doms[col++].innerHTML=(info.type);
doms[col].setAttribute('title', info.remoteId + "\n" + info.selfRanges);
doms[col++].innerHTML=(info.type == 'cdn' ? ('QoS: ' + this.getQosFromUrl_(info.remoteId)) : info.remoteId.substr(0, 10) + "...");
doms[col++].innerHTML=(info.remoteAddress == "Unknown" ? (info.remoteId.substr(0, 16) + "...") : info.remoteAddress);
doms[col++].innerHTML=(ipHelper.getNameByIp_(info.remoteAddress, this.updatePeers_, this));
doms[col++].innerHTML=(info.lastReceiveSpeed > 0 ? this.utils_.speed(info.lastReceiveSpeed, true) : '-');
doms[col++].innerHTML=(this.utils_.formatDate_('Y-m-d H:i:s', info.lastReceiveTime));
doms[col++].innerHTML=(this.utils_.size(info.totalReceiveBytes || 0));
doms[col++].innerHTML=(info.totalReceivePieces);
doms[col++].innerHTML=(this.utils_.size(info.totalSendBytes || 0));
doms[col++].innerHTML=(info.totalSendPieces);
var totalMessages = info.totalSendRanges + info.totalReceiveRanges + info.totalSendRequests + info.totalReceiveRequests + info.totalSendResponses
+ info.totalReceiveResponses;
var messageTitle = this.utils_.format('Range: {0}/{1}, Request: {2}/{3}, Response: {4}/{5}', info.totalSendRanges,
info.totalReceiveRanges, info.totalSendRequests, info.totalReceiveRequests, info.totalSendResponses, info.totalReceiveResponses);
doms[col].setAttribute('title', messageTitle);
doms[col++].innerHTML=((info.pendingRequestCount || 0) + ' / ' + info.totalReceiveResponses + ' / ' + info.totalSendRequests + ' / ' + totalMessages);
doms[col].style.color=(info.totalChecksumErrors > 0 || info.totalInvalidErrors > 0) ? 'red' : 'green';
doms[col++].innerHTML=(info.totalChecksumErrors + ' / ' + info.totalInvalidErrors);
}

for ( var id in this.peers) {
var item = this.peers[id];
if (item.__removeMarked) {
item.remove();
delete this.peers[id];
}
}

var peerStatText = '';
for ( var orgType in peerTypeCounts) {
var type = (orgType || '').toLowerCase();
var count = peerTypeCounts[type];
var nodeCount = this.property.context[type + 'TotalNodeCount'];
if (peerStatText != '') {
peerStatText += ', ';
}
peerStatText += this.utils_.format('{0}: {1}/{2} 个', type, count, (nodeCount > 10000 || !nodeCount) ? '-' : nodeCount);
}
var doms = this.elements_.peers.getElementsByClassName('peer-type-stats');
doms[0].innerHTML=(peerStatText);
},

getQosFromUrl_ : function(url) {
if (!url) {
return '-';
}
var pos = url.indexOf('&qos=');
if (pos < 0) {
pos = url.indexOf('?qos=');
}
if (pos < 0) {
return '-';
}
var end = url.indexOf('&', pos + 5);
return url.substring(pos + 5, end);
},

getGslbErrorDetails_ : function(code, orgDetails) {
var details = {
'-1' : '等待中',
0 : '正常',
200 : 'HTTP 200',
302 : 'HTTP Moved',
400 : '无法计算出可用CDN节点',
403 : '禁止访问',
404 : '文件未找到',
413 : '直播流名称不存在',
414 : '用户所在国家不允许直播',
415 : '用户所在省份不允许直播',
416 : '请求的子平台ID不在保留平台,不允许直播',
417 : '请求被配置为黑名单,不允许在此平台播放',
418 : '请求参数不完整，缺少format,expect参数',
419 : '请求参参数不合法,非法参数:platid, splatid',
420 : '文件名错误, Base64解密到了错误的文件名',
421 : '盗链请求, 被屏蔽',
422 : '请求被服务器拒绝/屏蔽',
423 : '请求参数不完整, 缺少tm,key,mmsid参数',
424 : 'URL已过期',
425 : 'URL校验不通过, MD5错误',
426 : '请求参数不符合规范：format/expetct/platid/splatid',
427 : '会员/付费的 token 验证失败',
428 : 'LinkShell 防盗链时间过期',
429 : 'LinkShell 防盗链验证失败',
430 : '直播流在此平台不允许播放',
431 : 'Cookie验证错误',
432 : 'LinkShell防盗链验证,MAC被加入了黑名单'
};
return details[code] || orgDetails || '未知错误';
},

getVideoRateName_ : function(type) {
var vtypes = {
1 : 'flv_350',
2 : '3gp_320X240',
3 : 'flv_enp',
4 : 'chinafilm_350',
8 : 'flv_vip',
9 : 'mp4',
10 : 'flv_live',
11 : 'union_low',
12 : 'union_high',
13 : 'mp4_800',
16 : 'flv_1000',
17 : 'flv_1300',
18 : 'flv_720p',
19 : 'mp4_1080p',
20 : 'flv_1080p6m',
21 : 'mp4_350',
22 : 'mp4_1300',
23 : 'mp4_800_db',
24 : 'mp4_1300_db',
25 : 'mp4_720p_db',
26 : 'mp4_1080p6m_db',
27 : 'flv_yuanhua',
28 : 'mp4_yuanhua',
29 : 'flv_720p_3d',
30 : 'mp4_720p_3d',
31 : 'flv_1080p6m_3d',
32 : 'mp4_1080p6m_3d',
33 : 'flv_1080p_3d',
34 : 'mp4_1080p_3d',
35 : 'flv_1080p3m',
44 : 'flv_4k',
45 : 'flv_4k_265',
46 : 'flv_3m_3d',
47 : 'h265_flv_800',
48 : 'h265_flv_1300',
49 : 'h265_flv_720p',
50 : 'h265_flv_1080p',
51 : 'mp4_720p',
52 : 'mp4_1080p3m',
53 : 'mp4_1080p6m',
54 : 'mp4_4k',
55 : 'mp4_4k_15m',
57 : 'flv_180',
58 : 'mp4_180',
59 : 'mp4_4k_db',
68 : 'baseline_marlin',
69 : 'baseline_access',
70 : '180_marlin',
71 : '180_access',
72 : '350_marlin',
73 : '350_access',
74 : '800_marlin',
75 : '800_access',
76 : '1300_marlin',
77 : '1300_access',
78 : '720p_marlin',
79 : '720p_access',
80 : '1080p3m_marlin',
81 : '1080p3m_access',
82 : '1080p6m_marlin',
83 : '1080p6m_access',
84 : '1080p15m_marlin',
85 : '1080p15m_access',
86 : '4k_marlin',
87 : '4k_access',
88 : '4k15m_marlin',
89 : '4k15m_access',
90 : '4k30m_marlin',
91 : '4k30m_access',
92 : '800_db_marlin',
93 : '800_db_access',
94 : '1300_db_marlin',
95 : '1300_db_access',
96 : '720p_db_marlin',
97 : '720p_db_access',
98 : '1080p3m_db_marlin',
99 : '1080p3m_db_access',
100 : '1080p6m_db_marlin',
101 : '1080p6m_db_access',
102 : '1080p15m_db_marlin',
103 : '1080p15m_db_access',
104 : '4k_db_marlin',
105 : '4k_db_access',
106 : '4k15m_db_marlin',
107 : '4k15m_db_access',
108 : '4k30m_db_marlin',
109 : '4k30m_db_access',
110 : '720p_3d_marlin',
111 : '720p_3d_access',
112 : '1080p3m_3d_marlin',
113 : '1080p3m_3d_access',
114 : '1080p6m_3d_marlin',
115 : '1080p6m_3d_access',
116 : '1080p15m_3d_marlin',
117 : '1080p15m_3d_access',
118 : '4k_3d_marlin',
119 : '4k_3d_access',
120 : '4k15m_3d_marlin',
121 : '4k15m_3d_access',
122 : '4k30m_3d_marlin',
123 : '4k30m_3d_access',
124 : 'mp4_180_logo',
125 : 'mp4_350_logo',
126 : 'mp4_800_logo'
};
return vtypes[type] || '';
},

closeRemoteChannel_ : function() {
if (!confirm('停止后，播放器可能无法正常播放，确定关闭该频道吗？')) {
return;
}
this.videoStream_.requestPlayStop_(this.property.channelUrl);
}
});
p2p$.ns('com.tools.console');

p2p$.com.tools.console.Index = {

refreshTimer_ : 0,
refreshInterval_ : 1000,
refreshNowCount_ : 0,
refreshLimitCount_ : 300,
originalTitle_ : '',
ajaxId_ : 0,
ajaxStartTime_ : 0,
ajaxListStartTime_ : 0,
nextChannelIndex_ : 0,
paused_ : false,
statusData_ : null,
statusParams_ : {
segmentStartWithPlayer_ : 1
},
params_ : {},
channels_ : {},
networkElements_ : {},
lastNetworkStats_ : {},
logPipe_ : null,
speedTest_ : null,
supportLog_ : null,
ipHelper_ : null,
strings_ : null,
config_ : null,
tag_:"com::tools::console::Index",

start : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::start",this.tag_));
this.strings_ = p2p$.com.common.String;
this.config_ = p2p$.com.selector.Config;
this.params_ = {};
this.refreshLimitCount_ = 1000;
if(p2p$.com.webp2p){
this.videoStream_ = p2p$.com.webp2p.core.entrance.VideoStream;
this.videoStream_.init();
}
if (this.params_['limitrc']) {
this.refreshLimitCount_ = parseInt(this.params_['limitrc']);
}
var me = this;
document.getElementById("cde-online-status").onclick=function() {
me.onOnlineClick_();
};
this.startTimer_();
this.ipHelper_ = new p2p$.com.tools.console.IpHelper({});
//上传日志
// this.logPipe_ = new p2p$.com.webp2p.tools.console.logPipe_({});
// this.logPipe_.create();
// this.speedTest_ = new p2p$.com.webp2p.tools.console.speedTest_({});
// this.speedTest_.create();
// this.supportLog_ = new p2p$.com.webp2p.tools.console.supportLog_({});
// this.supportLog_.create();
//
// $('#cde-show-log-pipe').click(function()
// {
// me.switchlogPipe_();
// return false;
// });
//
// $('#cde-show-speed-test').click(function()
// {
// me.switchspeedTest_();
// return false;
// });
//
// $('#cde-report-support-log').click(function()
// {
// me.switchsupportLog_();
// return false;
// });
},

switchlogPipe_ : function() {
if (this.logPipe_.isVisible()) {
this.logPipe_.hide();
} else {
this.logPipe_.show();
}
},

switchspeedTest_ : function() {
if (this.speedTest_.isVisible()) {
this.speedTest_.hide();
} else {
this.speedTest_.show();
}
},

switchsupportLog_ : function() {
if (this.supportLog_.isVisible()) {
this.supportLog_.hide();
} else {
this.supportLog_.show();
}
},

startTimer_ : function() {
var me = this;
setTimeout(function() {
me.onTimer_();
}, 10);
this.refreshTimer_ = setInterval(function() {
me.onTimer_();
}, this.refreshInterval_);
},

stopTimer_ : function() {
if (this.refreshTimer_) {
clearInterval(this.refreshTimer_);
this.ajaxId_ = 0;
this.refreshTimer_ = 0;
}
this.refreshNowCount_ = 0;
},

onOnlineClick_ : function() {
if (this.refreshTimer_) {
this.stopTimer_();
} else {
this.startTimer_();
}
if (this.refreshTimer_) {
this.paused_ = false;
document.getElementById("cde-online-status").innerHTML="正在连接 ...";
document.getElementById("cde-online-status").style.color="red";
} else {
this.paused_ = true;
document.getElementById("cde-online-status").innerHTML="已暂停";
document.getElementById("cde-online-status").style.color="red";
}
},

onTimer_ : function() {
this.loadAjaxData_();
this.refreshNowCount_++;
if (this.refreshNowCount_ >= this.refreshLimitCount_) {
// auto pause
this.stopTimer_();
this.paused_ = true;
document.getElementById("cde-online-status").innerHTML="已自动暂停，点击继续刷新";
document.getElementById("cde-online-status").style.color="red";
}
},

loadAjaxData_ : function() {
var data = "";
if(this.videoStream_){
data = this.videoStream_.requestStateCurrent_(this.strings_.format("state/current?needCurrentProcess=1&segmentStartWithPlayer={0}&maxDuration=1500",this.statusParams_.segmentStartWithPlayer_));
this.onAjaxDataResult_(data);
}
document.getElementById("cde-online-status").innerHTML="已连接 - " + (this.refreshLimitCount_ - this.refreshNowCount_);
document.getElementById("cde-online-status").style.color="green";
},

onAjaxDataResult_ : function(data) {
this.statusData_ = typeof (data) == 'string' ? eval('(' + data + ')') : data;
document.getElementById('cde-module-version').innerHTML=this.statusData_.module.version + '/Build ' + this.statusData_.module.buildTime;
document.getElementById('cde-current-time').innerHTML=p2p$.com.utils.Utils.formatDate_('Y-m-d H:i:s', this.statusData_.system.currentTime * 1000);
// $('#cde-resolution-time').html(p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', Math.floor((this.statusData_.system.resolutionTime || 0) /
// 1000)));
// $('#cde-system-startup-time').html(this.statusData_.system.startupTime ? p2p$.com.utils.Utils.formatDate_('Y-m-d H:i:s',
// this.statusData_.system.startupTime * 1000)
// : '-');
// $('#cde-module-startup-time').html(this.statusData_.system.startupTime ? p2p$.com.utils.Utils.formatDate_('Y-m-d H:i:s',
// this.statusData_.system.moduleUpTime *
// 1000) : '-');

this.updateSystemStatus_(data, data.system);
// this.updateNetworkStatus_(data, data.system ? data.system.networks : null);
for ( var id in this.channels_) {
this.channels_[id].__removeMarked = true;
}
for ( var i = 0; data.channels && i < data.channels.length; i++) {
var itemData = data.channels[i];
var channel = this.channels_[itemData.id];
if (!channel) {
channel = new p2p$.com.tools.console.Channel(itemData, this.videoStream_);
channel.create(++this.nextChannelIndex_, document.getElementById("cde-channels-layer"));
this.channels_[itemData.id] = channel;
}
channel.__removeMarked = false;
channel.update(itemData);
}
for ( var id in this.channels_) {
var channel = this.channels_[id];
if (channel.__removeMarked) {
channel.destroy();
delete this.channels_[id];
}
}
},

updateSystemStatus_ : function(root, data) {
var offset = 0;
$dom = document.getElementById('cde-system-status-more-1');
var statChildren = $dom.getElementsByClassName("row");
var osStatusDom = statChildren[0];
var doms = osStatusDom.getElementsByClassName("value");
var utils = p2p$.com.utils.Utils;

if (data.cpu && data.memory) {
doms[offset + 0].innerHTML=((data.cpu.usagePercent || 0).toFixed(1) + '%');
doms[offset + 1].innerHTML=(data.cpu.coreCount);
doms[offset + 2].innerHTML=((data.memory.usagePercent || 0).toFixed(1) + '%');
doms[offset + 3].innerHTML=(utils.size(data.memory.totalBytes));
}
offset += 4;

if (data.memory && data.process) {
var processMemoryUsage = data.process.physicalMemorySize * 100 / data.memory.totalBytes;
doms[offset + 0].innerHTML=((data.process.usagePercent || 0).toFixed(1) + '%');
doms[offset + 1].innerHTML=(processMemoryUsage.toFixed(1) + '%');
doms[offset + 2].innerHTML=(utils.size(data.process.physicalMemorySize));
}
offset += 3;

if (data.storage && data.storage['default']) {
var defaultInfo = data.storage['default'];
var usagePercent = (defaultInfo.dataSize * 100 / defaultInfo.dataCapacity);
doms[offset + 0].innerHTML=(defaultInfo.name.substr(0, 1).toUpperCase());
doms[offset + 1].innerHTML=(usagePercent.toFixed(1) + '%');
doms[offset + 2].innerHTML=(utils.size(defaultInfo.dataSize));
doms[offset + 3].innerHTML=(utils.size(defaultInfo.dataCapacity));
}
offset += 4;

$dom = document.getElementById('cde-system-status-more-2');
var statChildren = $dom.getElementsByClassName("row");
//		var osStatusDom = $(statChildren[0]);
var doms = statChildren[0].getElementsByClassName("value");

offset = 0;
if (root.channels) {
doms[offset + 0].innerHTML=(root.channels.length);
// $(doms[offset + 1]).html(root.enviroment.hlsServerPort);
}
offset += 2;

if (root.enviroment) {
doms[offset + 0].innerHTML=(root.enviroment.clientGeo + "/" + root.enviroment.clientIp);
doms[offset + 1].innerHTML=(root.enviroment.deviceType);
doms[offset + 2].innerHTML=((root.enviroment.osType + '').toUpperCase());
doms[offset + 3].innerHTML=(this.getNetworkTypeName_(root.enviroment.networkType));
doms[offset + 4].innerHTML=(root.enviroment.p2pEnabled ? 'Yes' : 'No');
doms[offset + 5].innerHTML=(root.enviroment.externalAppId);
doms[offset + 6].innerHTML=(root.enviroment.externalAppVersion);
doms[offset + 7].innerHTML=(root.enviroment.externalAppChannel);
doms[offset + 8].innerHTML=(root.enviroment.externalAppPackageName || '-');
}
offset += 8;
},

getNetworkTypeName_ : function(type) {
switch (type) {
case 1:
return 'Ethernet';
case 2:
return 'Mobile';
case 3:
return 'Wifi';
case 4:
return 'Mobile 2G';
case 5:
return 'Mobile 3G';
case 6:
return 'Mobile 4G';
case 7:
return 'Mobile 5G';
default:
return 'UN';
}
}
};
p2p$.ns('com.tools.console');
p2p$.com.tools.console.IpHelper = JClass.extend_({

names_ : null,
pendingIps_ : null,
loader_:null,
ip_:null,
scope_:null,
callback_:null,
isload_:false,

init : function() {
this.names_ = {};
this.pendingIps_ = [];
},

getNameByIp_ : function(ip, callback, scope) {
if (ip.indexOf(':') >= 0) {
ip = ip.substr(0, ip.indexOf(':'));
}
if (ip.substr(0, 1) == '*') {
ip = ip.substr(1);
}
ip = p2p$.com.utils.Utils.trim(ip);
if (this.names_[ip]) {
return this.names_[ip];
}
this.queryIp_(ip,callback,scope);
return '...';
},

queryIp_ : function(ip,callback,scope) {
for (var i = 0; i < this.pendingIps_.length; i++) {
if (this.pendingIps_[i] == ip) {
return;
}
}
this.pendingIps_.push(ip);
this.callback_=callback;
this.scope_=scope;
this.queryNext_();
},

queryNext_ : function() {
if (this.pendingIps_.length == 0) {
return;
}
if(this.isload_)
{
return;
}
this.ip_ = this.pendingIps_[0];
this.pendingIps_.shift();
this.isload_=true;
loader_=new p2p$.com.loaders.HttpDownLoader({"url_":'http://g3.letv.cn/?format=1&ajax=1&uip=' + this.ip_ + '&random=' + Math.random(),"scope_":this,"type_":"jsonp","tag_":"ip"});
loader_.load_();
},
onHttpDownloadCompleted_:function()
{
var data=loader_.responseData_;
if (typeof (data) == 'string') {
try {
data = eval('(' + data + ')');
} catch (e) {
}
}
var name = (data.desc || '-');
var trimValues = '中国-';
if (name.substr(0, trimValues.length) == trimValues) {
name = name.substr(trimValues.length);
}
this.names_[this.ip_] = name;
this.isload_=false;
this.queryNext_();
if (this.callback_) {
this.callback_.call(this.scope_);
}
}
});
if(!document.getElementsByClassName)
{
document.getElementsByClassName=function(className)
{
var doms=document.getElementsByTagName("*");
var arr=[];
for(var i=0;i<doms.length;i++)
{
var allName = doms[i].className.split(' ');
for(var j=0;j<allName.length;j++) {
if(allName[j] == className) {
arr.push(doms[i]);
break;
}
}
}
return arr;
}
}
