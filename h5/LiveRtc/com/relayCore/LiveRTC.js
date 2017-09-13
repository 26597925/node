// 当前是否处于创建类的阶段
var Initializing_ = false;
var JClass = function() {
};
JClass.extend_ = function(prop) {
	// 如果调用当前函数的对象（这里是函数）不是Class，则是父类
	var baseClass = null;
	if (this !== JClass) {
		baseClass = this;
	}
	
	// 本次调用所创建的类（构造函数）
	function F() {
		// 如果当前处于实例化类的阶段，则调用init原型函数
		if (!Initializing_) {
			// 如果父类存在，则实例对象的baseprototype指向父类的原型
			// 这就提供了在实例对象中调用父类方法的途径
			if (baseClass) {
				this._superprototype = baseClass.prototype;
			}
			this.init.apply(this, arguments);
		}
	}

	// 如果此类需要从其它类扩展
	if (baseClass) {
		Initializing_ = true;
		F.prototype = new baseClass();
		F.prototype.constructor = F;
		Initializing_ = false;
	}
	// 新创建的类自动附加extend函数
	F.extend_ = arguments.callee;

	// 覆盖父类的同名函数
	for ( var name in prop) {
		if (prop.hasOwnProperty(name)) {
			// 如果此类继承自父类baseClass并且父类原型中存在同名函数name
			if (baseClass && typeof (prop[name]) === "function" && typeof (F.prototype[name]) === "function" && /\b_super\b/.test(prop[name])) {
				F.prototype[name] = (function(name, fn) {
					return function() {
						this._super = baseClass.prototype[name];
						return fn.apply(this, arguments);
					};
				})(name, prop[name]);
			} else {
				F.prototype[name] = prop[name];
			}
		}
	}
	return F;
};
JClass.apply = function(cls, members) {
	for ( var name in members) {
		if (members.hasOwnProperty(name)) {
			cls.prototype[name] = members[name];
		}
	}
};
var rc$ = {
	ns: function(_space) {
		var names_ = (_space + '').split(".");
		var objs_ = this;
		for ( var i = 0; i < names_.length; i++) {
			var subName_ = names_[i];
			var subType_ = typeof (objs_[subName_]);
			if (subType_ != 'object' && subType_ != 'undefined') {
				throw "Invalid namespace " + _space + ", sub: " + subName_;
			}
			objs_ = objs_[subName_] = objs_[subName_] || {};
		}
	},
	apply : function(_dest, _src) {
		for ( var n in _src) {
			_dest[n] = _src[n];
		}
	},
	applyIf : function(_dest, _src) {
		for ( var n in _src) {
			if (typeof (_dest[n]) != 'undefined') {
				_dest[n] = _src[n];
			}
		}
	}
};
rc$.ns("com.relayCore.utils");
rc$.com.relayCore.utils.Global = {
	kByteUnitsPerKilo : 1024,
	kKiloUnitsPerMega : 1024,
	kMegaUnitsPerGiga : 1024,
	kByteUnitsPerMega : 1024 * 1024,
	kByteUnitsPerGiga : 1024 * 1024 * 1024,
	kByteUnitsPerTera : 1024 * 1024 * 1024 * 1024 * 1024,

	// seconds
	kMilliUnitsPerSec : 1000,
	kMicroUnitsPerMilli : 1000,
	kNanoUnitsPerMicro : 1000,
	kMicroUnitsPerSec : 1000,
	kNanoUnitsPerSec : 1000 * 1000,

	kSecondUnitsPerMinute : 60,
	KMinuteUnitsPerHour : 60,
	kHourUnitsPerDay : 24,
	kSecondUnitsPerHour : 60 * 60,
	kSecondUnitsPerDay : 60 * 60 * 24,

	getSecondTime_ : function() {
		return Math.floor((new Date()).getTime() / 1000);
	},

	getMilliTime_ : function() {
		return (new Date()).getTime();
	},

	getYMDHMS_ : function() {
		return Math.floor((new Date()).getTime());
	},

	getCurentTime_ : function(_defultTimestamp) {
		var now_ = new Date();
		if (typeof defultTimestamp != 'undefined') {
			now_.setTime(_defultTimestamp * 1000);
		}
		var year_ = now_.getFullYear(); // 年
		var month_ = now_.getMonth() + 1; // 月
		var day_ = now_.getDate(); // 日
		var hh_ = now_.getHours(); // 时
		var mm_ = now_.getMinutes(); // 分
		var sec_ = now_.getSeconds();
		var millSec_ = now_.getMilliseconds();
		var clock_ = year_ + "-";
		if (month_ < 10) {
			clock_ += "0";
		}
		clock_ += month_ + "-";
		if (day_ < 10) {
			clock_ += "0";
		}
		clock_ += day_ + " ";
		if (hh_ < 10) {
			clock_ += "0";
		}
		clock_ += hh_ + ":";
		if (mm_ < 10) {
			clock_ += '0';
		}
		clock_ += mm_ + ":";
		;
		if (sec_ < 10) {
			clock_ += '0';
		}
		clock_ += sec_ + ".";
		if (millSec_ < 100) {
			clock_ += '0';
		}
		if (millSec_ < 10) {
			clock_ += '0';
		}
		clock_ += millSec_;
		return (clock_);
	},

	speed : function(value, bps) {
		value = (value || 0);
		var step_ = 1024;
		var suffix_ = 'B/s';
		if (bps) {
			value *= 8;
			step_ = 1000;
			suffix_ = 'bps';
		}
		if (value < 1024) {
			return value.toFixed(0) + ' ' + suffix_;
		} else if (value < (step_ * step_)) {
			return (value / step_).toFixed(1) + ' K' + suffix_;
		} else if (value < (step_ * step_ * step_)) {
			return (value / step_ / step_).toFixed(1) + ' M' + suffix_;
		} else if (value < (step_ * step_ * step_ * step_)) {
			return (value / step_ / step_ / step_).toFixed(1) + ' G' + suffix_;
		}
	}
};
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
rc$.ns("com.relayCore.utils");

rc$.com.relayCore.utils.String = {
	b64EncodeChars_ : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	b64DecodeChars_ : [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7,
			8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
			39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1 ],

	trim : function(_value) {
		var trimRegex_ = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
		return (_value + '').replace(trimRegex_, "");
	},

	urlEncodeNonAscii_ : function(_value) {
		return _value;
	},

	/*
	 * "yyyy-MM-dd hh:mm:ss.S" ==> 2006-07-02 08:09:04.423 "yyyy-M-d h:m:s.S" ==> 2006-7-2 8:9:4.18
	 */
	formatTime_ : function(_value, _fmt) {
		var newDate_ = new Date();
		newDate_.setTime(_value);
		if (!_fmt) {
			_fmt = "yyyy-M-d h:m:s.S";
		}
		;
		var o = {
			"M+" : this.padingLeft_(newDate_.getMonth() + 1, 2),
			"d+" : this.padingLeft_(newDate_.getDate(), 2),
			"h+" : this.padingLeft_(newDate_.getHours(), 2),
			"m+" : this.padingLeft_(newDate_.getMinutes(), 2),
			"s+" : this.padingLeft_(newDate_.getSeconds(), 2),
			"q+" : Math.floor((newDate_.getMonth() + 3) / 3),
			"S" : this.padingLeft_(newDate_.getMilliseconds(), 3)
		};
		if (/(y+)/.test(_fmt)) {
			_fmt = _fmt.replace(RegExp.$1, (newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(_fmt)) {
				_fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		return _fmt;
	},

	padingLeft_ : function(_value, _length, _prefix) {
		var result_ = _value + "";
		while (result_.length < _length) {
			result_ = (_prefix || "0") + result_;
		}
		return result_;
	},
	getRandom_:function(_num)
	{
		var bs_ = "";
		var ran_;
		var char_ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		_num = _num?_num:2;
		for(var i=0;i<_num;i++)
		{
			ran_ = Math.floor(Math.random() * char_.length);
			bs_+=char_[ran_];
		}
		return bs_;
	},
	getAbsoluteUrlIfNeed_ : function(_url, _referer) {
		var position_ = _url.indexOf("://");
		if (position_ != -1) {
			return _url;
		} else {
			var urlParsed_ = new p2p$.com.relayCore.common.Url();
			this.parseUrl_(_referer, urlParsed_, false);
			if (_url.length >= 2 && _url.substring(0, 1) == "/" && _url.substring(1, 2) == "/") {
				// protocol relative
				return this.format("{0}:{1}", urlParsed_.protocol_, _url);
			} else if (_url.length >= 1 && _url.substring(0, 1) == "/") {
				// path relative
				if (0 == urlParsed_.port_) {
					return this.format("{0}://{1}{2}", urlParsed_.protocol_, urlParsed_.host_, _url);
				} else {
					return this.format("{0}://{1}:{2}{3}", urlParsed_.protocol_, urlParsed_.host_, urlParsed_.port_, _url);
				}
			} else {
				// file relative
				if (0 == urlParsed_.port_) {
					return this.format("{0}://{1}{2}{3}", urlParsed_.protocol_, urlParsed_.host_, urlParsed_.path_, _url);
				} else {
					return this.format("{0}://{1}:{2}{3}{4}", urlParsed_.protocol_, urlParsed_.host_, urlParsed_.port_, urlParsed_.path_, url);
				}
			}
		}
	},

	format : function(_fmt) {
		var args_ = [];
		for ( var i = 1; i < arguments.length; i++) {
			args_.push(arguments[i]);
		}
		return (_fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
			return args_[i];
		});
	},

	isSpace : function(_value) {
	},

	isDigit : function(_value) {
		var reg_ = /^[a-zA-Z0-9]+$/g;
		return reg_.test(_value);
	},

	fromNumber : function(_value) {
		return "" + _value;
	},

	parseFloat : function(_value, _defult) {
		if (typeof defult == 'undefined') {
			_defult = 0.0;
		}
		var ret_ = parseFloat(_value);
		var ret2_ = isNaN(ret_) ? _defult : ret_;

		return isNaN(ret2_) ? 0.0 : ret2_;
	},

	// isNaN()
	parseNumber_ : function(_value, _defult) {
		if (typeof defult == 'undefined') {
			_defult = 0;
		}
		var ret_ = parseInt(_value);
		var ret2_ = isNaN(ret_) ? _defult : ret_;
		return isNaN(ret2_) ? 0 : ret2_;
	},

	toUpper_ : function(_value) {
		return (_value || "").toUpperCase();
	},

	makeUpper_ : function(_value) {
		return _value.toUpperCase();
	},

	makeLower_ : function(_value) {
		return _value.toLowerCase();
	},

	startsWith_ : function(_ori, _prefix) {
		return _ori.slice(0, _prefix.length) === _prefix;
	},

	endsWith_ : function(_ori, _suffix) {
		return _ori.indexOf(_suffix, _ori.length - _suffix.length) !== -1;
	},

	toLower_ : function(_value) {
		return _value.toLowerCase();
	},

	compareTo_ : function(_value1, _value2) {
		return _value1.localeCompare(_value2);
	},

	// escape()函数，不会encode @*/+ (不推荐使用)
	// encodeURI()函数，不会encode ~!@#$&*()=:/,;?+' (不推荐使用)
	// encodeURIComponent()函数，不会encode~!*() 这个函数是最常用的
	urlEncode_ : function(_str) {
		_str = (_str + '').toString();
		return encodeURIComponent(_str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(
				/%20/g, '+');
	},

	split : function(_content, _values, _key, _maxItems, _ignoreEmpty, _contentLength) {
		var startPos_ = 0;
		var findPos_ = 0;
		var itemCount_ = 0;
		var keyLen_ = _key.length;
		var endPos_ = (-1 >>> 0 == _contentLength) ? _content.length : _contentLength;

		// values = [];

		if (_key.length == 0) {
			return 0;
		} else if (endPos_ <= 0 || endPos_ >= _content.length) {
			endPos_ = _content.length;
		}

		while (startPos_ < endPos_) {
			findPos_ = _content.indexOf(_key, startPos_);
			if (findPos_ < 0 || findPos_ >= endPos_ || (_maxItems > 0 && itemCount_ == _maxItems - 1)) {
				findPos_ = endPos_;
			}

			if (findPos_ < startPos_) {
				break;
			}

			if (findPos_ > startPos_ || !_ignoreEmpty) {
				var newValue_ = (findPos_ > startPos_) ? _content.substr(startPos_, findPos_ - startPos_) : "";
				_values.push(newValue_);
				itemCount_++;
			}

			startPos_ = findPos_ + keyLen_;
		}

		return itemCount_;
	},

	parseAttributes_ : function(_content, _attributes, _separatorKey, _valueKey, _keyLowCase, _trimKey, _trimValue) {
		var lines_ = 0;
		var parts_ = [];

		this.split(_content, parts_, _separatorKey, -1, false, -1 >>> 0);
		for ( var n = 0; n < parts_.length; n++) {
			var partValue_ = parts_[n];
			var partValues_ = [];
			if (this.split(partValue_, partValues_, _valueKey, 2, false, -1 >>> 0) == 0) {
				continue;
			}

			if (_keyLowCase) {
				partValues_[0] = this.toLower_(partValues_[0]);
			}

			if (_trimKey) {
				this.trim(partValues_.front());
			}

			if (_trimValue && partValues_.length > 1) {
				this.trim(partValues_[partValues_.length - 1]);
			}

			if (partValues_.length < 2) {
				if (partValues_.length >= 1) {
					_attributes.set(partValues_[0], "");
				}
			} else {
				_attributes.set(partValues_[0], partValues_[partValues_.length - 1]);
			}

			lines_++;
		}

		return lines_;
	},

	parseUrl_ : function(_url, _superNodeUrl, _fileWithParams) {
		// protocol_, host_, port_, path_, file_, segment_, params_
		var protocolPos_ = -1;
		if (_url) {
			protocolPos_ = _url.indexOf(":");
		} else {
			return;
		}
		var hostPos_ = 0;
		if (-1 != protocolPos_) {
			var validProtocol_ = true;
			for ( var n = 0; n < protocolPos_; n++) {
				if (!this.isDigit(_url[n])) {
					validProtocol_ = false;
					break;
				}
			}
			if (validProtocol_) {
				_superNodeUrl.protocol_ = this.toLower_(_url.substr(0, protocolPos_));
				hostPos_ = protocolPos_ + 1;
				while (hostPos_ < _url.length && '/' == _url[hostPos_]) {
					hostPos_++;
				}
			}
		}
		var portPos_ = _url.indexOf(":", hostPos_) >>> 0;
		var pathPos_ = _url.indexOf("/", hostPos_) >>> 0;
		if (portPos_ > pathPos_) {
			// maybe such url http://server/about:blank
			portPos_ = -1;
		}
		portPos_ = portPos_ << 0;
		if (-1 != portPos_) {
			_superNodeUrl.host_ = _url.substr(hostPos_, portPos_ - hostPos_);
			_superNodeUrl.port_ = this.parseNumber_(_url.substr(portPos_ + 1), 0);
		}

		var fullUri_;
		if (-1 == pathPos_) {
			fullUri_ = "/";
			if (_superNodeUrl.host_.length == 0) {
				_superNodeUrl.host_ = _url.substr(hostPos_);
			}
		} else {
			fullUri_ = _url.substr(pathPos_);
			if (_superNodeUrl.host_.length == 0) {
				_superNodeUrl.host_ = _url.substr(hostPos_, pathPos_ - hostPos_);
			}
		}

		var queryBeginPos_ = fullUri_.indexOf('?') >>> 0;
		var segmentBeginPos_ = fullUri_.indexOf('#') >>> 0;
		_superNodeUrl.file_ = fullUri_.substr(0, queryBeginPos_ > segmentBeginPos_ ? segmentBeginPos_ : queryBeginPos_);
		if ((queryBeginPos_ + 1) < fullUri_.length && queryBeginPos_ != -1 && queryBeginPos_ < segmentBeginPos_) {
			var queryParams_ = fullUri_.substr(queryBeginPos_ + 1, -1 == segmentBeginPos_ << 0 ? -1 >>> 0 : (segmentBeginPos_ - queryBeginPos_ - 1));
			var encodeParams_ = new rc$.com.relayCore.utils.Map();
			this.parseAttributes_(queryParams_, encodeParams_, '&', '=', false, false, false);
			for ( var n = 0; n < encodeParams_.size(); n++) {
				var item_ = encodeParams_.element(n);
				var key_ = decodeURIComponent(item_.key);
				_superNodeUrl.params_.set(key_, decodeURIComponent(item_.value));
			}
		}

		if (segmentBeginPos_ != -1) {
			_superNodeUrl.segment_ = fullUri_.substr(segmentBeginPos_ + 1);
		}

		var filePos_ = _superNodeUrl.file_.lastIndexOf('/') >>> 0;
		if (filePos_ == -1 || filePos_ == 0) {
			_superNodeUrl.path_ = "/";
		} else {
			_superNodeUrl.path_ = _superNodeUrl.file_.substr(0, filePos_);
		}

		// format path as /name/
		if (_superNodeUrl.path_.length == 0 || _superNodeUrl.path_[_superNodeUrl.path_.length - 1] != '/') {
			_superNodeUrl.path_ += "/";
		}

		if (_fileWithParams) {
			_superNodeUrl.file_ = fullUri_;
			// core::common::String::normalizeUrlPath(path);
			// core::common::String::normalizeUrlPath(file);
		}
	},

	base64Encode_ : function(_str) {
		var out_, i_, len_;
		var c1_, c2_, c3_;

		len_ = str.length;
		i_ = 0;
		out_ = "";
		while (i_ < len) {
			c1 = _str.charCodeAt(i_++) & 0xff;
			if (i_ == len_) {
				out_ += this.b64EncodeChars_.charAt(c1_ >> 2);
				out_ += this.b64EncodeChars_.charAt((c1_ & 0x3) << 4);
				out_ += "==";
				break;
			}
			c2_ = _str.charCodeAt(i_++);
			if (i_ == len_) {
				out_ += this.b64EncodeChars_.charAt(c1_ >> 2);
				out_ += this.b64EncodeChars_.charAt(((c1_ & 0x3) << 4) | ((c2_ & 0xF0) >> 4));
				out_ += this.b64EncodeChars_.charAt((c2_ & 0xF) << 2);
				out_ += "=";
				break;
			}
			c3_ = _str.charCodeAt(i_++);
			out_ += this.b64EncodeChars_.charAt(c1_ >> 2);
			out_ += this.b64EncodeChars_.charAt(((c1_ & 0x3) << 4) | ((c2_ & 0xF0) >> 4));
			out_ += this.b64EncodeChars_.charAt(((c2_ & 0xF) << 2) | ((c3_ & 0xC0) >> 6));
			out_ += this.b64EncodeChars_.charAt(c3_ & 0x3F);
		}
		return out_;
	},

	base64Decode_ : function(_str) {
		var c1_, c2_, c3_, c4_;
		var i_, len_, out_;

		len_ = _str.length;
		i_ = 0;
		out_ = "";
		while (i_ < len_) {
			/* c1_ */
			do {
				c1_ = this.b64DecodeChars_[_str.charCodeAt(i_++) & 0xff];
			} while (i_ < len_ && c1_ == -1);
			if (c1_ == -1) {
				break;
			}

			/* c2_ */
			do {
				c2_ = this.b64DecodeChars_[_str.charCodeAt(i_++) & 0xff];
			} while (i_ < len && c2_ == -1);
			if (c2_ == -1) {
				break;
			}

			out_ += String.fromCharCode((c1_ << 2) | ((c2_ & 0x30) >> 4));

			/* c3_ */
			do {
				c3_ = _str.charCodeAt(i_++) & 0xff;
				if (c3_ == 61) {
					return out_;
				}
				c3_ = this.b64DecodeChars_[c3_];
			} while (i_ < len_ && c3_ == -1);
			if (c3_ == -1) {
				break;
			}

			out_ += String.fromCharCode(((c2_ & 0XF) << 4) | ((c3_ & 0x3C) >> 2));

			/* c4 */
			do {
				c4_ = _str.charCodeAt(i_++) & 0xff;
				if (c4_ == 61) {
					return out_;
				}
				c4_ = this.b64DecodeChars_[c4_];
			} while (i_ < len_ && c4_ == -1);
			if (c4_ == -1) {
				break;
			}
			out_ += String.fromCharCode(((c3_ & 0x03) << 6) | c4_);
		}
		return out_;
	},

	utf16to8_ : function(_str) {
		var out_, i_, len_, c_;

		out_ = "";
		len_ = _str.length;
		for (i_ = 0; i_ < len_; i_++) {
			c_ = _str.charCodeAt(i_);
			if ((c_ >= 0x0001) && (c_ <= 0x007F)) {
				out_ += _str.charAt(i_);
			} else if (c_ > 0x07FF) {
				out_ += String.fromCharCode(0xE0 | ((c_ >> 12) & 0x0F));
				out_ += String.fromCharCode(0x80 | ((c_ >> 6) & 0x3F));
				out_ += String.fromCharCode(0x80 | ((c_ >> 0) & 0x3F));
			} else {
				out_ += String.fromCharCode(0xC0 | ((c_ >> 6) & 0x1F));
				out_ += String.fromCharCode(0x80 | ((c_ >> 0) & 0x3F));
			}
		}
		return out_;
	},

	utf8to16_ : function(_str) {
		var out_, i_, len_, c_;
		var char2_, char3_;

		out_ = "";
		len_ = _str.length;
		i_ = 0;
		while (i_ < len_) {
			c_ = _str.charCodeAt(i_++);
			switch (c_ >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				// 0xxxxxxx
				out_ += _str.charAt(i_ - 1);
				break;
			case 12:
			case 13:
				// 110x xxxx 10xx xxxx
				char2_ = _str.charCodeAt(i_++);
				out_ += String.fromCharCode(((c_ & 0x1F) << 6) | (char2_ & 0x3F));
				break;
			case 14:
				// 1110 xxxx 10xx xxxx 10xx xxxx
				char2_ = _str.charCodeAt(i_++);
				char3_ = _str.charCodeAt(i_++);
				out_ += String.fromCharCode(((c_ & 0x0F) << 12) | ((char2_ & 0x3F) << 6) | ((char3_ & 0x3F) << 0));
				break;
			}
		}

		return out_;
	},

	charToHex_ : function(_str) {
		var out_, i_, len_, c_, h_;

		out_ = "";
		len_ = _str.length;
		i_ = 0;
		while (i_ < len_) {
			c_ = _str.charCodeAt(i_++);
			h_ = c_.toString(16);
			if (h_.length < 2) {
				h_ = "0" + h_;
			}

			out_ += "\\x" + h_ + " ";
			if (i_ > 0 && i_ % 8 == 0) {
				out_ += "\r\n";
			}
		}

		return out_;
	}
};
rc$.ns("com.relayCore.utils");
window.JSON = window.JSON || {};
window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
window.RTCPeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
rc$.com.relayCore.utils.Utils = {
	format : function(_fmt) {
		var args_ = [];
		for (var i = 1; i < arguments.length; i++) {
			args_.push(arguments[i]);
		}
		return (_fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
			return args_[i];
		});
	},

	formatDate_ : function(_fmt, _value) {
		if (!_fmt) {
			_fmt = 'Y-m-d H:i:s';
		}
		if (!_value) {
			return '-';
		} else if (typeof (_value) == 'number') {
			_value = new Date(_value);
		}

		return _fmt.replace(/Y/g, _value.getFullYear()).replace(/m/g, this.pad(_value.getMonth() + 1, 2)).replace(/d/g, this.pad(_value.getDate(), 2)).replace(
				/H/g, this.pad(_value.getHours(), 2)).replace(/i/g, this.pad(_value.getMinutes(), 2)).replace(/s/g, this.pad(_value.getSeconds(), 2)).replace(
				/U/g, this.pad(_value.getMilliseconds(), 3));
	},

	formatDuration_ : function(_value) {
		var result_ = '';
		if (_value > 3600) {
			result_ += (Math.floor(_value / 3600) + ':');
		}
		if (_value > 60) {
			result_ += (this.pad(Math.floor((_value % 3600) / 60), 2) + ':');
		}
		if (_value >= 0) {
			result_ += this.pad(Math.floor(_value % 60), 2);
		}
		return result_;
	},

	size : function(_value) {
		var step_ = 1024;
		if (_value < step_) {
			return _value.toFixed(0) + ' B';
		} else if (_value < (step_ * step_)) {
			return (_value / step_).toFixed(1) + ' KB';
		} else if (_value < (step_ * step_ * step_)) {
			return (_value / step_ / step_).toFixed(1) + ' MB';
		} else if (_value < (step_ * step_ * step_ * step_)) {
			return (_value / step_ / step_ / step_).toFixed(1) + ' GB';
		}
	},

	speed : function(_value, _bps) {
		_value = (_value || 0);
		var step_ = 1024;
		var suffix_ = 'B/s';
		if (_bps) {
			_value *= 8;
			step_ = 1000;
			suffix_ = 'bps';
		}
		if (_value < 1024) {
			return _value.toFixed(0) + ' ' + suffix_;
		} else if (_value < (step_ * step_)) {
			return (_value / step_).toFixed(1) + ' K' + suffix_;
		} else if (_value < (step_ * step_ * step_)) {
			return (_value / step_ / step_).toFixed(1) + ' M' + suffix_;
		} else if (_value < (step_ * step_ * step_ * step_)) {
			return (_value / step_ / step_ / step_).toFixed(1) + ' G' + suffix_;
		}
	},

	pad : function(_num, _size) {
		var s_ = _num + "";
		while (s_.length < _size) {
			s_ = "0" + s_;
		}
		return s_;
	},

	trim : function(_value) {
		var trimRegex_ = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
		return (_value + '').replace(trimRegex_, "");
	},

	getUrlParams_ : function(_url) {
		var params_ = {};
		var paramString_ = _url.indexOf('?') >= 0 ? (_url.substr(_url.indexOf('?') + 1) || '') : _url;
		var paramArray_ = paramString_.split('&');
		for (var i = 0; i < paramArray_.length; i++) {
			var itemArray_ = paramArray_[i].split('=');
			var key_ = '';
			var value_ = null;
			if (itemArray_.length > 0) {
				key_ = decodeURIComponent(itemArray_[0]);
			}
			if (itemArray_.length > 1) {
				value_ = decodeURIComponent(itemArray_[1]);
			}
			params_[key_] = value;
		}
		return params_;
	},

	htmlEscape_ : function(_str) {
		return String(_str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
};
rc$.ns("com.relayCore.utils");
rc$.com.relayCore.utils.Map = JClass.extend_({
	elements_ : null,
	length : 0,
	init : function() {
		this.elements_ = new Array();
		this.length = 0;
	},
	size : function() {
		return this.elements_.length;
	},

	isEmpty : function() {
		return (this.elements_.length < 1);
	},
	empty : function() {
		return (this.elements_.length < 1);
	},
	front : function() {
		if (!this.isEmpty()) {
			return this.elements_[0].value;
		}
		return null;
	},
	pop_front : function() {
		if (!this.isEmpty()) {
			this.elements_.splice(0, 1);
			this.length--;
			return true;
		}
		return false;
	},
	// 删除MAP所有元素
	clear : function() {
		this.elements_ = new Array();
		this.length = 0;
	},

	// 向MAP中增加元素（key, value)
	set : function(_key, _value, _checkSame) {
		if (typeof checkSame == 'undefined') {
			_checkSame = true;
		}
		if (_checkSame) {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					this.elements_[i].value = _value;
					return;
				}
			}
		}

		this.elements_.push({
			key : _key,
			value : _value
		});
		this.length++;
	},

	// 删除指定KEY的元素，成功返回True，失败返回False
	remove : function(_key) {
		var bln_ = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					this.elements_.splice(i, 1);
					this.length--;
					return true;
				}
			}
		} catch (e) {
			bln_ = false;
		}
		return bln_;
	},
	erase : function(_key) {
		var bln_ = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					this.elements_.splice(i, 1);
					this.length--;
					return true;
				}
			}
		} catch (e) {
			bln_ = false;
		}
		return bln_;
	},
	// 获取指定KEY的元素值VALUE，失败返回NULL
	get : function(_key) {
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					return this.elements_[i].value;
				}
			}
			return null;
		} catch (e) {
			return null;
		}
	},

	// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
	element : function(_index) {
		if (_index < 0 || _index >= this.elements_.length) {
			return null;
		}
		return this.elements_[_index];
	},

	// 判断MAP中是否含有指定KEY的元素
	has : function(_key) {
		var bln_ = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					bln_ = true;
				}
			}
		} catch (e) {
			bln_ = false;
		}
		return bln_;
	},
	// 判断MAP中是否含有指定KEY的元素
	find : function(_key) {
		var bln_ = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					bln_ = true;
				}
			}
		} catch (e) {
			bln_ = false;
		}
		return bln_;
	},
	find2 : function(_key, _retValue) {
		var bln_ = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					_retValue.value = this.elements_[i].value;
					bln_ = true;
				}
			}
		} catch (e) {
			bln_ = false;
		}
		return bln_;
	},

	// 判断MAP中是否含有指定VALUE的元素
	containsValue : function(_value) {
		var bln_ = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].value == _value) {
					bln_ = true;
				}
			}
		} catch (e) {
			bln_ = false;
		}
		return bln_;
	},

	// 获取MAP中所有VALUE的数组（ARRAY）
	values : function() {
		var arr_ = new Array();
		for ( var i = 0; i < this.elements_.length; i++) {
			arr_.push(this.elements_[i].value);
		}
		return arr_;
	},

	// 获取MAP中所有KEY的数组（ARRAY）
	keys : function() {
		var arr_ = new Array();
		for ( var i = 0; i < this.elements_.length; i++) {
			arr_.push(this.elements_[i].key);
		}
		return arr_;
	},
});
rc$.ns("com.relayCore.utils");

