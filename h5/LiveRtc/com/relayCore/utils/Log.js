rc$.ns("com.relayCore.utils");
rc$.com.relayCore.utils.LOG_LEVEL = {
	kLogLevelNone : 0x00,
	kLogLevelTrace : 0x01,
	kLogLevelInfo : 0x02,
	kLogLevelWarning : 0x04,
	kLogLevelError : 0x08,
	kLogLevelFatal : 0x10,
	kLogLevelAll : 0xff,
};
rc$.com.relayCore.utils.LOG_TYPE = {
	kLogTypeNone : 0x00,
	kLogTypeConsole : 0x01,
	kLogTypeMemory : 0x02
};
rc$.com.relayCore.utils.LOG_OUTPUT = {
	// mode
	kLogTypeNone : 0x00,
	kLogTypeStdout : 0x01,
	kLogTypeStderr : 0x02,
	kLogTypeFile : 0x04,
	kLogTypeCustom : 0x08,
	kLogTypeAll : 0xff,

	// count
	kLogTypeIdxStdout : 0,
	kLogTypeIdxStderr : 1,
	kLogTypeIdxFileOut : 2,
	kLogTypeIdxFileErr : 3,
	kLogTypeIdxCustom : 4,
	kLogTypeCount : 5
};
rc$.com.relayCore.utils.Log = {
	autoAddTime_ : false,
	autoAddThreadId_ : false,
	autoAddNewLine_ : false,
	milliSecondTime_ : false,
	multiOutput_ : false,
	type_ : 0,
	level_ : 0,
	timeCapacity_ : 0,
	sizeCapacity_ : 0,

	size_ : 0,
	traceSize_ : 0,
	beginTime_ : 0,
	traceBeginTime_ : 0,

	tagName_ : "",
	logPipe_ : null,
	logType_ : 0,
	init : function(_level, _type, _logServer) {
		var levels_ = rc$.com.relayCore.utils.LOG_LEVEL;
		this.logType_ = _type | 2;
		this.level_ = _level >= 0 ? _level : (levels_.kLogLevelInfo | levels_.kLogLevelWarning | levels_.kLogLevelError);
//		this.logPipe_ = new rc$.com.relayCore.utils.LogPipDefault(_logServer);
	},

	trace : function(_logTime, _fmt) {
		var mylevel_ = rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelTrace;
		
		if ((this.level_ & mylevel_) == rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelNone) {
			return;
		}
		var mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeConsole;
		if ((this.logType_ & mylogType_) == mylogType_) {
			try {
				console.log("RTC: [" + _logTime + " - TRC]", _fmt);
			} catch (e) {
			}
		}
		mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeMemory;
		if ((this.logType_ & mylogType_) == mylogType_) {
			if (this.logPipe_) {
				this.logPipe_.addRecord_(mylevel_, "TRC", _fmt);
			}
		}
	},

	info : function(_logTime, _fmt) {
		var mylevel_ = rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelInfo;
		if ((this.level_ & mylevel_) == rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelNone) {
			return;
		}
		var mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeConsole;
		if ((this.logType_ & mylogType_) == mylogType_) {
			try {
				console.info("RTC: [" + _logTime + " - INF]", _fmt);
			} catch (e) {
			}
		}
		mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeMemory;
		if ((this.logType_ & mylogType_) == mylogType_) {
			if (this.logPipe_) {
				this.logPipe_.addRecord_(mylevel_, "INF", _fmt);
			}
		}
	},

	warning : function(_logTime, _fmt) {
		var mylevel_ = rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelWarning;
		if ((this.level_ & mylevel_) == rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelNone) {
			return;
		}
		var mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeConsole;
		if ((this.logType_ & mylogType_) == mylogType_) {
			try {
				console.warn("RTC: [" + _logTime + " - WRN]", _fmt);
			} catch (e) {
			}
		}
		mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeMemory;
		if ((this.logType_ & mylogType_) == mylogType_) {
			if (this.logPipe_) {
				this.logPipe_.addRecord_(mylevel_, "WRN", _fmt);
			}
		}
	},

	error : function(_logTime, _fmt) {
		var mylevel_ = rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelError;
		if ((this.level_ & mylevel_) == rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelNone) {
			return;
		}
		var mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeConsole;
		if ((this.logType_ & mylogType_) == mylogType_) {
			try {
				// console.error.apply(console, arguments__);
				console.error("RTC: [" + _logTime + " - ERR]", _fmt);
			} catch (e) {
			}
		}
		mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeMemory;
		if ((this.logType_ & mylogType_) == mylogType_) {
			if (this.logPipe_) {
				this.logPipe_.addRecord_(mylevel_, "ERR", _fmt);
			}
		}
	}
};

function P2P_ULOG_TRACE() {
	var mylogTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
	// rc$.com.relayCore.webp2p.core.common.Log.trace.apply(this, arguments);
	for ( var i = 0; i < arguments.length; i++) {
		rc$.com.relayCore.utils.Log.trace(mylogTime_, arguments[i]);
	}
	// rc$.com.relayCore.webp2p.core.common.Log.trace(fmt);
};

function P2P_ULOG_INFO() {
	var mylogTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
	for ( var i = 0; i < arguments.length; i++) {
		rc$.com.relayCore.utils.Log.info(mylogTime_, arguments[i]);
	}
};

function P2P_ULOG_WARNING() {
	var mylogTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
	for ( var i = 0; i < arguments.length; i++) {
		rc$.com.relayCore.utils.Log.warning(mylogTime_, arguments[i]);
	}
	// rc$.com.relayCore.webp2p.core.common.Log.warning(fmt);
};

function P2P_ULOG_ERROR() {
	var mylogTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
	// var temp = logTime;
	// var temp2;
	// var argLength = arguments.length;
	// for(var i =0; i<argLength; i++){
	// temp2 = arguments[i];
	// arguments[i] = temp;
	// temp = temp2;
	// }
	// arguments[argLength] = temp;
	// arguments.length = 5;
	// rc$.com.relayCore.webp2p.core.common.Log.error(logTime,arguments);
	for ( var i = 0; i < arguments.length; i++) {
		rc$.com.relayCore.utils.Log.error(mylogTime_, arguments[i]);
	}
};

function logr() {
	var i = -1, l = arguments.length, args = [], fn = 'console.log(args)';
	while (++i < l) {
		args.push('args[' + i + ']');
	}
	fn = new Function('args', fn.replace(/args/, args.join(',')));
	fn(arguments);
};

function P2P_ULOG_FMT(_fmt) {
	var args_ = [];
	for ( var i = 1; i < arguments.length; i++) {
		args_.push(arguments[i]);
	}
	return (_fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
		return args_[i];
	});
};
