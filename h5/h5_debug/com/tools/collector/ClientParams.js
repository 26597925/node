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