rc$.com.relayCore.utils.Number = {
	max : function(_value1, _value2) {
		return _value1 > _value2 ? _value1 : _value2;
	},

	min : function(_value1, _value2) {
		return _value1 > _value2 ? _value2 : _value1;
	},

	maxUnsignedValue_ : function() {
		return -1 >>> 0;
	},

	convertToBit_ : function(_size, _data, _array) {
		var __uint8 = null;
		switch (_size) {
		case "1":
			__uint8 = new Uint8Array(1);
			__uint8[0] = parseInt(_data) & 0xff;
			_array.push(__uint8);
			break;
		case "2":
			__uint8 = new Uint8Array(2);
			__uint8[0] = (parseInt(_data) >> 8) & 0xff;
			__uint8[1] = parseInt(_data) & 0xff;
			_array.push(__uint8);
			break;
		case "3":
			__uint8 = new Uint8Array(3);
			__uint8[0] = (parseInt(_data) >> 16) & 0xff;
			__uint8[1] = (parseInt(_data) >> 8) & 0xff;
			__uint8[2] = parseInt(_data) & 0xff;
			_array.push(__uint8);
			break;
		case "4":
			__uint8 = new Uint8Array(4);
			__uint8[0] = (parseInt(_data) >> 24) & 0xff;
			__uint8[1] = (parseInt(_data) >> 16) & 0xff;
			__uint8[2] = (parseInt(_data) >> 8) & 0xff;
			__uint8[3] = parseInt(_data) & 0xff;
			_array.push(__uint8);
			break;
		case "8":
			__uint8 = new Uint8Array(8);
			var data1 = Math.floor(_data / 0x100000000);
			__uint8[0] = (data1 >> 24) & 0xff;
			__uint8[1] = (data1 >> 16) & 0xff;
			__uint8[2] = (data1 >> 8) & 0xff;
			__uint8[3] = (data1) & 0xff;
			var data2 = Math.floor(_data % 0x100000000);
			__uint8[4] = (data2 >> 24) & 0xff;
			__uint8[5] = (data2 >> 16) & 0xff;
			__uint8[6] = (data2 >> 8) & 0xff;
			__uint8[7] = (data2) & 0xff;
			_array.push(__uint8);
			break;
		case "utf":
			__uint8 = new Uint8Array(_data.length);
			for ( var i = 0; i < _data.length; i++) {
				__uint8[i] = _data.charCodeAt(i);
			}
			_array.push(__uint8);
			break;
		case "d":
			if (_data && _data.length > 0) {
				_array.push(_data);
			}
			break;
		}
	},

	convertToValue_ : function(_size, _byteArray, _position, _len) {
		var value1_;
		var value2_;
		var value3_;
		var value4_;
		var value_ = null;
		switch (_size) {
		case "1":
			value_ = _byteArray[_position];
			break;
		case "2":
			value1_ = _byteArray[_position];
			value2_ = _byteArray[_position + 1];
			value_ = (value1_ << 8) + value2_;
			break;
		case "3":
			value1_ = _byteArray[_position];
			value2_ = _byteArray[_position + 1];
			value3_ = _byteArray[_position + 2];
			value_ = (value1_ << 16) + (value1_ << 8) + value2_;
		case "4":
			value1_ = _byteArray[_position];
			value2_ = _byteArray[_position + 1];
			value3_ = _byteArray[_position + 2];
			value4_ = _byteArray[_position + 3];
			value_ = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
			break;
		case "8":
			value1_ = _byteArray[_position];
			value2_ = _byteArray[_position + 1];
			value3_ = _byteArray[_position + 2];
			value4_ = _byteArray[_position + 3];

			var high = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
			value1_ = _byteArray[_position + 4];
			value2_ = _byteArray[_position + 5];
			value3_ = _byteArray[_position + 6];
			value4_ = _byteArray[_position + 7];
			var low_ = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
			value_ = (high * 0x100000000) + low;
			break;
		case "utf":
			var str_ = "";
			for ( var i = 0; i < _len; i++) {
				str_ += String.fromCharCode(_byteArray[_position + i]);
			}
			value_ = str_;
			break;
		case "d":
			value_ = _byteArray.subarray(_position, _position + _len);
			break;
		}
		return value_;
	}
};
rc$.ns("com.relayCore.utils");

rc$.com.relayCore.utils.Url = JClass.extend_({
	protocol_ : "",
	host_ : "",
	port_ : 0,
	path_ : "",
	file_ : "",
	segment_ : "",
	params_ : null,

	init : function() {
		this.protocol_ = "";
		this.host_ = "";
		this.port_ = 0;
		this.path_ = "";
		this.file_ = "";
		this.segment_ = "";
		this.params_ = new rc$.com.relayCore.utils.Map();
	},

	getParams : function() {
		return this.params_;
	},

	fromString_ : function(_value) {
		rc$.com.relayCore.utils.String.parseUrl_(_value, this, false);
	},

	toString : function() {
		var isDefaultPort_ = (this.port_ == 0) || (this.protocol_ == "http" && this.port_ == 80) || (this.protocol_ == "https" && this.port_ == 443);
		var protocolName_ = this.protocol_ == "" ? "http" : this.protocol_;

		var value_;
		if (isDefaultPort_) {
			value_ = protocolName_ + "://" + this.host_ + this.file_;
		} else {
			value_ = protocolName_ + "://" + this.host_ + ":" + this.port_ + this.file_;
		}

		return value_ + this.toQueryString_();
	},

	toQueryString_ : function(_fromFirst) {
		var value_ = "";
		var isFirstKey_ = true;
		if (typeof fromFirst == 'undefined') {
			isFirstKey_ = true;
		} else {
			isFirstKey_ = _fromFirst;
		}
		if (!this.params_.empty()) {
			for ( var i = 0; i < this.params_.elements_.length; i++) {
				// var vthis.params_.elements_[i].value
				if (isFirstKey_) {
					value_ += "?";
				} else {
					value_ += "&";
				}
				value_ += (rc$.com.relayCore.utils.String.urlEncodeNonAscii_(this.params_.elements_[i].key) + "=" + rc$.com.relayCore.utils.String
						.urlEncodeNonAscii_(this.params_.elements_[i].value));
				isFirstKey_ = false;
			}
		}

		if (this.segment_ != "") {
			value_ += "#";
			value_ += this.segment_;
		}
		return value_;
	}
});
rc$.ns("com.relayCore.utils");
rc$.com.relayCore.utils.HttpDownLoader = JClass.extend_({
		url_ : null,
		scope_ : null,
		method_ : "GET",
		config_ : null,
		type_ : "text",
		tag_ : "",
		startTime_ : "",
		endTime : "",
		totalUsedTime_ : "",
		transferedSpeed_ : 0,
		transferedBytes_ : -1,
		responseCode_ : 0,
		responseLength_ : -1,
		responseData_ : "",
		successed_ : false,
		resolvedTime_ : 0,
		connectedTime_ : 0,
		responsedTime_ : 0,
		transferedTime_ : 0,
		info_ : "",
		http_ : null,
		readyState_ : 0,
		global_:null,
		
		init:function()
		{
			//初始化参数
			this.responseLength_ = 0;
			this.resolvedTime_ = 0;
			this.connectedTime_ = 0;
			this.responsedTime_ = 0;
			this.transferedTime_ = 0;
			this.transferedSpeed_ = 0;
			this.transferedBytes_ = 0;
			this.responseCode_ = 0;
			this.info_ = "";
			this.responseData_ = "";
			this.remoteEndpoint_ = "";
			this.postData_ = null;
			this.http_ = null;
			this.readyState_ = 0;
			this.global_ = rc$.com.relayCore.utils.Global;
			this.startTime_ = this.global_.getMilliTime_();
			if(arguments.length>0&&typeof(arguments[0])=="object")
	    	{
	    		rc$.apply(this,arguments[0]);
	    	}
		},
		setRequsetRange_ : function(_rangeStr) {
			this.rangeStr_ = _rangeStr;
		},
		setPredefineHost_ : function(_predefine) {
			var predefineIpAndPort_ = _predefine.split(":");
			if (!predefineIpAndPort_) {
				return;
			}
			var myurl_ = new rc$.com.relayCore.utils.Url();
			myurl_.fromString_(this.url_);
			if (predefineIpAndPort_.length > 2) {
				return;
			}
			myurl_.host_ = predefineIpAndPort_[0];
			if (predefineIpAndPort_.length == 1) {
				myurl_.port_ = 0;
			} else {
				myurl_.port_ = predefineIpAndPort_[1];

			}
			this.url_ = myurl_.toString();
		},
		log_ : function(_result) {
			if ("cdn::range-data" == this.tag_) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Download {1}, Segment ({2}/{3}-{16}), url({4}), "
						+ "response code({5}), data({6}/{7} Bytes), " + "resolved time({8} ms), " + "connected time({9} ms), " + "responsed time({10} ms), "
						+ "total used time({11} ms), " + "transfered time({12} ms), " + "ready State({13}), " + "speed({14}), " + "bytes({15})", this.tag_,
						(_result == "" ? (this.successed_ ? "OK" : "FAILED") : _result), this.info_ ? this.info_.segmentId_ : 0, this.info_ ? this.info_.startIndex_
								: 0, this.url_, this.responseCode_, this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_,
						this.connectedTime_, this.responsedTime_, this.totalUsedTime_, this.transferedTime_, this.readyState_, this.global_
								.speed(this.transferedSpeed_, false), this.transferedBytes_, this.info_ ? this.info_.endIndex_ : 0));
			} else {
				P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Download {1}, url({2}), " + "response code({3}), data({4}/{5} Bytes), "
						+ "resolved time({6} ms), " + "connected time({7} ms), " + "responsed time({8} ms), " + "total used time({9} ms), "
						+ "transfered time({10} ms), " + "ready State({11}), " + "speed({12}), " + "bytes({13})", this.tag_,
						(_result == "" ? (this.successed_ ? "OK" : "FAILED") : _result), this.url_, this.responseCode_,
						this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_, this.connectedTime_, this.responsedTime_,
						this.totalUsedTime_, this.transferedTime_, this.readyState_, this.global_.speed(this.transferedSpeed_, false),
						this.transferedBytes_));
			}
		},
		load_ : function() {

			var xhr_ = this.http_ = this.createRequest_();
			var scope_ = this;
			xhr.onreadystatechange = function() {
				if (this.readyState == 1) {
					scope_.readyState_ = 1;
				}
				if (this.readyState == 2) {
					scope_.readyState_ = 2;
				}
				if (this.readyState == 3) {
					scope_.readyState_ = 3;
				}
				if (this.readyState == 4) {
					scope_.readyState_ = 4;
					scope_.endTime = scope_.global_.getMilliTime_();
					scope_.responseCode_ = this.status;
					scope_.responseData_ = this.response || '';

					// Calculate usedTime
					scope_.totalUsedTime_ = scope_.endTime - scope_.startTime_;

					if (this.status >= 200 && this.status < 300) {
						// Calculate speed
						if (scope_.tag_ == "cdn::range-data") {
							var uInt8Array = new Uint8Array(scope_.responseData_);
							scope_.responseData_ = uInt8Array;
							scope_.responseLength_ = uInt8Array.length;
							scope_.transferedBytes_ = uInt8Array.length;
						} else {
							if ("json" == scope_.type_) {
								var str_ = JSON.stringify(scope_.responseData_);
								scope_.transferedBytes_ = scope_.responseLength_ = str_.length;
							} else {
								scope_.transferedBytes_ = scope_.responseLength_ = scope_.responseData_.length;
							}
						}
						scope_.transferedSpeed_ = (scope_.transferedBytes_ * 1000 / scope_.totalUsedTime_);// .toFixed(2);
						scope_.transferedSpeed_ = Math.round(scope_.transferedSpeed_ * 100) / 100;
						// P2P_ULOG_TRACE("tag:"+scope_.tag_+",responseLength_:"+scope_.responseLength_+",speed:"+this.global_.speed(scope_.transferedSpeed_,false));
						scope_.successed_ = true;

					} else {
						scope_.successed_ = false;
					}
					if (!scope_.isAbort_) {
						scope_.onDownloadCompleted_();
					}

				}
			};
			xhr_.open(this.method_, this.url_);
			if (this.rangeStr_) {
				xhr_.setRequestHeader("Range", this.rangeStr_);
			}
			try {
				xhr_.responseType = this.type_;// arraybuffer
				if (!this.postData_) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Start download {1}...", this.tag_, this.url_));
				}
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("HttpDownloader [{0}] url({1})ERROR({2})", this.tag_, this.url_,e.toString()|""));
			}
			var myurl_ = new rc$.com.relayCore.utils.Url();
			myurl_.fromString_(this.url_);
			this.remoteEndpoint_ = myurl_.host_ + (myurl_.port_ == 0 ? "" : ":" + myurl_.port_);

			try {
				if (this.postData_) {
					xhr_.send(this.postData_);
				} else {
					xhr_.send(null);
				}

			} catch (e) {
				console.log(e);
			}
		},
		createRequest_:function()
		{
			var objXMLHttpRequest_ = null;
			if (window.ActiveXObject) { // MS IE
				var activeXNameList = new Array("Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP",
						"Microsoft.XMLHTTP");
				for ( var h = 0; h < activeXNameList.length; h++) {
					try {
						objXMLHttpRequest_ = new ActiveXObject(activeXNameList[h]);
					} catch (e) {
						continue;
					}
					if (objXMLHttpRequest_) {
						break;
					}
				}
			} else if (window.XMLHttpRequest) { // NOT MS IE
				objXMLHttpRequest_ = new XMLHttpRequest();
				if (objXMLHttpRequest_.overrideMimeType) { // 针对某些特定版本的mozillar浏览器的BUG进行修正
					objXMLHttpRequest_.overrideMimeType(this.type);
				}
			}
			return objXMLHttpRequest_;
		},
		onDownloadData_ : function() {
			if (typeof this.scope_.onHttpDownloadData_ != 'undefined' & this.scope_.onHttpDownloadData_ instanceof Function) {
				this.scope_.onHttpDownloadData_(this);
			}
		},

		stringToJson_ : function(_stringVal) {
			eval("var theJsonVal = " + _stringVal);
			return theJsonVal;
		},

		setInfo_ : function(_info) {
			this.info_ = _info;
		},
		
		onDownloadCompleted_ : function() {
			// P2P_ULOG_TRACE("download success:",this);
			if (!this.postData_) {
//				
			}
			if (typeof this.scope_.onHttpDownloadCompleted_ != 'undefined' & this.scope_.onHttpDownloadCompleted_ instanceof Function) {
				this.scope_.onHttpDownloadCompleted_(this);
			}

		},

		sendInfo : function(_value) {
			var info_ = {};
			info_.code = "Mobile.Info.Debug";
			info_.info = _value;
		},
		close : function() {
			if (this.http_) {
				this.isAbort_ = true;
				this.http_.abort();
			}
		}
});
rc$.ns("com.relayCore.utils");

