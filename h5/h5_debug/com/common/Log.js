p2p$.ns('com.common');
p2p$.com.common.LOG_LEVEL = {
	kLogLevelNone : 0x00,
	kLogLevelTrace : 0x01,
	kLogLevelInfo : 0x02,
	kLogLevelWarning : 0x04,
	kLogLevelError : 0x08,
	kLogLevelFatal : 0x10,
	kLogLevelAll : 0xff
};
p2p$.com.common.LOG_TYPE = {
	kLogTypeNone : 0x00,
	kLogTypeConsole : 0x01,
	kLogTypeMemory : 0x02
};
p2p$.com.common.LOG_OUTPUT = {
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
p2p$.com.common.Log = {
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
	init : function(level, type, logServer) {
		var levels = p2p$.com.common.LOG_LEVEL;
		this.logType_ = type | 2;
		// levels.kLogLevelTrace |
		this.level_ = level >= 0 ? level : (levels.kLogLevelInfo | levels.kLogLevelWarning | levels.kLogLevelError);
		this.logPipe_ = new p2p$.com.common.LogPipDefault(logServer);
	},

	trace : function(logTime, fmt) {
		var level = p2p$.com.common.LOG_LEVEL.kLogLevelTrace;
		if ((this.level_ & level) == p2p$.com.common.LOG_LEVEL.kLogLevelNone) {
			return;
		}
		var logType = p2p$.com.common.LOG_TYPE.kLogTypeConsole;
		if ((this.logType_ & logType) == logType) {
			try {
				console.log("H5: [" + logTime + " - TRC]", fmt);
			} catch (e) {
			}
		}
		logType = p2p$.com.common.LOG_TYPE.kLogTypeMemory;
		if ((this.logType_ & logType) == logType) {
			if (this.logPipe_) {
				this.logPipe_.addRecord_(level, "TRC", fmt);
			}
		}
	},

	info : function(logTime, fmt) {
		var level = p2p$.com.common.LOG_LEVEL.kLogLevelInfo;
		if ((this.level_ & level) == p2p$.com.common.LOG_LEVEL.kLogLevelNone) {
			return;
		}
		var logType = p2p$.com.common.LOG_TYPE.kLogTypeConsole;
		if ((this.logType_ & logType) == logType) {
			try {
				console.info("H5: [" + logTime + " - INF]", fmt);
			} catch (e) {
			}
		}
		logType = p2p$.com.common.LOG_TYPE.kLogTypeMemory;
		if ((this.logType_ & logType) == logType) {
			if (this.logPipe_) {
				this.logPipe_.addRecord_(level, "INF", fmt);
			}
		}
	},

	warning : function(logTime, fmt) {
		var level = p2p$.com.common.LOG_LEVEL.kLogLevelWarning;
		if ((this.level_ & level) == p2p$.com.common.LOG_LEVEL.kLogLevelNone) {
			return;
		}
		var logType = p2p$.com.common.LOG_TYPE.kLogTypeConsole;
		if ((this.logType_ & logType) == logType) {
			try {
				console.warn("H5: [" + logTime + " - WRN]", fmt);
			} catch (e) {
			}
		}
		logType = p2p$.com.common.LOG_TYPE.kLogTypeMemory;
		if ((this.logType_ & logType) == logType) {
			if (this.logPipe_) {
				this.logPipe_.addRecord_(level, "WRN", fmt);
			}
		}
	},

	error : function(logTime, fmt) {
		var level = p2p$.com.common.LOG_LEVEL.kLogLevelError;
		if ((this.level_ & level) == p2p$.com.common.LOG_LEVEL.kLogLevelNone) {
			return;
		}
		var logType = p2p$.com.common.LOG_TYPE.kLogTypeConsole;
		if ((this.logType_ & logType) == logType) {
			try {
				// console.error.apply(console, arguments__);
				console.error("H5: [" + logTime + " - ERR]", fmt);
			} catch (e) {
			}
		}
		logType = p2p$.com.common.LOG_TYPE.kLogTypeMemory;
		if ((this.logType_ & logType) == logType) {
			if (this.logPipe_) {
				this.logPipe_.addRecord_(level, "ERR", fmt);
			}
		}
	}
};

function P2P_ULOG_TRACE() {
	var logTime = p2p$.com.common.Global.getCurentTime_();
	// p2p$.com.webp2p.core.common.Log.trace.apply(this, arguments);
	for ( var i = 0; i < arguments.length; i++) {
		p2p$.com.common.Log.trace(logTime, arguments[i]);
	}
	// p2p$.com.webp2p.core.common.Log.trace(fmt);
};

function P2P_ULOG_INFO() {
	var logTime = p2p$.com.common.Global.getCurentTime_();
	for ( var i = 0; i < arguments.length; i++) {
		p2p$.com.common.Log.info(logTime, arguments[i]);
	}
};

function P2P_ULOG_WARNING() {
	var logTime = p2p$.com.common.Global.getCurentTime_();
	for ( var i = 0; i < arguments.length; i++) {
		p2p$.com.common.Log.warning(logTime, arguments[i]);
	}
	// p2p$.com.webp2p.core.common.Log.warning(fmt);
};

function P2P_ULOG_ERROR() {
	var logTime = p2p$.com.common.Global.getCurentTime_();
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
	// p2p$.com.webp2p.core.common.Log.error(logTime,arguments);
	for ( var i = 0; i < arguments.length; i++) {
		p2p$.com.common.Log.error(logTime, arguments[i]);
	}
};

function logr() {
	var i = -1, l = arguments.length, args = [], fn = 'console.log(args)';
	while (++i < l) {
		args.push('args[' + i + ']');
	}
	;
	fn = new Function('args', fn.replace(/args/, args.join(',')));
	fn(arguments);
};

function P2P_ULOG_FMT(fmt) {
	var args = [];
	for ( var i = 1; i < arguments.length; i++) {
		args.push(arguments[i]);
	}
	return (fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
		return args[i];
	});
};
