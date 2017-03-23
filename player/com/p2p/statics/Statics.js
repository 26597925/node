/**
 * 统计，广播，发送接口
 */
h5$.nameSpace("com.p2p.statics");
h5$.com.p2p.statics.Statics = {
	initData:null,
	config:null,
	processReport:null,
	
	p2pSize:0,
	cdnSize:0,
	shareSize:0,
	/**按groupID生成的统计单元列表*/
	staticsElementList:{},
	tempStaticsElement:null,
	connectPeerSuccess:false,
	
	P2PDownloadPieceNum:0,
	CDNDownloadPieceNum:0,
	P2PSharePieceNum:0,
	chk0:0,//心跳周期内校验通过 piece 的数量
	chk1:0,//心跳周期内未知下载来源的 piece 校验失败数
	chk2:0,//心跳周期内 CDN 下载的 piece 校验失败数
	chk3:0,//rtmfp
	chk4:0,//utp
	chk5:0,//心跳周期内 CDE P2P 下载的 piece 校验失败数
	
	//发送给页面的数据
	sendToJs:function(value)
	{
		if(!this.initData)
		{
			this.initData = h5$.com.p2p.vo.InitData;
		}
		if(this.initData.callback)
		{
			this.initData.callback(value);
		}
	},
	peerInfo:function(obj,snodes,tnodes,gid,type)
	{
		var info = {};
		info.code = "P2P.Peer.Nodes";
		info.info = {type:type,"data":obj};
		this.sendToJs(info);
		if(type=="cdn") return;
		this.tempStaticsElement = this.staticsElementList[gid];
		if(this.tempStaticsElement)
		{
			this.tempStaticsElement.getNeighbor(snodes,tnodes);
		}
	},
	httpGetData:function(id,begin,end,size,gID)
	{
		this.tempStaticsElement = this.staticsElementList[gID];
		if( this.tempStaticsElement )
		{
			this.tempStaticsElement.httpGetData(id,begin,end,size);
		}
		this.CDNDownloadPieceNum++;
	},
	P2PGetData:function(id,begin,end,size,peerID,gID,clientType,protocol)
	{
		this.tempStaticsElement = this.staticsElementList[gID];
		if(this.tempStaticsElement )
		{
			this.tempStaticsElement.P2PGetData(id,begin,end,size,peerID,clientType,protocol);
		}
		this.P2PDownloadPieceNum++;
	},
	P2PRepeatLoad:function()
	{
		
	},
	deleteP2P:function(gID)
	{
		
	},
	createP2P:function(gID)
	{
		console.log("-->creatStatisticByGroupID--",gID);
		if(!this.config){
			this.config = h5$.com.p2p.vo.Config;
		}
		if(!this.initData){
			this.initData = h5$.com.p2p.vo.InitData;
		}
		var _params = {groupID:gID,statics:this,initData:this.initData,config:this.config};
		if(!this.processReport)
		{
			this.processReport = new h5$.com.p2p.statics.ProcessReport(_params);
			this.processReport.init();
		}
		_params = {groupID:gID,statics:this,processReport:this.processReport,config:this.config};
		if( !this.staticsElementList[gID] )
		{
			this.staticsElementList[gID] = new h5$.com.p2p.statics.StaticsElement(_params);
			this.staticsElementList[gID].start();
			this.loadXMLSuccess(gID);
		}
	},
	gatherStart:function(value)
	{
//		console.log("static:",value);
	},
	gatherSuccess:function(value)
	{
		console.log("-->gatherSuccess");
		this.tempStaticsElement = this.staticsElementList[value.groupID];
		if( this.tempStaticsElement )
		{
			this.tempStaticsElement.gatherSuccess(value.gatherName,value.gatherPort);
		}
	},
	selectorSuccess:function(gID)
	{
		console.log("-->selectorSuccess");
		this.tempStaticsElement = this.staticsElementList[gID];
		if( this.tempStaticsElement )
		{
			this.tempStaticsElement.selectorSuccess();
		}
	},
	checkSumFailed:function(value)
	{
		var info = {};
		info.code = "P2P.Info.Debug";
		info.info = value;
		this.sendToJs(info);
	},
	addSize:function(value)
	{
		var size = value.size;
		var type = value.type;
		switch(type)
		{
			case 'cdn':
			case 'http':
				this.cdnSize+=Number(size);
				break;
			case 'share':
				this.shareSize+=Number(size);
				break;
			default:
				this.p2pSize+=Number(size);
				break;
		}
	},
	loadXMLSuccess:function(groupid)
	{
		console.log("-->loadXMLSuccess--",groupid);
		this.tempStatisticsElement = this.staticsElementList[groupid];
		if( this.tempStatisticsElement )
		{
			this.tempStatisticsElement.loadXMLSuccess();
		}
	}
};