rc$.com.relayCore.utils.LogPipDefault = JClass.extend_({
	records_ : null,
	uploadTimer_ : null,
	logServer_ : null,
	logDom_ : null,
	maxRecordCount_ : 500,
	nextLogId_ : 0,

	init : function(_logServer) {
		this.records_ = [];
		this.uploadTimer_ = null;
		this.logServer_ = _logServer;
		this.nextLogId_ = 1;
		this.logDom_ = document.getElementById("cde-log-container");
	},

	setUploadTimeout_ : function(_timeoutMs) {
		var scope_ = this;
		this.uploadTimer_ = setTimeout(function() {
			scope_.onUploadTimeout_();
		}, _timeoutMs);
	},

	onUploadTimeout_ : function() {
		this.upload();
		this.setUploadTimeout_(2000);
	},

	addRecord_ : function(_level, _name, _log) {
		// this.records_.push(log);

		var logTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
		var formatLog_ = "[" + logTime_ + " - " + _name + "]" + _log;

		if (this.logServer_) {
			$.post(this.logServer_, {
				sessionid : "lmpn",
				log : formatLog_
			}, function(data, status) {
			});
		}

		if (this.logDom_) {
			try {
				if (this.logDom_.value.length > 100000) {
					this.logDom_.value = "";
				}
				if (this.logDom_.value) {
					this.logDom_.value += "\r\n";
				}
				this.logDom_.value += formatLog_;
			} catch (e) {
			}
		}

		if (this.records_.length >= this.maxRecordCount_) {
			this.records_.shift();
		}
		var localTime_ = new Date().getTime() * 1000;
		this.records_.push({
			level : _level,
			id : this.nextLogId_++,
			localTime : localTime_,
			absTime : localTime_,
			content : _log
		});
	},

	upload : function() {
		var params_ = "";
		for ( var n = 0; n < this.records_.length; n++) {
			params_ += this.records_[n] + "\r\n";
		}
		this.records_ = [];
		this.downloader_ = new rc$.com.relayCore.utils.HttpDownLoader({url_:"http://127.0.0.1:8000/", scope_:this, method_:"POST", tag_:"upload::log",postData_:{
			log : params_
		}});
		this.downloader_.load_();
	},

	onHttpDownloadCompleted_ : function(_downloader) {
		var handled_ = false;
		this.downloader_ = null;
		if ("upload::log" == _downloader.tag_) {
			if (!_downloader.successed_ || _downloader.responseCode_ < 200 || _downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				return handled_;
			} else {

			}
		}
	},

	require : function(_lastId, _lastTime, _level, _filter, _limit, _maxLogTime, _order) {
		if (typeof order == 'undefined') {
			_order = false;
		}
		var result_ = {
			records : [],
			maxLogTime : _maxLogTime
		};
		for ( var i = 0; i < this.records_.length; i++) {
			var item_ = this.records_[i];
			if (item_.id <= _lastId || item_.absTime <= _lastTime) {
				continue;
			} else if ((item_.level & _level) == 0) {
				continue;
			} else if (_filter && item_.content.indexOf(_filter) < 0) {
				continue;
			}

			result_.maxLogTime = Math.max(result_.maxLogTime, item_.absTime);
			if (!_order) {
				result_.records.unshift(item_);
			} else {
				result_.records.push(item_);
			}

			if (result_.records.length >= _limit) {
				break;
			}
		}
		return result;
	}
});
rc$.ns("com.relayCore.broadcast");
rc$.com.relayCore.broadcast.Types = {
		TypePeer:1,
		TypeChannel:2,
		TypeSSRC:3,
		RemoteID:4
};
rc$.com.relayCore.broadcast.BroadCast = {
	selectPeerId_:-1,
	selectSSRCId_:-1,
	peers_:null,
	ssrcs_:null,
	colors_:{
			normal:"#eeeeee",
			has:"#9A0316",
			del:"#cccccc",
			insert:"#67000D",
		},
	init_:function(_containerId)
	{
		var container_ = document.getElementById(_containerId);
		//创建面板
		if(container_)
		{
			//添加css到页面
			var form1_ ="<form class=\"form-inline\">" +
					"<div class=\"form-group\">" +
					"<select type=\"select\" class=\"form-control\" id=\"serve-type\">" +
					"<option>sourcing</option>" +
					"<option>serving</option>" +
					"</select>" +
					"<input type=\"text\" class=\"form-control\" id=\"serving\" placeholder=\"输入SSRC\">" +
					"<button type=\"button\" class=\"btn btn-info input-group-addon\" onclick=\"openServing()\">open</button>" +
					"<button type=\"button\" class=\"btn btn-info\" onclick=\"stopServing()\">stop</button>" +
					"</div>" +
					"</form>";
			var form2_ = "<form class=\"form-inline\">" +
					"<div class=\"form-group\">" +
					"<select type=\"select\" class=\"form-control\" id=\"message-type\">" +
					"<option>80</option>" +
					"<option>77</option>" +
					"</select>" +
					"<input type=\"text\" class=\"form-control\" id=\"ssrcId\" placeholder=\"SSRCID\">" +
					"<input type=\"text\" class=\"form-control\" id=\"message\" placeholder=\"消息内容\">" +
					"<button type=\"button\" class=\"btn btn-info\" onclick=\"sending()\">send</button>" +
					"</div>" +
					"</form>";
			var porter_=
				[
				 {id:"remoteId",content:"<h4>RelayCoreID：</h4>"}
				 ,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",content:"Peer节点列表："}]}]},tbody:{id:"peer"}}}
				 ,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",content:"SSRC资源列表："}]}]},tbody:{id:"ssrc"}}}
				 ,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",id:"ssrcDetail",content:"资源加载情况"}]}]},tbody:{id:"ssrc_layer"}}}
				 ,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{content:"操作"}]}]},tbody:{tr:[{td:[{content:form1_}]},{td:[{content:form2_}]}]}}}
			             ];
			for(var i=0;i<porter_.length;i++)
			{
				container_.appendChild(this.createModule_(porter_[i]));
			}
		}
	},
	createModule_:function(_params)
	{
		var div_ = document.createElement("div");
		if(_params.hasOwnProperty("name"))
		{
			div_.className = _params.name;
		}
		if(_params.hasOwnProperty("id"))
		{
			div_.setAttribute("id",_params.id);
		}
		if(_params.hasOwnProperty("content"))
		{
			div_.innerHTML = _params.content;
		}
		if(_params.hasOwnProperty("table"))
		{
			var table_,thead_,tr_,th_,tbody_,td_;
			table_ = document.createElement("table");
			if(_params.table.hasOwnProperty("name"))
			{
				table_.className = _params.table.name;
			}
			div_.appendChild(table_);
			if(_params.table.hasOwnProperty("thead"))
			{
				thead_ = document.createElement("thead");
				table_.appendChild(thead_);
				if(_params.table.thead.hasOwnProperty("name"))
				{
					thead_.className = _params.table.thead_.name;
				}
				if(_params.table.thead.hasOwnProperty("id"))
				{
					thead_.setAttribute("id",_params.table.thead_.id);
				}
				if(_params.table.thead.hasOwnProperty("tr"))
				{
					for(var i=0;i<_params.table.thead.tr.length;i++)
					{
						tr_ = document.createElement("tr");
						thead_.appendChild(tr_);
						if(_params.table.thead.tr[i].hasOwnProperty("th"))
						{
							for(var j=0;j<_params.table.thead.tr[i].th.length;j++)
							{
								th_ = document.createElement("th");
								tr_.appendChild(th_);
								if(_params.table.thead.tr[i].th[j].hasOwnProperty("name"))
								{
									th_.className = _params.table.thead.tr[i].th[j].name;
								}
								if(_params.table.thead.tr[i].th[j].hasOwnProperty("id"))
								{
									th_.setAttribute("id",_params.table.thead.tr[i].th[j].id);
								}
								if(_params.table.thead.tr[i].th[j].hasOwnProperty("content"))
								{
									th_.innerHTML = _params.table.thead.tr[i].th[j].content;
								}
							}
						}
					}
				}	
			}
			if(_params.table.hasOwnProperty("tbody"))
			{
				tbody_ = document.createElement("tbody");
				table_.appendChild(tbody_);
				if(_params.table.tbody.hasOwnProperty("name"))
				{
					tbody_.className = _params.table.tbody.name;
				}
				if(_params.table.tbody.hasOwnProperty("id"))
				{
					tbody_.setAttribute("id",_params.table.tbody.id);
				}
				if(_params.table.tbody.hasOwnProperty("tr"))
				{
					for(var i=0;i<_params.table.tbody.tr.length;i++)
					{
						tr_ = document.createElement("tr");
						tbody_.appendChild(tr_);
						if(_params.table.tbody.tr[i].hasOwnProperty("td"))
						{
							for(var j=0;j<_params.table.tbody.tr[i].td.length;j++)
							{
								td_ = document.createElement("td");
								tr_.appendChild(td_);
								if(_params.table.tbody.tr[i].td[j].hasOwnProperty("name"))
								{
									td_.className = _params.table.tbody.tr[i].td[j].name;
								}
								if(_params.table.tbody.tr[i].td[j].hasOwnProperty("id"))
								{
									td_.setAttribute("id",_params.table.tbody.tr[i].td[j].id);
								}
								if(_params.table.tbody.tr[i].td[j].hasOwnProperty("content"))
								{
									td_.innerHTML = _params.table.tbody.tr[i].td[j].content;
								}
							}
						}
					}
				}
				
			}
		}
		return div_;
	},
	broad_:function(_message)
	{
		var type_ = _message.type;
		switch(type_)
		{
		case rc$.com.relayCore.broadcast.Types.TypePeer:
			this.updatePeer_(_message.data);
			break;
		case rc$.com.relayCore.broadcast.Types.TypeChannel:
			this.updataChannel_(_message.data);
			break;
		case rc$.com.relayCore.broadcast.Types.TypeSSRC:
			this.updateSSRC_(_message.data);
			break;
		case rc$.com.relayCore.broadcast.Types.RemoteID:
			var idv_ = document.getElementById("remoteId");
			if(idv_){
				idv_.innerHTML = "<h4>RelayCoreID："+_message.data+"</h4>";
			}
			break;
		default:
			break;
		}
	},
	updatePeer_:function(_params)
	{
		if(!this.peers_)
		{
			this.peers_ = new rc$.com.relayCore.utils.Map();
		}
		var div = document.getElementById("peer");
		if(!div)
		{
			return;
		}
		var key_,peer_;
		switch(_params.type)
		{
		case "add":
			peer_ = _params.peer;
			key_ = peer_.peerId_;
			if(!this.peers_.find(key_))
			{
				this.peers_.set(key_,peer_);
				tr_ = document.createElement("tr");
				tr_.className = "peerItem";
				tr_.setAttribute("id",key_);
				var str_ = "<td><div onclick=\"rc$.com.relayCore.broadcast.BroadCast.showDes_('"+key_+"')\"><span class=\"glyphicon glyphicon-plus\"></span>"+(peer_.fromServer_?"【主动】":"【被动】")+key_+"<span class=\"ng\">（"+peer_.channel_.ng_+"-"+peer_.channel_.negPacket_.ngId_+"）"+"</span></div></td>";
				tr_.innerHTML = str_;
				div.appendChild(tr_);
			}
			break;
		case "remove":
			key_ = _params.id;
			if(this.peers_.find(key_))
			{
				this.peers_.remove(key_);
				var dc_ = document.getElementById(key_);
				div.removeChild(dc_);
			}
			break;
		}
	},
	updateSSRC_:function(_params)
	{
		if(!this.ssrcs_)
		{
			this.ssrcs_ = new rc$.com.relayCore.utils.Map();
		}
		var div_ = document.getElementById("ssrc");
		if(!div_)
		{
			return;
		}
		var key_,ssrc_,str_,tr_;
		switch(_params.type)
		{
		case "add":
			ssrc_ = _params.ssrc;
			key_ = ssrc_.id+":"+ssrc_.level;
			if(!this.ssrcs_.find(key_))
			{
				this.ssrcs_.set(key_,ssrc_);
				tr_ = document.createElement("tr");
				tr_.className = "ssrcItem";
				tr_.setAttribute("id",key_);
				str_ = "<td><div onclick=\"rc$.com.relayCore.broadcast.BroadCast.showChannel_('"+key_+"')\"><span class=\"glyphicon glyphicon-plus\"></span>【"+ssrc_.level+"】"+ssrc_.id+"</div></td>";
				tr_.innerHTML = str_;
				div_.appendChild(tr_);
			}
			break;
		case "remove":
			key_ = _params.id;
			if(this.ssrcs_.find(key_))
			{
				this.ssrcs_.remove(key_);
				var dc_ = document.getElementById(key_);
				div_.removeChild(dc_);
			}
			break;
		}
	},
	showChannel_:function(_id)
	{
		var container_ = document.getElementById(_id);
		if(container_)
		{
			var items_,tmp_,ssrc_,mylayers_,channels_,table_,thead_,tbody_,th_,str_,tr_,td_,layer_,p_,m_,cid_,unsync_,sync_,channel_,id_,status_,key_;
			if(this.selectSSRCId_!=-1)
			{
				//删除上一个
				tmp_ = document.getElementById(this.selectSSRCId_);
				if(tmp_)
				{
					items_ = tmp_.firstChild;
					while(items_.childNodes.length>1)
					{
						items_.removeChild(items_.childNodes[items_.childNodes.length-1]);
					}
				}
			}
			items_ = container_.firstChild;
			while(items_.childNodes.length>1)
			{
				items_.removeChild(items_.childNodes[items_.childNodes.length-1]);
			}
			if(this.selectSSRCId_==_id)
			{
				this.selectSSRCId_ = -1;
				return;
			}
			this.selectSSRCId_=_id;
			ssrc_ = this.ssrcs_.get(_id);
			//显示详细信息
			this.showDetail_();
			mylayers_ = ssrc_.layers_;
			if(!mylayers_)
			{
				return;
			}
			channels_ = ssrc_.ssrcChannel_.dataChannels_;

			for(var i=0;i<mylayers_.length;i++)
			{
				key_ = mylayers_.elements_[i].key;
				layer_ = mylayers_.elements_[i].value;
				cid_ = layer_.channelId_;
				sync_ = layer_.syncChannels_;
				unsync_ = layer_.unsyncChannels_;
				p_ = layer_.cachePacket_.get(80);
				m_ = layer_.cachePacket_.get(77);
				table_ = document.createElement("table");
				table_.className="table table-condensed";
				items_.appendChild(table_);
				thead_ = document.createElement("thead");
				tr_ = document.createElement("tr");
				th_ = document.createElement("th");
				th_.innerHTML = "<span class=\"layer\">层："+key_+"</span>";
				tr_.appendChild(th_);
				thead_.appendChild(tr_);
				table_.appendChild(thead_);
				tbody_ = document.createElement("tbody");
				table_.appendChild(tbody_);
				
				if(sync_.length>0)
				{
					tr_ = document.createElement("tr");
					tr_.className = "danger";
					td_ = document.createElement("td");
					td_.innerHTML = "已同步：";
					tr_.appendChild(td_);
					tbody_.appendChild(tr_);
					
					for(var j=0;j<sync_.length;j++)
					{
						id_ = sync_[j];
						str_="";
						if(!channels_.find(id_))
						{
							P2P_ULOG_WARNING(P2P_ULOG_FMT("com::relayCore::broadcast::BroadCast id({1})不存在了",id_));
							continue;
						}
						channel_ = channels_.get(id_);
						status_ = String.fromCharCode(channel_.syncStatus_);
						if(channel_.label_.indexOf("@VIR")==-1)
						{
							str_="<span>[<span class=\"status-"+status_+"\" id="+id_+"-status>"+status_+"</span>]"+(cid_==id_?"【主】":"【副】")+channel_.label_+"::"+id_+"</span><span id="+id_+"-message></span>";
						}
						else
						{
							str_="<span>[<span class=\"status-"+status_+"\" id="+id_+"-status>"+status_+"</span>]"+(cid_==id_?"【主】":"【副】")+"[虚]"+channel_.label_+"::"+id_+"</span><span id="+id_+"-message></span>";
						}
						tr_ = document.createElement("tr");
						tr_.className = "info";
						td_ = document.createElement("td");
						td_.innerHTML = str_;
						tr_.appendChild(td_);
						tbody_.appendChild(tr_);
					}
				}
				if(unsync_.length>0)
				{
					tr_ = document.createElement("tr");
					tr_.className = "danger";
					td_ = document.createElement("td");
					td_.innerHTML = "需同步：";
					tr_.appendChild(td_);
					tbody_.appendChild(tr_);
					for(var j=0;j<unsync_.length;j++)
					{
						id_ = unsync_[j];
						str_="";
						if(!channels_.find(id_))
						{
							P2P_ULOG_WARNING(P2P_ULOG_FMT("com::relayCore::broadcast::BroadCast id({1})不存在了",id_));
							continue;
						}
						channel_ = channels_.get(id_);
						status_ = String.fromCharCode(channel_.syncStatus_);
						if(channel_.label_.indexOf("@VIR")==-1)
						{
							str_="<span>[<span class=\"status-"+status_+"\" id="+id_+"-status>"+status_+"</span>]"+channel_.label_+"::"+id_+"</span><span id="+id_+"-message></span>";
						}
						else
						{
							str_="<span>[<span class=\"status-"+status_+"\" id="+id_+"-status>"+status_+"</span>][虚]"+channel_.label_+"::"+id_+"</span><span id="+id_+"-message></span>";
						}
						tr_ = document.createElement("tr");
						tr_.className = "warning";
						td_ = document.createElement("td");
						td_.innerHTML = str_;
						tr_.appendChild(td_);
						tbody_.appendChild(tr_);
					}
				}
			}
		}
	},
	showDes_:function(_id)
	{
		var container_ = document.getElementById(_id);
		if(container_)
		{
			var items_,peer_,tmp_,from_,level_,tbody_,str_,table_,tr_,td_,unsyncs_,syncs_;
			if(this.selectPeerId_!=-1)
			{
				//删除上一个
				tmp_ = document.getElementById(this.selectPeerId_);
				if(tmp_)
				{
					items_ = tmp_.firstChild;
					while(items_.childNodes.length>1)
					{
						items_.removeChild(items_.childNodes[items_.childNodes.length-1]);
					}
				}
			}
			items_ = container_.firstChild;
			while(items_.childNodes.length>1)
			{
				items_.removeChild(items_.childNodes[items_.childNodes.length-1]);
			}
			if(this.selectPeerId_==_id)
			{
				this.selectPeerId_=-1;
				return;
			}
			this.selectPeerId_=_id;
			peer_ = this.peers_.get(_id);
			from_ = peer_.fromServer_?0:1;
			unsyncs_ = peer_.channel_.negPacket_.unsynced_;
			syncs_ = peer_.channel_.negPacket_.synced_;
			table_ = document.createElement("table");
			table_.className="table table-condensed";
			items_.appendChild(table_);
			tbody_ = document.createElement("tbody");
			table_.appendChild(tbody_);
			if(syncs_.length>0)
			{
				tr_ = document.createElement("tr");
				tr_.className = "danger";
				td_ = document.createElement("td");
				td_.innerHTML = "同步：";
				tr_.appendChild(td_);
				tbody_.appendChild(tr_);
				for(i=0;i<syncs_.length;i++)
				{
					level_=(from_+syncs_[i].mappedId)%2;
					str_="<span>【"+(level_==0?"已同步":"需同步")+"】"+syncs_[i].id+":"+syncs_[i].mappedId+":"+syncs_[i].spc+"</span>";
					tr_ = document.createElement("tr");
					tr_.className = "info";
					td_ = document.createElement("td");
					td_.innerHTML = str_;
					tr_.appendChild(td_);
					tbody_.appendChild(tr_);
				}
			}
			if(unsyncs_.length>0)
			{
				tr_ = document.createElement("tr");
				tr_.className =  "danger";
				td_ = document.createElement("td");
				td_.innerHTML = "未同步：";
				tr_.appendChild(td_);
				tbody_.appendChild(tr_);
				for(i=0;i<unsyncs_.length;i++)
				{
					level_=(from_+unsyncs_[i].mappedId)%2;
					var str_="<span>【"+(level_==0?"已同步":"需同步")+"】"+unsyncs_[i].id+":"+unsyncs_[i].mappedId+":"+unsyncs_[i].spc+"</span>";
					tr_ = document.createElement("tr");
					tr_.className = "warning";
					td_ = document.createElement("td");
					td_.innerHTML = str_;
					tr_.appendChild(td_);
					tbody_.appendChild(tr_);
				}
			}
		}
	},
	showDetail_:function()
	{
		var container_ = document.getElementById("ssrc_layer");
		var sid_ = container_.getAttribute("sid");
		if(sid_ == this.selectSSRCId_)
		{
			return;
		}
		var title_ = document.getElementById("ssrcDetail");
		if(title_)
		{
			title_.innerHTML="资源："+this.selectSSRCId_;
		}
		//清空内容
		container_.setAttribute("sid",this.selectSSRCId_);
		while(container_.childNodes.length>0)
		{
			container_.removeChild(container_.firstChild);
		}
		var ssrc_ = this.ssrcs_.get(this.selectSSRCId_);
		var layers_ = ssrc_.layers_;
		var item_,table_,thead_,tbody_,th_,tr_,td_,layer_,key_,p_,m_,span_,br_,color_;
		tr_ = document.createElement("tr");
		td_ = document.createElement("td");
		tr_.appendChild(td_);
		container_.appendChild(tr_);
		item_ = td_;

		for(var i=0;i<layers_.length;i++)
		{
			key_ = layers_.elements_[i].key;
			layer_ = layers_.elements_[i].value;
			p_ = layer_.cachePacket_.get(80);
			m_ = layer_.cachePacket_.get(77);
			u_ = layer_.cachePacket_.get(85);
			n_ = layer_.cachePacket_.get(78);
			t_ = layer_.cachePacket_.get(84);
			q_ = layer_.cachePacket_.get(81);
			table_ = document.createElement("table");
			table_.className="table table-condensed";
			item_.appendChild(table_);
			thead_ = document.createElement("thead");
			tr_ = document.createElement("tr");
			th_ = document.createElement("th");
			th_.innerHTML = "<span class=\"layer\">层："+key_+"</span>";
			tr_.appendChild(th_);
			thead_.appendChild(tr_);
			table_.appendChild(thead_);
			tbody_ = document.createElement("tbody");
			table_.appendChild(tbody_);
			//detail
			tr_ = document.createElement("tr");
			tbody_.appendChild(tr_);
			td_ = document.createElement("td");
			td_.innerHTML="<span id=\""+this.selectSSRCId_+":"+key_+"\"><span>P["+(p_?p_.successTotal_:0)+"/"+(p_?p_.total_:0)+"]</span><span>N["+(n_?n_.total_:0)+"]</span><span>Q["+(q_?q_.total_:0)+"]</span><span>L["+layer_.loss_+"]</span><span>T["+(t_?t_.total_:0)+"]</span></span>";
			tr_.appendChild(td_);
			if(key_==0)
			{
				td_.innerHTML="<span id=\""+this.selectSSRCId_+":"+key_+"\"><span>M["+(m_?m_.successTotal_:0)+"/"+(m_?m_.successTotal_:0)+"]</span><span>U["+(u_?u_.total_:0)+"]</span><span>Q["+(q_?q_.total_:0)+"]</span><span>L["+layer_.loss_+"]</span></span>";
				continue;
			}
			//P
			tr_ = document.createElement("tr");
			tbody_.appendChild(tr_);
			td_ = document.createElement("td");
			tr_.appendChild(td_);
			for(var j=0;j<256;j++)
			{
				span_ = document.createElement("span");
				span_.className="p-units";
				span_.setAttribute("id",this.selectSSRCId_+":"+key_+":p:"+j);
				span_.setAttribute("title",j);
				color_ = this.colors_.normal;
				if(p_&&p_.data&&p_.data.get(j))
				{
					color_ = this.colors_.has;
				}
				span_.style.backgroundColor=color_;
				td_.appendChild(span_);
//				if((j+1)%64==0&&j!=254)
//				{
//					br_ = document.createElement("br");
//					td_.appendChild(br_);
//				}
			}
		}
	},
	
	updataChannel_:function(_id)
	{
		if(!this.ssrcs_)
		{
			return;
		}
		if(this.selectSSRCId_ == _id)
		{
			this.selectSSRCId_ = -1;
			this.showChannel_(_id);
		}
	},
	channelMessage_:function(_id,_key,_value)
	{
		var item_;
		
		switch(_key)
		{
		case "neg":
			item_ = document.getElementById(_id);
			if(item_)
			{
				item_.firstChild.firstChild.childNodes[2].innerHTML = "（"+_value.ng+"-"+_value.ngseq+"）";
			}
			if(_id==this.selectPeerId_)
			{
				this.selectPeerId_ = -1;
				this.showDes_(_id);
			}
			break;
		case "syncStatus":
			item_ = document.getElementById(_id+"-status");
			if(item_)
			{
				item_.className = "status-"+String.fromCharCode(_value);
				item_.innerHTML = String.fromCharCode(_value);
			}
			break;
		case "send":
			if(_value==75||_value==107)
			{
				break;
			}
			item_ = document.getElementById(_id+"-message");
			if(item_)
			{
				console.log("发送",_value,String.fromCharCode(_value));
				item_.innerHTML = "【发送"+(_value==0?"协商":String.fromCharCode(_value))+"】";
			}
			break;
		case "receive":
			if(_value==75||_value==107)
			{
				break;
			}
			item_ = document.getElementById(_id+"-message");
			if(item_)
			{
				item_.innerHTML = "【接受"+(_value==0?"协商":String.fromCharCode(_value))+"】";
			}
			break;
		case "layer-message":
			item_ = document.getElementById(_id);
			if(item_)
			{
				if(_value.type==80)
				{
					item_.firstChild.innerHTML="P["+_value.success+"/"+_value.total+"]";
				}
				else if(_value.type==77)
				{
					item_.firstChild.innerHTML="M["+_value.success+"/"+_value.total+"]";
				}
				else if(_value.type==85)
				{
					item_.childNodes[1].innerHTML="U["+_value.total+"]";
				}
				else if(_value.type==81)
				{
					item_.childNodes[2].innerHTML="Q["+_value.total+"]";
				}
				else if(_value.type==78)
				{
					item_.childNodes[1].innerHTML="N["+_value.total+"]";
				}
				else if(_value.type==84)
				{
					if(item_.childNodes.length>4)
					{
						item_.childNodes[4].innerHTML="T["+_value.total+"]";
					}
				}
			}
			break;
		case "loss":
			item_ = document.getElementById(_id);
			if(item_)
			{
				item_.childNodes[3].innerHTML="T["+_value.total+"]";
			}
			break;
		case "P":
			var tmpId_ = _id+":p:"+_value.num;
			item_ = document.getElementById(tmpId_);
			if(item_)
			{
				var color_ = this.colors_.normal;
				switch(_value.type)
				{
				case "add":
					color_ = this.colors_.has;
					break;
				case "remove":
					color_ = this.colors_.del;
					break;
				case "insert":
					color_ = this.colors_.insert;
					break;
				}
				item_.style.backgroundColor = color_;
			}
			break;
		}
	},
};
rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.Manager = JClass.extend_({
	opened_ : false,
	id_:null,
	totalConut_:0,
	maxActiveSession_:10,
	beginRegisterTime_:0,
	connectedTime_:0,
	peerMaxConnectingTime_:100*1000,//最大死亡时间
	activeSessionCount_:0,//当前活跃节点数
	controller_:null,
	peers_ : null,
	global_:null,
	strings_:null,
	config_:null,
	broadcast_:null,
	
	tag_:"com::relayCore::webrtc::Manager",

	init : function(_controller) {
		this.peers_ = new rc$.com.relayCore.utils.Map();
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.controller_ = _controller;
	},

	open : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::open 打开webrtp管理", this.tag_));
		this.opened_ = true;
		this.activeTime_ = this.global_.getMilliTime_();
//		this.sessionTimer_ = this.setTimeout_(rc$.com.relayCore.webrtc.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 1 * 1000);
		return true;
	},
	addPeer:function(_params)
	{
		var isExit_ = this.peers_.find(_params.remoteId);
		if(!isExit_)
		{
			if (this.peers_.size() >= this.maxActiveSession_ * 2) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Peer is max, cancle",this.tag_));
				return;
			}
			var peer_ = new rc$.com.relayCore.webrtc.Peer(this,_params);
			this.peers_.set(_params.remoteId, peer_);
			this.broad_({type:"add",peer:peer_});
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addPeer, id({1})from({2})remote({3})size({4})",this.tag_,_params.id,_params.from,_params.remoteId,this.peers_.size()));
		}
	},
	////////
	removePeerById_:function(_peerId)
	{
		if(this.peers_.find(_peerId))
		{
			this.controller_.OnPeerClose_(_peerId);
			this.peers_.get(_peerId).clear();
			this.peers_.remove(_peerId);
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removePeerById close Peer({1}),peers({2})",this.tag_, _peerId,this.peers_.length));
			this.broad_({type:"remove",id:_peerId});
		}
	},
	getPeerById_:function(_id)
	{
		return this.peers_.get(_id);
	},
	getSSRCManager_:function()
	{
		return this.controller_.ssManager_;
	},
	broad_:function(_params)
	{
		if(this.broadcast_)
		{
			this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypePeer,data:_params});
		}
	},
	close_:function()
	{
		var el_;
		for(var i=0;i<this.peers_.length;i++)
		{
			el_ = this.peers_.elements_[i].value;
			el_.close();
		}
		this.peers_.clear();
	}
});
rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.PeerStatic = {
		kTimerTypeOnInit : 1
};
rc$.com.relayCore.webrtc.Peer = JClass.extend_({
	config_:null,
	global_:null,
	strings_:null,
	channel_:null,
	peer_ : null,
	peerId_:null,
	remoteId_ : 0,
	fromServer_ : false,
	manager_ : null,
	id_ : "",
	tag_:"com::relayCore::webrtc::Peer",
	
	
	init:function(_manager,_params)
	{
    	this.config_ = rc$.com.relayCore.vo.Config;
    	this.global_ = rc$.com.relayCore.utils.Global;
    	this.strings_ = rc$.com.relayCore.utils.String;
    	this.channel_ = new rc$.com.relayCore.webrtc.Channel(this);
    	this.manager_ = _manager;
    	this.id_ = _params.id;
    	this.fromServer_ = _params.from;
    	this.remoteId_ = _params.remoteId;
    	this.peer_ = _params.peer;
    	this.setPeerEvents_(this.peer_);
    	this.peerId_ = this.remoteId_;
    	if(this.fromServer_)
    	{
    		this.channel_.createChannel_({"name":"peerChannel","id":0});
    	}
	},
	setPeerEvents_ : function(_peer) {
		var scope_ = this;
		_peer.ondatachannel = function(evt) {
			scope_.onPeerDataChannel_(evt);
		};
	},
	onPeerDisconnet_:function()
	{
		this.manager_.removePeerById_(this.peerId_);
	},
	onPeerDataChannel_: function( _evt )
	{
		var channel_ = _evt.channel;
		//检查
		var isReject_ = false;
		if(channel_.id!=0)
		{
			var sid_ = channel_.label.split(":")[1];
			//检查是否存在该资源
			var myssrcs_ = this.manager_.getSSRCManager_().ssrcs_;
			var ssrcId_ = this.strings_.format("{0}:{1}",sid_,"relay");
			if(myssrcs_.find(ssrcId_))//存在relay级别服务
			{
				if(myssrcs_.get(ssrcId_).getMainChannelPeer_()==this.peerId_)
				{
					P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onPeerDataChannel 接收到Peer({1})存在(relay)主channel({2}),拒绝！",this.tag_, myssrcs_.get(ssrcId_).getMainChannelPeer_(),channel_.label));
					isReject_=true;
				}
			}
			else
			{
				ssrcId_ = this.strings_.format("{0}:{1}",sid_,"serving");
				if(myssrcs_.find(ssrcId_))//存在relay级别服务
				{
					if(myssrcs_.get(ssrcId_).getMainChannelPeer_()==this.peerId_)
					{
						P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onPeerDataChannel 接收到Peer({1})存在(serving)主channel({2}),拒绝！",this.tag_, myssrcs_.get(ssrcId_).getMainChannelPeer_(),channel_.label));
						isReject_=true;
					}
				}
			}
		}
		if(isReject_||(channel_.id>0&&channel_.label.indexOf("@SYNC")==-1))
		{
			channel_.close();
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerDataChannel ({1}) Receive PeerDataChannel,channel name({2}),id({3})",this.tag_, this.remoteId_,channel_.label,channel_.id));
		this.channel_.createChannel_({"channel":channel_});
	},
	setTimeout_ : function(_tag, _timer, _milliSeconds) {
		var scope_ = this;
		_timer = setTimeout(function() {
			scope_.onTimeout_(_tag, _timer);
		}, _milliSeconds);
		return _timer;
	},
	onTimeout_ : function(_tag, _timer, _errorCode) {
		switch (_tag) {
		case rc$.com.relayCore.webrtc.PeerStatic.kTimerTypeOnInit:/*初始化超时*/
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::初始化信息交换超时，放弃通信", this.tag_));
			this.initTimer_ = null;
			//放弃通信
			this.closeChannel_(0);
			break;
		default:
			break;
		}
	},
	disconnect : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::disconnect ({1}) disconnect... ", this.tag_,this.peerId_));
		this.channel_.close();
		if (this.peer_) {
			this.peer_.close();
			this.peer_ = null;
		}
		this.connecting_ = false;
	},
	updateSSRC_:function()
	{
		
	},
	clear:function()
	{
		this.config_=null;
		this.global_=null;
		this.strings_=null;
		if(this.channel_)
		{
			this.channel_.close_();
			this.channel_=null;
		}
		this.peer_=null;
		this.peerId_=null;
		this.remoteId_=0;
		this.fromServer_=false;
		this.manager_=null;
		this.id_ = "";
		this.tag_="";
	}
});
rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.PeerSSRCStatus = {
		UNKNOWN:0,
		KNOWN:1,
		UNSYNC:2
};
/**
 * 频道管理
 * 保存各种级别channel
 */
