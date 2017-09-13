p2p$.ns("com.common");
p2p$.com.common.String = {
	b64EncodeChars_ : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	b64DecodeChars_ : [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7,
			8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
			39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1 ],

	trim : function(value) {
		var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
		return (value + '').replace(trimRegex, "");
	},

	urlEncodeNonAscii_ : function(value) {
		return value;
	},

	/*
	 * "yyyy-MM-dd hh:mm:ss.S" ==> 2006-07-02 08:09:04.423 "yyyy-M-d h:m:s.S" ==> 2006-7-2 8:9:4.18
	 */
	formatTime_ : function(value, fmt) {
		var newDate = new Date();
		newDate.setTime(value);
		if (!fmt) {
			fmt = "yyyy-M-d h:m:s.S";
		}
		;
		var o = {
			"M+" : this.padingLeft_(newDate.getMonth() + 1, 2),
			"d+" : this.padingLeft_(newDate.getDate(), 2),
			"h+" : this.padingLeft_(newDate.getHours(), 2),
			"m+" : this.padingLeft_(newDate.getMinutes(), 2),
			"s+" : this.padingLeft_(newDate.getSeconds(), 2),
			"q+" : Math.floor((newDate.getMonth() + 3) / 3),
			"S" : this.padingLeft_(newDate.getMilliseconds(), 3)
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		return fmt;
	},

	padingLeft_ : function(value, length, prefix) {
		var result = value + "";
		while (result.length < length) {
			result = (prefix || "0") + result;
		}
		return result;
	},

	getAbsoluteUrlIfNeed_ : function(url, referer) {
		var position = url.indexOf("://");
		if (position != -1) {
			return url;
		} else {
			var urlParsed = new p2p$.com.common.Url();
			this.parseUrl_(referer, urlParsed, false);
			if (url.length >= 2 && url.substring(0, 1) == "/" && url.substring(1, 2) == "/") {
				// protocol relative
				return this.format("{0}:{1}", urlParsed.protocol_, url);
			} else if (url.length >= 1 && url.substring(0, 1) == "/") {
				// path relative
				if (0 == urlParsed.port_) {
					return this.format("{0}://{1}{2}", urlParsed.protocol_, urlParsed.host_, url);
				} else {
					return this.format("{0}://{1}:{2}{3}", urlParsed.protocol_, urlParsed.host_, urlParsed.port_, url);
				}
			} else {
				// file relative
				if (0 == urlParsed.port_) {
					return this.format("{0}://{1}{2}{3}", urlParsed.protocol_, urlParsed.host_, urlParsed.path_, url);
				} else {
					return this.format("{0}://{1}:{2}{3}{4}", urlParsed.protocol_, urlParsed.host_, urlParsed.port_, urlParsed.path_, url);
				}
			}
		}
	},

	format : function(fmt) {
		var args = [];
		for ( var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		return (fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
			return args[i];
		});
	},

	isSpace : function(value) {
	},

	isDigit : function(value) {
		var reg = /^[a-zA-Z0-9]+$/g;
		return reg.test(value);
	},

	fromNumber : function(value) {
		return "" + value;
	},

	parseFloat : function(value, defult) {
		if (typeof defult == 'undefined') {
			defult = 0.0;
		}
		;
		var ret = parseFloat(value);
		var ret2 = isNaN(ret) ? defult : ret;

		return isNaN(ret2) ? 0.0 : ret2;
	},

	// isNaN()
	parseNumber_ : function(value, defult) {
		if (typeof defult == 'undefined') {
			defult = 0;
		}
		;
		var ret = parseInt(value);
		var ret2 = isNaN(ret) ? defult : ret;
		return isNaN(ret2) ? 0 : ret2;
	},

	toUpper_ : function(value) {
		return (value || "").toUpperCase();
	},

	makeUpper_ : function(value) {
		return value.toUpperCase();
	},

	makeLower_ : function(value) {
		return value.toLowerCase();
	},

	startsWith_ : function(ori, prefix) {
		return ori.slice(0, prefix.length) === prefix;
	},

	endsWith_ : function(ori, suffix) {
		return ori.indexOf(suffix, ori.length - suffix.length) !== -1;
	},

	toLower_ : function(value) {
		return value.toLowerCase();
	},

	compareTo_ : function(value1, value2) {
		return value1.localeCompare(value2);
	},

	// escape()函数，不会encode @*/+ (不推荐使用)
	// encodeURI()函数，不会encode ~!@#$&*()=:/,;?+' (不推荐使用)
	// encodeURIComponent()函数，不会encode~!*() 这个函数是最常用的
	urlEncode_ : function(str) {
		str = (str + '').toString();
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(
				/%20/g, '+');
	},

	split : function(content, values, key, maxItems, ignoreEmpty, contentLength) {
		var startPos = 0;
		var findPos = 0;
		var itemCount = 0;
		var keyLen = key.length;
		var endPos = (-1 >>> 0 == contentLength) ? content.length : contentLength;

		// values = [];

		if (key.length == 0) {
			return 0;
		} else if (endPos <= 0 || endPos >= content.length) {
			endPos = content.length;
		}

		while (startPos < endPos) {
			findPos = content.indexOf(key, startPos);
			if (findPos < 0 || findPos >= endPos || (maxItems > 0 && itemCount == maxItems - 1)) {
				findPos = endPos;
			}

			if (findPos < startPos) {
				break;
			}

			if (findPos > startPos || !ignoreEmpty) {
				var newValue = (findPos > startPos) ? content.substr(startPos, findPos - startPos) : "";
				values.push(newValue);
				itemCount++;
			}

			startPos = findPos + keyLen;
		}

		return itemCount;
	},

	parseAttributes_ : function(content, attributes, separatorKey, valueKey, keyLowCase, trimKey, trimValue) {
		var lines = 0;
		var parts = [];

		this.split(content, parts, separatorKey, -1, false, -1 >>> 0);
		for ( var n = 0; n < parts.length; n++) {
			var partValue = parts[n];
			var partValues = [];
			if (this.split(partValue, partValues, valueKey, 2, false, -1 >>> 0) == 0) {
				continue;
			}

			if (keyLowCase) {
				partValues[0] = this.toLower_(partValues[0]);
			}

			if (trimKey) {
				this.trim(partValues.front());
			}

			if (trimValue && partValues.length > 1) {
				this.trim(partValues[partValues.length - 1]);
			}

			if (partValues.length < 2) {
				if (partValues.length >= 1) {
					attributes.set(partValues[0], "");
				}
			} else {
				attributes.set(partValues[0], partValues[partValues.length - 1]);
			}

			lines++;
		}

		return lines;
	},

	parseUrl_ : function(url, superNodeUrl, fileWithParams) {
		// protocol_, host_, port_, path_, file_, segment_, params_
		var protocolPos = -1;
		if (url) {
			protocolPos = url.indexOf(":");
		} else {
			return;
		}
		var hostPos = 0;
		if (-1 != protocolPos) {
			var validProtocol = true;
			for ( var n = 0; n < protocolPos; n++) {
				if (!this.isDigit(url[n])) {
					validProtocol = false;
					break;
				}
			}
			if (validProtocol) {
				superNodeUrl.protocol_ = this.toLower_(url.substr(0, protocolPos));
				hostPos = protocolPos + 1;
				while (hostPos < url.length && '/' == url[hostPos]) {
					hostPos++;
				}
			}
		}
		var portPos = url.indexOf(":", hostPos) >>> 0;
		var pathPos = url.indexOf("/", hostPos) >>> 0;
		if (portPos > pathPos) {
			// maybe such url http://server/about:blank
			portPos = -1;
		}
		portPos = portPos << 0;
		if (-1 != portPos) {
			superNodeUrl.host_ = url.substr(hostPos, portPos - hostPos);
			superNodeUrl.port_ = this.parseNumber_(url.substr(portPos + 1), 0);
		}

		var fullUri;
		if (-1 == pathPos) {
			fullUri = "/";
			if (superNodeUrl.host_.length == 0) {
				superNodeUrl.host_ = url.substr(hostPos);
			}
		} else {
			fullUri = url.substr(pathPos);
			if (superNodeUrl.host_.length == 0) {
				superNodeUrl.host_ = url.substr(hostPos, pathPos - hostPos);
			}
		}

		var queryBeginPos = fullUri.indexOf('?') >>> 0;
		var segmentBeginPos = fullUri.indexOf('#') >>> 0;
		superNodeUrl.file_ = fullUri.substr(0, queryBeginPos > segmentBeginPos ? segmentBeginPos : queryBeginPos);
		if ((queryBeginPos + 1) < fullUri.length && queryBeginPos != -1 && queryBeginPos < segmentBeginPos) {
			var queryParams = fullUri.substr(queryBeginPos + 1, -1 == segmentBeginPos << 0 ? -1 >>> 0 : (segmentBeginPos - queryBeginPos - 1));
			var encodeParams = new p2p$.com.common.Map();
			this.parseAttributes_(queryParams, encodeParams, '&', '=', false, false, false);
			for ( var n = 0; n < encodeParams.size(); n++) {
				var item = encodeParams.element(n);
				var key = decodeURIComponent(item.key);
				superNodeUrl.params_.set(key, decodeURIComponent(item.value));
			}
		}

		if (segmentBeginPos != -1) {
			superNodeUrl.segment_ = fullUri.substr(segmentBeginPos + 1);
		}

		var filePos = superNodeUrl.file_.lastIndexOf('/') >>> 0;
		if (filePos == -1 || filePos == 0) {
			superNodeUrl.path_ = "/";
		} else {
			superNodeUrl.path_ = superNodeUrl.file_.substr(0, filePos);
		}

		// format path as /name/
		if (superNodeUrl.path_.length == 0 || superNodeUrl.path_[superNodeUrl.path_.length - 1] != '/') {
			superNodeUrl.path_ += "/";
		}

		if (fileWithParams) {
			superNodeUrl.file_ = fullUri;
			// core::common::String::normalizeUrlPath(path);
			// core::common::String::normalizeUrlPath(file);
		}
	},

	base64Encode_ : function(str) {
		var out, i, len;
		var c1, c2, c3;

		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len) {
				out += this.b64EncodeChars_.charAt(c1 >> 2);
				out += this.b64EncodeChars_.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len) {
				out += this.b64EncodeChars_.charAt(c1 >> 2);
				out += this.b64EncodeChars_.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += this.b64EncodeChars_.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += this.b64EncodeChars_.charAt(c1 >> 2);
			out += this.b64EncodeChars_.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += this.b64EncodeChars_.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			out += this.b64EncodeChars_.charAt(c3 & 0x3F);
		}
		return out;
	},

	base64Decode_ : function(str) {
		var c1, c2, c3, c4;
		var i, len, out;

		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			/* c1 */
			do {
				c1 = this.b64DecodeChars_[str.charCodeAt(i++) & 0xff];
			} while (i < len && c1 == -1);
			if (c1 == -1) {
				break;
			}

			/* c2 */
			do {
				c2 = this.b64DecodeChars_[str.charCodeAt(i++) & 0xff];
			} while (i < len && c2 == -1);
			if (c2 == -1) {
				break;
			}

			out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

			/* c3 */
			do {
				c3 = str.charCodeAt(i++) & 0xff;
				if (c3 == 61) {
					return out;
				}
				c3 = this.b64DecodeChars_[c3];
			} while (i < len && c3 == -1);
			if (c3 == -1) {
				break;
			}

			out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

			/* c4 */
			do {
				c4 = str.charCodeAt(i++) & 0xff;
				if (c4 == 61) {
					return out;
				}
				c4 = this.b64DecodeChars_[c4];
			} while (i < len && c4 == -1);
			if (c4 == -1) {
				break;
			}
			out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return out;
	},

	utf16to8_ : function(str) {
		var out, i, len, c;

		out = "";
		len = str.length;
		for (i = 0; i < len; i++) {
			c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
			}
		}
		return out;
	},

	utf8to16_ : function(str) {
		var out, i, len, c;
		var char2, char3;

		out = "";
		len = str.length;
		i = 0;
		while (i < len) {
			c = str.charCodeAt(i++);
			switch (c >> 4) {
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
				// 0xxxxxxx
				out += str.charAt(i - 1);
				break;
			case 12:
			case 13:
				// 110x xxxx 10xx xxxx
				char2 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
				break;
			case 14:
				// 1110 xxxx 10xx xxxx 10xx xxxx
				char2 = str.charCodeAt(i++);
				char3 = str.charCodeAt(i++);
				out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
				break;
			}
		}

		return out;
	},

	charToHex_ : function(str) {
		var out, i, len, c, h;

		out = "";
		len = str.length;
		i = 0;
		while (i < len) {
			c = str.charCodeAt(i++);
			h = c.toString(16);
			if (h.length < 2) {
				h = "0" + h;
			}

			out += "\\x" + h + " ";
			if (i > 0 && i % 8 == 0) {
				out += "\r\n";
			}
		}

		return out;
	},
	getFunName:function(value){
        var re = /function\s*(\w*)/ig;
        var matches = re.exec(value);
        return matches[1];
	}
};
