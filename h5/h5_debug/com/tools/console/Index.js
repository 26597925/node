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