rc$.com.relayCore.webrtc.Channel = JClass.extend_({
	dataChannels_ : null,
	timestamp_:-1,
	context_:null,
	packet_:null,
	negPacket_:null,
	bytesPacket_:null,
	isHasNewNg_:false,//当前是否协商完后还有新的协商
	ngStatus_:false,//当前是否处在协商中
	ng_:0,//协商完成序列号
	lastPacket_:null,//最后一次交换信息数据
	initTimerOutId_:-1,//首次超时计时
	initTimerOutInterval_:30*1000,//首次超时计时
	ssrcTimerOutId_:-1,//ssrc同步超时标示
	ssrcTimerOutInterval_:30*1000,//ssrc同步超时时间
	remoteSSRCStatus_:0,//对端资源情况
	remoteOwned_:null,//保留对端Owned
	//保存数值
	uRTT_:0,
	uJitter_:0,
	uPackLossRate_:0,
	uSPC_:null,
	owned_:null,
	global_:null,
	strings_:null,
	mappedIds_:null,
	tag_:"com::relayCore::webrtc::Channel",
	
	init:function(_context)
	{
		this.context_ = _context;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.dataChannels_ = new rc$.com.relayCore.utils.Map();
		this.mappedIds_ = new rc$.com.relayCore.utils.Map();
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.packet_ = new rc$.com.relayCore.webrtc.PacketProcess(this);
		this.negPacket_ = new rc$.com.relayCore.webrtc.packets.NegPacket(this);
		this.remoteOwned_ = null;
		this.owned_ = [];
	},
	createChannel_:function(_params)
	{
		var dataChannel_;
		if(_params.channel)
		{
			dataChannel_ = _params.channel;
		}
		else
		{
			var dsp_ = {"ordered":false};
			dsp_.id = _params.id;
			try{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createChannel peerId({1})!",this.tag_,this.context_.peerId_));
				dataChannel_ = this.context_.peer_.createDataChannel(_params.name,dsp_);
			}
			catch(e)
			{
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::createChannel peerId({1})params({2})! error({3})",this.tag_,this.context_.peerId_,JSON.stringify(dsp_),e.toString()));
			}
		}
		if(!dataChannel_)
		{
			return null;
		}
		var metaChannel_ = new rc$.com.relayCore.webrtc.MetaChannel(this,dataChannel_,_params);
		this.dataChannels_.set(dataChannel_.id,metaChannel_);
		this.setChannelEvents_(dataChannel_);
		return dataChannel_;
	},
	setChannelEvents_ : function(_channel) {
		var scope_ = this;
		_channel.onopen = function(evt) {
			scope_.onChannelOpen_(evt);
		};
		_channel.onmessage = function(evt) {
			scope_.onChannelMessage_(evt);
		};
		_channel.onerror = function(evt) {
			scope_.onChannelError_(evt);
		};
		_channel.onclose = function(evt) {
			scope_.onChannelClose_(evt);
		};
	},
	//channel事件
	onChannelOpen_: function(_evt)
	{
		var channel_ = _evt.target;
		//打开数据发送心跳
		this.context_.connecting_ = true;
		var cid_ = channel_.id;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onChannelOpen peerId({1}) Channel({2}) open success!!!!!!!!!!!!!!", this.tag_,this.context_.peerId_,cid_));
		var metaChannel_ = this.dataChannels_.get(cid_);
		if(metaChannel_ == null)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onChannelOpen id({1}) metaChannel 不存在", this.tag_,cid_));
			return;
		}
		metaChannel_.startPing_();
		if(cid_ == 0)//初始化交换信息
		{
			this.sendNeg_();
			var callback_ = this.initTimeOut_.bind(this);
			this.initTimerOutId_ = setTimeout(callback_, this.initTimerOutInterval_);
			return;
		}
		this.context_.manager_.controller_.ssManager_.addChannel_(metaChannel_);
	},
	
	//自言关闭了，检查是否需要重新协商
	onSSRCUpdate_:function()
	{
		var myowned_ = this.getOwned_();
		if(this.strings_.compareTo_(JSON.stringify(myowned_),JSON.stringify(this.owned_))!=0)//对比资源
		{
			if(this.ngStatus_)//协商进行中。。。
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg 上一个协商还未完成，等待...", this.tag_,this.context_.peerId_));
				this.isHasNewNg_ = true;
				return;
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCUpdate peerId({1})资源发生变化！", this.tag_,this.context_.peerId_));
			this.sendNeg_(true);
		}
	},
	sendNeg_:function(_status)
	{
		if(_status)//资源变动，重新协商
		{
			this.negPacket_.status_ = 0;
			if(this.negPacket_.ngId_>0)
			{
				this.negPacket_.ngId_ = this.ng_+1;//重新协商序列号加1	
			}
			this.isHasNewNg_ = false;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg peerId({1}) 重新协商！", this.tag_,this.context_.peerId_));
		}
		this.ngStatus_ = true;
		var channel_ = this.dataChannels_.get(0);
		if(!channel_)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg peerId({1}) 节点已经断连！", this.tag_,this.context_.peerId_));
			return;
		}
		this.lastPacket_ = this.negPacket_.getPacket_();
//		console.log(this.lastPacket_);
		this.sendMessage_(this.lastPacket_,channel_);
	},
	onChannelMessage_: function(_evt)
	{
		//接收到数据
		var channel_ = _evt.target;
		var data_ = _evt.data;
		var cid_ = channel_.id;
		var metaChannel_ = this.dataChannels_.get(cid_);
		if(metaChannel_ == null)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onChannelMessage id({1}) metaChannel 不存在", this.tag_,cid_));
			return;
		}
		var dataType_ = typeof(data_);
		if(dataType_ == "string")
		{
			if(cid_ == 0)//协商层
			{
				metaChannel_.broad_("receive",0);
				this.ngStatus_ = true;
				if(this.initTimerOutId_ > 0)
				{
					clearTimeout(this.initTimerOutId_);
					this.initTimerOutId_ = -1;
				}
				var message_ = {type:"negotiation",data:data_};
				this.packet_.process_(message_);
				return;
			}
		}
		else
		{
			var stype_ = rc$.com.relayCore.utils.Number.convertToValue_('1',new Uint8Array(data_),0);
			metaChannel_.broad_("receive",stype_);
			switch(stype_)
			{
			case 75://K Ping包
				//返回响应包
				metaChannel_.send_({type:"byte",data:{type:107}});
				break;
			default:
				metaChannel_.respond_();
				this.context_.manager_.getSSRCManager_().receiveMessage_({type:stype_,channel:metaChannel_,data:new Uint8Array(data_)});
				break;
			}
		}
	},
	onChannelError_ : function(_evt) {
		this.removeChannel_(_evt.target);
	},

	onChannelClose_ : function(_evt) {
		//this.removeChannel_(_evt.target);
	},
	removeChannel_:function(_channel)
	{
		var cid_=_channel.id;
		if(this.dataChannels_.find(cid_)){
			var metaChannel_ = this.dataChannels_.get(cid_);
			this.dataChannels_.remove(cid_);
			//删除本地同步列表中的信息
			if(metaChannel_.label_.indexOf("@SYNC")>-1)//删除ssrc资源中dataChannel的信息
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel_ peer({1})删除资源频道({2})", this.tag_,this.context_.peerId_,metaChannel_.label_));
				this.context_.manager_.controller_.ssManager_.removeChannel_(metaChannel_);
			}
			metaChannel_.clear_();
//			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onChannelClose peer({1}) channelId({2}),channels({3})", this.tag_,this.context_.peerId_,id_,this.dataChannels_.length));
			if(this.dataChannels_.length == 0)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel_ peer({1})所有dataChannel关闭！该peer断连)", this.tag_,this.context_.peerId_));
				this.context_.onPeerDisconnet_();
			}
		}
	},
	initTimeOut_:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::initTimeOut peer({1})初始化交换信息超时", this.tag_,this.context_.remoteId_));
	},
	closeChannelById_ : function(_id) {
		if(_id != null && this.dataChannels_.find(_id))
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::closeChannel channelId({1})", this.tag_,_id));
			var metaChannel_ = this.dataChannels_.get(_id);
			metaChannel_.close_();
		}
	},
	close_:function()
	{
		var el_;
		for(var i=0;i<this.dataChannels_.length;i++)
		{
			el_ = this.dataChannels_.element(i);
			el_.value.close_();
		}
		this.dataChannels_.clear();
		if(this.ssrcTimerOutId_>0)
		{
			clearInterval(this.ssrcTimerOutId_);
			this.ssrcTimerOutId_ = -1;
		}
	},
	sendMessage_:function(_message,_channel)
	{
		if(_channel == null)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::sendMessage metaChannel 不存在", this.tag_));
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendMessage peerId({1}),NG({2})", this.tag_,_channel.peerId_,_message.Negotiate));
		try {
			_channel.send_({type:"json",data:_message});
		} catch (e) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendMessage_ failed, {1}",this.tag_, e.toString()));
		}
	},
	//本地资源列表
	getOwned_:function()
	{
		var myssrcs_ = this.context_.manager_.getSSRCManager_().ssrcs_;
		if(myssrcs_.length == 0)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getOwned, 当前还不存在任何媒体流",this.tag_));
			return [];
		}
		var owned_ = [];
		var ssrc_;
		var startMappedId_ = this.context_.fromServer_ ?1:2;
		var spc_,myroute_,routes_=[],rIndex_,index_=-1,ttl_,reject_,peerId_;
		for(var i=0;i<myssrcs_.length;i++)
		{
			rIndex_ = -1;
			ttl_ = -1;
			ssrc_ = myssrcs_.elements_[i].value;
			peerId_ = ssrc_.getMainChannelPeer_();
			spc_ = -1;
			switch(ssrc_.level)
			{
			case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
				spc_ = ssrc_.spc;
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
				spc_ = ssrc_.getSPC_(this.context_.peerId_);
				break;
			}
			if(spc_!=-1)
			{
				myroute_ = ssrc_.getRoute_();
				if(myroute_)
				{
					routes_.push(myroute_.route);
					index_++;
					rIndex_ = index_;
					ttl_ = myroute_.ttl;
				}
				if(this.mappedIds_.find(ssrc_.id))
				{
					mappedId_=this.mappedIds_.get(ssrc_.id);
				}
				else
				{
					//生成一个新的mappId
					mappedId_=this.mappedIds_.length*2+startMappedId_;
					this.mappedIds_.set(ssrc_.id,mappedId_);
				}
				var params = {
						id:ssrc_.id,
						channel:ssrc_.channel,
						mappedId:mappedId_,
						spc:spc_,
						layer:ssrc_.layer,
						routeIndex:rIndex_,
						routeTTL:ttl_,
						peerId:peerId_
						};
				if(!this.hasOwned_(owned_,params))
				{
					owned_.push(params);
				}
			}
		}
		//排序
		this.negPacket_.sortSSRC_(owned_);
		this.routes_ = routes_;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getOwned, 当前存在媒体流个数({1})",this.tag_,owned_.length));
		return owned_;
	},
	hasOwned_:function(_owned,_value)
	{
		var exit_=false;
		var tmp;
		for(var i=0;i<_owned.length;i++)
		{
			if(_owned[i].id == _value.id)
			{
				exit_ = true;
				break;
			}
		}
		return exit_;
	},
	//本地想同步资源
	getWanted_:function()
	{
		return [];
	},
	
	onNegOver_:function()
	{
		if(this.isHasNewNg_)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1})有一个新的协商继续...", this.tag_,this.context_.peerId_));
			this.sendNeg_(true);
			return false;	
		}
		//对外广播
		this.broad_("neg",{"ng":this.ng_,"ngseq":this.negPacket_.ngId_});
		//开启资源同步定时,检查是否需要开启资源同步
		this.syncSSRC_();
