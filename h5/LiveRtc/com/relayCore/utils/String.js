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
