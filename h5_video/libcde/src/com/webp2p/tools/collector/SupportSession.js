p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.SupportSession = {

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

	init : function() {
		if (this.initialized_) {
			return;
		}
		this.initialized_ = true;

		var env = p2p$.com.webp2p.core.supernode.Enviroment;
		this.serverUrl_ = "ws://" + env.getHostDomain_("log.cde.letv.com") + this.serverPath_;
		this.callbackParams_ = new p2p$.com.webp2p.core.common.Map();
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
		p2p$.com.webp2p.core.utils.Utils.apply(this.requestParams_, params || {});

		if (this.client_) {
			var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
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
		P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::SupportSession::Redirect {0} times to open({1}) ...", this.redirectTimes_, redirectUrl));
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
			P2P_ULOG_ERROR(P2P_ULOG_FMT("tools::collector::SupportSession::Open websocket failed: {0}", (e || '').toString()));
			this.serverErrorCode_ = p2p$.com.webp2p.core.common.ERROR_CODE.kErrorAccessDenied;
			this.applyCallbacks_();
			return;
		}
		this.sessionActiveTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

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
		P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::SupportSession::Socket client open ok"));
		if (!this.client_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::SupportSession::Socket client opened bu session closed"));
			return;
		}

		var env = p2p$.com.webp2p.core.supernode.Enviroment;
		this.sessionActiveTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

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

		this.sessionActiveTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		message = this.decodeMessage_(message);
		if (!message) {
			__ULOG_ERROR(P2P_ULOG_FMT("tools::collector::SupportSession", "Decode socket message failed, size({0})"), size);
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

			P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::SupportSession::Create socket session responsed, code({0}), redirect({1}), session id({2}), "
					+ "server time({3}), expire time({4}), interval({5} sec)", this.serverErrorCode_, this.redirectServer_, this.sessionId_,
					p2p$.com.webp2p.core.common.String.formatTime_(this.sessionServerTime_ * 1000, "yyyy-M-d h:m:s"), p2p$.com.webp2p.core.common.String
							.formatTime_(this.sessionExpireTime_ * 1000, "yyyy-M-d h:m:s"), this.reportInterval_));

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
			P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::SupportSession::Socket message action({0}) not support yet", action));
			return;
		}

		if (this.sessionExpireTime_ < this.sessionServerTime_) {
			this.setTimer_(this.kTimerTypeClose);
			P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::SupportSession::Session expired, close from action({0})", action));
		}
	},

	onWebSocketClose_ : function() {
		if (!this.client_) {
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::SupportSession::Socket client closed"));

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
			var totalLogCount = p2p$.com.webp2p.core.common.Log.logPipe_.records_.length;
			var timeLeft = this.sessionExpireTime_ - this.sessionServerTime_;
			console.log("CDE: Support submit " + this.totalSubmitTimes_ + " times, " + submitObject.logs.length + "/" + totalLogCount + " logs, "
					+ submitData.length + "/" + submitLength + "/" + messageData.size + " bytes, " + timeLeft + "s left ...");
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
			P2P_ULOG_ERROR(P2P_ULOG_FMT("tools::collector::SupportSession::Decode message failed, json invalid: {0}", paramsData));
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
	}
};