//		this.ngStatus_ = false;
		if(this.ssrcTimerOutId_>0)
		{
			clearTimeout(this.ssrcTimerOutId_);
		}
		var callback_=this.checkSSRCStatus_.bind(this);
		this.ssrcTimerOutId_ = setTimeout(callback_,this.ssrcTimerOutInterval_);
	},
	///检查当前资源是否已经开始同步
	checkSSRCStatus_:function()
	{
		var unsynced_ = [];
		var ssrc_,id_;
		var syncing_ = this.getSyncStatus_();
		for(var i=0;i<this.negPacket_.synced_.length;i++)
		{
			ssrc_ = this.negPacket_.synced_[i];
			id_ = this.strings_.format("{0}:{1}",ssrc_.id,ssrc_.mappedId);
//			console.log(this.synced_.find(id_),id_);
			if(!syncing_.find(id_))
			{
				if(this.addToUnSync_(ssrc_))
				{
					unsynced_.push(ssrc_);
				}
			}
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkSSRCStatus, peerId({1})协商列表中有({2})个未进行同步的.",this.tag_,this.context_.peerId_,unsynced_.length));
		if(unsynced_.length>0)
		{
			//发起新的协商
			var maxLayer_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
			//关闭对应的Channel
			for(var i=0;i<unsynced_.length;i++)
			{
				var layerArr_ = unsynced_[i].layer?unsynced_[i].layer:[0];
				for(var j=0;j<layerArr_.length;j++)
				{
					id_ = layerArr_[j]*(1024/maxLayer_)+ssrc_.mappedId_;
					if(this.dataChannels_.find(id_))
					{
						this.closeChannelById_(id_);
					}
				}
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkSSRCStatus, peerId({1})协商列表中有未进行同步的SSRC({2}).",this.tag_,this.context_.peerId_,JSON.stringify(unsynced_)));
			this.negPacket_.ngId_++;//重新协商
			this.sendNeg_();
		}
	},
	//添加到非同步列表
	addToUnSync_:function(_ssrc)
	{
		var id_ = this.strings_.format("{0}:{1}",_ssrc.id,_ssrc.mappedId);
		var ssrc_ = this.negPacket_.getSync_(this.negPacket_.unsynced_,[_ssrc],false);
		if(ssrc_.length>0)
		{
			this.negPacket_.addunSync_(ssrc_);
			return true;
		}
		return false;
	},
	getSYNC_:function(_id)
	{
		var mysynced_ = this.negPacket_.synced_;
		for(var i=0;i<mysynced_.length;i++)
		{
			if(mysynced_[i].id == _id)
			{
				return mysynced_[i];
			}
		}
		return null;
	},
	syncSSRC_:function(_params)
	{
		var ssrc_,ssrcId_,level_,mappedId_,channelName_,channelId_,channel_,syncId_,ssrcFrom_;
		var maxLayer_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
		var mysynced_ = this.negPacket_.synced_;
		var from_ = this.context_.fromServer_?0:1;
		var myssrcs_ =this.context_.manager_.getSSRCManager_().ssrcs_;
		var syncing_ = this.getSyncStatus_();
		var route_,mainChannelId_;
		for(var i=0;i<mysynced_.length;i++)
		{
			if(_params&&mysynced_[i].id != _params.id)
			{
				continue;
			}
			mappedId_ = mysynced_[i].mappedId;
			level_ = (from_+mappedId_)%2;//0是已同步
			if(level_==1)
			{
				continue;
			}
			//如果Sourcing服务里存在维护的scps,则无需同步该流
			ssrcId_ = this.strings_.format("{0}:{1}",mysynced_[i].id,"sourcing");
			if(myssrcs_.find(ssrcId_))//存在sourcing级别的服务
			{
				ssrc_ = myssrcs_.get(ssrcId_);
				//判断该级别的spc中是否存在该spc
				if(ssrc_.spcs_.values().indexOf(mysynced_[i].spc)>-1)
				{
					P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncSSRC, SSRC({1})存在Sourcing级别的服务。不同步",this.tag_,JSON.stringify(mysynced_[i])));
					continue;
				}
			}
			//判断是不是已经同步该流
			syncId_ = this.strings_.format("{0}:{1}",mysynced_[i].id,mappedId_);
			if(syncing_.find(syncId_))
			{
				P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncSSRC, peerId({1})SSRC({2})已经在同步中..",this.tag_,this.context_.peerId_,JSON.stringify(mysynced_[i])));
				continue;
			}
			//检测是否是发给对方的
			
			if(this.remoteOwned_)
			{
				for(var j=0;j<this.remoteOwned_.length;j++)
				{
					if(this.remoteOwned_[j].id==mysynced_[i].id&&this.remoteOwned_[j].mappedId==mysynced_[i].mappedId)
					{
						mainChannelId_ = this.remoteOwned_[j].peerId;
					}
				}
			}
			if(mainChannelId_==this.context_.id_)
			{
				P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSync 拉流的Peer的主Channel为自己，不需要同步该SSRC({1})", this.tag_,JSON.stringify(mysynced_[i])));
				continue;
			}
			
			layerArr_ = [];
			if(typeof(mysynced_[i].layer)=="number")
			{
				for(var j=0;j<mysynced_[i].layer;j++)
				{
					layerArr_.push(j);
				}
			}
			else
			{
				layerArr_ = mysynced_[i].layer;
			}
			channelName_ = "@SYNC"+this.strings_.getRandom_();
			channelName_ += ":"+mysynced_[i].id;
			var tmp_ = channelName_;
			for(var j=0;j<layerArr_.length;j++)
			{
				channelId_ = layerArr_[j]*(1024/maxLayer_)+mappedId_;
				if(layerArr_[j]!=0)
				{
					tmp_ = channelName_ +":"+layerArr_[j];
				}
				route_ = this.negPacket_.getRoute_(mysynced_[i]);//从对端路由提取当前channel路由信息
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::syncSSRC, peerId({1})channel({2})id({3})同步中..",this.tag_,this.context_.peerId_,tmp_,channelId_));
				this.createChannel_({name:tmp_,id:channelId_,route:route_});
			}
		}
	},
	getSyncStatus_:function()
	{
		var syncs_ = new rc$.com.relayCore.utils.Map();
		var maxLayer_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
		var arr_,label_,layer,mappedId_,syncId_,channel_,cid_;
		for(var i=0;i<this.dataChannels_.length;i++)
		{
			channel_ = this.dataChannels_.elements_[i].value;
			label_ = channel_.label_;
			layer_ = channel_.layer_;
			cid_ = channel_.cid_;
			if(label_.indexOf("@SYNC")>-1)//同步流频道
			{
				arr_ = label_.split(":");
				mappedId_ = cid_-layer_*(1024/maxLayer_);
				syncId_ = this.strings_.format("{0}:{1}",arr_[1],mappedId_);
				if(!syncs_.find(syncId_))
				{
					syncs_.set(syncId_,1);
				}
			}
		}
		return syncs_;
	},
	setU_:function(_value)
	{
		var pk_ = this.bytesPacket_.decode_(_value);
		var ext_;
		if(pk_.data.ext)
		{
			ext_ = JSON.parse(pk_.data.ext);
			for(var i in ext_)
			{
				switch(i)
				{
				case "PackLossRate":
					this.uPackLossRate_ = 1-(1-this.uPackLossRate_)*(1-ext_[i]);
					break;
				case "RTT":
					this.uRTT_ = ext_[i]+this.uRTT_;
					break;
				case "Jitter":
					this.uJitter_ = ext_[i];
				case "SPC":
					this.uSPC_=ext_[i];
				}
			}
		}
	},
	broad_:function(_key,_value)
	{
		if(this.context_.manager_.broadcast_)
		{
			this.context_.manager_.broadcast_.channelMessage_(this.context_.peerId_,_key,_value);
		}
	}
});
rc$.ns("com.relayCore.webrtc.packets");
rc$.com.relayCore.webrtc.packets.NegPacket = JClass.extend_({
	ngId_:0,
	lmVer_:0,
	maxlayerCount_:8,
	synced_:[],
	unsynced_:[],
	congif_:null,
	tag_:"com::relayCore::webrtc::packets::NGPacket",
	remoteAdvertise_:null,
	lastAdvertise_:null,
	context_:null,
	strings_:null,
	global_:null,
	remoteRoute_:null,//路由信息
	routeActiveTime_:-1,//路由信息计时时间
	status_:0,
	
	init:function(_context)
	{
		this.context_ = _context;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.maxOwneds_ = this.config_.maxOwnedNum?this.config_.maxOwnedNum:this.maxOwneds_;
		this.synced_ = [];
		this.unsynced_ = [];
		this.remoteAdvertise_ = null;
		this.remoteRoute_ = null;
		this.routeActiveTime_=-1;
		this.lastAdvertise_ = null;
	},
	getPacket_:function()
	{
		var packet_ = {};
		packet_.Negotiate = this.ngId_;//协商序列号
		packet_.LMPNRC_Ver = this.lmVer_;//连接协议版本号。如果协商消息中不包含此域，应当直接放弃通讯。
		packet_.maxLayerCount = this.maxlayerCount_;//2^ 媒体流的最大层数（见上）。此数值必须是2的n次幂，合理的值在32（含）以内。
		packet_.synced = this.synced_;
		packet_.unsynced = this.unsynced_;
		var myOwned_ = this.context_.getOwned_();//获取本地资源
		var mysame_ = this.isSame_(myOwned_,this.context_.owned_);
		if(!mysame_||this.status_==0)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getPacket peer({1})资源发生变化需要发送Owned",this.tag_,this.context_.context_.peerId_));
			this.context_.owned_ = myOwned_;
			this.lastAdvertise_ = this.getAdvertise_();
			packet_.Advertise = this.lastAdvertise_;
		}
		return packet_;
	},
	getAdvertise_:function()
	{
		var resource_ = {};//协商资源信息，包含下列子对象中的一个或多个：
		if(this.synced_.length<this.config_.syncMax_)
		{
			resource_.owned = this.context_.owned_;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getAdvertise peerId({1})", this.tag_,this.context_.context_.peerId_));
		}
		else
		{//计算自己想要的
			var mywanted_ = this.context_.getWanted_();
			resource_.wanted = mywanted_;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getAdvertise peerId({1})->wanted({2})", this.tag_,this.status_,this.context_.context_.peerId_,JSON.stringify(resource_.wanted)));
		}
		resource_.route = this.context_.routes_;
		return  resource_;
	},
	//查看rec1中不存在rec2的SSRC
	getSync_:function(_rec1,_rec2,_status)
	{
		if(_rec1 == null||_rec2 == null)
		{
			return [];
		}
		var mysync_ = [],exit_;
		var params_ = ["id","channel","mappedId"];
		for(var i=0;i<_rec2.length;i++)
		{
			exit_ = false;
			for(var j=0;j<_rec1.length;j++)
			{
				exit_ = this.compareTo_(_rec2[i],_rec1[j],params_);
				if(exit_)
				{
					break;
				}
			}
			if(exit_==_status)
			{
				mysync_.push(_rec2[i]);
			}
		}
		return mysync_;
	},
	//添加到本地同步列表
	addSync_:function(_rec)
	{
		if(_rec.length==0)
		{
			return false;
		}
		var mysync_,hasUnsync_;
		for(var i=0;i<_rec.length;i++)
		{
			mysync_ = _rec[i];
			//如果存在于非同步列表则无需添加
			hasUnsync_ = this.getSync_(this.unsynced_,[mysync_],true);
			if(hasUnsync_.length>0)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSync 存在sync({1})", this.tag_,JSON.stringify(mysync_)));
				continue;
			}
			this.synced_.push({id:mysync_.id,channel:mysync_.channel,mappedId:mysync_.mappedId,layer:mysync_.layer,spc:mysync_.spc});
		}
		return true;
	},
	getRoute_:function(_ssrc)
	{
		//从对端获取
		var remoteSSRC_;
		if(this.context_.remoteOwned_)
		{
			for(var i=0;i<this.context_.remoteOwned_.length;i++)
			{
				if(this.context_.remoteOwned_[i].id==_ssrc.id)
				{
					remoteSSRC_ = this.context_.remoteOwned_[i];
					break;
				}
			}
		}
		var route_,ttl_;
		route_ = this.remoteRoute_[remoteSSRC_.routeIndex];
		ttl_ = remoteSSRC_.routeTTL;//剩余有效时间
		return {route:route_,ttl:ttl_,start:this.routeActiveTime_};
	},
	//添加到非同步列表
	addunSync_:function(_rec)
	{
		if(_rec.length==0)
		{
			return false;
		}
		var unsync_ = this.getSync_(this.unsynced_,_rec,false);
		for(var i=0;i<unsync_.length;i++)
		{
			for(var j=0;j<this.synced_.length;j++)
			{
				if(this.compareTo_(unsync_[i],this.synced_[j],["id","channel","mappedId"]))
				{
					this.synced_.splice(j,1);
				}
			}
			this.unsynced_.push(unsync_[i]);
			this.sortSSRC_(this.unsynced_);
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addunSync 增加一个UnSync({1})", this.tag_,JSON.stringify(unsync_)));
		return true;
	},
	deleteSync_:function(_owned)
	{
		var list_ = [];
		var level_;
		var from_ = this.context_.context_.fromServer_?0:1;
		for(var i=0;i<this.synced_.length;i++)
		{
			level_ = (from_+this.synced_[i].mappedId)%2;
			if(level_ == 0)
			{
				for(var j=0;j<_owned.length;j++)
				{
					if(this.synced_[i].id == _owned[j].id && this.synced_[i].mappedId == _owned[j].mappedId)
					{
						list_.push(this.synced_[i]);
					}
				}
			}
		}
		if(list_.length>0)
		{
			this.addunSync_(list_);
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::deleteSync 同步资源（{1}）不存在了", this.tag_,JSON.stringify(list_)));
		}
	},
	processData_:function(_data)
	{
		this.status_ = 1;
		var rec_,myowned_,mysynced_,syncStatus_,syncStatus2_;
		var myng_ = _data.Negotiate;
		if(_data.LMPNRC_Ver == null)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 协议版本号为空，放弃通信", this.tag_));
			return false;
		}
		if(Math.abs(this.ngId_ - this.context_.ng_)>this.config_.maxThreshold_)//大于阈值终断
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 阈值({1})超出最大阈值({2})，中断", this.tag_,this.ngId_ - this.context_.ng_,this.config_.maxThreshold_));
			return false;
		}
		this.ngId_++;//协商序列号加1
		var lv_ = _data.LMPNRC_Ver;//不一致使用较低版本
		if(lv_<this.lmVer_)
		{
			this.lmVer_ = lv_;
		}
		var mlc_ = _data.maxLayerCount;
		if(mlc_>this.maxlayerCount_)
		{
			this.maxlayerCount_ = mlc_;
		}
		if(_data.synced.length>0)//检查是否是需要从本地同步流
		{
			if(!this.isSame_(this.synced_,_data.synced))//不相同,更新
			{
				//重新计算本地与对端同步列表
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 同步列表不同，重新生成同步列表", this.tag_));
				syncs_ = this.getSync_(this.synced_,this.context_.owned_,false);
				this.addSync_(syncs_);
				syncs_ = this.getSync_(this.synced_,this.context_.remoteOwned_,false);
				this.addSync_(syncs_);
			}
		}
		if(_data.unsynced&&_data.unsynced.length>0)//协商停止同步
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 更新不同步列表", this.tag_));
			this.addunSync_(_data.unsynced);
		}
		rec_ = _data.Advertise;
		myowned_ = this.context_.owned_;
		syncStatus_=false;
		syncStatus2_=false;
		if(rec_ != null)//接收到Advertise
		{
			this.remoteAdvertise_ = rec_;  
			//首先检查本地owned_中不在sync的
			if(myowned_ != null)
			{
				mysynced_ = this.getSync_(this.synced_,myowned_,false);
				syncStatus_ = this.addSync_(mysynced_);
			}
			if(rec_.owned)
			{
				mysynced_ = this.getSync_(this.synced_,rec_.owned,false);
				syncStatus2_ = this.addSync_(mysynced_);
				///接收到对端owned
				this.context_.remoteOwned_ = rec_.owned;
				this.context_.remoteSSRCStatus_ = rc$.com.relayCore.webrtc.PeerSSRCStatus.KNOWN;
			}
			if(rec_.wanted)//如果接受的是wanted，则需查找本地ssrc是否有匹配的
			{
				mysynced_ = this.getSync_(myowned_,rec_.wanted,true);
				syncStatus2_ = this.addSync_(mysynced_);
				this.context_.remoteSSRCStatus_ = rc$.com.relayCore.webrtc.PeerSSRCStatus.UNKNOWN;
			}
			if(rec_.route)
			{
				this.remoteRoute_ = rec_.route;
				this.routeActiveTime_ = this.global_.getMilliTime_();
			}
			if(syncStatus_||syncStatus2_)
			{
				this.sortSSRC_(this.synced_);
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 本地是否需要同步({1})，是否存在新的同步({2})", this.tag_,syncStatus_,syncStatus2_));
			//检查本地不同的放到syned中
		}
		//检查同步列表中的资源需要在本地同步的是否还存在
		this.deleteSync_(myowned_);
		return true;
	},
	sortSSRC_:function(_ssrc)
	{
		var property_ = ["id","mappedId","spc"];
		_ssrc.sort(function(a,b){
			var len_ = property_.length;
			for(var i=0;i<len_;i++)
			{
				if(a[property_[i]] != null)
				{
					if((a[property_[i]]-b[property_[i]]) != 0)
					{
						return a[property_[i]]-b[property_[i]];
					}
				}
			}
            return a[property_[len_-1]]-b[property_[len_-1]];
            });
	},
	isSame_:function(_sy1,_sy2)
	{
		var isEx_ = this.getSync_(_sy1,_sy2,false);
		if(isEx_.length>0)
		{
			return false;
		}
		isEx_=this.getSync_(_sy2,_sy1,false);
		if(isEx_.length>0)
		{
			return false;
		}
		return true;
	},
	/*
	 * cesissisisi
	 */
	compareTo_:function(_value1,_value2,_params)
	{
		var b_ = true;
		for(var i=0;i<_params.length;i++)
		{
			switch(_params[i])
			{
			case "mappedId"://算出奇偶
				var m1_ = _value1.mappedId%2;
				var m2_ = _value2.mappedId%2;
				if(m1_!=m2_)
				{
					b_ = false;
				}
				break;
			default:
				if(_value1[_params[i]]!=_value2[_params[i]])
				{
					b_ = false;
				}
				break;
			}
			if(b_ == false)
			{
				break;
			}
		}
		return b_;
	}
});
rc$.ns("com.relayCore.webrtc.packets");
rc$.com.relayCore.webrtc.packets.BytesPacket = {
	// encode
	ext_:{
		C:0,
		H:0,
		K:0,
		M:16,
		N:0,
		P:16,
		Q:0,
		R:0,
		T:0,
		k:0
	},
	encode_ : function(_message) {
		var type_ = this.selectType_(_message.type);
		var packet_;
		if(type_ == "stream")
		{
			packet_ = this.streamEncode_(_message);
		}
		if(type_ == "meta")
		{
			packet_ = this.metaEncode_(_message);
		}
		return packet_;
	},
	decode_:function(_message)
	{
		var bytes_ = new Uint8Array(_message);
		var type_ = rc$.com.relayCore.utils.Number.convertToValue_('1', bytes_,0);
		var dataType_ = this.selectType_(type_);
		var obj_={type:dataType_};
		switch(dataType_)
		{
		case "stream":
			obj_.data = this.streamDecode_(bytes_);
			break;
		case "meta":
			obj_.data = this.metaDecode_(bytes_);
			break;
		default:
			break;
		}
		return obj_;
	},
	selectType_:function(_type)
	{
		var str_ = "未知";
		switch(_type)
		{
		case 72://H 媒体流数据包
		case 75://K Ping包
		case 107://k Ping的响应
		case 67://C 
		case 78://N
		case 80://P
		case 81://Q
		case 84://T
		case 85://U 媒体状态数据
		case 77://M 媒体流元数据包，包含校验哈希值
		case 82://R 媒体所在频道元数据
			str_ = "stream";
			break;
		default:
			str_ = "meta";
			break;
		}
		return str_;
	},
	streamEncode_:function(_message)
	{
		var sendDataSct_ = [ {
			"type_1" : _message.type?_message.type:81
		}// 0
		,{
			"mpt_1" : _message.mpt?_message.mpt:0
		}// 1
		,{
			"reveive_1" : 0
		}// 2
		,{
			"seq_1" : _message.seq?_message.seq:0
		}// 3
		,{
			"ts_4" : _message.ts?_message.ts:0
		}// 4
		,{
			"ext" : []
		}// 5
		,{
			"payload" :[]
		}// 6
		];
		var type_ = String.fromCharCode(_message.type);
		var extL_ = this.ext_[type_];
		var obj_;
		if(extL_>0)
		{
			obj_ = {};
			obj_["ext_"+extL_]=_message.ext?_message.ext:"";
			sendDataSct_[5].ext.push(obj_);
		}
		var mypayload_ = _message.payload?_message.payload:0;
		if(type_=="U")
		{
			obj_ = {};
			obj_.payload_utf=mypayload_;
		}
		else
		{
			obj_ = {};
			obj_.payload_d=mypayload_;
		}
		sendDataSct_[6].payload.push(obj_);
		return this.toBytes_(sendDataSct_);
	},
	streamDecode_:function(_value)
	{
		var message_ = {};
		var position_ = 0;
		message_.type = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 1;
		message_.mpt = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 2;
		message_.seq = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 1;
		message_.ts = rc$.com.relayCore.utils.Number.convertToValue_('4', _value, position_);
		position_ += 4;
		var ext_len = this.ext_[String.fromCharCode(message_.type)];
		if(ext_len>0)
		{
			message_.ext = rc$.com.relayCore.utils.Number.convertToValue_('utf', _value, position_,ext_len);
			position_ += ext_len;
		}
		var pay_len_ = _value.length-position_;
		if(message_.type==85)
		{
			message_.payload = rc$.com.relayCore.utils.Number.convertToValue_('utf', _value, position_,pay_len_);
		}
		else
		{
			message_.payload = rc$.com.relayCore.utils.Number.convertToValue_('d', _value, position_,pay_len_);
		}
		return message_;
	},
	metaEncode_:function(_message)
	{
		var _sendDataSct = [ {
			"status_1" : _message.type?_message.type:0
		}// 0
		,{
			"Layers_1" : _message.layers?_message.layer:0
		}// 1
		,{
			"AuthPoint_1" : _message.authpoint?_message.authpoint:0
		}// 2
		,{
			"receive_1" : 0
		}// 3
		,{
			"NTPS_4" : _message.ntps?_message.ntps:0
		}// 4
		,{
			"NTPSF_4" : _message.ntpsf?_message.ntpsf:0
		}// 5
		,{
			"SDPHash" : [{"len_4":16},{"sdp_utf":_message.sdphash?_message.sdphash:""}]
		}//6
		];
		if(_message.layers>1)
		{
			for(var i=0;i<_message.Tags.length;i++)
			{
				var tag_ = _message.Tags[i];
				_sendDataSct.push({"len_4":16,"tag_utf":tag_});
			}
		}
		return this.toBytes_(_sendDataSct);
	},
	metaDecode_:function(_value)
	{
		var message_ = {};
		var position_ = 0;
		message_.status = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 1;
		message_.Layers = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 1;
		message_.AuthPoint = rc$.com.relayCore.utils.Number.convertToValue_('1', _value, position_);
		position_ += 2;
		message_.NTPS = rc$.com.relayCore.utils.Number.convertToValue_('4', _value, position_);
		position_ += 4;
		message_.NTPSF = rc$.com.relayCore.utils.Number.convertToValue_('4', _value, position_);
		position_ += 4;
		message_.SDPHash = rc$.com.relayCore.utils.Number.convertToValue_('utf', _value, position_,16);
		position_ += 16;
		if(message_.Layers>1)
		{
			var len_ = 16;
			message_.Tags=[];
			for(var i=0;i<message_.Layers-2;i++)
			{
				message_.Tags.push(rc$.com.relayCore.utils.Number.convertToValue_('utf', _value, position_,len_));
				position_ += len_;
			}
		}
		return message_;
	},
	toBytes_:function(_value)
	{
		var arr_ = [];
		this.processObject_(_value, arr_);
		var size_ = 0;

		for ( var _i = 0; _i < arr_.length; _i++) {
			size_ += arr_[_i].length;
		}
		var sendData_ = new Uint8Array(size_);
		var count_ = 0;
		for ( var _i = 0; _i < arr_.length; _i++) {
			for ( var _j = 0; _j < arr_[_i].length; _j++) {
				sendData_[count_++] = arr_[_i][_j];
			}
		}
		return sendData_;
	},
	processObject_ : function(_obj, _array) {
		switch (typeof (_obj)) {
		case "array":
			for ( var i = 0; i < _obj.length; i++) {
				if (_obj[i] instanceof Array) {
					this.processObject_(_obj[i], _array);
				} else if (typeof (_obj[i]) == "object") {
					this.processObject_(_obj[i], _array);
				}
			}
			break;
		case "object":
			var element_;
			for ( element_ in _obj) {
				var size_ = element_.split("_")[1];
				if (size_) {
					rc$.com.relayCore.utils.Number.convertToBit_(size_, _obj[element_], _array);
				}
				if (!size_ && _obj[element_]) {
					this.processObject_(_obj[element_], _array);
				}
			}
			break;
		default:
			break;
		}
	}
};
rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.PacketProcess = JClass.extend_({
	negPacket_:null,
	bytesPacket_:null,
	channel_:null,
	strings_:null,
	tag_:"com::relayCore::webrtc::PacketProcess",
	init:function(_channel)
	{
		this.channel_ = _channel;
		this.strings_ = rc$.com.relayCore.utils.String;
	},
	//处理各种数据信息
	process_:function(_message)
	{
		var type_ = _message.type;
		switch(type_)
		{
		case "negotiation"://协商
			this.processNeg_(_message.data);
			break;
		case "meta"://元数据
			break;
		case "stream"://流数据
			break;
		default:
			break;
		}
	},
	processNeg_:function(_data)
	{
		var receivePacket_ = JSON.parse(_data);
		var ngPacket_ = this.channel_.lastPacket_;//用来协商的消息
		var needSend_ = false;
		var prd_=true;
		var negResult_=false;
		if(ngPacket_&&receivePacket_.Negotiate==ngPacket_.Negotiate)//最新消息
		{
			//下一级个需要是发送的序列号//
			negResult_ = this.compareTo_(ngPacket_,receivePacket_);
			if(!negResult_)//做一个新的协商
			{
				prd_ = this.channel_.negPacket_.processData_(receivePacket_);
			}
		}
		else if(receivePacket_.Negotiate == (this.channel_.negPacket_.ngId_+1))
		{
			prd_ = this.channel_.negPacket_.processData_(receivePacket_);//进行协商
			needSend_ = true;
			ngPacket_ = this.channel_.negPacket_.getPacket_();
			negResult_ = this.compareTo_(ngPacket_,receivePacket_);
		}
		if(!prd_){//错误,终断连接
				return false;
		}
		if(!negResult_)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1}) NG({2}) 协商不成立，继续...", this.tag_,this.channel_.context_.peerId_,receivePacket_.Negotiate));
			this.channel_.sendNeg_();
			return false;
		}
		
		if(needSend_)//下一个即将要发送的消息
		{
			this.channel_.sendNeg_();
		}
		this.channel_.ng_ = this.channel_.negPacket_.ngId_;//更新协商序完成列号
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1})协商成立,序列号({2})", this.tag_,this.channel_.context_.peerId_,this.channel_.ng_));
		//更新同步资源列表
		//对外广播
		this.channel_.ngStatus_ = false;
		this.channel_.onNegOver_();
	},
	compareTo_:function(_value1,_value2)
	{
		var propertise_ = ["Negotiate","LMPNRC_Ver","maxLayerCount","synced","unsynced","Advertise"];
		var result_ = true;
		var sy1_,sy2_,v1_,v2_,owned1_,owned2_;
		for(var i=0;i<propertise_.length;i++)
		{
			v1_ = _value1[propertise_[i]];
			v2_ = _value2[propertise_[i]];
			switch(propertise_[i])
			{
			case "synced":
			case "unsynced":
				sy1_ = this.channel_.negPacket_.getSync_(v1_,v2_,false);
				sy2_ = this.channel_.negPacket_.getSync_(v1_,v2_,false);
				if(sy1_.length>0||sy2_.length>0)
				{
					result_ = false;
				}
				break;
			case "Advertise":
				owned1_ = v1_?v1_.owned:[];
				owned2_ = v2_?v2_.owned:[];
				sy1_ = this.channel_.negPacket_.getSync_(owned1_,owned2_,false);
				sy2_ = this.channel_.negPacket_.getSync_(owned2_,owned1_,false);
				if(sy1_.length>0||sy2_.length>0)
				{
					result_ = false;
				}
				owned1_ = v1_?v1_.wanted:[];
				owned2_ = v2_?v2_.wanted:[];
				sy1_ = this.channel_.negPacket_.getSync_(owned1_,owned2_,false);
				sy2_ = this.channel_.negPacket_.getSync_(owned2_,owned1_,false);
				if(sy1_.length>0||sy2_.length>0)
				{
					result_ = false;
				}
				break;
			default:
				if(v1_!=v2_)
				{
					result_ = false;
				}
				break;
			}
			if(result_==false)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::compareTo ({1}),{2}-{3}", this.tag_,propertise_[i],JSON.stringify(v1_),JSON.stringify(v2_)));
				break;
			}
		}
		return result_;
	}
});
rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.MetaChannel = JClass.extend_({
	label_:null,//channel label
	id_:null,//唯一标示Id
	cid_:-1,//channel id
	level_:-1,
	from_:-1,
	layer_:-1,
	peerId_:null,
	
	activeTime_:0,
	createTime_:0,
	timestamp_:-1,
	seq_:-1,
	cachePacket_:null,//维护一个缓存消息
	channel_:null,
	context_:null,
	active_:false,
	interval_:5*1000,
	timerOutId_:-1,
	pingId_:-1,
	global_:null,
	strings_:null,
	config_:null,
	from_:-1,
	syncStatusId_:-1,
	syncStatusInterval_:300*1000,
	syncStatus_:67,
	sendSeqs_:null,//重传的序列号
	lossP_:0,//丢包
	
	unavailableTimes_:0,
	rsendTimes_:0,
	unavailableTimes_:0,
	route_:null,
	broadcast_:null,
	tag_:"com::relayCore::webrtc::MetaChannel",
	
	init:function(_context,_channel,_params)
	{
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.cachePacket_ = new rc$.com.relayCore.utils.Map();
		this.timerId_ = -1;
		this.pingId_ = -1;
		this.channel_ = _channel;
		this.context_ = _context;
		this.peerId_ = this.context_.context_.peerId_;
		this.from_ = this.context_.context_.fromServer_?0:1;
		this.label_ = this.channel_.label;
		var arr_ = this.label_.split(":");
		this.layer_ = arr_.length>2?Number(arr_[2]):0;
		this.cid_ = this.channel_.id;
		this.level_ = (this.from_+this.cid_)%2;
		if(this.label_.indexOf("@SYNC")>-1)
		{
			this.id_ = this.strings_.format("{0}:{1}:{2}", this.from_,this.peerId_, this.cid_);
		}
		this.active_ = true;
		this.route_ = _params.route,
		this.createTime_ = this.global_.getMilliTime_();
		this.sendSeqs_=[];
	},
	startPing_:function()
	{
		this.send_({type:"byte",data:{type:75}});
		this.startTimeout_();
	},
	startTimeout_:function()
	{
		this.stopTimeout_();
		if(this.temerOutId_ == -1)
		{
			var callback_ = this.timerOut_.bind(this);
			this.temerOutId_ = setTimeout(callback_,this.interval_);
		}
	},
	stopTimeout_:function()
	{
		if(this.temerOutId_ != -1)
		{
			clearTimeout(this.temerOutId_);
			this.temerOutId_ = -1;
		}
	},
	timerOut_:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::timerOut_ Ping send Out! peerId({1}),channelId({2}),close channel",this.tag_, this.peerId_,this.channel_.id));
		this.active_ = false;
		this.close_();
	},
	respond_:function()
	{
		this.active_ = true;
		this.activeTime_ = this.global_.getMilliTime_();
		this.stopTimeout_();
		//等待一个时间计时继续发送Ping
		if(this.pingId_ != -1)
		{
			clearTimeout(this.pingId_);
		}
		this.pingId_ = setTimeout(this.startPing_.bind(this),this.interval_);
	},
	addUnavailbleTime_:function()
	{
		this.unavailableTimes_++;
		//发送一个状态
		this.send_({type:"byte",data:{type:this.syncStatus_}});
		//清除其他不可用的检测
		if(this.unavailableTimes_>this.config_.unavailableMaxTimes_)//超过阈值关闭
		{
			this.close_();
		}
	},
	updateStatus_:function(_value)
	{
		if(this.syncStatus_ != _value)
		{
			//开启关闭超时
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::updateStatus peerId({1}),status({2})->({3})",this.tag_, this.peerId_,this.syncStatus_,_value));
			if(this.syncStatusId_>0)
			{
				clearTimeout(this.syncStatusId_);
				this.closeId_ = -1;
			}
			this.syncStatus_ = _value;
			if(this.syncStatus_==67)
			{
				var callback_ = this.timerOut_.bind(this);
				this.syncStatusId_ = setTimeout(callback_,this.syncStatusInterval_)
			}
			this.broad_("syncStatus",this.syncStatus_);
			return true;
		}
		return false;
	},
	redoSend_:function(_data,_seq)
	{
		if(this.sendSeqs_.indexOf(_seq)>-1)
		{
			return;
		}
		P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})发现丢包seq({2}),发送N", this.tag_,this.channel_.label,_seq));
		this.sendSeqs_.push(_seq);
		this.send_(_data);
	},
	send_:function(_value)
	{
		var type_ = _value.type;
		var packet_=_value.data;
		var messageType_=0;
		switch(type_)
		{
		case "json":
			packet_ = JSON.stringify(_value.data);
			messageType_=0;
			break;
		case "byte":
			packet_ = this.context_.bytesPacket_.encode_(_value.data);
			messageType_=rc$.com.relayCore.utils.Number.convertToValue_('1', packet_,0);
			break;
		default:
			messageType_=rc$.com.relayCore.utils.Number.convertToValue_('1', _value.data,0);
				break;
		}
		this.broad_("send",messageType_);
		if(this.channel_.readyState == "closing")
		{
			return;
		}
		if(this.channel_.id>0&&this.channel_.label.indexOf("@SYNC")==-1)
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::send_ peerId({1}),channelId({2)非法channel！",this.tag_, this.peerId_,this.channel_.id));
			this.close_();
			return;
		}
		try{
			this.channel_.send(packet_);
		}
		catch(e)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::send_ peerId({1}),channelId({2) fail({3})！",this.tag_, this.peerId_,this.channel_.id,e.toString()||""));
		}
		
	},
	getSYNC_:function()
	{
		var labelInfo_ = this.channel_.label.split(":");
		return this.context_.getSYNC_(labelInfo_[1]);
	},
	//更新和缓存消息
	updatePacket_:function(_message)
	{
		var type_ = _message.type;
		var cache_;
		if(this.cachePacket_.find(type_))
		{
			//更新
			cache_ = this.cachePacket_.get(type_);
			cache_.update_(_message);
			return;
		}
		cache_ = new rc$.com.relayCore.ssrcs.CacheData(this);
		cache_.update_(_message);
		this.cachePacket_.set(type_,cache_);
	},
	getActiveTime_:function()
	{
		return this.activeTime_-this.createTime_;
	},
	broad_:function(_type,_value)
	{
		this.broadcast_.channelMessage_(this.id_,_type,_value);
	},
	updateLossSEQ_:function(_rtt)
	{
		var rttb_ = this.context_.uRTT_;//副
		if(this.cachePacket_.find(72))//存在H
		{
			var Hb_ = this.cachePacket_.get(72);
			var ts_ = Hb_.timestamp_;
			var rtt_ = ts_-(rttb_-_rtt);
			this.seq_ = Hb_.getSEQ_(rtt_);
			if(this.seq_>-1)
			{
				P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::updateLossSEQ 设置channel({1})的seq({2}),可能存在丢包！",this.tag_, this.channel_.label,this.seq_));
			}
		}
	},
	getH_:function(_seq)
	{
		if(!this.cachePacket_.find(72))
		{
			return null;
		}
		var Hb_ = this.cachePacket_.get(72);
		if(!_seq&&Hb_.data.find(Hb_.seq_))
		{
			return Hb_.data.get(Hb_.seq_);
		}
		return Hb_.data.get(_seq);
	},
	close_:function()
	{
		this.channel_.close();
		this.context_.removeChannel_(this.channel_);
	},
	clear_:function()
	{
		this.activeTime_=-1;
		this.createTime_=0;
		this.channel_=null;
		this.context_=null;
		this.route_=null;
		this.active_=false;
		this.interval_=-1;
		this.stopTimeout_();
		this.broadcast_=null;
		if(this.pingId_!=-1)
		{
			clearTimeout(this.pingId_);
		}
		if(this.syncStatusId_>0)
		{
			clearTimeout(this.syncStatusId_);
			this.closeId_ = -1;
		}
		this.global_=null;
	}
});
rc$.ns("com.relayCore.vo");
rc$.com.relayCore.vo.Config=
{
	/*设置外部参数*/
	version:"1.0.1",//版本
	clientId:null,//客户端ID
	debugBarId:null,//调试面板
	auto:false,//是否自动启动rtc
	logLevel : 15,
	logType : 3,
	webrtcTotalNodeCount:0,
	//服务器配置地址
	webrtcServerHost_:"ws://10.75.134.220:8091",//ws://123.125.89.103:3852,
	stunServerHost:"stun:stun01.sipphone.com",//stun:106.39.244.125:3478,stun:111.206.210.145:8124,
	logServer:"http://10.58.132.159:8000",
	syncMax_:10,
	channel_:"test",
	prints_:[72,85],
	unavailableMaxTimes_:5,
	maxThreshold_:5,//最大阈值设定
	messageExpiredTime_:30*1000,//消息过期检测间隔
	test:"//"
};
rc$.ns("com.relayCore.statics");
rc$.com.relayCore.statics.Statics = JClass.extend_({
	config_:null,
	strings_:null,
	global_:null,
	controller_:null,
	tag_:"com::relayCore::statics::Statics",
	
	init:function(_controller)
	{
		this.controller_ = _controller;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.global_ = rc$.com.relayCore.utils.Global;
	},
	send_:function(_params)//发送数据上报
	{
		
	},
	close_:function()
	{
		this.config_=null;
		this.strings_=null;
		this.global_=null;
		this.controller_=null;
	}
});
rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.SyncLevel={
	RELAY:"relay",
	SERVING:"serving",
	SOURCING:"sourcing"
};
rc$.com.relayCore.ssrcs.SSRC = JClass.extend_({
	id:null,
	channel:null,
	level:"relay",
	sdp:null,
	spc:null,
	callback:null,//回调方法
	options:null,//参数作用域
	layer:0,

	timestamp_:0,
	routeIndex_:-1,
	activeTime_:0,
	manager_:null,
	
	ssrcChannel_:null,//本资源channel管理
	
	spcs_:null,
	config_:null,
	layers_:null,
	global_:null,
	strings_:null,
	bytesPacket_:null,
	
	checkPacketId_:-1,
	checkPacketInterval:30*1000,
	virCloseInterval_:60*1000,
	virTimeoutId_:-1,
	sendCID_:-1,
	sendCInterval_:5*1000,
	checkSyncId_:-1,//sourcing级别使用
	checkSyncInterval_:30*1000,
	
//	checkServeLevelId_:-1,
//	checkServeLevelInterval_:300*1000,
	//每种级别维护的Channel数量
	relaysyncMin_:1,
	servingsyncMin_:3,
	sourcingunsyncMin_:2,
	
	
	tag_:"com::relayCore::ssrcs::SSRC",
	
	init:function(_mgr,_params)
	{
		this.level = rc$.com.relayCore.ssrcs.SyncLevel.RELAY;
		this.manager_ = _mgr;
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.config_ = rc$.com.relayCore.vo.Config;
		rc$.apply(this,_params);
		this.layers_ = new rc$.com.relayCore.utils.Map();
		this.spcs_ = new rc$.com.relayCore.utils.Map();
		this.ssrcChannel_ = this.manager_.getChannelById_(this.id);
		this.ssrcChannel_.registerMethod_({name:"onAdd",body:this.addChannel_.bind(this)});
		this.ssrcChannel_.registerMethod_({name:"onRemove",body:this.removeChannel_.bind(this)});
	},
	initializeServing_:function()
	{
		//创建虚拟通道
		var layers_ = [];
		if(typeof(this.layer)=="number")
		{
			for(var i=0;i<this.layer;i++)
			{
				layers_.push(i);
			}
		}
		else
		{
			layers_ = this.layer;
		}
		var layerChannel_,cid_,channel_,label_,metaChannel_,hasChannels_,params_,layer_,type_,arr_,channelId_;
		switch(this.level)
		{
		case "relay":
			for(var i=0;i<layers_.length;i++)//创建各层
			{
				layerChannel_ = this.createLayer_(layers_[i]);
			}
			//添加serving中已有channel
			hasChannels_=this.ssrcChannel_.getChannelByType_({type:"@SYNC"});
			for(var i=0;i<hasChannels_.length;i++)//添加所有已同步Channel的管理
			{
				metaChannel_ = this.ssrcChannel_.getChannelById_(hasChannels_[i]);
				this.addChannel_(metaChannel_);
			}
			break;
		case "serving":
			//创建虚拟通道
			for(var i=0;i<layers_.length;i++)
			{
				layerChannel_ = this.createLayer_(layers_[i]);
				this.getSPC_(this.id);//分配spc
				//创建一个虚的需同步channel
				cid_ = this.strings_.format("{0}:{1}:{2}",0,this.id,1+layers_[i]*2);
				label_ = this.strings_.format("@VIR:{0}:{1}",this.id,layers_[i]);
				if(layerChannel_.unsyncChannels_.indexOf(cid_)==-1)
				{
					channel_ = this.createVirtualChannel_({label:label_,peerId:this.id,from:0,cid:1+layers_[i]*2,id:cid_,layer:layers_[i],callback:this.callback});
					channel_.onOpen_();
				}
			}
			this.createLayer_(0);//0层必须创建
			//添加relay中已有channel
			hasChannels_=this.ssrcChannel_.getChannelByType_({level:0});
			for(var i=0;i<hasChannels_.length;i++)//添加所有已同步Channel的管理
			{
				metaChannel_ = this.ssrcChannel_.getChannelById_(hasChannels_[i]);
				this.addChannel_(metaChannel_);
			}
			break;
		case "sourcing":
			//创建一个虚的已同步channel
			//创建虚拟通道
			for(var i=0;i<layers_.length;i++)
			{
				cid_ = this.strings_.format("{0}:{1}:{2}",1,this.id,1+layers_[i]*2);
				label_ = this.strings_.format("@VIR:{0}:{1}",this.id,layers_[i]);
				layerChannel_ = this.createLayer_(layers_[i]);
				if(layerChannel_.syncChannels_.indexOf(cid_)==-1)
				{
					if(this.virTimeoutId_>0)
					{
						clearTimeout(this.virTimeoutId_);
					}
					params_={
							label:label_,
							peerId:"VIR",
							from:1,
							cid:1+layers_[i]*2,
							id:cid_,
							layer:layers_[i]
							};
					channel_ = this.createVirtualChannel_(params_);
					channel_.onOpen_();
					this.settingMainChannel_(channel_);
				}
			}
			this.options.send = this.messageFromApp_.bind(this);
			break;
		}
		//打开定期检查同步状况
		if(this.checkSyncId_>0){clearInterval(this.checkSyncId_);}
		this.checkSyncId_ = setInterval(this.checkSyncStatus_.bind(this),this.checkSyncInterval_);
	},
	//对外接口
	
	stop_:function(_params)
	{
		var mylayers_=this.layers_.keys();//所有层
		if(_params.hasOwnProperty("layer"))
		{
			if(typeof(_params.layer)=="number")
			{
				mylayers_=[];
				for(var i=0;i<_params.layer;i++)
				{
					mylayers_.push(i);
				}
			}
			else
			{
				mylayers_ = _params.layer;
			}
		}
		var cid_,channel_;
		for(var i=0;i<mylayers_.length;i++)
		{
			cid_ = this.strings_.format("{0}:{1}:{2}",_params.level=="serving"?0:1,this.id,1+mylayers_[i]*2);
			channel_ = this.ssrcChannel_.getChannelById_(cid_);
			if(channel_)
			{
				channel_.close_();
			}
		}
	},
	addChannel_:function(_channel)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addChannel 添加level({1})Channel({2})",this.tag_,this.level,_channel.id_));
		var layerChannel_ = this.createLayer_(_channel.layer_);
		switch(this.level)
		{
		case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
			if(_channel.label_.indexOf("@SYNC")>-1)
			{
				if(_channel.level_==0)//
				{
					layerChannel_.syncChannels_.push(_channel.id_);//添加到已同步维护列表
					this.settingMainChannel_(_channel);
				}
				else
				{
					layerChannel_.unsyncChannels_.push(_channel.id_);//添加到需同步维护列表
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
			if(_channel.level_==0)
			{
				layerChannel_.syncChannels_.push(_channel.id_);//添加到已同步维护列表
				this.settingMainChannel_(_channel);
				//检查是否有VIR
//				if(_channel.label_.indexOf("@SYNC")>-1)//需要创建该层，并创建vir
//				{
					var virId_ = this.strings_.format("{0}:{1}:{2}",0,this.id,1+_channel.layer_*2);
					if(layerChannel_.unsyncChannels_.indexOf(virId_)==-1)
					{
						this.getSPC_(this.id);//分配spc
						label_ = this.strings_.format("@VIR:{0}:{1}",this.id,_channel.layer_);
						//创建一个虚的需同步channel
						var channel_ = this.createVirtualChannel_({label:label_,peerId:this.id,from:0,cid:1+_channel.layer_*2,id:virId_,layer:_channel.layer_,callback:this.callback});
						channel_.onOpen_();
					}
//				}
			}
			else
			{
				if(_channel.label_.indexOf("@VIR")>-1)
				{
					layerChannel_.unsyncChannels_.push(_channel.id_);//添加到需同步维护列表
				}	
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:/*维护两个以上需同步的dataChannel*/
			if(_channel.level_==1)
			{
				layerChannel_.unsyncChannels_.push(_channel.id_);//添加到需同步维护列表
			}
			else
			{ 
				if(_channel.label_.indexOf("@VIR")>-1)
				{
					layerChannel_.syncChannels_.push(_channel.id_);//添加到需同步维护列表
				}
			}
			
			break;
		}
		this.broad_({type:"add",id:_channel.id_});
		this.syncChannelStatus_(_channel.layer_);//更新已同步的状态
	},
	removeChannel_:function(_channel)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel 删除level({1})Channel({2})",this.tag_,this.level,_channel.id_));
		switch(this.level)
		{
		case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
			if(this.layers_.find(_channel.layer_))
			{
				if(_channel.level_==0)
				{
					this.layers_.get(_channel.layer_).syncChannels_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_channel.layer_});
					this.settingMainChannel_(_channel);//更新主channel
					if(this.layers_.get(_channel.layer_).syncChannels_<this.relaysyncMin_)//维护频道低于需求
					{
						this.getMoreChannel_(_channel);
					}
					if(this.layers_.get(_channel.layer_).syncChannels_.length==0)//删除最后一个已同步的channel，则向所有需同步的channel发送C
					{
						var C_=this.getMessageByType_(67);
						if(this.sendCID_ > 0){clearInterval(this.sendCID_);}
						this.sendCID_ = setInterval(this.relayMessage_.bind(this),this.sendCInterval_,{layer:[0],level:1,data:C_});
					}
				}
				else
				{
					this.layers_.get(_channel.layer_).unsyncChannels_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_channel.layer_});
					var unsyncChannels_ = this.ssrcChannel_.getChannelByType_({level:1});
					this.syncChannelStatus_(_channel.layer_);//更新channel状态
//					var syncChannels_ = this.ssrcChannel_.getChannelByType_(0);
					if(unsyncChannels_.length==0)//待同步的channel已经全部关闭
					{
						this.onSSRCClose_();
					}
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
			if(this.layers_.find(_channel.layer_))
			{
				if(_channel.level_==0)
				{
					this.layers_.get(_channel.layer_).syncChannels_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_channel.layer_});
					this.settingMainChannel_(_channel);//更新主channel
					if(this.layers_.get(_channel.layer_).syncChannels_<this.servingsyncMin_)//维护频道低于需求
					{
						this.getMoreChannel_(_channel);
					}
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:/*维护两个以上需同步的dataChannel*/
			if(this.layers_.find(_channel.layer_))
			{
				if(_channel.level_==1)
				{
					this.layers_.get(_channel.layer_).unsyncChannels_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_channel.layer_});
					if(this.layers_.get(_channel.layer_).unsyncChannels_<this.sourcingunsyncMin_)//维护频道低于需求
					{
						this.getMoreChannel_(_channel);
					}
					var virtualChannels_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_channel.layer_,type:"@VIR"});
					if(this.layers_.get(_channel.layer_).unsyncChannels_.length==0&&virtualChannels_.length==0)//虚通道关闭，并且需同步dataChannel都已关闭
					{
						this.onSSRCClose_();
					}
					this.syncChannelStatus_(_channel.layer_);//更新channel状态
				}
			}
			break;
		}
		this.broad_({type:"remove",id:_channel.id_});
	},
	getSPC_:function(_id)
	{
		if(this.spcs_.find(_id))
		{
			return this.spcs_.get(_id);
		}
		var spc_ = this.strings_.format("{0}-{1}-{2}",this.strings_.getRandom_(5),this.strings_.getRandom_(5),this.strings_.getRandom_(5));
		this.spcs_.set(_id,spc_);
		return spc_;
	},
	//虚通道
	createVirtualChannel_:function(_params)
	{
		var channel_ = this.ssrcChannel_.getChannelById_(_params.label);
		if(channel_)
		{
			return channel_;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}createVirtualChannel 创建虚拟通道({1})",this.tag_,_params.label));
		channel_ = new rc$.com.relayCore.ssrcs.VirtualChannel(this,_params);
		this.manager_.addChannel_(channel_);
		return channel_;
//		this.virtualChannel_.set(params.label,virtual_);
		
	},
	closeVirtualChannel_:function(_params)
	{
		var channel_ = this.ssrcChannel_.getChannelById_(_params.label);
		if(channel_)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::closeVirtualChannel_ 关闭虚拟通道({1})",this.tag_,_params.label));
			this.ssrcChannel_.removeChannel_(channel_);
			var layer_ = this.layers_.get(_params.layer);
			var sync_,index_,virtuals_;
			switch(this.level)
			{
			case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
				sync_ = layer_.unsyncChannels_;
				index_ = sync_.indexOf(_params.label);
				if(index_>-1)
				{
					sync_.splice(index_,1);
				}
				layer_.unsyncChannels_ = sync_;
				virtuals_ = this.ssrcChannel_.getChannelByType_({level:1,type:"@VIR"});
				if(virtuals_.length==0)//所有的虚拟通道关闭
				{
					this.onSSRCClose_();
				}
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
				//像需同步channel发送消息C
				sync_ = layer_.syncChannels_;
				index_ = sync_.indexOf(_params.label);
				if(index_>-1)
				{
					sync_.splice(index_,1);
				}
				layer_.syncChannels_ = sync_;
				virtuals_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@VIR"});
				if(virtuals_.length==0)//所有的虚拟通道关闭
				{
					var Cb_=this.getMessageByType_(67);
					if(this.sendCID_ > 0){clearInterval(this.sendCID_);}
					this.sendCID_ = setInterval(this.relayMessage_.bind(this),this.sendCInterval_,{layer:this.layers_.keys(),level:1,data:Cb_});
					//虚关闭定时
					if(this.virTimeoutId_>0)
					{
						clearTimeout(this.virTimeoutId_);
					}
					this.virTimeoutId_ = setTimeout(this.onSSRCClose_.bind(this),this.virCloseInterval_);
				}
				break;
			}
		}
	},
	//创建层
	createLayer_:function(_layer)
	{
		if(this.layers_.find(_layer))
		{
			return this.layers_.get(_layer);
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createLayer 创建新层({1})",this.tag_,_layer));
		var layerInfo_ = new rc$.com.relayCore.ssrcs.Layer(this,_layer);
		if(_layer==0){//0层开启检查
			layerInfo_.startCheck_();
		}
		this.layers_.set(_layer,layerInfo_);
		return layerInfo_;
	},
	//维护已同步channel状态
	updateChannelStatus_:function()
	{
		switch(this.level)
		{
		case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
			//定期发送媒体状态数据U
			break;
		}
	},
	//设置主channel_
	settingMainChannel_:function(_channel)
	{
		//设置一个主channel
		var mylayer_ = this.layers_.get(_channel.layer_);
		if(mylayer_.channelId_ == null)
		{
			//谁最先创建这个的SPC
			mylayer_.channelId_ = _channel.id_;
			//如果存在则保存路由信息
			mylayer_.route_ = this.getRoute_(_channel.layer_);
			return;
		}
		var mysyncChannels_=mylayer_.syncChannels_;
		
		if(mysyncChannels_.indexOf(_channel.id_)==-1)
		{
			mylayer_.channelId_ = null;
			var metaChannel_;
			for(var i=0;i<mysyncChannels_.length;i++)
			{
				metaChannel_ = this.ssrcChannel_.getChannelById_(mysyncChannels_[i]);
				if(metaChannel_)
				{
					if(metaChannel_.context_.uSPC_==this.spc)
					{
						mylayer_.channelId_ = mysyncChannels_[i];
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}openSycnChannel 更改主Channel({1})->({2})",this.tag_,mylayer_.channelId_,mysyncChannels_[i]));
						break;
					}
				}
			}
			if(mylayer_.channelId_==null)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}openSycnChannel 没有找到对应SPC({1})的channel做主Channel",this.tag_,this.spc));
			}
		}
		return;
	},
	messageFromApp_:function(_value,_layer)
	{
		var cid_ = this.strings_.format("{0}:{1}:{2}",1,this.id,1+Number(_layer)*2);
		var channel_ = this.ssrcChannel_.getChannelById_(cid_);
		if(!channel_)
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::messageFromApp channel_({1})还没有创建！",this.tag_,cid_));
			return;
		}
		try{
            channel_.onMessage_(_value);
		}
		catch(e)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::messageFromApp channel_({1})数据处理错误（）！",this.tag_,cid_,e.toString()));
		}
	},
	//收到同步信息
	onStreamSync_:function(_params)
	{
		this.activeTime_ = this.global_.getMilliTime_();
		var mylevel_ = _params.channel.level_;//1需同步0已同步
		var mylayer_ = _params.channel.layer_;
		var layerStream_;
		//缓存数据
		if(!this.layers_.find(mylayer_))//如果该层不存在，需创建
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onStreamSync 当前发送数据所在层({1})不存在！",this.tag_,mylayer_));
			return;
		}
		//判断channel类型
		var channelId_ = _params.channel.id_;//对应的ID
		var metaChannel_;
		var info_ = this.isMainChannel_(_params.channel);
		//更新层数据信息
		switch(mylevel_)
		{
		case 0://已同步
			switch(_params.type)
			{
			case 67://C
				//接收到消息的处理
				switch(info_.status)//主channel 接收到C，已同步 状态为T、Q 转发
				{
				case 67:
//					info_.channel.send_(this.getMessageByType_(67));
					break;
				case 81://Q转发到C->T,C->Q状态
					info_.channel.addUnavailbleTime_();//暂时不可用状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[81,84],data:_params.data});
					}
					break;
				case 84://T转发到C->T状态
					info_.channel.addUnavailbleTime_();//暂时不可用状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:_params.data});
					}
					break;
				}
				if(info_.channel.updateStatus_(67)){
					this.syncChannelStatus_(mylayer_);//更新已同步的状态
				}
				break;
			case 72://H
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:_params.type,data:_params.data});//缓存最新H
				info_.channel.updatePacket_({type:_params.type,data:_params.data});//channel中缓存H
				info_.channel.updateLossSEQ_(this.getChannelRTT_(mylayer_));
				switch(info_.status)//主channel 接收到H，已同步 状态为T、Q 转发
				{
				case 67://C响应C
					info_.channel.send_(this.getMessageByType_(info_.status));
					break;
				case 81://Q相应Q转发到T状态
					var Qb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Qb_);
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:_params.data});
					}
					break;
				case 84://T不响应转发到T状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:_params.data});
					}
					break;
				}
				break;
			case 77://M
				var Mb_,oldts_=-1,sdpHash_;
				layerStream_ = this.layers_.get(0);
				Mb_ = layerStream_.cachePacket_.get(77);
				if(Mb_)
				{
					oldts_ = Mb_.timestamp_;
					sdpHash_ =Mb_.sdpHash_;
				}
				//缓存
				layerStream_.updatePacket_({type:_params.type,data:_params.data});
				Mb_ = layerStream_.cachePacket_.get(77);
