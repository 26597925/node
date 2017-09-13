p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.Pool = JClass.extend_({
	valid_ : false,
	p2pActive_ : false,
	enviroment_ : null,
	context_ : null,
	metaData_ : null,
	http_ : null,
	// service_:null,
	timer_ : null,
	eventListener_ : null,
	managers_ : null,
	strings_:null,

	selectorRedirectTimes_ : 0,
	selectorTryTimes_ : 0,
	selectorSuccessTime_ : 0,
	selectorRedirectNeeded_ : false,
	selectorRedirectHost_ : "",
	selectorResponseResult_ : "",
	tag_:"com::webp2p::protocol::base::Pool",

	init : function(enviroment, context, metaData, baseChannel) {
		this.enviroment_ = enviroment;
		this.context_ = context;
		this.metaData_ = metaData;
		this.eventListener_ = baseChannel;
		this.strings_ = p2p$.com.common.String;
		this.managers_ = [];
		this.http_ = null;
		this.valid_ = false;
		this.context_.webrtcServerHost_ = "ws://123.125.89.103:3852";
		this.context_.gatherServerHost_ = "111.206.208.61:80";
		this.context_.stunServerHost_ = "stun:111.206.210.145:8124";
		//检查webrtc是否可用
		if(!window.RTCPeerConnection)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init webrtc can not use in this broswer",this.tag_));
			this.enviroment_.protocolWebrtcDisabled_=true;
		}
	},

	initialize_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::initialuze_ pool for type({1}), channel({2})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.metaData_.type_),this.metaData_.storageId_));
		this.exit();
		this.valid_ = true;
		//创建cdn管理
		var newManager = new p2p$.com.webp2p.protocol.cdn.Manager(this, this.eventListener_);
		newManager.open();
		this.managers_.push(newManager);
		//加载selector
		this.queryFromSelector_();
	},
	/*selector*/
    queryFromSelector_ : function() {
        if (!this.metaData_.p2pGroupId_) {
            return;
        }
        if (this.http_ != null) {
            this.http_.log("cancel");
            this.http_.close();
            this.http_ = null;
        }
        var hostDomain = this.enviroment_.getHostDomain_("selector.webp2p.letv.com");
        var localMacAddress = this.strings_.urlEncodeNonAscii_(this.enviroment_.getLocalMacAddresses_());
        var hardwareType = this.strings_.urlEncodeNonAscii_(this.enviroment_.deviceType_);
        var requestUrl = this.strings_.format("http://{0}/query?streamid={1}&type={2}&module=cde&version={3}&geo={4}&isp={5}&country={6}&province={7}&city={8}&area={9}&appid={10}&mac={11}&hwtype={12}"
            ,this.selectorRedirectNeeded_ ? this.selectorRedirectHost_ : hostDomain
			,this.metaData_.p2pGroupId_
			,p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeWebRTC + p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeHttpTracker + p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeStunServer
			,this.context_.moduleVersion_
			,this.context_.geo_
			,this.context_.isp_
			,this.context_.country_
			,this.context_.province_
			,this.context_.city_
			,this.context_.area_
			,this.enviroment_.appId_
			,localMacAddress
			,hardwareType);
        this.selectorRedirectNeeded_ = false;
        this.http_ = new p2p$.com.loaders.HttpDownLoader({url_:requestUrl, scope_:this,type_:"json", tag_:"base::selector"});
        this.http_.load_();
        this.setSelectorTimeout_(10 * 1000);
    },
	//selector加载结束
	onHttpDownloadCompleted_ : function(downloader) {
    		var myFunName = this.strings_.getFunName(arguments.callee.toString());
			var handled = false;
			if (this.http_ != downloader) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} Expired http complete for tag({2}), channel({3}), ignore",this.tag_,myFunName,this.http_.tag_,this.metaData_.storageId_));
				return handled;
			}

			this.http_ = null;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} tag({2}), channel({3}), response code({4}),size({5})",this.tag_,myFunName,downloader.tag_, this.metaData_.storageId_, downloader.responseCode_,downloader.responseData_.length));
			if (downloader.tag_ == "base::selector") {
				handled = true;
				if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
					return handled;
				}
				// parse selector response
				if (!this.parseSelectorResponse_(downloader)) {
					// waiting for timeout and retry ...
					return handled;
				} else if (this.selectorRedirectNeeded_) {
					this.selectorRedirectTimes_++;
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} Selector redirect to({2}), total {3} redirect times ...",this.tag_,myFunName,this.selectorRedirectHost_,this.selectorRedirectTimes_));
					if (this.selectorRedirectTimes_ > 3) {
						// too much redirect, waiting for timeout and retry ...
						this.selectorRedirectNeeded_ = false;
						this.selectorRedirectTimes_ = 0;
					} else {
						this.removeSelectorTimer_();
						this.queryFromSelector_();
					}
					return handled;
				}
				this.removeSelectorTimer_();

				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} Query from selector successfully, gather(http://{2}), webrtc({3}), tracker(http://{4}),stun({5}),max peers({6}), urgent size({7}), channel({8}),rtmfp({9}), websocket({10}), webrtc({11}), upload({12}), urgent upload({13}), range interval({14} s), upload limit({15}), init throttle({16} B/s), avg throttle({17} B/s), max reserved({18} B/s)"
					,this.tag_
					,myFunName
					,this.context_.gatherServerHost_
					,this.context_.webrtcServerHost_
					,this.context_.trackerServerHost_
					,this.context_.stunServerHost_
					,this.context_.p2pMaxPeers_
					,this.context_.p2pUrgentSize_
					,this.metaData_.storageId_
					,this.context_.protocolRtmfpDisabled_ ? "no" : "yes"
					,this.context_.protocolWebsocketDisabled_ ? "no" : "yes"
					,this.context_.protocolWebrtcDisabled_ ? "no" : "yes"
					,this.context_.p2pUploadEnabled_ ? "yes" : "no"
					,this.context_.p2pUrgentUploadEnabled_ ? "yes" : "no"
					,this.context_.p2pShareRangeInterval_
					,this.context_.p2pUploadLimit_ ? "yes" : "no"
					,this.context_.p2pUploadThrottleInit_
					,this.context_.p2pUploadThrottleAverage_
					,this.context_.p2pUploadMaxReserved_));

				this.selectorSuccessTime_ = p2p$.com.common.Global.getMilliTime_();
				this.context_.selectorServerHost_ = downloader.remoteEndpoint_;
				this.context_.selectorConnectedTime_ = downloader.totalUsedTime_;
				this.eventListener_.onProtocolSelectorOpen_(p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess);
				this.createOtherProtocols_();
			}

			return handled;
	},
	//分析
	parseSelectorResponse_ : function(downloader) {
        var myFunName = this.strings_.getFunName(arguments.callee.toString());
		var result = downloader.responseData_;
		if (result == "" || result == null) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} Parse selector response data failed: channel({2})"
				,this.tag_
				,myFunName
				,this.metaData_.storageId_));
			return false;
		}
		this.selectorResponseResult_ = result["status"];
		if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == this.selectorResponseResult_) {
			this.context_.configData_ = result;
			var value = this.context_.configData_;
			var items = value.items;
			for ( var n = 0; n < items.length; n++) {
				var item = items[n];
				if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeWebRTC) {
					var rets = item.serviceUrls.split(",");
					if (rets && rets.length > 1) {
						if (!this.context_.hasDefaultWebrtcServer_) {
							this.context_.webrtcServerHost_ = rets[1];
						}
					}

				}
				if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeHttpTracker) {
					var rets = item.serviceUrls.split("//");
					if (rets && rets.length > 1) {
						if (!this.context_.hasDefaultTrackerServer_) {
							this.context_.gatherServerHost_ = rets[1];
						}
					}
				}
				if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeStunServer) {
					if (!this.context_.hasDefaultStunServer_) {
						this.context_.stunServerHost_ =  item.serviceUrls;
					}
				}

			}
			// var value = JSON.stringify(this.context_.configData_);

			this.context_.trackerServerHost_ = value.hasOwnProperty("trackerId") ? value["trackerId"] : this.context_.gatherServerHost_;
			this.context_.p2pMaxPeers_ = Math.max(value["maxPeers"], 1);
			this.context_.p2pUrgentSize_ = Math.max(value["urgentSize"], 1);
			if (value.hasOwnProperty("p2pUploadEnabled")) {
				this.context_.p2pUploadEnabled_ = value["p2pUploadEnabled"];
			}
			// enviroment_.p2pUploadEnabled_ = this.context_.p2pUploadEnabled_ = false;
			if (value.hasOwnProperty("p2pUploadLimit")) {
				this.context_.p2pUploadLimit_ = value["p2pUploadLimit"];
			}
			if (value.hasOwnProperty("p2pUploadThrottleInit")) {
				this.context_.p2pUploadThrottleInit_ = value["p2pUploadThrottleInit"];
			}
			if (value.hasOwnProperty("p2pUploadThrottleAverage")) {
				this.context_.p2pUploadThrottleAverage_ = value["p2pUploadThrottleAverage"];
			}
			if (value.hasOwnProperty("p2pUploadMaxReserved")) {
				this.context_.p2pUploadMaxReserved_ = value["p2pUploadMaxReserved"];
			}
			if (value.hasOwnProperty("p2pUrgentUploadEnabled")) {
				this.context_.p2pUrgentUploadEnabled_ = value["p2pUrgentUploadEnabled"];// /
			}
			if (value.hasOwnProperty("p2pShareRangeInterval")) {
				this.context_.p2pShareRangeInterval_ = Math.max(value["p2pShareRangeInterval_"], 2);// /
			}
			if (value.hasOwnProperty("p2pMaxParallelRequestPieces")) {
				this.context_.p2pMaxParallelRequestPieces_ = value["p2pMaxParallelRequestPieces"];// /
			}
			if (value.hasOwnProperty("p2pMaxUrgentRequestPieces")) {
				this.context_.p2pMaxUrgentRequestPieces_ = value["p2pMaxUrgentRequestPieces"];// /
			}
			if (value.hasOwnProperty("fetchRate")) {
				this.context_.p2pFetchRate_ = value["fetchRate"];
			}
			if (value.hasOwnProperty("cdnSlowThresholdRate")) {
				this.context_.cdnSlowThresholdRate_ = value["cdnSlowThresholdRate"];//
			}
			if (value.hasOwnProperty("hbInterval")) {
				this.context_.p2pHeartbeatInterval_ = Math.max(2, value["hbInterval"]);
			}
			if (value["statReportInterval"] > 0) {
				this.context_.statReportInterval_ = value["statReportInterval"];//
			}
			if (value["livePlayOffset"] > 0) {
				this.enviroment_.livePlayOffset_ = value["livePlayOffset"];//
			}
			if (value.hasOwnProperty("protocols")) {
				var specificProtocols = value["protocols"];
				// this.context_.protocolCdnDisabled_ = specificProtocols["cdn"]["disabled"];
				this.context_.protocolRtmfpDisabled_ = specificProtocols["rtmfp"]["disabled"];
				this.context_.protocolWebsocketDisabled_ = specificProtocols["websocket"]["disabled"];
				this.context_.protocolWebrtcDisabled_ = specificProtocols["webrtc"]["disabled"];
			}

			return true;
		} else {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} Selector response error:{2}, channel({3})"
				,this.tag_
				,myFunName
				,this.selectorResponseResult_,
				this.metaData_.storageId_));
			this.removeSelectorTimer_();
			// this.onSelectorTimeout_();
			return false;
		}
	},

	setSelectorTimeout_ : function(timeoutMs) {
		var me = this;
		this.timer_ = setTimeout(function() {
			me.onSelectorTimeout_();
		}, timeoutMs);
	},

	removeSelectorTimer_ : function() {
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
	},

	onSelectorTimeout_ : function(errorCode) {
		if (!this.valid_) {
			return;
		}

		if (this.http_ != null) {
			this.http_.log("timeout");
			this.http_.close();
			this.http_ = null;
		}
		this.selectorTryTimes_++;
        var myFunName = this.strings_.getFunName(arguments.callee.toString());
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} Selector timeout for channel({2}), {3} try times..."
			,this.tag_
			,myFunName
			,this.metaData_.storageId_
			,this.selectorTryTimes_));
		this.queryFromSelector_();
		// this.selectorSuccessTime_ = 1;
		// this.createOtherProtocols_();
	},

	createOtherProtocols_ : function() {
		// p2p not support under mobile network
        var myFunName = this.strings_.getFunName(arguments.callee.toString());
		var isMobileNow = this.enviroment_.isMobileNetwork_();
		if (this.metaData_.p2pGroupId_ == "" || this.p2pActive_ || this.selectorSuccessTime_ <= 0 || isMobileNow) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} p2pGroupId_({2}),p2pActive({3}), selectorSuccessTime_({4}),isMobileNow({5})"
				,this.tag_
				,myFunName
				,this.metaData_.p2pGroupId_
				,this.p2pActive_
				,this.selectorSuccessTime_
				,isMobileNow));
			return true;
		}
		if (!this.context_.protocolWebrtcDisabled_ && !this.enviroment_.protocolWebrtcDisabled_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} p2pGroupId_({2})"
				,this.tag_
				,myFunName
				,this.metaData_.p2pGroupId_));
			var newManager = new p2p$.com.webp2p.protocol.webrtc.Manager(this, this.eventListener_);
			newManager.open();
			newManager.setMaxActiveSession_(this.context_.p2pMaxPeers_);
			this.managers_.push(newManager);
		}

		// this.context_.protocolWebsocketDisabled_ = true;
		if (!this.context_.protocolWebsocketDisabled_ && !this.enviroment_.protocolWebsocketDisabled_) {
			var newManager = new p2p$.com.webp2p.protocol.websocket.Manager(this, this.eventListener_);
			newManager.open();
			newManager.setMaxActiveSession_(this.context_.p2pMaxPeers_);
			this.managers_.push(newManager);
		}
		this.p2pActive_ = true;
		return true;
	},
    refreshStable_ : function() {
    },

    p2pGroupIdChange_ : function() {
    },

    p2pActivate_ : function() {
        if (this.p2pActive_) {
            return true;
        }
        return this.createOtherProtocols_();
    },

    p2pDeactive_ : function() {
        if (!this.p2pActive_) {
            return true;
        }

        // close all p2p managers
        for ( var n = 0; n < this.managers_.length; n++) {
            var mgr = this.managers_[n];
            if (mgr.isStable_()) {
                continue;
            }
            mgr.close();
        }
        this.managers_ = [];
        this.context_.rtmfpServerConnectedTime_ = 0;
        this.context_.webrtcServerConnectedTime_ = 0;
        this.context_.trackerServerConnectedTime_ = 0;
        this.p2pActive_ = false;
        return true;
    },

    p2pisActive_ : function() {
        return this.p2pActive_;
    },

    p2pIsReady_ : function() {
        return this.selectorSuccessTime_ > 0;
    },

    isValid_ : function() {
        return this.valid_;
    },

    getContext_ : function() {
        return this.context_;
    },

    getEnviroment_ : function() {
        return this.enviroment_;
    },

    getMetaData_ : function() {
        return this.metaData_;
    },

    getManagers_ : function() {
        return this.managers_;
    },

    exit : function() {
        this.valid_ = false;
        if (this.timer_) {
            clearTimeout(this.timer_);
            this.timer_ = null;
        }
        if (this.http_ != null) {
            this.http_.log("cancel");
            this.http_ = null;
        }
        this.p2pActive_ = false;
        this.selectorSuccessTime_ = 0;
        for ( var n = 0; n < this.managers_.length; n++) {
            var mgr = this.managers_[n];
            mgr.close();
        }
        this.managers_ = [];
        return true;
    }
});
