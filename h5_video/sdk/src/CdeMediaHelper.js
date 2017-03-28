CdeMediaHelper = {
	initialized_ : false,
	initializeTime_ : -1,
	initializeTimeout_ : 500,
	supported_ : false,
	pendingCallbacks_ : null,
	specialTypePrefix_ : [ "nx4" ],
	specialType : [ "coolpad 9976t", "huawei g750-t20", "nx40x" ],
	init : function(params, callback) {
		if (this.initialized_) {
			if (callback) {
				if (this.initCompleted()) {
					callback.fn.apply(callback.scope, callback.params);
				} else {
					this.addPendingAction_(callback);
				}
			}
			return;
		}

		this.initialized_ = true;
		this.initializeTime_ = -1;

		params = params || {};
		var env = p2p$.com.webp2p.core.supernode.Enviroment;
		var logLevel = params.hasOwnProperty("logLevel") ? params["logLevel"] : -1;
		var logType = params.hasOwnProperty("logType") ? params["logType"] : 3;
		var logServer = "http://" + (params["logServer"] || "10.58.132.159:8000");
		p2p$.com.webp2p.core.common.Log.init(logLevel, logType, params["uploadLog"] ? logServer : null);
		env.initialize_();

		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaHelper::Initialize, external app id({0}), version({1}), build({2})", params.appId, env.moduleVersion_,
				p2p$.com.webp2p.core.common.Module.kBuildTime));

		if (params.appId || params.appId == 0) {
			env.externalAppId_ = params.appId;
			env.appId_ = parseInt(params.appId);
		}
		if (params.webrtcServer) {
			env.paramWebrtcServer_ = params.webrtcServer;
		}
		if (params.localVideo) {
			env.paramIsPlayWithlocalVideo_ = params.localVideo;
		}
		if (params.trackerServer) {
			env.paramTrackerServer_ = params.trackerServer;
		}
		if (params.stunServer) {
			env.paramStunServer_ = params.stunServer;
		}
		if (params.closeWebrtc) {
			env.paramCloseWebrtc_ = params.closeWebrtc;
		}
		if (params.closeWebsocket) {
			env.paramCloseWebsocket_ = params.closeWebsocket;
		}

		if (params.initializeTimeout) {
			this.initializeTimeout_ = Math.max(params.initializeTimeout, 100);
		}

		this.addPendingAction_(callback);
		if (!this.supportMedia()) {
			this.initComplete_(false, 0, "failed, not supportMedia");
			return;
		}
		// if (p2p$.com.webp2p.core.common.String.startsWith_(env.getOSType_(), "Win")) {
		// this.initComplete_(false, 0, "failed, not supported, test");
		// return;
		// }
		if (env.getOSType_() == "Android") {
			var deviceType = env.getDeviceType_();
			// for ( var i = 0; i < this.specialTypePrefix_.length; i++) {
			// if (p2p$.com.webp2p.core.common.String.startsWith_(deviceType, this.specialTypePrefix_[i])) {
			// this.initComplete_(false, 0, "failed, not specialTypePrefix:" + deviceType);
			// }
			// }
			// for ( var i = 0; i < this.specialType.length; i++) {
			// if (deviceType == this.specialType[i]) {
			// this.initComplete_(false, 0, "failed, not specialType:" + deviceType);
			// }
			// }
		}

		try {
			var me = this;
			var mediaTimer = null;
			var mediaSource = new MediaSource();
			var mediaPlayer = document.createElement("video");
			var startTime = new Date().getTime();
			mediaSource.addEventListener('sourceopen', function() {
				try {
					mediaPlayer.src = "";
					// mediaPlayer.stop();
				} catch (e) {
					// Ignore
				}
				if (!params.html5Video) {
					if (me.supportTs()) {
						me.initComplete_(false, 0, "failed, not supported, it's safari");
						return;
					}
				}
				var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
				if (!connection) {
					var osType = env.getOSType_();
					if (!(p2p$.com.webp2p.core.common.String.startsWith_(osType, "Win") || osType == "Mac")) {
						me.initComplete_(false, 0, "failed, not supported, it don't support checking network");
						return;
					}
				}
				me.initComplete_(true, Math.max(new Date().getTime() - startTime, 0), "ok");
				clearTimeout(mediaTimer);
				mediaTimer = null;
			});
			mediaPlayer.src = window.URL.createObjectURL(mediaSource);
			mediaPlayer.play();
			mediaTimer = setTimeout(function() {
				if (me.initializeTime_ >= 0) {
					return;
				}
				me.initComplete_(false, Math.max(new Date().getTime() - startTime, 0), "timeout");
			}, this.initializeTimeout_);
		} catch (e) {
			this.initComplete_(false, 0, "exception: " + e);
		}
	},

	callPendingActions_ : function() {
		if (this.pendingCallbacks_) {
			for ( var i = 0; i < this.pendingCallbacks_.length; i++) {
				var action = this.pendingCallbacks_[i];
				action.fn.apply(action.scope || this, action.params);
			}
			this.pendingCallbacks_ = null;
		}
	},

	addPendingAction_ : function(callback) {
		if (!callback) {
			return;
		}
		if (!this.pendingCallbacks_) {
			this.pendingCallbacks_ = [];
		}
		this.pendingCallbacks_.push(callback);
	},
	reportStageInfo : function() {
		var env = p2p$.com.webp2p.core.supernode.Enviroment;
		var report = new p2p$.com.webp2p.core.supernode.Url();
		report.protocol_ = "http";
		report.host_ = env.getHostDomain_("s.webp2p.letv.com");
		report.file_ = "/ClientStageInfo";
		report.params_.set("act", "0");
		report.params_.set("err", "1");
		report.params_.set("utime", CdeMediaHelper.initializeTime_ || 0);
		report.params_.set("type", "");
		report.params_.set("termid", "");
		report.params_.set("platid", "");
		report.params_.set("splatid", "");
		report.params_.set("vtype", "");
		report.params_.set("streamid", "");
		report.params_.set("ch", "");
		report.params_.set("p1", "");
		report.params_.set("p2", "");
		report.params_.set("p3", "");
		report.params_.set("uuid", "");
		report.params_.set("p2p", "0");
		report.params_.set("appid", env.externalAppId_);
		report.params_.set("cdeid", env.moduleId_);
		report.params_.set("package", env.externalAppPackageName_);

		var reportUrl = report.toString();
		this.http_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(reportUrl, this, "GET", "text", "collector::report");
		this.http_.load();
	},
	initComplete_ : function(supported, time, message) {

		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaHelper::MediaSource open {0}, used {1}ms", message, time));
		this.supported_ = supported;
		if (!this.supported_) {
			this.reportStageInfo();
		}
		this.initializeTime_ = time;
		if (this.pendingCallbacks_) {
			for ( var i = 0; i < this.pendingCallbacks_.length; i++) {
				var action = this.pendingCallbacks_[i];
				action.fn.apply(action.scope || this, action.params);
			}
			this.pendingCallbacks_ = null;
		}
	},

	initCompleted : function() {
		return this.initializeTime_ >= 0;
	},

	supportPlayer : function() {
		return this.supported_;
	},

	supportMedia : function() {
		var mediaType = p2p$.com.webp2p.core.supernode.Enviroment.getMediaType_();
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaHelper::MediaSource supportMedia mediasource:{0}, ts:{1}, mp4:{2}", mediaType.mediasource, mediaType.ts,
				mediaType.mp4));
		return mediaType.mediasource && (mediaType.ts || mediaType.mp4);
	},

	supportMediaSource : function() {
		var mediaType = p2p$.com.webp2p.core.supernode.Enviroment.getMediaType_();
		return mediaType.mediasource;
	},

	supportTs : function() {
		var mediaType = p2p$.com.webp2p.core.supernode.Enviroment.getMediaType_();
		return mediaType.ts;
	},

	supportMp4 : function() {
		var mediaType = p2p$.com.webp2p.core.supernode.Enviroment.getMediaType_();
		return mediaType.mp4;
	},

	parseUrl : function(url) {
		var parsed = new p2p$.com.webp2p.core.supernode.Url();
		parsed.fromString_(url);
		return parsed;
	},

	submitSupportLog : function(params, callback) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaHelper .. submitSupportLog...({0}),({1})", params.contact || "", params.remarks || ""));
		p2p$.com.webp2p.tools.collector.SupportSession.open(params, callback);
	},

	showConsole : function(el) {
		p2p$.com.webp2p.tools.console.Index.start();
	},
	getEnviromentProperty_ : function(result, env) {

		result["p2pEnabled"] = env.p2pEnabled_;
		result["p2pUploadEnabled"] = env.p2pUploadEnabled_;
		result["networkType"] = env.networkType_;
		result["externalAppId"] = env.externalAppId_;
		result["moduleVersion"] = env.moduleVersion_;
		result["buildTime"] = p2p$.com.webp2p.core.common.Module.kBuildTime;
		result["moduleId"] = env.moduleId_;
		result["clientGeo"] = env.clientGeo_;
		result["clientGeoName"] = env.clientGeoName_;
		result["clientIp"] = env.clientIp_;
		result["deviceType"] = env.deviceType_;
		result["osType"] = env.osType_;

		// control params
		result["protocolCdnDisabled"] = env.protocolCdnDisabled_;
		result["protocolRtmfpDisabled"] = env.protocolRtmfpDisabled_;
		result["protocolWebsocketDisabled"] = env.protocolWebsocketDisabled_;
		result["protocolWebrtcDisabled"] = env.protocolWebrtcDisabled_;
	},
	getCDELog : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaHelper::getCDELog..."));
		var formatLog = "";
		var result = {};
		var env = p2p$.com.webp2p.core.supernode.Enviroment;
		try {
			result["enviroment"] = {};
			this.getEnviromentProperty_(result["enviroment"], env);
			var enviroment = JSON.stringify(result.enviroment);
			formatLog += enviroment + "\r\n";

			result = p2p$.com.webp2p.core.common.Log.logPipe_.require(0, 0, 255, "", 10000, 0, true);
			for ( var i = 0; i < result.records.length; i++) {
				var record = result.records[i];
				formatLog += "[" + p2p$.com.webp2p.core.common.Global.getCurentTime_(record.localTime / 1000000) + " - " + record.level + "]" + record.content
						+ "\r\n";
			}
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("CdeMediaHelper::getCDELog failed: {0}", (e || "").toString()));
		}

		return formatLog;
	}
};