//				P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::onStreamSync_ {1}:{2}接到消息M)", this.tag_,this.id,this.level));
				if(oldts_>Mb_.timestamp_)
				{
					break;
				}
				var Ub_ = layerStream_.cachePacket_.get(85);
				if(Mb_.sdpHash_&&Ub_)
				{
					if(!Ub_.active_)
					{
						Ub_.check_(Mb_.sdpHash_);
					}
					else
					{
						if(sdpHash_&&this.strings_.compareTo_(sdpHash_,Mb_.sdpHash_)!=0)//校验发生变化
						{
							Ub_.active_ = false;
							P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息M。SDPHash变化，U失效 。label({1}),sdp({2})->({3})", this.tag_,_params.channel.label_,sdpHash_,payload_.SDPHash));
						}
					}
				}
				this.timestamp_ = Mb_.timestamp_;//更新时间戳
				
				//转发到所有需同步peer的layer0
				switch(info_.status)//主channel 接收到H，已同步 状态为T、Q 转发
				{
				case 67://C响应C
					var Cb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Cb_);
					break;
				case 81://Q相应转发到T,Q状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[81,84],data:_params.data});
					}
					break;
				case 84://T不响应转发到T状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:_params.data});
					}
					break;
				}
				break;
			case 80://P
				info_.channel.unavailbleTimes_=0;//不可用状态清零
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:_params.type,data:_params.data});//更新
//				P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::onStreamSync_ {1}:{2}接到消息P)", this.tag_,this.id,this.level));
				switch(info_.status)//主channel 接收到H，已同步 状态为T、Q 转发
				{
				case 67://C响应C
					var Cb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Cb_);
					break;
				case 81://Q不相应Q转发到H->T，P->Q
					//丢包情况1
					var Nb_;
					var loss_ = layerStream_.checkLoss_(_params.data);//检测丢包
					if(loss_.length>0)//出现新的丢包
					{
						for(var i=0;i<loss_.length;i++)
						{
							Nb_ = this.getMessageByType_(78,loss_[i]);
							info_.channel.redoSend_(Nb_,loss_[i].seq);
						}
					}
					////转发
					if(info_.main)
					{
						var Hb_ = layerStream_.getH_();
						if(Hb_)
						{
							this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:Hb_});
						}
						this.relayMessage_({layer:[mylayer_],level:1,status:[81],data:_params.data});
						break;
					}
					break;
				case 84://T响应T转发H->T
					info_.channel.updatePacket_({type:72,data:_params.data});//channel中缓存H
					info_.channel.updateLossSEQ_(this.getChannelRTT_(mylayer_));
					var Tb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Tb_);
					if(info_.main)
					{
						var Hb_ = layerStream_.getH_();
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:Hb_});
					}
					break;
				}
				break;
			case 82://R
				break;
			case 85://U
				if(info_.channel&&info_.channel.label_.indexOf("@VIR")==-1)//解析数据，并保存到对应peer中
				{
					info_.channel.context_.setU_(_params.data);
				}
				///
				layerStream_ = this.layers_.get(0);
				var Ub_,use_=false;
				//U_计算规则
				switch(this.level)
				{
				case rc$.com.relayCore.ssrcs.SyncLevel.RELAY://转发和缓存U
					//更新对应channel的状态数据
					if(info_.main)//主channel
					{
						layerStream_.updatePacket_({type:85,data:_params.data});
						Ub_ = layerStream_.cachePacket_.get(85).data;
					}
					break;
				case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
					//该级别下任何channel的U都会独立进行更新和缓存
					info_.channel.updatePacket_({type:85,data:_params.data});
					
					//提取主Channel和副channel_
					var channels_ = layerStream_.syncChannels_;//所有管理已同步Channel;
					var Ub_,payload_,loss_=1,rtt_=0,jitter_,channel_,temp_;
					for(var i=0;i<channels_.length;i++)
					{
						metaChannel_ = this.ssrcChannel_.getChannelById_(channels_[i]);
						if(metaChannel_)
						{
							loss_ = loss_*metaChannel_.context_.uPackLossRate_;
							jitter_ = Math.max((metaChannel_.context_.uRTT_+metaChannel_.context_.uJitter),jitter_);
							rtt_ = Math.max(metaChannel_.context_.uRTT,rtt_);
						}
					}
					Ub_ = this.bytesPacket_.decode_(_params.data).data;
					payload_ = JSON.parse(Ub_.payload);
					payload_.PackLossRate = 1-loss_;
					payload_.RTT = rtt_;
					payload_.Jitter = jitter_-rtt_;
					Ub_.payload_ = JSON.stringify(payload_);
					Ub_=this.bytesPacket_.encode_(Ub_);
					layerStream_.updatePacket_({type:85,data:Ub_});
					break;
				case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
					//转发到所有待同步Peer
					layerStream_.updatePacket_({type:85,data:_params.data});
					var Ub_ = this.bytesPacket_.decode_(_params.data);
					var payload_ = JSON.parse(Ub_.data.payload);
					var spc_,spcId_;
					for(var i=0;i<layerStream_.unsyncChannels_.length;i++)
					{
						metaChannel_ = this.ssrcChannel_.getChannelById_(layerStream_.unsyncChannels_[i]);
						if(metaChannel_)
						{
							
							spcId_ = metaChannel_.peerId_;
							if(metaChannel_.label_.indexOf("@VIR")==-1)
							{
								if(!this.spcs_.find(spcId_))
								{
									P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})spc不存在", this.tag_,layerStream_.unsyncChannels_[i]));
									continue;
								}
								//获取该channel的spc
								spc_ = this.spcs_.get(spcId_);
								payload_.SPC = spc_;
								Ub_.data.payload = JSON.stringify(payload_);
							}
							metaChannel_.send_({type:"byte",data:Ub_.data});
						}
					}
					break;
				}
				//转发和相应规则
				switch(info_.status)//主channel 接收到H，已同步 状态为T、Q 转发
				{
				case 67://C响应C
					var Cb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Cb_);
					break;
				case 81://Q不相应Q转发到U->T，U->Q
					////转发
					if(info_.main)
					{
						this.relayMessage_({layer:[0],level:1,status:[81,84],data:Ub_});
					}
					break;
				case 84://T响应T转发U->T
					if(info_.main)
					{
						this.relayMessage_({layer:[0],level:1,status:[84],data:Ub_});
					}
					break;
				}
				break;
			}
			break;
		case 1://同步channel
			switch(_params.type)
			{
			case 67://C
				if(info_.channel.updateStatus_(67))
				{
					this.syncChannelStatus_(mylayer_);//更新已同步的状态
				}
				break;
			case 78://N
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:78,data:_params.data});
				var Npackes_ = this.bytesPacket_.decode_(_params.data).data;
				var seq_ = Npackes_.seq;
				try{
					var Pb_ = this.layers_.get(mylayer_).getP_(seq_);
					if(!Pb_){
						P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,无法找到对应消息P，忽略", this.tag_));
						break;
					}
					var Pinfo_ = this.bytesPacket_.decode_(Pb_).data;
					if(Math.abs(Pinfo_.ts-Npackes_.ts)>1000)//超出一个回滚单位
					{
						P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,找到对应消息P，但是时间戳超出范围", this.tag_));
						break;
					}
					info_.channel.send_({type:"raw",data:Pb_});
				}
				catch(e)
				{
					P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,error({1})", this.tag_,e||e.toString()));
				}
				break;
			case 81://Q
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ ({1}):({2})layer({3})接到消息Q", this.tag_,this.id,this.level,mylayer_));
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:81,data:_params.data});
				if(info_.channel.updateStatus_(81))
				{
					this.syncChannelStatus_(mylayer_);//更新已同步的状态
				}
				if(info_.channel.label_.indexOf("@VIR")>-1){
					break;
				}
				var Qb_ = this.bytesPacket_.decode_(_params.data).data;
				var Pb_;
				var Mb_ = this.layers_.get(0).cachePacket_.get(77);//发送layer0中存在的M
				var Ub_ = this.layers_.get(0).cachePacket_.get(85);//发送layer0中存在的U
				var sendM_=false,sendU_=false;
				if(Mb_&&Mb_.isActive_()) {
                    sendM_ = true;
                    info_.channel.send_({type: "raw", data: Mb_.data});
                }
				if(mylayer_!=0)
				{
					Pb_ = layerStream_.getP_(Qb_.seq);
					if(Pb_) {
                        info_.channel.send_({type: "raw", data: Pb_});
                    }
                    //需要在0层发送
					var maxLayer_=info_.channel.context_.negPacket_.maxlayerCount_;
                    var layer0_ = this.layers_.get(0);
					var arr_=info_.id.split(":");
					var sourceMapId_ = Number(arr_[2])-mylayer_*(1024/maxLayer_);
					var layer0Id_ = this.strings_.format("{0}:{1}:{2}",arr_[0],arr_[1],sourceMapId_);
                    // P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onStreamSync_ ({1}):({2})接到消息Q，发送U消息到({3})({4}){5}", this.tag_,this.id,this.level,layer0Id_,layer0_.unsyncChannels_,layer0_.unsyncChannels_.indexOf(layer0Id_)));
                    if(layer0_.unsyncChannels_.indexOf(layer0Id_)>-1) {
                        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ ({1}):({2})接到消息Q，发送U消息到({3})", this.tag_,this.id,this.level,layer0Id_));
                        if(Ub_&&Ub_.isActive_()){//U且在有效期,在0层发送
                            sendU_ = true;
                            metaChannel_=this.ssrcChannel_.getChannelById_(layer0Id_);
                            if(metaChannel_) {
                                metaChannel_.send_({type: "raw", data: Ub_.data});
                            }
                        }
                    }
				}
				if((mylayer_==0&&sendM_&&sendU_)||(mylayer_!=0&&sendM_))//向已同步Peer转发Q
				{
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync 发送了M({1})U({2})", this.tag_,sendM_,sendU_));
				}
				break;
			case 84://T
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:84,data:_params.data});
				info_.channel.unavailbleTimes_=0;
				if(info_.channel.updateStatus_(84))
				{
					this.syncChannelStatus_(mylayer_);//更新已同步的状态
				}
				var Tb_ = this.bytesPacket_.decode_(_params.data).data;
				var Hb_ = layerStream_.getH_(Tb_.seq);//H是从P包转出来
				var Mb_ = this.layers_.get(0).cachePacket_.get(77);//发送layer0中存在的M
				var Ub_ = this.layers_.get(0).cachePacket_.get(85);//发送layer0中存在的U
				var sendM_=false,sendU_=false;
				if(Mb_&&Mb_.isActive_())
				{
					sendM_ = true;
					info_.channel.send_({type:"raw",data:Mb_.data});
				}
				if(mylayer_!=0)
				{
					if(Hb_)
					{
						info_.channel.send_({type:"raw",data:Hb_});
					}
					if(Ub_&&Ub_.isActive_()){//存在M，U且在有效期
						sendU_ = true;
						info_.channel.send_({type:"raw",data:Ub_.data});
					}
				}
				if((mylayer_==0&&sendM_&&sendU_)||(mylayer_!=0&&sendM_))//向已同步Peer转发Q
				{
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync 发送了M({1})U({2})", this.tag_,sendM_,sendU_));
				}
				break;
			}
			break;
		}
	},
	
	getChannelRTT_:function(_layer)
	{
		var layer_;
		if(!this.layers_.find(_layer))
		{
			return 0;
		}
		layer_ = this.layers_.get(_layer);
		var cid_ = layer_.channelId_;
		if(cid_==null)
		{
			return 0;
		}
		return this.ssrcChannel_.getChannelById_(cid_).context_.uRTT_;
	},
	syncChannelStatus_:function(_layer)
	{
	////计算channe的状态
		if(!this.layers_.find(_layer))
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncChannelStatus layer({1})不存在，无法更新同步状态！", this.tag_,_layer));
			return;
		}
		var layerStream_ = this.layers_.get(_layer);
		if(layerStream_.unsyncChannels_.length>0)
		{
			//根据需同步的channel判断状态,应该从所有需同步中查，包括虚拟channel
			var hasT_=0;
			var hasC_=0;
			var hasQ_=0;
			var unsyncs_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_layer});
			for(var i=0;i<unsyncs_.length;i++)
			{
				metaChannel_=this.ssrcChannel_.getChannelById_(unsyncs_[i]);
				if(metaChannel_)
				{
					if(metaChannel_.syncStatus_==67)
					{
						hasC_++;
					}
					else if(metaChannel_.syncStatus_==84)
					{
						hasT_++;
					}
					else if(metaChannel_.syncStatus_==81)
					{
						hasQ_++;
					}
				}
			}
			var mainsystatus_ = 0,secondarystatus_ = 0;
			if(hasQ_>0)
			{
				mainsystatus_ = 81;//主81，副84
				secondarystatus_ = 84;
			}
			else if(hasT_>0)//除了C就是T
			{
				mainsystatus_ = secondarystatus_ =  84;
			}
			else//都是C
			{
				mainsystatus_ = secondarystatus_ = 67;
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::syncChannelStatus layer({1})已同步状态变更C({2})Q({3})T({4}),sync({5})", this.tag_,_layer,hasC_,hasQ_,hasT_,layerStream_.syncChannels_.join(",")));
			if(layerStream_.syncChannels_.length>0)
			{
				var mainId_,systatus_;
				for(var i=0;i<layerStream_.syncChannels_.length;i++)
				{
					metaChannel_=this.ssrcChannel_.getChannelById_(layerStream_.syncChannels_[i]);
					if(metaChannel_)
					{			
						//是否主Channel
						if(layerStream_.syncChannels_[i]==layerStream_.channelId_)
						{
							systatus_ = mainsystatus_;
						}
						else
						{
							systatus_ = secondarystatus_;
						}
						if(systatus_>0&&systatus_!=metaChannel_.syncStatus_)//已同步dataChannel的同步状态发生转换时，Peer必须向对端发送一个此状态对应的消息
						{
							metaChannel_.updateStatus_(systatus_);//同步状态;
							metaChannel_.send_(this.getMessageByType_(systatus_));
						}
					}
				}
			}
		}
	},
	getMainChannelPeer_:function()
	{
		if(!this.layers_.find(0))
		{
			return null;
		}
		var layer_ = this.layers_.get(0);
		var channel_ = this.ssrcChannel_.getChannelById_(layer_.channelId_);
		if(channel_)
		{
			return channel_.peerId_;
		}
		return null;
	},
	//定期检查同步情况
	checkSyncStatus_:function()
	{
		var mylayer_,reload_ = false;
		for(var i=0;i<this.layers_.length;i++)
		{
			mylayer_ = this.layers_.elements_[i].key;
			switch(this.level)
			{
			case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
				if(this.layers_.get(mylayer_).syncChannels_<this.relaysyncMin_)//维护频道低于需求
				{
					reload_ = true;
					this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:0});
				}
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
				if(this.layers_.get(mylayer_).syncChannels_<this.servingsyncMin_)//维护频道低于需求
				{
					reload_ = true;
					this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:0});
				}
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING://维护两个以上需同步的dataChannel
				if(this.layers_.get(mylayer_).unsyncChannels_<this.sourcingunsyncMin_)//维护频道低于需求
				{
					reload_ = true;
					this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:1});
				}
				break;
			}
			if(reload_){break;}
		}
	},
	//获取更多资源
	getMoreChannel_:function(_params)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel ssrc({1}-{2})获取更多资源需求处理", this.tag_,this.id,this.level));
		//1.存在对应路由信息
		var mypeerId_,mypeer_,ssrcs_;
		var mylayer_ = this.layers_.get(_params.layer_);
		var mypeers_ = this.manager_.controller_.webrtc_.peers_;
		if(mylayer_&&mylayer_.route_)
		{
			//提取第一个节点
			var active_ = mylayer_.route_.rtt-(this.global_.getMilliTime_()-mylayer_.route_.start);
			if(active_>0)
			{
				var myroute_ = mylayer_.route_.route;
				if(route_)
				{
					mypeerId_ = myroute_.split("*")[0];
					if(mypeers_.find(mypeerId_))
					{
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})满足需求1重新协商", this.tag_,mypeerId_));
						mypeers_.get(mypeerId_).channel_.sendNeg_(true);//重新协商
						return;
					}
				}
			}
		}
		//2.搜索Peer所维护的已知资源列表
		var hasPeers_ = this.ssrcChannel_.getChannelByType_({level:_params.level_,layer:_params.layer_});
		for(var i=0;i<mypeers_.length;i++)
		{
			mypeer_ = mypeers_.elements_[i].value;
			if(_params.type==0&&hasPeers_.indexOf(mypeer_.peerId_)==-1)//首先该资源不在当前列表中
			{
				ssrcs_ = mypeer_.channel_.remoteOwned_;//对方拥有列表中存在
				for(var j=0;j<ssrcs_.length;j++)
				{
					if(ssrcs_[j].id==this.id&&ssrcs_[j].peerId!=mypeer_.id_&&ssrcs_[j].peerId!=mypeer_.peerId_)//存在未同步的本资源信息，协商同步
					{
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})level({2})满足需求2重新协商", this.tag_,mypeer_.peerId_,_params.level_));
						mypeer_.channel_.sendNeg_(true);//重新协商
						return;
					}
				}
			}
			if(_params.level_==1&&hasPeers_.indexOf(mypeer_.peerId_)==-1)//资源没有同步
			{
				//如果主channel不是对方的PeerID
				if(mypeer_.id!=this.getMainChannelPeer_())
				{
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})满足需求3重新协商", this.tag_,mypeer_.peerId_));
					mypeer_.channel_.sendNeg_(true);//重新协商
					return;
				}
			}
		}
		//3.
		this.manager_.controller_.OnTryResolveQuery_(this.id);
	},
	isMainChannel_:function(_channel)
	{
		var mainC_ = false;
		var layerid_ = this.layers_.get(_channel.layer_).channelId_;
		var status_ = _channel.syncStatus_;
		if(layerid_==null)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::isMainChannel ssrc({1}-{2})layer({3})主Channel不存在", this.tag_,this.id,this.level,_channel.layer_));
		}
		if(layerid_==_channel.id_)
		{
			mainC_ = true;
		}
		return {level:_channel.level_,id:_channel.id_,status:status_,main:mainC_,channel:_channel};
	},
	//转发
	relayMessage_:function(_params)
	{
		var layerMax_ = _params.layer;
		for(var l=0;l<layerMax_.length;l++)
		{
			var mylayer_ = this.layers_.get(layerMax_[l]);
			var channelIds_ = _params.level == 0?mylayer_.syncChannels_:mylayer_.unsyncChannels_;
			if(channelIds_.length==0)
			{
				continue;
			}
			var metaChannel_,mysend_,status_,cid_;
			for(var i=0;i<channelIds_.length;i++)
			{
				cid_ = channelIds_[i];
				metaChannel_ = this.ssrcChannel_.dataChannels_.get(cid_);
				if(metaChannel_)
				{
					status_ = metaChannel_.syncStatus_;
					mysend_=false;
					if(_params.hasOwnProperty("status"))
					{
						for(var j=0;j<_params.status.length;j++)
						{
							if(status_==_params.status[j])
							{
								mysend_=true;
							}
						}
					}
					else
					{
						mysend_=true;
					}
					if(mysend_)
					{
						var type_ = rc$.com.relayCore.utils.Number.convertToValue_('1', _params.data, 0);
						if(this.config_.prints_.indexOf(type_)>-1)
						{
							P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::relayMessage ssrc({1}-{2}) level({3})转发消息({4})给({5})。", this.tag_,this.id,this.level,_params.level==0?"已同步":"需同步",type_,cid_));
						}
						metaChannel_.send_({type:"raw",data:_params.data});
					}
				}
			}
		}
	},
	onSSRCClose_:function()
	{
		var ssrc_,channels_,metaChannel_;
		switch(this.level)
		{
		case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
			//如果所有服务都关闭了，则关闭所有连接channel_
			ssrc_ = this.manager_.getSSRCById_({id:this.id,level:"serving"});
			if(!ssrc_)//不存在,关闭所有同步服务
			{
				channels_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@SYNC"});//关闭已同步频道
				//关闭频道
				for(var i=0;i<channels_.length;i++)
				{
					metaChannel_ = this.ssrcChannel_.getChannelById_(channels_[i]);
					if(metaChannel_)
					{
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCClose_ 关闭频道({1})！",this.tag_,channels_[i]));
						metaChannel_.close_();
					}
				}
				//在频道管理中删除该id
				if(this.manager_.channels_.find(this.id))
				{
					this.manager_.channels_.remove(this.id);
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
			ssrc_ = this.manager_.getSSRCById_({id:this.id,level:"relay"});
			if(!ssrc_)//不存在,关闭所有同步服务
			{
				channels_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@SYNC"});//关闭已同步频道
				//关闭频道
				for(var i=0;i<channels_.length;i++)
				{
					metaChannel_ = this.ssrcChannel_.getChannelById_(channels_[i]);
					if(metaChannel_)
					{
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCClose_ 关闭频道({1})！",this.tag_,channels_[i]));
						metaChannel_.close_();
					}
				}
				//在频道管理中删除该id
				if(this.manager_.channels_.find(this.id))
				{
					this.manager_.channels_.remove(this.id);
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
			break;
		}
		this.manager_.closeSSRCById_({id:this.id,level:this.level});
	},
	checkPacket_:function()
	{
		var myactive_ = false;
		if(this.layers_.find(0))
		{
			var cache_ = this.layers_.get(0).cachePacket_;
			if(cache_)
			{
				var Mb_ = cache_.get(77);
				var Ub_ = cache_.get(85);
				if(Mb_&&Mb_.active_&&Ub_&&Ub_.active_)
				{
					myactive_ = true;
				}
			}
			if(!myactive_)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkPacket M或者U过期。发送Q ", this.tag_));
				var Qb_ = this.bytesPacket_.encode_({type:81});
				this.relayMessage_({layer:[0],level:0,data:Qb_});
			}
		}
	},
	getMessageByType_:function(_type,_params)
	{
		var data_={type:_type};
		if(_params)
		{
			rc$.apply(data_,_params);
		}
		switch(_type){
		case 72://H 媒体流数据包
			break;
		case 67://C 
			break;
		case 78://N
			break;
		case 80://P
			break;
		case 81://Q
			break;
		case 84://T
			break;
		case 77://M 媒体流元数据包，包含校验哈希值
			break;
		case 85://U 媒体状态数据
			break;
		case 82://R 媒体所在频道元数据
		}
		return {type:"byte",data:data_};
	},
	getRoute_:function(_layer)
	{
		//提取主0ceng CHannel的路由
		var cid_,routeInfo_,channel_;
		if(!_layer)
		{
			_layer = 0;
		}
		if(this.layers_.find(_layer))
		{
			cid_ = this.layers_.get(_layer).channelId_;
			if(!cid_)
			{
				P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::getRoute ssrc({1}:{2})layer(0)主channel不存在！", this.tag_,this.id,this.level));
				return null;
			}
			channel_ = this.ssrcChannel_.getChannelById_(cid_);
			if(!channel_)
			{
				return null;
			}
			if(channel_.label_.indexOf("@VIR")>-1)
			{
				routeInfo_ = channel_.getRoute_({id:this.id});
			}
			else
			{
				routeInfo_ = channel_.context_.negPacket_.getRoute_({id:this.id});
			}
			P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::getRoute ssrc({1}:{2})路由信息({3})！", this.tag_,this.id,this.level,JSON.stringify(routeInfo_)));
		}
		return routeInfo_;
	},
	broad_:function()
	{
		if(this.id)
		{
			var id_ = this.strings_.format("{0}:{1}",this.id,this.level);
			this.manager_.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypeChannel,data:id_});
		}
	},
	
	close_:function()
	{
		this.id=null;
		this.channel=null;
		this.spc=null;
		this.level="";
		this.sdp=null;
		if(this.checkSyncId_>0){clearInterval(this.checkSyncId_);}
		if(this.checkPacketId_>0){clearInterval(this.checkPacketId_);}
		if(this.virTimeoutId_>0){clearTimeout(this.virTimeoutId_);}
		if(this.sendCID_>0){clearInterval(this.sendCID_);}
		this.timestamp_=0;
		this.routeIndex_=-1;
		this.activeTime_=-1;
		this.manager_=null;
		this.dataChannels_=null;
		this.sessionPeers_=null;
		this.layers_=null;
		this.global_=null;
		this.strings_=null;
	}
});
rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.Layer = JClass.extend_({
	context_:null,
	layer_:-1,
	cachePacket_:null,//维护一个缓存消息
	channelId_:null,
	route_:null,
	syncChannels_:null,//维护已同步的channel
	unsyncChannels_:null,//维护需同步的channel
	checkId_:-1,
	
	lossSeq_:-1,//检测丢包序列号位置
	lossSeqs_:null,//存储丢包序列号
	loss_:0,
	
	checkInterval_:30*1000,
	bytesPacket_:null,
	relaySpc_:null,
	tag_:"com::relayCore::ssrcs::Layer",
	
	init:function(_context,_layer)
	{
		this.context_ = _context;
		this.layer_ = _layer;
		this.checkInterval_ = this.context_.config_.messageExpiredTime_?this.context_.config_.messageExpiredTime_:30*1000;
		this.cachePacket_ = new rc$.com.relayCore.utils.Map();
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.spc_ = null;
		this.route_ = null;
		this.syncChannels_=[];
		this.unsyncChannels_=[];
		this.lossSeqs_=[];
	},
	//定期检查该层的U和M是否过期
	startCheck_:function()
	{
		if(this.checkId_>0)
		{
			clearInterval(this.checkId_);
			this.checkId_ = -1;
		}
		var callBack_ = this.checkExpired_.bind(this);
		this.checkId_ = setInterval(callBack_,this.checkInterval_);
	},
	updatePacket_:function(_message)
	{
		var type_ = _message.type;
		var cache_;
		if(this.cachePacket_.find(type_))
		{
			//更新
			cache_ = this.cachePacket_.get(type_);
			cache_.update_(_message);
			return;
		}
		cache_ = new rc$.com.relayCore.ssrcs.CacheData(this);
		cache_.update_(_message);
		this.cachePacket_.set(type_,cache_);
	},
	getP_:function(_seq)
	{
		var Pb_ = this.cachePacket_.get(80);
		if(!Pb_||!Pb_.data)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getP P消息为空！",this.tag_));
			return null;
		}
		if(!_seq||_seq<0)
		{
			_seq = Pb_.seq_;
		}
		if(!Pb_.data||!Pb_.data.find(_seq))
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getP seq({1})的消息不存在！",this.tag_,_seq));
			return null;
		}
		return Pb_.data.get(_seq);
	},
	getH_:function(_seq)
	{
		var Pb_ = this.cachePacket_.get(80);
		var Hb_ = this.cachePacket_.get(72);
		var data_,seq_;
		seq_=_seq;
		if(Hb_&&Hb_.data)
		{
			if(!_seq)
			{
				seq_ = Hb_.seq_;
			}
			data_ = Hb_.data.get(seq_);
		}
		if(Pb_&&Pb_.data)
		{
			if((data_&&Hb_.timestamp_<Pb_.timestamp_)||!data_)
			{
				if(!_seq)
				{
					seq_ = Pb_.seq_;
				}
				data_ = Pb_.data.get(seq_);
				if(data_)
				{
					data_ = this.bytesPacket_.decode_(data_).data;
					data_.type = 72;
					data_.payload=0;
					data_ = this.bytesPacket_.encode_(data_);
				}
			}
		}
		return data_;
	},
	rollBack_:function(_seq)
	{
		//发生回滚。重置this.lossSeq_
		if(this.lossSeq_>_seq)
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::rollBack 重置lossSeq_({1})->({2})", this.tag_,this.lossSeq_,_seq));
			this.lossSeq_=_seq;
		}
		var index_ = this.lossSeqs_.indexOf(_seq);
		if(index_>-1)//回滚的序列号未获得P返回
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::rollBack channel({1})序列号({2})丢包记录", this.tag_,this.channelId_,_seq));
			this.loss_++;
			this.broad_("loss",{loss:this.loss_,seq:_seq});
			var channel_ = this.context_.ssrcChannel_.getChannelById_(this.channelId_);
			if(channel_)
			{
				channel_.lossP_++;
			}
			this.lossSeqs_.splice(index_,1);
			return;
		}
	},
	checkLoss_:function(_data)
	{
		var oldP_,newP_,a_,b_,c_,loss_=0,ts_,newloss_=[];
		newP_ = this.bytesPacket_.decode_(_data).data;
		var index_ = this.lossSeqs_.indexOf(newP_.seq);
		if(index_>-1)//返回的是重发的N
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkLoss 接收到丢包序列号({1})", this.tag_,newP_.seq));
			this.lossSeqs_.splice(index_,1);
			return [];
		}
		if(this.cachePacket_.find(80))
		{
			oldP_ = this.getP_(this.lossSeq_);
			if(!oldP_)
			{
				return [];
			}
			oldP_ = this.bytesPacket_.decode_(oldP_).data;
			if(this.lossSeq_>oldP_.seq)//已经检测过了
			{
				return [];
			}
			this.lossSeq_ = newP_.seq;
			a_=oldP_?oldP_.seq:-1;
			b_=newP_.seq;
			if(a_>b_){
				return [];
			}
			if((a_+1)<b_)
			{
				loss_ = b_-a_-1;//丢包
				for(var i=a_+1;i<b_;i++)
				{
					ts_ = (newP_.ts-oldP_.ts)*(i-a_)/loss_+oldP_.ts;
					newloss_.push({ts:ts_,seq:i});
					this.lossSeqs_.push(i);
				}
			}
		}
		return newloss_;
	},
	checkExpired_:function()
	{
		var Mb_,Ub_,Qb_;
		if(this.cachePacket_.find(77))
		{
			Mb_ = this.cachePacket_.get(77);
		}
		if(this.cachePacket_.find(85))
		{
			Ub_ = this.cachePacket_.get(85);
		}
		var Mex_=true;
		var Uex_=true;
		if(Mb_)
		{
			Mex_ = Mb_.isActive_();
		}
		if(Ub_)
		{
			Uex_ = Ub_.isActive_();
		}
		if(!Uex_||!Mex_)//M或者U过期
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::checkExpired 消息M({1})U({2})",this.tag_,Mex_?"有效":"过期",Uex_?"有效":"过期"));
			Qb_ = this.bytesPacket_.encode_(this.context_.getMessageByType_(81).data);
			this.context_.relayMessage_({layer:[0],level:0,data:Qb_});
		}
	},
	broad_:function(_type,_value)
	{
		var id_ = this.context_.strings_.format("{0}:{1}:{2}",this.context_.id,this.context_.level,this.layer_);
		this.context_.manager_.broadcast_.channelMessage_(id_,_type,_value);
	},
	close_:function()
	{
		if(this.checkId_>0){clearInterval(this.ckeckId_);}
		this.bytesPacket_ = null;
		this.context_=null;
		this.cachePacket_=null;//维护一个缓存消息
		this.channelId_=null;
		this.syncChannels_=[];//维护已同步的channel
		this.unsyncChannels_=[];//维护需同步的channel
	}
});
rc$.ns("com.relayCore.webrtc.packets");
rc$.com.relayCore.ssrcs.CacheData = JClass.extend_({
	type:null,
	data:null,
	activeTime_:0,
	global_:null,
	bytesPacket_:null,
	context_:null,
	timestamp_:-1,
	sdpHash_:null,
	sdp_:null,
	seq_:-1,
	active_:false,
	maxCache_:100,
	maxCacheSeq_:null,
	total_:0,
	successTotal_:0,
	tag_:"com.relayCore::ssrcs::CacheData",
	
	init:function(_context)
	{
		this.context_ = _context;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.activeTime_ = this.global_.getMilliTime_();
		this.maxCacheSeq_=[];
		this.data=null;
	},
	update_:function(_message)
	{
		this.activeTime_ = this.global_.getMilliTime_();
		this.type=_message.type;
		var data_ = _message.data;
		this.total_++;
		switch(this.type)
		{
		case 85://U
			//解析U消息
			var oldU_={};
			var info_ = this.bytesPacket_.decode_(data_).data;
			if(!info_.payload)
			{
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::update U({1})消息的载荷为空！",this.tag_,JSON.stringify(info_)));
				break;
			}
			this.successTotal_++;
			var UInfo_ = JSON.parse(info_.payload);
			if(this.data != null)
			{
				var old_ = this.bytesPacket_.decode_(this.data).data;
				oldU_ = JSON.parse(old_.payload);
			}
			for(var i in UInfo_)
			{
				switch(i)
				{
				case "SPC":
					oldU_[i] = UInfo_[i];
					if(this.context_.context_.level == rc$.com.relayCore.ssrcs.SyncLevel.SERVING)
					{
						oldU_[i] = this.context_.context_.spc;
					}
					break;
				case "PackLossRate":
					var olu_ = oldU_.PackLossRate?oldU_.PackLossRate:0;
					var nlu_ = 1-(1-olu_)*(1-UInfo_[i]);
					oldU_.PackLossRate = nlu_;
					break;
				case "RTT":
					var rtt_ = oldU_.RTT+UInfo_[i];
					oldU_.RTT = rtt_;
					break;
				case "Jitter":
					oldU_[i] = UInfo_[i];
					break;
				case "SDP":
					oldU_[i] = UInfo_[i];
					this.sdp_ = UInfo_[i];
					this.timestamp_ = info_.ts;
					break;
				default:
					break;
				}
			}
			info_.payload_ = JSON.stringify(oldU_);
			this.data = this.bytesPacket_.encode_(info_);
			break;
		case 72://H
		case 80://P
			if(this.data==null)
			{
				this.data=new rc$.com.relayCore.utils.Map();
			}
			var pInfo_ = this.bytesPacket_.decode_(data_).data;
			var isAdd_ = 0;
			//丢包数据的处理的重新缓存
			if(this.timestamp_<pInfo_.ts||(this.timestamp_==pInfo_.ts&&(this.seq_<pInfo_.seq||(this.seq_==255&&pInfo_.seq==0))))
			{
				isAdd_ = 2;
			}
			else if(!this.data.find(pInfo_.seq))
			{
				isAdd_ = 1;
			}
			if(isAdd_>0)//新数据，添加
			{
				this.successTotal_++;
				if(this.type==72&&pInfo_.type==80)
				{
					pInfo_.type=72;
					pInfo_.payload = null;
					data_ = this.bytesPacket_.encode_(pInfo_);//重新转封装
					P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::update 缓存H,P->H！",this.tag_,data_));
				}
				if(this.data.length>this.maxCache_)//最大缓存
				{
					var tmp_ = this.maxCacheSeq_.shift();//删除并取出第一个序列号
					this.data.remove(tmp_.seq);
					if(this.type==80)
					{
						this.context_.broad_("P",{type:"remove",num:tmp_.seq});
					}
				}
				this.data.set(pInfo_.seq,data_);
				this.maxCacheSeq_.push({"type":this.type,"seq":pInfo_.seq,"ts":pInfo_.ts});
				this.maxCacheSeq_.sort(function(a,b){
					if(a.ts-b.ts==0)
					{
						if(a.seq<b.seq)
						{
							return a.seq-b.seq
						}
						else
						{
							return b.seq-a.seq
						}
					}
					return a.ts-b.ts
					});
				if(isAdd_>1){
					if(this.type==80)
					{
						this.context_.broad_("P",{type:"add",num:pInfo_.seq});
						if(this.context_.tag_=="com::relayCore::ssrcs::Layer")
						{
							this.context_.rollBack_(pInfo_.seq);
						}	
					}
					this.timestamp_ = pInfo_.ts;
					this.seq_ = pInfo_.seq;
				}
				else
				{
					if(this.type==80)
					{
						this.context_.broad_("P",{type:"insert",num:pInfo_.seq});
					}
				}
			}
			break;
		case 77:
			var payload_,M_;
			M_ = this.bytesPacket_.decode_(data_).data;
			if(M_.ts<=this.timestamp_)
			{
				break;
			}
			this.successTotal_++;
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::update_ 接到消息M。时间({1})>({2})，更新", this.tag_,M_.ts,this.timestamp_));
			this.active_ = true;
			this.timestamp_ = M_.ts;//更新时间戳
			payload_ = this.bytesPacket_.decode_(M_.payload).data;
			this.sdpHash_ = payload_.SDPHash;
			this.data = data_;
			break;
		default:
			this.successTotal_++;
			this.data = data_;
			break;
		}
		if(this.context_.tag_=="com::relayCore::ssrcs::Layer")
		{
			this.context_.broad_("layer-message",{type:this.type,success:this.successTotal_,total:this.total_});
		}
	},
	getSEQ_:function(_time)//获得时间晚于time的seq
	{
		var keys_ = this.data.keys();
		keys_.sort();
		var seq_=-1;
		var data_;
		///提取最后一个时间戳
		data_ = this.bytesPacket_.decode_(this.data.get(keys_[keys_.length-1])).data;
		if(data_.ts<_time)
		{
			return -1;
		}
		for(var i=keys_.length-2;i>0;i--)
		{
			data_ = this.bytesPacket_.decode_(this.data.get(keys_[i])).data;
			if(data_.ts<_time)
			{
				break;
			}
			seq_ = data_.seq;
		}
		return seq_;
	},
	isActive_:function()
	{
		return this.active_;
	},
	check_:function(_sdp)
	{
		this.active_ = true;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::check 校验SDP({1}),SDPHash({2})！",this.tag_,_sdp,this.sdp_));
	}
});
rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.Manager = JClass.extend_({
	ssrcs_:null,
	channels_:null,
	config_:null,
	global_:null,
	controller_:null,
	broadcast_:null,
	strings_:null,
	
	tag_:"com:ssrcs::Manager",
	
	init:function(_controller)
	{
		this.controller_ = _controller;
		this.ssrcs_ = new rc$.com.relayCore.utils.Map();
		this.channels_ = new rc$.com.relayCore.utils.Map();
		this.config_ = rc$.com.relayCore.vo.Config;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
	},
	addSSRC_:function(_params)
	{
		if(!_params)
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSSRC 添加资源错误",this.tag_));
			return null;
		}
		var ssrcId_ = this.strings_.format("{0}:{1}",_params.id,_params.level?_params.level:"relay");
		if(this.ssrcs_.find(ssrcId_))
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSSRC 存在SSRC媒体流id({1})",this.tag_,ssrcId_));
			return this.ssrcs_.get(ssrcId_);
		}
		//创建资源channel管理
		if(!this.channels_.find(_params.id))
		{
			var channel_ = new rc$.com.relayCore.ssrcs.Channel(this);
			this.channels_.set(_params.id,channel_);
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSSRC 添加新的ChannelMap id({1})",this.tag_,_params.id));
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSSRC 添加新的SSRC媒体流 id({1})",this.tag_,ssrcId_));
		var ssrc_ = new rc$.com.relayCore.ssrcs.SSRC(this,_params);
		this.ssrcs_.set(ssrcId_,ssrc_);
		ssrc_.initializeServing_();
		this.broad_({type:"add",ssrc:ssrc_});
		if(_params.level!="relay")
		{
			this.onSSRCUpdate_();
		}
		return ssrc_;
	},
	stopSSRC_:function(_params)
	{
		var id_ = this.strings_.format("{0}:{1}",_params.id,_params.level);
		if(this.ssrcs_.find(id_))
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0} stopSSRC 停止SSRC({1})！",this.tag_,id_));
			var ssrc_ = this.ssrcs_.get(id_);
			ssrc_.stop_(_params);
		}
	},
	addChannel_:function(_channel)
	{
		var mylabel_ = _channel.label_;
		var ssrcId_ = mylabel_.split(":")[1];
		var ssrcR_;
		var sourcing_ = this.strings_.format("{0}:{1}",ssrcId_,"sourcing");
		var relay_ = this.strings_.format("{0}:{1}",ssrcId_,"relay");
		if(!this.channels_.find(ssrcId_)||(mylabel_.indexOf("@SYNC")>-1&&_channel.level_==1&&this.ssrcs_.find(sourcing_)&&this.ssrcs_.find(relay_)))
		{
			//创建资源
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addChannel 频道所在ssrc({1})不存在！创建relay级别资源",this.tag_,_channel.id_));
			var ssrc_ = _channel.getSYNC_();
			var ssrcparams_ = {};
			rc$.apply(ssrcparams_,ssrc_);
			ssrcparams_.level="relay";
			//并把当前channel设为主channel
			ssrcR_ = this.addSSRC_(ssrc_);
			if(ssrcR_==null)
			{
				return;
			}
		}
		var channel_ = this.channels_.get(ssrcId_);
		channel_.addChannel_(_channel);
		if(ssrcR_!=null)
		{
			this.onSSRCUpdate_();
		}
	},
	removeChannel_:function(_channel)
	{
		var ssrcId_ = _channel.label_.split(":")[1];
		if(!this.channels_.find(ssrcId_))
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::removeChannel 删除频道Channel({1})不存在！",this.tag_,ssrcId_));
			return;
		}
		var channel_ = this.channels_.get(ssrcId_);
		channel_.removeChannel_(_channel);
	},
	testSourcingSS_:function(_params)
	{
		var ssrcId_ = _params.id;
		var type_ = Number(_params.type);
		var message_ = _params.message;
		var sid_ = this.strings_.format("{0}:{1}",_params.id,"sourcing");
		if(!this.ssrcs_.find(sid_))
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::testSourcingSS SSRC({1})不存在！",this.tag_,sid_));
			return;
		}
		var layer_ = 1+message_.layer*2;
		var vid_ = this.strings_.format("{0}:{1}:{2}",1,_params.id,layer_);
		var channel_ = this.channels_.get(ssrcId_).getChannelById_(vid_);
		if(!channel_)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::testSourcingSS 虚拟频道({1})不存在！",this.tag_,vid_));
			return;
		}
		var params_;
		if(type_==80)
		{
			params_ ={
					type:type_,
					ts:message_.ts?message_.ts:0,
					seq:message_.seq?message_.seq:0,
					payload:message_.payload?message_.payload:0,
			};
		}
		else
		{
			params_ ={
					type:type_,
					Layers:message_.layer?message_.layer:0
			};
		}
		var data_ = rc$.com.relayCore.webrtc.packets.BytesPacket.encode_(params_);
		channel_.onMessage_(data_);
	},
	getChannelById_:function(_id)
	{
		if(!this.channels_.find(_id))
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getChannelById 请求ssrc({1})dataChannel不存在！",this.tag_,_id));
			return null;
		}
		return this.channels_.get(_id);
	},
	getSSRCById_:function(_params)
	{
		var id_ = this.strings_.format("{0}:{1}",_params.id,_params.level);
		return this.ssrcs_.get(id_);
	},
	closeSSRCById_:function(_params)
	{
		var id_ = this.strings_.format("{0}:{1}",_params.id,_params.level);
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} closeSSRCById 关闭SSRC({1})！",this.tag_,id_));
		if(this.ssrcs_.find(id_))
		{
			var ssrc_ = this.ssrcs_.get(id_);
			ssrc_.close_();
			this.ssrcs_.remove(id_);
			this.onSSRCUpdate_();//通知SSRC更新了
			this.controller_.OnSSRCClose_(_params);//通知外部某个资源关闭了
			this.broad_({type:"remove",id:id_});
		}
	},
	receiveMessage_:function(_params)
	{
		var labelInfo_ = _params.channel.label_.split(":");
		var ssrcId_ = labelInfo_[1];
		var level_ = "";
		var id_;
		for(var i in rc$.com.relayCore.ssrcs.SyncLevel)
		{
			level_ = rc$.com.relayCore.ssrcs.SyncLevel[i];
			id_=this.strings_.format("{0}:{1}",ssrcId_,level_);
			if(this.ssrcs_.find(id_))
			{
				this.ssrcs_.get(id_).onStreamSync_(_params);
			}
		}
	},
	onSSRCUpdate_:function()
	{
		var mypeers_ = this.controller_.webrtc_.peers_;
		var peer_;
		for(var i=0;i<mypeers_.length;i++)
		{
			peer_ = mypeers_.elements_[i].value;
			peer_.channel_.onSSRCUpdate_();
		}
	},
	broad_:function(_params)
	{
		this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypeSSRC,data:_params});
	}
});
rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.ssrcs.Channel = JClass.extend_({
	dataChannels_ : null,
	context_:null,
	methodMap_:null,
	strings_:null,
	tag_:"com::relayCore::ssrcs::Channel",
	
	init:function(_context)
	{
		this.context_ = _context;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.dataChannels_ = new rc$.com.relayCore.utils.Map();
		this.methodMap_ = new rc$.com.relayCore.utils.Map();
	},
	addChannel_:function(_channel)
	{
		if(this.dataChannels_.find(_channel.id_))
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} addChannel 存在peerId({1}),mappedId({2}) channel",this.tag_,_channel.peerId_,_channel.cid_));
			return;
		}
		this.dataChannels_.set(_channel.id_,_channel);
		this.excuteMethod_("onAdd",_channel);
	},
	removeChannel_:function(_channel)
	{
		if(this.dataChannels_.find(_channel.id_))
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} removeChannel 删除dataChannels中id({1})的channel",this.tag_,_channel.id_));
			this.dataChannels_.remove(_channel.id_);
			this.excuteMethod_("onRemove",_channel);
		}
	},
	excuteMethod_:function(_name,_params)
	{
		if(this.methodMap_.find(_name))
		{
			var methods_ = this.methodMap_.get(_name);
			for(var i=0;i<methods_.length;i++)
			{
				methods_[i](_params);
			}
		}
	},
	registerMethod_:function(_params)
	{
		if(!this.methodMap_.find(_params.name))
		{
			this.methodMap_.set(_params.name,[]);
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::registerMethod 注册一个({1})回调方法",this.tag_,_params.name));
		this.methodMap_.get(_params.name).push(_params.body);
	},
	getChannelById_:function(_id)
	{
		return this.dataChannels_.get(_id);
	},
	
	getChannelByType_:function(_params)//获取不同类型的channel
	{
		var list_=[];
		var channel_,mylabel_,mylayer_,mylevel_;
		for(var i=0;i<this.dataChannels_.length;i++)
		{
			key_ = this.dataChannels_.elements_[i].key;
			channel_ = this.dataChannels_.elements_[i].value;
			mylabel_ = channel_.label_;
			mylevel_ = channel_.level_;
			mylayer_ = channel_.layer_;
			if(_params.hasOwnProperty("type"))
			{
				if(mylabel_.indexOf(_params.type)==-1)
				{
					continue;
				}
			}
			if(_params.hasOwnProperty("level"))
			{
				if(mylevel_!=_params.level)
				{
					continue;
				}
			}
			if(_params.hasOwnProperty("layer"))
			{
				if(mylayer_!=_params.layer)
				{
					continue;
				}
			}
			list_.push(key_);
		}
		return list_;
	},
});
rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.VirtualChannel = JClass.extend_({
	id_:null,//channelId
	label_:null,//channelLabel
	from_:0,//0serving,1soucing
	layer_:0,
	peerId_:"",
	cid_:1,
	callback_:null,
	level_:-1,
	context_:null,
	bytesPacket_:null,
	cachePacket_:null,
	lossP_:0,//丢包
	unavailableTimes_:0,
	
	syncStatusId_:-1,
	syncStatusInterval_:300*1000,
	syncStatus_:67,
	sendSeqs_:null,
	
	route_:null,
	broadcast_:null,
	tag_:"com::relayCore::ssrcs::VirtualChannel",
	init:function(_context,_params)
	{
		this.context_=_context;
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.cachePacket_ = new rc$.com.relayCore.utils.Map();
		this.setParams_(_params);
		this.sendSeqs_=[];
		this.level_ = (this.from_+this.cid_)%2;
	},
	setParams_:function(_params)
	{
		for(var i in _params)
		{
			this[(i+"_")]=_params[i];
		}
	},
	onOpen_:function()
	{
		if(this.level_==0)
		{
			//需要求情Native获取数据 发送Q
			this.callback_ = this.context_.options.callback;
		}
		else
		{
			//等待数据
			this.syncStatus_ = 81;
			this.sendServingQ_();
		}
	},
	//serving
	sendServingQ_:function()
	{
		//需要求情Native获取数据 发送Q
		var ext_ = {};
		var packet_ = {type:81,ext:JSON.stringify(ext_)};
		var Qb_ = this.bytesPacket_.encode_(packet_);
		this.onMessage_(Qb_);
	},
	getSDP_:function()
	{
		//从layer获取U信息
		return "";
	},
	//重发丢包
	redoSend_:function(_data,_seq)
	{
		if(this.sendSeqs_.indexOf(_seq)>-1)
		{
			return;
		}
		P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})发现丢包seq({2}),发送N", this.tag_,this.label_,_seq));
		this.sendSeqs_.push(_seq);
		this.send_(_data);
	},
	//对外发送给APP
	send_:function(_value)
	{
		var type_ = _value.type;
		var packet_=_value.data;
		var messageType_=0;
		if(this.callback_)
		{
			switch(type_)
			{
			case "json":
				packet_ = JSON.stringify(_value.data);
				messageType_=0;
				break;
			case "byte":
				packet_ = this.context_.bytesPacket_.encode_(_value.data);
				messageType_=_value.data.type?_value.data.type:_value.data.status;
				break;
			default:
				messageType_=rc$.com.relayCore.utils.Number.convertToValue_('1', _value.data,0);
				break;
			}
			if(this.context_.config_.prints_.indexOf(messageType_)>-1)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0} ({1})layer({2})level({3})发送数据({4})给APP!",this.tag_,this.label_,this.layer_,this.level_,messageType_));
			}
			this.broad_("send",messageType_);
			this.callback_(packet_,this.layer_);
		}
	},
	getRoute_:function()
	{
		return {route:this.peerId,ttl:300*1000};
	},
	onMessage_:function(_message)//接收到数据
	{
		var type_ = rc$.com.relayCore.utils.Number.convertToValue_('1',new Uint8Array(_message),0);//获取消息类型
		this.broad_("receive",type_);
		this.context_.onStreamSync_({type:type_,channel:this,data:_message});
	},
	timerOut_:function()
	{
		this.active_ = false;
	},
	updateStatus_:function(_value)
	{
		if(this.syncStatus_ != _value)
		{
			//开启关闭超时
			if(this.syncStatusId_>0)
			{
				clearTimeout(this.syncStatusId_);
				this.closeId_ = -1;
			}
			this.syncStatus_ = _value;
			if(this.syncStatus_==67)
			{
				var callback_ = this.timerOut_.bind(this);
				this.syncStatusId_ = setTimeout(callback_,this.syncStatusInterval_);
			}
			this.broad_("syncStatus",this.syncStatus_);
		}
	},
	getSYNC_:function()
	{
		return this.label_.split(":")[1];
	},
	updateLossSEQ_:function(_rtt)
	{
		
	},
	updatePacket_:function(_message)
	{
	},
	broad_:function(_type,_value)
	{
		this.broadcast_.channelMessage_(this.id_,_type,_value);
	},
	addUnavailbleTime_:function()
	{
		this.unavailableTimes_++;
		//发送一个状态
		this.send_({type:"byte",data:{type:this.syncStatus_}});
		//清除其他不可用的检测
		if(this.unavailableTimes_>this.context_.config_.unavailableMaxTimes_)//超过阈值关闭
		{
			this.close_();
		}
	},
	getH_:function(_seq)
	{
		if(!this.cachePacket_.find(72))
		{
			return null;
		}
		var H_ = this.cachePacket_.get(72);
		if(!_seq&&H_.data.find(H_.seq_))
		{
			return H_.data.get(H_.seq_);
		}
		return H_.data.get(seq);
	},
	close_:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} id({1}) close!",this.tag_,this.label_));
		if(this.syncStatusId_>0){clearTimeout(this.syncStatusId_);}
		this.context_.closeVirtualChannel_({label:this.id_,layer:this.layer_});
	}
});
rc$.ns("com.relayCore.controller");
rc$.com.relayCore.controller.LMPN = JClass.extend_({
	config_:null,
	strings_:null,
	global_:null,
	webrtc_:null,
	socket_:null,
	ssManager_:null,
	statics_:null,
	//外部回调接口
	OnPeerClose:null,
	OnSSClose:null,
	OnTryResolveQuery:null,
	broadcast_:null,
	
	tag_:"com::relayCore::player::Live",
	live:null,
	
	init:function()
	{
		this.config_ = rc$.com.relayCore.vo.Config;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.statics_ = new rc$.com.relayCore.statics.Statics(this);
		if(arguments.length>0&&typeof(arguments[0]) == "object")
		{
			rc$.apply(this.config_,arguments[0]);
		}
		this.broadcast_.init_(this.config_.debugBarId);
		//日志输出设置
		rc$.com.relayCore.utils.Log.init(this.config_.logLevel, this.config_.logType, this.config_.logServer);
		//创建SSRC资源管理
		this.ssManager_ = new rc$.com.relayCore.ssrcs.Manager(this);
		//开启webrtc管理
		this.webrtc_ = new rc$.com.relayCore.webrtc.Manager(this);
		this.webrtc_.open();
		if(this.config_.auto)
		{
			//开启socket通道管理
			if(rc$.com.relayCore.websocket)
			{
				this.socket_ = new rc$.com.relayCore.websocket.Manager(this);
				this.socket_.createSession([{"name":"webrtc","url":this.config_.webrtcServerHost_}]);
			}
		}
	},
	syncSSRC:function(_data)
	{
		this.ssManager_.sycn(_data);
	},
	addPeer:function(_params)
	{
		this.webrtc_.addPeer(_params);
		this.broad_(_params.id);
	},
	//外部获取一个媒体流服务
	requetSS:function(_options)
	{
		var params_={
				id:_options.id,
				level:"serving",
				channel:_options.channel,
				callback:_options.callback,
				options:_options
		};
		if(!params_.channel)
		{
			params_.channel=this.config_.channel_;
		}
		//创建一个节点
		this.ssManager_.addSSRC_(params_);
	},
	stopRequetSS:function(_options)
	{
		var params_={
				id:_options.id,
				level:"serving",
				layer:_options.layer,
				channel:_options.channel,
				scope:_options
		};
		this.ssManager_.stopSSRC_(params_);
	},
	
	sourcingSS:function(_options)
	{
		var params_={
				id:_options.id,
				level:"sourcing",
				layer:_options.layer,
				channel:_options.channel,
				options:_options
		};
		this.ssManager_.addSSRC_(params_);
	},
	testSourcingSS:function(_params)
	{
		this.ssManager_.testSourcingSS_(_params);
	},
	stopSourcingSS:function(_options)
	{
		var params_={
				id:_options.id,
				level:"sourcing",
				layer:_options.layer,
				channel:_options.channel,
				scope:_options
		};
		this.ssManager_.stopSSRC_(params_);
	},
	OnPeerClose_:function(_value)
	{
		if(this.OnPeerClose != null)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0} OnPeerClose 通知外部Peer({1})断开",this.tag_,_value));
			this.OnPeerClose(_value);
		}
	},
	OnSSRCClose_:function(_value)
	{
		if(this.OnSSClose != null)
		{
			this.OnSSClose(_value);
		}
	},
	OnTryResolveQuery_:function(_value)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::OnTryResolveQuery_ ({1})重新获取新的外部数据", this.tag_,_value));
		if(this.OnTryResolveQuery != null)
		{
			this.OnTryResolveQuery(_value);
		}
	},
	broad_:function(_value)
	{
		if(this.broadcast_)
		{
			this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.RemoteID,data:_value});
		}
	}
});
rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.ManagerStatic = {
	kTimerTypeTracker : 1,
	kTimerTypeSession : 2,
	kTimerTypeAsyncPeers : 3,
};

rc$.com.relayCore.websocket.Manager = JClass.extend_({
	config_:null,
	global_:null,
	strings_:null,
	opened_:false,
	activeTime_:0,
	id_:null,
	sessions_:null,
	trackerBeginQueryTime_:0,
	status:false,
	controller_:null,
	sessionId_:null,
	queryPeer_:null,
	broadcast_:null,
	tag_:"com::relayCore::websocket::Manager",

	init : function(_controller) {
		this.controller_ = _controller;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.sessions_ = new rc$.com.relayCore.utils.Map();
		this.queryPeer_ = new rc$.com.relayCore.websocket.QueryPeer(this);
		this.sessionId_ = [];
	},

	createSession : function(_sessionParams) {
		//创建本地webrtc-socket连接
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createSession params({1})", this.tag_,JSON.stringify(_sessionParams)));
		if(typeof(_sessionParams) == "object")
		{
			var session_;
			var sessionTag_;
			for(var i=0;i<_sessionParams.length;i++)
			{
				sessionTag_ = _sessionParams[i];
				if(this.sessions_.find(sessionTag_.name))
				{
					continue;
				}
				session_ = new rc$.com.relayCore.websocket.Session(this,sessionTag_.name);
				session_.open_(sessionTag_.url);
				if(sessionTag_.name=="webrtc")
				{
					this.config_.clientId = session_.id_;
					this.queryPeer_.bindSession_(session_);
					this.broad_({type:rc$.com.relayCore.broadcast.Types.RemoteID,data:session_.id_});
					session_.bind_(this.queryPeer_);
				}
				this.sessions_.set(sessionTag_.name,session_);
			}
		}
		return true;
	},
	getRtc:function()
	{
		return this.controller_.webrtc_;
	},
	getSessionByName:function(_name)
	{
		return this.sessions_.get(_name);
	},
	broad_:function(_message)
	{
		this.broadcast_.broad_(_message);
	},
	close : function() {
		this.opened_ = false;
		this.session_.close_();
	}
});
rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.ManagerStatic = {
		kTimerTypeTracker : 1,
		kTimerTypeSession : 2,
		kTimerTypeAsyncPeers : 3,
		kTimerTypeOnRegister : 100,
		kTimerTypeOnHeartBeat : 101,
		kTimerTypeOnQueryPeerList : 102
};
rc$.com.relayCore.websocket.Session = JClass.extend_({

	config_:null,
	strings_:null,
	global_:null,
	manager_:null,
	websocket:null,
	opened_:false,
	activeTime_:0,
	id_:null,
	status_:false,
	name_:"",
	
	onWebSocketOpenBinded_:null,
	onWebSocketCloseBinded_:null,
	onWebSocketMessageBinded_:null,
	onWebSocketErrorBinded_:null,
	
	tag_:"com::relayCore::webrtc::Session",
	uir_:null,
	
	init : function(_mgr,_name) {
		this.manager_ = _mgr;
		this.name_ = _name;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.id_ = this.strings_.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random() * (1000 + 1)),
				Math.floor(Math.random() * (1000 + 1)), this.global_.getMilliTime_());
	},

	send : function(_message) {
		this.activeTime_ = this.global_.getMilliTime_();
		this.websocket.send(_message);
	},

	open_ : function(_url,_type) {
		this.opened_ = true;
		this.activeTime_ = this.global_.getMilliTime_();
		this.uir = _url;
		if(_type)
		{
			this.uir = _url ;
		}
		try {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::open webSocket: {1}", this.tag_,this.uir));
			this.websocket = new WebSocket(this.uir);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::open failed, exception: {1}", this.tag_,e));
			return false;
		}
		this.bind_(this);
		return true;
	},
	bind_:function(_scope)
	{
		this.onWebSocketOpenBinded_ = _scope.onWebSocketOpen_.bind(_scope);
		this.onWebSocketMessageBinded_ = _scope.onWebSocketMessage_.bind(_scope);
		this.onWebSocketCloseBinded_ = this.onWebSocketClose_.bind(this);
		this.onWebSocketErrorBinded_ = this.onWebSocketError_.bind(this);
		this.websocket.onopen = this.onWebSocketOpenBinded_;
		this.websocket.onclose = this.onWebSocketCloseBinded_;
		this.websocket.onmessage = this.onWebSocketMessageBinded_;
		this.websocket.onerror = this.onWebSocketErrorBinded_;
	},
	onWebSocketOpen_ : function(_evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onWebSocketOpen", this.tag_));
		this.status_ = true;
		if(this.name_ == "peer")//获取本地源
		{
			
		}
	},
	onWebSocketMessage_ : function(_message) {
//		this.manager_.processMessage(name,_message);
		if(this.name_ == "peer")//处理app交换数据
		{
			
		}
	},
	onWebSocketClose_ : function(_evt) {
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onWebSocketClose name({1})", this.tag_,this.name_));
		this.status_ = false;
		return true;
	},
	onWebSocketError_ : function(_evt) {
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onWebSocketError({1}), exception: {2}", this.tag_,this.name_,_evt.toString));
		this.status_ = false;
		return true;
	},
	close_ : function() {
		this.status_ = false;
		this.websocket.close();
		this.websocket = null;
	}
});
rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.QueryPeer = JClass.extend_({
	webrtcServerInterval_:5*1000,
	webrtcServerTimerId_ : -1,
	id_:null,
	webrtc_:null,
	manager_:null,
	global_:null,
	strings_:null,
	session_:null,
	config_:null,
	peers_:null,
	
	tag_:"com::relayCore::websocket::QueryPeer",

	init : function(_mgr) {
		this.manager_ = _mgr;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.peers_ = new rc$.com.relayCore.utils.Map();
	},
	bindSession_:function(_session)
	{ 
		this.session_ = _session;
		this.webrtc_ = this.manager_.getRtc();
		this.webrtc_.id_ = this.id_ = this.session_.id_;
	},
	onWebSocketOpen_ : function(_evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Start register webrtc server ({1}) ...",this.tag_, _evt.target.url));
		this.register_();
	},
	onWebSocketMessage_ : function(_evt) {
		// var me = this;
		var message_ = JSON.parse(_evt.data);
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onWebSocketMessage tag({1})",this.tag_, message_.method));
		switch (message_.method) {
		case 'registerRequest':
			this.onRegisterResponse_(message_);
			break;
		case 'proxyDataRequest':
			this.onProxyDataRequest_(message_);
			break;
		default:
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::WebSocket unknown method: {1}",this.tag_, message_.method));
			break;
		}
	},
	register_:function()
	{
		var req_ = {
				method : "registerRequest",
				channel:"chenzhaofei",
				id:this.id_,
				localTime : this.global_.getMilliTime_()
			};
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::register",this.tag_));
		
		var callback_ = this.onRegisterTimeout_.bind(this);
		this.webrtcServerTimerId_ = setTimeout(callback_, this.webrtcServerInterval_);
		this.webrtc_.beginRegisterTime_ = this.global_.getMilliTime_();
		this.sendMessage_(req_);
	},
	onRegisterResponse_ : function(_message) {
		var mid_ = _message.id;
		if(mid_ == this.id_)
		{
			if (this.webrtcServerTimerId_>0) {
				clearTimeout(this.webrtcServerTimerId_);
				this.webrtcServerTimerId_ = -1;
			}
			this.webrtc_.connectedTime_ = this.global_.getMilliTime_() - this.webrtc_.beginRegisterTime_;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Register response success, peerid({1})",this.tag_, _message.id));
		}
		else
		{
			if(_message.channel=="chenzhaofei")
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::New Peer response success, peerid({1})",this.tag_, mid_));
				this.createPeer_(mid_);
			}
			
		}
	},
	createPeer_:function(_id)
	{
		var mypeer_ = new rc$.com.relayCore.websocket.Peer(this);
		mypeer_.fromServer_ = true;
		mypeer_.load({"id":this.id_,"remoteId":_id});
		mypeer_.connect();
		params_={
			id:this.id_,
			remoteId:_id,
			from:true,
			peer:mypeer_.peer_
		};
		this.peers_.set(params_.remoteId,mypeer_);
		this.manager_.controller_.addPeer(params_);
	},
	onProxyDataRequest_ : function(_message) {
		if (typeof (_message.data) == 'string') {
			_message.data = JSON.parse(_message.data);
		}
		var sid_ = _message.sendId;
		var destId_ = _message.destPeerId;
		var peerId_ = _message.peerId;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onProxyDataRequest selfId({1}),sendId({2}),connectionId({3}),peerId({4}))",this.tag_,this.id_,sid_,destId_,peerId_));
		if(sid_ != this.id_ && this.id_ == peerId_)//别人发的需要链接我
		{
			this.onRemotePeerConnectRequest_(sid_, _message.data);
		}
		else if(destId_ == this.id_ && peerId_ == sid_)
		{
			this.onRemotePeerConnectResponse_(sid_, _message.data);
		}
		return;
	},
/////测试
	onRemotePeerConnectRequest_ : function(_peerId, _message) {//当别人连接我时
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Receive a connect request from {1}",this.tag_, _peerId));
		var mypeer_;
		if(!this.peers_.find(_peerId))
		{
			mypeer_ = new rc$.com.relayCore.websocket.Peer(this);
		}
		else
		{
			mypeer_ = this.peers_.get(_peerId);
		}
		mypeer_.fromServer_ = false;
		mypeer_.load2(_message);
		mypeer_.id_ = this.id_;
		mypeer_.remoteId_ = _peerId;
		mypeer_.peerId_ = this.id_;
		mypeer_.iceServers_ = _message.iceServers;
		mypeer_.remoteIceCandidates_ = _message.iceCandidates;
		mypeer_.remoteSdpDescriptions_ = _message.sdpDescriptions;
		mypeer_.connect();
		params_={
				id:this.id_,
				remoteId:_peerId,
				from:false,
				peer:mypeer_.peer_
			};
		this.peers_.set(_peerId,mypeer_);
		this.manager_.controller_.addPeer(params_);
	},
	onRemotePeerConnectResponse_ : function(_peerId, _message) {
		var isFind_ = this.peers_.find(_peerId);
		var peer_;
		if (!isFind_) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Receive a connect response from {1}, but not in the peers",this.tag_, _peerId));
			return;
		} 
		peer_ = this.peers_.get(_peerId);
		peer_.load2(_message);
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Recveive a connect response from {1}",this.tag_, _peerId));
		peer_.acceptAnswer_(_message.iceCandidates, _message.sdpDescriptions);
	},
	onRegisterTimeout_:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onRegisterTimeout thisId({1}) 注册超时！",this.tag_,this.id_));
		clearTimeout(this.webrtcServerTimerId_);
		this.webrtcServerTimerId_ = -1;
	},
	close : function() {
		return true;
	},
	sendMessage_ : function(_message) {
		if (typeof (_message) != 'string') {
			_message = JSON.stringify(_message);
		}
		this.session_.send(_message);
		//P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::Send message channel({0}), msg:{1}", this.pool_.getMetaData_().storageId_, message));
	}
});
/**
 * http://usejsdoc.org/
 */
rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.Peer = JClass.extend_({
	config_:null,
	global_:null,
	strings_:null,
	peer_ : null,
	peerId_:null,
	remoteId_:null,
	id_ : null,
	fromServer_ : false,
	
	lastConnectTime_ : 0,
	context_ : null,

	localIceCandidates_ : null,
	localSdpDescriptions_ : null,

	remoteIceCandidates_ : null,
	remoteSdpDescriptions_ : null,

	iceOptions : null,
	sdpOptions : null,
	connecting_ : false,
	connectionId_:"",
	tag_:"com::relayCore::webrtc::Peer",

	init:function(_context)
	{
    	this.config_ = rc$.com.relayCore.vo.Config;
    	this.global_ = rc$.com.relayCore.utils.Global;
    	this.strings_ = rc$.com.relayCore.utils.String;
    	this.context_ = _context;
    	this.id_ = this.context_.id_;
		this.connecting_ = false;
		this.connectionId_ = "";
    	this.fromServer_ = false;
		this.lastConnectTime_ = 0;
		this.localIceCandidates_ = this.localIceCandidates_ || [];
		this.remoteIceCandidates_ = this.remoteIceCandidates_ || [];
		this.iceOptions = this.iceOptions || {
			"optional" : []
		};
		this.sdpOptions = this.sdpOptions || {
			'mandatory' : {
				'OfferToReceiveAudio' : false,
				'OfferToReceiveVideo' : false
			}
		};
	},
	load : function(_peerItem) {
		this.peerId_ = this.remoteId_ = _peerItem.remoteId;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0},load id({1}),remoteId({2})",this.tag_,this.id_,this.peerId_));
	},
	load2 : function(_message) {
		for ( var n = 0; n < _message.iceCandidates.length; n++) {
			var peerInfo_ = _message.iceCandidates[n];
			var candidate_ = peerInfo_.candidate;
			if (candidate_.indexOf("udp") != -1) {
				var datas_ = candidate_.split(" ");
				if (!this.remoteIp_) {
					this.remoteIp_ = datas_[4] || "0.0.0.0";
				}

				if (this.remoteIp_.indexOf(":") != -1) {
					continue;
				}
				if (!this.remotePort_) {
					this.remotePort_ = datas_[5] || "0";
				}

				if ((datas_[7] || "").indexOf("srflx") == -1) {
					continue;
				} else {
					this.remoteIp_ = datas_[4] || "0.0.0.0";
					this.remotePort_ = datas_[5] || "0";
				}
				break;
			}
		}
	},
	//创建rtc链接
	connect: function()
	{
		var iceUrl_ = this.config_.stunServerHost;
		this.iceServers_ = [ {
			url : iceUrl_ + '?transport=udp'
		} ];
		if (this.fromServer_) {
			this.connectionId_ = this.peerId_ + "-active";
		} else {
			this.connectionId_ = this.peerId_ + "-passive";
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0},caller({1}),stunServer({2})",this.tag_,this.fromServer_,this.iceServers_[0].url));
		try
		{
			this.peer_ = new RTCPeerConnection({
				iceServers : this.iceServers_
			}, this.iceOptions);
			this.setPeerEvents_(this.peer_);
			var scope_ = this;
			if (this.fromServer_) {
				// caller
			} else {
				// callee
				this.peer_.setRemoteDescription(new RTCSessionDescription({type : 'offer',sdp:this.remoteSdpDescriptions_}));
				this.peer_.createAnswer(function( description ){
					if(scope_.remoteIceCandidates) scope_.addPeerIceCandidates(scope_.remoteIceCandidates);
					scope_.peer_.setLocalDescription(description);
					scope_.localSdpDescriptions_ = description.sdp;
				}, 
				function( err ){
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0},createAnswer error",scope_.tag_));
				}, this.sdpOptions);
			}
			this.lastConnectTime_ = this.global_.getMilliTime_();
		}
		catch(e)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} error({1})", this.tag_,(e || "").toString()));
		}
	},
	setPeerEvents_ : function(_peer) {
		var scope_ = this;
		_peer.onnegotiationneeded = function() {
			scope_.onPeerOpen_();
		};
		_peer.onicecandidate = function(evt) {
			scope_.onPeerIceCandidate_(evt);
		};
	},
	onPeerDataChannel_: function(_evt )
	{
	},
	onPeerOpen_: function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0},onPeerOpen,connectionId({1}),peerId({2})",this.tag_,this.connectionId_,this.peerId_));
		var scope_ = this;
		this.peer_.createOffer(function( description )
		{
			scope_.peer_.setLocalDescription(description);
			scope_.localSdpDescriptions_ = description.sdp;
		}, function( err )
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0},createOffer error",scope_.tag_));
		}, this.sdpOptions);
	},
	sendConnectRequest_: function()
	{
		if (this.localIceCandidates_.length < 1) {
			return;
		}

		var proxyData_ = {
			action : 'connectRequest',
			iceServers : this.iceServers_,
			iceCandidates : this.localIceCandidates_,
			sdpDescriptions : this.localSdpDescriptions_
		};
		
		this.status = true;
		this.context_.sendMessage_({
			method : 'proxyDataRequest',
			sendId:this.id_,
			destPeerId : this.remoteId_,
			peerId:this.peerId_,
			data : JSON.stringify(proxyData_)
		});
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendConnectRequest connectionId({1}) Send connect request) ",this.tag_, this.connectionId_));
	},
	sendConnectResponse_ : function() {
		if (this.localIceCandidates_.length < 1) {
			return;
		}
		var proxyData_ = {
			action : 'connectResponse',
			iceCandidates : this.localIceCandidates_,
			sdpDescriptions : this.localSdpDescriptions_
		};
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendConnectResponse ({1})Send connect response",this.tag_, this.connectionId_));
		this.status = true;
		this.context_.sendMessage_({
			method : 'proxyDataRequest',
			sendId:this.id_,
			destPeerId : this.remoteId_,
			peerId:this.peerId_,
			data : JSON.stringify(proxyData_)
		});
	},
	addPeerIceCandidates_: function( _candidates )
	{
		if( Object.prototype.toString.call(_candidates) == '[object Array]' )
		{
			for( var i = 0; i < _candidates.length; i ++ )
			{
				this.peer_.addIceCandidate(new RTCIceCandidate(typeof(_candidates[i]) != 'string' ? _candidates[i] :
				{
					sdpMLineIndex: 0,
					sdpMid: 'data',
					candidate: _candidates[i]
				}));
			}
		}
		else
		{
			this.peer.addIceCandidate(new RTCIceCandidate(_candidates));
		}
	},
	acceptAnswer_ : function(_candidates, _sdpDescriptions) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::acceptAnswer ({1}) Accept answer",this.tag_, this.connectionId_));
		this.remoteIceCandidates_ = _candidates;
		this.remoteSdpDescriptions_ = _sdpDescriptions;
		this.peer_.setRemoteDescription(new RTCSessionDescription({
			type : 'answer',
			sdp : _sdpDescriptions
		}));
		this.addPeerIceCandidates_(_candidates);
	},
	onPeerIceCandidate_: function( _evt )
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerIceCandidate ({1}) Receive",this.tag_, this.connectionId_));
		if (_evt.candidate) {
			// both of caller and callee should save it first,waiting for switch candidate with Peer
			this.localIceCandidates_.push(_evt.candidate);
		} else {
			if (this.fromServer_) {
				this.sendConnectRequest_();
			} else {
				this.sendConnectResponse_();
			}
		}
	},
	
	clear:function()
	{
		this.config_=null;
		this.global_=null;
		this.strings_=null;
		this.peer_=null;
		this.peerId_=null;
		this.remoteId_=0;
		this.fromServer_=false;
		this.lastConnectTime_=0;
		this.manager_=null;

		this.localIceCandidates_=null;
		this.localSdpDescriptions_=null;

		this.remoteIceCandidates_=null;
		this.remoteSdpDescriptions_=null;

		this.iceOptions=null;
		this.sdpOptions=null;
		this.connectionId_="";
		this.id_ = "";
		this.connecting_=false;
		this.tag_="";
	}
});
