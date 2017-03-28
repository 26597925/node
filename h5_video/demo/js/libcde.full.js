var p2p$ = {
	ns : function(space) {
		var names = (space + '').split(".");
		var objs = this;
		for ( var i = 0; i < names.length; i++) {
			var subName = names[i];
			var subType = typeof (objs[subName]);
			if (subType != 'object' && subType != 'undefined') {
				throw "Invalid namespace " + space + ", sub: " + subName;
			}
			objs = objs[subName] = objs[subName] || {};
		}
	}
};// 当前是否处于创建类的阶段
var CdeBaseInitializing_ = false;
var CdeBaseClass = function() {
};
CdeBaseClass.extend_ = function(prop) {
	// 如果调用当前函数的对象（这里是函数）不是Class，则是父类
	var baseClass = null;
	if (this !== CdeBaseClass) {
		baseClass = this;
	}
	// 本次调用所创建的类（构造函数）
	function F() {
		// 如果当前处于实例化类的阶段，则调用init原型函数
		if (!CdeBaseInitializing_) {
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
		CdeBaseInitializing_ = true;
		F.prototype = new baseClass();
		F.prototype.constructor = F;
		CdeBaseInitializing_ = false;
	}
	// 新创建的类自动附加extend函数
	F.extend_ = arguments.callee;

	// 覆盖父类的同名函数
	for ( var name in prop) {
		if (prop.hasOwnProperty(name)) {
			// 如果此类继承自父类baseClass并且父类原型中存在同名函数name
			if (baseClass && typeof (prop[name]) === "function" && typeof (F.prototype[name]) === "function" && /\b_super\b/.test(prop[name])) {
				// 重定义函数name -
				// 首先在函数上下文设置this._super指向父类原型中的同名函数
				// 然后调用函数prop[name]，返回函数结果
				// 注意：这里的自执行函数创建了一个上下文，这个上下文返回另一个函数，
				// 此函数中可以应用此上下文中的变量，这就是闭包（Closure）。
				// 这是JavaScript框架开发中常用的技巧。
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

CdeBaseClass.apply = function(cls, members) {
	for ( var name in members) {
		if (members.hasOwnProperty(name)) {
			cls.prototype[name] = members[name];
		}
	}
};p2p$.util = {
	apply : function(dest, source) {
		for ( var name in source) {
			dest[name] = source[name];
		}
		return dest;
	},

	applyIf : function(dest, source) {
		for ( var name in source) {
			if (typeof (dest[name]) == 'undefined') {
				dest[name] = source[name];
			}
		}
		return dest;
	}
};p2p$.ns("com.webp2p.core.utils");

p2p$.com.webp2p.core.utils.Utils = {
	apply : function(dest, src) {
		for ( var n in src) {
			dest[n] = src[n];
		}
	},

	applyIf : function(dest, src) {
		for ( var n in src) {
			if (typeof (dest[n]) != 'undefined') {
				dest[n] = src[n];
			}
		}
	},

	namespace : function(path) {
		var names = path.split('.');
		var obj = $$root;
		for (var i = 0; i < names.length; i++) {
			var name = names[i];
			if (typeof (obj[name]) == 'undefined') {
				obj[name] = {};
			}
			obj = obj[name];
		}
	},

	format : function(fmt) {
		var args = [];
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		return (fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
			return args[i];
		});
	},

	formatDate_ : function(fmt, value) {
		if (!fmt) {
			fmt = 'Y-m-d H:i:s';
		}
		if (!value) {
			return '-';
		} else if (typeof (value) == 'number') {
			value = new Date(value);
		}

		return fmt.replace(/Y/g, value.getFullYear()).replace(/m/g, this.pad(value.getMonth() + 1, 2)).replace(/d/g, this.pad(value.getDate(), 2)).replace(
				/H/g, this.pad(value.getHours(), 2)).replace(/i/g, this.pad(value.getMinutes(), 2)).replace(/s/g, this.pad(value.getSeconds(), 2)).replace(
				/U/g, this.pad(value.getMilliseconds(), 3));
	},

	formatDuration_ : function(value) {
		var result = '';
		if (value > 3600) {
			result += (Math.floor(value / 3600) + ':');
		}
		if (value > 60) {
			result += (this.pad(Math.floor((value % 3600) / 60), 2) + ':');
		}
		if (value >= 0) {
			result += this.pad(Math.floor(value % 60), 2);
		}
		return result;
	},

	size : function(value) {
		var step = 1024;
		if (value < step) {
			return value.toFixed(0) + ' B';
		} else if (value < (step * step)) {
			return (value / step).toFixed(1) + ' KB';
		} else if (value < (step * step * step)) {
			return (value / step / step).toFixed(1) + ' MB';
		} else if (value < (step * step * step * step)) {
			return (value / step / step / step).toFixed(1) + ' GB';
		}
	},

	speed : function(value, bps) {
		value = (value || 0);
		var step = 1024;
		var suffix = 'B/s';
		if (bps) {
			value *= 8;
			step = 1000;
			suffix = 'bps';
		}
		if (value < 1024) {
			return value.toFixed(0) + ' ' + suffix;
		} else if (value < (step * step)) {
			return (value / step).toFixed(1) + ' K' + suffix;
		} else if (value < (step * step * step)) {
			return (value / step / step).toFixed(1) + ' M' + suffix;
		} else if (value < (step * step * step * step)) {
			return (value / step / step / step).toFixed(1) + ' G' + suffix;
		}
	},

	pad : function(num, size) {
		var s = num + "";
		while (s.length < size) {
			s = "0" + s;
		}
		return s;
	},

	trim : function(value) {
		var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
		return (value + '').replace(trimRegex, "");
	},

	getUrlParams_ : function(url) {
		var params = {};
		var paramString = url.indexOf('?') >= 0 ? (url.substr(url.indexOf('?') + 1) || '') : url;
		var paramArray = paramString.split('&');
		for (var i = 0; i < paramArray.length; i++) {
			var itemArray = paramArray[i].split('=');
			var key = '';
			var value = null;
			if (itemArray.length > 0) {
				key = decodeURIComponent(itemArray[0]);
			}
			if (itemArray.length > 1) {
				value = decodeURIComponent(itemArray[1]);
			}
			params[key] = value;
		}
		return params;
	},

	htmlEscape_ : function(str) {
		return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
};
window.JSON = window.JSON || {};
window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
window.RTCPeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription); // order is very important: "RTCSessionDescription" defined

// in Nighly but useless
var CdeByteArray = function($_uInt8Array) {

	this.length = 0;
	this._position = 0;
	this.uInt8Array = new Uint8Array();
	if ($_uInt8Array) {
		this.uInt8Array = new Uint8Array($_uInt8Array);
	}
	this.writeBytes = function(bytes) {
		var tempByteArray = null;
		if (this.uInt8Array) {
			tempByteArray = new Uint8Array(this.uInt8Array.length + bytes.length);
			tempByteArray.set(this.uInt8Array, 0);
			tempByteArray.set(bytes, this.uInt8Array.length);
		} else {
			tempByteArray = bytes;
		}
		this.uInt8Array = tempByteArray;
	};
	this.setBytes = function(int8) {
		this.position = 0;
		this.uInt8Array = int8;
	};

	this.readBytes = function(bytes, offset, length) {
		offset = offset || 0;
		length = length || this.uInt8Array.length;
		if (length === 0) {
			length = this.uInt8Array.length;
		}
		if ((offset === 0 || (offset > 0 && offset < bytes.uInt8Array.length)) && length > 0 && (this.position + length) <= this.uInt8Array.length) {
			var tempBytes0 = new Uint8Array(offset);
			tempBytes0 = bytes.uInt8Array.subarray(0, offset);

			var tempBytes1 = new Uint8Array(tempBytes0.length + length);
			var tempBytes2 = new Uint8Array(length);

			tempBytes2 = this.uInt8Array.subarray(this.position, length);

			tempBytes1.set(tempBytes0);
			tempBytes1.set(tempBytes2, tempBytes0.length);
			bytes.uInt8Array = new Uint8Array(tempBytes1);
		} else {
			console.log("readBytes error");
		}

	};
	this.generationByteArray = function(int8) {
		this.position = 0;
		this.uInt8Array = int8;
	};

	this.clear = function() {
		this.position = 0;
		this.uInt8Array = new Uint8Array();
	};

	this.__defineGetter__("position", function() {
		return this._position;
	});

	this.__defineSetter__("position", function(value) {
		this._position = value;
	});
	this.__defineGetter__("length", function() {
		return this.uInt8Array.length;
	});
	this.__defineGetter__("bytesAvailable", function() {
		return this.length - this._position;
	});

	this.__defineGetter__("CdeByteArray", function() {
		return this.uInt8Array;
	});

};

JSON.stringify = JSON.stringify || function(obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
		// simple data type
		if (t == "string") {
			obj = '"' + obj + '"';
		}
		return String(obj);
	} else {
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for ( n in obj) {
			v = obj[n];
			t = typeof (v);
			if (t == "string") {
				v = '"' + v + '"';
			} else if (t == "object" && v !== null) {
				v = JSON.stringify(v);
			}
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};
p2p$.ns('com.webp2p.core.common');
p2p$.com.webp2p.core.common.Map = CdeBaseClass.extend_({
	/*
	 * MAP对象，实现MAP功能
	 * 
	 * 接口： size() 获取MAP元素个数 isEmpty() 判断MAP是否为空 clear() 删除MAP所有元素 put(key, value) 向MAP中增加元素（key, value) remove(key) 删除指定KEY的元素，成功返回True，失败返回False get(key)
	 * 获取指定KEY的元素值VALUE，失败返回NULL element(index) 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL containsKey(key) 判断MAP中是否含有指定KEY的元素
	 * containsValue(value) 判断MAP中是否含有指定VALUE的元素 values() 获取MAP中所有VALUE的数组（ARRAY） keys() 获取MAP中所有KEY的数组（ARRAY）
	 * 
	 * 例子： var map = new Map();
	 * 
	 * map.put("key", "value"); var val = map.get("key") ……
	 * 
	 */
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
	set : function(_key, _value) {
		for ( var i = 0; i < this.elements_.length; i++) {
			if (this.elements_[i].key == _key) {
				this.elements_[i].value = _value;
				return;
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
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					this.elements_.splice(i, 1);
					this.length--;
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},
	erase : function(_key) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					this.elements_.splice(i, 1);
					this.length--;
					return true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
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
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},
	// 判断MAP中是否含有指定KEY的元素
	find : function(_key) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},
	find2 : function(_key, retValue) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].key == _key) {
					retValue.value = this.elements_[i].value;
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 判断MAP中是否含有指定VALUE的元素
	containsValue : function(_value) {
		var bln = false;
		try {
			for ( var i = 0; i < this.elements_.length; i++) {
				if (this.elements_[i].value == _value) {
					bln = true;
				}
			}
		} catch (e) {
			bln = false;
		}
		return bln;
	},

	// 获取MAP中所有VALUE的数组（ARRAY）
	values : function() {
		var arr = new Array();
		for ( var i = 0; i < this.elements_.length; i++) {
			arr.push(this.elements_[i].value);
		}
		return arr;
	},

	// 获取MAP中所有KEY的数组（ARRAY）
	keys : function() {
		var arr = new Array();
		for ( var i = 0; i < this.elements_.length; i++) {
			arr.push(this.elements_[i].key);
		}
		return arr;
	},
});
p2p$.ns('com.webp2p.core.common');

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message Digest Algorithm, as defined in RFC 1321. Version 2.1 Copyright (C) Paul Johnston 1999 -
 * 2002. Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet Distributed under the BSD License See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with the server-side, but the defaults work in most cases.
 */
p2p$.com.webp2p.core.common.Md5 = {
	hexcase : 0, /* hex output format. 0 - lowercase; 1 - uppercase */
	chrsz : 8, /* bits per input character. 8 - ASCII; 16 - Unicode */

	/*
	 * These are the functions you'll usually want to call They take string arguments and return either hex or base-64 encoded strings
	 */
	hexString_ : function(s) {
		return this.binl2hex_(this.core_md5_(this.str2binl_(s), s.length * this.chrsz));
	},

	/*
	 * Calculate the MD5 of an array of little-endian words, and a bit length
	 */
	core_md5_ : function(x, len) {
		/* append padding */
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;

		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;

		for ( var i = 0; i < x.length; i += 16) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;

			a = this.ff(a, b, c, d, x[i + 0], 7, -680876936);
			d = this.ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = this.ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = this.ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = this.ff(c, d, a, b, x[i + 10], 17, -42063);
			b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = this.ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);

			a = this.gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = this.gg(b, c, d, a, x[i + 0], 20, -373897302);
			a = this.gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = this.gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = this.gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = this.gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = this.gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = this.hh(a, b, c, d, x[i + 5], 4, -378558);
			d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = this.hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = this.hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = this.hh(d, a, b, c, x[i + 0], 11, -358537222);
			c = this.hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = this.hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = this.hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = this.hh(b, c, d, a, x[i + 2], 23, -995338651);

			a = this.ii(a, b, c, d, x[i + 0], 6, -198630844);
			d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = this.ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = this.ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = this.ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = this.ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = this.ii(b, c, d, a, x[i + 9], 21, -343485551);

			a = this.add(a, olda);
			b = this.add(b, oldb);
			c = this.add(c, oldc);
			d = this.add(d, oldd);
		}
		return Array(a, b, c, d);
	},

	/*
	 * These functions implement the four basic operations the algorithm uses.
	 */
	cmn : function(q, a, b, x, s, t) {
		return this.add(this.br(this.add(this.add(a, q), this.add(x, t)), s), b);
	},

	ff : function(a, b, c, d, x, s, t) {
		return this.cmn((b & c) | ((~b) & d), a, b, x, s, t);
	},

	gg : function(a, b, c, d, x, s, t) {
		return this.cmn((b & d) | (c & (~d)), a, b, x, s, t);
	},

	hh : function(a, b, c, d, x, s, t) {
		return this.cmn(b ^ c ^ d, a, b, x, s, t);
	},

	ii : function(a, b, c, d, x, s, t) {
		return this.cmn(c ^ (b | (~d)), a, b, x, s, t);
	},

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally to work around bugs in some JS interpreters.
	 */
	add : function(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	},

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	br : function(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	},

	/*
	 * Convert a string to an array of little-endian words If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
	 */
	str2binl_ : function(str) {
		var bin = Array();
		var mask = (1 << this.chrsz) - 1;
		for ( var i = 0; i < str.length * this.chrsz; i += this.chrsz) {
			bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
		}
		return bin;
	},

	/*
	 * Convert an array of little-endian words to a string
	 */
	binl2str_ : function(bin) {
		var str = "";
		var mask = (1 << this.chrsz) - 1;
		for ( var i = 0; i < bin.length * 32; i += this.chrsz) {
			str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
		}
		return str;
	},

	/*
	 * Convert an array of little-endian words to a hex string.
	 */
	binl2hex_ : function(binarray) {
		var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for ( var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
		}
		return str;
	}
};
p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.String = {
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
			var urlParsed = new p2p$.com.webp2p.core.supernode.Url();
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
			var encodeParams = new p2p$.com.webp2p.core.common.Map();
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
	}
};p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.Number = {
	max : function(value1, value2) {
		return value1 > value2 ? value1 : value2;
	},

	min : function(value1, value2) {
		return value1 > value2 ? value2 : value1;
	},

	maxUnsignedValue_ : function() {
		return -1 >>> 0;
	},

	convertToBit_ : function(size, data, _array) {
		var __uint8 = null;
		switch (size) {
		case "2":
			__uint8 = new Uint8Array(2);
			__uint8[0] = (parseInt(data) >> 8) & 0xff;
			__uint8[1] = parseInt(data) & 0xff;
			_array.push(__uint8);
			break;
		case "4":
			__uint8 = new Uint8Array(4);
			__uint8[0] = (parseInt(data) >> 24) & 0xff;
			__uint8[1] = (parseInt(data) >> 16) & 0xff;
			__uint8[2] = (parseInt(data) >> 8) & 0xff;
			__uint8[3] = parseInt(data) & 0xff;
			_array.push(__uint8);
			break;
		case "8":
			__uint8 = new Uint8Array(8);
			var data1 = Math.floor(data / 0x100000000);
			__uint8[0] = (data1 >> 24) & 0xff;
			__uint8[1] = (data1 >> 16) & 0xff;
			__uint8[2] = (data1 >> 8) & 0xff;
			__uint8[3] = (data1) & 0xff;
			var data2 = Math.floor(data % 0x100000000);
			__uint8[4] = (data2 >> 24) & 0xff;
			__uint8[5] = (data2 >> 16) & 0xff;
			__uint8[6] = (data2 >> 8) & 0xff;
			__uint8[7] = (data2) & 0xff;
			_array.push(__uint8);
			break;
		case "utf":
			__uint8 = new Uint8Array(data.length);
			for ( var i = 0; i < data.length; i++) {
				__uint8[i] = data.charCodeAt(i);
			}
			_array.push(__uint8);
			break;
		case "d":
			if (data && data.length > 0) {
				_array.push(data);
			}
			break;
		}
	},

	convertToValue_ : function(size, byteArray, position, len) {
		var value1;
		var value2;
		var value3;
		var value4;
		var value = null;
		switch (size) {
		case "2":
			value1 = byteArray[position];
			value2 = byteArray[position + 1];
			value = (value1 << 8) + value2;
			break;
		case "4":
			value1 = byteArray[position];
			value2 = byteArray[position + 1];
			value3 = byteArray[position + 2];
			value4 = byteArray[position + 3];
			value = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
			break;
		case "8":
			value1 = byteArray[position];
			value2 = byteArray[position + 1];
			value3 = byteArray[position + 2];
			value4 = byteArray[position + 3];

			var high = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
			value1 = byteArray[position + 4];
			value2 = byteArray[position + 5];
			value3 = byteArray[position + 6];
			value4 = byteArray[position + 7];
			var low = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
			value = (high * 0x100000000) + low;
			break;
		case "utf":
			var str = "";
			for ( var i = 0; i < len; i++) {
				str += String.fromCharCode(byteArray[position + i]);
			}
			value = str;
			break;
		case "d":
			value = byteArray.subarray(position, position + len);
			break;
		}
		return value;
	}
};p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.META_DATA_TYPE = {
	kMetaDataTypeVod : 0,
	kMetaDataTypeLive : 1,
	kMetaDataTypeDownload : 2,
	kMetaDataTypeRtlStream : 3
};

p2p$.com.webp2p.core.common.META_PIECE_TYPE = {
	kMetaPieceTypeTn : 0,
	kMetaPieceTypePn : 1
};

p2p$.com.webp2p.core.common.ERROR_CODE = {
	kErrorSuccess : 0,
	kErrorAccessDenied : 1,
	kErrorInvalidParameters : 2,
	kErrorInternalError : 3,
	kErrorDestUnreachable : 4,
	kErrorServiceBusy : 5,
	kErrorNetworkUnreachable : 6,
	kErrorAlreadyExists : 7,
	kErrorNoSuchGroup : 8,
	kErrorNoSuchGroupItem : 9,
	kErrorNoSuchSession : 10,
	kErrorNoSuchItem : 11,
	kErrorNetworkFailed : 12,
	kErrorTimeout : 13,
	kErrorNotReady : 14,
	kErrorStreamIdIsEmpty : 15,
	kErrorCanceled : 16,
	kErrorAuthFailed : 17,
	kErrorNoPrivileges : 18,
	kErrorAlreadyLogin : 19,
	kErrorServiceOffline : 20,
	kErrorNotSupported : 21,
	kErrorPasswordExpired : 22,
	kErrorCodeMax : 23,
};

p2p$.com.webp2p.core.common.SERVER_TYPES = {
	kServerTypeReserved : 0,
	kServerTypeControl : 1,
	kServerTypeStorage : 2,
	kServerTypeRtmfp : 4,
	kServerTypeWebRTC : 8,
	kServerTypeHttpTracker : 16,
	kServerTypeReserved5 : 32,
	kServerTypeStunServer : 64,
	kServerTypeSelector : 128,
};

p2p$.com.webp2p.core.common.Enum = {
	getMetaTypeName_ : function(type) {
		switch (type) {
		case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod:
			return "vod";
		case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive:
			return "live";
		case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload:
			return "download";
		case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeRtlStream:
			return "stream";
		default:
			return "unknown";
		}
	},

	getPieceTypeName_ : function(type) {
		switch (type) {
		case p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn:
			return "tn";
		case p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn:
			return "pn";
		default:
			return "unknown";
		}
	}
};p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.ERROR_CODE = {
	kErrorSuccess : 0,
	kErrorAccessDenied : 1,
	kErrorInvalidParameters : 2,
	kErrorInternalError : 3,
	kErrorDestUnreachable : 4,
	kErrorServiceBusy : 5,
	kErrorNetworkUnreachable : 6,
	kErrorAlreadyExists : 7,
	kErrorNoSuchGroup : 8,
	kErrorNoSuchGroupItem : 9,
	kErrorNoSuchSession : 10,
	kErrorNoSuchItem : 11,
	kErrorNetworkFailed : 12,
	kErrorTimeout : 13,
	kErrorNotReady : 14,
	kErrorCanceled : 15,
	kErrorAuthFailed : 16,
	kErrorNoPrivileges : 17,
	kErrorAlreadyLogin : 18,
	kErrorServiceOffline : 19,
	kErrorNotSupported : 20,
	kErrorPasswordExpired : 21,
	kErrorCodeMax : 22,
};p2p$.ns('com.webp2p.core.common');

p2p$.com.webp2p.core.common.LOG_LEVEL = {
	kLogLevelNone : 0x00,
	kLogLevelTrace : 0x01,
	kLogLevelInfo : 0x02,
	kLogLevelWarning : 0x04,
	kLogLevelError : 0x08,
	kLogLevelFatal : 0x10,
	kLogLevelAll : 0xff,
};

p2p$.com.webp2p.core.common.LOG_OUTPUT = {
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

p2p$.com.webp2p.core.common.Log = {
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

	init : function(level, logServer) {
		var levels = p2p$.com.webp2p.core.common.LOG_LEVEL;
		// levels.kLogLevelTrace |
		this.level_ = level >= 0 ? level : (levels.kLogLevelTrace | levels.kLogLevelInfo | levels.kLogLevelWarning | levels.kLogLevelError);
		this.logPipe_ = new p2p$.com.webp2p.core.entrance.LogPipDefault(logServer);
	},

	trace : function(logTime, fmt) {
		var level = p2p$.com.webp2p.core.common.LOG_LEVEL.kLogLevelTrace;
		if ((this.level_ & level) == p2p$.com.webp2p.core.common.LOG_LEVEL.kLogLevelNone) {
			return;
		}

		try {
			console.log("CDE: [" + logTime + " - TRC]", fmt);
		} catch (e) {
		}
		if (this.logPipe_) {
			this.logPipe_.addRecord_(level, "TRC", fmt);
		}
	},

	info : function(logTime, fmt) {
		var level = p2p$.com.webp2p.core.common.LOG_LEVEL.kLogLevelInfo;
		if ((this.level_ & level) == p2p$.com.webp2p.core.common.LOG_LEVEL.kLogLevelNone) {
			return;
		}

		try {
			console.info("CDE: [" + logTime + " - INF]", fmt);
		} catch (e) {
		}
		if (this.logPipe_) {
			this.logPipe_.addRecord_(level, "INF", fmt);
		}
	},

	warning : function(logTime, fmt) {
		var level = p2p$.com.webp2p.core.common.LOG_LEVEL.kLogLevelWarning;
		if ((this.level_ & level) == p2p$.com.webp2p.core.common.LOG_LEVEL.kLogLevelNone) {
			return;
		}

		try {
			console.warn("CDE: [" + logTime + " - WRN]", fmt);
		} catch (e) {
		}
		if (this.logPipe_) {
			this.logPipe_.addRecord_(level, "WRN", fmt);
		}
	},

	error : function(logTime, fmt) {
		var level = p2p$.com.webp2p.core.common.LOG_LEVEL.kLogLevelError;
		if ((this.level_ & level) == p2p$.com.webp2p.core.common.LOG_LEVEL.kLogLevelNone) {
			return;
		}

		try {
			// console.error.apply(console, arguments__);
			console.error("CDE: [" + logTime + " - ERR]", fmt);
		} catch (e) {
		}
		if (this.logPipe_) {
			this.logPipe_.addRecord_(level, "ERR", level);
		}
	}
};

function P2P_ULOG_TRACE(fmt) {
	var logTime = p2p$.com.webp2p.core.common.Global.getCurentTime_();
	// p2p$.com.webp2p.core.common.Log.trace.apply(this, arguments);
	for ( var i = 0; i < arguments.length; i++) {
		p2p$.com.webp2p.core.common.Log.trace(logTime, arguments[i]);
	}
	// p2p$.com.webp2p.core.common.Log.trace(fmt);
};

function P2P_ULOG_INFO(fmt) {
	var logTime = p2p$.com.webp2p.core.common.Global.getCurentTime_();
	for ( var i = 0; i < arguments.length; i++) {
		p2p$.com.webp2p.core.common.Log.info(logTime, arguments[i]);
	}
};

function P2P_ULOG_WARNING(fmt) {
	var logTime = p2p$.com.webp2p.core.common.Global.getCurentTime_();
	for ( var i = 0; i < arguments.length; i++) {
		p2p$.com.webp2p.core.common.Log.warning(logTime, arguments[i]);
	}
	// p2p$.com.webp2p.core.common.Log.warning(fmt);
};

function P2P_ULOG_ERROR(fmt) {
	var logTime = p2p$.com.webp2p.core.common.Global.getCurentTime_();
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
		p2p$.com.webp2p.core.common.Log.error(logTime, arguments[i]);
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
};p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.Module = {
	kBuildDate : "2015-07-02",
	kBuildTime : "2015-07-02 10:54:42",
	kVenderName : "",

	// folders
	kBinName : "bin", // suffix .bin
	kConfigName : "config", // suffix .json
	kLogName : "log", // suffix .log
	kShareName : "share", // suffix .shm
	kWebName : "web", // suffix .web
	kDataName : "data", // suffix .*
	kP2pVersion : "1.3m3u8_12272000", // p2p version tag

	kCdeMajorVersion : 0,
	kCdeMinorVersion : 9,
	kCdeBuildNumber : 65,
	// kCdeFullVersion:this.kCdeMajorVersion*1000 + this.kCdeMinorVersion*100 + this.kCdeBuildNumber,

	getKp2pVersion_ : function() {
		return this.kP2pVersion;
	},

	getkCdeFullVersion_ : function() {
		return this.kCdeMajorVersion * 1000 + this.kCdeMinorVersion * 100 + this.kCdeBuildNumber;
	}
};p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.Global = {
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

	getCurentTime_ : function(defultTimestamp) {
		var now = new Date();
		if (typeof defultTimestamp != 'undefined') {
			now.setTime(defultTimestamp * 1000);
		}
		var year = now.getFullYear(); // 年
		var month = now.getMonth() + 1; // 月
		var day = now.getDate(); // 日
		var hh = now.getHours(); // 时
		var mm = now.getMinutes(); // 分
		var sec = now.getSeconds();
		var millSec = now.getMilliseconds();
		var clock = year + "-";
		if (month < 10) {
			clock += "0";
		}
		clock += month + "-";
		if (day < 10) {
			clock += "0";
		}
		clock += day + " ";
		if (hh < 10) {
			clock += "0";
		}
		clock += hh + ":";
		if (mm < 10) {
			clock += '0';
		}
		clock += mm + ":";
		;
		if (sec < 10) {
			clock += '0';
		}
		clock += sec + ".";
		if (millSec < 100) {
			clock += '0';
		}
		if (millSec < 10) {
			clock += '0';
		}
		clock += millSec;
		return (clock);
	},

	speed : function(value, bps) {
		value = (value || 0);
		var step = 1024;
		var suffix = 'B/s';
		if (bps) {
			value *= 8;
			step = 1000;
			suffix = 'bps';
		}
		if (value < 1024) {
			return value.toFixed(0) + ' ' + suffix;
		} else if (value < (step * step)) {
			return (value / step).toFixed(1) + ' K' + suffix;
		} else if (value < (step * step * step)) {
			return (value / step / step).toFixed(1) + ' M' + suffix;
		} else if (value < (step * step * step * step)) {
			return (value / step / step / step).toFixed(1) + ' G' + suffix;
		}
	}
};p2p$.ns('com.webp2p.core.entrance');

p2p$.com.webp2p.core.entrance.VideoStream = {
	initialized_ : false,
	channelManager_ : null,
	pool_ : null,
	enviroment_ : null,
	connectionType_ : "",

	init : function() {
		if (this.initialized_) {
			return;
		}
		this.connectionType_ = "";
		this.initialized_ = true;
		this.enviroment_ = p2p$.com.webp2p.core.supernode.Enviroment;
		this.enviroment_.initialize_();
		this.checkNetwork_();
		this.channelManager_ = new p2p$.com.webp2p.logic.base.Manager(this.enviroment_);
		this.pool_ = p2p$.com.webp2p.core.storage.Pool;
		this.pool_.initialize_(this.channelManager_);
		this.setCheckTimer_(5000);
	},

	checkNetwork_ : function() {
		var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		if (connection) {
			this.connectionType_ = connection.type;

			try {
				var me = this;
				// Register for event changes.
				connection.onchange = function(e) {
					me.onNetowrkTypeChanged_(e);
				};
				// Alternatively.
				connection.addEventListener('change', function(e) {
					me.onNetowrkTypeChanged_(e);
				});
			} catch (e) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Add network change event failed: {0}", (e || "").toString()));
			}

			P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Check network, type: {0}", this.connectionType_));
		} else {
			var osType = "unknown";
			try {
				var sUserAgent = navigator.userAgent;
				var isWindows = (navigator.platform == "Win32") || (navigator.platform == "Windows");
				var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh")
						|| (navigator.platform == "MacIntel");
				if (isMac) {
					osType = "mac";
				} else if (String(navigator.platform).toLowerCase().indexOf("android") > -1 || sUserAgent.toLowerCase().indexOf("android") > -1) {
					osType = "android";
				} else {
					osType = isWindows ? "windows" : "other";
				}
			} catch (e) {
			}

			this.connectionType_ = (osType == "windows" || osType == "mac") ? "ethernet" : "mobile";
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Check network not support, os {0} default as {1}", osType, this.connectionType_));
		}
		this.enviroment_.setNetworkType_(this.connectionType_);
	},

	onNetowrkTypeChanged_ : function(e) {
		var temp = this.connectionType_;
		this.connectionType_ = navigator.connection.type;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Network changed from ({0}) to ({1})", temp, this.connectionType_));
		this.enviroment_.setNetworkType_(connectionType);
		this.channelManager_.checkTimeout_();
	},

	onCheckTimeout_ : function() {
		this.channelManager_.checkTimeout_();
		// this.checkInactiveNotifiers_();
		// this.checkTimeoutChannels_();
		this.setCheckTimer_(5000);
	},

	setCheckTimer_ : function(timeoutMs) {
		var me = this;
		this.checkTimer_ = setTimeout(function() {
			me.onCheckTimeout_();
		}, timeoutMs);
	},

	getConnectionParams_ : function(palyUrl, url) {
		url.fromString_(palyUrl);
	},

	requestPlay_ : function(palyUrl) {

		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::entrance::VideoStream::Request play, url({0})", palyUrl));

		var channel = null;
		var url = new p2p$.com.webp2p.core.supernode.Url();
		this.playUrl_ = palyUrl;
		this.getConnectionParams_(palyUrl, url);

		channel = this.channelManager_.openChannel(this.playUrl_, url.params_, this);
		if (!channel) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::entrance::VideoStream::Open channel failed"));
		}
		return channel;
	},

	requestPlaySlice_ : function(channelId, requestSegmentId, urgentSegmentId) {
		// get segment
		// var responseCode = 0;
		var responseDetails = "";
		var channel = this.channelManager_.getChannelById_(channelId);

		if (channel == null) {
			// responseCode = 200;
			responseDetails = "Channel Not Found";
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Request play slice {0}", responseDetails));
			return null;
		}

		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::entrance::VideoStream::Request play slice urgent segment id: {0}", requestSegmentId));
		var result = channel.requireSegmentData_(requestSegmentId, urgentSegmentId);
		// streamInfo == null || streamInfo.stream == null
		// segment:segment,stream:retStream
		if (result.segment != null && result.stream != null) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Request play slice request urgent({0}) success", requestSegmentId));
		} else {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("core::entrance::VideoStream::Request play slice request urgent({0}) failed", requestSegmentId));
		}
		return result;
	},

	requestPlayStop_ : function(palyUrl) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Request stop {0}", palyUrl));
		this.channelManager_.closeChannel_(palyUrl);
	},

	requestControlParams_ : function() {
	},

	getConnectionParams2_ : function(palyUrl) {
		var urlParse = new p2p$.com.webp2p.core.supernode.Url();
		urlParse.fromString_(palyUrl);
		return urlParse.params_;
	},

	requestStateCurrent_ : function(url) {
		var params, result = {};
		params = this.getConnectionParams2_(url);
		var maxLogTime = 0;
		this.getCurrentState_(params, result, maxLogTime);
		return result;
	},

	getCurrentState_ : function(params, result, maxLogTime) {
		// module
		var moduleResult = result["module"] = {};
		moduleResult["version"] = p2p$.com.webp2p.core.common.String.format("CDE-{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber);
		moduleResult["buildTime"] = p2p$.com.webp2p.core.common.Module.kBuildTime;

		// system
		result["system"] = {};
		this.getSystemInfoDetails_(params, result["system"]);

		// enviroment
		result["enviroment"] = {};
		this.enviroment_.getAllStatus_(result["enviroment"]);
		// this.supportSession_.getAllStatus_(result["support"]);

		if (!params.get("ignoreChannels")) {
			this.channelManager_.getAllStatus_(params, result);
		}

		// log pipes
		if (params.get("needLogPipe")) {
			var logResult = p2p$.com.webp2p.core.common.Log.logPipe_.require(parseInt(params.get("logPipeId") || 0), parseInt(params.get("logPipeTime") || 0),
					parseInt(params.get("logPipeLevel") || 255), params.get("logPipeFilter") || "", parseInt(params.get("logPipeLimit") || 1), maxLogTime);
			maxLogTime = logResult.maxLogTime;
			result["logs"] = logResult.records;
		}

		return maxLogTime;
	},

	getSystemInfoDetails_ : function(params, result) {
		result["currentTime"] = new Date().getTime() / 1000;

		// system:default bucket
		var defaultBucket = p2p$.com.webp2p.core.storage.Pool.getDefaultBucket_();
		var storageInfo = result["storage"] = {};
		var defaultInfo = storageInfo["default"] = {};
		defaultInfo["name"] = defaultBucket.getName_();
		defaultInfo["dataSize"] = defaultBucket.getDataSize_();
		defaultInfo["dataCapacity"] = defaultBucket.getDataCapacity_();
	}
};p2p$.ns('com.webp2p.core.entrance');

p2p$.com.webp2p.core.entrance.LogPipDefault = CdeBaseClass.extend_({
	records_ : null,
	uploadTimer_ : null,
	logServer_ : null,
	logDom_ : null,
	maxRecordCount_ : 500,
	nextLogId_ : 0,

	init : function(logServer) {
		this.records_ = [];
		this.uploadTimer_ = null;
		this.logServer_ = logServer;
		this.nextLogId_ = 1;
		// this.setUploadTimeout_(2000);

		this.logDom_ = document.getElementById("cde-log-container");
	},

	setUploadTimeout_ : function(timeoutMs) {
		var me = this;
		this.uploadTimer_ = setTimeout(function() {
			me.onUploadTimeout_();
		}, timeoutMs);
	},

	onUploadTimeout_ : function() {
		this.upload();
		this.setUploadTimeout_(2000);
	},

	addRecord_ : function(level, name, log) {
		// this.records_.push(log);

		var logTime = p2p$.com.webp2p.core.common.Global.getCurentTime_();
		var formatLog = "[" + logTime + " - " + name + "]" + log;

		if (this.logServer_) {
			$.post(this.logServer_, {
				sessionid : p2p$.com.webp2p.core.supernode.Enviroment.moduleId_,
				log : formatLog
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
				this.logDom_.value += formatLog;
			} catch (e) {
			}
		}

		if (this.records_.length >= this.maxRecordCount_) {
			this.records_.shift();
		}
		var localTime = new Date().getTime() * 1000;
		this.records_.push({
			level : level,
			id : this.nextLogId_++,
			localTime : localTime,
			absTime : localTime,
			content : log
		});
	},

	upload : function() {
		var params = "";
		for ( var n = 0; n < this.records_.length; n++) {
			params += this.records_[n] + "\r\n";
		}
		this.records_ = [];
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader("http://127.0.0.1:8000/", this, "POST", "", "upload::log", {
			log : params
		});
		this.downloader_.load();
	},

	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;
		this.downloader_ = null;
		if ("upload::log" == downloader.tag_) {
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				return handled;
			} else {

			}
		}
	},

	require : function(lastId, lastTime, level, filter, limit, maxLogTime) {
		var result = {
			records : [],
			maxLogTime : maxLogTime
		};
		for ( var i = 0; i < this.records_.length; i++) {
			var item = this.records_[i];
			if (item.id <= lastId || item.absTime <= lastTime) {
				continue;
			} else if ((item.level & level) == 0) {
				continue;
			} else if (filter && item.content.indexOf(filter) < 0) {
				continue;
			}

			result.maxLogTime = Math.max(result.maxLogTime, item.absTime);
			result.records.unshift(item);
			if (result.records.length >= limit) {
				break;
			}
		}
		return result;
	}
});p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.BucketStatic = {
	kLowDataCapacity : 30 * 1024 * 1024,
	kUpperMemoryCapacity : 60 * 1024 * 1024,
	kUpperDataCapacity : 1000 * 1024 * 1024
},

p2p$.com.webp2p.core.storage.Bucket = CdeBaseClass.extend_({
	name_ : "",
	opened_ : false,
	dataSize_ : 0,
	dataCapacity_ : 0,
	upperCapacity_ : 0,
	maxOpenBlocks_ : 0,

	init : function(name) {
		this.name_ = name;
		this.opened_ = false;
		this.dataSize_ = 0;
		this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity;
		this.upperCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kUpperDataCapacity;
		this.maxOpenBlocks_ = 500;
	},

	getName_ : function() {
		return this.name_;
	},

	getDataSize_ : function() {
		return this.dataSize_;
	},

	getDataCapacity_ : function() {
		return this.dataCapacity_;
	},

	getMaxOpenBlocks_ : function() {
		return this.maxOpenBlocks_;
	},

	setDataCapacity_ : function(size) {
		var old = this.dataCapacity_;
		if (size <= this.upperCapacity_) {
			this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity > size ? p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity
					: size;
		} else {
			this.dataCapacity_ = this.upperCapacity_;
		}
		return old;
	},

	available : function() {
		return this.opened_;
	},
});p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.MemoryBlock = CdeBaseClass.extend_({
	archived_ : false,
	activeTime_ : 0,
	writeTime_ : 0,
	archiveTime_ : 0,
	data_ : "",

	init : function() {
		this.archived_ = false;
		this.activeTime_ = 0;
		this.writeTime_ = 0;
		this.archiveTime_ = 0;
		this.data_ = "";// new ArrayBuffer(0);
	},
});

p2p$.com.webp2p.core.storage.MemoryBucket = p2p$.com.webp2p.core.storage.Bucket.extend_({
	lowCapacity_ : false,
	blocks_ : null,
	manager_ : null,

	init : function(manager) {
		this.manager_ = manager;
		this._super("memory");
		this.lowCapacity_ = false;
		this.blocks_ = new p2p$.com.webp2p.core.common.Map();// p2p$.com.webp2p.core.storage.MemoryBlock();
	},

	open : function() {
		this.blocks_.clear();

		// core::common::PhysicalMemory memory;
		// if( !core::common::System::getPhysicalMemory(memory) )
		// {
		// __ULOG_ERROR(__ULOG_FMT_ERR("core::storage::MemoryBucket", "Query system physical memory info failed"), __UERR_CODE, __UERR_STR);
		// }

		this.lowCapacity_ = false;
		this.dataCapacity_ = 200 * 1024 * 1024;// memory.availableBytes_ / 5;
		this.upperCapacity_ = this.dataCapacity_;
		if (this.dataCapacity_ < p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity) {
			this.lowCapacity_ = true;
			this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity;
			this.upperCapacity_ = this.dataCapacity_;
		} else if (this.dataCapacity_ > p2p$.com.webp2p.core.storage.BucketStatic.kUpperMemoryCapacity) {
			this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kUpperMemoryCapacity;
		}

		// P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::System physical memory total size(" _U64FMT_ " Bytes), available " _U64FMT_ " Bytes, using "
		// _I64FMT_
		// " Bytes"),
		// memory.totalBytes_, memory.availableBytes_, dataCapacity_);
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Open successfully"));

		// memory always open
		this.opened_ = true;
		return true;
	},

	close : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::losing...."));

		this.opened_ = false;
		this.blocks_.clear();

		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Closed"));
		return true;
	},

	clearExpiredBlocks_ : function(currentId) {
		var removedCount = 0;
		var minBlockTime = -1;
		var elemIndex = null;
		for ( var n = 0; n < this.blocks_.length; n++) {
			// ignore current block
			var elem = this.blocks_.element(n);
			if (elem.key == currentId) {
				continue;
			}
			if (minBlockTime < 0 || elem.value.writeTime_ < minBlockTime) {
				elemIndex = elem;
				minBlockTime = elem.value.writeTime_;
			}
		}
		if (elemIndex != this.blocks_.element(this.blocks_.length - 1)) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Clear expire block({0}), size({1}), last write({2})", elemIndex.key,
					elemIndex.value.data_.length, p2p$.com.webp2p.core.common.String.formatTime_(elemIndex.value.writeTime_, "yyyy-M-d h:m:s")));

			removedCount++;
			this.dataSize_ -= elemIndex.value.data_.length;
			this.blocks_.erase(elemIndex.key);
			var items = elemIndex.key.split("//");
			if (items.length >= 3) {
				for ( var n = 0; n < this.manager_.channels_.length; n++) {
					var mapItem = this.manager_.channels_.element(n);
					if (mapItem.value.id_ == items[1]) {
						var channel = mapItem.value;
						channel.resetSegmentPieceCompletion_(items[2]);
					}
				}
			}

		}
		return removedCount;
	},

	exists : function(objectId) {
		return this.blocks_.find(objectId);
	},

	archived : function(objectId) {
	},

	read : function(objectId, offset, size) {
		var itrFind = this.blocks_.find(objectId);
		if (!itrFind) {
			return -1;
		}
		if (typeof size == 'undefined') {
			size = p2p$.com.webp2p.core.common.Number.maxUnsignedValue_();
		}
		var block = this.blocks_.get(objectId);
		var stream = null;
		if (size == p2p$.com.webp2p.core.common.Number.maxUnsignedValue_()) {
			stream = block.data_;
		} else if (offset == 0 && size == block.data_.length) {
			stream = block.data_;
		} else {
			stream = block.data_.subarray(offset, offset + size);
		}
		return stream;

		// {"stream":block,"block":tmpBlock};
		// size_t offsize = (block.data_.size() > offset) ? (block.data_.size() - offset) : 0;
		// block.activeTime_ = core::common::getHighResolutionTime();
		// if( nullptr == data )
		// {
		// return offsize;
		// }
		//
		// size_t result = std::min<size_t>(size, offsize);
		// memcpy(data, block.data_.data() + offset, result);
	},

	write : function(objectId, offset, data, size) {
		if (this.dataSize_ + size > this.dataCapacity_) {
			while (this.dataSize_ + size > this.dataCapacity_) {
				if (this.clearExpiredBlocks_(objectId) <= 0) {
					break;
				}
			}
		}
		var block = this.blocks_.get(objectId);
		block.activeTime_ = block.writeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		var minSize = offset + size;
		var allocSize = (minSize > block.data_.length) ? (minSize - block.data_.length) : 0;
		if (allocSize > 0) {
			block.data_ = new Uint8Array(minSize);
			this.dataSize_ += allocSize;
		}
		block.data_.set(data, offset);
		// memcpy((uint8 *)(block.data_.data() + offset), data, size);
		return true;
	},

	archive : function(objectId, archived) {
	},

	reserve : function(objectId, size) {
		var block = this.blocks_.get(objectId);
		if (typeof block == 'undefined' || block == null) {
			block = new p2p$.com.webp2p.core.storage.MemoryBlock();
			this.blocks_.set(objectId, block);
		}
		block.activeTime_ = block.writeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var allocSize = (size > block.data_.length) ? (size - block.data_.length) : 0;
		if (allocSize > 0) {
			block.data_ = new Uint8Array(size);
			this.dataSize_ += allocSize;
		}
		return true;
	},

	remove : function(objectId) {
		var itrFind = this.blocks_.find(objectId);
		if (!itrFind) {
			return -1;
		}
		var block = this.blocks_.get(objectId);
		this.dataSize_ -= block.data_.length;
		this.blocks_.erase(objectId);
		return true;
	}
});p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.Pool = {

	buckets_ : null,
	memoryBucket_ : null,

	initialize_ : function(manager) {
		this.buckets_ = [];
		this.memoryBucket_ = null;
		this.memoryBucket_ = new p2p$.com.webp2p.core.storage.MemoryBucket(manager);
		this.buckets_.push(this.memoryBucket_);

		for ( var n = 0; n < this.buckets_.length; n++) {
			var item = this.buckets_[n];
			if (!item.open()) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Open bucket({0}) failed", item.getName_()));
				return false;
			}
		}

		// if( params.isMember("core.storage.maxMemoryDataSize") )
		// {
		// // Mega-Bytes
		// int64 dataCapacity = params["core.storage.maxMemoryDataSize"].asInt64() * core::common::kByteUnitsPerMega;
		// int64 oldCapacity = memoryBucket_->setDataCapacity_(dataCapacity);
		//
		// __ULOG_INFO(__ULOG_FMT("core::storage::Pool", "Set memory storage bucket data capacity(" _I64FMT_ " to " _I64FMT_ " bytes)..."),
		// oldCapacity, dataCapacity);
		// }

		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Initialize successfully"));
		return true;
	},

	exit : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Exiting...."));
		for ( var n = 0; n < this.buckets_.length; n++) {
			var item = this.buckets_[n];
			item.close();
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Exited"));
	},

	getDefaultBucket_ : function() {
		return this.memoryBucket_;
	},

	getMemoryBucket_ : function() {
		return this.memoryBucket_;
	}
};p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.Url = CdeBaseClass.extend_({
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
		this.params_ = new p2p$.com.webp2p.core.common.Map();
	},

	getParams : function() {
		return this.params_;
	},

	fromString_ : function(value) {
		p2p$.com.webp2p.core.common.String.parseUrl_(value, this, false);
	},

	toString : function() {
		var isDefaultPort = (this.port_ == 0) || (this.protocol_ == "http" && this.port_ == 80) || (this.protocol_ == "https" && this.port_ == 443);
		var protocolName = this.protocol_ == "" ? "http" : this.protocol_;

		var value;
		if (isDefaultPort) {
			value = protocolName + "://" + this.host_ + this.file_;
		} else {
			value = protocolName + "://" + this.host_ + ":" + this.port_ + this.file_;
		}

		return value + this.toQueryString_();
	},

	toQueryString_ : function(fromFirst) {
		var value = "";
		var isFirstKey = true;
		if (typeof fromFirst == 'undefined') {
			isFirstKey = true;
		} else {
			isFirstKey = fromFirst;
		}
		if (!this.params_.empty()) {
			for ( var i = 0; i < this.params_.elements_.length; i++) {
				// var vthis.params_.elements_[i].value
				if (isFirstKey) {
					value += "?";
				} else {
					value += "&";
				}
				value += (p2p$.com.webp2p.core.common.String.urlEncodeNonAscii_(this.params_.elements_[i].key) + "=" + p2p$.com.webp2p.core.common.String
						.urlEncodeNonAscii_(this.params_.elements_[i].value));
				isFirstKey = false;
			}
		}

		if (this.segment_ != "") {
			value += "#";
			value += segment_;
		}
		return value;
	}
});p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.NetworkType = {
	kNetworkTypeReserved : 0,
	kNetworkTypeEthernet : 1,
	kNetworkTypeMobile : 2,
	kNetworkTypeWifi : 3,
	kNetworkTypeMobile2G : 4,
	kNetworkTypeMobile3G : 5,
	kNetworkTypeMobile4G : 6,
	kNetworkTypeMobile5G : 7,
	kNetworkTypeMax : 8,
};

p2p$.com.webp2p.core.supernode.Enviroment = {

	// properties
	initialized_ : false,
	debug_ : false,
	p2pEnabled_ : false,
	p2pUploadEnabled_ : false,
	rtlStreamEnabled_ : false,
	liveStorageMemoryOnly_ : false,
	vodStorageMemoryOnly_ : false,
	networkType_ : 0,
	appId_ : 0,
	dataDirectory_ : "",
	externalAppId_ : "",
	externalAppVersion_ : "",
	externalAppChannel_ : "",
	externalAppPackageName_ : "",
	moduleVersion_ : "",
	moduleId_ : "",
	clientGeo_ : "",
	clientGeoName_ : "",
	clientIp_ : "",
	deviceType_ : "",
	osType_ : "",
	rootDomain_ : "",
	globalProxyUrl_ : "",
	defaultGslbTss_ : "",
	defaultGslbM3v_ : "",

	hlsServerPort_ : 0,
	livePlayOffset_ : 0, // seconds
	specialPlayerTimeOffset_ : 0, // seconds, default player offset
	specialPlayerTimeLimit_ : 0, // seconds, default player limit
	downloadSpeedRatio_ : 0, // download speed control rate, compare with bitrate

	// control params
	protocolCdnDisabled_ : false,
	protocolRtmfpDisabled_ : false,
	protocolWebsocketDisabled_ : false,
	protocolWebrtcDisabled_ : false,

	// custom params
	customContextParams_ : "",
	customMediaParams_ : "",
	customDomainMaps_ : null,

	paramWebrtcServer_ : "",
	paramTrackerServer_ : "",
	paramIsPlayWithlocalVideo_ : false,
	paramCloseWebrtc_ : false,
	paramCloseWebsocket_ : false,
	paramStunServer_ : "",

	initialize_ : function() {
		if (this.initialized_) {
			return;
		}

		this.initialized_ = true;
		this.customDomainMaps_ = new p2p$.com.webp2p.core.common.Map();
		this.debug_ = false;
		this.p2pEnabled_ = true;
		this.p2pUploadEnabled_ = true;
		this.rtlStreamEnabled_ = false;
		this.liveStorageMemoryOnly_ = false;
		this.vodStorageMemoryOnly_ = false;
		this.networkType_ = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeEthernet;
		this.appId_ = 800;
		this.externalAppId_ = "800"; // H5
		this.moduleVersion_ = p2p$.com.webp2p.core.common.String.format("CDE-{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber);
		this.moduleId_ = p2p$.com.webp2p.core.common.String.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random()
				* (1000 + 1)), Math.floor(Math.random() * (1000 + 1)), p2p$.com.webp2p.core.common.Global.getMilliTime_());
		this.defaultGslbTss_ = "tvts";
		this.defaultGslbM3v_ = "1";
		this.hlsServerPort_ = 0;
		this.livePlayOffset_ = 120;
		this.specialPlayerTimeOffset_ = 0; // disabled
		this.specialPlayerTimeLimit_ = 0; // disabled
		this.downloadSpeedRatio_ = -1; // disabled
		this.customContextParams_ = "";
		this.customMediaParams_ = "";

		// control params
		this.protocolCdnDisabled_ = false;
		this.protocolRtmfpDisabled_ = false;
		this.protocolWebsocketDisabled_ = false;
		this.protocolWebrtcDisabled_ = false;

		this.deviceType_ = this.getDeviceType_();

		this.browserType_ = this.getBrowserType_();
		this.osType_ = this.getOSType_();
	},

	close : function() {
	},

	isMobileNetwork_ : function() {
		if (this.networkType_ == p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeWifi
				|| this.networkType_ == p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeEthernet) {
			return false;
		} else {
			return true;
		}

	},

	isSpecialAppId_ : function() {
	},

	setNetworkType_ : function(connectionType) {
		var networkType = 0;
		if (connectionType == "ethernet") {
			networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeEthernet;
		} else if (connectionType == "cellular" || connectionType == "mobile" || connectionType == "wimax") {
			networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeMobile;
		} else if (connectionType == "wifi") {
			networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeWifi;
		} else {
			networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeMobile;
			// networkType = p2p$.com.webp2p.core.supernode.NetworkType.kNetworkTypeReserved;
		}
		this.networkType_ = networkType;
		this.p2pEnabled_ = !this.isMobileNetwork_();
	},
	setGlobalProxyUrl_ : function(url) {
	},

	setChannelParams_ : function(params) {
		if (!this.deviceType_) {
			var itr = params.get("hwtype");
			if (itr) {
				this.deviceType_ = itr;
			}
		}
		if (!this.osType_) {
			var itr = params.get("ostype");
			if (itr) {
				this.osType_ = itr;
			}
		}
	},

	attachContext_ : function(context) {

		if (context.geo_) {
			this.clientGeo_ = context.geo_;
		} else if (this.clientGeo_) {
			context.geo_ = this.clientGeo_;
		}

		if (context.geoName_) {
			this.clientGeoName_ = context.geoName_;
		} else if (this.clientGeoName_) {
			context.geoName_ = this.clientGeoName_;
		}

		if (context.clientIp_) {
			this.clientIp_ = context.clientIp_;
		} else if (this.clientIp_) {
			context.clientIp_ = this.clientIp_;
		}
	},

	getHostDomain_ : function(domain) {
		return domain;
	},

	getBackupHostIps_ : function(domain) {
	},

	getLocalMacAddresses_ : function() {
		return "FF-EE-DD-CC-BB-AA";
	},

	getBrowserType_ : function() {
		var sys = {};
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("eui") > -1) {
			return "eui";
		}
		var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
		var m = ua.match(re) || [];
		sys.browser = (m[1] || "").replace(/version/, "'safari");
		sys.ver = (m[2] || "");
		return sys.browser;
	},

	getDeviceType_ : function() {
		var sUserAgent = navigator.userAgent;
		var ua = sUserAgent.toLowerCase();
		if (ua.indexOf("x600") > -1) {
			return "Letv-x600";
		}
		if (ua.indexOf("x800") > -1) {
			return "Letv-x800";
		}
		if (ua.indexOf("x900") > -1) {
			return "Letv-x900";
		}
		if (String(navigator.platform).toLowerCase().indexOf("iphone") > -1 || ua.indexOf("iphone") > -1) {
			return "iPhone";
		}
		var split1 = ua.split(";");
		for ( var i = 0; i < split1.length; i++) {
			var pos = split1[i].indexOf("build");
			if (pos > -1) {
				var type = split1[i].substring(0, pos);
				return p2p$.com.webp2p.core.common.String.trim(type);
			}
		}
		return "Unkonwn";
	},

	getOSType_ : function() {
		var sUserAgent = navigator.userAgent;
		var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
		var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh")
				|| (navigator.platform == "MacIntel");
		if (isMac) {
			return "Mac";
		}
		if (String(navigator.platform).toLowerCase().indexOf("iphone") > -1 || sUserAgent.toLowerCase().indexOf("iphone") > -1) {
			return "iPhone";
		}
		if (String(navigator.platform).toLowerCase().indexOf("android") > -1 || sUserAgent.toLowerCase().indexOf("android") > -1) {
			return "Android";
		}
		var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
		if (isUnix) {
			return "Unix";
		}
		var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
		if (isLinux) {
			return "Linux";
		}

		if (isWin) {
			var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
			if (isWin2K) {
				return "Win2000";
			}
			var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
			if (isWinXP) {
				return "WinXP";
			}
			var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
			if (isWin2003) {
				return "Win2003";
			}
			var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
			if (isWinVista) {
				return "WinVista";
			}
			var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
			if (isWin7) {
				return "Win7";
			}
		}
		return "other";
	},

	getMediaType_ : function() {
		var mediaType = {
			mediasource : false,
			webm : false,
			mp4 : false,
			ts : false
		};
		try {
			var TestMediaSource = window.MediaSource || window.WebKitMediaSource;
			if (!!!TestMediaSource) {
			} else {
				mediaType.mediasource = true;
				mediaType.webm = TestMediaSource.isTypeSupported('video/webm; codecs="vorbis,vp8"');
				mediaType.mp4 = TestMediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
				mediaType.ts = TestMediaSource.isTypeSupported('video/mp2t; codecs="avc1.42E01E,mp4a.40.2"');
			}
		} catch (e) {
		}
		return mediaType;
	}
};p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.Context = CdeBaseClass.extend_({
	url_ : null,
	gslbData_ : null,
	configData_ : null,

	// properties
	debug_ : false,
	drmEnabled_ : false,
	streamId_ : "",
	moduleVersion_ : "",
	deviceType_ : "",
	sosType_ : "",
	playType_ : "",
	platformId_ : "",
	subPlatformId_ : "",
	videoType_ : "",
	videoFormat_ : "",
	appUuid_ : "",
	t3partyAppChannel_ : "",
	addtionalParam1_ : "",
	addtionalParam2_ : "",
	addtionalParam3_ : "",
	addtionalParams_ : 0,
	terminalType_ : 0,
	statReportInterval_ : 0, // seconds
	specialPlayerTimeOffset_ : 0, // seconds offset for special hardware players such as S50, S40
	specialPlayerTimeLimit_ : 0, // seconds limit for speical hardware player such as S240F, S250F
	liveStorageMemoryOnly_ : false,
	vodStorageMemoryOnly_ : 0,

	// geo
	isp_ : 0,
	country_ : 0,
	province_ : 0,
	city_ : 0,
	area_ : 0,
	countryCode_ : "",
	geo_ : "",
	geoName_ : "",
	clientIp_ : "",
	gslbServerIp_ : "",
	metaServerIp_ : "",

	// cdn/p2p params
	p2pServerVersion_ : 0,// p2p server protocol version, 1:1.0, 2: 2.0
	p2pFetchRate_ : null, // percent, 0~1
	p2pMaxPeers_ : 0, // count
	p2pUrgentSize_ : 0, // second(s)
	p2pUrgentLevel1_ : 0, // urgent size if playLevel == 1
	p2pSharePeers_ : false, // enable share p2p peers to others
	p2pUploadEnabled_ : false, // enable p2p upload
	p2pUploadLimit_ : false, // limit p2p upload speed
	p2pUploadThrottleInit_ : 0, // initial upload bandwidth for p2p upload throttle (byte/s)
	p2pUploadThrottleAverage_ : 0, // estimated average upload bandwidth for p2p upload throttle (byte/s)
	p2pUploadMaxReserved_ : 0, // max reserved upload bandwidth (byte/s)
	p2pUrgentUploadEnabled_ : false, // to upload if download enter urgent area
	p2pPeerId_ : "",// primary p2p peer id
	p2pRtmfpPeerId_ : "",// fro rtmfp
	p2pWebsocketPeerId_ : "", // for websocket
	p2pWebrtcPeerId_ : "", // for webrtc
	p2pMaxQPeers_ : 0, //
	p2pHeartbeatInterval_ : 0, // interval to gather,tracker (seconds)
	p2pShareRangeInterval_ : 0, // send range interval (seconds)
	p2pMaxParallelRequestPieces_ : 0, // max parallel request pieces for p2p peers
	p2pMaxUrgentRequestPieces_ : 0, // max parallel request pieces for p2p peers when urgent not fullfill
	cdnSlowThresholdRate_ : 0, // to decide whether cdn speed is too slow compare with media bitrate
	cdnDisabled_ : false, // disable download data from cdn
	cdnMultiRequest_ : false, // request from multi-cdn servers
	cdnMultiMaxHost_ : 0, // request maximum cdn servers
	cdnStartTime_ : 0, // for advertisment, second(s)
	playingPosition_ : 0, // the position now player used
	downloadSpeedRatio_ : 0, // download speed control rate, compare with bitrate

	// protocols
	protocolCdnDisabled_ : false,
	protocolRtmfpDisabled_ : false,
	protocolWebsocketDisabled_ : false,
	protocolWebrtcDisabled_ : false,

	// protocol status
	selectorServerHost_ : "",
	gatherServerHost_ : "",
	rtmfpServerHost_ : "",
	trackerServerHost_ : "",
	webrtcServerHost_ : "",
	stunServerHost_ : "",

	// std::string selectorServerIp_;
	// std::string gatherServerIp_;
	// std::string rtmfpServerIp_;
	// std::string trackerServerIp_;
	// uint16 selectorServerPort_;
	// uint16 gatherServerPort_;
	// uint16 rtmfpServerPort_;
	// uint16 trackerServerPort_;
	selectorConnectedTime_ : 0, // units: us
	rtmfpServerConnectedTime_ : 0, // units: us
	gatherServerConnectedTime_ : 0, // units: us
	trackerServerConnectedTime_ : 0, // units: us, cde tracker
	webrtcServerConnectedTime_ : 0,

	cdnTotalNodeCount_ : 0,
	rtmfpTotalNodeCount_ : 0,
	websocketTotalNodeCount_ : 0,
	webrtcTotalNodeCount_ : 0,

	upnpMapCompleteTime_ : 0,
	upnpMapSuccess_ : false,
	upnpMappedInPort_ : 0,
	upnpMappedOutPort_ : 0,
	upnpMappedAddress_ : "",

	hasDefaultTrackerServer_ : false,
	hasDefaultWebrtcServer_ : false,
	hasDefaultStunServer_ : false,
	init : function() {
		this.url_ = new p2p$.com.webp2p.core.supernode.Url();
		this.debug_ = false;
		this.drmEnabled_ = false;
		this.terminalType_ = 1;
		this.statReportInterval_ = 60;
		this.specialPlayerTimeOffset_ = 0; // default disabled
		this.specialPlayerTimeLimit_ = 0; // default disabled
		this.liveStorageMemoryOnly_ = false;
		this.vodStorageMemoryOnly_ = false;
		this.videoFormat_ = "lm3u8";

		// geo
		this.isp_ = 0;
		this.country_ = 0;
		this.province_ = 0;
		this.city_ = 0;
		this.area_ = 0;

		// cdn/p2p params
		this.p2pServerVersion_ = 1; // 1.0
		this.p2pFetchRate_ = 0.1;
		this.p2pMaxPeers_ = 10;
		this.p2pUrgentSize_ = 10;
		this.p2pUrgentLevel1_ = 10;
		this.p2pSharePeers_ = true;
		this.p2pUploadEnabled_ = true;
		this.p2pUrgentUploadEnabled_ = false;
		this.p2pUploadLimit_ = false;
		this.p2pUploadThrottleInit_ = 50000; // 50kB/s
		this.p2pUploadThrottleAverage_ = 120000; // 100kB/s
		this.p2pUploadMaxReserved_ = 30000; // 30kB/s
		this.p2pMaxQPeers_ = 5;
		this.p2pHeartbeatInterval_ = 30; // second(s)
		this.p2pShareRangeInterval_ = 5; // second(s)
		this.p2pMaxParallelRequestPieces_ = 20;
		this.p2pMaxUrgentRequestPieces_ = 1;
		this.cdnSlowThresholdRate_ = 1.0;
		this.cdnDisabled_ = false;
		this.cdnMultiRequest_ = true; // false;
		this.cdnMultiMaxHost_ = 3;
		this.cdnStartTime_ = 0;
		this.playingPosition_ = 0;
		this.downloadSpeedRatio_ = -1.0;

		// protocol params
		this.protocolCdnDisabled_ = false;
		this.protocolRtmfpDisabled_ = false;
		this.protocolWebsocketDisabled_ = false;
		this.protocolWebrtcDisabled_ = false;

		// status
		// selectorServerPort_ = 0;
		// gatherServerPort_ = 0;
		// rtmfpServerPort_ = 0;
		// trackerServerPort_ = 0;
		this.selectorConnectedTime_ = 0;
		this.rtmfpServerConnectedTime_ = 0;
		this.gatherServerConnectedTime_ = 0;
		this.trackerServerConnectedTime_ = 0;
		this.webrtcServerConnectedTime_ = 0;

		this.cdnTotalNodeCount_ = 0;
		this.rtmfpTotalNodeCount_ = 0;
		this.websocketTotalNodeCount_ = 0;
		this.webrtcTotalNodeCount_ = 0;

		this.upnpMapCompleteTime_ = 0;
		this.upnpMapSuccess_ = false;
		this.upnpMappedInPort_ = 0;
		this.upnpMappedOutPort_ = 0;

		this.hasDefaultTrackerServer_ = false;
		this.hasDefaultWebrtcServer_ = false;
		this.hasDefaultStunServer_ = false;
	},
	initialize_ : function(url, env) {
		// properties
		this.url_ = url;
		this.moduleVersion_ = p2p$.com.webp2p.core.common.String.format("CDE-{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber);
		this.deviceType_ = p2p$.com.webp2p.core.common.String.toUpper_(this.url_.params_.get("hwtype"));
		this.osType_ = this.url_.params_.get("ostype");
		this.terminalType_ = p2p$.com.webp2p.core.common.String.parseNumber_(this.url_.params_.get("termid"), 1);
		this.platformId_ = this.url_.params_.get("platid");
		this.subPlatformId_ = this.url_.params_.get("splatid");
		this.videoType_ = this.url_.params_.get("vtype");
		this.streamId_ = this.url_.params_.has("stream_id") ? this.url_.params_.get("stream_id") : "";
		this.appUuid_ = this.url_.params_.has("uuid") ? this.url_.params_.get("uuid") : "";
		this.t3partyAppChannel_ = this.url_.params_.has("ch") ? this.url_.params_.get("ch") : "";

		this.liveStorageMemoryOnly_ = env.liveStorageMemoryOnly_;
		this.vodStorageMemoryOnly_ = env.vodStorageMemoryOnly_;

		if (this.deviceType_ == "" || !env.deviceType_ == "") {
			this.deviceType_ = env.deviceType_;
		}
		if (this.osType_ == "" || !env.osType_ == "") {
			this.osType_ = env.osType_;
		}
		if (env.specialPlayerTimeOffset_ != 0) {
			this.specialPlayerTimeOffset_ = env.specialPlayerTimeOffset_;
		}
		if (env.specialPlayerTimeLimit_ != 0) {
			this.specialPlayerTimeLimit_ = env.specialPlayerTimeLimit_;
		}
		if (env.downloadSpeedRatio_ > 0) {
			this.downloadSpeedRatio_ = env.downloadSpeedRatio_;
		}

		if (env.paramWebrtcServer_) {
			this.hasDefaultWebrtcServer_ = true;
			this.webrtcServerHost_ = "ws://" + env.paramWebrtcServer_;
		}
		if (env.paramTrackerServer_) {
			this.hasDefaultTrackerServer_ = true;
			this.gatherServerHost_ = env.paramTrackerServer_;
		}
		if (env.paramStunServer_) {
			this.hasDefaultStunServer_ = true;
			this.stunServerHost_ = "stun:" + env.paramStunServer_;
		}
		if (env.paramCloseWebrtc_) {
			this.protocolWebrtcDisabled_ = env.paramCloseWebrtc_;
		}
		if (env.paramCloseWebsocket_) {
			this.protocolWebsocketDisabled_ = env.paramCloseWebrtc_;
		}

		// addtional params
		this.addtionalParams_ == "";
		this.addtionalParam1_ = this.url_.params_.has("p1") ? this.url_.params_.get("p1") : "";
		this.addtionalParam2_ = this.url_.params_.has("p2") ? this.url_.params_.get("p2") : "";
		this.addtionalParam3_ = this.url_.params_.has("p3") ? this.url_.params_.get("p3") : "";
		if (this.addtionalParam1_ != "" || this.addtionalParam2_ != "" || this.addtionalParam3_ != "") {
			this.addtionalParams_ = p2p$.com.webp2p.core.common.String.format("p1={0}&p2={1}&p3={2}", this.addtionalParam1_, this.addtionalParam2_,
					this.addtionalParam3_);
		}
	},

	loadParams_ : function(params, customParams) {
		if (customParams.hasOwnProperty("cdnMultiRequest")) {
			this.cdnMultiRequest_ = customParams["cdnMultiRequest"];
		}

		if (params.hasOwnProperty("debug")) {
			this.debug_ = params["debug"];
		}
		if (params.hasOwnProperty("mcdn")) {
			this.cdnMultiRequest_ = params["mcdn"];
		}
		if (params.hasOwnProperty("ccdn")) {
			this.cdnMultiMaxHost_ = params["ccdn"];
		}
		if (params.hasOwnProperty("dsratio")) {
			this.downloadSpeedRatio_ = params["dsratio"];
		}
	},

	loadData_ : function(data) {
		this.gslbData_ = data;
		this.geo_ = data["geo"];
		this.geoName_ = data["desc"];
		this.clientIp_ = data["remote"];
		var geoValues = this.geo_.split(".");
		if (geoValues.length > 0) {
			this.countryCode_ = p2p$.com.webp2p.core.common.String.trim(geoValues[0]);
			this.country_ = 0;
			for ( var n = 0; n < this.countryCode_.length && n < 2; n++) {
				this.country_ = this.country_ * 256 + (this.countryCode_[n]).charCodeAt();
			}
		}
		if (geoValues.length > 1) {
			this.province_ = p2p$.com.webp2p.core.common.String.parseNumber_(geoValues[1]);
		}
		if (geoValues.length > 2) {
			this.city_ = p2p$.com.webp2p.core.common.String.parseNumber_(geoValues[2]);
		}
		if (geoValues.length > 3) {
			this.isp_ = p2p$.com.webp2p.core.common.String.parseNumber_(geoValues[3]);
		}
	},

	detectSpecialPlayerTimeOffset_ : function() {
	},

	resetPeerState_ : function() {
	}
});p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.HttpDownloader = CdeBaseClass.extend_({
	fullUrl_ : null,
	scope : null,
	method : "GET",
	config : null,
	type : "",
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
	init : function(_url, _scope, _method, _type, _tag, _postData) {
		this.fullUrl_ = _url;
		this.scope = _scope;
		this.method = _method || "GET";
		this.type = _type || "";
		this.tag_ = _tag || "";
		this.startTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
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
		if (this.method == "POST") {
			this.postData_ = _postData;
		}
		this.readyState_ = 0;
	},

	log : function(result) {
		if ("cdn::range-data" == this.tag_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::supernode::HttpDownloader [{0}] Download {1}, Segment ({2}/{3}-{16}), url({4}), "
					+ "response code({5}), data({6}/{7} Bytes), " + "resolved time({8} ms), " + "connected time({9} ms), " + "responsed time({10} ms), "
					+ "total used time({11} ms), " + "transfered time({12} ms), " + "ready State({13}), " + "speed({14}), " + "bytes({15})", this.tag_,
					(result == "" ? (this.successed_ ? "OK" : "FAILED") : result), this.info_ ? this.info_.segmentId_ : 0, this.info_ ? this.info_.startIndex_
							: 0, this.fullUrl_, this.responseCode_, this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_,
					this.connectedTime_, this.responsedTime_, this.totalUsedTime_, this.transferedTime_, this.readyState_, p2p$.com.webp2p.core.common.Global
							.speed(this.transferedSpeed_, false), this.transferedBytes_, this.info_ ? this.info_.endIndex_ : 0));
		} else {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::supernode::HttpDownloader [{0}] Download {1}, url({2}), " + "response code({3}), data({4}/{5} Bytes), "
					+ "resolved time({6} ms), " + "connected time({7} ms), " + "responsed time({8} ms), " + "total used time({9} ms), "
					+ "transfered time({10} ms), " + "ready State({11}), " + "speed({12}), " + "bytes({13})", this.tag_,
					(result == "" ? (this.successed_ ? "OK" : "FAILED") : result), this.fullUrl_, this.responseCode_,
					this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_, this.connectedTime_, this.responsedTime_,
					this.totalUsedTime_, this.transferedTime_, this.readyState_, p2p$.com.webp2p.core.common.Global.speed(this.transferedSpeed_, false),
					this.transferedBytes_));
		}
	},

	load : function() {
		if (this.tag_ == "cdn::range-data") {
			this.load2();
		} else {
			this.load1();
		}
	},

	load1 : function() {
		// this.ajaxId_ = $.ajax({
		// url : this.fullUrl_
		// }).done(function(data) {
		// if (typeof (data) == 'string') {
		// try {
		// data = eval('(' + data + ')');
		// } catch (e) {
		// }
		// P2P_ULOG_INFO(P2P_ULOG_FMT("gslb return location={0} remote={1}", data.location, data.remote));
		// }
		//		
		// me.responseCode_ = this.status;
		// me.responseData_ = this.response || '';
		//		
		// }).fail(function() {
		//		
		// }).always(function() {
		//		
		// });
		var me = this;
		if (me.tag_ == "cdn::range-data") {
			this.type = "text";
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::supernode::HttpDownloader [{0}] Start download {1}...", this.tag_, this.fullUrl_));
		this.http_ = $.ajax({
			url : this.fullUrl_,
			type : this.method,
			dataType : "text",
			error : function(request, textStatus, errorThrown) {
				// alert(request.status);
				// alert(request.readyState);
				// alert(textStatus); // paser error;
				me.endTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				me.totalUsedTime_ = me.endTime - me.startTime_;
				me.successed_ = false;
			},
			complete : function(request, textStatus) {
				me.responseCode_ = request.status;
				me.readyState_ = request.readyState;
				me.onDownloadCompleted_();
			},
			success : function(data, textStatus) {
				me.endTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				me.totalUsedTime_ = me.endTime - me.startTime_;
				me.responseData_ = data;
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::supernode::HttpDownloader textStatus {0}", textStatus));
				if (me.tag_ == "cdn::range-data") {
					var buf = new ArrayBuffer(data.length); // 每个字符占用2个字节
					var bufView = new Uint8Array(buf);
					for ( var i = 0, strLen = data.length; i < strLen; i++) {
						bufView[i] = data.charCodeAt(i);
					}
					var uInt8Array = new Uint8Array(data);
					me.responseData_ = uInt8Array;
					me.responseLength_ = uInt8Array.length;
					me.transferedBytes_ = uInt8Array.length;
				} else {
					me.transferedBytes_ = me.responseLength_ = me.responseData_.length;
					if ("json" == me.type && typeof (me.responseData_) == "string") {
						try {
							me.responseData_ = JSON.parse(me.responseData_);
						} catch (err) {
							P2P_ULOG_ERROR(P2P_ULOG_FMT("core::supernode::HttpDownloader::Parse response json data failed, url:{0}, error:{1}", me.fullUrl_,
									(err || "").toString()));
						}
					}
				}
				// Math.round(original*100)/100;
				me.transferedSpeed_ = (me.transferedBytes_ * 1000 / me.totalUsedTime_);// .toFixed(2);
				me.transferedSpeed_ = Math.round(me.transferedSpeed_ * 100) / 100;
				// P2P_ULOG_TRACE("tag:"+me.tag_+",responseLength_:"+me.responseLength_+",speed:"+p2p$.com.webp2p.core.common.Global.speed(me.transferedSpeed_,false));
				me.successed_ = true;
			}
		});
	},

	close : function() {
		if (this.http_) {
			this.http_.abort();
		}
	},

	load2 : function() {

		var xhr = this.http_ = this.createRequest_();
		var me = this;
		// ajaxRequest = new XMLHttpRequest();
		// ajaxRequest.open('POST', 'https://api.github.com/markdown', true);
		// ajaxRequest.setRequestHeader('Content-Type', 'application/json');
		xhr.onreadystatechange = function() {
			if (this.readyState == 1) {
				me.readyState_ = 1;
			}
			if (this.readyState == 2) {
				me.readyState_ = 2;
			}
			if (this.readyState == 3) {
				me.readyState_ = 3;
			}
			if (this.readyState == 4) {
				me.readyState_ = 4;
				me.endTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				me.responseCode_ = this.status;
				me.responseData_ = this.response || '';

				// Calculate usedTime
				me.totalUsedTime_ = me.endTime - me.startTime_;

				if (this.status >= 200 && this.status < 300) {
					// Calculate speed
					if (me.tag_ == "cdn::range-data") {
						var uInt8Array = new Uint8Array(me.responseData_);
						me.responseData_ = uInt8Array;
						me.responseLength_ = uInt8Array.length;
						me.transferedBytes_ = uInt8Array.length;
					} else {
						if ("json" == me.type) {
							var str = JSON.stringify(me.responseData_);
							me.transferedBytes_ = me.responseLength_ = str.length;
						} else {
							me.transferedBytes_ = me.responseLength_ = me.responseData_.length;
						}

					}
					// Math.round(original*100)/100;
					me.transferedSpeed_ = (me.transferedBytes_ * 1000 / me.totalUsedTime_);// .toFixed(2);
					me.transferedSpeed_ = Math.round(me.transferedSpeed_ * 100) / 100;
					// P2P_ULOG_TRACE("tag:"+me.tag_+",responseLength_:"+me.responseLength_+",speed:"+p2p$.com.webp2p.core.common.Global.speed(me.transferedSpeed_,false));
					me.successed_ = true;

				} else {
					me.successed_ = false;
				}
				me.onDownloadCompleted_();

			}
		};

		// if(this.tag_ != "cdn::range-dat")
		// {
		// xhr.onprogress = function(evt) {
		//				
		// // Calculate progress
		// var str = "";
		// if (evt.lengthComputable) {
		// var percent = 100 * evt.loaded / evt.total;
		// str = percent + "%. load:"+evt.loaded+",total:"+evt.total+",Current total size: " + this.responseText.length;
		// } else {
		// str = "Progress unknown. Current total size: " + this.responseText.length;
		// }
		// me.responseData_ = this.responseText;
		// me.responseLength_ = evt.total;
		// // Calculate usedTime and speed
		// me.endTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		// me.totalUsedTime_ = me.endTime - me.startTime_;
		// me.transferedBytes_ = evt.loaded;
		// me.transferedSpeed_ = (me.transferedBytes_ * 1000 / me.totalUsedTime_).toFixed(2);
		// //;
		// //P2P_ULOG_TRACE("transferedSpeed_:"+me.transferedSpeed_+",speed:"+p2p$.com.webp2p.core.common.Global.speed(me.transferedSpeed_,false)+",transferedBytes_:"+me.transferedBytes_+",total:"+evt.total);
		// me.onDownloadData_(me);
		// if(me.tag_ == "cdn::range-data")
		// {
		// P2P_ULOG_TRACE("tag:"+me.tag_+",str:"+str);
		// }
		//				
		// };
		// }

		xhr.open(me.method, me.fullUrl_);
		try {
			xhr.responseType = this.type;// arraybuffer
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::supernode::HttpDownloader [{0}] Start download {1}...", this.tag_, this.fullUrl_));
		} catch (e) {
			alert(e);
			alert(this.type);
		}
		var url = new p2p$.com.webp2p.core.supernode.Url();
		url.fromString_(this.fullUrl_);
		this.remoteEndpoint_ = url.host_ + (url.port_ == 0 ? "" : ":" + url.port_);

		try {
			if (this.postData_) {
				xhr.send(postData_);
			} else {
				xhr.send(null);
			}

		} catch (e) {
			console.log(e);
		}
	},

	setInfo_ : function(info) {
		this.info_ = info;
	},

	createRequest_ : function() {
		var objXMLHttpRequest = null;
		if (window.ActiveXObject) { // MS IE
			var activeXNameList = new Array("Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP",
					"Microsoft.XMLHTTP");
			for ( var h = 0; h < activeXNameList.length; h++) {
				try {
					objXMLHttpRequest = new ActiveXObject(activeXNameList[h]);
				} catch (e) {
					continue;
				}
				if (objXMLHttpRequest) {
					break;
				}
			}
		} else if (window.XMLHttpRequest) { // NOT MS IE
			objXMLHttpRequest = new XMLHttpRequest();
			if (objXMLHttpRequest.overrideMimeType) { // 针对某些特定版本的mozillar浏览器的BUG进行修正
				objXMLHttpRequest.overrideMimeType(this.type);
			}
		}

		return objXMLHttpRequest;
	},

	onDownloadData_ : function() {
		if (typeof this.scope.onHttpDownloadData_ != 'undefined' & this.scope.onHttpDownloadData_ instanceof Function) {
			this.scope.onHttpDownloadData_(this);
		}
	},

	stringToJson_ : function(stringVal) {
		eval("var theJsonVal = " + stringVal);
		return theJsonVal;
	},

	onDownloadCompleted_ : function() {
		// P2P_ULOG_TRACE("download success:",this);
		this.log("");
		this.scope.onHttpDownloadCompleted_(this);
	},

	sendInfo : function(value) {
		var info = {};
		info.code = "Mobile.Info.Debug";
		info.info = value;
		this.config.sendInfo(info);
	}
});
p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.MetaPiece = CdeBaseClass.extend_({
	id_ : 0,
	type_ : 0,
	key_ : 0,
	offset_ : 0,
	size_ : 0,
	wild_ : false,
	checksum_ : 0,
	index_ : 0,

	// status
	randomNumber_ : 0,
	transferDepth_ : 0,
	receiveProtocol_ : 0,
	shareInRanges_ : 0,
	receiveByStable_ : false,
	receiveByOther_ : false,
	receiveSessionId_ : 0,
	receiveStartTime_ : 0,
	playedTime_ : 0,
	completedTime_ : 0,
	recvTimes_ : 0,
	writeTimes_ : 0,

	init : function() {
		this.id_ = 0;
		this.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
		this.key_ = 0;
		this.offset_ = 0;
		this.size_ = 0;
		this.wild_ = false;
		this.checksum_ = 0;
		this.index_ = 0;
		this.randomNumber_ = Math.floor(Math.random() * 100 + 1);
		this.transferDepth_ = 0;
		this.receiveProtocol_ = 0;
		this.shareInRanges_ = 0;
		this.receiveByStable_ = false;
		this.receiveByOther_ = false;
		this.receiveSessionId_ = 0;
		this.receiveStartTime_ = 0;
		this.playedTime_ = 0;
		this.completedTime_ = 0;
		this.recvTimes_ = 0;
	},

	fork : function() {
		var result = new p2p$.com.webp2p.core.supernode.MetaPiece();
		for ( var n in this) {
			result[n] = this[n];
		}
		return result;
	},

	verify : function(data, size) {
		if (this.size_ <= 0 || this.wild_) {
			return true;
		}

		var step = 47;
		var pos = 0;
		var sum = 0xffffffff;
		if (size >= 188) {
			pos += 4;
			while (pos + step < size) {
				// uint32 item1 = core::common::network2Host32(*(uint32 *)(data + pos));
				// uint32 item2 = (uint32(data[pos]) << 24) + (uint32(data[pos + 1]) << 16) + (uint32(data[pos + 2]) << 8) + (uint32(data[pos + 3]));
				// p2p$.com.webp2p.core.common.Number.convertToValue_('8',value,_position);'4',value,_position
				var item1 = p2p$.com.webp2p.core.common.Number.convertToValue_('4', data, pos);
				sum ^= item1;
				pos += step;
			}
		}
		sum = (~(((sum >> 16) & 0xffff) + (sum & 0xffff))) & 0xffff;
		return this.checksum_ == sum;
	},

	verifyWithCrc32_ : function(data, size) {
	},

	getTypeName_ : function() {
	}
});p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.MetaSegment = CdeBaseClass.extend_({
	id_ : 0,
	startTime_ : 0,
	startTimeActual_ : 0,
	duration_ : 0,
	urlOffset_ : 0,
	index_ : 0,
	pieceTnCount_ : 0,
	piecePnCount_ : 0,
	size_ : 0,
	beginOfMeta_ : false,
	directMode_ : false,
	discontinuity_ : false,
	p2pDisabled_ : false,
	timeGapChecked_ : false,
	advertMonitorReported_ : false,
	url_ : "",
	mediaUrl_ : "",
	playUrl_ : "",
	advertMonitorUrl_ : "",
	programId_ : "",
	pieces_ : null,
	moreMediaUrls_ : null,
	pictureWidth_ : 0,
	pictureHeight_ : 0,

	lastActiveTime_ : 0,
	completedPieceCount_ : 0,
	completedTime_ : 0,
	completedSize_ : 0,
	startReceiveTime_ : 0,
	lastReceiveTime_ : 0,
	lastPlayTime_ : 0,
	receiveSpeed_ : 0,
	m3u8LoadTime_ : 0,

	init : function() {
		this.pieces_ = [];
		this.id_ = -1;
		this.startTime_ = 0;
		this.startTimeActual_ = 0;
		this.duration_ = 0;
		this.urlOffset_ = -1;
		this.index_ = 0;
		this.pieceTnCount_ = 0;
		this.piecePnCount_ = 0;
		this.size_ = 0;
		this.lastActiveTime_ = 0;
		this.completedPieceCount_ = 0;
		this.completedTime_ = 0;
		this.completedSize_ = 0;
		this.startReceiveTime_ = 0;
		this.lastReceiveTime_ = 0;
		this.lastPlayTime_ = 0;
		this.receiveSpeed_ = 0;
		this.beginOfMeta_ = false;
		this.directMode_ = false;
		this.discontinuity_ = false;
		this.p2pDisabled_ = false;
		this.timeGapChecked_ = false;
		this.advertMonitorReported_ = false;
		this.m3u8LoadTime_ = 0;
	},

	getPieceIndex_ : function(type, id) {
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			if (piece.type_ == type && piece.id_ == id) {
				return n;
			}
		}
		return -1;
	},

	checkPieceCompletion_ : function() {

		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.lastReceiveTime_ = nowTime;
		this.completedPieceCount_ = 0;
		this.completedSize_ = 0;
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			if (piece.writeTimes_ > 0) {
				this.completedPieceCount_++;
				if (piece.size_ >= 0) {
					this.completedSize_ += piece.size_;
				}
			}
		}
		if (this.completedPieceCount_ == this.pieces_.length) {
			this.completedTime_ = nowTime;
			P2P_ULOG_TRACE(P2P_ULOG_FMT("core::supernode::MetaSegment::Segment({0}) download complete", this.id_, this.pieces_.length));
			if (this.completedSize_ <= 0) {
				this.completedSize_ = this.size_;
			}
		}
		if (this.startReceiveTime_ > 0 && nowTime > this.startReceiveTime_) {
			this.receiveSpeed_ = this.completedSize_ * 1000 / (nowTime - this.startReceiveTime_);
		}
	},

	resetPieceCompletion_ : function() {
		this.lastPlayTime_ = 0;
		this.completedTime_ = 0;
		this.completedPieceCount_ = 0;
		this.completedSize_ = 0;
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			piece.completedTime_ = 0;
			piece.writeTimes_ = 0;
			piece.playedTime_ = 0;
			piece.recvTimes_ = 0;
		}
	},

	formatPlayUrl_ : function(storageId) {
		return "/play/slices/" + this.id_ + ".ts?id=" + storageId + "&segment=" + this.id_;
	}
});p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD = {
	kDataVerifyMethodDefault : 0,
	kDataVerifyMethodCrc32 : 1
};

p2p$.com.webp2p.core.supernode.MetaData = CdeBaseClass.extend_({
	type_ : 0,
	hlsMode_ : false,
	directMetaMode_ : false,
	rangeParamsSupported_ : false,
	version_ : "",
	allowCache_ : "",
	targetDuration_ : 0,
	programId_ : "",
	programeType_ : "",
	programVersion_ : "",
	programDateTime_ : "",
	p2pGroupId_ : "",
	localMetaContent_ : "",
	mediaSequence_ : 0,
	lastReceiveSpeed_ : 0,
	pictureWidth_ : 0,
	pictureHeight_ : 0,
	// totalTnLength_;
	// totalPnLength_;
	// totalSegmentCount_;
	directCount_ : 0,
	moreUrlCount_ : 0,
	p2pPieceCount_ : 0,
	verifyMethod_ : 0,
	totalDuration_ : 0,
	directDuration_ : 0,
	createTime_ : 0,
	updateTime_ : 0,
	urgentSegmentId_ : 0,
	dataSize_ : 0,
	totalGapDuration_ : 0,

	taskId_ : "",
	storageId_ : "",
	channelUrl_ : "",
	sourceUrl_ : "",
	finalUrl_ : "",
	primaryDataUrl_ : "",
	sourceServer_ : "",
	morePrimaryUrls_ : null,
	segments_ : null,

	tn2SegmentIndexMap_ : null,
	pn2SegmentIndexMap_ : null,

	init : function() {
		this.segments_ = [];
		this.tn2SegmentIndexMap_ = new p2p$.com.webp2p.core.common.Map();
		this.pn2SegmentIndexMap_ = new p2p$.com.webp2p.core.common.Map();
		this.type_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod;
		this.hlsMode_ = true;
		this.directMetaMode_ = false;
		this.rangeParamsSupported_ = true; // default support for rstart, rend params
		this.verifyMethod_ = p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD.kDataVerifyMethodDefault;
		this.tidy();
	},
	// readBigUnsignedInteger( const char *data );

	tidy : function() {
		this.targetDuration_ = 0;
		this.pictureWidth_ = 0;
		this.pictureHeight_ = 0;
		// totalTnLength_ = 0;
		// totalPnLength_ = 0;
		// totalSegmentCount_ = 0;
		this.directCount_ = 0;
		this.moreUrlCount_ = 0;
		this.p2pPieceCount_ = 0;
		this.totalDuration_ = 0;
		this.directDuration_ = 0;
		this.mediaSequence_ = 0;
		this.lastReceiveSpeed_ = 0;
		this.updateTime_ = 0;
		this.createTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.urgentSegmentId_ = -1;
		this.dataSize_ = 0;
		this.totalGapDuration_ = 0;

		this.version_ = "";
		this.programId_ = "";
		this.programVersion_ = "";
		this.p2pGroupId_ = "";
		this.segments_ = [];
		this.localMetaContent_ = "";
		this.tn2SegmentIndexMap_.clear();
		this.pn2SegmentIndexMap_.clear();
	},
	fork : function() {
		var result = new p2p$.com.webp2p.core.supernode.MetaData();
		for ( var n in this) {
			result[n] = this[n];
		}
		return result;
	},
	load : function(values, elapsedTime, needBuildIndexes) {
		this.tidy();
		this.hlsMode_ = true;
		this.moreUrlCount_ = 0;

		// var encodeName = "base64";
		// var encodeUrl = p2p$.com.webp2p.core.common.String.urlEncode_(p2p$.com.webp2p.core.common.String.base64Encode_(this.channelUrl_));
		// var encodeTaskId = p2p$.com.webp2p.core.common.String.urlEncode_(this.taskId_);
		// var appendParams = "&ext=m3u8&enc=" + encodeName + "&url=" + encodeUrl + "&taskid=" + encodeTaskId + "&direct=" + (this.directMetaMode_ ? 1 : 0);

		var lines = values.split("\n");
		var maxPieceId = 0;
		var nonDirectCount = 0;
		var lastSegment = new p2p$.com.webp2p.core.supernode.MetaSegment();
		lastSegment.m3u8LoadTime_ = elapsedTime;
		var needMoreUrls = (this.directMetaMode_ || p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive == this.type_);
		if (needMoreUrls) {
			lastSegment.moreMediaUrls_ = [];
		}
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		for ( var n = 0; n < lines.length; n++) {
			// if (n == 100) break;
			var line = lines[n];
			line = p2p$.com.webp2p.core.common.String.trim(line);
			if ("" == line) {
				continue;
			}
			if (line[0] != '#') {
				if (lastSegment.id_ < 0 || (this.directMetaMode_ && this.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive)) {
					lastSegment.id_ = this.segments_.length;
				}

				if (this.directMetaMode_ && lastSegment.directMode_) {
					lastSegment.p2pDisabled_ = true;
				}
				lastSegment.pictureHeight_ = this.pictureHeight_;
				lastSegment.pictureWidth_ = this.pictureWidth_;
				lastSegment.url_ = line;
				lastSegment.mediaUrl_ = p2p$.com.webp2p.core.common.String.getAbsoluteUrlIfNeed_(lastSegment.url_, this.finalUrl_);
				lastSegment.playUrl_ = lastSegment.formatPlayUrl_(this.storageId_);
				// lastSegment.index_ = segments_.size();

				// @2015-02-06
				// to avoid url to long, the same time, vod time is invalid after 2 hours
				// resume mode is not needed now
				// if( core::common::kMetaDataTypeVod == type_ )
				// {
				// lastSegment.playUrl_ += appendParams;
				// }

				if (lastSegment.pieces_.length == 0) {
					// no pieces
					var pieceItem = new p2p$.com.webp2p.core.supernode.MetaPiece();
					pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
					pieceItem.id_ = (lastSegment.id_ > 0) ? lastSegment.id_ : this.segments_.length;
					lastSegment.piecePnCount_++;
					pieceItem.size_ = 0;
					pieceItem.checksum_ = 0;
					pieceItem.offset_ = lastSegment.size_;
					pieceItem.index_ = lastSegment.pieces_.length;
					lastSegment.p2pDisabled_ = true;
					lastSegment.size_ += pieceItem.size_;
					lastSegment.pieces_.push(pieceItem);
				}

				if (lastSegment.startTime_ <= 0) {
					lastSegment.startTime_ = this.totalDuration_;
				}
				if (this.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod
						|| this.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload) {
					lastSegment.startTimeActual_ = this.totalDuration_;
				} else {
					lastSegment.startTimeActual_ = lastSegment.startTime_;
				}
				if (needMoreUrls) {
					if (lastSegment.moreMediaUrls_ && lastSegment.moreMediaUrls_[0]) {
						this.moreUrlCount_ = 1;
					}
					if (lastSegment.moreMediaUrls_ && lastSegment.moreMediaUrls_[1]) {
						this.moreUrlCount_ = 2;
					}
				}

				this.segments_.push(lastSegment);
				this.p2pPieceCount_ += (lastSegment.pieceTnCount_ + lastSegment.piecePnCount_);
				this.totalDuration_ += lastSegment.duration_;
				this.dataSize_ += lastSegment.size_;
				if (lastSegment.directMode_ && nonDirectCount <= 0) {
					this.directCount_++;
					this.directDuration_ += lastSegment.duration_;
				} else {
					nonDirectCount++;
				}

				lastSegment = new p2p$.com.webp2p.core.supernode.MetaSegment();
				lastSegment.m3u8LoadTime_ = elapsedTime;
				if (this.directMetaMode_ || needMoreUrls) {
					lastSegment.moreMediaUrls_ = [];
				}
				continue;
			}
			var pos = 0, linKey = "", linValue = "";
			if ((pos = line.indexOf(":")) == -1) {
				linKey = line;
			} else {
				linKey = (pos > 0) ? line.substr(0, pos) : "";
				linValue = ((pos + 1) < line.length) ? line.substr(pos + 1) : "";
			}
			linKey = p2p$.com.webp2p.core.common.String.trim(linKey);
			linValue = p2p$.com.webp2p.core.common.String.trim(linValue);

			if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-X-VERSION", true) == 0) {
				this.version_ = linValue;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-X-ALLOW-CACHE", true) == 0) {
				this.allowCache_ = linValue;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-X-TARGETDURATION", true) == 0) {
				this.targetDuration_ = p2p$.com.webp2p.core.common.String.parseNumber_(linValue, 0);
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-X-MEDIA-SEQUENCE", true) == 0) {
				this.mediaSequence_ = p2p$.com.webp2p.core.common.String.parseNumber_(linValue, 0);
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-X-PROGRAM-DATE-TIME", true) == 0) {
				this.programDateTime_ = linValue;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-M3U8-TYPE", true) == 0) {
				this.programeType_ = linValue;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-M3U8-VER", true) == 0) {
				this.programVersion_ = linValue;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-PROGRAM-ID", true) == 0) {
				this.programId_ = linValue;
				lastSegment.programId_ = linValue;
				lastSegment.beginOfMeta_ = true;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-PIC-WIDTH", true) == 0) {
				this.pictureWidth_ = p2p$.com.webp2p.core.common.String.parseFloat(linValue, 0);
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-PIC-HEIGHT", true) == 0) {
				this.pictureHeight_ = p2p$.com.webp2p.core.common.String.parseFloat(linValue, 0);
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-DIRECT", true) == 0) {
				lastSegment.directMode_ = p2p$.com.webp2p.core.common.String.parseNumber_(linValue, 0) ? true : false;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-PATH1", true) == 0 && lastSegment.moreMediaUrls_ != null) {
				lastSegment.moreMediaUrls_[0] = linValue;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-PATH2", true) == 0 && lastSegment.moreMediaUrls_ != null) {
				lastSegment.moreMediaUrls_[1] = linValue;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-AD-MONITOR-URL", true) == 0) {
				lastSegment.advertMonitorUrl_ = linValue;
			}

			if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-START-TIME", true) == 0) {
				lastSegment.startTime_ = p2p$.com.webp2p.core.common.String.parseFloat(linValue, 0) * 1000;
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-SEGMENT-ID", true) == 0) {
				lastSegment.id_ = p2p$.com.webp2p.core.common.String.parseNumber_(linValue, 0);
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-LETV-CKS", true) == 0) {

				// speed up method
				var pieceItem = new p2p$.com.webp2p.core.supernode.MetaPiece();
				linValue = p2p$.com.webp2p.core.common.String.makeUpper_(linValue);
				var position = linValue.indexOf("TN=");
				var pieceTag = linValue.substr(position);
				if (-1 != position) {
					pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
					pieceItem.id_ = p2p$.com.webp2p.core.common.String.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));

					position = linValue.indexOf("KEY=");
					pieceTag = linValue.substr(position);
					if (-1 != position) {
						pieceItem.key_ = p2p$.com.webp2p.core.common.String.parseNumber_(pieceTag.substring(4, pieceTag.indexOf("&")));
					}

					lastSegment.pieceTnCount_++;
				} else {
					pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
					position = linValue.indexOf("PN=");
					pieceTag = linValue.substr(position);
					if (-1 != position) {
						pieceItem.id_ = p2p$.com.webp2p.core.common.String.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));
					}
					lastSegment.piecePnCount_++;
				}
				position = linValue.indexOf("SZ=");
				pieceTag = linValue.substr(position);
				if (-1 != position) {
					pieceItem.size_ = p2p$.com.webp2p.core.common.String.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));
				}

				position = linValue.indexOf("CKS=");
				pieceTag = linValue.substr(position);
				if (-1 != position) {
					pieceItem.checksum_ = p2p$.com.webp2p.core.common.String.parseNumber_(pieceTag.substring(4));
				}

				// P2P_ULOG_INFO("pieceItem.checksum_:"+pieceItem.checksum_ +",pieceItem.size_:"+pieceItem.size_+",sum:"+(pieceItem.checksum_+pieceItem.size_));
				pieceItem.offset_ = lastSegment.size_;
				pieceItem.index_ = lastSegment.pieces_.length;
				lastSegment.size_ += pieceItem.size_;
				lastSegment.pieces_.push(pieceItem);
				this.maxPieceId = Math.max(maxPieceId, pieceItem.id_);
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXT-X-DISCONTINUITY", true) == 0) {
				lastSegment.discontinuity_ = true;
				P2P_ULOG_TRACE("core::supernode::MetaData Segment is #EXT-X-DISCONTINUITY id(" + lastSegment.id_ + "), start time(" + lastSegment.startTime_
						+ ")");
			} else if (p2p$.com.webp2p.core.common.String.compareTo_(linKey, "#EXTINF", true) == 0) {
				lastSegment.duration_ = (p2p$.com.webp2p.core.common.String.parseFloat(linValue, 0) * 1000);
				// P2P_ULOG_INFO("parseResult:"+p2p$.com.webp2p.core.common.String.parseFloat(linValue, 0)+",lastSegment.duration_:"+lastSegment.duration_
				// +",linval="+linValue);
			}

		}

		if (this.directMetaMode_) {
			// // assign program id for the first segment which p2p enabled
			// programId_.clear();
			// bool dataUrlFound = false;
			// for( size_t n = 0; n < segments_.size(); n ++ )
			// {
			// core::supernode::MetaSegment &segment = segments_[n];
			// if( !segment.p2pDisabled_ && !segment.programId_.empty() )
			// {
			// primaryDataUrl_ = segment.mediaUrl_;
			// morePrimaryUrls_ = segment.moreMediaUrls_;
			// programId_ = segment.programId_;
			// dataUrlFound = true;
			// break;
			// }
			// }
			// if( segments_.size() > 0 && !dataUrlFound )
			// {
			// core::supernode::MetaSegment &firstSegment = segments_[0];
			// primaryDataUrl_ = firstSegment.mediaUrl_;
			// morePrimaryUrls_ = firstSegment.moreMediaUrls_;
			// // disable p2p
			// //programId_ = firstSegment.programId_;
			// }
			//
			// // assign new piece for each piece which p2p disabled;
			// int64 nextPieceId = maxPieceId;
			// for( size_t n = 0; n < segments_.size(); n ++ )
			// {
			// core::supernode::MetaSegment &segment = segments_[n];
			// if( !segment.p2pDisabled_ ) continue;
			// for( size_t k = 0; k < segment.pieces_.size(); k ++ )
			// {
			// core::supernode::MetaPiece &piece = segment.pieces_[k];
			// piece.id_ = (++ nextPieceId);
			// }
			// }
			//
			// if( !segments_.empty() )
			// {
			// core::supernode::MetaSegment &firstSegment = segments_[0];
			// __ULOG_INFO(__ULOG_FMT("core::supernode::MetaData", "[%s]Meta cdn node(1), url(%s)"),
			// core::common::getMetaTypeName_(type_), firstSegment.mediaUrl_.c_str());
			// for( size_t n = 0 ; n < firstSegment.moreMediaUrls_.size(); n ++ )
			// {
			// __ULOG_INFO(__ULOG_FMT("core::supernode::MetaData", "[%s]Meta cdn node(%d), url(%s)"),
			// core::common::getMetaTypeName_(type_), (int)(n + 2), firstSegment.moreMediaUrls_[n].c_str());
			// }
			// }

		}

		if (needBuildIndexes) {
			this.buildIndexes_();
		}

		// default
		if (!(this.programId_ == "")) {
			// p2pGroupId_ = programId_ + version_ + core::common::Module::kP2pVersion; // test only
			// p2p$.com.webp2p.core.common.String
			this.p2pGroupId_ = this.programId_ + this.programVersion_ + p2p$.com.webp2p.core.common.Module.kP2pVersion;

			// p2pGroupId_ = "heilongjiang31.3m3u8_12272000";
		}
		return true;
	},

	loadHeaders_ : function(url, cheaders, checksumData) {
	},

	buildIndexes_ : function() {
		this.tn2SegmentIndexMap_.clear();
		this.pn2SegmentIndexMap_.clear();
		this.segments_.sort(function(item1, item2) {
			return item1.id_ - item2.id_;
		});

		this.p2pPieceCount_ = 0;
		this.totalDuration_ = 0;
		for ( var n = 0; n < this.segments_.length; n++) {
			var segment = this.segments_[n];
			segment.index_ = n;
			this.totalDuration_ += segment.duration_;
			if (segment.p2pDisabled_) {
				continue;
			}

			this.p2pPieceCount_ += segment.pieces_.length;
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				var indexMap = (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn == piece.type_) ? this.tn2SegmentIndexMap_
						: this.pn2SegmentIndexMap_;
				// indexMap[piece.id_] = segment.index_;
				indexMap.set(piece.id_, segment.index_);
			}
		}
	},

	updateMetaCache_ : function(endTime, endList, localMode) {
	},

	combineWith_ : function(other, reloaded, groupChanged) {
		var modifyCount = 0;
		var newSegmentCount = 0;
		var maxSegmentId = 0;
		var newSegments = [];
		if (groupChanged) {
			this.version_ = other.version_;
			this.mediaSequence_ = other.mediaSequence_;
			this.pictureWidth_ = other.pictureWidth_;
			this.pictureHeight_ = other.pictureHeight_;
		}

		for ( var k = 0; k < this.segments_.length; k++) {
			var item = this.segments_[k];
			maxSegmentId = maxSegmentId > item.id_ ? maxSegmentId : item.id_;
		}

		for ( var n = 0; n < other.segments_.length; n++) {
			var segment = other.segments_[n];
			var exists = false;
			var existsIndex = 0;
			for ( var k = 0; k < this.segments_.length; k++) {
				var item = this.segments_[k];
				if (item.startTime_ > 0) {
					if (item.id_ == segment.id_) {
						existsIndex = k;
						exists = true;
						break;
					}
				} else if (item.url_ == segment.url_) {
					existsIndex = k;
					exists = true;
					break;
				}
			}

			if (exists) {
				if (reloaded) {
					var existsSegment = this.segments_[existsIndex];
					var backupSegment = existsSegment;
					existsSegment = segment;
					existsSegment.url_ = backupSegment.url_;
					existsSegment.mediaUrl_ = backupSegment.mediaUrl_;
					existsSegment.playUrl_ = backupSegment.playUrl_;
					existsSegment.advertMonitorUrl_ = backupSegment.advertMonitorUrl_;
					existsSegment.advertMonitorReported_ = backupSegment.advertMonitorReported_;
					existsSegment.pictureWidth_ = backupSegment.pictureWidth_;
					existsSegment.pictureHeight_ = backupSegment.pictureHeight_;
					modifyCount++;
				}
				continue;
			}
			newSegments.push(segment.id_);
			this.segments_.push(segment);
			var newSegment = this.segments_[this.segments_.length - 1];
			if (this.p2pGroupId_ == "") {
				// standrad meta
				newSegment.id_ = (segment.startTime_ > 0) ? (newSegment.startTime_ / 1000) : (++maxSegmentId);
				if (segment.pieces_.length == 1) {
					newSegment.pieces_[0].id_ = segment.id_;
				}
			}
			this.p2pPieceCount_ += segment.pieces_.length;
			newSegmentCount++;
			modifyCount++;
		}

		if (modifyCount > 0) {
			this.buildIndexes_();
		}

		return {
			newSegmentCount_ : newSegmentCount,
			newSegments_ : newSegments
		};
	},

	combineSameGroup_ : function(other) {
		if (other.segments_.length == 0) {
			return 0;
		}

		var newSegmentCount = 0;
		var maxSegmentId = 0;
		var newSegments = [];
		var endIndex = other.segments_.length - 1;
		for ( ; endIndex >= 0; endIndex--) {
			var item = other.segments_[endIndex];
			if (item.beginOfMeta_) {
				break;
			}
		}

		if (endIndex <= 0) {
			return 0;
		}

		for ( var n = 0; n < endIndex; n++) {
			var segment = other.segments_[n];
			var exists = false;
			for ( var k = 0; k < this.segments_.length; k++) {
				var item = this.segments_[k];
				if (item.startTime_ > 0) {
					if (item.id_ == segment.id_) {
						exists = true;
						break;
					}
				} else if (item.url_ == segment.url_) {
					exists = true;
					break;
				}
			}

			if (exists) {
				continue;
			}
			newSegments.push(segment.id_);
			this.segments_.push(segment);
			var newSegment = this.segments_[this.segments_.length - 1];
			if (!this.p2pGroupId_) {
				// standrad meta
				newSegment.id_ = (segment.startTime_ > 0) ? (newSegment.startTime_ / 1000) : (++maxSegmentId);
				if (segment.pieces_.length == 1) {
					newSegment.pieces_[0].id_ = segment.id_;
				}
			}
			this.p2pPieceCount_ += segment.pieces_.length;
			newSegmentCount++;
		}

		if (newSegmentCount > 0) {
			this.buildIndexes_();
		}
		return {
			newSegmentCount_ : newSegmentCount,
			newSegments_ : newSegments
		};
	},

	duplicateExistsFrom_ : function(other) {
	},

	markAllSegmentP2pDisabled_ : function() {
		for ( var n = 0; n < this.segments_.length; n++) {
			var item = this.segments_[n];
			item.p2pDisabled_ = true;
		}
	},

	updateSegmentTimeGap_ : function() {
	},

	resetReceiveTags_ : function() {
	},

	parseChecksum_ : function(pieceSize, checksums, checksumData) {
	},

	verifyPiece_ : function(piece, data, size) {
		switch (this.verifyMethod_) {
		case p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD.kDataVerifyMethodCrc32:
			return piece.verifyWithCrc32_(data, size);
		default:
			return piece.verify(data, size);
		}
	},

	getLocalMetaContent_ : function() {
		return this.localMetaContent_;
	},

	getSegmentStorageId_ : function(segmentId) {
		return p2p$.com.webp2p.core.common.String.format("channel://{0}//{1}", this.storageId_, segmentId);
	},

	getSegmentIndexById_ : function(id) {
		for ( var n = 0; n < this.segments_.length; n++) {
			var item = this.segments_[n];
			if (item.id_ == id) {
				return n;
			}
		}
		return -1;
	},

	getSegmentIndexByPieceId_ : function(type, id) {
		var indexMap = (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn == type) ? this.tn2SegmentIndexMap_ : this.pn2SegmentIndexMap_;
		var value = indexMap.get(id);
		return (value != null ? value : -1);
	},

	getSegmentById_ : function(id) {
		var segment = null;
		for ( var n = 0; n < this.segments_.length; n++) {
			var item = this.segments_[n];
			if (item.id_ == id) {
				segment = item;
				break;
			}
		}
		return segment;
	},

	getDataSize_After_ : function(msId) {
	}
});p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.BitmapStatic = {
	kMaxBitCount : 80 * 1000,
};

p2p$.com.webp2p.core.supernode.Bitmap = CdeBaseClass.extend_({
	data_ : null,

	init : function() {
		this.data_ = new p2p$.com.webp2p.core.common.Map();
	},

	getValue : function(id) {
		var index = id % p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
		var offset = Math.floor(index / 8);
		var retValue = {
			value : 0,
		};
		if (index < 0 || offset < 0 || !this.data_.find2(offset, retValue)) {
			return false;
		}
		// this.data_.find2(offset,retValue);
		var value = retValue.value;// this.data_.get(offset);
		var old = (value & (1 << (index % 8))) ? true : false;
		return old;
	},

	setValue : function(id, bit) {

		var index = id % p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
		var offset = Math.floor(index / 8);
		if (index < 0 || offset < 0) {
			return false;
		}
		var value = this.data_.get(offset);
		if (typeof value == 'undefined' || value == null) {
			value = new Uint8Array(1);
			this.data_.set(offset, value);
		}
		var old = (value & (1 << (index % 8))) ? true : false;
		value |= (1 << (index % 8));
		this.data_.set(offset, value);
		return old;
	},

	reserve : function(size) {
	},

	clear : function(reserveBuffer) {
		if (reserveBuffer) {
			for ( var i = 0; i < this.data_.elements_.length; i++) {
				this.data_.elements_[i].value = new Uint8Array(1);
			}
		} else {
			this.data_.clear();
		}
	}
});p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Manager = CdeBaseClass.extend_({
	channels_ : null,
	defaultMultiMode_ : false,
	channelCapacity_ : 0,
	downloadCapacity_ : 0,
	downloadParallelCount_ : 0,

	// ChannelPtrMap channels_;
	// ChannelPtrList downloads_;
	// AuthorizationPtr authorization_;
	// core::common::StringSet playedHistoryKeys_;
	// core::access::KeyManager keyManager_;
	enviroment_ : null,
	// boost::asio::io_service &service_;

	init : function(enviroment) {
		this.channels_ = new p2p$.com.webp2p.core.common.Map();
		this.enviroment_ = enviroment;
		this.defaultMultiMode_ = false;
		this.channelCapacity_ = 3; // default
		this.downloadCapacity_ = 1000;
		this.downloadParallelCount_ = 1;
		// authorization_.reset(new Authorization(*this, io));
	},

	getEnviroment_ : function() {
		return this.enviroment_;
	},

	openChannel : function(channelUrl, params, scope) {
		P2P_ULOG_TRACE(P2P_ULOG_FMT("openChannel"));

		// var playerTaskId = params.find("taskid") ? params.get("taskid") : "";
		// var multiMode = params.find("multi") ? params.get("multi") : this.defaultMultiMode_;
		// var closeIfExists = params.find("exclusive") ? params.get("exclusive") : false;
		var groupType = params.find("pip") ? params.get("pip") : 0;
		var streamMode = params.find("stream") ? params.get("stream") : 0;
		if (params.find("group")) {
			groupType = params.get("group");
		}
		var urlTagTime = params.find("tagtime") ? (params.get("tagtime") * 1000 * 1000) : 0;
		var channel = null;
		// var isLiveStream = false;
		if (this.channels_.has(channelUrl)) {
			channel = this.channels_.get(channelUrl);
			channel.updateActiveTime_(false);
			return channel;
		}

		var programUrl = new p2p$.com.webp2p.core.supernode.Url();
		programUrl.fromString_(channelUrl);
		var tagName = (programUrl.params_.find("tag")) ? programUrl.params_.get("tag") : "";
		var streamId = (programUrl.params_.find("stream_id")) ? programUrl.params_.get("stream_id") : "";
		var isLiveStream = (streamMode > 0) || streamId != "";
		// var isRtlStream = false;
		// if (this.enviroment_.rtlStreamEnabled_) {
		// if (programUrl.protocol_ == "rtmp") {
		// isRtlStream = true;
		// } else {
		// isRtlStream = isLiveStream && (programUrl.params_.find("scheme")) && programUrl.params_.get("scheme") == "rtmp";
		// }
		// }

		if (isLiveStream) {
			channel = new p2p$.com.webp2p.logic.live.Channel(channelUrl, programUrl, this);
		} else {
			channel = new p2p$.com.webp2p.logic.vod.Channel(channelUrl, programUrl, this);
		}
		channel.setGroupType(groupType);
		channel.setReopenMode(false);
		channel.loadParams_(params, this.enviroment_.customContextParams_);
		channel.updateActiveTime_(false);
		channel.setUrlTagTime_(urlTagTime);
		if (!channel.open()) {

			P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Manager::Open new {0} channel url({1}) failed", tagName || "vod", channelUrl));
			channel = null;
			return channel;
		}
		this.channels_.set(channelUrl, channel);

		P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Open new {0} channel url({1}) OK", tagName || "vod", channelUrl));
		return channel;
	},

	closeChannel_ : function(channelUrl) {
		for ( var n = 0; n < this.channels_.length; n++) {
			var mapItem = this.channels_.element(n);
			if (mapItem.key == channelUrl) {
				var item = mapItem.value;
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Close channel id({0}), type({1}), url({2}), total {3} channel(s) now", item.getId_(), item
						.getTypeName_(), item.getChannelUrl_(), this.channels_.size() - 1));
				item.close();
				this.channels_.erase(this.channels_.element(n).key);
				delete item;
				return true;
			}
		}
	},

	checkTimeout_ : function() {
		var isMobileNow = this.enviroment_.isMobileNetwork_();
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		for ( var n = 0; n < this.channels_.length; n++) {
			var item = this.channels_.element(n).value;
			// if (item.getActiveTime_() + item.getMaxSleepTime_() < nowTime) {
			// P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Close timeout channel id({0}), type({1}), url({2}), total {3} channel(s) now", item.getId_(),
			// item.getTypeName_(), item.getChannelUrl_(), this.channels_.size() - 1));
			// item.close();
			// this.channels_.erase(this.channels_.element(n).key);
			// n--;
			// continue;
			// }

			if (!item.isOpened_() || !item.p2pIsReady_()) {
				continue;
			}
			var needDeactivate = (item.getActiveTime_() + item.getMaxSilentTime_() < nowTime) || isMobileNow || item.isPaused_();
			if (needDeactivate && item.p2pisActive_()) {
				item.p2pDeactive_();
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Deactive slient channel, mobile network({0}), id({1}), type({2}), url({3})",
						isMobileNow ? "yes" : "no", item.getId_(), item.getTypeName_(), item.getChannelUrl_()));
			} else if (!needDeactivate && !item.p2pisActive_()) {
				item.p2pActivate_();
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Activate slient channel, mobile network({0}), id({1}), type({2}), url({3})",
						isMobileNow ? "yes" : "no", item.getId_(), item.getTypeName_(), item.getChannelUrl_()));
			}
		}
	},

	getChannelById_ : function(id) {
		var channel = null;
		for ( var n = 0; n < this.channels_.length; n++) {
			var item = this.channels_.element(n).value;
			if (item.getId_() == id) {
				channel = item;
				break;
			}
		}
		return channel;
	}
});p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Channel = CdeBaseClass.extend_({
	channelType_ : "base",

	type_ : 0,
	groupType_ : 0,
	id_ : "",
	playerTaskId_ : "",
	playerHistoryKey_ : "",
	gslbRequestUrl_ : "",
	gslbEncryptUrl_ : "",
	globalParams_ : "",
	context_ : null,//
	url_ : null,//
	downloader_ : null,

	protocolPool_ : null,
	// tools::collector::ReportClientPtr reportClient_;
	// tools::collector::ClientTraffic reportTraffic_;
	// BlockRequestSchedulePtr responseSchedule_;
	manager_ : null,
	// boost::asio::io_service &service_;
	// protocol::base::Message selfRangesMessage_;
	// protocol::base::Message selfEmptyRangesMessage_;
	// boost::asio::deadline_timer timer_;
	// boost::asio::deadline_timer protocolTimer_;
	// logic::base::EventListener &eventListener_;
	stablePeers_ : null,
	otherPeers_ : null,
	statData_ : null,

	opened_ : false,
	paused_ : false,
	reopenMode_ : false,
	redirectMode_ : false,
	hlsMode_ : false,
	directMetaMode_ : false,
	icpCode_ : 0,
	createTime_ : 0,
	openTime_ : 0,
	activeTime_ : 0,
	closeTime_ : 0,
	urlTagTime_ : 0,
	maxSleepTime_ : 0,
	maxSilentTime_ : 0,
	channelOpenedTime_ : 0,
	mediaStartTime_ : 0,
	mediaActiveTime_ : 0,
	playerStartTime_ : 0,
	playerFlushTime_ : 0,
	playerFlushInterval_ : 0,
	playerFlushMaxInterval_ : 0,
	playerInitialPosition_ : 0,
	playerSkipPosition_ : 0,
	playerSkipDuration_ : 0,
	lastScheduleTime_ : 0,
	lastPeerSortTime_ : 0,
	lastPieceShareInUpdateTime_ : 0,
	lastMessageUpdateTime_ : 0,
	firstSegmentId_ : 0,
	playerSegmentId_ : 0,
	urgentSegmentId_ : 0,
	urgentSegmentEndId_ : 0,
	completedSegmentId_ : 0,
	urgentSegmentIndex_ : 0,
	urgentIncompleteCount_ : 0,
	otherPeerRequestCount_ : 0,
	gslbTryTimes_ : 0,
	checksumTryTimes_ : 0,
	metaTryTimes_ : 0,
	gslbServerResponseCode_ : 0,
	gslbServerErrorCode_ : 0,
	gslbServerErrorDetails_ : "",
	gslbBackupIp_ : "",
	checksumServerResponseCode_ : 0,
	metaServerResponseCode_ : 0,
	segmentNotFoundTimes_ : 0,
	gslbReloadInterval_ : 0,
	gslbLoadTime_ : 0,
	gslbConsumedTime_ : 0,
	gslbReloadTimes_ : 0,
	checksumLoadTime_ : 0,
	metaLoadTime_ : 0,
	metaReloadTimes_ : 0,
	metaData_ : null,
	metaResponsed_ : false,
	metaResponseCode_ : 0,
	metaResponseDetails_ : "",
	metaResponseType_ : "",
	metaResponseBody_ : "",
	checksumFileData_ : "",

	peerReceiveTimeout_ : 0,
	peerDeadTimeout_ : 0,
	selectorReported_ : false,

	rtmfpServerReported_ : false,
	rtmfpGatherReported_ : false,
	cdeTrackerReported_ : false,
	webrtcServerReported_ : false,

	gslbCompleteReported_ : false,
	metaCompleteReported_ : false,
	firstReceivePieceReported_ : false,
	p2pFirstPieceReported_ : false,
	playerPositionSkipped_ : false,
	playerBufferingSkipped_ : false,
	selfRanges_ : "",
	firstSeekTime_ : 0,
	scheduleTimer_ : null,
	reportTimer_ : null,
	init : function(type, channelUrl, decodedUrl, mgr) {
		// console.debug("base.Channel init");
		this.context_ = new p2p$.com.webp2p.core.supernode.Context();
		// this.url_ = new p2p$.com.webp2p.core.supernode.Url();
		this.metaData_ = new p2p$.com.webp2p.core.supernode.MetaData();
		this.statData_ = new p2p$.com.webp2p.logic.base.StatData();
		this.selfRangesMessage_ = new p2p$.com.webp2p.protocol.base.Message();
		this.stablePeers_ = [];
		this.otherPeers_ = [];
		this.manager_ = mgr;
		this.type_ = type;
		this.url_ = decodedUrl;

		this.groupType_ = 0;
		this.opened_ = false;//
		this.paused_ = false;//
		this.reopenMode_ = false;
		this.redirectMode_ = false;
		this.hlsMode_ = true;
		this.directMetaMode_ = false;
		this.icpCode_ = 0; // default icp
		this.createTime_ = 0;
		this.activeTime_ = 0;
		this.closeTime_ = 0;
		this.urlTagTime_ = 0;
		this.maxSleepTime_ = 60 * 1000;
		this.maxSilentTime_ = 120 * 1000;
		this.channelOpenedTime_ = 0;
		this.mediaStartTime_ = 0;
		this.mediaActiveTime_ = 0;
		this.playerStartTime_ = 0;
		this.playerFlushTime_ = 0;
		this.playerFlushInterval_ = 0;
		this.playerFlushMaxInterval_ = 0;
		this.playerInitialPosition_ = -1;
		this.playerSkipPosition_ = -1;
		this.playerSkipDuration_ = 0;
		this.lastScheduleTime_ = 0;
		this.lastPeerSortTime_ = 0;
		this.lastPieceShareInUpdateTime_ = 0;
		this.lastMessageUpdateTime_ = 0;
		this.firstSegmentId_ = -1;
		this.playerSegmentId_ = -1;
		this.urgentSegmentId_ = -1;
		this.urgentSegmentEndId_ = -1;
		this.completedSegmentId_ = -1;
		this.urgentSegmentIndex_ = 0;
		this.urgentIncompleteCount_ = 0;
		this.otherPeerRequestCount_ = 0;
		this.id_ = p2p$.com.webp2p.core.common.Md5.hexString_(channelUrl).toLowerCase();
		this.metaData_.type_ = type;
		this.metaData_.channelUrl_ = channelUrl;
		this.metaData_.storageId_ = this.id_;

		// this.gslbRequestUrl_ = channelUrl;////

		this.metaResponsed_ = false;
		this.metaResponseCode_ = 0;
		this.reportClient_ = new p2p$.com.webp2p.tools.collector.ReportClient(this.manager_.getEnviroment_(), this.context_, this.metaData_);
		this.reportTraffic_ = new p2p$.com.webp2p.tools.collector.ClientTraffic();
		this.selectorReported_ = false;
		this.rtmfpServerReported_ = false;
		this.rtmfpGatherReported_ = false;
		this.webrtcServerReported_ = false;
		this.cdeTrackerReported_ = false;
		this.gslbCompleteReported_ = false;
		this.metaCompleteReported_ = false;
		this.firstReceivePieceReported_ = false;
		this.p2pFirstPieceReported_ = false;
		this.playerPositionSkipped_ = false;
		this.playerBufferingSkipped_ = false;

		this.gslbTryTimes_ = 0;
		this.checksumTryTimes_ = 0;
		this.metaTryTimes_ = 0;
		this.gslbServerResponseCode_ = 0;
		this.gslbServerErrorCode_ = -1;
		this.checksumServerResponseCode_ = 0;
		this.metaServerResponseCode_ = 0;
		this.segmentNotFoundTimes_ = 0;
		this.openTime_ = 0;
		this.createTime_ = this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		// default config
		this.peerReceiveTimeout_ = 30 * 1000;
		this.peerDeadTimeout_ = 30 * 1000;

		// gslb reload
		this.gslbLoadTime_ = 0;
		this.gslbReloadTimes_ = 0;
		this.gslbReloadInterval_ = 0;
		this.gslbConsumedTime_ = 0;
		this.checksumLoadTime_ = 0;
		this.metaLoadTime_ = 0;
		this.metaReloadTimes_ = 0;
		this.selfRanges_ = "";
		this.scheduleTimer_ = null;
		this.reportTimer_ = null;
	},

	getId_ : function() {
		return this.id_;
	},

	getChannelType_ : function() {
		return this.channelType_;
	},

	setGroupType : function(type) {
		this.groupType_ = type;
	},

	setReopenMode : function(mode) {
		this.reopenMode_ = mode;
	},

	loadParams_ : function(params, customParams) {
		this.globalParams_ = params;
		this.playerTaskId_ = params["taskid"];
		if (params.hasOwnProperty("icp")) {
			this.icpCode_ = params["icp"];
		}
		this.metaData_.taskId_ = this.playerTaskId_;
		this.metaData_.rangeParamsSupported_ = (this.icpCode_ == 0); // only default icp support range params
		this.context_.loadParams_(this.globalParams_, customParams);
	},

	updateActiveTime_ : function(activate) {
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		// p2p not support under mobile network
		// bool isMobileNow = this.manager_.getEnviroment_().isMobileNetwork_();
		// if( activate && opened_ && p2pIsReady_() && !p2pisActive_() && !isMobileNow && !paused_ )
		// {
		// p2pActivate_();
		// __ULOG_INFO(__ULOG_FMT("logic::base::Channel", "[%s]Active to reopen channel(%s) p2p protocols ...."),
		// getTypeName_(), getChannelUrl_().c_str());
		// }
	},

	setUrlTagTime_ : function(tagTime) {
		this.urlTagTime_ = tagTime;
	},

	open : function() {
		this.gslbTryTimes_ = 0;
		this.checksumTryTimes_ = 0;
		this.metaTryTimes_ = 0;
		this.gslbServerResponseCode_ = 0;
		this.gslbServerErrorCode_ = -1;
		this.checksumServerResponseCode_ = 0;
		this.metaServerResponseCode_ = 0;
		this.segmentNotFoundTimes_ = 0;
		this.openTime_ = this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.mediaActiveTime_ = 0;
		this.urgentSegmentId_ = 0;
		this.urgentIncompleteCount_ = 0;
		this.reportClient_.initialize_(this.context_.gslbData_);
		if (this.protocolPool_ != null) {
			this.protocolPool_.exit();
		}
		this.protocolPool_ = new p2p$.com.webp2p.protocol.base.Pool(this.manager_.getEnviroment_(), this.context_, this.metaData_, this);
		// responseSchedule_.reset(new BlockRequestSchedule(*this));
		this.opened_ = true;
		this.metaResponsed_ = false;
		this.metaResponseCode_ = 0;
		// if( globalParams_.isMember("playpos") ) playerInitialPosition_ = int64(globalParams_["playpos"].asDouble() * 1000.0);
		// if( globalParams_.isMember("skippos") ) playerSkipPosition_ = int64(globalParams_["skippos"].asDouble() * 1000.0);
		// if( globalParams_.isMember("skipduration") ) playerSkipDuration_ = int64(globalParams_["skipduration"].asDouble() * 1000.0);
		// checkDirectMetaMode();

		// check if custom params in enviroments
		var env = this.manager_.getEnviroment_();
		// for( json::Value::iterator itr = env.customMediaParams_.begin(); itr != env.customMediaParams_.end(); itr ++ )
		// {
		// url_.params_[itr.memberName()] = (*itr).asString();
		// }
		env.setChannelParams_(this.url_.params_);
		this.context_.initialize_(this.url_, env);

		// add addtional params
		this.url_.params_.set("cde", p2p$.com.webp2p.core.common.Module.getkCdeFullVersion_()); // version
		this.url_.params_.set("cdeid", this.manager_.getEnviroment_().moduleId_);
		this.url_.params_.set("appid", this.manager_.getEnviroment_().externalAppId_);
		this.url_.params_.set("format", "1");
		this.url_.params_.set("expect", "3");
		this.url_.params_.set("ajax", "1");

		var tss = this.url_.params_.get("tss");
		var m3v = this.url_.params_.get("m3v");
		if (tss != "ios") {
			tss = "tvts";
		}
		if (!m3v || m3v == "0") {
			m3v = "1";
		}
		// m3v = "0";
		this.url_.params_.set("tss", tss);
		this.url_.params_.set("m3v", m3v);

		// send init report
		var stage = new p2p$.com.webp2p.tools.collector.ClientStage();
		stage.action_ = p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionInitialize;
		this.reportClient_.sendClientStage_(stage);
		return true;
	},

	close : function() {
		if (this.opened_) {
			this.reportTraffic_.flush(this.reportClient_, true);
		}

		this.opened_ = false;
		this.closeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.stablePeers_ = [];
		this.otherPeers_ = [];

		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.scheduleTimer_) {
			clearTimeout(this.scheduleTimer_);
			this.scheduleTimer_ = null;
		}
		if (this.reportTimer_) {
			clearTimeout(this.reportTimer_);
			this.reportTimer_ = null;
		}
		// protocolTimer_.cancel(errorCode);
		this.reportClient_.exit();
		if (this.downloader_ != null) {
			this.downloader_.close();
			this.downloader_ = null;
		}
		if (this.protocolPool_ != null) {
			this.protocolPool_.exit();
			// if( responseSchedule_.get() ) responseSchedule_->close();
		}

		this.protocolPool_ = null;
		// responseSchedule_.reset();

		if (this.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload) {
			var bucket = this.getStorageBucket_();
			for ( var n = 0; n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				bucket.remove(objectId);
			}
		}
		this.metaData_.segments_ = [];
		// this.metaData_ = null;
		// if( this.syncStateIndex_ >= 0 )
		// {
		// this.manager_.getEnviroment_().freeSyncDataState(id_);
		// syncStateIndex_ = -1;
		// }

		return true;
	},

	pause : function() {
	},

	setGslbTimeout_ : function(timeoutMs) {
		var me = this;
		this.timer_ = setTimeout(function() {
			me.onGslbTimeout_();
		}, timeoutMs);
	},

	onGslbTimeout_ : function() {
		if (this.downloader_ != null) {
			this.downloader_.log("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}
		this.gslbTryTimes_++;
		if (this.gslbTryTimes_ <= 1) {
			// updateGslbBackupIp();
			this.downloadGslb_();
		} else {
			this.onMetaComplete_(500, "GSLB Request Failed", "");
		}
	},

	setChecksumTimeout_ : function() {
	},

	setMetaTimeout_ : function(timeoutMs) {
		var me = this;
		this.timer_ = setTimeout(function() {
			me.onMetaTimeout_();
		}, timeoutMs);
	},

	onMetaTimeout_ : function() {
		if (this.downloader_) {
			this.downloader_.log("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}
		this.metaTryTimes_++;
		if (this.metaTryTimes_ <= 3) {
			if (!this.directMetaMode_) {
				// switch next meta url if gslb
				var allMetaNodes = this.context_.gslbData_["nodelist"];
				for ( var n = 0; n < allMetaNodes.length; n++) {
					var metaItem = allMetaNodes[(n + this.metaTryTimes_) % allMetaNodes.length];
					var locationUrl = metaItem["location"];
					if (!(locationUrl == "") && locationUrl != this.metaData_.sourceUrl_) {
						this.metaData_.sourceUrl_ = locationUrl;
						break;
					}
				}
			}
			this.downloadMeta_();
		} else {
			this.onMetaComplete_(500, "Meta Request Failed", "");
		}
	},

	setProtocolTimeout_ : function() {
	},

	flushMetaCache_ : function() {
	},

	isOpened_ : function() {
		return this.opened_;
	},

	isPaused_ : function() {
		return this.paused_;
	},

	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;
		if ("base::gslb" == downloader.tag_) {
			handled = true;
			this.gslbConsumedTime_ = downloader.totalUsedTime;
			this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			this.gslbServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
			// this.context.gslbServerIp_ = downloader.remoteEndpoint_;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				if (this.timer_) {
					clearTimeout(this.timer_);
					this.timer_ = null;
				}
				this.onGslbTimeout_();
				return handled;
			}
			this.downloader_ = null;
			if (!this.parseGslbResponse_(downloader, "")) {
				if (52001 == this.gslbServerErrorCode_) {
					// json parse failed, waiting timeout and retry
					if (this.timer_) {
						clearTimeout(this.timer_);
						this.timer_ = null;
					}
					this.onGslbTimeout_();
					return handled;
				}
				// stop timer
				if (this.timer_) {
					clearTimeout(this.timer_);
					this.timer_ = null;
				}
				this.onMetaComplete_(500, "GSLB Response Failed " + this.gslbServerErrorCode_);
				return handled;
			}

			// stop timer
			if (this.timer_) {
				clearTimeout(this.timer_);
				this.timer_ = null;
			}

			if (!this.gslbCompleteReported_) {
				this.gslbCompleteReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionScheduleCompleted,
						p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, downloader.remoteEndpoint_, this.activeTime_ - this.createTime_);
			}

			if (this.redirectMode_) {
				this.onMetaComplete_(302, "Moved", metaData_.sourceUrl_);
				return handled;
			}

			if (!("" == this.metaData_.sourceUrl_)) {
				if (this.hlsMode_) {
					this.downloadMeta_();
				} else {
					this.downloadChecksum_();
				}
			}

		} else if ("base::meta" == downloader.tag_) {
			handled = true;
			this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			this.metaServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
			// this.context_.metaServerIp_ = downloader.remoteEndpoint_;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				// stop timer
				if (this.timer_) {
					clearTimeout(this.timer_);
					this.timer_ = null;
				}
				this.onMetaTimeout_();
				return handled;
			}
			this.downloader_ = null;
			// stop timer
			if (this.timer_) {
				clearTimeout(this.timer_);
				this.timer_ = null;
			}

			// parse meta data
			this.metaData_.finalUrl_ = downloader.fullUrl_;
			this.metaData_.lastReceiveSpeed_ = downloader.transferedSpeed_;
			if (!this.parseMetaResponse_(downloader)) {
				this.onMetaComplete_(500, "Meta Response Failed", "");
				return handled;
			}
			if (this.firstSegmentId_ < 0 && this.metaData_.segments_.length > 0) {
				this.firstSegmentId_ = this.metaData_.segments_[0].id_;
			}

			this.metaReloadTimes_++;
			this.metaLoadTime_ = this.activeTime_;
			this.context_.videoFormat_ = this.metaData_.p2pGroupId_ == "" ? "m3u8" : "lm3u8";
			if (/* p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive == this.type_ && */this.metaData_.p2pGroupId_ == "") {
				// standard hls redirect
				this.onMetaCompleteCode_ = 302;
				this.onMetaComplete_(302, "Moved", this.metaData_.sourceUrl_);
				// return handled;
			}
			if (!this.onOpened_()) {
				this.onMetaComplete_(500, "Internal Protocol Failed", "");
				return handled;
			}

			if (!this.metaCompleteReported_) {
				this.metaCompleteReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionDownloadMeta,
						p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, downloader.remoteEndpoint_, this.activeTime_ - this.createTime_);
			}

			if (this.channelOpenedTime_ <= 0) {
				this.channelOpenedTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			}
			this.onMetaComplete_(200, "OK", this.metaData_.getLocalMetaContent_());
		}
		return handled;
	},

	downloadGslb_ : function() {
		activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.downloader_) {
			this.downloader_.close();
			this.downloader_ = null;
		}

		var timeoutMs = 5000 + (this.gslbTryTimes_ * 3000); // 5 seconds
		this.setGslbTimeout_(timeoutMs);
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(this.gslbEncryptUrl_, this, "GET", "json", "base::gslb");
		this.downloader_.load();
	},

	downloadMeta_ : function() {
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.metaLoadTime_ = this.activeTime_;
		if (this.downloader_ != null) {
			this.downloader_.log("cancel");
			this.downloader_.close();
			this.downloader_ = null;
		}

		// set meta timer
		var timeoutMs = 8 * 1000;
		this.setMetaTimeout_(timeoutMs);

		if (!this.hlsMode_) {
			// request size
			// downloader_->method_ = "HEAD";
		}
		// downloader_->highQos_ = true;
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(this.metaData_.sourceUrl_, this, "GET", "", "base::meta");
		this.downloader_.load();
	},

	downloadChecksum_ : function() {
	},

	parseGslbResponse_ : function(downloader, data) {
		var gslbData = downloader.responseData_;
		if (gslbData == "" || gslbData == null) {
			if (this.gslbServerErrorCode_ <= 0) {
				gslbServerErrorCode_ = 52001;
			}
		}
		// parse responseData
		if (this.directMetaMode_) {
			// reset gslb error information
			gslbData["ercode"] = 0;
			gslbData["errinfo"] = "Direct Meta";
		}

		this.gslbServerErrorCode_ = gslbData.ercode;
		this.gslbServerErrorDetails_ = gslbData.errinfo || "";
		this.gslbLoadTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.gslbReloadInterval_ = gslbData.forcegslb * 1000;
		// gslbReloadInterval_ = 60 * core::common::kMicroUnitsPerSec; // test

		// url timeout or linkshell timeout
		if (this.gslbServerErrorCode_ == 424 || this.gslbServerErrorCode_ == 428) {
			// sync time with server again
			// this.manager_.getAuthorization().update();
		}

		this.context_.loadData_(gslbData);
		// test for cdn meta timeout
		// context_.gslbData_["nodelist"][(json::UInt)0]["location"] = context_.gslbData_["location"] = "http://130.2.3.44/dummy.m3u8?hello=world";
		this.manager_.getEnviroment_().attachContext_(this.context_);
		this.context_.detectSpecialPlayerTimeOffset_();
		this.metaData_.directMetaMode_ = this.directMetaMode_;

		if (this.directMetaMode_) {
			if (this.redirectMode_) {
				this.metaData_.sourceUrl_ = metaData_.channelUrl_;
			} else {
				channelUrl = new p2p$.com.webp2p.core.supernode.Url();
				channelUrl.fromString_(metaData_.channelUrl_);
				m3v = channelUrl.params_["m3v"];
				if (m3v == "" || m3v == "0") {
					// m3v = this.manager_.getEnviroment_().defaultGslbM3v_;
					// channelUrl.params_["m3v"] = m3v;
					// metaData_.sourceUrl_ = channelUrl.toString();
				} else {
					// metaData_.sourceUrl_ = metaData_.channelUrl_;
				}
			}

			// json::Value &allMetaNodes = context_.gslbData_["nodelist"];
			// allMetaNodes = json::Value(json::arrayValue);
			// json::Value &primaryItem = allMetaNodes[(json::UInt)0];
			// primaryItem = json::Value(json::objectValue);
			// primaryItem["name"] = "PRIMARY";
			// primaryItem["localtion"] = metaData_.sourceUrl_;
		} else {
			this.metaData_.sourceUrl_ = this.context_.gslbData_["location"];
			var allMetaNodes = this.context_.gslbData_["nodelist"];
			if ("" == this.metaData_.sourceUrl_ && allMetaNodes.length > 0) {
				this.metaData_.sourceUrl_ = allMetaNodes[0]["location"];
			}
		}
		// console.log("logic::base::Channel Gslb response failed, no g3 meta url location, url(%s), channel(%s), size(%d)",downloader.fullUrl_,
		// this.id_, 0);
		// P2P_ULOG_INFO(channelUrl);
		P2P_ULOG_INFO("logic::base::Channel::[" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_) + "] Gslb responsed, error code("
				+ this.gslbServerErrorCode_ + "), details(" + this.gslbServerErrorDetails_ + "), url(" + downloader.fullUrl_ + "), channel(" + this.id_ + ")");

		if (!this.directMetaMode_) {
			// log cdn locations
			var jsonCdnNodes = gslbData["nodelist"];
			for ( var n = 0; n < jsonCdnNodes.length; n++) {
				var cdnNode = jsonCdnNodes[n];
				var itemUrl = cdnNode["location"];
				P2P_ULOG_INFO("logic::base::Channel [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_) + "] Gslb cdn node(" + (n + 1)
						+ "),url(" + itemUrl + ")");
			}
		}
		//
		if ("" == this.metaData_.sourceUrl_) {
			P2P_ULOG_ERROR("logic::base::Channel Gslb response failed, no g3 meta url location, url(" + downloader.fullUrl_ + "), channel(" + this.id_
					+ "), size(0)");
			if (this.gslbServerErrorCode_ <= 0) {
				this.gslbServerErrorCode_ = 52002;
			}
			return false;
		}

		return true;
	},

	parseMetaResponse_ : function(downloader) {
		if (this.hlsMode_) {
			if (!this.metaData_.load(downloader.responseData_, downloader.totalUsedTime_, true)) {
				P2P_ULOG_ERROR("logic::base::Channel [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_)
						+ "]Parse hls meta response failed, url(" + downloader.fullUrl_ + "), channel(" + this.id_ + "), size("
						+ downloader.responseData_.length + ")");
			}
		} else {
			if (!metaData_.loadHeaders_(downloader.fullUrl_, downloader.responseHeaders_, checksumFileData_)) {
				P2P_ULOG_ERROR("logic::base::Channel [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_)
						+ "]Parse file meta response failed, url(" + downloader.fullUrl_ + "), channel(" + this.id_ + "), size("
						+ downloader.responseData_.length + ")");
				return false;
			}
		}

		P2P_ULOG_INFO("logic::base::Channel [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_) + "]Parsed file meta response OK, "
				+ this.metaData_.segments_.length + " segment(s), " + "duration " + this.metaData_.totalDuration_ + " msec, " + "data size "
				+ this.metaData_.dataSize_ + " byte(s), " + "url(" + downloader.fullUrl_ + "), channel(" + this.id_ + "), size("
				+ downloader.responseData_.length + ")");

		if (this.firstSeekTime_ != 0) {
			if (this.metaData_) {
				for ( var n = 0; n < this.metaData_.segments_.length; n++) {
					var segment = this.metaData_.segments_[n];
					if (segment.startTime_ <= this.firstSeekTime_ * 1000 && this.firstSeekTime_ * 1000 < segment.startTime_ + segment.duration_) {
						this.urgentSegmentId_ = segment.id_;
					}
				}
			}
		}

		// if( directMetaMode_ )
		// {
		// // check more nodes
		// json::Value &allMetaNodes = context_.gslbData_["nodelist"];
		// for( size_t n = 0; n < metaData_.morePrimaryUrls_.size() && n < (size_t)metaData_.moreUrlCount_; n ++ )
		// {
		// const std::string &moreItem = metaData_.morePrimaryUrls_[n];
		//
		// core::supernode::Url moreUrl;
		// moreUrl.fromString_(moreItem);
		// moreUrl.file_ = "/slave.m3u8";
		// moreUrl.params_.clear();
		// moreUrl.segment_.clear();
		// moreUrl.params_["__cde_attach__"] = core::common::String::format("%d", (int)n);
		//				
		// json::Value moreMetaNode(json::objectValue);
		// moreMetaNode["name"] = core::common::String::format("SLAVE-%d", (int)n + 1);
		// moreMetaNode["location"] = moreUrl.toString();
		// allMetaNodes.append(moreMetaNode);
		// }
		// }

		return true;
	},

	onChecksumTimeout_ : function() {
	},

	onMetaComplete_ : function(code, info, data) {
		this.metaResponseCode_ = code;
		if (200 != code && 302 != code) {
			P2P_ULOG_ERROR("logic::base::Channel::Meta complete, channel(" + this.id_ + ") open failed, response " + code + "," + info + " to player");
		} else {
			P2P_ULOG_INFO("logic::base::Channel::Meta complete, open successfully");
		}
	},

	setScheduleTimeout_ : function(tag, timeoutMs) {
		var me = this;
		this.scheduleTimer_ = setTimeout(function() {
			me.onTimeout_(tag);
		}, timeoutMs);
	},
	setReportTimeout_ : function(tag, timeoutMs) {
		var me = this;
		this.reportTimer_ = setTimeout(function() {
			me.onTimeout_(tag);
		}, timeoutMs);
	},
	onReport_ : function() {
		if (this.reportTraffic_) {
			this.reportTraffic_.flush(this.reportClient_, false);
		}
	},
	fillSelfPieceRanges_ : function(message) {
		message.ranges_ = [];
		if (!this.context_.p2pUploadEnabled_ || !this.manager_.getEnviroment_().p2pUploadEnabled_) {
			var littleRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
			littleRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
			littleRange.start_ = 0;
			littleRange.count_ = 1;
			message.ranges_.push(littleRange);
			return;
		}

		var lastTnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
		var lastPnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();

		lastTnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
		lastTnRange.start_ = -1;
		lastTnRange.count_ = 0;
		lastPnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
		lastPnRange.start_ = -1;
		lastPnRange.count_ = 0;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				var lastRange = (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? lastTnRange : lastPnRange;
				if (piece.completedTime_ <= 0) {
					// complete
					if (lastRange.start_ >= 0) {
						message.ranges_.push(lastRange);
						if (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) {
							lastTnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
							lastTnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
							lastTnRange.start_ = -1;
							lastTnRange.count_ = 0;
						} else {
							// lastPnRange
							lastPnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
							lastPnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
							lastPnRange.start_ = -1;
							lastPnRange.count_ = 0;
						}
					}
					continue;
				}
				if (lastRange.start_ < 0) {
					lastRange.start_ = piece.id_;
				}
				lastRange.count_ = Math.max(0, piece.id_ - lastRange.start_) + 1;
			}
		}
		if (lastTnRange.start_ >= 0) {
			message.ranges_.push(lastTnRange);
		}
		if (lastPnRange.start_ >= 0) {
			message.ranges_.push(lastPnRange);
		}
		this.selfRanges_ = "";
		for ( var n = 0; n < message.ranges_.length; n++) {
			var range = message.ranges_[n];
			if (range.type_ == 0) {
				var end = range.start_ + range.count_ - 1;
				this.selfRanges_ += "type:" + range.type_ + ",start:" + range.start_ + ",end:" + end + ",count:" + range.count_ + "\n";
			}
		}
	},

	resetPeerMessage_ : function(nowTime, resetSpeed, peer) {
		// send clean message
		var message = new p2p$.com.webp2p.protocol.base.Message();
		var cleanRequest = new p2p$.com.webp2p.protocol.base.RequestDataItem();
		cleanRequest.pieceId_ = -1;
		message.requests_.push(cleanRequest);
		peer.lastSegmentId_ = -1;
		peer.pendingRequestCount_ = 0;
		if (resetSpeed) {
			peer.lastReceiveSpeed_ = 0;
		}
		peer.totalSendRequests_ = peer.totalReceiveResponses_;
		peer.lastTimeoutTime_ = peer.activeTime_ = nowTime;
		peer.session_.send(message);
	},

	checkTimeoutPeers_ : function(nowTime) {
		var expireTime = nowTime - this.peerReceiveTimeout_;
		if (this.metaData_.p2pGroupId_ == "") {
			expireTime += (this.peerReceiveTimeout_ / 2);
		}
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var item = this.stablePeers_[n];
			if (item.pendingRequestCount_ <= 0) {
				continue;
			}
			if ((item.activeTime_ >= expireTime) && (item.lastSegmentId_ < 0 || item.lastSegmentId_ >= this.urgentSegmentId_)) {
				// all pending downloads before urgent segment should be clear
				continue;
			}

			item.timeoutTimes_++;

			P2P_ULOG_INFO(P2P_ULOG_FMT(
					"logic::base::Channel [{0}]Peer stable blocked {1} times, peer id({2}), address({3}),lastSegment({4}),urgentSegment({5}),isTiemout({6})",
					p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), item.timeoutTimes_, item.session_.getRemoteId_(), item.session_
							.getRemoteAddress_(), item.lastSegmentId_, this.urgentSegmentId_, (item.activeTime_ < expireTime ? "true" : "false")));

			this.resetPieceReceivingBySession_(item.sessionId_);
			this.resetPeerMessage_(nowTime, false, item);
		}

		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.receivePiece_.receiveStartTime_ <= 0) {
				continue;
			}

			if (item.receivePiece_.receiveStartTime_ + this.peerReceiveTimeout_ > nowTime) {
				continue;
			}

			// timeout
			item.lastReceiveSpeed_ = 0;
			item.timeoutTimes_++;
			item.lastTimeoutTime_ = nowTime;
			item.receivePiece_.receiveStartTime_ = 0;
			item.receivePiece_.receiveByOther_ = false;

			// release piece mark
			var segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.receivePiece_.type_, item.receivePiece_.id_);
			if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
				continue;
			}
			var segment = this.metaData_.segments_[segmentIndex];
			var pieceIndex = segment.getPieceIndex_(item.receivePiece_.type_, item.receivePiece_.id_);
			if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
				continue;
			}
			var piece = segment.pieces_[pieceIndex];
			piece.receiveStartTime_ = 0;
			piece.receiveSessionId_ = 0;
			piece.receiveByOther_ = false;

			P2P_ULOG_INFO(P2P_ULOG_FMT(
					"logic::base::Channel [{0}]Peer timeout {1} times, peer({2}://{3}), address({4}), segment id({5}), piece type({6}), id({7}), {8}/{9}", this
							.getTypeName_(), item.timeoutTimes_, item.session_.getTypeName_(), item.session_.getRemoteId_(), item.session_.getRemoteAddress_(),
					segment.id_, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.receivePiece_.type_), item.receivePiece_.id_, (piece.index_ + 1),
					segment.pieces_.length));
		}
	},

	checkTimeoutPieces_ : function(nowTime) {
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			if (segment.id_ < this.urgentSegmentId_ || segment.completedTime_ > 0) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0 || // already complete
				!piece.receiveByStable_ || // not receving
				piece.receiveStartTime_ <= 0 || // not receving by stable
				(piece.receiveStartTime_ + this.peerReceiveTimeout_ > nowTime)) // not timeout yet
				{
					continue;
				}

				// timeout
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel [{0}]Piece stable timeout, channel://{1}/{2}/{3}/{4}, {5}/{6}, release",
						p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), this.id_, segment.id_, piece.getTypeName_(), piece.id_,
						(piece.index_ + 1), segment.pieces_.legnth));
				piece.receiveByStable_ = false;
				piece.receiveStartTime_ = 0;
				piece.receiveSessionId_ = 0;
			}
		}
	},

	checkPeerPieceRanges_ : function(nowTime) {
		var minInterval = this.context_.p2pShareRangeInterval_ * 1000;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.lastRangeExchangeTime_ + minInterval > nowTime) {
				continue;
			}

			if (!this.selfRangesMessage_.ranges_.length == 0) {
				item.lastRangeExchangeTime_ = nowTime;
				item.statSendMessage_(this.selfRangesMessage_);
				item.session_.send(this.selfRangesMessage_);
			}
		}
	},

	resetPieceReceivingBySession_ : function(sessionId) {
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.completedTime_ > 0) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				if (piece.receiveSessionId_ == sessionId) {
					piece.receiveByStable_ = false;
					piece.receiveByOther_ = false;
					piece.receiveStartTime_ = 0;
					piece.receiveSessionId_ = 0;
				}
			}
		}
	},

	getStorageBucket_ : function() {
		return p2p$.com.webp2p.core.storage.Pool.getDefaultBucket_();
	},

	resetSegmentPieceCompletion_ : function(segmentId) {
		var segmentIndex = this.metaData_.getSegmentIndexById_(segmentId);
		if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel::Reset segment piece completion find segment({0}) failed", segmentId));
			return false;
		}
		var segment = this.metaData_.segments_[segmentIndex];
		segment.resetPieceCompletion_();
		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::base::Channel::Reset segment piece completion reset segment({0}) success", segmentId));
		return true;
	},

	processMessageResponses_ : function(nowTime, peer, message) {
		var updatePieceCount = 0;
		var invalidPieces = 0;
		var bucket = this.getStorageBucket_();
		var session = peer.session_;

		// responses: update storage data
		for ( var n = 0; n < message.responses_.length; n++) {
			var item = message.responses_[n];
			if (item.pieceId_ < 0) {
				// empty response
				// waiting schedule
				break;
			}

			var segmentIndex = -1;
			if (item.segmentId_ >= 0) {
				segmentIndex = this.metaData_.getSegmentIndexById_(item.segmentId_);
			} else {
				segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
			}
			if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel [{0}]Response piece from session({1}://{2}) segment not found for channel({3}), "
						+ "segment idx({4}), piece type({5}), id({6}), drop it!", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session
						.getTypeName_(), session.getRemoteAddress_(), this.id_, segmentIndex, p2p$.com.webp2p.core.common.Enum
						.getPieceTypeName_(item.pieceType_), item.pieceId_));
				invalidPieces++;
				peer.totalInvalidErrors_++;
				continue;
			}

			var segment = this.metaData_.segments_[segmentIndex];
			var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
			if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel", "[{0}]Response piece from session({1}://{2}) piece not found for channel({3}), "
						+ "segment idx({4}), piece type({5}), id({6}), idx({7}), drop it!", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_),
						session.getTypeName_(), session.getRemoteAddress_(), this.id_, segmentIndex, p2p$.com.webp2p.core.common.Enum
								.getPieceTypeName_(item.pieceType_), item.pieceId_, pieceIndex));
				invalidPieces++;
				peer.totalInvalidErrors_++;
				continue;
			}
			// verify checksum
			var piece = segment.pieces_[pieceIndex];
			piece.receiveByStable_ = false;
			piece.receiveStartTime_ = 0;
			if (item.data_.length == 0) {
				// empty response, mark piece not exists
				// peer.setPieceMark_(piece.type_, piece.id_, false);
				continue;
			}
			if ((piece.size_ > 0 && item.data_.length != piece.size_) || !this.metaData_.verifyPiece_(piece, item.data_, item.data_.length)) {
				// checksum check failed
				P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel [{0}]Verify piece size/checksum failed from session({1}://{2}), peer id({3}), "
						+ "segment({4}), piece type({5}), id({6}), size({7}/{8})", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session
						.getTypeName_(), session.getRemoteAddress_(), session.getRemoteId_(), segment.id_, p2p$.com.webp2p.core.common.Enum
						.getPieceTypeName_(piece.type_), piece.id_, item.data_.length, piece.size_));
				peer.lastReceiveSpeed_ = 0; // reset speed
				peer.totalInvalidErrors_++;
				peer.setPieceInvalid_(piece.type_, piece.id_, true);
				invalidPieces++;
				if (!(piece.size_ > 0 && item.data_.length != piece.size_)) {
					peer.totalChecksumErrors_++;
				}
				this.reportTraffic_.addChecksumErrors_(this.reportClient_, session.getType(), 0, 1);
				// asyncSchedule(true);
				continue;
			}
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::base::Channel [{0}]Received piece from {1}://{2}, {3}/{4}/{5}/{6}, {7}/{8}, peer id({9})",
			// p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session.getTypeName_(), session.getRemoteAddress_(), this.id_, segment.id_,
			// p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(piece.type_), piece.id_, (pieceIndex + 1), segment.pieces_.length, session
			// .getRemoteId_()));

			var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
			if (!bucket.exists(objectId)) {
				if (segment.completedPieceCount_ > 0) {
					updatePieceCount++;
					segment.resetPieceCompletion_();
				}
			}

			if (segment.size_ > 0) {
				bucket.reserve(objectId, segment.size_);
			} else if (segment.size_ == 0 && segment.pieces_.length == 1) {
				bucket.reserve(objectId, item.data_.length);
			}
			if (!bucket.write(objectId, piece.offset_, item.data_, item.data_.length)) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel [{0}]Write piece to storage({1}) failed from session({2}://{3}), peer id({4}), "
						+ "segment({5}), piece type({6}), id({7}), size({8}/{9})", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), bucket
						.getName_(), session.getTypeName_(), session.getRemoteAddress_(), session.getRemoteId_(), segment.id_, p2p$.com.webp2p.core.common.Enum
						.getPieceTypeName_(piece.type_), piece.id_, item.data_.length, piece.size_));
				bucket.remove(objectId);
				segment.resetPieceCompletion_();
				// service_.post(boost::bind(&Channel::onError_, shared_from_this(), core::common::kErrorInternalError, "Write data to storage failed"));
				continue;
			}
			piece.writeTimes_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			peer.lastSegmentId_ = peer.lastSegmentId_ > segment.id_ ? peer.lastSegmentId_ : segment.id_;
			if (this.mediaStartTime_ <= 0) {
				this.mediaStartTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			}

			piece.receiveSessionId_ = 0;
			if (piece.recvTimes_++ < 1) {
				// stat, avoid duplicated data
				var isUrgent = (this.urgentSegmentId_ < 0 || this.urgentSegmentEndId_ < 0)
						|| (segment.id_ >= this.urgentSegmentId_ && segment.id_ <= this.urgentSegmentEndId_);
				updatePieceCount++;
				piece.completedTime_ = nowTime;
				piece.receiveProtocol_ = session.getType();
				peer.statReceiveData_(1, item.data_.length);
				this.statData_.addReceiveData_(isUrgent, session.getType(), 1, item.data_.length);
				this.reportTraffic_.addDownloadSize_(this.reportClient_, session.getType(), session.getTerminalType_(), item.data_.length);
				if (this.statData_.firstPieceFetchTime_ <= 0) {
					this.statData_.firstPieceFetchTime_ = nowTime - this.createTime_;
				}
				this.updateStatSyncSpeeds_();

				if (!this.firstReceivePieceReported_) {
					this.firstReceivePieceReported_ = true;
					this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionFirstPiece,
							p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, session.getRemoteAddress_(), nowTime - this.createTime_);
				}
				if (!this.p2pFirstPieceReported_ && !session.isStable_()) {
					this.p2pFirstPieceReported_ = true;
					this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionFirstP2pPiece,
							p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, session.getRemoteAddress_(), nowTime - this.createTime_);
				}

				// notify
				// eventListener_.onChannelDataComplete(*this, segment.id_, piece.index_);
			}

			segment.lastActiveTime_ = nowTime;
			if (segment.size_ <= 0) {
				segment.size_ = item.data_.length;
			}
			segment.checkPieceCompletion_();
			if (segment.completedTime_ > 0) {
				this.completedSegmentId_ = this.completedSegmentId_ > segment.id_ ? this.completedSegmentId_ : segment.id_;
				this.statData_.totalReceiveDuration_ += segment.duration_;
				// asyncSchedule(true);
			}
		}

		if (message.responses_.length > 0) {
			peer.timeoutTimes_ = 0;
			var pendingRequestCount = peer.pendingRequestCount_ - message.responses_.length;
			peer.pendingRequestCount_ = 0 > pendingRequestCount ? 0 : pendingRequestCount;
			peer.receivePiece_.receiveStartTime_ = 0;
			peer.updateSpeed_(nowTime);
		}
		return updatePieceCount;
	},

	updateStatSyncSpeeds_ : function() {
		// var update = this.manager_.getEnviroment_().getSyncDataStateItem(this.syncStateIndex_);
		// if( update )
		// {
		// update->urgentReceiveSpeed_ = statData_.urgentReceiveSpeed_;
		// update->lastReceiveSpeed_ = statData_.lastReceiveSpeed_;
		// }
	},

	updatePeersSpeed_ : function(nowTime, peers) {
		for ( var n = 0; n < peers.length; n++) {
			var peer = peers[n];
			peer.updateSpeed_(nowTime);
		}
	},

	getNextIdleStablePeer_ : function() {
		var result = null;
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var item = this.stablePeers_[n];
			if (item.pendingRequestCount_ <= 0) {
				result = item;
				break;
			}
		}
		return result;
	},

	getUrgentMaxDuration_ : function(ratio) {
		var maxDuration = this.context_.p2pUrgentSize_ * ratio;
		if (this.urgentSegmentIndex_ >= 0 && this.urgentSegmentIndex_ < this.metaData_.segments_.length
				&& this.urgentSegmentIndex_ + 1 < this.metaData_.segments_.length) {
			// at least 2 segment(s)
			var segment1 = this.metaData_.segments_[this.urgentSegmentIndex_];
			var segment2 = this.metaData_.segments_[this.urgentSegmentIndex_ + 1];
			if (maxDuration <= segment1.duration_) {
				maxDuration = segment1.duration_ + segment2.duration_;
				// P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}+{1}={2}",segment1.duration_,segment2.duration_,maxDuration));
			}
		}
		return maxDuration;
	},

	requireSegmentData_ : function(requestSegmentId, urgentSegmentId) {
		var segmentId = requestSegmentId;
		this.updateActiveTime_(true);
		this.mediaActiveTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.playerStartTime_ <= 0) {
			this.playerStartTime_ = this.mediaActiveTime_;
		}
		// if (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod == this.type_ && urgentId >= 0 && playerSkipPosition_ > 0 &&
		// !playerBufferingSkipped_) {
		if (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod == this.type_) {
			// from player
			var segment = this.metaData_.getSegmentById_(segmentId);
			if (segment != null) {
				// if( segment.id_ > playerSkipBeginSegmentId_ && segment.id_ < playerSkipEndSegmentId_ )
				// {
				// skip to update urgent segment
				// P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel", "Require segment data, but player buffer skipped"));
				// playerBufferingSkipped_ = true;
				// return true;
				// }
			}
		}
		// if( urgentId >= 0 )
		// {
		this.updateUrgentSegment_(urgentSegmentId);
		// }
		if (this.metaData_.segments_.length <= 0) {
			// not load yet
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic.base.Channel:requireSegmentData_ Segment({0}) not load yet", segmentId));
			return null;
		}

		var segment = this.metaData_.getSegmentById_(segmentId);
		if (segment == null) {
			this.segmentNotFoundTimes_++;
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic.base.Channel:requireSegmentData_ Segment({0}) Not Found", segmentId));
			return null;
		}
		// if( urgentId >= 0 && !segment->advertMonitorUrl_.empty() && !segment->advertMonitorReported_ )
		// {
		// // from player advert item, report
		// const json::Value &constParams = globalParams_;
		// tools::collector::AdvertStage stage;
		// stage.orginalUrl_ = segment->advertMonitorUrl_;
		// stage.cuid_ = constParams["cuid"].asString();
		// stage.uuid_ = constParams["uuid"].asString();
		// reportClient_->send(stage);
		//
		// segment->advertMonitorReported_ = true;
		// }

		var bucket = this.getStorageBucket_();
		var objectId = this.metaData_.getSegmentStorageId_(segmentId);
		var objectExists = bucket.exists(objectId);
		var retStream = null;
		if (segment.completedTime_ > 0 && objectExists) {
			retStream = bucket.read(objectId, 0);
			segment.lastPlayTime_ = this.activeTime_;
			this.statData_.totalPlayedDuration_ += segment.duration_;
			for ( var n = 0; n < segment.pieces_.length; n++) {
				var piece = segment.pieces_[n];
				piece.playedTime_ = this.activeTime_;
				this.statData_.totalPlayedPieces_++;
				this.statData_.totalPlayedBytes_ += piece.size_;
			}
		} else {
			if (segment.completedTime_ > 0 && !objectExists) {
				// has been clearExpiredBlock
				// need resetPieceCompletion_
				segment.resetPieceCompletion_();
				this.fillSelfPieceRanges_(this.selfRangesMessage_);
			}
			// need re download
			this.onSchedule_(false);
		}
		return {
			segment : segment,
			stream : retStream
		};
	},
	setFirstSeekTime_ : function(firstseektime) {
		this.firstSeekTime_ = firstseektime;
	},
	updateUrgentSegment_ : function(requireId) {
		this.urgentSegmentId_ = requireId;
	},

	onProtocolSelectorOpen_ : function(errorCode) {
		if (this.protocolPool_ == null || !this.protocolPool_.isValid_()) {
			// already closed
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel [{0}]Protocol selector({1}) open, channel({2}), code({3}), {4}", p2p$.com.webp2p.core.common.Enum
				.getMetaTypeName_(this.type_), this.context_.selectorServerHost_, this.id_, errorCode,
				(this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) ? "FAILED" : "OK"));

		if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == errorCode) {
			// report only open successfully
			if (!this.selectorReported_ && this.context_.selectorConnectedTime_ > 0) {
				this.selectorReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionSelectorConnected, 0,
						this.context_.selectorServerHost_, this.context_.selectorConnectedTime_);

				// update gather and websocket trakcer info
				var url = new p2p$.com.webp2p.core.supernode.Url();
				url.fromString_(this.context_.trackerServerHost_);
				this.reportTraffic_.trackerServerIp_ = url.host_;
				this.reportTraffic_.trackerServerPort_ = url.port_;

				// update webrtc server info
				var url2 = new p2p$.com.webp2p.core.supernode.Url();
				url2.fromString_(this.context_.webrtcServerHost_);
				this.reportTraffic_.webrtcServerIp_ = url2.host_;
				this.reportTraffic_.webrtcServerPort_ = url2.port_;

				// update stun server info
				var url3 = new p2p$.com.webp2p.core.supernode.Url();
				url3.fromString_(this.context_.stunServerHost_);
				this.reportTraffic_.stunServerIp_ = url3.host_;
				this.reportTraffic_.stunServerPort_ = url3.port_;

			}
		}
	},

	onProtocolSessionOpen_ : function(session) {
		if (this.protocolPool_ == null /* || !protocolPool_->isValid_() */) {
			// already closed
			return;
		}

		// add gather report
		// tools::collector::ClientStage protocolStage;
		// if( !rtmfpGatherReported_ && session.getType() == protocol::base::Manager::kProtocolTypeRtmfp && context_.gatherServerConnectedTime_ > 0 )
		// {
		// rtmfpGatherReported_ = true;
		// reportClient_->sendClientStage_(tools::collector::ClientStage::kActionGatherConnected, 0,
		// context_.gatherServerHost_, context_.gatherServerConnectedTime_);
		// }

		var peer = null;// = new p2p$.com.webp2p.logic.base.Peer();
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		session.updateTerminalType_();

		// bool alreadyExists = false;
		var sameTypeCount = 0;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				peer = item;
			}
			if (item.session_ && item.session_.getType() == session.getType()) {
				sameTypeCount++;
			}
		}
		//
		if (peer != null) {
			// reset peer timeout
			peer.timeoutTimes_ = 0;
		} else {
			sameTypeCount++;
			peer = new p2p$.com.webp2p.logic.base.Peer();
			peer.session_ = session;
			peers.push(peer);
		}
		peer.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		if (!session.isStable_()) {
			this.reportTraffic_.updateSessions_(this.reportClient_, session.getType(), sameTypeCount);
		}

		// tell him my piece ranges
		if (!this.selfRangesMessage_.empty() && this.manager_.getEnviroment_().p2pEnabled_ && !session.isStable_()) {
			peer.statSendMessage_(this.selfRangesMessage_);
			session.send(this.selfRangesMessage_);
			this.lastPieceShareInUpdateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		}
		this.onSchedule_(!session.isStable_());
	},

	onProtocolSessionMessage_ : function(session, message) {
		// P2P_ULOG_INFO("message.length:"+message.responses_.length);

		if (this.protocolPool_ == null /* || !protocolPool_->isValid_() */) {
			// already closed
			return;
		}
		if (session == null) {
			P2P_ULOG_INFO("session == null");
		}
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::base::Channel [{0}]Protocol session message for from({1}://{2}/{3}) channel({4}), "
		// + "{5} range(s), {6} request(s), {7} response(s)", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session.getTypeName_(),
		// session.getRemoteAddress_(), session.getRemoteId_(), this.id_, message.ranges_.length, message.requests_.length, message.responses_.length));

		// onProtocolSessionAccept(session);
		var updatePieceCount = 0;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		// update terminate type if terminate type not confirmed
		// session.updateTerminalType_();

		var peer = null;
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				peer = item;
				break;
			}
		}

		if (peer == null) {
			// peer not registered, ignore
			return;
		}
		peer.activeTime_ = nowTime;
		peer.statReceiveMessage_(message);

		var rangeUpdateCount = 0;
		if (message.ranges_.length > 0) {
			// ranges: update bitmap
			rangeUpdateCount = this.processMessageRanges_(nowTime, peer, message);
		}
		//
		var uploadable = (this.urgentIncompleteCount_ <= 0 || this.context_.p2pUrgentUploadEnabled_);
		if (this.manager_.getEnviroment_().p2pEnabled_ && uploadable && !message.requests_.length == 0) {
			this.processMessageRequests_(nowTime, peer, message);
		}
		//
		if (message.responses_.length > 0) {
			updatePieceCount += this.processMessageResponses_(nowTime, peer, message);
		}
		//
		// if( updatePieceCount > 0 )
		// {
		this.fillSelfPieceRanges_(this.selfRangesMessage_);
		// }
		//
		if ((rangeUpdateCount > 0 && (this.lastMessageUpdateTime_ + 300 * p2p$.com.webp2p.core.common.Global.kMicroUnitsPerMilli < nowTime))
				|| message.responses_.length > 0) {
			lastMessageUpdateTime_ = nowTime;
			this.onSchedule_(!session.isStable_());
		}
	},

	processMessageRequests_ : function(nowTime, peer, message) {
		// requests: get piece
		var totalResponsedSize = 0;
		var responseMessage = new p2p$.com.webp2p.protocol.base.Message();
		var bucket = this.getStorageBucket_();
		var session = peer.session_;

		// responseMessage.responses_.resize(message.requests_.size());
		for ( var n = 0; n < message.requests_.length; n++) {
			var item = message.requests_[n];
			var responseItem = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
			responseMessage.responses_.push(responseItem);
			responseItem.pieceId_ = item.pieceId_;
			responseItem.pieceType_ = item.pieceType_;

			do {
				var segmentIndex = -1;
				if (item.segmentId_ >= 0) {
					segmentIndex = this.metaData_.getSegmentIndexById_(item.segmentId_);
				} else {
					segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
				}
				if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request piece from session(%s://%s) segment not found for channel(%s), "
					// "segment idx(%d), piece type(%s), id(" _I64FMT_ "), ignore it!"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), id_.c_str(),
					// (int)segmentIndex, core::common::getPieceTypeName_(item.pieceType_), item.pieceId_);
					break;
				}

				var segment = this.metaData_.segments_[segmentIndex];
				if (segment.p2pDisabled_) {
					// p2p disabled
					break;
				}

				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				var objectExists = bucket.exists(objectId);
				if (!objectExists) {
					if (segment.completedPieceCount_ > 0) {
						// expired, reset
						segment.resetPieceCompletion_();
						this.fillSelfPieceRanges_(this.selfRangesMessage_);
					}
					break;
				}

				var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
				if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request piece from session(%s://%s) piece not found for channel(%s), "
					// "segment idx(%d), piece type(%s), id(" _I64FMT_ "), idx(%d), ignore it!"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), id_.c_str(),
					// (int)segmentIndex, core::common::getPieceTypeName_(item.pieceType_), item.pieceId_, (int)pieceIndex);
					break;
				}

				// verify checksum
				var piece = segment.pieces_[pieceIndex];
				// if( (piece.size_ > 0 && item.checksum_ != (size_t)piece.checksum_) || piece.completedTime_ <= 0 )
				if (piece.completedTime_ <= 0) {
					// checksum check failed
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request verify piece checksum/complete failed from session(%s://%s), peer
					// id(%s), "
					// "segment(" _I64FMT_ "), piece type(%s), id(" _I64FMT_ ")"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), session.getRemoteId_().c_str(),
					// segment.id_, core::common::getPieceTypeName_(piece.type_), piece.id_);
					break;
				}

				responseItem.segmentId_ = segment.id_;
				responseItem.pieceKey_ = piece.key_;
				if (piece.size_ <= 0) {
					// bucket.read(objectId, 0, responseItem.data_);
					break;
				} else {
					responseItem.data_ = bucket.read(objectId, piece.offset_, piece.size_);
				}
				totalResponsedSize += responseItem.data_.length;
			} while (false);
		}

		// if( !context_.p2pUploadLimit_ || !responseSchedule_ || !responseSchedule_->scheduleRequest(nowTime, peer, std::move(responseMessage),
		// (int)totalResponsedSize))
		// {
		this.statData_.addSendData_(session.getType(), responseMessage.responses_.length, totalResponsedSize);
		this.reportTraffic_.addUploadSize_(this.reportClient_, session.getType(), session.getTerminalType_(), totalResponsedSize);
		peer.statSendData_(responseMessage.responses_.length, totalResponsedSize);
		peer.statSendMessage_(responseMessage);
		session.send(responseMessage);
		// }

		return 0;
	},

	getOtherPeerRequestCount_ : function() {
		var requestCount = 0;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.receivePiece_.receiveStartTime_ <= 0) {
				continue;
			}
			requestCount++;
		}
		return requestCount;
	},

	getStablePeersSpeedTooSlow_ : function() {
		if (this.urgentSegmentIndex_ < 0 || this.urgentSegmentIndex_ >= this.metaData_.segments_.length) {
			return false;
		}

		var stableTooSlow = false;
		var firstSegment = this.metaData_.segments_[this.urgentSegmentIndex_];
		if (firstSegment.size_ > 0 && firstSegment.duration_ > 0) {
			var firstRate = firstSegment.size_ * 1000 / firstSegment.duration_;
			var thresoldRate = firstRate * this.context_.cdnSlowThresholdRate_;
			var fastStableSpeed = 0;
			for ( var n = 0; n < this.stablePeers_.length; n++) {
				var fastPeer = this.stablePeers_[n];
				if (fastPeer.pendingRequestCount_ > 0) {
					fastStableSpeed = fastPeer.lastReceiveSpeed_;
					break;
				}
			}
			if (fastStableSpeed >= 0 && fastStableSpeed < thresoldRate) {
				stableTooSlow = true;
			}
		}

		return stableTooSlow;
	},

	updateUrgentIncompleteCount_ : function() {
		this.urgentIncompleteCount_ = 0;
		if (this.urgentSegmentIndex_ < 0 || this.urgentSegmentIndex_ >= this.metaData_.segments_.length) {
			return;
		}

		var maxDuration = this.context_.p2pUrgentSize_ * 1000;
		var totalDuration = 0;
		var urgentCount = 0;
		for ( var n = this.urgentSegmentIndex_; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.completedTime_ <= 0) {
				this.urgentIncompleteCount_++;
			}
			totalDuration += segment.duration_;
			urgentCount++;
			if (urgentCount > 1 && totalDuration >= maxDuration) {
				// urgent should has 2 segments at least if more segments eixst
				break;
			}
		}
	},

	getNextIdleOtherPeer_ : function(pieceType, pieceId) {
		var result = null;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.timeoutTimes_ > 5) {
				continue;
			}

			if (item.receivePiece_.receiveStartTime_ <= 0 && item.hasPiece_(pieceType, pieceId)) {
				result = item;
				break;
			}
		}
		return result;
	},

	processMessageRanges_ : function(nowTime, peer, message) {
		var rangeUpdateCount = 0;
		var session = peer.session_;

		// clean old bitmap status
		peer.tnPieceMark_.clear(true);
		peer.pnPieceMark_.clear(true);
		peer.selfRanges_ = "";
		for ( var n = 0; n < message.ranges_.length; n++) {
			var range = message.ranges_[n];
			if (range.type_ == 0) {
				var end = range.start_ + range.count_ - 1;
				peer.selfRanges_ += "type:" + range.type_ + ",start:" + range.start_ + ",end:" + end + ",count:" + range.count_ + "\n";
			}

			var bitmap = (range.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? peer.tnPieceMark_ : peer.pnPieceMark_;
			var maxBits = p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
			for ( var index = range.start_, count = 0; count < range.count_ && count <= maxBits; index++, count++) {
				var old = bitmap.setValue(index, true);
				if (!old) {
					rangeUpdateCount++;
				}
			}
		}
		if (this.manager_.getEnviroment_().p2pEnabled_ && message.ranges_.length != 0
				&& (peer.lastRangeExchangeTime_ + this.context_.p2pShareRangeInterval_ * 1000 < nowTime)) {
			if (!this.selfRangesMessage_.empty()) {
				peer.lastRangeExchangeTime_ = nowTime;
				peer.statSendMessage_(this.selfRangesMessage_);
				session.send(this.selfRangesMessage_);
			}
		}
		if (rangeUpdateCount > 0 && this.lastPieceShareInUpdateTime_ + 2000 < nowTime) {
			this.lastPieceShareInUpdateTime_ = nowTime;
			this.updateMetaPieceShareInRanges_(true);
		}

		return rangeUpdateCount;
	},

	updateMetaPieceShareInRanges_ : function(startFromUrgent) {
		var startIndex = startFromUrgent ? ((this.urgentSegmentIndex_ < 0) ? 0 : this.urgentSegmentIndex_) : 0;
		for ( var n = startIndex; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				piece.shareInRanges_ = 0;
				for ( var j = 0; j < this.otherPeers_.length; j++) {
					var peer = this.otherPeers_[j];
					if (peer.hasPiece_(piece.type_, piece.id_)) {
						piece.shareInRanges_++;
					}
				}
			}
		}
	},

	getTypeName_ : function() {
		return p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_);
	},

	onProtocolManagerOpen_ : function(mgr, errorCode) {
		if (this.protocolPool_ == null || !this.protocolPool_.isValid_()) {
			// already closed
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel::[{0}] Protocol manager({1}://{2}) open, channel({3}), code({4}), {5}",
				p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), mgr.getTypeName_(), mgr.getId_(), this.id_, errorCode,
				(this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) ? "try open after 10 seconds..." : "OK"));

		if (this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) {
			// this.setProtocolTimeout_(mgr, 10 * 1000);
		}

		// report only open successfully
		if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == errorCode) {
			if (!this.rtmfpServerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp
					&& this.context_.rtmfpServerConnectedTime_ > 0) {
				this.rtmfpServerReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionRtmfpConnected, 0,
						this.context_.rtmfpServerHost_, this.context_.rtmfpServerConnectedTime_);
			}
			if (!this.cdeTrackerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket
					&& this.context_.trackerServerConnectedTime_ > 0) {
				this.cdeTrackerReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionCdeTrackerConnected, 0,
						this.context_.trackerServerHost_, this.context_.trackerServerConnectedTime_);
			}
			if (!this.webrtcServerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc
					&& this.context_.webrtcServerConnectedTime_ > 0) {
				this.webrtcServerReported_ = true;

				var url = new p2p$.com.webp2p.core.supernode.Url();
				url.fromString_(this.context_.webrtcServerHost_);
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionWebrtcConnected, 0, url.host_ + ":" + url.port_,
						this.context_.webrtcServerConnectedTime_);
			}
		}
	},

	onProtocolSessionClose_ : function(session) {
		if (this.protocolPool_ == null || session == null) {
			// already closed
			return;
		}

		var erased = false;
		var sameTypeCount = 0;
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				erased = true;
				this.resetPieceReceivingBySession_(item.sessionId_);
				peers.splice(n--, 1);
			} else {
				if (item.session_ && item.session_.getType() == session.getType()) {
					sameTypeCount++;
				}
			}
		}

		if (erased) {
			// this.updateMetaPieceShareInRanges_(true);
			if (!session.isStable_()) {
				this.reportTraffic_.updateSessions_(this.reportClient_, session.getType(), sameTypeCount);
			}
		}
	},

	getActiveTime_ : function() {
		return this.activeTime_;
	},//

	getMaxSleepTime_ : function() {
		return this.maxSleepTime_;
	},

	getChannelUrl_ : function() {
		return this.metaData_.channelUrl_;
	},

	getMaxSilentTime_ : function() {
		return this.maxSilentTime_;
	},

	p2pIsReady_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pIsReady_();
		}
		return false;
	},

	p2pisActive_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pisActive_();
		}
		return false;
	},

	p2pDeactive_ : function() {
		this.otherPeers_ = [];
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pDeactive_();
		}
		return false;
	},

	p2pActivate_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pActivate_();
		}
		return false;
	}
});p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.PeerStatic = {
	nextSessionId_ : 0,
};
p2p$.com.webp2p.logic.base.Peer = CdeBaseClass.extend_({

	session_ : null,
	tnPieceMark_ : null,
	pnPieceMark_ : null,
	tnPieceInvalid_ : null,
	pnPieceInvalid_ : null,

	activeTime_ : 0,
	lastTimeoutTime_ : 0,
	totalSendBytes_ : 0,
	totalSendPieces_ : 0,
	totalReceiveBytes_ : 0,
	totalReceivePieces_ : 0,
	totalSendSpeed_ : 0,
	totalReceiveSpeed_ : 0,
	totalChecksumErrors_ : 0,
	totalInvalidErrors_ : 0,
	lastSendTime_ : 0,
	lastReceiveTime_ : 0,
	lastSendSpeed_ : 0,
	lastReceiveSpeed_ : 0,

	totalSendRanges_ : 0,
	totalSendRequests_ : 0,
	totalSendResponses_ : 0,
	totalReceiveRanges_ : 0,
	totalReceiveRequests_ : 0,
	totalReceiveResponses_ : 0,
	lastSendStartBytes_ : 0,
	lastReceiveStartBytes_ : 0,
	lastReceiveStartTime_ : 0,
	lastRangeExchangeTime_ : 0,

	sessionId_ : 0,
	lastSegmentId_ : 0,
	maxQuotaPieces_ : 0,
	timeoutTimes_ : 0,
	praisedTimes_ : 0,
	pendingRequestCount_ : 0,
	scheduleLocked_ : false,
	receivePiece_ : null,
	streamMark_ : 0,
	streamAvaiable_ : false,
	streamDetected_ : false,
	streamUploading_ : false,
	selfRanges_ : "",

	init : function() {
		this.sessionId_ = ++p2p$.com.webp2p.logic.base.PeerStatic.nextSessionId_;
		if (this.sessionId_ <= 0) {
			this.sessionId_ = p2p$.com.webp2p.logic.base.PeerStatic.nextSessionId_ = 1;
		}
		this.receivePiece_ = new p2p$.com.webp2p.core.supernode.MetaPiece();
		this.activeTime_ = 0;
		this.lastTimeoutTime_ = 0;
		this.totalSendBytes_ = 0;
		this.totalSendPieces_ = 0;
		this.totalReceiveBytes_ = 0;
		this.totalReceivePieces_ = 0;
		this.totalSendSpeed_ = 0;
		this.totalReceiveSpeed_ = 0;
		this.totalChecksumErrors_ = 0;
		this.totalInvalidErrors_ = 0;
		this.lastSendTime_ = 0;
		this.lastReceiveTime_ = 0;
		this.lastSendSpeed_ = 0;// used by peer upload schedule
		this.lastReceiveSpeed_ = -1;
		this.lastSegmentId_ = -1;
		this.maxQuotaPieces_ = 2;
		this.timeoutTimes_ = 0;
		this.praisedTimes_ = 0;
		this.pendingRequestCount_ = 0;

		this.totalSendRanges_ = 0;
		this.totalSendRequests_ = 0;
		this.totalSendResponses_ = 0;
		this.totalReceiveRanges_ = 0;
		this.totalReceiveRequests_ = 0;
		this.totalReceiveResponses_ = 0;

		this.lastSendStartBytes_ = 0;
		this.lastReceiveStartBytes_ = 0;
		this.lastReceiveStartTime_ = 0;
		this.lastRangeExchangeTime_ = 0;
		this.scheduleLocked_ = false;

		this.streamMark_ = -1;
		this.streamDetected_ = false;
		this.streamAvaiable_ = false;
		this.streamUploading_ = false;
		this.tnPieceMark_ = new p2p$.com.webp2p.core.supernode.Bitmap();
		this.pnPieceMark_ = new p2p$.com.webp2p.core.supernode.Bitmap();
		this.tnPieceInvalid_ = new p2p$.com.webp2p.core.supernode.Bitmap();
		this.pnPieceInvalid_ = new p2p$.com.webp2p.core.supernode.Bitmap();
		this.selfRanges_ = "";
	},

	hasPiece_ : function(type, id) {
		var bitmap = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceMark_ : this.pnPieceMark_;
		var invalid = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceInvalid_ : this.pnPieceInvalid_;

		if (invalid.getValue(id)) {
			// already invalid
			return false;
		}
		// if(bitmap.data_.length > Math.floor(id / 8))
		// {
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("com.webp2p.logic.base.Peer::Ptype({0}),pip({1}),sessionId({2}),remoteId({3}),data.length({4}),index({5})",
		// type,id,this.sessionId_,this.session_.remoteId_,bitmap.data_.length,Math.floor(id / 8)));
		// }
		return bitmap.getValue(id);
	},

	setPieceMark_ : function(type, id, on) {
		var mark = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceMark_ : this.pnPieceMark_;
		mark.setValue(id, on);
	},

	setPieceInvalid_ : function(type, id, on) {
		var invalid = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceInvalid_ : this.pnPieceInvalid_;
		invalid.setValue(id, on);
	},

	updateSpeed_ : function(nowTime) {
		var speed = this.session_.getUpdateReceiveSpeed_(nowTime, this.pendingRequestCount_ > 0);
		if (speed >= 0) {
			this.lastReceiveSpeed_ = speed;
		}
	},

	statSendMessage_ : function(message) {
		this.totalSendRanges_ += (message.ranges_.length == 0 ? 0 : 1);
		this.totalSendRequests_ += message.requests_.length;
		this.totalSendResponses_ += message.responses_.length;
	},

	statSendData_ : function(pieces, bytes) {
		this.lastSendStartBytes_ = this.totalSendBytes_;
		this.totalSendBytes_ += bytes;
		this.totalSendPieces_ += pieces;
		this.lastSendTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
	},

	// statSendData_:function( bytes ) {
	//		
	// },

	statReceiveBegin_ : function() {
		this.lastReceiveStartBytes_ = this.totalReceiveBytes_;
		this.lastReceiveStartTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
	},

	statReceiveEnd_ : function() {
		this.lastReceiveStartTime_ = 0;
	},

	statReceiveMessage_ : function(message) {
		this.totalReceiveRanges_ += message.ranges_.length;
		this.totalReceiveRequests_ += message.requests_.length;
		this.totalReceiveResponses_ += message.responses_.length;
	},

	statReceiveData_ : function(pieces, bytes) {
		this.totalReceivePieces_ += pieces;
		this.statReceiveData2_(bytes);
	},

	statReceiveData2_ : function(bytes) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		this.totalReceiveBytes_ += bytes;
		this.lastReceiveTime_ = nowTime;
		if (this.lastReceiveStartTime_ > 0 && nowTime > this.lastReceiveStartTime_) {
			var sizeDiff = this.totalReceiveBytes_ - this.lastReceiveStartBytes_;
			this.lastReceiveSpeed_ = sizeDiff * 1000 / (nowTime - this.lastReceiveStartTime_);
		}
	}
});p2p$.ns('com.webp2p.logic.base');

p2p$.com.webp2p.logic.base.StatData = CdeBaseClass.extend_({
	totalSendPieces_ : 0,
	totalSendBytes_ : 0,
	totalReceivePieces_ : 0,
	totalReceiveBytes_ : 0,
	actualSendPieces_ : 0,
	actualSendBytes_ : 0,
	actualReceivePieces_ : 0,
	actualReceiveBytes_ : 0,
	urgentReceiveBytes_ : 0,
	lastReceiveBytes_ : 0,

	firstSendTime_ : 0,
	firstReceiveTime_ : 0,
	urgentReceiveBeginTime_ : 0,
	lastReceiveBeginTime_ : 0,

	avgSendSpeed_ : 0,
	avgReceiveSpeed_ : 0,
	urgentReceiveSpeed_ : 0,
	lastReceiveSpeed_ : 0,
	restrictedSendSpeed_ : 0,

	protocolSendPieces_ : null,
	protocolSendBytes_ : null,
	protocolSendSpeeds_ : null,
	protocolReceivePieces_ : null,
	protocolReceiveBytes_ : null,
	protocolReceiveSpeeds_ : null,

	shareSendRatio_ : 0,
	shareReceiveRatio_ : 0,
	firstPieceFetchTime_ : 0,

	totalReceiveDuration_ : 0,
	downloadedDuration_ : 0,
	totalPlayedBytes_ : 0,
	totalPlayedPieces_ : 0,
	totalPlayedDuration_ : 0,

	init : function() {
		this.totalSendPieces_ = 0;
		this.totalSendBytes_ = 0;
		this.actualSendPieces_ = 0;
		this.actualSendBytes_ = 0;
		this.totalReceivePieces_ = 0;
		this.totalReceiveBytes_ = 0;
		this.actualReceivePieces_ = 0;
		this.actualReceiveBytes_ = 0;
		this.urgentReceiveBytes_ = 0;
		this.lastReceiveBytes_ = 0;

		this.firstSendTime_ = 0;
		this.firstReceiveTime_ = 0;
		this.urgentReceiveBeginTime_ = 0;
		this.lastReceiveBeginTime_ = 0;

		this.avgSendSpeed_ = 0;
		this.avgReceiveSpeed_ = 0;
		this.urgentReceiveSpeed_ = 0;
		this.lastReceiveSpeed_ = 0;
		this.restrictedSendSpeed_ = 0;

		this.protocolSendPieces_ = [];
		this.protocolSendBytes_ = [];
		this.protocolSendSpeeds_ = [];
		this.protocolReceivePieces_ = [];
		this.protocolReceiveBytes_ = [];
		this.protocolReceiveSpeeds_ = [];
		for ( var n = 0; n < p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax; n++) {
			this.protocolSendPieces_[n] = 0;
			this.protocolSendBytes_[n] = 0;
			this.protocolSendSpeeds_[n] = 0;
			this.protocolReceivePieces_[n] = 0;
			this.protocolReceiveBytes_[n] = 0;
			this.protocolReceiveSpeeds_[n] = 0;
		}
		this.shareSendRatio_ = 0;
		this.shareReceiveRatio_ = 0;
		this.firstPieceFetchTime_ = 0;

		this.totalReceiveDuration_ = 0;
		this.downloadedDuration_ = 0;
		this.totalPlayedBytes_ = 0;
		this.totalPlayedPieces_ = 0;
		this.totalPlayedDuration_ = 0;
	},

	addSendData_ : function(protocolType, pieces, bytes) {
		this.addSendData2_(protocolType, bytes, pieces);
		this.statSendData_();
	},

	addSendData2_ : function(protocolType, bytes, pieces) {
		if (protocolType < 0 || protocolType >= p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax) {
			return;
		}

		this.totalSendPieces_ += pieces;
		this.totalSendBytes_ += bytes;
		this.actualSendPieces_ += pieces;
		this.actualSendBytes_ += bytes;
		this.protocolSendPieces_[protocolType] += pieces;
		this.protocolSendBytes_[protocolType] += bytes;
	},

	statSendData_ : function() {
		if (this.totalReceiveBytes_ > 0) {
			this.shareSendRatio_ = this.totalSendBytes_ / this.totalReceiveBytes_;
		}

		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.firstSendTime_ > 0 && nowTime > this.firstSendTime_) {
			var timeEclipse = nowTime - this.firstSendTime_;
			this.avgSendSpeed_ = this.actualSendPieces_ * 1000 / timeEclipse;
		} else {
			this.firstSendTime_ = nowTime;
		}
	},

	addReceiveData_ : function(urgent, protocolType, pieces, bytes) {
		this.addReceiveData2_(protocolType, bytes, pieces);
		if (urgent) {
			this.urgentReceiveBytes_ += bytes;
		}

		this.statReceiveData_(urgent);
	},

	addReceiveData2_ : function(protocolType, bytes, pieces) {
		if (protocolType < 0 || protocolType >= p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax) {
			return;
		}

		this.totalReceivePieces_ += pieces;
		this.totalReceiveBytes_ += bytes;
		this.actualReceivePieces_ += bytes;
		this.actualReceiveBytes_ += bytes;
		this.protocolReceivePieces_[protocolType] += pieces;
		this.protocolReceiveBytes_[protocolType] += bytes;

		this.lastReceiveBytes_ += bytes;
	},

	statReceiveData_ : function(urgent) {
		if (this.totalReceiveBytes_ > 0) {
			var p2pReceiveBytes = this.totalReceiveBytes_ - this.protocolReceiveBytes_[p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn];
			this.shareSendRatio_ = this.totalSendBytes_ / this.totalReceiveBytes_;
			this.shareReceiveRatio_ = p2pReceiveBytes / this.totalReceiveBytes_;
		}

		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.firstReceiveTime_ > 0 && nowTime > this.firstReceiveTime_) {
			var timeEclipse = nowTime - this.firstReceiveTime_;
			this.avgReceiveSpeed_ = this.actualReceiveBytes_ * 1000 / timeEclipse;
		} else {
			this.firstReceiveTime_ = nowTime;
		}

		if (this.lastReceiveBeginTime_ > 0 && nowTime > this.lastReceiveBeginTime_) {
			var timeEclipse = nowTime - this.lastReceiveBeginTime_;
			this.lastReceiveSpeed_ = this.lastReceiveBytes_ * 1000 / timeEclipse;
			if (timeEclipse > 5 * 1000) {
				// reset
				this.lastReceiveBeginTime_ = nowTime;
				this.lastReceiveBytes_ = 0;
			}
		} else {
			this.lastReceiveBeginTime_ = nowTime;
		}

		if (urgent) {
			if (this.urgentReceiveBeginTime_ > 0 && nowTime > this.urgentReceiveBeginTime_) {
				var timeEclipse = nowTime - this.urgentReceiveBeginTime_;
				this.urgentReceiveSpeed_ = this.urgentReceiveBytes_ * 1000 / timeEclipse;
				if (timeEclipse > 5 * 1000) {
					// reset
					this.urgentReceiveBeginTime_ = nowTime;
					this.urgentReceiveBytes_ = 0;
				}
			} else {
				this.urgentReceiveBeginTime_ = nowTime;
			}
		}
	}
});
p2p$.ns('com.webp2p.logic.live');

p2p$.com.webp2p.logic.live.ChannelStatic = {
	kTimerTagMetaUpdate : 0,
};

p2p$.com.webp2p.logic.live.Channel = p2p$.com.webp2p.logic.base.Channel.extend_({
	channelType_ : "liv",
	livePlayOffset_ : 0,
	livePlayMaxTimeLength_ : 0,
	liveFirstUrgentUpdated_ : false,
	liveSkipSegmentTime_ : 0,
	liveMetaRefreshInterval_ : 0,
	liveMetaTryTimeoutTimes_ : 0,
	playLastSegmentCount_ : 0,

	liveTimeShift_ : 0,
	livePlayerShift_ : 0,
	liveCurrentTime_ : 0,
	liveStartTime_ : 0,
	liveAbTimeShift_ : 0,
	liveNowPlayOffset_ : 0,
	liveMetaLoadTime_ : 0,
	liveMetaUpdateTime_ : 0,
	liveMaxSegmentStartTime_ : 0,
	lastFetchEndSegmentId_ : 0,
	lastProgramChangeTime_ : 0,
	liveStreamId_ : "",
	sourceMetaUrl_ : "",
	updateMetaUrl_ : "",
	backupMetaData_ : null,
	// boost::asio::deadline_timer liveTimer_;

	init : function(channelUrl, decodedUrl, mgr) {
		this._super(p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive, channelUrl, decodedUrl, mgr);
		this.context_.playType_ = "liv";
		this.maxSleepTime_ = 60 * 1000;
		this.livePlayOffset_ = 120; // seconds
		this.livePlayMaxTimeLength_ = 200; // 200 seconds
		this.liveMetaRefreshInterval_ = 5000; // ms
		this.liveMetaTryTimeoutTimes_ = 0;
		this.liveFirstUrgentUpdated_ = false;
		this.liveSkipSegmentTime_ = 0;
		this.playLastSegmentCount_ = 20; // last 20 segments
		this.liveTimeShift_ = -1;
		this.livePlayerShift_ = 0;
		this.liveCurrentTime_ = 0;
		this.liveStartTime_ = 0;
		this.liveAbTimeShift_ = 0;
		this.liveNowPlayOffset_ = 0;
		this.liveMetaLoadTime_ = 0;
		this.liveMetaUpdateTime_ = 0;
		this.liveMaxSegmentStartTime_ = 0;
		this.lastFetchEndSegmentId_ = 0;
		this.lastProgramChangeTime_ = 0;
		this.updateLiveTimer_ = null;
	},

	getChannelType_ : function() {
		return this.channelType_;
	},

	open : function() {
		if (!this._super()) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::live::Channel::Super return false"));
			return false;
		}

		if (this.manager_.getEnviroment_().livePlayOffset_ > 0) {
			this.livePlayOffset_ = this.manager_.getEnviroment_().livePlayOffset_;
		}

		this.liveStreamId_ = this.url_.params_.get("stream_id");
		this.playerHistoryKey_ = "live:" + this.liveStreamId_;
		// this.updateUrlParams(false);
		this.url_.params_.set("mslice", 5);

		var timeshift = this.url_.params_.get("timeshift");
		if (timeshift != null) {
			this.livePlayerShift_ = p2p$.com.webp2p.core.common.String.parseNumber_(timeshift.value, 0);
			if (this.livePlayerShift_ == 0) {
				// remove invalid timeshift value
				this.url_.params_.erase(timeshift.key);
			}
		}

		this.gslbRequestUrl_ = this.url_.toString();
		this.gslbEncryptUrl_ = this.gslbRequestUrl_;
		this._superprototype.downloadGslb_.call(this);
		return true;
	},
	close : function() {
		this.stopUpdateLiveMetaTimer_();
		this._super();
		return true;
	},
	// override logic::base::Channel
	onOpened_ : function() {

		var minSegmentTime = -1;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			this.liveMaxSegmentStartTime_ = Math.max(this.liveMaxSegmentStartTime_, segment.startTime_);
			if (minSegmentTime < 0 || minSegmentTime > segment.startTime_) {
				minSegmentTime = segment.startTime_;
			}
		}
		if (this.gslbReloadTimes_ <= 0 && (minSegmentTime / 1000) > this.liveAbTimeShift_) {
			// fixed abtimeshift
			this.liveCurrentTime_ += (minSegmentTime / 1000 - this.liveAbTimeShift_);
		}

		var p2pGroupIdChanged = false;
		if (this.gslbReloadTimes_ > 0) {
			var newSegment = {
				newSegmentCount_ : 0,
				newSegments_ : []
			};
			if (this.backupMetaData_ && this.backupMetaData_.p2pGroupId_ == this.metaData_.p2pGroupId_) {
				p2pGroupIdChanged = false;
				newSegment = this.metaData_.combineWith_(this.backupMetaData_, true, false);
			} else {
				p2pGroupIdChanged = true;
			}
			this.backupMetaData_.tidy();
			this.liveMaxSegmentStartTime_ = 0;
			for ( var k = 0; k < this.metaData_.segments_.length; k++) {
				var segment = this.metaData_.segments_[k];
				this.liveMaxSegmentStartTime_ = Math.max(this.liveMaxSegmentStartTime_, segment.startTime_);
			}

			P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel::Add {0} backup meta segment(s) to reloaded channel({1}), total {2} segment(s) now",
					newSegment.newSegmentCount_, this.id_, this.metaData_.segments_.length));
		}

		this.stablePeers_ = [];
		this.otherPeers_ = [];
		if (this.protocolPool_ != null && !this.protocolPool_.initialize_()) {
			return false;
		}
		this.setUpdateLiveMetaTimeout_(p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate, this.liveMetaRefreshInterval_);
		return true;
	},

	onUpdateLiveMetaTimeout_ : function(tag) {
		// if( timer != &timer_ || !opened_ )
		// {
		// return;
		// }

		switch (tag) {
		case p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate: {
			if (this.downloader_ != null) {
				this.metaServerResponseCode_ = 0;
				this.downloader_.log("timeout");
				this.downloader_.close();
				this.downloader_ = null;
				this.switchNextMetaSource_();
			}
			// for test switch only
			// this.switchNextMetaSource_();

			this.updateLiveMeta_();
			break;
		}
		default:
			break;
		}
	},

	switchNextMetaSource_ : function() {
		this.liveMetaTryTimeoutTimes_++;
		var bak = this.sourceMetaUrl_;
		var allMetaNodes = this.context_.gslbData_["nodelist"];
		for ( var n = 0; n < allMetaNodes.length; n++) {
			var metaItem = allMetaNodes[(n + this.liveMetaTryTimeoutTimes_) % allMetaNodes.length];
			var locationUrl = metaItem["location"];
			if (!(locationUrl == "") && locationUrl != this.metaData_.sourceUrl_) {
				this.sourceMetaUrl_ = locationUrl;
				break;
			}
		}

		var url = new p2p$.com.webp2p.core.supernode.Url();
		url.fromString_(this.sourceMetaUrl_);
		this.context_.metaServerIp_ = p2p$.com.webp2p.core.common.String.format("{0}:{1}", url.host_, (url.port_) == 0 ? 80 : url.port_);

		P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel [{0}]Meta timeout/error for url({1}), channel({2}), {3} try times, switch next source({4})...",
				p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), bak, this.id_, this.liveMetaTryTimeoutTimes_, this.sourceMetaUrl_));
	},

	updateLiveMeta_ : function() {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		// this.gslbReloadInterval_ = 10800000;
		if (this.gslbLoadTime_ + this.gslbReloadInterval_ <= nowTime) {
			// reload gslb again
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel Channel({0}), gslb reload({1} sec) expired, last({2}), reload gslb again ...", this.id_,
					this.gslbReloadInterval_ / p2p$.com.webp2p.core.common.Global.kMicroUnitsPerSec, p2p$.com.webp2p.core.common.String.formatTime_(
							this.gslbLoadTime_, false)));
			// liveTimeShift_ = -1;
			this.gslbReloadTimes_++;
			this.backupMetaData_ = this.metaData_.fork();
			// this.updateUrlParams(true);
			this.gslbRequestUrl_ = this.url_.toString();
			// this.gslbEncryptUrl_ = this.manager_.getAuthorization().encrypt(gslbRequestUrl_);
			this.downloadGslb_();
			return;
		}

		if (this.liveNowPlayOffset_ > 0) {
			if (this.liveNowPlayOffset_ > this.liveTimeShift_) {
				this.liveNowPlayOffset_ -= this.liveTimeShift_;
			} else {
				this.liveNowPlayOffset_ = 0;
			}
		}
		this.liveAbTimeShift_ = this.liveMaxSegmentStartTime_ / 1000;
		if (this.liveAbTimeShift_ <= 0) {
			this.liveAbTimeShift_ = this.liveCurrentTime_ - this.liveTimeShift_;
		}
		this.liveMetaUpdateTime_ = nowTime;

		if (this.downloader_ != null) {
			this.downloader_.log("cancel");
			this.downloader_.close();
			this.downloader_ = null;
		}
		this.updateMetaUrl_ = this.getNowRequestMetaUrl_(nowTime);
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(this.updateMetaUrl_, this, "GET", "", "live::meta");
		this.downloader_.load();
		// set meta timer
		this.setUpdateLiveMetaTimeout_(p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate, this.liveMetaRefreshInterval_); // liveNowPlayOffset_ >
		// 0 ?
		// 1000 :
		// liveMetaRefreshInterval_);
	},

	getNowRequestMetaUrl_ : function(nowTime) {
		var url = this.sourceMetaUrl_ == "" ? this.metaData_.sourceUrl_ : this.sourceMetaUrl_;
		url += (url.indexOf('?') < 0) ? "?" : "&";
		if (this.livePlayerShift_ == 0) {
			// auto delay
			url += p2p$.com.webp2p.core.common.String.format("abtimeshift={0}&cdernd={1}", this.liveAbTimeShift_, nowTime);
		} else if (url.indexOf("&timeshift=") < 0 && url.indexOf("?timeshift=") < 0) {
			// shift time not found, repair it
			url += p2p$.com.webp2p.core.common.String.format("timeshift={0}&cdernd={1}", this.livePlayerShift_, nowTime);
		} else {
			url += p2p$.com.webp2p.core.common.String.format("cdernd={0}", nowTime);
		}

		return url;
	},

	setUpdateLiveMetaTimeout_ : function(tag, timeoutMs) {
		var me = this;
		this.updateLiveTimer_ = setTimeout(function() {
			me.onUpdateLiveMetaTimeout_(tag);
		}, timeoutMs);
	},

	stopUpdateLiveMetaTimer_ : function() {
		if (this.updateLiveTimer_) {
			clearTimeout(this.updateLiveTimer_);
			this.updateLiveTimer_ = null;
		}
	},

	onHttpDownloadCompleted_ : function(downloader) {
		if (this._super(downloader)) {
			// handled by base channel
			return true;
		}

		var handled = false;

		if (!this.opened_ || (this.downloader_ != null && this.downloader_ != downloader)) {
			return handled;
		}

		if (downloader.tag_ == "live::meta") {
			handled = true;
			this.downloader_ = null;
			this.metaServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
			this.context_.metaServerIp_ = downloader.remoteEndpoint_;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// failed
				this.onSchedule_(false);
				this.switchNextMetaSource_();
				return handled;
			}
			if (!this.parseUpdateMetaResponse_(downloader)) {
				this.switchNextMetaSource_();
				return handled;
			}
			this.metaReloadTimes_++;
			this.metaLoadTime_ = this.activeTime_;
		}

		return handled;
	},

	parseUpdateMetaResponse_ : function(downloader) {
		var metaChanged = false;
		var p2pGroupIdChanged = false;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var updateMeta = new p2p$.com.webp2p.core.supernode.MetaData();
		updateMeta.type_ = this.metaData_.type_;
		updateMeta.rangeParamsSupported_ = this.metaData_.rangeParamsSupported_;
		updateMeta.verifyMethod_ = this.metaData_.verifyMethod_;
		updateMeta.sourceUrl_ = this.updateMetaUrl_;
		updateMeta.finalUrl_ = downloader.fullUrl_;
		updateMeta.channelUrl_ = this.metaData_.channelUrl_;
		updateMeta.storageId_ = this.metaData_.storageId_;
		if (!updateMeta.load(downloader.responseData_, downloader.totalUsedTime_)) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::live::Channel Parse meta response failed, url({0}), channel({1}), size({2})"), downloader.fullUrl_, this.id_,
					this.downloader.responseData_.length);

			this.gslbServerResponseCode_ = 701; // content error
			this.onSchedule_(false);
			return false;
		}

		if (updateMeta.p2pGroupId_ != this.metaData_.p2pGroupId_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel Meta p2p group id change from({0}) to({1}), reopen p2p protocols...", this.metaData_.p2pGroupId_,
					updateMeta.p2pGroupId_));

			if (this.lastProgramChangeTime_ <= 0) {
				this.lastProgramChangeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				var retval = {
					newSegmentCount_ : 0,
					newSegments_ : []
				};
				retval = this.metaData_.combineSameGroup_(updateMeta);
				if (retval.newSegmentCount_ > 0) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel::Add2 ({0}) new meta segment({1}) to channel({2}), total {3} segment(s) now",
							retval.newSegmentCount_, retval.newSegments_.join(','), this.id_, this.metaData_.segments_.length));
				}
			}

			if (this.lastProgramChangeTime_ + (120 * 1000) > nowTime) {
				// check if all segments are completed
				var allSegmentsCompleted = true;
				for ( var k = 0; k < this.metaData_.segments_.length; k++) {
					var segment = this.metaData_.segments_[k];
					if (segment.id_ < this.urgentSegmentId_) {
						continue;
					}
					if (segment.completedTime_ <= 0) {
						allSegmentsCompleted = false;
						break;
					}
				}
				if (!allSegmentsCompleted) {
					// wait for next time
					this.onSchedule_(false);
					return true;
				}
			}

			metaChanged = true;
			p2pGroupIdChanged = true;
			this.metaData_.p2pGroupId_ = updateMeta.p2pGroupId_;
			this.metaData_.markAllSegmentP2pDisabled_();
			var retval = {
				newSegmentCount_ : 0,
				newSegments_ : []
			};
			retval = this.metaData_.combineWith_(updateMeta, false, true);
			if (retval.newSegmentCount_ <= 0) {
				// rebuild segment and piece indexes while all p2p segments disabled
				this.metaData_.buildIndexes_();
			}
			if (retval.newSegmentCount_ > 0) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel::Add3 ({0}) new meta segment({1}) to channel({2}), total {3} segment(s) now",
						retval.newSegmentCount_, retval.newSegments_.join(','), this.id_, this.metaData_.segments_.length));
			}
			// update self range cache
			this.fillSelfPieceRanges_(this.selfRangesMessage_);

		} else {
			// {newSegmentCount_:newSegmentCount,newSegments_:newSegments};
			var retval = this.metaData_.combineWith_(updateMeta, false, false);
			if (retval.newSegmentCount_ > 0) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::live::Channel::Add4 ({0}) new meta segment({1}) to channel({2}), total {3} segment(s) now",
						retval.newSegmentCount_, retval.newSegments_.join(','), this.id_, this.metaData_.segments_.length));
				metaChanged = true;
			}
		}

		this.metaData_.updateTime_ = nowTime;
		if (metaChanged) {
			this.removeExpiredSegments_();
			this.updateMetaPieceShareInRanges_(true);
			// if( p2pGroupIdChanged ) metaData_.updateSegmentTimeGap_();
			// this.metaData_.updateSegmentTimeGap_();
			// this.metaData_.updateMetaCache_(this.getPseudoPlayTime_(nowTime), false);
			this.metaResponseBody_ = this.metaData_.localMetaContent_;
		}

		this.lastProgramChangeTime_ = 0;
		this.liveMaxSegmentStartTime_ = 0;
		for ( var k = 0; k < this.metaData_.segments_.length; k++) {
			var segment = this.metaData_.segments_[k];
			this.liveMaxSegmentStartTime_ = this.liveMaxSegmentStartTime_ > segment.startTime_ ? this.liveMaxSegmentStartTime_ : segment.startTime_;
		}

		if (p2pGroupIdChanged) {
			// this.otherPeers_.clear();
			// this.context_.resetPeerState_();
			// if( this.protocolPool_ != null ) this.protocolPool_.p2pGroupIdChange_();
		}

		this.onSchedule_(false);
		return true;
	},

	removeExpiredSegments_ : function() {
		var validDuration = 0;
		var validSegmentCount = 0;
		var endIndex = this.metaData_.segments_.length;
		for (; endIndex != -1; endIndex--) {
			if (endIndex == this.metaData_.segments_.length) {
				continue;
			}

			var segment = this.metaData_.segments_[endIndex];
			validDuration += segment.duration_;
			validSegmentCount++;
			if (validDuration >= (this.livePlayMaxTimeLength_) * 1000) {
				break;
			}
		}
		if (endIndex > 0) {
			var expiredSegmentCount = this.metaData_.segments_.length - validSegmentCount;
			var expiredSegmentNames = "";
			var bucket = this.getStorageBucket_();
			for ( var n = 0; n < endIndex; n++) {
				var segment = this.metaData_.segments_[n];
				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				if (n == endIndex - 1) {
					expiredSegmentNames += segment.id_;
				} else {
					expiredSegmentNames += (segment.id_ + ",");
				}
				bucket.remove(objectId);
			}
			for ( var n = 0; n < endIndex; n++) {
				var segment = this.metaData_.segments_[n];
				this.metaData_.p2pPieceCount_ -= segment.pieces_.length;
			}
			this.metaData_.segments_.splice(0, endIndex);
			P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel Remove {0} ({1}) expired meta segment(s) from channel({2}), total {3} segment(s) now",
					expiredSegmentCount, expiredSegmentNames, this.id_, this.metaData_.segments_.length));
			//
			if (expiredSegmentCount > 0) {
				this.fillSelfPieceRanges_(this.selfRangesMessage_);
				this.metaData_.buildIndexes_();
			}
		}
	},

	downloadMeta_ : function() {
		// gslb responsed
		// if( gslbServerErrorCode_ >= 0 && gslbServerErrorCode_ < 300 )
		// {
		// manager_.addPlayedHistoryKey(playerHistoryKey_);
		// }

		var gslbData = this.context_.gslbData_;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		if (this.gslbReloadTimes_ <= 0) {
			this.liveMaxSegmentStartTime_ = 0;

			// switch to livesftime from gslb server
			this.liveTimeShift_ = gslbData["livesftime"];
			if (this.liveTimeShift_ >= 0) {
				// use gslb configure, max 180 seconds (livePlayMaxTimeLength_ - 20)
				this.livePlayOffset_ = this.liveTimeShift_ > (this.livePlayMaxTimeLength_ - 20) ? (this.livePlayMaxTimeLength_ - 20) : this.liveTimeShift_;
			}
			this.livePlayMaxTimeLength_ = (this.livePlayOffset_ > 30 ? this.livePlayOffset_ : 30) + 60;
			this.liveCurrentTime_ = gslbData["curtime"];
			this.liveStartTime_ = gslbData["starttime"];
			this.liveNowPlayOffset_ = this.livePlayOffset_;

			if (this.livePlayerShift_ != 0) {
				this.liveCurrentTime_ += (this.livePlayerShift_ + this.livePlayOffset_);
			}

			P2P_ULOG_INFO(P2P_ULOG_FMT(
					"logic::live::Channel::Detect channel({0}), time shift({1} sec), gslb reload({2} sec), current time({3}), start time({4})", this.id_,
					this.liveTimeShift_, this.gslbReloadInterval_ / 1000, p2p$.com.webp2p.core.common.String.formatTime_(this.liveCurrentTime_),
					p2p$.com.webp2p.core.common.String.formatTime_(this.liveStartTime_)));

			// switch to livesftime from gslb server
			this.liveCurrentTime_ += 10;
			this.liveAbTimeShift_ = this.liveCurrentTime_ - this.liveNowPlayOffset_ - 10;
			this.liveMetaLoadTime_ = nowTime;
			this.liveMetaUpdateTime_ = nowTime;
		}

		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.downloader_ != null) {
			this.downloader_.log("cancel");
			this.downloader_.close();
			this.downloader_ = null;
		}

		var metaUrl = this.getNowRequestMetaUrl_(nowTime);
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(metaUrl, this, "GET", "", "base::meta");
		this.downloader_.load();
		// set meta timer
		this.setMetaTimeout_(8 * 1000);
	},

	onSchedule_ : function(shareMode) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.paused_) {
			// skip schedule
			return;
		}

		// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel", "Schedule %s for channel(%s) ..."), shareMode ? "share only" : "multi mode", id_.c_str());
		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel::Schedule urgent segment index:{0}, id :{1},", this.urgentSegmentIndex_, this.urgentSegmentId_));
		this.lastScheduleTime_ = nowTime;
		this.updatePeersSpeed_(nowTime, this.stablePeers_);

		// check pieces to download
		var totalDuration = 0;
		var maxDuration = this.context_.p2pUrgentSize_ * 1000;
		this.urgentSegmentIndex_ = -1;
		for ( var n = 0; (this.urgentSegmentId_ >= 0) && (n < this.metaData_.segments_.length); n++) {
			var segment = this.metaData_.segments_[n];

			if (segment.id_ == this.urgentSegmentId_) {
				// find urgent segment index
				this.urgentSegmentIndex_ = n;
				this.context_.playingPosition_ = segment.startTime_ / 1000;
			}

			if (n >= this.urgentSegmentIndex_) {
				if (totalDuration < maxDuration || this.urgentSegmentEndId_ <= this.urgentSegmentId_) {
					// urgent should has 2 segments at least if more segments eixst
					this.urgentSegmentEndId_ = segment.id_;
				}
				totalDuration += segment.duration_;
			}
		}

		if (this.urgentSegmentIndex_ < 0 && this.metaData_.segments_.length > 0) {
			this.urgentSegmentIndex_ = 0;
		}

		this.updateUrgentIncompleteCount_();
		if (!shareMode) {
			this.checkTimeoutPieces_(nowTime);
			this.checkTimeoutPeers_(nowTime);
			this.checkPeerPieceRanges_(nowTime);

			this.lastPeerSortTime_ = nowTime;
			this.stablePeers_.sort(function(item1, item2) {
				if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
					return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
				}
				return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
			});
			this.otherPeers_.sort(function(item1, item2) {
				if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
					return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
				}
				return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
			});
			this.statData_.addReceiveData_(true, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn, 0, 0); // flush speed
			// updateStatSyncSpeeds_();
		}

		this.metaData_.urgentSegmentId_ = this.urgentSegmentId_;
		if (this.urgentSegmentIndex_ < 0) {
			// all segments completed
			return;
		}

		// urgent area stable peers first
		var stableDispatchPiece = 0;
		if (!shareMode && this.stablePeers_.length > 0) {
			stableDispatchPiece = this.dispatchStablePeers_(this.urgentSegmentIndex_);
		}

		// p2p area try other peers, sort by last receive speed
		// if( manager_.getEnviroment_().p2pEnabled_ )
		// if( urgentIncompleteCount_ <= 0 )
		{
			this.otherPeerRequestCount_ = this.dispatchOtherPeers_(this.urgentSegmentIndex_);
		}

		// active cdn fetch area
		var fetchPieces = 0;
		if (!shareMode && (this.urgentSegmentIndex_ >= 0) && this.manager_.getEnviroment_().p2pEnabled_ && this.urgentIncompleteCount_ <= 0
				&& this.otherPeers_.length > 0) {
			fetchPieces = this.dispatchFetchRate_(this.urgentSegmentIndex_);
		}

		// updateStatDownloadedDuration();

		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel::Schedule {0} stable pieces ...", stableDispatchPiece));
	},
	dispatchFetchRate_ : function(startSegmentIndex) {
		if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// active cdn fetch area
		var fetchPieceCount = 0;
		var idlePieceCount = 0;
		// var maxRatioFetchCount = 1;
		var maxFetchNumber = this.context_.p2pFetchRate_ * 100;
		var startFetchId = this.lastFetchEndSegmentId_;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var usedSegmentCount = 0;
		var usedOffsetBytes = 0;
		var maxOffsetBytes = (this.getStorageBucket_().getDataCapacity_()) * 2 / 3;

		var message = new p2p$.com.webp2p.protocol.base.Message();
		var peer = this.getNextIdleStablePeer_();
		for ( var n = startSegmentIndex; n < this.metaData_.segments_.length && peer; n++) {
			var segment = this.metaData_.segments_[n];
			if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
				// urgent incompleted
				break;
			}

			usedSegmentCount++;
			if (segment.size_ > 0) {
				// to avoid too many bytes
				usedOffsetBytes += segment.size_;
				if (usedOffsetBytes > maxOffsetBytes) {
					break;
				}
			} else if (usedSegmentCount > 10) {
				// to avoid too many segments
				break;
			}

			this.lastFetchEndSegmentId_ = segment.id_;
			if (segment.id_ <= startFetchId) {
				continue;
			} else if (segment.completedTime_ > 0) {
				continue;
			}

			var previousTn = false;
			var previousHit = false;
			for ( var k = 0; k < segment.pieces_.length && peer; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0 || piece.receiveStartTime_ > 0 || piece.shareInRanges_ > 0 || piece.size_ <= 0) {
					// completed or receiving or exits other peer
					previousHit = false;
					continue;
				}

				if (piece.randomNumber_ >= maxFetchNumber) {
					if (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) {
						if (k + 1 >= segment.pieces_.length) {
							continue;
						}
						var next = segment.pieces_[k + 1];
						if (next.completedTime_ > 0 || next.receiveStartTime_ > 0 || next.shareInRanges_ > 0) {
							continue;
						} else if (next.randomNumber_ >= maxFetchNumber) {
							continue;
						}
					} else if (!previousHit || !previousTn) {
						continue;
					}
				}

				var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
				requestItem.segmentId_ = segment.id_;
				requestItem.pieceType_ = piece.type_;
				requestItem.pieceId_ = piece.id_;
				requestItem.checksum_ = piece.checksum_;
				message.requests_.push(requestItem);
				piece.receiveByStable_ = true;
				piece.receiveStartTime_ = nowTime;
				piece.receiveSessionId_ = peer.sessionId_;
				if (segment.startReceiveTime_ <= 0) {
					segment.startReceiveTime_ = nowTime;
				}
				fetchPieceCount++;
				previousTn = (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn);
				previousHit = true;
			}
			if (message.requests_.length > 0) {
				if (peer.pendingRequestCount_ <= 0) {
					peer.lastSegmentId_ = segment.id_;
				}
				peer.pendingRequestCount_ += message.requests_.length;
				peer.statSendMessage_(message);
				peer.session_.send(message);
				message.requests_ = [];
				peer = this.getNextIdleStablePeer_();
			}
		}

		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel Random fetch, start index ({0}), total ({1}) idle pieces, fetched ({2}) fetch rate({3})",
				startFetchId, idlePieceCount, fetchPieceCount, this.context_.p2pFetchRate_ * 100));

		return fetchPieceCount;
	},
	dispatchStablePeers_ : function(startSegmentIndex) {
		if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// urgent area stable peers first
		var totalDuration = 0;
		var stableDispatchPiece = 0;
		// var allPeersBusy = false;
		var busyPieceCount = 0;
		var appendDuration = 0;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1000 : 1500); // 1.5 ratio for p2p
		var message = new p2p$.com.webp2p.protocol.base.Message();

		var peer = this.getNextIdleStablePeer_();
		for ( var n = startSegmentIndex;
		// n < endSegmentIndex && n < metaData_.segments_.size() && eachStablePiece > 0 && stableIterator != stablePeers_.end() && totalDuration <
		// maxDuration;
		n < this.metaData_.segments_.length && totalDuration < maxDuration; n++) {
			var segment = this.metaData_.segments_[n];
			this.lastFetchEndSegmentId_ = Math.max(this.lastFetchEndSegmentId_, segment.id_);
			totalDuration += segment.duration_;
			// if( segment.lastPlayTime_ > 0 ) continue;
			if (segment.completedTime_ > 0) {
				continue;
			}

			for ( var k = 0; k < segment.pieces_.length && peer != null && busyPieceCount <= 0; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0) {
					if (message.requests_.length > 0) {
						// if message.requests_.length > 0
						// Keep downloadrange Continuous
						// break
						break;
					} else {
						// already complete
						// continue;
						continue;
					}
				} else if (piece.receiveStartTime_ > 0) {
					// duplicate receiving
					var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
					if (piece.receiveByStable_ && (piece.receiveStartTime_ + pieceTimeout > nowTime)) {
						// receving by stable cdn peer
						busyPieceCount++;
						continue;
					}
				}

				if (segment.size_ > 0 && segment.duration_ > 0) {
					appendDuration += piece.size_ / segment.size_ * segment.duration_ * 1000.0;
				}

				var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
				requestItem.urgent_ = true;
				requestItem.segmentId_ = segment.id_;
				requestItem.pieceType_ = piece.type_;
				requestItem.pieceId_ = piece.id_;
				requestItem.checksum_ = piece.checksum_;
				message.requests_.push(requestItem);
				piece.receiveByStable_ = true;
				piece.receiveStartTime_ = nowTime + appendDuration;
				piece.receiveSessionId_ = peer.sessionId_;
				if (segment.startReceiveTime_ <= 0) {
					segment.startReceiveTime_ = nowTime;
				}

				stableDispatchPiece++;
				if (message.requests_.length >= 50) {
					if (peer.pendingRequestCount_ <= 0) {
						peer.lastSegmentId_ = segment.id_;
					}
					peer.activeTime_ = nowTime;
					peer.pendingRequestCount_ += message.requests_.length;
					peer.statSendMessage_(message);
					peer.session_.send(message);
					message.requests_ = [];
					appendDuration = 0;
					peer = null;
					break;
				}
			}
			if (message.requests_.length > 0 && peer != null) {
				if (peer.pendingRequestCount_ <= 0) {
					peer.lastSegmentId_ = segment.id_;
				}
				peer.activeTime_ = nowTime;
				peer.pendingRequestCount_ += message.requests_.length;
				peer.statSendMessage_(message);
				peer.session_.send(message);
				message.requests_ = [];
				appendDuration = 0;
				peer = null;
			}
		}

		return stableDispatchPiece;
	},

	dispatchOtherPeers_ : function(startSegmentIndex) {
		if (this.otherPeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// p2p area try other peers, sort by last receive speed
		var stableTooSlow = false;
		var requestCount = this.getOtherPeerRequestCount_();
		var maxCount = this.urgentIncompleteCount_ > 0 ? this.context_.p2pMaxUrgentRequestPieces_ : this.context_.p2pMaxParallelRequestPieces_;
		var bucket = this.getStorageBucket_();
		var offsetIndex = -1;
		var usedSegmentCount = 0;
		var usedOffsetBytes = 0;
		var maxOffsetBytes = bucket.getDataCapacity_() * 2 / 3;

		// forward offset
		if (startSegmentIndex >= 0) {
			// var startIndex = startSegmentIndex;
			var totalDuration = 0;
			var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1500 : 2000); // 2 ratio of urgent size
			stableTooSlow = this.getStablePeersSpeedTooSlow_();
			for ( var n = startSegmentIndex; requestCount < maxCount && n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				totalDuration += segment.duration_;
				usedSegmentCount++;
				if (segment.size_ > 0) {
					// to avoid too many bytes
					usedOffsetBytes += segment.size_;
					if (usedOffsetBytes > maxOffsetBytes || (usedSegmentCount + 5) > bucket.getMaxOpenBlocks_()) {
						break;
					}
				} else if (usedSegmentCount > 10) {
					// to avoid too many segments
					break;
				}

				if (segment.p2pDisabled_) {
					continue;
				}
				if (totalDuration <= maxDuration && !stableTooSlow && this.urgentSegmentIndex_ >= 0) {
					continue;
				}
				if (offsetIndex < 0) {
					offsetIndex = n;
				}
				requestCount = this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
				if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
					// urgent incompleted
					break;
				}
			}
		}
		if (offsetIndex < 0) {
			offsetIndex = this.metaData_.segments_.length - 1;
		}
		// backward check
		for ( var n = offsetIndex; requestCount < maxCount && n >= 0 && n >= startSegmentIndex; n--) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_ || segment.completedTime_ > 0) {
				continue;
			}
			requestCount += this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
		}
		return requestCount;
	},

	dispatchSegmentForOtherPeers_ : function(stableTooSlow, requestCount, maxCount, segment) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		for ( var k = 0; requestCount < maxCount && k < segment.pieces_.length; k++) {
			var piece = segment.pieces_[k];
			if (piece.completedTime_ > 0 || piece.size_ <= 0) {
				// completed
				continue;
			} else if (piece.receiveStartTime_ > 0) // || k == 4 ) // test only
			{
				// duplicate receiving
				var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
				if (piece.receiveStartTime_ + pieceTimeout > nowTime) {
					if (!piece.receiveByStable_ || !stableTooSlow) {
						// not expired
						continue;
					}
				}
			}

			var peer = this.getNextIdleOtherPeer_(piece.type_, piece.id_);

			if (peer == null) {
				// no idle peer has this piece
				continue;
			}

			var message = new p2p$.com.webp2p.protocol.base.Message();
			var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
			requestItem.segmentId_ = segment.id_;
			requestItem.pieceType_ = piece.type_;
			requestItem.pieceId_ = piece.id_;
			requestItem.checksum_ = piece.checksum_;
			message.requests_.push(requestItem);
			piece.receiveByOther_ = true;
			piece.receiveSessionId_ = peer.sessionId_;
			piece.receiveStartTime_ = nowTime;
			peer.activeTime_ = nowTime;
			peer.lastSegmentId_ = segment.id_;
			peer.receivePiece_ = piece;
			peer.statSendMessage_(message);
			peer.statReceiveBegin_();
			peer.session_.send(message);
			requestCount++;

			// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::dispatchSegmentForOtherPeer"));
		}

		return requestCount;
	},

	getAllStatus_2_ : function(params, result) {
		this._super(params, result);
		result["liveStreamId"] = this.liveStreamId_;
		// result["liveStartTime"] = this.liveStartTime_;
		// result["liveCurrentTime"] = this.liveCurrentTime_;
		// result["livePlayerShift"] = this.livePlayerShift_;
		// result["liveAbTimeShift"] = this.liveAbTimeShift_;
		// result["livePseudoPlayTime"] = this.getPseudoPlayTime_(nowTime);
		// result["liveNowPlayOffset"] = this.liveNowPlayOffset_;
		// result["livePlayOffset"] = this.livePlayOffset_;
		// result["livePlayMaxTimeLength"] = this.livePlayMaxTimeLength_;
		// result["liveMetaRefreshInterval"] = this.liveMetaRefreshInterval_;
		// result["liveSkipSegmentTime"] = this.liveSkipSegmentTime_;
	},

	getPseudoPlayTime_ : function(nowTime) {
		var liveSkipTime = Math.floor(this.liveSkipSegmentTime_ / 1000);
		this.liveSkipTime = Math.max(Math.min(liveSkipTime, 60), 0);
		var playFlushGap = 0;
		var pseudoTime = this.liveCurrentTime_ + (nowTime - this.liveMetaLoadTime_) / 1000;
		return pseudoTime - this.livePlayOffset_ + this.context_.specialPlayerTimeOffset_ + playFlushGap + liveSkipTime; // +
		// (time_t)(metaData_.totalGapDuration_ / 1000);
	},

	updateUrgentSegment_ : function(requireId) {
		this._super(requireId);
		if ( /* fromPlayer && */requireId >= 0 && !this.liveFirstUrgentUpdated_) {
			this.liveFirstUrgentUpdated_ = true;
			this.liveSkipSegmentTime_ = 0;
			for ( var n = 0; n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				if (segment.id_ >= requireId) {
					break;
				}
				if (segment.duration_ > 0) {
					this.liveSkipSegmentTime_ += segment.duration_;
				}
			}
		}
	}
});p2p$.ns('com.webp2p.logic.vod');
p2p$.com.webp2p.logic.vod.ChannelStatic = {
	kTimerSchedule : 0,
	kTimerReport : 1,
};
p2p$.com.webp2p.logic.vod.Channel = p2p$.com.webp2p.logic.base.Channel.extend_({
	// 初始化参数
	channelType_ : "vod",
	downloader_ : null,

	lastUrgentStartAbsTime_ : 0,
	lastUrgentStartMetaTime_ : 0,
	lastRequireSegmentId_ : 0,

	init : function(channelUrl, decodedUrl, mgr) {
		this._super(p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod, channelUrl, decodedUrl, mgr);
		this.context_.playType_ = "vod";
		this.lastUrgentStartAbsTime_ = 0;
		this.lastUrgentStartMetaTime_ = 0;
		this.lastRequireSegmentId_ = 0;
	},

	getChannelType_ : function() {
		return this.channelType_;
	},

	open : function() {
		if (this._super()) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("vod.super return true"));
		}
		this.gslbRequestUrl_ = this.url_.toString();
		this.gslbEncryptUrl_ = this.gslbRequestUrl_;
		this.downloadGslb_();
		return true;
	},
	close : function() {
		this._super();
	},

	// override logic::base::Channel
	onOpened_ : function() {
		this.stablePeers = [];
		this.otherPeers_ = [];
		if (this.protocolPool_ != null && !this.protocolPool_.initialize_()) {
			return false;
		}
		this.setScheduleTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule, 3 * 1000);
		this.setReportTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerReport, this.context_.statReportInterval_ * 1000);
		return true;
	},

	detectAutoRedirectMode_ : function() {
	},

	dispatchStablePeers_ : function(startSegmentIndex) {
		if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return null;
		}

		// urgent area stable peers first
		var totalDuration = 0;
		var stableDispatchPiece = 0;
		// bool allPeersBusy = false;
		var busyPieceCount = 0;
		var appendDuration = 0;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1000 : 1500); // 1.5 ratio for p2p
		var message = new p2p$.com.webp2p.protocol.base.Message();

		if (this.urgentSegmentIndex_ >= 0 && this.urgentSegmentIndex_ < this.metaData_.segments_.length
				&& this.metaData_.segments_[this.urgentSegmentIndex_].completedTime_ <= 0) {
			// cancel all far downloading stable peers when urgent segment is not completed
			for ( var n = 0; n < this.stablePeers_.length; n++) {
				var item = this.stablePeers_[n];
				if (item == null || item.pendingRequestCount_ <= 0 || item.lastSegmentId_ == this.urgentSegmentId_) {
					continue;
				}

				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::vod::Channel [{0}]Cancel far downloading stable peer, segment({1}), pending({2}), id({3}), address({4})",
						p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), item.lastSegmentId_, item.pendingRequestCount_, item.session_
								.getRemoteId_(), item.session_.getRemoteAddress_()));

				this.resetPieceReceivingBySession_(item.sessionId_);
				this.resetPeerMessage_(nowTime, false, item);
			}
		}

		var peer = this.getNextIdleStablePeer_();
		var retPeer = peer;
		var retSegment = null;
		for ( var n = startSegmentIndex;
		// n < endSegmentIndex && n < metaData_.segments_.size() && eachStablePiece > 0 && stableIterator != stablePeers_.end() && totalDuration < maxDuration;
		n < this.metaData_.segments_.length && totalDuration < maxDuration; n++) {
			var segment = this.metaData_.segments_[n];
			totalDuration += segment.duration_;
			// if( segment.startReceiveTime_ > 0 ) continue;
			if (segment.completedTime_ > 0) {
				continue;
			}

			for ( var k = 0; k < segment.pieces_.length && peer != null && busyPieceCount <= 0; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0) {
					if (message.requests_.length > 0) {
						// if message.requests_.length > 0
						// Keep downloadrange Continuous
						// break
						break;
					} else {
						// already complete
						// continue;
						continue;
					}

				} else if (piece.receiveStartTime_ > 0) {
					// duplicate receiving
					var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
					if (piece.receiveByStable_ && (piece.receiveStartTime_ + pieceTimeout > nowTime)) {
						// receving by stable cdn peer
						busyPieceCount++;
						continue;
					}
					// busyPieceCount ++;
					// break;
				}
				retSegment = segment;
				if (segment.size_ > 0 && segment.duration_ > 0) {
					appendDuration += piece.size_ / segment.size_ * segment.duration_ * 1000.0;
				}

				var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
				requestItem.urgent_ = true;
				requestItem.segmentId_ = segment.id_;
				requestItem.pieceType_ = piece.type_;
				requestItem.pieceId_ = piece.id_;
				requestItem.checksum_ = piece.checksum_;
				message.requests_.push(requestItem);
				piece.receiveByStable_ = true;
				piece.receiveStartTime_ = nowTime + appendDuration;
				piece.receiveSessionId_ = peer.sessionId_;
				if (segment.startReceiveTime_ <= 0) {
					segment.startReceiveTime_ = nowTime;
				}

				stableDispatchPiece++;
				if (message.requests_.length >= 50) {
					if (peer.pendingRequestCount_ <= 0) {
						peer.lastSegmentId_ = segment.id_;
					}
					peer.activeTime_ = nowTime;
					peer.pendingRequestCount_ += message.requests_.length;
					peer.statSendMessage_(message);
					peer.session_.send(message);
					message.requests_ = [];
					appendDuration = 0;
					peer = null;
					break;
				}
			}
			if (message.requests_.length > 0 && peer != null) {
				if (peer.pendingRequestCount_ <= 0) {
					peer.lastSegmentId_ = segment.id_;
				}
				peer.activeTime_ = nowTime;
				peer.pendingRequestCount_ += message.requests_.length;
				peer.statSendMessage_(message);
				peer.session_.send(message);
				message.requests_ = [];
				appendDuration = 0;
				peer = null;
			}
		}

		return {
			"stableDispatchPiece" : stableDispatchPiece,
			"peerInfo" : retPeer,
			"segmentInfo" : retSegment
		};
	},

	// updateUrgentSegment_:function( fromPlayer) {
	//		
	// var completedNum = 0;
	// for( var n = 0; n < this.metaData_.segments_.length ; n ++ )
	// {
	// var segment = this.metaData_.segments_[n];
	// if( segment.completedTime_ > 0 )
	// {
	// completedNum ++;
	// continue;
	// }
	// }
	// if(completedNum >= 3)
	// {
	// this.urgentSegmentIndex_ = completedNum - 1;
	// P2P_ULOG_TRACE(P2P_ULOG_FMT("Current Urgent Segment is :{0}",this.urgentSegmentIndex_));
	// }
	// },
	// getStorageBucket_:function() {
	// },

	onSchedule_ : function(shareMode) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		// if( lastScheduleTime_ + 300 * core::common::kMicroUnitsPerMilli > nowTime )
		// {
		// return;
		// }
		if (this.paused_) {
			// skip schedule
			return;
		}

		// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::Schedule {0} for channel({1}) ...", shareMode ? "share only" : "multi mode", this.id_));

		this.lastScheduleTime_ = nowTime;
		this.updatePeersSpeed_(nowTime, this.stablePeers_);
		// if( !shareMode ) this.updateUrgentSegment_();
		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::Schedule urgent segment index:{0}, id:{1}", this.urgentSegmentIndex_, this.urgentSegmentId_));
		if (this.playerSkipPosition_ > 0 && !this.playerPositionSkipped_) {
			// int mediaIndex = -1;
			// int64 skipDuration = playerSkipDuration_ > 0 ? playerSkipDuration_ : metaData_.directDuration_;
			// for( size_t n = 0; n < metaData_.segments_.size(); n ++ )
			// {
			// core::supernode::MetaSegment &segment = metaData_.segments_[n];
			// if( segment.completedTime_ <= 0 )
			// {
			// break;
			// }
			//				
			// if( segment.startTimeActual_ >= skipDuration )
			// {
			// // the first segment after advertisment
			// mediaIndex = (int)n;
			// break;
			// }
			// }
			//
			// if( mediaIndex >= 0 )
			// {
			// playerPositionSkipped_ = true;
			// for( size_t n = (size_t)mediaIndex; n < metaData_.segments_.size(); n ++ )
			// {
			// core::supernode::MetaSegment &segment = metaData_.segments_[n];
			// if( (segment.startTimeActual_ + segment.duration_) >= (skipDuration + playerSkipPosition_) )
			// {
			// // change urgent segment
			// urgentSegmentId_ = segment.id_;
			// break;
			// }
			// }
			// }
		}

		// check pieces to download
		var totalDuration = 0;
		var maxDuration = this.context_.p2pUrgentSize_ * 1000;
		this.urgentSegmentIndex_ = -1;
		for ( var n = 0; (this.urgentSegmentId_ >= 0) && (n < this.metaData_.segments_.length); n++) {
			var segment = this.metaData_.segments_[n];

			if (segment.id_ == this.urgentSegmentId_) {
				// find urgent segment index
				this.urgentSegmentIndex_ = n;
				this.context_.playingPosition_ = segment.startTimeActual_ / 1000;
			}

			if (this.urgentSegmentIndex_ >= 0 && n >= this.urgentSegmentIndex_) {
				if (totalDuration < maxDuration || this.urgentSegmentEndId_ <= this.urgentSegmentId_) {
					// urgent should has 2 segments at least if more segments eixst
					this.urgentSegmentEndId_ = segment.id_;
				}
				totalDuration += segment.duration_;
			}
		}

		if (!shareMode) {
			this.checkTimeoutPieces_(nowTime);
			this.checkTimeoutPeers_(nowTime);
			this.checkPeerPieceRanges_(nowTime);

			this.lastPeerSortTime_ = nowTime;
			this.stablePeers_.sort(function(item1, item2) {
				if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
					return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
				}
				return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
			});
			this.otherPeers_.sort(function(item1, item2) {
				if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
					return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
				}
				return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
			});
			this.statData_.addReceiveData_(true, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn, 0, 0); // flush speed
		}
		//
		this.metaData_.urgentSegmentId_ = this.urgentSegmentId_;
		this.updateUrgentIncompleteCount_();

		// urgent area stable peers first
		var retVal = null;
		if (!shareMode && (this.urgentSegmentIndex_ >= 0) && this.stablePeers_.length > 0) {
			retVal = this.dispatchStablePeers_(this.urgentSegmentIndex_);
			if (retVal != null && retVal.segmentInfo != null) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel Schedule {0} piece request(s) to ({1}), channel({2}), "
						+ "urgentSegmentId({3}), segmentID({4}), segmentPieces({5})", retVal.stableDispatchPiece, retVal.peerInfo.session_.remoteAddress_,// this.stablePeers_.length,
				this.id_, this.urgentSegmentId_, retVal.segmentInfo.id_,
						((this.urgentSegmentIndex_ < this.metaData_.segments_.length) ? this.metaData_.segments_[retVal.segmentInfo.id_].pieces_.length : 0)));
			}
		}
		//
		// // p2p area try other peers, sort by last receive speed
		// //if( manager_.getEnviroment_().p2pEnabled_ )
		// //if( urgentIncompleteCount_ <= 0 )

		this.otherPeerRequestCount_ = this.dispatchOtherPeers_((this.urgentSegmentIndex_ >= 0) ? this.urgentSegmentIndex_ : 0);

	},

	dispatchOtherPeers_ : function(startSegmentIndex) {
		if (this.otherPeers_.length == 0 || this.metaData_.segments_.length == 0) {
			return 0;
		}

		// p2p area try other peers, sort by last receive speed
		var stableTooSlow = false;
		var requestCount = this.getOtherPeerRequestCount_();
		var maxCount = this.urgentIncompleteCount_ > 0 ? this.context_.p2pMaxUrgentRequestPieces_ : this.context_.p2pMaxParallelRequestPieces_;
		var bucket = this.getStorageBucket_();
		var offsetIndex = -1;
		var usedSegmentCount = 0;
		var usedOffsetBytes = 0;
		var maxOffsetBytes = bucket.getDataCapacity_() * 2 / 3;
		//
		// // forward offset
		if (startSegmentIndex >= 0) {
			// size_t startIndex = startSegmentIndex;
			var totalDuration = 0;
			var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1500 : 2000); // 2 ratio of urgent size
			stableTooSlow = this.getStablePeersSpeedTooSlow_();
			for ( var n = startSegmentIndex; requestCount < maxCount && n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				totalDuration += segment.duration_;
				usedSegmentCount++;
				if (segment.size_ > 0) {
					// to avoid too many bytes
					usedOffsetBytes += segment.size_;
					if (usedOffsetBytes > maxOffsetBytes || (usedSegmentCount + 5) > bucket.getMaxOpenBlocks_()) {
						break;
					}
				} else if (usedSegmentCount > 10) {
					// to avoid too many segments
					break;
				}

				if (segment.p2pDisabled_) {
					continue;
				}
				if (totalDuration <= maxDuration && !stableTooSlow && this.urgentSegmentIndex_ >= 0) {
					continue;
				}
				if (offsetIndex < 0) {
					offsetIndex = n;
				}
				requestCount = this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
				if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
					// urgent incompleted
					break;
				}
			}
		}
		//
		if (offsetIndex < 0) {
			return requestCount;
		}
		//
		// // backward check
		for ( var n = offsetIndex; requestCount < maxCount && n >= 0 && n >= startSegmentIndex; n--) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_ || segment.completedTime_ > 0) {
				continue;
			}
			requestCount += this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
		}
		return requestCount;
	},

	dispatchSegmentForOtherPeers_ : function(stableTooSlow, requestCount, maxCount, segment) {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		for ( var k = 0; requestCount < maxCount && k < segment.pieces_.length; k++) {
			var piece = segment.pieces_[k];
			if (piece.completedTime_ > 0 || piece.size_ <= 0) {
				// completed
				continue;
			} else if (piece.receiveStartTime_ > 0) // || k == 4 ) // test only
			{
				// duplicate receiving
				var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
				if (piece.receiveStartTime_ + pieceTimeout > nowTime) {
					if (!piece.receiveByStable_ || !stableTooSlow) {
						// not expired
						continue;
					}
				}
			}

			var peer = this.getNextIdleOtherPeer_(piece.type_, piece.id_);

			if (peer == null) {
				// no idle peer has this piece
				continue;
			}

			var message = new p2p$.com.webp2p.protocol.base.Message();
			var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
			requestItem.segmentId_ = segment.id_;
			requestItem.pieceType_ = piece.type_;
			requestItem.pieceId_ = piece.id_;
			requestItem.checksum_ = piece.checksum_;
			message.requests_.push(requestItem);
			piece.receiveByOther_ = true;
			piece.receiveSessionId_ = peer.sessionId_;
			piece.receiveStartTime_ = nowTime;
			peer.activeTime_ = nowTime;
			peer.lastSegmentId_ = segment.id_;
			peer.receivePiece_ = piece;
			peer.statSendMessage_(message);
			peer.statReceiveBegin_();
			peer.session_.send(message);
			requestCount++;

			// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::dispatchSegmentForOtherPeer"));
		}

		return requestCount;
	},

	sortStablePeers_ : function() {
		// for ( var n = 0; n < this.stablePeers_.length; n++) {
		// var item = this.stablePeers_[n];
		// }
	},

	onTimeout_ : function(tag) {

		switch (tag) {
		case p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule: {
			this.onSchedule_(false);
			this.setScheduleTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule, 3 * 1000);
			break;
		}
		case p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerReport: {
			this.onReport_();
			this.setReportTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerReport, this.context_.statReportInterval_ * 1000);
			break;
		}
		default:
			break;
		}

	},

	// override protocol::base::EventListener
	onProtocolSessionMessage_ : function(session, message) {
		this._super(session, message);
	}
});p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.Pool = CdeBaseClass.extend_({
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

	selectorRedirectTimes_ : 0,
	selectorTryTimes_ : 0,
	selectorSuccessTime_ : 0,
	selectorRedirectNeeded_ : false,
	selectorRedirectHost_ : "",
	selectorResponseResult_ : "",

	init : function(enviroment, context, metaData, baseChannel) {
		this.enviroment_ = enviroment;
		this.context_ = context;
		this.metaData_ = metaData;
		this.eventListener_ = baseChannel;
		this.managers_ = [];
		this.http_ = null;
		this.valid_ = false;
		this.context_.webrtcServerHost_ = "ws://123.125.89.103:3852";
		this.context_.gatherServerHost_ = "111.206.208.61:80";
		this.context_.stunServerHost_ = "stun:111.206.210.145:8124";
	},

	initialize_ : function() {
		P2P_ULOG_INFO("protocol::base::Pool Intialize pool for type(" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.metaData_.type_)
				+ "), p2p group id(" + this.metaData_.p2pGroupId_ + "), channel(" + this.metaData_.storageId_ + ")");

		// clear exists managers
		this.exit();

		this.valid_ = true;
		var newManager = new p2p$.com.webp2p.protocol.cdn.Manager(this, this.eventListener_);
		newManager.open();
		this.managers_.push(newManager);

		// start selector
		this.queryFromSelector_();
		return true;
	},

	exit : function() {
		this.valid_ = false;

		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.http_ != null) {
			this.http_.log("cancel");
			// http_->close();
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
		// reset p2p status
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

	queryFromSelector_ : function() {
		if (!this.metaData_.p2pGroupId_) {
			return;
		}

		if (this.http_ != null) {
			this.http_.log("cancel");
			// http_->close();
			this.http_ = null;
		}

		var hostDomain = this.enviroment_.getHostDomain_("selector.webp2p.letv.com");
		if (this.selectorTryTimes_ > 2) {
			hostDomain = "111.206.210.139";// "111.206.210.139";106.38.226.122
		}
		var localMacAddress = p2p$.com.webp2p.core.common.String.urlEncodeNonAscii_(this.enviroment_.getLocalMacAddresses_());
		var hardwareType = p2p$.com.webp2p.core.common.String.urlEncodeNonAscii_(this.enviroment_.deviceType_);
		var requestUrl = p2p$.com.webp2p.core.common.String.format("http://{0}/query?streamid={1}&type={2}&module=cde&version={3}&geo={4}"
				+ "&isp={5}&country={6}&province={7}&city={8}&area={9}&appid={10}&mac={11}&hwtype={12}",
				this.selectorRedirectNeeded_ ? this.selectorRedirectHost_ : hostDomain, this.metaData_.p2pGroupId_,
				p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeWebRTC + p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeHttpTracker
						+ p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeStunServer, this.context_.moduleVersion_, this.context_.geo_, this.context_.isp_,
				this.context_.country_, this.context_.province_, this.context_.city_, this.context_.area_, this.enviroment_.appId_, localMacAddress,
				hardwareType);
		this.selectorRedirectNeeded_ = false;
		this.http_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(requestUrl, this, "GET", "json", "base::selector");
		this.http_.load();
		// set selector timer
		this.setSelectorTimeout_(10 * 1000);
	},

	parseSelectorResponse_ : function(downloader) {
		var result = downloader.responseData_;
		if (result == "" || result == null) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::base::Pool Parse selector response data failed: channel({1})", this.metaData_.storageId_));
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
						this.context_.stunServerHost_ = "stun:" + item.serviceUrls;
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
				// if( value.hasOwnProperty("specialPlayerTimeOffset") )
				// {
				// this.enviroment_.specialPlayerTimeOffset_ = value["specialPlayerTimeOffset"];
				// this.context_.specialPlayerTimeOffset_ = this.enviroment_.specialPlayerTimeOffset_;
				// }
				// if( value.hasOwnProperty("specialPlayerTimeLimit") )
				// {
				// this.enviroment_.specialPlayerTimeLimit_ = value["specialPlayerTimeLimit"];
				// this.context_.specialPlayerTimeLimit_ = this.enviroment_.specialPlayerTimeLimit_;
				// }
				// if( this.enviroment_.downloadSpeedRatio_ < 0 && this.context_.downloadSpeedRatio_ < 0 && value.hasOwnProperty("downloadSpeedRatio") )
				// {
				// this.context_.downloadSpeedRatio_ = value["downloadSpeedRatio"];
				// }
			}

			// storage memory capacity
			// value["storageMemoryCapacity"] = (json::Int64)100 * 1024 * 1024; // test
			// if( value.hasOwnProperty("storageMemoryCapacity") )
			// {
			// var storageMemoryCapacity = value["storageMemoryCapacity"];
			// var memoryBucket = p2p$.com.webp2p.core.storage.Pool.getMemoryBucket_();
			// memoryBucket.setDataCapacity_(storageMemoryCapacity);
			//				
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::base::Pool Set memory storage bucket data capacity( {0}/{1} bytes)...",
			// storageMemoryCapacity, memoryBucket.getDataCapacity_()));
			// }
			//
			// // storage live switch
			// //value["storageLiveMemory"] = false; // test
			// if( value.hasOwnProperty("storageLiveMemory") )
			// {
			// var oldMemoryOnly = this.enviroment_.liveStorageMemoryOnly_;
			// this.enviroment_.liveStorageMemoryOnly_ = value["storageLiveMemory"];
			//
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::base::Pool Set live storage memory from {0} to {1}, take effect next time...",
			// oldMemoryOnly ? "on" : "off", this.enviroment_.liveStorageMemoryOnly_ ? "on" : "off"));
			// }
			//
			// // storage vod switch
			// //value["storageVodMemory"] = false; // test
			// if( value.hasOwnProperty("storageVodMemory") )
			// {
			// var oldMemoryOnly = this.enviroment_.vodStorageMemoryOnly_;
			// this.enviroment_.vodStorageMemoryOnly_ = value["storageVodMemory"];
			//
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::base::Pool Set vod storage memory from {0} to {1}, take effect next time...",
			// oldMemoryOnly ? "on" : "off", this.enviroment_.vodStorageMemoryOnly_ ? "on" : "off"));
			// }
			if (value.hasOwnProperty("protocols")) {
				var specificProtocols = value["protocols"];
				// this.context_.protocolCdnDisabled_ = specificProtocols["cdn"]["disabled"];
				this.context_.protocolRtmfpDisabled_ = specificProtocols["rtmfp"]["disabled"];
				this.context_.protocolWebsocketDisabled_ = specificProtocols["websocket"]["disabled"];
				this.context_.protocolWebrtcDisabled_ = specificProtocols["webrtc"]["disabled"];
			}

			return true;
		} else {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::base::Pool Selector response error:{0}, channel({1})", this.selectorResponseResult_,
					this.metaData_.storageId_));
			// this.removeSelectorTimer_();
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
			this.http_ = null;
		}

		this.selectorTryTimes_++;
		P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::base::Pool Selector timeout for channel({0}), {1} try times...", this.metaData_.storageId_,
				this.selectorTryTimes_));
		this.queryFromSelector_();
		// this.selectorSuccessTime_ = 1;
		// this.createOtherProtocols_();
	},

	// override core::supernode::HttpDownloader
	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;
		if (this.http_ != downloader) {
			// expired
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::base::Pool Expired http complete for tag({0}), channel({1}), ignore", this.http_.tag_,
					this.metaData_.storageId_));
			return handled;
		}

		this.http_ = null;
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::base::Pool  " + "Http complete for tag({0}), channel({1}), response code({2}), details({3}), size({4})",
				downloader.tag_, this.metaData_.storageId_, downloader.responseCode_, downloader.responseDetails_, downloader.responseData_.length));

		if (downloader.tag_ == "base::selector") {
			handled = true;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				// this.removeSelectorTimer_();
				// this.onSelectorTimeout_();
				return handled;
			}

			// parse selector response
			if (!this.parseSelectorResponse_(downloader)) {
				// waiting for timeout and retry ...
				return handled;
			} else if (this.selectorRedirectNeeded_) {
				this.selectorRedirectTimes_++;
				P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::base::Pool Selector redirect to({0}), total {1} redirect times ..."), this.selectorRedirectHost_,
						this.selectorRedirectTimes_);
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

			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::base::Pool "
					+ "Query from selector successfully, gather(http://{0}), webrtc({1}), tracker(http://{2}), stun({3})"
					+ "max peers({4}), urgent size({5}), channel({6}), "
					+ "rtmfp({7}), websocket({8}), webrtc({9}), upload({10}), urgent upload({11}), range interval({12} s), "
					+ "upload limit({13}), init throttle({14} B/s), avg throttle({15} B/s), max reserved({16} B/s)", this.context_.gatherServerHost_,
					this.context_.webrtcServerHost_, this.context_.trackerServerHost_, this.context_.stunServerHost_, this.context_.p2pMaxPeers_,
					this.context_.p2pUrgentSize_, this.metaData_.storageId_, this.context_.protocolRtmfpDisabled_ ? "no" : "yes",
					this.context_.protocolWebsocketDisabled_ ? "no" : "yes", this.context_.protocolWebrtcDisabled_ ? "no" : "yes",
					this.context_.p2pUploadEnabled_ ? "yes" : "no", this.context_.p2pUrgentUploadEnabled_ ? "yes" : "no", this.context_.p2pShareRangeInterval_,
					this.context_.p2pUploadLimit_ ? "yes" : "no", this.context_.p2pUploadThrottleInit_, this.context_.p2pUploadThrottleAverage_,
					this.context_.p2pUploadMaxReserved_));

			this.selectorSuccessTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			this.context_.selectorServerHost_ = downloader.remoteEndpoint_;
			this.context_.selectorConnectedTime_ = downloader.totalUsedTime_;
			this.eventListener_.onProtocolSelectorOpen_(p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess);
			this.createOtherProtocols_();
		}

		return handled;
	},

	createOtherProtocols_ : function() {
		// p2p not support under mobile network
		var isMobileNow = this.enviroment_.isMobileNetwork_();
		if (this.metaData_.p2pGroupId_ == "" || this.p2pActive_ || this.selectorSuccessTime_ <= 0 || isMobileNow) {
			return true;
		}

		if (!this.context_.protocolWebrtcDisabled_ && !this.enviroment_.protocolWebrtcDisabled_) {
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
	}
});p2p$.ns('com.webp2p.protocol.base');
p2p$.com.webp2p.protocol.base.PROTOCOL_STATES = {
	kProtocolStateReady : 0,
	kProtocolStateConnecting : 1,
	kProtocolStateConnected : 2,
	kProtocolStateDisconnecting : 3,
	kProtocolStateDisconnected : 4
};

p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES = {
	kProtocolTypeReserved : 0,
	kProtocolTypeCdn : 1,
	kProtocolTypeRtmfp : 2,
	kProtocolTypeWebSocket : 3,
	kProtocolTypeWebrtc : 4,
	kProtocolTypeMax : 5
};

p2p$.com.webp2p.protocol.base.TERMINAL_TYPES = {
	kTerminalTypeReserved : 0,
	kTerminalTypePc : 1,
	kTerminalTypeTv : 2,
	kTerminalTypeBox : 3,
	kTerminalTypeMobile : 4,
	kTerminalTypeMax : 5
};

p2p$.com.webp2p.protocol.base.ManagerStatic = {
	getTerminalType_ : function(type) {
		var typeMark = null;
		var pos = type.indexOf('/');
		if (pos == -1) {
			typeMark = type;
		} else if (pos > 0) {
			typeMark = type.substr(0, pos);
		}
		var lowerTypeMark = p2p$.com.webp2p.core.common.String.makeLower_(typeMark);
		if (p2p$.com.webp2p.core.common.String.startsWith_(lowerTypeMark, "un")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc;
		} else if (p2p$.com.webp2p.core.common.String.startsWith_(lowerTypeMark, "pc")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc;
		} else if (p2p$.com.webp2p.core.common.String.startsWith_(lowerTypeMark, "tv")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv;
		} else if (p2p$.com.webp2p.core.common.String.startsWith_(lowerTypeMark, "box")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox;
		} else if (p2p$.com.webp2p.core.common.String.startsWith_(lowerTypeMark, "mp")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
		} else if (p2p$.com.webp2p.core.common.String.startsWith_(lowerTypeMark, "iphone")) {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
		} else if (lowerTypeMark.length > 0) {
			switch (lowerTypeMark[0]) {
			case 'C':
			case 'c': // C1,C1S
			case 'T':
			case 't': // T1, T1S
				return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox;
				break;

			case 'X':
			case 'x': // X50 X60
			case 'S':
			case 's': // S40, S50, S70
				return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv;
				break;

			default:
				return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
				break;
			}
		} else {
			return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved;
		}
	},
};

p2p$.com.webp2p.protocol.base.Manager = CdeBaseClass.extend_({
	// boost::asio::io_service &service_;
	pool_ : null,
	eventListener_ : null,
	sessions_ : null,

	type_ : 0,
	protocolState_ : 0,
	maxActiveSession_ : 0,

	id_ : "",
	serverId_ : "",
	serverUrl_ : "",

	init : function(pool, evt, type) {
		this.pool_ = pool;
		this.eventListener_ = evt;
		this.type_ = type;
		this.protocolState_ = p2p$.com.webp2p.protocol.base.PROTOCOL_STATES.kProtocolStateReady;
		this.maxActiveSession_ = 20;
		this.sessions_ = [];
	},

	getId_ : function() {
		return this.id_;
	},
	getType : function() {
		return this.type_;
	},
	getTypeNames_ : function(type) {
		switch (type) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeReserved:
			return "reserved";
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
			return "cdn";
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			return "rtmfp";
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			return "websocket";
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			return "webrtc";
		default:
			return "unknown";
		}
	},
	getTypeName_ : function() {
		return this.getTypeNames_(this.type_);
	},

	// boost::asio::io_service &getService(){ return service_; }
	getPool_ : function() {
		return this.pool_;
	},

	getEventListener_ : function() {
		return this.eventListener_;
	},

	setTimeout_ : function(tag, timer, milliSeconds) {
		var me = this;
		timer = setTimeout(function() {
			me.onTimeout_(tag, timer);
		}, milliSeconds);
		return timer;
	},

	onTimeout_ : function(tag, timer, errorCode) {
	},

	setMaxActiveSession_ : function(count) {
		this.maxActiveSession_ = count;
	},

	isStable_ : function() {
		return p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn == this.type_;
	},

	open : function() {
	},
	close : function() {
	}
});p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.Session = CdeBaseClass.extend_({
	manager_ : null,
	name_ : "",
	remoteId_ : "",
	remoteAddress_ : "",
	remoteType_ : "",
	opened_ : false,
	active_ : false,
	terminalType_ : 0,

	init : function(mgr, remoteId) {
		this.manager_ = mgr;
		this.remoteId_ = remoteId;
		this.opened_ = false;
		this.active_ = false;
		this.terminalType_ = p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved;
	},

	setTimeout_ : function(tag, timer, milliSeconds) {
		var me = this;
		me.timer_ = setTimeout(function() {
			me.onTimeout_(tag, me.timer_);
		}, milliSeconds);
	},

	// onTimeout_:function( tag, timer, errorCode ) {
	//		
	// },

	open : function() {
		this.opened_ = true;
		return true;
	},

	close : function() {
		this.opened_ = false;
		return true;
	},

	send : function(message) {
		return false;
	},

	send : function(stream) {
		return false;
	},

	control : function(ctrl) {
		return false;
	},

	getLastReceiveSpeed_ : function() {
		return -1;
	},
	getUpdateReceiveSpeed_ : function(nowTime, waiting) {
		return -1;
	},
	isActive_ : function() {
		return this.active_;
	},
	isStable_ : function() {
		return this.manager_.isStable_();
	},

	getManager_ : function() {
		return this.manager_;
	},
	getName_ : function() {
		return this.name_;
	},
	getRemoteId_ : function() {
		return this.remoteId_;
	},
	getRemoteAddress_ : function() {
		return this.remoteAddress_;
	},
	getRemoteType_ : function() {
		return this.remoteType_;
	},
	getTerminalType_ : function() {
		return this.terminalType_;
	},
	getType : function() {
		return this.manager_.getType();
	},
	getTypeName_ : function() {
		return this.manager_.getTypeName_();
	},

	setName : function(name) {
		this.name_ = name;
	},
	setRemoteAddress_ : function(address) {
		this.remoteAddress_ = address;
	},
	setRemoteType_ : function(type) {
		this.remoteType_ = type;
	},
	setTerminalType_ : function(type) {
		this.terminalType_ = type;
	},
	updateTerminalType_ : function() {
		if (this.manager_.isStable_() || p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved != this.terminalType_) {
			return;
		}
		this.terminalType_ = p2p$.com.webp2p.protocol.base.ManagerStatic.getTerminalType_(this.remoteType_ == "" ? this.name_ : this.remoteType_);
	}
});p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.PieceRangeItem = CdeBaseClass.extend_({
	type_ : 0,
	count_ : 0,
	start_ : 0,
	init : function() {
		this.type_ = 0;
		this.count_ = 0;
		this.start_ = 0;
	},
});

p2p$.com.webp2p.protocol.base.RequestDataItem = CdeBaseClass.extend_({
	urgent_ : false,
	segmentId_ : 0,
	pieceId_ : 0,
	pieceType_ : 0,
	checksum_ : 0,
	init : function() {
		this.urgent_ = false;
		this.segmentId_ = -1;
		this.pieceId_ = 0;
		this.pieceType_ = 0;
		this.checksum_ = 0;
	},
});

p2p$.com.webp2p.protocol.base.ResponseDataItem = CdeBaseClass.extend_({
	segmentId_ : 0,
	pieceId_ : 0,
	pieceType_ : 0,
	pieceKey_ : 0,
	data_ : "",
	init : function() {
		this.segmentId_ = -1;
		this.pieceId_ = 0;
		this.pieceType_ = 0;
		this.pieceKey_ = 0;
	},
});

p2p$.com.webp2p.protocol.base.Message = CdeBaseClass.extend_({
	type_ : "",
	ranges_ : null,
	requests_ : null,
	responses_ : null,
	init : function() {
		this.type_ = 0;
		this.ranges_ = [];
		this.requests_ = [];
		this.responses_ = [];
	},
	empty : function() {
		return this.ranges_.length == 0 && this.requests_.length == 0 && this.responses_.length == 0;
	}
});p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE = {
	kTimerTypeOpen : 0,
	kTimerTypeMeta : 1,
	kTimerTypeRangeDownload : 2
};

p2p$.com.webp2p.protocol.cdn.Session = p2p$.com.webp2p.protocol.base.Session.extend_({
	metaUrl_ : null,
	firstSegmentUrl_ : null,
	metaData_ : null,
	downloader_ : null,
	timer_ : null,
	drmDrypto_ : null,
	downloadingRange_ : null,
	pendingRanges_ : null,

	primary_ : false,
	metaTryTimes_ : 0,
	activeTime_ : 0,
	maxRangeDownloadTime_ : 0,
	lastReceiveSpeed_ : 0,
	lastStartReceiveTime_ : 0,
	lastTotalReceiveBytes_ : 0,

	init : function(mgr, remoteId, nodeIndex, drm) {
		this._super(mgr, remoteId);
		this.nodeIndex_ = nodeIndex;
		this.drmDrypto_ = drm;
		this.activeTime_ = 0;
		this.metaTryTimes_ = 0;
		this.maxRangeDownloadTime_ = 30 * 1000; // ms
		this.lastReceiveSpeed_ = 0;
		this.lastStartReceiveTime_ = 0;
		this.lastTotalReceiveBytes_ = 0;
		this.metaData_ = new p2p$.com.webp2p.core.supernode.MetaData();
		var mainMeta = this.manager_.getPool_().getMetaData_();
		this.metaUrl_ = new p2p$.com.webp2p.core.supernode.Url();
		this.firstSegmentUrl_ = new p2p$.com.webp2p.core.supernode.Url();
		this.pendingRanges_ = new p2p$.com.webp2p.core.common.Map();
		if (this.remoteId_.length == 0) {
			// primary session
			this.primary_ = true;
			this.metaData_ = mainMeta;
			this.remoteId_ = this.metaData_.sourceUrl_;
			this.lastReceiveSpeed_ = this.metaData_.lastReceiveSpeed_;
			if (this.metaData_.segments_.length > 0) {
				this.firstSegmentUrl_.fromString_(this.metaData_.segments_[0].mediaUrl_);
			}
		} else {
			this.primary_ = false;
			this.metaData_.verifyMethod_ = mainMeta.verifyMethod_;
			this.metaData_.rangeParamsSupported_ = mainMeta.rangeParamsSupported_;
			this.metaData_.sourceUrl_ = this.remoteId_;
		}
		this.metaUrl_.fromString_(this.metaData_.primaryDataUrl_ == "" ? this.metaData_.sourceUrl_ : this.metaData_.primaryDataUrl_);
		this.remoteAddress_ = (this.primary_ ? "* " : "") + (this.metaUrl_.host_ + ":") + ((this.metaUrl_.port_ == 0) ? 80 : this.metaUrl_.port_);
		this.metaData_.sourceServer_ = this.metaUrl_.host_ + ":" + ((this.metaUrl_.port_ == 0) ? 80 : this.metaUrl_.port_);
		this.downloadingRange_ = new p2p$.com.webp2p.protocol.cdn.RequestRange();
	},

	attachMeta_ : function(index) {
		var mainMeta = this.manager_.getPool_().getMetaData_();
		this.metaData_ = mainMeta;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (index < segment.moreMediaUrls_.size()) {
				segment.mediaUrl_ = segment.moreMediaUrls_[index];
			}
			segment.moreMediaUrls_ = [];
		}
	},

	cleanAllPending_ : function() {
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::cdn::Session [{0}]Clean all pending requests, session({1})", p2p$.com.webp2p.core.common.Enum
				.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.remoteAddress_));

		// stop timer
		if (this.timer_ != null) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.downloader_ != null) {
			this.downloader_.log("clean");
			this.downloader_.close();
			this.downloader_ = null;
		}
		this.pendingRanges_.clear();
		this.downloadingRange_.downloading_ = false;
	},

	downloadMeta_ : function() {
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.downloader_ != null) {
			// downloader_->log("cancel");
			// downloader_->close();
		}
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(this.metaData_.sourceUrl_, this, "GET", "", "cdn::meta");
		this.downloader_.load();
		// set meta timer
		this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta, this.timer_, 10 * 1000);
	},

	downloadNextRange_ : function(retry) {
		if (this.downloader_ != null) {
			// busy
			return;
		}

		if (!retry) {
			if (this.pendingRanges_.empty()) {
				// completed
				return;
			}
			var forkRange = new p2p$.com.webp2p.protocol.cdn.RequestRange();
			this.downloadingRange_ = this.pendingRanges_.element(0).value;

			this.downloadingRange_.preparePieces_(forkRange);
			if (forkRange.pieces_.length == 0) {
				this.pendingRanges_.clear();
			}
		}

		var requestUrl = this.downloadingRange_.url_;
		this.downloadingRange_.downloading_ = true;
		this.downloadingRange_.dataUsed_ = 0;
		this.downloadingRange_.pieceUsed_ = 0;
		if (this.downloadingRange_.length_ > 0) {

			var offsetBegin = Math.max(this.downloadingRange_.urlOffset_, 0) + this.downloadingRange_.offset_;
			var offsetEnd = offsetBegin + this.downloadingRange_.length_ - 1;
			if (this.manager_.getPool_().getMetaData_().rangeParamsSupported_) {
				if (requestUrl.indexOf('?') == -1) {
					requestUrl += "?";
				} else {
					requestUrl += "&";
				}
				requestUrl += p2p$.com.webp2p.core.common.String.format("rstart={0}&rend={1}", offsetBegin, offsetEnd);

			}
			// P2P_ULOG_INFO(P2P_ULOG_FMT("com.webp2p.protocol.cdn.Session.downloadNextRange_",));
			// else
			// {
			// using http range header instead of rstart,rend
			// downloader_->requestHeaders_["Range"] = core::common::String::format("bytes=" _I64FMT_ "-" _I64FMT_, offsetBegin, offsetEnd);
			// }
		}

		if (requestUrl.indexOf('?') == -1) {
			requestUrl += "?";
		} else {
			requestUrl += "&";
		}

		// requestUrl += p2p$.com.webp2p.core.common.String.format("curSegment={0}&sIndex={1}&eIndex={2}", this.downloadingRange_.segmentId_,
		// this.downloadingRange_.startIndex_, this.downloadingRange_.endIndex_);

		// addtional appid
		if (requestUrl.indexOf("&appid=") == -1 && requestUrl.indexOf("?appid=") == -1) {
			var externalAppId = p2p$.com.webp2p.core.common.String.urlEncode_(this.manager_.getPool_().getEnviroment_().externalAppId_);
			var moduleVersion = p2p$.com.webp2p.core.common.String.fromNumber(p2p$.com.webp2p.core.common.Module.getkCdeFullVersion_());
			if (requestUrl.indexOf('?') == -1) {
				requestUrl += "?";
			} else {
				requestUrl += "&";
			}
			requestUrl += p2p$.com.webp2p.core.common.String.format("appid={0}&cde={1}", externalAppId, moduleVersion);
		}
		//
		// // p1,p2,p3 parameters, cdn server may take those parameters
		if (this.manager_.getPool_().getContext_().addtionalParams_ != "" && requestUrl.indexOf("&p1=") == -1 && requestUrl.indexOf("?p1=") == -1) {
			if (requestUrl.indexOf('?') == -1) {
				requestUrl += "?";
			} else {
				requestUrl += "&";
			}
			requestUrl += this.manager_.getPool_().getContext_().addtionalParams_;
		}

		requestUrl += p2p$.com.webp2p.core.common.String.format("&ajax={0}", 1);
		//
		this.lastTotalReceiveBytes_ = 0;
		this.lastStartReceiveTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(requestUrl, this, "GET", "arraybuffer", "cdn::range-data");
		this.downloader_.setInfo_(this.downloadingRange_);
		this.downloader_.load();
		this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeRangeDownload, this.timer_, this.maxRangeDownloadTime_);
	},

	parseMetaResponse_ : function(downloader) {
		if (!this.metaData_.load(downloader.responseData_, downloader.totalUsedTime_)) {
			P2P_ULOG_ERROR("protocol::cdn::Session[" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_)
					+ "]Parse meta response failed, url(" + this.metaData_.sourceUrl_ + "), channel(" + this.manager_.getPool_().getMetaData_().storageId_
					+ "), size(" + downloader.responseData_.length + ")");
			return false;
		}
		return true;
	},

	onOpenTimeout_ : function(errorCode) {
		this.manager_.getEventListener_().onProtocolSessionOpen_(this);
	},

	onMetaTimeout_ : function(errorCode) {
		if (this.downloader_ != null) {
			this.downloader_.log("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}
		if (++this.metaTryTimes_ != 0) {
			var tryTimes = this.metaTryTimes_ < 3 ? "retry again ..." : "meta failed";
			P2P_ULOG_ERROR("protocol::cdn::Session [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_)
					+ "]Meta timeout for url(" + this.metaData_.sourceUrl_ + "), channel(" + this.manager_.getPool_().getMetaData_().storageId_ + "), "
					+ this.metaTryTimes_ + " try times, " + tryTimes);
		}
		if (this.metaTryTimes_ < 3) {
			this.downloadMeta_();
		}
	},

	onRangeDownloadTimeout_ : function(errorCode) {

		if (this.downloader_ != null) {
			this.downloader_.log("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}
		// downloader_.reset();

		// retry by scheduler ...
		this.downloadingRange_.downloading_ = false;
		this.downloadingRange_.tryTimes_++;
		this.lastReceiveSpeed_ = 0;
		P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::cdn::Session [{0}] Range download timeout, segment({1}), items({2})", p2p$.com.webp2p.core.common.Enum
				.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.downloadingRange_.segmentId_, this.downloadingRange_.pieces_.length));

		var segmentIndex = -1;
		if (this.downloadingRange_.segmentId_ >= 0) {
			segmentIndex = this.metaData_.getSegmentIndexById_(this.downloadingRange_.segmentId_);
		}
		if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::cdn::Session::onRangeDownloadTimeout segment({0}) not found", this.downloadingRange_.segmentId_));
			return null;
		}
		var segment = this.metaData_.segments_[segmentIndex];
		for ( var k = 0; k < segment.pieces_.length; k++) {
			// setting receiveStartTime_ = 0
			// waiting schedule
			var piece = segment.pieces_[k];
			if (piece.completedTime_ > 0) {
				continue;
			}
			piece.receiveStartTime_ = 0;
		}
		// if( this.downloadingRange_.pieces_.length > 0 )
		// {
		// var emptyResponse = new p2p$.com.webp2p.protocol.base.Message();
		// //emptyResponse.responses_.resize(downloadingRange_.pieces_.size());
		// for( var n = 0; n < this.downloadingRange_.pieces_.length; n ++ )
		// {
		// var item = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
		// item.pieceId_ = -1;
		// item.segmentId_ = this.downloadingRange_.segmentId_;
		// emptyResponse.responses_.push(item);
		// }
		// this.manager_.getEventListener_().onProtocolSessionMessage_(this, emptyResponse);
		// }

		// if( downloadingRange_.tryTimes_ <= 3 )
		// {
		// this.downloadNextRange_(true);
		// }
		// else
		// {
		// this.downloadNextRange_(false);
		// }
	},

	// override protocol::base::Session
	onTimeout_ : function(tag, timer, errorCode) {
		if (timer != this.timer_ || !this.opened_) {
			return;
		}

		// stop timer
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}

		switch (tag) {
		case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeOpen:
			this.onOpenTimeout_(errorCode);
			break;
		case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta:
			this.onMetaTimeout_(errorCode);
			break;
		case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeRangeDownload:
			this.onRangeDownloadTimeout_(errorCode);
			break;
		default:
			break;
		}
	},

	// override core::supernode::HttpDownloaderListener
	onHttpDownloadData_ : function(downloader) {
		var handled = false;

		if (this.downloader_ != downloader) {
			// expired
			P2P_ULOG_INFO("protocol::cdn::Session::onHttpDownloadData ["
					+ p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_) + "]Expired http complete for tag("
					+ downloader.tag_ + "), url(" + downloader.fullUrl_ + "), channel(" + this.manager_.getPool_().getMetaData_().storageId_
					+ "), response code(" + downloader.responseCode_ + "), details(" + downloader.responseDetails_ + "), size("
					+ downloader.responseData_.length + "), ignore");
			return handled;
		}

		if (downloader.tag_ == "cdn::range-data") {

		}
	},

	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;

		if (this.downloader_ != downloader) {
			// expired
			P2P_ULOG_INFO("protocol::cdn::Session::onHttpDownloadCompleted ["
					+ p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_) + "]Expired http complete for tag("
					+ downloader.tag_ + "), url(" + downloader.fullUrl_ + "), channel(" + this.manager_.getPool_().getMetaData_().storageId_
					+ "), response code(" + downloader.responseCode_ + "), details(" + downloader.responseDetails_ + "), size("
					+ downloader.responseData_.length + "), ignore");
			return handled;
		}
		// P2P_ULOG_INFO("this.download:",this.downloader_);
		this.downloader_ = null;
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (downloader.tag_ == "cdn::meta") {
			P2P_ULOG_INFO("protocol::cdn::Session [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_)
					+ "]Meta complete " + ((downloader.successed_ && downloader.responseCode_ == 200) ? "OK" : "FAILED") + ", url(" + downloader.fullUrl_
					+ "), channel(" + this.manager_.getPool_().getMetaData_().storageId_ + ")");

			if (downloader.successed_ /* && !downloader.remoteEndpoint_.empty() */) {
				this.remoteAddress_ /* = (primary_ ? "* " : "") + downloader.remoteEndpoint_ */;
			}

			handled = true;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				return handled;
			}

			this.metaData_.lastReceiveSpeed_ = downloader.transferedSpeed_;
			this.lastReceiveSpeed_ = downloader.transferedSpeed_;
			this.lastTotalReceiveBytes_ = downloader.transferedBytes_;

			// stop timer
			if (this.timer_) {
				clearTimeout(this.timer_);
				this.timer_ = null;
			}
			// parse meta data
			this.metaData_.storageId_ = this.manager_.getPool_().getMetaData_().storageId_;
			this.metaData_.finalUrl_ = downloader.fullUrl_;
			if (!this.parseMetaResponse_(downloader)) {
				return handled;
			}

			if (this.metaData_.segments_.length > 0) {
				this.firstSegmentUrl_.fromString_(this.metaData_.segments_[0].mediaUrl_);
			}

			this.active_ = true;
			this.downloadNextRange_(false);
			this.manager_.getEventListener_().onProtocolSessionOpen_(this);
		} else if (downloader.tag_ == "cdn::range-data") {
			if (this.downloadingRange_.dataUsed_ <= 0 /* && !downloader.remoteEndpoint_.empty() */) {
				// this.remoteAddress_ = (this.primary_ ? "* " : "") + downloader.remoteEndpoint_;
				// this.remoteAddress_ = "*" + this.remoteAddress_;
			}

			handled = true;
			if (downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				this.lastReceiveSpeed_ = 0;
				return handled;
			}

			// if( downloader.transferedBytes_ > 2000 )
			// {
			// to avoid speed jitter
			this.lastReceiveSpeed_ = downloader.transferedSpeed_;
			// }
			this.lastTotalReceiveBytes_ = downloader.transferedBytes_;

			// stop timer
			if (this.timer_) {
				clearTimeout(this.timer_);
				this.timer_ = null;
			}

			var dataOffset = this.downloadingRange_.dataUsed_;
			var message = new p2p$.com.webp2p.protocol.base.Message();
			while (this.downloadingRange_.pieceUsed_ < this.downloadingRange_.pieces_.length) {
				var piece = this.downloadingRange_.pieces_[this.downloadingRange_.pieceUsed_];
				if (piece.size_ <= 0) {
					if (piece.checksum_ != 0) {
						// maybe AD
						break;
					}
				} else if (piece.completedTime_ > 0) {
					// already completed
					if (this.downloadingRange_.length_ > 0) {
						dataOffset += piece.size_;
					}
					this.downloadingRange_.dataUsed_ += piece.size_;
					this.downloadingRange_.pieceUsed_++;
					continue;
				}

				if (this.downloadingRange_.length_ <= 0) {
					dataOffset = piece.offset_;
				}
				if ((dataOffset + piece.size_) > downloader.responseData_.length) {
					// incompleted
					break;
				}

				var responseData = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
				responseData.segmentId_ = this.downloadingRange_.segmentId_;
				responseData.pieceType_ = piece.type_;
				responseData.pieceId_ = piece.id_;
				responseData.pieceKey_ = piece.key_;
				if (piece.size_ <= 0) {
					responseData.data_ = downloader.responseData_;
				} else {
					responseData.data_ = downloader.responseData_.subarray(dataOffset, piece.size_ + dataOffset);
				}

				if (this.downloadingRange_.length_ > 0) {
					dataOffset += piece.size_;
				}
				this.downloadingRange_.dataUsed_ += piece.size_;
				this.downloadingRange_.pieceUsed_++;
				piece.completedTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
				// P2P_ULOG_INFO("segment:"+this.downloadingRange_.segmentId_+",pieceUsed_:"+this.downloadingRange_.pieceUsed_+
				// ",dataUsed_:"+this.downloadingRange_.dataUsed_);
				// if( !drmDrypto_.decrypt((void *)responseData.data_.data(), responseData.data_.size(), downloadingRange_.segmentId_) )
				// {
				// __ULOG_ERROR(__ULOG_FMT("protocol::cdn::Session", "[%s]Piece data decrypt failed, segment(" _I64FMT_ "), piece(%s," _I64FMT_ "),
				// url(%s), channel(%s)"),
				// core::common::getMetaTypeName_(manager_.getPool_().getMetaData_().type_),
				// responseData.segmentId_,
				// core::common::getPieceTypeName_(piece.type_),
				// piece.id_,
				// downloader.fullUrl_.c_str(),
				// manager_.getPool_().getMetaData_().storageId_.c_str());
				// break;
				// }
				message.responses_.push(responseData);
			}
			if (message.responses_.length != 0) {
				this.manager_.getEventListener_().onProtocolSessionMessage_(this, message);
			}
		}
	},

	open : function() {
		if (this.active_) {
			return true;
		}

		this._super();
		if (!this.metaData_.finalUrl_ == "") {
			this.active_ = true;
			// rank first
			if (this.lastReceiveSpeed_ <= 0) {
				this.lastReceiveSpeed_ = 200000;
			}
			this.lastReceiveSpeed_ = this.metaData_.lastReceiveSpeed_;
			this.manager_.getEventListener_().onProtocolSessionOpen_(this);
			// setTimeout(kTimerTypeOpen, &timer_, 1); // async
		} else if (this.metaUrl_.params_.get("__cde_attach__") != null) {
			var index = p2p$.com.webp2p.core.common.String.parseNumber_(metaUrl_.params_["__cde_attach__"], 0);
			this.attachMeta_(index);
			this.active_ = true;
			this.lastReceiveSpeed_ = 1;
			this.manager_.getEventListener_().onProtocolSessionOpen_(this);
		} else {
			// this.downloadMeta_();
			// delay open to avoid network congestion
			this.metaTryTimes_ = -1;
			this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta, this.timer_, 5 * 1000);
		}

		return true;
	},

	close : function() {
		this._super();
		if (this.timer_ != null) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.downloader_ != null) {
			this.downloader_.log("clean");
			this.downloader_.close();
			this.downloader_ = null;
		}
		return true;
	},

	send : function(message) {
		var emptyResponseCount = 0;
		var meta = this.metaData_.directMetaMode_ ? this.metaData_ : this.manager_.getPool_().getMetaData_();
		var globalMeta = this.manager_.getPool_().getMetaData_();
		//
		// // check expire segments
		if (this.downloadingRange_.downloading_ && this.downloadingRange_.segmentId_ < meta.urgentSegmentId_) {
			// cancel
			if (this.downloader_ != null) {
				this.downloader_.log("cancel");
				this.downloader_.close();
				this.downloader_ = null;
			}
			this.downloadingRange_.downloading_ = false;
		}
		// for( var n = 0 ; n < this.pendingRanges_.length; n++ )
		// {
		// var kv = this.pendingRanges_.element(n);
		// var range = kv.value;
		// if( range.segmentId_ < meta.urgentSegmentId_ )
		// {
		// // expired
		// emptyResponseCount += range.pieces_.length;
		// this.pendingRanges_.erase(kv.key);
		// }
		// }

		for ( var n = 0; n < message.requests_.length; n++) {
			var item = message.requests_[n];
			if (item.pieceId_ == -1) {
				// clean all requests
				this.lastReceiveSpeed_ = -1;
				this.lastStartReceiveTime_ = 0;
				this.lastTotalReceiveBytes_ = 0;
				this.cleanAllPending_();
				return true;
			}

			var index = -1;
			if (item.segmentId_ >= 0) {
				index = meta.getSegmentIndexById_(item.segmentId_);
			} else {
				index = meta.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
			}
			if (index < 0 || index >= meta.segments_.length) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::cdn::Session [{0}]Send piece from session({1}) not found, type({2}), id({3}), ignore it!",
						p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.remoteAddress_,
						p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.pieceType_), item.pieceId_));
				emptyResponseCount++;
				continue;
			}

			var segment = meta.segments_[index];
			var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
			if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
				emptyResponseCount++;
				continue;
			}

			var piece = segment.pieces_[pieceIndex];
			// if( this.downloadingRange_.downloading_ && this.downloadingRange_.segmentId_ == segment.id_ && this.downloadingRange_.length_ <= 0 )
			// {
			// // full range request, add piece is ok
			// if( !this.downloadingRange_.addPiece_(piece) )
			// {
			// emptyResponseCount ++;
			// }
			// continue;
			// }
			//
			var range = this.pendingRanges_.get(index);
			if (typeof range == 'undefined' || range == null) {
				range = new p2p$.com.webp2p.protocol.cdn.RequestRange();
				this.pendingRanges_.set(index, range);
			}
			range.urgent_ = item.urgent_;
			range.urlOffset_ = segment.urlOffset_;
			range.segmentId_ = segment.id_;
			range.segmentSize_ = segment.size_;
			if (range.url_ == "") {
				// range.url_ = segment.mediaUrl_;
				var backupIndex = this.nodeIndex_ - 1;
				var isSameSource = (this.primary_ && globalMeta.sourceServer_ == "") || (globalMeta.sourceServer_ == this.metaData_.sourceServer_);
				if (isSameSource || this.metaData_.directMetaMode_) {
					range.url_ = segment.mediaUrl_;
				} else if (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive == globalMeta.type_ && !globalMeta.directMetaMode_ && backupIndex >= 0
						&& segment.moreMediaUrls_ && backupIndex < segment.moreMediaUrls_.length && segment.moreMediaUrls_[backupIndex]) {
					range.url_ = segment.moreMediaUrls_[backupIndex];
					P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::cdn::Session [{0}]Using backup url from meta, index({1}), url({2})", p2p$.com.webp2p.core.common.Enum
							.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), backupIndex, range.url_));
				} else {
					var newUrl = new p2p$.com.webp2p.core.supernode.Url();
					newUrl.fromString_(segment.mediaUrl_);
					var isSamePort = newUrl.port_ == this.firstSegmentUrl_.port_ || (newUrl.port_ == 0 && this.firstSegmentUrl_.port_ == 80)
							|| (newUrl.port_ == 80 && this.firstSegmentUrl_.port_ == 0);
					if (newUrl.host_ != this.firstSegmentUrl_.host_ || !isSamePort) {
						newUrl.host_ = this.firstSegmentUrl_.host_;
						newUrl.port_ = this.firstSegmentUrl_.port_;

						if (this.firstSegmentUrl_.params_.has("path")) {
							newUrl.params_.set("path", this.firstSegmentUrl_.params_.get("path"));
						}

						if (this.firstSegmentUrl_.params_.has("proxy")) {
							newUrl.params_.set("proxy", this.firstSegmentUrl_.params_.get("proxy"));
						}

						range.url_ = newUrl.toString();
					} else {
						range.url_ = segment.mediaUrl_;
					}
				}
			}
			if (!range.addPiece_(piece)) {
				emptyResponseCount++;
			}
		}
		this.downloadNextRange_(false);

		// if( emptyResponseCount > 0 )
		// {
		// protocol::base::Message emptyResponse;
		// emptyResponse.responses_.resize(emptyResponseCount);
		// for( size_t n = 0; n < emptyResponse.responses_.size(); n ++ )
		// {
		// protocol::base::ResponseDataItem &item = emptyResponse.responses_[n];
		// item.pieceId_ = -1;
		// }
		// manager_.getEventListener_().onProtocolSessionMessage_(*this, emptyResponse);
		// }
		return true;
	},

	getLastReceiveSpeed_ : function() {
		return -1;
	},

	getUpdateReceiveSpeed_ : function(nowTime, waiting) {
		if (this.pendingRanges_.isEmpty() && !this.downloadingRange_.downloading_ && !waiting) {
			return this.lastReceiveSpeed_;
		}

		var timeUsed = this.lastStartReceiveTime_ > 0 ? (nowTime - this.lastStartReceiveTime_) : 0;
		if (timeUsed > 1000) {
			this.lastReceiveSpeed_ = this.lastTotalReceiveBytes_ * 1000 / timeUsed;
		}
		return this.lastReceiveSpeed_;
	}
});p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.Manager = p2p$.com.webp2p.protocol.base.Manager.extend_({
	kTimerTypeEncryptKey : 0,
	kTimerTypePieceTn : 1,

	opened_ : false,
	encryptTryTimes_ : 0,
	pieceTnTryTimes_ : 0,
	drmPieceSegmentId_ : 0,
	drmTimer_ : null,
	// core::supernode::MetaPiece drmPieceTn_;
	// core::supernode::HttpDownloaderPtr drmDownloader_;
	drmDrypto_ : null,

	init : function(pool, evt) {
		this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn);
		this.opened_ = false;
		this.encryptTryTimes_ = 0;
		this.pieceTnTryTimes_ = 0;
		this.drmPieceSegmentId_ = 0;
		this.drmDrypto_ = new p2p$.com.webp2p.protocol.cdn.DrmCrypto();

	},

	open : function() {
		this.close();

		// active
		this.opened_ = true;

		// check if drm is enabled
		var metaUrl = new p2p$.com.webp2p.core.supernode.Url();
		metaUrl.fromString_(this.pool_.getMetaData_().sourceUrl_);
		var encryptName = "_s.m3u8";
		var drmEnabled = (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive != this.pool_.getMetaData_().type_
				&& metaUrl.file_.length > encryptName.length && metaUrl.file_.substr(metaUrl.file_.length - encryptName.length) == encryptName);

		this.drmDrypto_.enabled(drmEnabled);
		this.pool_.getContext_().drmEnabled_ = drmEnabled;
		if (!drmEnabled) {
			return this.doOpen_();
		}

		// this.drmDrypto_.open();
		// this.encryptTryTimes_ = 0;
		// this.pieceTnTryTimes_ = 0;
		// downloadEnryptKey_();
	},

	doOpen_ : function() {
		if (!this.opened_ || !(this.sessions_.length == 0)) {
			// already closed or already opened
			return true;
		}
		// add primary session
		var nodeIndex = 0;
		var primarySession = null;
		var isStream = (this._superprototype.getPool_.call(this).playType_ == "stream");
		if (isStream) {
			// primarySession.reset(new RtlSession(*this, ""));
		} else {
			primarySession = new p2p$.com.webp2p.protocol.cdn.Session(this, "", nodeIndex++, this.drmDrypto_);
		}
		this.sessions_.push(primarySession);

		// mirrors
		var gslbResponseData = this.pool_.getContext_().gslbData_;
		var mirrorNodeList = gslbResponseData["nodelist"];
		for ( var n = 0; n < mirrorNodeList.length; n++) {
			var mirrorNodeItem = mirrorNodeList[n];
			var name = mirrorNodeItem["name"];
			var locationUrl = mirrorNodeItem["location"];
			if (locationUrl == "" || locationUrl == this.pool_.getMetaData_().sourceUrl_) {
				// primary url
				primarySession.setName(name);
				continue;
			}
			if (this.pool_.getContext_().cdnMultiRequest_ && this.sessions_.length < this.pool_.getContext_().cdnMultiMaxHost_) {
				var mirrorSession = null;
				if (isStream) {
					// primarySession.reset(new RtlSession(*this, ""));
				} else {
					mirrorSession = new p2p$.com.webp2p.protocol.cdn.Session(this, locationUrl, nodeIndex++, this.drmDrypto_);
				}

				mirrorSession.setName(name);
				this.sessions_.push(mirrorSession);
			}
		}

		for ( var n = 0; n < this.sessions_.length; n++) {
			// if(n > 1) break;
			var session = this.sessions_[n];
			session.open();
		}
		// P2P_ULOG_INFO("this.sessions_[1].downloader_",this.sessions_[1].downloader_);
		// P2P_ULOG_INFO("this.sessions_[2].downloader_",this.sessions_[2].downloader_);
		// P2P_ULOG_INFO(this.sessions_[1].downloader_ == this.sessions_[2].downloader_);
		this.pool_.getContext_().cdnTotalNodeCount_ = this.sessions_.length;

		// P2P_ULOG_INFO("protocol::cdn::Manager Intialize total "+this.sessions_.length+" session(s)");

		// this.sleep(2000);
		// P2P_ULOG_INFO("this.sessions_[1].downloader_",this.sessions_[1].downloader_);
		// P2P_ULOG_INFO("this.sessions_[2].downloader_",this.sessions_[2].downloader_);
		// P2P_ULOG_INFO(this.sessions_[1].downloader_ == this.sessions_[2].downloader_);
		return true;
	},

	sleep : function(numberMillis) {
		var now = new Date();
		var exitTime = now.getTime() + numberMillis;
		while (true) {
			now = new Date();
			if (now.getTime() > exitTime) {
				return;
			}
		}
	},

	close : function() {
		// deactive
		this.opened_ = false;

		// boost::system::error_code errorCode;
		// drmTimer_.cancel(errorCode);
		if (this.drmDownloader_ != null) {
			this.drmDownloader_.close();
			// drmDownloader_.reset();
		}

		for ( var n = 0; n < this.sessions_.length; n++) {
			var session = this.sessions_[n];
			session.close();
		}
		this.sessions_ = [];
		// this.drmDrypto_.close();
		return true;
	},

	downloadEnryptKey_ : function() {
	},

	downloadPieceTn_ : function() {
	},

	onEncryptKeyTimeout_ : function(errorCode) {
	},

	onPieceTnTimeout_ : function(errorCode) {
	},

	// override protocol::base::Manager
	onTimeout_ : function(tag, timer, errorCode) {
	},

	// override core::supernode::HttpDownloaderListener
	onHttpDownloadCompleted_ : function(downloader) {
	}
});p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.RequestRange = CdeBaseClass.extend_({
	downloading_ : null,
	updated_ : false,
	urgent_ : false,
	urlOffset_ : 0,
	segmentId_ : 0,
	segmentSize_ : 0,
	tryTimes_ : 0,
	offset_ : 0,
	length_ : 0,
	dataUsed_ : 0,
	pieceUsed_ : 0,
	url_ : "",
	startIndex_ : 0,
	endIndex_ : 0,
	pieces_ : null,

	init : function() {
		this.pieces_ = [];
		this.downloading_ = false;
		this.updated_ = false;
		this.urgent_ = false;
		this.urlOffset_ = -1;
		this.segmentId_ = -1;
		this.segmentSize_ = 0;
		this.tryTimes_ = 0;
		this.offset_ = 0;
		this.length_ = 0;
		this.dataUsed_ = 0;
		this.pieceUsed_ = 0;
		this.startIndex_ = 0;
		this.endIndex_ = 0;
	},

	addPiece_ : function(piece) {
		this.updated_ = true;

		var exists = false;
		for ( var n = 0; n < this.pieces_.length; n++) {
			var item = this.pieces_[n];
			if (item.type_ == piece.type_ && item.id_ == piece.id_) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			this.pieces_.push(piece.fork());
		}
		return !exists;
	},

	preparePieces_ : function(forkRange) {
		this.offset_ = 0;
		this.length_ = 0;
		this.pieces_.sort(function(item1, item2) {
			return item1.offset_ - item2.offset_;
		});
		// std::sort(pieces_.begin(), pieces_.end());
		if (this.segmentSize_ <= 0) {
			return;
		}

		var lastIndex = -1;
		var newSize = 0;
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			if (piece.size_ <= 0) {
				this.offset_ = 0;
				this.length_ = 0;
				return;
			} else if (piece.completedTime_ > 0) {
				// alreay completed, skip
				continue;
			}

			if (lastIndex < 0) {
				lastIndex = piece.index_;
				this.offset_ = piece.offset_;
				this.length_ = piece.size_;
				newSize++;
				this.startIndex_ = this.endIndex_ = lastIndex;
				continue;
			}
			if (lastIndex + 1 != piece.index_) {
				// multi segments
				forkRange.addPiece_(piece);
				continue;
			}
			this.endIndex_ = lastIndex = piece.index_;
			this.length_ += piece.size_;
			newSize++;
		}

		// if( newSize < this.pieces_.length )
		// {
		// pieces_.resize(newSize);
		// }
		if (this.length_ >= this.segmentSize_ && this.urlOffset_ < 0) {
			// full request
			this.length_ = 0;
		}
	}
});p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.DrmCrypto = CdeBaseClass.extend_({
	enabled_ : false,
	handle_ : null,
	publicKey_ : "",
	encryptKey_ : "",

	init : function() {
	},
	enabled : function(on) {
		this.enabled_ = on;
	},

	open : function() {
	},
	close : function() {
	},

	decrypt : function(data, size, sequence) {
	}
});p2p$.ns('com.webp2p.protocol.webrtc');

p2p$.com.webp2p.protocol.webrtc.ManagerStatic = {
	kTimerTypeTracker : 1,
	kTimerTypeSession : 2,
	kTimerTypeAsyncPeers : 3,
	kTimerTypeOnRegister : 100,
	kTimerTypeOnHeartBeat : 101,
	kTimerTypeOnQueryPeerList : 102,
};

p2p$.com.webp2p.protocol.webrtc.Manager = p2p$.com.webp2p.protocol.base.Manager.extend_({
	opened_ : false,
	websocket_ : null,
	queryWebrtcServerTimer_ : null,
	heartBeatTimer_ : null,
	queryPeerListTimer_ : null,
	peers_ : null,
	peerMaxConnectingTime_ : 0,
	activeSessionCount_ : 0,

	init : function(pool, evt) {
		this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc);
		this.peers_ = new p2p$.com.webp2p.core.common.Map();
		this.peerMaxConnectingTime_ = 100 * 1000;
		this.activeSessionCount_ = 0;
		this.webrtcRegisterEnabled_ = true;
		this.webrtcRegistered_ = false;
	},

	open : function() {
		this.close();
		this.opened_ = true;
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.id_ = p2p$.com.webp2p.core.common.String.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random() * (1000 + 1)),
				Math.floor(Math.random() * (1000 + 1)), p2p$.com.webp2p.core.common.Global.getMilliTime_());

		if (this.pool_.getContext_().p2pHeartbeatInterval_ > 0) {
			this.heartbeatInterval_ = this.pool_.getContext_().p2pHeartbeatInterval_;
		}

		this.queryFromWebrtcServer_();
		this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 120 * 1000);
		return true;
	},

	close : function() {
		this.opened_ = false;
		if (this.websocket_) {
			this.websocket_.close();
			this.websocket_ = null;
		}

		if (this.queryPeerListTimer_) {
			clearTimeout(this.queryPeerListTimer_);
			this.queryPeerListTimer_ = null;
		}

		if (this.sessionTimer_) {
			clearTimeout(this.sessionTimer_);
			this.sessionTimer_ = null;
		}
		if (this.queryWebrtcServerTimer_) {
			clearTimeout(this.queryWebrtcServerTimer_);
			this.queryWebrtcServerTimer_ = null;
		}
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			peer.disconnect();
		}
		this.peers_.clear();
		return true;
	},

	onTimeout_ : function(tag, timer, errorCode) {
		// P2P_ULOG_ERROR(P2P_ULOG_FMT("timeout tag({0})",tag));
		// if( (timer != this.queryWebrtcServerTimer_))
		// {
		// return;
		// }
		switch (tag) {
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeTracker:
			onTimeout_();
			break;
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeSession:
			this.onSessionTimeout_();
			break;
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeAsyncPeers:
			onAsyncPeersTimeout();
			break;
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnRegister:
			this.onRegisterTimeout_();
			break;
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnHeartBeat:
			this.onHeartBeatTimeout_();
			break;
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnQueryPeerList:
			this.onQueryPeerListTimeout_();
			break;
		default:
			break;
		}
	},

	getSelfInfo_ : function() {
		var version = p2p$.com.webp2p.core.common.String.format("{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber);
		var client = {
			clientId : this.id_,
			clientModule : this.pool_.getEnviroment_().browserType_,
			clientVersion : version,
			protocolVersion : 1.0,
			playType : this.pool_.getContext_().playType_,
			p2pGroupId : this.pool_.getMetaData_().p2pGroupId_,
			osPlatform : encodeURIComponent(this.pool_.getContext_().osType_),
			hardwarePlatform : this.pool_.getEnviroment_().deviceType_ == "Unkonwn" ? encodeURIComponent(this.pool_.getContext_().osType_) : this.pool_
					.getEnviroment_().deviceType_
		};
		return client;
	},

	onSessionTimeout_ : function() {
		this.checkPeerSessions_();
		this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 120 * 1000);
	},

	onRegisterTimeout_ : function() {
		P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::Register timeout, try again ..."));
	},

	onHeartBeatTimeout_ : function() {
		P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::HeartBeat timeout, try again ..."));
	},

	onQueryPeerListTimeout_ : function() {
		// P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::Query peer list timeout, try again ..."));
		this.queryPeerList_();
	},

	queryFromWebrtcServer_ : function() {
		var _serverUrl = this.pool_.getContext_().webrtcServerHost_;
		this.websocket_ = new WebSocket(_serverUrl);

		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::open webrtc server ({0}) ...", this.pool_.getContext_().webrtcServerHost_));
		var _me = this;

		this.websocket_.onopen = function(evt) {
			_me.onWebSocketOpen_(evt);
		};
		this.websocket_.onclose = function(evt) {
			_me.onWebSocketClose_(evt);
		};
		this.websocket_.onerror = function(evt) {
			_me.onWebSocketClose_(evt);
		};
		this.websocket_.onmessage = function(message) {
			_me.onWebSocketMessage_(message);
		};
	},

	onWebSocketOpen_ : function(evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Start register webrtc server ({0}) ...", this.pool_.getContext_().webrtcServerHost_));
		this.registerWebrtcServer_();
	},

	onWebSocketClose_ : function(evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Close webrtc({0}) close ...", this.pool_.getContext_().webrtcServerHost_));
	},

	onWebSocketMessage_ : function(evt) {
		// var me = this;
		var message = JSON.parse(evt.data);
		switch (message.method) {
		case 'registerResponse':
			this.onRegisterResponse_(message);
			break;

		case 'heartbeatResponse':
			this.onHeartbeatResponse_(message);
			break;

		case 'queryPeerListResponse':
			this.onQueryPeerListResponse_(message);
			break;

		case 'proxyDataRequest':
			this.onProxyDataRequest_(message);
			break;

		case 'proxyDataResponse':
			P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::WebSocket proxy data response code: {0}", message.errorCode));
			break;

		default:
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::WebSocket unknown method: {0}", message.method));
			break;
		}
	},

	onHeartbeatResponse_ : function(message) {
	},

	registerWebrtcServer_ : function() {
		var req = {
			method : "registerRequest",
			streamId : this.pool_.getMetaData_().p2pGroupId_,
			nodeInfo : {
				ver : this.pool_.getContext_().moduleVersion_,
				pos : (111 >= 0 ? 111 : 0),
				neighbors : 0,
				isp : this.pool_.getContext_().isp_,
				country : this.pool_.getContext_().country_,
				province : this.pool_.getContext_().province_,
				city : this.pool_.getContext_().city_,
				area : this.pool_.getContext_().area_,
				protocol : p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc
			},
			localTime : p2p$.com.webp2p.core.common.Global.getMilliTime_()
		};
		var mst = p2p$.com.webp2p.protocol.webrtc.ManagerStatic;
		this.queryWebrtcServerTimer_ = this.setTimeout_(mst.kTimerTypeOnRegister, this.queryWebrtcServerTimer_, 5000);
		this.beginRegisterTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.sendMessage_(req);
	},

	onRegisterResponse_ : function(message) {
		if (message.errorCode !== 0) {
			// if register failed, waiting timeout for next registering
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::Register response failed, errorCode({0})", message.errorCode));
			return;
		}
		// if register success, cancel timer
		if (this.queryWebrtcServerTimer_) {
			clearTimeout(this.queryWebrtcServerTimer_);
			this.queryWebrtcServerTimer_ = null;
		}
		this.pool_.getContext_().webrtcServerConnectedTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_() - this.beginRegisterTime_;
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Register response success, peerid({0})", message.peerId));
		this.pool_.getContext_().p2pWebrtcPeerId_ = message.peerId;

		this.heartBeat_();
		this.queryPeerList_();
	},

	heartBeat_ : function() {
		// this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnHeartBeat, this.heartBeatTimer_, 5000);
	},

	queryPeerList_ : function() {
		var queryPeerListRequest = {
			method : "queryPeerListRequest",
			limit : 10
		};
		this.queryPeerListTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnQueryPeerList, this.queryPeerListTimer_,
				10 * 1000);
		this.sendMessage_(queryPeerListRequest);
	},

	onQueryPeerListResponse_ : function(message) {
		// if(this.queryPeerListTimer_)
		// {
		// clearTimeout(this.queryPeerListTimer_);
		// this.queryPeerListTimer_ = null;
		// }

		var peerResponseCount = 0;
		var newPeerCount = 0;
		var itemId = "";
		var _arr = message.items;
		if (_arr.length == 0) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::Query peer list responsed, peerList.length = 0"));
		}
		for ( var i = 0; i < _arr.length; i++) {
			var peerItem = _arr[i];
			itemId = peerItem.peerId;
			// P2P_ULOG_TRACE("protocol::webrtc::Manager::Query peer list response, item: ", peerItem);
			var isFind = this.peers_.find(itemId);
			var info;
			if (!isFind) {
				if (this.peers_.size() >= this.maxActiveSession_ * 2) {
					break;
				}
				info = new p2p$.com.webp2p.protocol.webrtc.Peer(this);
				this.peers_.set(itemId, info);
				newPeerCount++;
				info.fromServer_ = true;
			} else {
				info = this.peers_.get(itemId);
			}
			if (info != null) {
				info.load(peerItem);
			}

		}
		peerResponseCount = _arr.length;
		this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
		if (this.webrtcRegisterEnabled_ && !this.webrtcRegistered_) {
			this.webrtcRegistered_ = true;
			this.eventListener_.onProtocolManagerOpen_(this, 0);
		}

		if (newPeerCount >= 0) {
			this.checkPeerSessions_();
		}

		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::Query peer list successfully, load {0} peer(s), {1} peer(s) now, channel({2})",
				peerResponseCount, this.peers_.size(), this.pool_.getMetaData_().storageId_));
	},

	checkPeerSessions_ : function() {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var updatedPeerCount = 0;

		// clean connect failed peers
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_) && (peer.totalConnectingTimes_ > 5 || peer.disconnectTimes_ > 3 || !peer.fromServer_)) {
				if (peer.session_ != null) {
					this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
					// this.eventListener_.onProtocolSessionClose_(peer.session_);
				}
				peer.disconnect();
				this.peers_.erase(elem.key);
				updatedPeerCount++;
			}
		}

		this.activeSessionCount_ = 0;
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (peer.session_ == null) {
				continue;
			}
			if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_)) {
				this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
				// this.eventListener_.onProtocolSessionClose_(*peer->session_.get());
				peer.disconnect();
				updatedPeerCount++;
			} else {
				this.activeSessionCount_++;
			}
		}

		if (this.activeSessionCount_ >= this.maxActiveSession_) {
			return;
		}
		//
		var connectablePeers = [];
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (peer.isActive_(nowTime, this.peerMaxConnectingTime_)) {
				continue;
			}
			if (!peer.fromServer_) {
				// passive peer
				continue;
			} else if (peer.lastConnectTime_ + 60 * 1000 > nowTime) {
				// sleep
				continue;
			}

			connectablePeers.push(peer);
		}
		for ( var n = 0; n < connectablePeers.length; n++) {
			var peer = connectablePeers[n];

			// try connect peer
			if (!peer.connect()) {
				// failed
				continue;
			}

			this.activeSessionCount_++;
			if (this.activeSessionCount_ >= this.maxActiveSession_) {
				break;
			}
		}
	},

	onProxyDataRequest_ : function(message) {
		if (typeof (message.data) == 'string') {
			message.data = JSON.parse(message.data);
		}
		switch (message.data.action) {
		case 'connectRequest':
			this.onRemotePeerConnectRequest_(message.sourcePeerId, message.data);
			break;
		case 'connectResponse':
			this.onRemotePeerConnectResponse_(message.sourcePeerId, message.data);
			break;
		default:
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Remote peer unknown action: {0}", message.data.action));
			break;
		}
	},

	onRemotePeerConnectResponse_ : function(peerId, message) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Recveive a connect response from {0}", peerId));
		var itemId = peerId;
		var isFind = this.peers_.find(itemId);
		var info;
		if (!isFind) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::Receive a connect response from {0}, but not in the peers", peerId));
			return;
		} else {
			info = this.peers_.get(itemId);
		}
		if (info != null) {
			info.load2(message);
		}
		info.acceptAnswer_(message.iceCandidates, message.sdpDescriptions);
	},

	onRemotePeerConnectRequest_ : function(peerId, message) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Receive a connect request from {0}", peerId));
		var itemId = peerId;
		var isFind = this.peers_.find(itemId);
		var info = null;
		if (!isFind) {
			info = new p2p$.com.webp2p.protocol.webrtc.Peer(this);
			this.peers_.set(itemId, info);
			info.fromServer_ = false;
		} else {
			info = this.peers_.get(itemId);
		}
		if (info != null) {
			info.load2(message);
		}
		info.fromServer_ = false;
		this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
		info.remoteId_ = peerId;
		info.iceServers_ = message.iceServers;
		info.remoteIceCandidates_ = message.iceCandidates;
		info.remoteSdpDescriptions_ = message.sdpDescriptions;
		info.connect();
	},
	sendMessage_ : function(message) {
		if (typeof (message) != 'string') {
			message = JSON.stringify(message);
		}
		if (this.websocket_) {
			this.websocket_.send(message);
		}
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::Send message channel({0}), msg:{1}", this.pool_.getMetaData_().storageId_, message));
	},

	closeChannel_ : function(session) {
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (session == peer.session_) {
				this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.size();
				this.eventListener_.onProtocolSessionClose_(session);
				break;
			}
		}
	}
});p2p$.ns('com.webp2p.protocol.webrtc');

p2p$.com.webp2p.protocol.webrtc.Session = p2p$.com.webp2p.protocol.base.Session.extend_({
	channel_ : null,

	init : function(mgr, remoteId, dataChannel, remoteIp, remotePort) {
		this._super(mgr, remoteId);
		this.channel_ = dataChannel;
		this.remoteIp_ = remoteIp;
		this.remotePort_ = remotePort;
		this.remoteAddress_ = p2p$.com.webp2p.core.common.String.format("{0}:{1}", this.remoteIp_, this.remotePort_);
	},

	send : function(message) {
		if (!this.channel_) {
			return;
		}
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("com.webp2p.protocol.webrtc.Session::send message"));
		var data = p2p$.com.webp2p.protocol.webrtc.Packet.encode(message, [], this.manager_.getType());
		try {
			this.channel_.send(data);
		} catch (e) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Session::Send to channel failed, {0}", e.toString()));
		}
	},

	attchProperties_ : function(properties) {
		if (properties) {
			// var clientModule = properties.clientModule;
			// var clientVersion = properties.clientVersion;
			// var protocolVersion = properties.protocolVersion;
			// var playType = properties.playType;
			// var p2pGroupId = properties.p2pGroupId;
			// var osPlatform = properties.osPlatform;
			// var hardwarePlatform = properties.hardwarePlatform;
			this.name_ = this.remoteType_ = properties.hardwarePlatform + "/" + properties.clientModule + "-" + properties.clientVersion;
		}
	},

	isActive_ : function() {
		return (this.channel_ != null);
	},

	close : function() {
		this.channel_ = null;
	}
});p2p$.ns('com.webp2p.protocol.webrtc');

p2p$.com.webp2p.protocol.webrtc.Peer = p2p$.com.webp2p.protocol.base.Session.extend_({
	peer_ : null,
	dataChannel_ : null,
	fromServer_ : false,
	session_ : null,
	lastConnectTime_ : 0,
	manager_ : null,
	properties_ : null,
	remoteId_ : 0,
	remoteConnectionId_ : 0,

	localIceCandidates_ : null,
	localSdpDescriptions_ : null,

	remoteIceCandidates_ : null,
	remoteSdpDescriptions_ : null,

	iceOptions : null,
	sdpOptions : null,
	connectionId_ : "",
	id_ : "",
	connecting_ : false,
	init : function(manager) {
		this.fromServer_ = false;
		this.session_ = null;
		this.lastConnectTime_ = 0;
		this.manager_ = manager;
		this.selfInfo_ = this.manager_.getSelfInfo_();
		this.connectionId_ = "";
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
		this.id_ = "";
		this.connecting_ = false;
	},

	load : function(peerItem) {
		this.id_ = this.remoteId_ = peerItem.peerId;
	},

	load2 : function(message) {
		for ( var n = 0; n < message.iceCandidates.length; n++) {
			var peerInfo = message.iceCandidates[n];
			var candidate = peerInfo.candidate;
			if (candidate.indexOf("udp") != -1) {
				var datas = candidate.split(" ");
				this.remoteIp_ = datas[4] || "0.0.0.0";
				this.remotePort_ = datas[5] || "0";
				break;
			}
		}

		if (!this.properties_) {
			if (message.selfInfo) {
				this.properties_ = message.selfInfo;
			}

		}
		this.id_ = this.remoteId_;
	},

	connect : function() {
		if (this.fromServer_) {
			this.connectionId_ = this.remoteId_ + "-active";
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer active Try to connect to remote peer({0})  ...", this.remoteId_));
		} else {
			this.connectionId_ = this.remoteId_ + "-passive";
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer passive Try to connect to remote peer({0})  ...", this.remoteId_));
		}

		if (this.fromServer_) {
			// only caller can use the new stunserver
			// callee's stunserver should be the same with caller's
			// callee can get the stunserver when it receive a connectRequest from caller
			var _iceUrl = this.manager_.getPool_().getContext_().stunServerHost_;
			this.iceServers_ = [ {
				url : _iceUrl + '?transport=udp'
			} ];
		}
		try {
			this.peer_ = new RTCPeerConnection({
				iceServers : this.iceServers_
			}, this.iceOptions);
			if (this.fromServer_) {
				this.caller_ = this.peer_;
			} else {
				this.callee_ = this.peer_;
			}
			this.setPeerEvents_(this.peer_);
			var me = this;
			if (this.fromServer_) {
				// caller
				this.sendChannel_ = this.dataChannel_ = this.peer_.createDataChannel('peerChannel');
				this.setChannelEvents_(this.dataChannel_);
				this.caller_.createOffer(function(description) {
					me.caller_.setLocalDescription(description);
					me.localSdpDescriptions_ = description.sdp;
				});
			} else {
				// callee
				this.peer_.setRemoteDescription(new RTCSessionDescription({
					type : 'offer',
					sdp : this.remoteSdpDescriptions_
				}));
				if (this.remoteIceCandidates_) {
					this.addPeerIceCandidates_(this.remoteIceCandidates_);
				}
				this.callee_.createAnswer(function(description) {
					me.callee_.setLocalDescription(description);
					me.localSdpDescriptions_ = description.sdp;
				});
			}
			this.lastConnectTime_ = this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		} catch (e) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::Open failed, exception: {0}", (e || "").toString()));
		}
	},

	onPeerOpen_ : function() {
	},

	sendConnectRequest_ : function() {
		if (this.localIceCandidates_.length < 1) {
			return;
		}

		var proxyData = {
			action : 'connectRequest',
			iceServers : this.iceServers_,
			iceCandidates : this.localIceCandidates_,
			sdpDescriptions : this.localSdpDescriptions_,
			selfInfo : this.selfInfo_
		};
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::sendConnectRequest ({0}) Send connect request ", this.connectionId_));
		this.status = true;
		this.manager_.sendMessage_({
			method : 'proxyDataRequest',
			destPeerId : this.remoteId_,
			data : JSON.stringify(proxyData)
		});
	},

	sendConnectResponse_ : function() {
		if (this.status || this.localIceCandidates_.length < 1) {
			return;
		}
		var proxyData = {
			action : 'connectResponse',
			iceCandidates : this.localIceCandidates_,
			sdpDescriptions : this.localSdpDescriptions_,
			selfInfo : this.selfInfo_
		};
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer::sendConnectResponse ({0}) Send connect response ", this.connectionId_));
		this.status = true;
		this.manager_.sendMessage_({
			method : 'proxyDataRequest',
			destPeerId : this.remoteId_,
			data : JSON.stringify(proxyData)
		});
	},
	onPeerIceCandidate_ : function(evt) {

		if (evt.candidate) {
			// both of caller and callee should save it first,waiting for switch candidate with Peer
			this.localIceCandidates_.push(evt.candidate);
			P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::onPeerIceCandidate ({0}) Receive PeerIceCandidate:({1})", this.connectionId_,
					evt.candidate.candidate));
			if (!this.connecting_) {

			}
		} else {
			if (this.fromServer_) {
				this.sendConnectRequest_();
			} else {
				this.sendConnectResponse_();
			}
		}
	},

	onPeerDataChannel_ : function(evt) {
		// callee open channel in this function
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::onPeerDataChannel ({0}) Receive PeerDataChannel,channel name({1})", this.connectionId_,
				evt.channel.label));
		this.dataChannel_ = evt.channel;
		this.setChannelEvents_(evt.channel);
	},
	onChannelOpen_ : function(channel, evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer::onChannelOpen ({0}) Channel open success!!!!!!!!!!!!!!", this.connectionId_));
		this.connecting_ = true;
		this.session_ = new p2p$.com.webp2p.protocol.webrtc.Session(this.manager_, this.remoteId_, this.dataChannel_, this.remoteIp_, this.remotePort_);
		this.session_.attchProperties_(this.properties_);
		this.manager_.getEventListener_().onProtocolSessionOpen_(this.session_);
	},

	onChannelMessage_ : function(channel, evt) {

		var _barry = new Uint8Array(evt.data);
		// 提取前4位，如果前4位为0则为数据开始，然后
		if (_barry[0] === 0 && _barry[1] === 0 && _barry[2] === 0 && _barry[3] === 0) {
			this.rData = new CdeByteArray();
			this.rData_len = _barry.length;
			this.rTotalData_len = (_barry[4] << 24) + (_barry[5] << 16) + (_barry[6] << 8) + _barry[7];
		} else {
			this.rData_len = this.rData_len + _barry.length;
		}
		this.rData.writeBytes(_barry);

		if (this.rData_len >= this.rTotalData_len) {
			this.rData_len = 0;
			this.rTotalData_len = 0;
			var message = p2p$.com.webp2p.protocol.webrtc.Packet.decode(this.rData.uInt8Array, this.manager_.getType());
			// console.log("protocol::webrtc::Peer::onChannelMessage_:",message);
			this.manager_.getEventListener_().onProtocolSessionMessage_(this.session_, message);

		} else {
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::onChannelMessage ({0}) Channel open part of the message", this.connectionId_));
		}
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
	},
	acceptAnswer_ : function(candidates, sdpDescriptions) {
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::acceptAnswer ({0}) Accept answer ", this.connectionId_));
		this.remoteIceCandidates_ = candidates;
		this.remoteSdpDescriptions_ = sdpDescriptions;
		this.peer_.setRemoteDescription(new RTCSessionDescription({
			type : 'answer',
			sdp : sdpDescriptions
		}));
		this.addPeerIceCandidates_(candidates);
	},
	addPeerIceCandidates_ : function(candidates) {
		if (Object.prototype.toString.call(candidates) == '[object Array]') {
			for ( var i = 0; i < candidates.length; i++) {
				this.peer_.addIceCandidate(new RTCIceCandidate(typeof (candidates[i]) != 'string' ? candidates[i] : {
					sdpMLineIndex : 0,
					sdpMid : 'data',
					candidate : candidates[i]
				}));
			}
		} else {
			this.peer_.addIceCandidate(new RTCIceCandidate(candidates));
		}
	},
	onChannelError_ : function(channel, evt) {
	},

	onChannelClose_ : function(channel, evt) {
		this.connecting_ = false;
		// this.closeChannel_(evt);
	},

	closeChannel_ : function(evt) {
		this.status = false;
		// this.disconnect();
	},

	setPeerEvents_ : function(peer) {
		var me = this;
		peer.onnegotiationneeded = function() {
			me.onPeerOpen_();
		};
		peer.onicecandidate = function(evt) {
			me.onPeerIceCandidate_(evt);
		};
		peer.ondatachannel = function(evt) {
			me.onPeerDataChannel_(evt);
		};
	},

	setChannelEvents_ : function(channel) {
		var me = this;
		channel.onopen = function(evt) {
			me.onChannelOpen_(channel, evt);
		};
		channel.onmessage = function(evt) {
			me.onChannelMessage_(channel, evt);
		};
		channel.onerror = function(evt) {
			me.onChannelError_(channel, evt);
		};
		channel.onclose = function(evt) {
			me.onChannelClose_(channel, evt);
		};
	},

	disconnect : function() {
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::disconnect ({0}) disconnect... ", this.connectionId_));

		if (this.dataChannel_) {
			this.dataChannel_.close();
			this.dataChannel_ = null;
		}
		if (this.peer_) {
			this.peer_.close();
			this.peer_ = null;
		}

		if (this.session_) {
			this.manager_.closeChannel_(this.session_);
			this.session_.close();
		}
		this.session_ = null;
		this.connecting_ = false;
	},

	isActive_ : function(nowTime, maxConnectingTime) {
		if (this.connecting_) {
			if (!this.session_) {
				return false;
			}
			if (this.session_.isActive_()) {
				return (this.activeTime_ + 60 * 1000) > nowTime;
			} else if (!this.connecting_) {
				return false;
			}
		}
		return this.activeTime_ + maxConnectingTime > nowTime;
	},
	clear : function() {
		this.peer_ = null;
		this.connectionId = 0;
		this.remoteId_ = 0;
		this.remoteConnectionId_ = 0;
		this.dataChannel_ = null;
		this.iceServers_ = null;
		this.iceOptions = null;
		this.sdpOptions = null;
		this.localIceCandidates_ = null;
		this.localSdpDescriptions_ = null;
		this.remoteIceCandidates_ = null;
		this.remoteSdpDescriptions_ = null;
		this.status = false;
	}
});p2p$.ns('com.webp2p.protocol.webrtc');
p2p$.com.webp2p.protocol.webrtc.Packet = {
	peerIds_ : [],

	// encode
	encode : function(message, peerIdsList, type) {
		// this.sendrangNum++;
		var _sendDataSct = [ {
			"sequence_4" : 0
		},// 0
		{
			"dataLength_4" : 0
		},// 1
		{
			"rangeCount_4" : 0
		},// 2
		{
			"rangeItems" : [ [ {
				"type_2" : 123
			}, {
				"start_8" : 234
			}, {
				"end_4" : 345
			} ] ]
		},// 3
		{
			"requestCount_4" : 0
		},// 4
		{
			"requestItems" : [ [ {
				"type_2" : 0
			}, {
				"start_8" : 1411033199
			}, {
				"cks_4" : 57473
			} ] ]
		},// 5
		{
			"responseCount_4" : 0
		},// 6
		{
			"responseItems" : [ [ {
				"type_2" : 0
			}, {
				"start_8" : 1411033199
			}, {
				"streamLength_4" : 57473
			}, {
				"stream_d" : null
			} ] ]
		},// 7
		{
			"peerCount_4" : 1
		},// 连接节点数//8
		{
			"peerItems" : [ [ {
				"head_4" : 0
			}, {
				"URL_utf" : "ws://202.103.4.52:34567/*****"
			} ] ]
		} // 9
		];

		// 3
		var _rangeItems = [];
		var _start;
		var _end;
		for ( var n = 0; n < message.ranges_.length; n++) {
			var item = message.ranges_[n];
			_start = item.start_;
			_end = item.count_;
			_rangeItems.push([ {
				"type_2" : item.type_
			}, {
				"start_8" : _start
			}, {
				"end_4" : (_end)
			} ]);
		}
		_sendDataSct[3].rangeItems = _rangeItems;

		// 5
		var _requestItems = [];
		for ( var n = 0; n < message.requests_.length; n++) {
			var item = message.requests_[n];
			_requestItems.push([ {
				"type_2" : item.pieceType_
			}, {
				"start_8" : item.pieceId_
			}, {
				"cks_4" : item.checksum_
			} ]);
		}
		_sendDataSct[5].requestItems = _requestItems;

		// 7
		var _responseItems = [];
		for ( var n = 0; n < message.responses_.length; n++) {
			var item = message.responses_[n];
			_responseItems.push([ {
				"type_2" : item.pieceType_
			}, {
				"start_8" : item.pieceId_
			}, {
				"streamLength_4" : item.data_.length
			}, {
				"stream_d" : item.data_
			} ]);
		}
		_sendDataSct[7].responseItems = _responseItems;

		// 9
		var _peerItems = [];
		if (typeof peerIdsList != 'undefined') {
			for ( var n = 0; n < peerIdsList.length; n++) {
				var item = peerIdsList[n];
				_peerItems.push([ {
					"head_4" : n
				}, {
					"URL_utf" : item
				} ]);
			}
			_sendDataSct[9].peerItems = _peerItems;
		}

		_sendDataSct[2].rangeCount_4 = _sendDataSct[3].rangeItems.length;
		_sendDataSct[4].requestCount_4 = _sendDataSct[5].requestItems.length;
		_sendDataSct[6].responseCount_4 = _sendDataSct[7].responseItems.length;
		_sendDataSct[8].peerCount_4 = _sendDataSct[9].peerItems.length;

		// for(var _i = 0; _i < _sendDataSct[7].responseItems.length;_i++ )
		// {
		// _sendDataSct[7].responseItems[_i][2].streamLength_4 = _sendDataSct[7].responseItems[_i][3].stream_d.length;
		// }

		for ( var _i = 0; _i < _sendDataSct[9].peerItems.length; _i++) {
			_sendDataSct[9].peerItems[_i][0].head_4 = _sendDataSct[9].peerItems[_i][1].URL_utf.length;
		}

		// /结算分享数据信息
		// for(var _i=0;_i<_sendDataSct[7].responseItems.length;_i++)
		// {
		// this.shareNum++;
		// this.shareSize+=Number(_sendDataSct[7].responseItems[_i][2].streamLength_4);
		// }

		// this.sendInfo(_sendDataSct);

		var _arr = [];
		if (type != p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
			_sendDataSct.splice(1, 1);
		}
		this.processObject_(_sendDataSct, _arr);
		var _size = 0;

		for ( var _i = 0; _i < _arr.length; _i++) {
			_size += _arr[_i].length;
		}
		var _sendData = new Uint8Array(_size);
		var _count = 0;
		for ( var _i = 0; _i < _arr.length; _i++) {
			for ( var _j = 0; _j < _arr[_i].length; _j++) {
				_sendData[_count++] = _arr[_i][_j];
			}
		}
		// //
		if (type == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
			var _sdatalen = _sendData.length;
			_sendData[4] = (parseInt(_sdatalen) >> 24) & 0xff;
			_sendData[5] = (parseInt(_sdatalen) >> 16) & 0xff;
			_sendData[6] = (parseInt(_sdatalen) >> 8) & 0xff;
			_sendData[7] = parseInt(_sdatalen) & 0xff;
		}
		// this.req++;
		// this.dl++;
		return _sendData;
	},

	decode : function(value, type) {
		var _position = 0;
		// var _sequnce = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
		// var _time;
		var _type;
		// var _info;
		var _i;
		var message = new p2p$.com.webp2p.protocol.base.Message();
		// ranges_:null,
		// requests_:null,
		// responses_:null,

		_position += 4;
		if (type == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
			_position += 4;// 跳过4个字节，这4个字节是说明数据长度的
		}

		var _rangeCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
		_position += 4;
		var rangeInfo = null;
		if (_rangeCount !== 0) {
			for (_i = 0; _i < _rangeCount; _i++) {
				_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
				_position += 2;
				if (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn === _type) {
					// this.remoteTNList.push({"start":_start,"end":(_start+_end-1)});
					rangeInfo = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
					rangeInfo.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
				} else {
					// this.remotePNList.push({"start":_start,"end":(_start+_end-1)});
					rangeInfo = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
					rangeInfo.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;

				}
				rangeInfo.start_ = -1;
				rangeInfo.count_ = 0;
				var _start = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
				_position += 8;
				var _end = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
				_position += 4;
				rangeInfo.start_ = _start;
				rangeInfo.count_ = _end;
				message.ranges_.push(rangeInfo);
			}
			// 输出 range信息
			// _info={};
			// _info.code="P2P.Range.Info";
			// _info.info={"TN":this.remoteTNList,"PN":this.remotePNList};
			// this.statics.sendToJs(_info);
		}

		var _reqCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
		_position += 4;
		var requestInfo = null;
		for (_i = 0; _i < _reqCount; _i++) {

			requestInfo = new p2p$.com.webp2p.protocol.base.RequestDataItem();
			_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
			_position += 2;
			var _pid = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
			_position += 8;
			var _sck = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
			_position += 4;

			requestInfo.pieceType_ = _type;
			requestInfo.pieceId_ = _pid;
			requestInfo.checksum_ = _sck;
			message.requests_.push(requestInfo);
		}

		var _respCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
		_position += 4;
		var responseInfo = null;
		// var _len = 1;// (requestArr?requestArr.length:1); && _i<_len
		for (_i = 0; _i < _respCount; _i++) {
			// _responseItems.push([{"type_2":item.pieceType_},
			// {"start_8":item.pieceId_},
			// {"streamLength_4":item.data_.length},
			// {"stream_d":item.data_}]);
			//
			responseInfo = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
			// if(value.length > 50)
			// {
			// console.log("response");
			// }
			// _time = this.config.localTime - this.starttime;
			_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
			_position += 2;
			var _pid2 = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
			_position += 8;
			var _DataL = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
			_position += 4;

			var _stream = p2p$.com.webp2p.core.common.Number.convertToValue_('d', value, _position, _DataL);
			_position += _DataL;

			responseInfo.pieceType_ = _type;
			responseInfo.pieceId_ = _pid2;
			responseInfo.data_ = _stream;
			message.responses_.push(responseInfo);

			// this.dealRemoteData({'pieceID':_pid2,'data':_stream});
			// this.downNum++;
			// this.downSize+=_stream.length;
			// this.speed = Math.round(_stream.length*8/_time/10)/100;
			// _info = {};
			// _info.code = "P2P.Info.Debug";
			// _info.info="p2p:["+this.remoteId_+"] "+_type+"_"+_pid2;
			// this.statics.sendToJs(_info);
		}

		var _peerCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);// sequnce
		_position += 4;
		var peersInfo = [];
		for (_i = 0; _i < _peerCount; _i++) {
			var _peerheadL = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);// sequnce
			_position += 4;
			var _url = p2p$.com.webp2p.core.common.Number.convertToValue_('utf', value, _position, _peerheadL);
			_position += _peerheadL;
			peersInfo.push(_url);
		}
		// //接受完数据
		// if(_rangeCount>0)
		// {
		// this.reqrangNum++;
		// //防止发送太快，设置间隔
		// this.peer.sendMessage_();
		// }
		return message;
	},

	processObject_ : function(obj, _array) {
		switch (typeof (obj)) {
		case "array":
			for ( var i = 0; i < obj.length; i++) {
				if (obj[i] instanceof Array) {
					this.processObject_(obj[i], _array);
				} else if (typeof (obj[i]) == "object") {
					this.processObject_(obj[i], _array);
				}
			}
			break;
		case "object":
			for ( var element in obj) {
				var size = element.split("_")[1];
				if (size) {
					p2p$.com.webp2p.core.common.Number.convertToBit_(size, obj[element], _array);
				}
				if (!size && obj[element]) {
					this.processObject_(obj[element], _array);
				}
			}
			break;
		default:
			break;
		}
	}
};p2p$.ns('com.webp2p.protocol.websocket');

p2p$.com.webp2p.protocol.websocket.Session = p2p$.com.webp2p.protocol.base.Session.extend_({

	init : function(mgr, remoteId, remoteIp, remotePort) {
		this._super(mgr, remoteId);
		this.remoteIp_ = remoteIp;
		this.remotePort_ = remotePort;
		this.passive_ = false;
		this.remoteAddress_ = p2p$.com.webp2p.core.common.String.format("{0}:{1}", this.remoteIp_, this.remotePort_);
		this.openHashhand = false;
	},

	send : function(message) {
		// console.log("com.webp2p.protocol.websocket.Peer::onWebSocketMessage_:send",message);
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("com.webp2p.protocol.websocket.Session::send message"));
		var data = p2p$.com.webp2p.protocol.webrtc.Packet.encode(message, [], this.manager_.getType());
		this.websocket.send(new Blob([ data ]));
	},

	open : function() {
		if (this.passive_) {
			return true;
		}

		var mgr = this.manager_;
		var xmtepHeaders = mgr.getXmtepHeaders_();
		var me = this;
		this.uir = "ws://" + this.remoteIp_ + ":" + this.remotePort_ + "/mtep-exchange-connection?" + xmtepHeaders;
		try {
			this.websocket = new WebSocket(this.uir);
		} catch (e) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol.webrtc.Session::open failed, exception: {0}", e));
			return false;
		}
		this.websocket.onopen = function(evt) {
			mgr.onWebSocketOpen_(evt, me);
		};
		this.websocket.onclose = function(evt) {
			mgr.onWebSocketClose_(evt, me);
		};
		this.websocket.onmessage = function(message) {
			mgr.onWebSocketMessage_(message, me);
		};
		this.websocket.onerror = function(evt) {
			mgr.onWebSocketClose_(evt, me);
		};

		return true;
	},

	close : function() {
		this.websocket = null;
	},

	isActive_ : function() {
		if (this.passive_) {
			return false;// connection_.get() && connection_->isActive_();
		} else {
			return this.websocket;
		}
	},

	attchProperties_ : function(value) {
		if (!value) {
			return;
		}

		// var responseClientId_ = "";
		var hardwarePlatform = "";
		var strClientMode = "";
		var strClientVersion = "";
		// var businessParamString = "";
		if (value.hasOwnProperty("x-mtep-client-id")) {
			responseClientId_ = value["x-mtep-client-id"];
		} else if (value.hasOwnProperty("xMtepClientId")) {
			responseClientId_ = value["xMtepClientId"];
		}

		if (value.hasOwnProperty("x-mtep-hardware-platform")) {
			hardwarePlatform = value["x-mtep-hardware-platform"];
		} else if (value.hasOwnProperty("xMtepHardwarePlatform")) {
			hardwarePlatform = value["xMtepHardwarePlatform"];
		}

		if (value.hasOwnProperty("x-mtep-client-module")) {
			strClientMode = value["x-mtep-client-module"];
		} else if (value.hasOwnProperty("xMtepClientModule")) {
			strClientMode = value["xMtepClientModule"];
		}

		if (value.hasOwnProperty("x-mtep-client-version")) {
			strClientVersion = value["x-mtep-client-version"];
		} else if (value.hasOwnProperty("xMtepClientVersion")) {
			strClientVersion = value["xMtepClientVersion"];
		}
		this.name_ = this.remoteType_ = hardwarePlatform + "/" + strClientMode + "-" + strClientVersion;

		if (value.hasOwnProperty("x-mtep-business-params")) {
			businessParamString = value["x-mtep-business-params"];
		} else if (value.hasOwnProperty("xMtepBusinessParams")) {
			businessParamString = value["xMtepBusinessParams"];
		}
	}
});p2p$.ns('com.webp2p.protocol.websocket');

p2p$.com.webp2p.protocol.websocket.PeerStatic = {
	nextConnectionId_ : 0,
};

p2p$.com.webp2p.protocol.websocket.Peer = p2p$.com.webp2p.protocol.base.Session.extend_({
	protocol_ : 0,
	weight_ : 0,
	terminalType_ : 0,
	id_ : "",
	internetIp_ : "",
	innerIp_ : "",
	internetPort_ : 0,
	innerPort_ : 0,
	fromServer_ : false,

	// status
	loadTime_ : 0,
	activeTime_ : 0,
	lastConnectTime_ : 0,
	heartbeatTime_ : 0,
	peerExchangeTime_ : 0,
	usingParamsMode_ : false,
	innerIpConnectingTimes_ : 0,
	totalConnectingTimes_ : 0,
	disconnectTimes_ : 0,
	randomSeed_ : 0,
	connecting_ : false,

	init : function(manager) {
		this.protocol_ = 0;
		this.weight_ = 0;
		this.terminalType_ = 0;
		this.internetPort_ = 0;
		this.innerPort_ = 0;

		this.loadTime_ = 0;
		this.activeTime_ = 0;
		this.lastConnectTime_ = 0;
		this.heartbeatTime_ = 0;
		this.peerExchangeTime_ = 0;
		this.innerIpConnectingTimes_ = 0;
		this.totalConnectingTimes_ = 0;
		this.disconnectTimes_ = 0;
		this.randomSeed_ = Math.floor(Math.random() * (1000 + 1));
		this.usingParamsMode_ = false;
		this.connecting_ = false;
		this.fromServer_ = false;
	},

	load : function(result) {
		this.loadTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.id_ = result["peerid"];
		this.protocol_ = result["protocol"];
		this.weight_ = result["weight"];
		this.terminalType_ = result["termid"];
		this.internetIp_ = result["userip"];
		this.internetPort_ = result["pport"];
		this.innerIp_ = result["inip"];
		this.innerPort_ = result["inport"];
	},

	loadFromUrl_ : function(url) {
		var info = new p2p$.com.webp2p.core.supernode.Url;
		info.fromString_(url);

		this.loadTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.id_ = p2p$.com.webp2p.core.common.String.makeLower_(info.params_.get("peerId"));
		this.terminalType_ = p2p$.com.webp2p.core.common.String.parseNumber_(info.params_.get("terminalType"), 0);
		this.internetIp_ = info.host_;
		this.internetPort_ = info.port_;
		this.innerIp_ = info.params_.get("inIp");
		this.innerPort_ = p2p$.com.webp2p.core.common.String.parseNumber_(info.params_.get("inPort"), 0);
	},

	toStringUrl_ : function() {
		return p2p$.com.webp2p.core.common.String.format("ws://{0}:{1}/mtep-exchange-connection?inIp={2}&inPort={3}&peerId={4}", this.internetIp_,
				this.internetPort_, this.innerIp_, this.innerPort_, id_);
	},

	attach : function(mgr, conn) {
	},

	connect : function(mgr, selfInternetIp) {
		// this.disconnect();

		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::websocket::Peer Try to connect to({0}), {1}:{2} ...", this.id_, this.internetIp_, this.internetPort_));

		this.connecting_ = true;
		this.totalConnectingTimes_++;
		this.lastConnectTime_ = this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.session_ = new p2p$.com.webp2p.protocol.websocket.Session(mgr, this.id_, this.internetIp_, this.internetPort_);
		return this.session_.open();
	},

	disconnect : function() {
		this.connecting_ = false;
		if (this.session_ != null) {
			this.disconnectTimes_++;
			this.session_.close();
		}
		this.session_ = null;
		return true;
	},

	isActive_ : function(nowTime, maxConnectingTime) {
		if (this.connecting_) {
			if (this.session_ == null) {
				return false;
			}

			if (this.session_.isActive_()) {
				return (this.activeTime_ + 60 * 1000) > nowTime;
			} else if (!this.connecting_) {
				return false;
			}
		}
		return this.activeTime_ + maxConnectingTime > nowTime;
	}
});p2p$.ns('com.webp2p.protocol.websocket');
p2p$.com.webp2p.protocol.websocket.ManagerStatic = {
	kTimerTypeTracker : 1,
	kTimerTypeSession : 2,
	kTimerTypeAsyncPeers : 3,
};

p2p$.com.webp2p.protocol.websocket.Manager = p2p$.com.webp2p.protocol.base.Manager.extend_({
	http_ : null,
	// protocol::websocket::ServerPtr shareServer_;
	peers_ : null,
	// protocol::websocket::PeerPtrList asyncOpenPeers_;
	// protocol::websocket::PeerPtrList asyncClosePeers_;
	// boost::asio::deadline_timer serverTimer_;
	// boost::asio::deadline_timer sessionTimer_;
	// boost::asio::deadline_timer asyncPeersTimer_;
	selfInnerIp_ : "",
	selfInternetIp_ : "",
	// protocol::base::Message dummyMessage;
	// tools::upnp::MapServicePtr upnpService_;
	// tools::upnp::MapInfo upnpMapInfo_;
	exchangePeerIdsData_ : "",

	opened_ : false,
	upnpMapResultReported_ : false,
	upnpMapWaiting_ : false,
	activeTime_ : 0,
	protocolOpenedTime_ : 0,
	peerMaxConnectingTime_ : 0,
	trackerBeginQueryTime_ : 0,

	trackerRegisterEnabled_ : false,
	trackerRegistered_ : false,
	activeSessionCount_ : 0,
	trackerResponseStatus_ : 0,
	shareServerPort_ : 0,
	shareServerUpnpPort_ : 0,
	heartbeatInterval_ : 0,
	trackerTryTimes_ : 0,
	upnpMapTryTimes_ : 0,

	init : function(pool, evt) {
		this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket);
		this.peers_ = new p2p$.com.webp2p.core.common.Map();
		this.heartbeatInterval_ = 30; // seconds
		this.shareServerPort_ = 1443; // https port
		this.shareServerUpnpPort_ = 0;
		// shareServer_.reset(new protocol::websocket::Server(io, *this));
		// upnpService_.reset(new tools::upnp::MapService(io, *this));
		this.trackerTryTimes_ = 0;
		this.upnpMapTryTimes_ = 0;
		this.activeTime_ = 0;
		this.trackerRegisterEnabled_ = true;
		this.trackerRegistered_ = false;
		this.upnpMapResultReported_ = false;
		this.upnpMapWaiting_ = false;
		this.activeSessionCount_ = 0;
		this.trackerResponseStatus_ = 0;
		this.trackerBeginQueryTime_ = 0;
		this.peerMaxConnectingTime_ = 10 * 1000;
		this.http_ = null;
	},

	open : function() {
		this.close();
		this.opened_ = true;
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.id_ = p2p$.com.webp2p.core.common.String.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random() * (1000 + 1)),
				Math.floor(Math.random() * (1000 + 1)), p2p$.com.webp2p.core.common.Global.getMilliTime_());
		if (this.pool_.getContext_().p2pHeartbeatInterval_ > 0) {
			this.heartbeatInterval_ = this.pool_.getContext_().p2pHeartbeatInterval_;
		}
		this.pool_.getContext_().p2pWebsocketPeerId_ = this.id_;
		this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 5000);
		this.queryFromTracker_();
		return true;
	},

	close : function() {
		this.opened_ = false;
		if (this.serverTimer_) {
			clearTimeout(this.serverTimer_);
			this.serverTimer_ = null;
		}

		if (this.sessionTimer_) {
			clearTimeout(this.sessionTimer_);
			this.sessionTimer_ = null;
		}
		if (this.http_ != null) {
			this.http_ = null;
		}
		// shareServer_->stop();
		// upnpService_->stop();
		// for( protocol::base::SessionPtrList::iterator itr = sessions_.begin(); itr != sessions_.end(); itr ++ )
		// {
		// protocol::base::SessionPtr &session = (*itr);
		// if( session.get() ) session->close();
		// }
		// sessions_.clear();
		//
		// asyncOpenPeers_.clear();
		// asyncClosePeers_.clear();
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			peer.disconnect();
		}
		this.peers_.clear();
		//
		// return true;
	},

	getXmtepHeaders_ : function() {
		return "xMtepClientId="
				+ this.id_
				+ "&xMtepClientModule=h5"
				+ "&xMtepClientVersion="
				+ p2p$.com.webp2p.core.common.String.format("{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
						p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber) + "&xMtepProtocolVersion=1.0"
				+ "&xMtepBusinessParams="
				+ encodeURIComponent("playType=" + this.pool_.getContext_().playType_ + "&p2pGroupId=" + this.pool_.getMetaData_().p2pGroupId_)
				+ "&xMtepOsPlatform=" + encodeURIComponent(this.pool_.getContext_().osType_) + "&xMtepHardwarePlatform=pc";
	},

	queryFromTracker_ : function() {
		if (this.http_ != null) {
			this.http_.log("cancel");
			this.http_.close();
			this.http_ = null;
		}

		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		var context = this.pool_.getContext_();
		// var terminalId = p2p$.com.webp2p.core.common.String.fromNumber(this.pool_.getContext_().terminalType_);
		var operateCode = "3"; // get peer list
		if (this.activeSessionCount_ >= this.pool_.getContext_().p2pMaxPeers_) {
			operateCode = "1"; // heartbeat
		}

		var url = new p2p$.com.webp2p.core.supernode.Url();
		url.protocol_ = "http";
		url.host_ = this.pool_.getContext_().trackerServerHost_;
		url.file_ = "/cde";
		url.params_.set("termid", "2"); // terminalId;...
		url.params_.set("format", "1");
		url.params_.set("ver", context.playType_ + "." + context.moduleVersion_);
		url.params_.set("op", operateCode);
		url.params_.set("ckey", this.pool_.getMetaData_().p2pGroupId_);
		url.params_.set("outip", "0.0.0.0");
		url.params_.set("inip", "0.0.0.0");
		url.params_.set("pid", p2p$.com.webp2p.core.common.String.format("33-{0}-0-0", this.id_));
		url.params_.set("pos", p2p$.com.webp2p.core.common.String.fromNumber(this.pool_.getContext_().playingPosition_));// ..
		url.params_.set("ispId", p2p$.com.webp2p.core.common.String.fromNumber(context.isp_));
		url.params_.set("neighbors", p2p$.com.webp2p.core.common.String.fromNumber(this.activeSessionCount_)); // "0";
		url.params_.set("arealevel1", context.countryCode_);
		url.params_.set("arealevel2", p2p$.com.webp2p.core.common.String.fromNumber(context.province_));
		url.params_.set("arealevel3", p2p$.com.webp2p.core.common.String.fromNumber(context.city_));
		url.params_.set("expect", p2p$.com.webp2p.core.common.String.fromNumber(this.pool_.getContext_().p2pMaxPeers_ * 2));

		var requestUrl = url.toString();
		this.trackerBeginQueryTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		// set tracker timer
		this.serverTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeTracker, this.serverTimer_,
				this.heartbeatInterval_ * 1000);
		this.http_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(requestUrl, this, "GET", "json", "websocket::tracker");
		this.http_.load();
	},

	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;

		if (!this.opened_ || this.http_ != downloader) {
			// expired
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::websocket::Manager Expired http complete for tag({0}), channel({1}), ignore", downloader.tag_, this.pool_
					.getMetaData_().storageId_));
			return handled;
		}

		this.http_ = null;
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::websocket::Manager Http complete for tag({0}), channel({1}), response code({2}), details({3}), size({4})",
				downloader.tag_, this.pool_.getMetaData_().storageId_, downloader.responseCode_, downloader.responseDetails_, downloader.responseLength_));

		if (downloader.tag_ == "websocket::tracker") {
			handled = true;
			this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				return handled;
			}

			if (this.pool_.getContext_().trackerServerConnectedTime_ <= 0) {
				this.pool_.getContext_().trackerServerConnectedTime_ = this.activeTime_ - this.trackerBeginQueryTime_;
			}
			// parse tracker data
			this.parseTrackerResponse_(downloader);
		}

		return handled;
	},

	parseTrackerResponse_ : function(downloader) {
		var peerResponseCount = 0;
		var newPeerCount = 0;
		// var previousSelfIp = this.selfInternetIp_;
		var result = downloader.responseData_;
		if (result == "" || result == null) {
			// if( this.gslbServerErrorCode_ <= 0 ) gslbServerErrorCode_ = 52001;
			return false;
		}

		if (!downloader.responseData_ == "") {

			this.trackerResponseStatus_ = result["status"];
			if (this.trackerResponseStatus_ != 200) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::websocket::Manager Tracker response status({0}), not 200, channel({1})", this.trackerResponseStatus_,
						this.pool_.getMetaData_().storageId_));
				return false;
			}

			this.selfInternetIp_ = result["host"] || "";
			var peerList = result["peerlist"] || [];
			for ( var n = 0; n < peerList.length; n++) {
				var peerItem = peerList[n];
				var itemId = peerItem["peerid"];
				var itemIp = peerItem["userip"];
				var itemPort = peerItem["pport"];
				if (itemPort == this.shareServerPort_ && itemIp == this.selfInnerIp_) {
					// self
					continue;
				} else if (itemIp == "127.0.0.1" || itemIp == "0.0.0.0" || itemIp == "255.255.255.255") {
					// invalid ip address
					continue;
				}

				itemId = p2p$.com.webp2p.core.common.String.toLower_(itemId);

				var isFind = this.peers_.find(itemId);
				var info;
				if (!isFind) {
					if (this.peers_.size() >= this.maxActiveSession_ * 2) {
						break;
					}
					info = new p2p$.com.webp2p.protocol.websocket.Peer(this);
					this.peers_.set(itemId, info);
					newPeerCount++;
					info.fromServer_ = true;
				} else {
					info = this.peers_.get(itemId);
				}
				if (info != null) {
					info.fromServer_ = true;
					info.load(peerItem);
				}

			}
			peerResponseCount = peerList.length;
			this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.length;
		}

		var registering = false;
		if (this.trackerRegisterEnabled_ && !this.trackerRegistered_) {
			registering = true;
			this.trackerRegistered_ = true;
			this.protocolOpenedTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			this.eventListener_.onProtocolManagerOpen_(this, 0);
		}

		if (newPeerCount > 0) {
			this.checkPeerSessions_();
		}
		//		
		P2P_ULOG_INFO(P2P_ULOG_FMT(
				"protocol::websocket::Manager {0} tracker successfully, self internet ip({1}), load {2} peer(s), {3} peer(s) now, channel({4})",
				(registering ? "Register to" : "Query peer from"), this.selfInternetIp_, peerResponseCount, this.peers_.length,
				this.pool_.getMetaData_().storageId_));
		//
		// if( pool_.getContext_().upnpMapCompleteTime_ > 0 && pool_.getContext_().upnpMapSuccess_ &&
		// !previousSelfIp.empty() && previousSelfIp != selfInternetIp_ )
		// {
		// // if upnp mapped successfully and external ip changed
		// mapUpnpPort();
		// }
		//
		// return true;
	},

	checkPeerSessions_ : function() {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var updatedPeerCount = 0;

		// clean connect failed peers
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_) && (peer.totalConnectingTimes_ > 5 || peer.disconnectTimes_ > 3 || !peer.fromServer_)) {
				if (peer.session_ != null) {
					this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.size();
					this.eventListener_.onProtocolSessionClose_(peer.session_);
				}
				peer.disconnect();
				this.peers_.erase(elem.key);
				n--;
				updatedPeerCount++;
			}
		}

		this.activeSessionCount_ = 0;
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (peer.session_ == null) {
				continue;
			}
			if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_)) {
				this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.size();
				this.eventListener_.onProtocolSessionClose_(peer.session_);
				peer.disconnect();
				updatedPeerCount++;
			} else {
				this.activeSessionCount_++;
			}
		}

		//
		if (this.activeSessionCount_ >= this.maxActiveSession_) {
			return;
		}
		//
		var connectablePeers = [];
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (peer.isActive_(nowTime, this.peerMaxConnectingTime_)) {
				continue;
			}
			if (!peer.fromServer_) {
				// passive peer
				continue;
			} else if (peer.lastConnectTime_ + 60 * 1000 > nowTime) {
				// sleep
				continue;
			}

			connectablePeers.push(peer);
		}

		for ( var n = 0; n < connectablePeers.length; n++) {
			var peer = connectablePeers[n];

			// try connect peer
			if (!peer.connect(this)) {
				// failed
				continue;
			}

			this.activeSessionCount_++;
			if (this.activeSessionCount_ >= this.maxActiveSession_) {
				break;
			}
		}
		//
		// if( updatedPeerCount > 0 )
		// {
		// updateExchangePeerIds();
		// }
	},

	onTimeout_ : function(tag, timer, errorCode) {
		switch (tag) {
		case p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeTracker:
			this.onTrackerTimeout_();
			break;
		case p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeSession:
			this.onSessionTimeout_();
			break;
		case p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeAsyncPeers:
			this.onAsyncPeersTimeout();
			break;
		default:
			break;
		}
	},

	onTrackerTimeout_ : function() {
		if (this.http_ != null) {
			this.http_.log("timeout");
			// http_->close();
			this.http_ = null;
		}

		if (!this.opened_) {
			return;
		}
		this.queryFromTracker_();
	},

	onSessionTimeout_ : function() {
		this.checkPeerSessions_();
		this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 5000);
	},

	onWebSocketOpen_ : function(evt, session) {
		this.status = true;
	},

	onWebSocketMessage_ : function(message, session) {
		if (!this.opened_) {
			return false;
		}
		if (!this.status) {
			return;
		}

		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			var me = this;
			if (session == peer.session_) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::websocket::Manager Active session({0}, {1}:{2}) message arrive", peer.id_, peer.internetIp_,
						peer.internetPort_));

				peer.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

				var data = message.data;
				switch (typeof (data)) {
				case "string":
					if (false === session.openHashhand) {
						session.openHashhand = true;
						session.attchProperties_(JSON.parse(data));
						this.eventListener_.onProtocolSessionOpen_(session);
					}
					break;
				case "object":
					var fileReader = new FileReader();
					fileReader.onload = function() {
						var messageDecode = p2p$.com.webp2p.protocol.webrtc.Packet.decode(new Uint8Array(this.result), me.getType());
						me.getEventListener_().onProtocolSessionMessage_(session, messageDecode);
					};
					fileReader.readAsArrayBuffer(data);
					break;
				}
			}

		}
	},

	onWebSocketClose_ : function(evt, session) {
		if (!this.opened_) {
			return false;
		}

		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (session == peer.session_) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::websocket::Manager Session({0}, {1}:{2}) closed", peer.id_, peer.internetIp_, peer.internetPort_));

				this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.size();
				this.eventListener_.onProtocolSessionClose_(session);
				peer.disconnect();
				// updateExchangePeerIds();
				break;
			}
		}
		return true;
	}
});p2p$.ns('com.webp2p.core.player');

p2p$.com.webp2p.core.player.VIDEO_STATUS = {
	loadstart : 'loadstart',
	loadeddata : 'loadeddata',
	canplay : 'canplay',
	seeking : 'seeking',
	seeked : 'seeked',
	breakstart : 'breakstart',
	breakend : 'breakend',
	replay : 'replay'
};

p2p$.com.webp2p.core.player.PLAY_STATES = {
	status : 'IDE',
	IDE : 'IDE',
	PLAY : 'PLAY',
	PLAYING : 'PLAYING',
	PAUSE : 'PAUSE',
	RESUME : 'RESUME',
	SEEKING : 'SEEKING',
	SEEKED : 'SEEKED',

	VideoEvents : // events
	[ "abort",// 当音频/视频的加载已放弃时
	"canplay",// 当浏览器可以播放音频/视频时
	"canplaythrough",// 当浏览器可在不因缓冲而停顿的情况下进行播放时
	"durationchange",// 当音频/视频的时长已更改时
	"emptied",// 当目前的播放列表为空时
	"empty", "ended",// 当目前的播放列表已结束时
	"error",// 当在音频/视频加载期间发生错误时
	"loadeddata",// 当浏览器已加载音频/视频的当前帧时
	"loadedmetadata",// 当浏览器已加载音频/视频的元数据时
	"loadstart",// 当浏览器开始查找音频/视频时
	"pause",// 当音频/视频已暂停时
	"play",// 当音频/视频已开始或不再暂停时
	"playing",// 当音频/视频在已因缓冲而暂停或停止后已就绪时
	"progress",// 当浏览器正在下载音频/视频时
	"ratechange",// 当音频/视频的播放速度已更改时
	"seeked",// 当用户已移动/跳跃到音频/视频中的新位置时
	"seeking",// 当用户开始移动/跳跃到音频/视频中的新位置时
	"stalled",// 当浏览器尝试获取媒体数据，但数据不可用时
	"suspend",// 当浏览器刻意不获取媒体数据时
	"timeupdate",// 当目前的播放位置已更改时
	"volumechange",// 当音量已更改时
	"waiting" ]
};

p2p$.com.webp2p.core.player.Context = CdeBaseClass.extend_({
	isEncode_ : false,
	metaDataType_ : 0,
	avccName_ : null,
	aacName_ : null,
	bufferd_ : null,
	bufferLength_ : 0,
	playState_ : "PLAY",
	buffers_ : null,
	currentPlayTime_ : 0,
	videoStatus_ : "",
	lastCurrentTime_ : -1,

	init : function() {
		this.playType_ = -1;
		this.isEncode_ = false;
		this.metaDataType_ = -1;
		this.avccName_ = null;
		this.aacName_ = null;
		this.bufferd_ = null;
		this.bufferLength_ = 0;
		this.playState_ = "PLAY";
		this.buffers_ = [];
		this.currentPlayTime_ = 0;
		this.videoStatus_ = "";
		this.lastCurrentTime_ = -1;
	}
});p2p$.ns('com.webp2p.core.player');

p2p$.com.webp2p.core.player.Creator = CdeBaseClass.extend_({
	channel_ : null,
	player_ : null,
	url_ : "",
	video_ : null,
	stream_ : null,
	wrapper_ : null,

	init : function() {
		this.channel_ = null;
		this.player_ = null;
		this.url_ = "";
		this.video_ = null;
		this.stream_ = null;
	},

	initialize_ : function(wrapper, url, video, stream) {
		this.wrapper_ = wrapper;
		this.url_ = url;
		this.video_ = video;
		this.stream_ = stream;
	},

	changeChannel_ : function(url) {
		this.url_ = url;
		this.player_.stop();
		this.player_ = null;
	},

	createPlayer_ : function() {

		this.channel_ = this.stream_.requestPlay_(this.url_);
		if (this.channel_ != null) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::Creator::Create player open channel({0}) success", this.url_));
			if (this.channel_.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
				// VOD
				this.player_ = new p2p$.com.webp2p.core.player.VodPlayer(this.wrapper_);
				if (this.wrapper_.firstSeekTime_) {
					this.channel_.setFirstSeekTime_(this.wrapper_.firstSeekTime_);
				}
			} else {
				// LIVE
				this.player_ = new p2p$.com.webp2p.core.player.LivePlayer(this.wrapper_);
			}

			// this.startMainTimer();
			if (this.player_ != null) {
				this.player_.initialize_(this.url_, this.video_, this.stream_, this.channel_);
				if (this.player_.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
					if (this.wrapper_.firstSeekTime_) {
						this.player_.firstSeekStatus_ = this.player_.kFirstSeekInit;
						this.player_.firstSeekPosition_ = this.wrapper_.firstSeekTime_;
					}
				}
			} else {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::Creator.Create player failed"));
			}
		} else {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::Creator::Create player open channel({0}) failed", this.url_));
		}

		return this.player_;
	}
});p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.BasePlayer = CdeBaseClass.extend_({

	stream_ : null,
	wrapper_ : null,
	url_ : "",
	mediaSource_ : null,
	mediaOpened_ : false,
	fectchInterval_ : 500,
	channel_ : null,
	video_ : null,
	blockList_ : null,
	sourceBuffer_ : null,
	sourceIdle_ : true,
	sourceMime_ : null,
	fileMp4_ : null,
	initFnum_ : 0,
	fetchTimer_ : null,
	metaData_ : null,
	nextSegmentId_ : 0,
	playerContext_ : null,
	preTime_ : 0,
	preSegmentId_ : "",
	breakTimes_ : 0,
	videoDuration_ : 0,
	macSafariPattern_ : false,
	videoDuration_ : 0,
	actived_ : false,
	maxErrorTimes_ : 0,
	init : function(wrapper) {
		this.wrapper_ = wrapper;
		this.stream_ = null;
		this.url_ = "";
		this.mediaSource_ = null;
		this.mediaOpened_ = false;
		this.channel_ = null;
		this.blockList_ = [];
		this.sourceBuffer_ = null;
		this.video_ = null;
		this.fileMp4_ = new p2p$.com.webp2p.tools.ts2mp4.FileHandler();

		this.initFnum_ = 0;
		this.fetchTimer_ = null;
		this.metaData_ = null;
		this.nextSegmentId_ = 0;
		this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
		this.preTime_ = 0;
		this.preSegmentId_ = -1;
		this.sourceIdle_ = true;
		this.macSafariPattern_ = false;
		this.actived_ = false;
		// this.loop_ = 0;
		this.urgentSegment_ = 0;
		this.errorTimes_ = 0;
		this.maxErrorTimes_ = 3;
	},

	stopFetchTimer_ : function() {
		if (this.fetchTimer_) {
			clearInterval(this.fetchTimer_);
			this.fetchTimer_ = null;
		}
	},

	initialize_ : function(url, video, stream, channel) {
		this.channel_ = channel;
		this.url_ = url;
		this.stream_ = stream;
		this.video_ = video;
		this.actived_ = true;
		this.mediaOpened_ = false;

		var mediaType = p2p$.com.webp2p.core.supernode.Enviroment.getMediaType_();
		if (mediaType.mediasource) {
			if (mediaType.ts) {
				// no decoder
				this.macSafariPattern_ = true;
			} else if (mediaType.mp4) {
				this.playerContext_.isEncode_ = true;
			}
		}

		this.addVideoEvents_(this.video_);
		this.startTimer_();
		return true;
	},
	startTimer_ : function() {
		this.onLoop_();
		if (this.fetchTimer_) {
			clearInterval(this.fetchTimer_);
		}
		this.fetchTimer_ = setInterval(this.onLoop_.bind(this), this.fectchInterval_);
	},
	play : function() {
		if (!this.video_) {
			return;
		}
		if (this.video_.paused) {
			this.video_.play();
		}
		return;
	},

	onLoop_ : function() {
		if (!this.metaData_) {
			this.getMetaData_();
		} else {
			if (this.actived_) {
				this.getSegment_();
				this.playSegment_();
			}
		}
		// this.loop_++;
		// if (this.loop_ > 20) {
		// this.loop_ = 0;
		// this.onError_();
		// }
	},

	getMetaData_ : function() {
		if ((this.channel_.metaData_ && this.channel_.metaData_.p2pGroupId_) || (this.channel_.metaData_ && this.channel_.onMetaCompleteCode_ == 302)) {
			this.metaData_ = this.channel_.metaData_;
			this.pictureHeight_ = this.metaData_.pictureHeight_;
			this.pictureWidth_ = this.metaData_.pictureWidth_;
		}
	},

	getSegment_ : function() {
		if (this.blockList_.length >= 1) {
			return;
		}

		if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kFirstSeekInit) {
			this.firstSeekStatus_ = this.kFirstSeekWaitDownLoadSegment;
			var seek2Segment = this.findSegment_(this.firstSeekPosition_);
			if (seek2Segment) {
				this.nextSegmentId_ = seek2Segment.id_;
				this.preSeekTime_ = this.firstSeekPosition_;
			} else {
			}
		}

		var tempBlock = this.getBlock_(this.nextSegmentId_);
		if (!tempBlock) {
			return;
		}
		this.refreshUrgentSegment_(tempBlock.id_);

		var streamInfo = this.stream_.requestPlaySlice_(this.channel_.getId_(), tempBlock.id_, this.urgentSegment_);
		if (!streamInfo || !streamInfo.stream) {
			var nowTime = new Date().getTime();
			if (!this.lastSegmentFailedLogTime_ || (this.lastSegmentFailedLogTime_ + 5000) < nowTime) {
				this.lastSegmentFailedLogTime_ = nowTime;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::vtime({0}) getSegment({1}) stream({2})", this.video_ ? this.video_.currentTime.toFixed(2)
						: 0, this.nextSegmentId_, (streamInfo.stream != null)));
			}
			return null;
		}

		this.preSegmentId_ = tempBlock.id_;
		this.nextSegmentId_ = tempBlock.nextId_;
		var startChangeTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Start change to mp4"));

		var stream = this.fileMp4_.processFileSegment_(streamInfo.stream, {
			start : tempBlock.startTime_ / 1000,
			duration : tempBlock.duration_,
			type : 0,
			width : tempBlock.pictureWidth_ || 960,
			height : tempBlock.pictureHeight_ || 400,
		}, this.initFnum_, this.playerContext_.isEncode_);
		tempBlock.timestamp_ = this.fileMp4_.startTime_;
		this.playerContext_.avccName_ = this.fileMp4_.getMediaStreamAvccName_();
		this.playerContext_.aacName_ = this.fileMp4_.getMediaStreamAacName_();
		this.initFnum_++;
		var endChangeTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer turn to mp4, segmentid({0}), before({1}), after({2}),timeuse({3}),playtime({4})", tempBlock.id_,
				streamInfo.stream.length, stream.length, ((endChangeTime - startChangeTime) / 1000).toFixed(1), this.video_ ? this.video_.currentTime
						.toFixed(2) : 0));
		this.blockList_.push({
			data : stream,
			block : tempBlock,
			mime : this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_)
		});
	},

	findSegment_ : function(time) {
		var segment = null;
		if (this.metaData_) {
			for ( var n = 0; n < this.metaData_.segments_.length; n++) {
				segment = this.metaData_.segments_[n];
				if (segment.startTime_ <= time * 1000 && time * 1000 < segment.startTime_ + segment.duration_) {
					return segment;
				}
			}
		}
		return null;
	},

	playSegment_ : function() {
	},

	calculateBufferLength_ : function() {
	},

	existTime_ : function(value) {
		var b = false;
		for ( var i = 0; i < this.playerContext_.buffers_.length; i++) {
			var _start = this.playerContext_.buffers_[i][0];
			var _end = this.playerContext_.buffers_[i][1];
			if (value >= _start && value <= _end) {
				b = true;
				break;
			}
		}
		return b;
	},

	createMediaSource_ : function() {
		var media = null;
		try {
			media = new MediaSource();

			this.onMediaSourceOpenBinded_ = this.onMediaSourceOpen_.bind(this);
			this.onMediaSourceEndedBinded_ = this.onMediaSourceEnded_.bind(this);
			this.onMediaSourceClosedBinded_ = this.onMediaSourceClosed_.bind(this);
			this.onMediaSourceErrorBinded_ = this.onMediaSourceError_.bind(this);

			media.addEventListener('sourceopen', this.onMediaSourceOpenBinded_);
			media.addEventListener('sourceended', this.onMediaSourceEndedBinded_);
			media.addEventListener('sourceclose', this.onMediaSourceClosedBinded_);
			media.addEventListener('error', this.onMediaSourceErrorBinded_);

			this.actived_ = true;
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Add media source failed: {0}", (e || "").toString()));
		}
		return media;
	},

	removeSourceBuffer_ : function() {
		if (!this.mediaSource_) {
			return;
		}
		// this.mediaSource_.endOfStream();
		try {
			if (this.sourceBuffer_) {
				this.sourceBuffer_.abort();
				this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
				this.removeSourceEvents_(this.sourceBuffer_);
				this.sourceBuffer_ = null;
			}
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::remove sourcebuffer failed: {0}", (e || "").toString()));
		}
	},

	clearMediaSource_ : function() {
		this.mediaOpened_ = false;
		if (!this.mediaSource_) {
			return;
		}

		try {
			if (this.sourceBuffer_) {
				this.sourceBuffer_.abort();
				this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
				this.removeSourceEvents_(this.sourceBuffer_);
				this.sourceBuffer_ = null;
			}
			this.mediaSource_.endOfStream();
			this.mediaSource_.removeEventListener('sourceopen', this.onMediaSourceOpenBinded_);
			this.mediaSource_.removeEventListener('sourceended', this.onMediaSourceEndedBinded_);
			this.mediaSource_.removeEventListener('sourceclose', this.onMediaSourceClosedBinded_);
			this.mediaSource_.removeEventListener('error', this.onMediaSourceErrorBinded_);
			this.mediaSource_ = null;
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Clear media source failed: {0}", (e || "").toString()));
		}
	},

	formatMimeTypeName_ : function(avcc, aac) {
		var typeName = 'video/mp2t; codecs="avc1.64001f"';
		if (avcc) {
			if (this.playerContext_.isEncode_) {
				typeName = 'video/mp4; codecs="' + avcc + ', ' + aac + '"';
			} else {
				typeName = 'video/mp2t; codecs="' + avcc + ', ' + aac + '"';
			}
		}
		return typeName;
	},

	addMediaSourceHeader_ : function() {
		var _b = false;

		// if (this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
		// this.playerContext_.aacName_ = 'mp4a.40.2';
		// } else {
		// if (this.channel_.metaData_.programId_ && this.channel_.metaData_.programId_.length != 32) {
		// this.playerContext_.aacName_ = 'mp4a.40.5';
		// } else {
		// this.playerContext_.aacName_ = 'mp4a.40.2';
		// }
		// }

		var typeName = this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_);
		// var supported = MediaSource.isTypeSupported(typeName);
		var mediaDescriptions = this.fileMp4_.getMediaInfoDescriptions_();
		if (this.mediaSource_ && !this.sourceBuffer_) {
			try {
				if (this.mediaSource_.sourceBuffers.length > 0) {
					return true;
				}

				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Add media source header, type: {0}, medias: {1}", typeName, mediaDescriptions));
				this.sourceBuffer_ = this.mediaSource_.addSourceBuffer(typeName);
				this.sourceIdle_ = true;
				this.sourceMime_ = typeName;
				this.addSourceEvents_(this.sourceBuffer_);
				// this.addSourceBufferListEvent_();
				_b = true;
			} catch (err) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Add media source header, type: {0}, medias: {1}, error: {2}", typeName,
						mediaDescriptions, err.toString()));
				this.clearMediaSource_();
				_b = false;
			}
		}

		return _b;
	},

	onMediaSourceOpen_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::onMediaSource open, {0} arguments", arguments.length));
		if (this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
			this.mediaSource_.duration = this.channel_.metaData_.totalDuration_ / 1000;
		}
		this.mediaOpened_ = true;
		this.addMediaSourceHeader_();
		this.playSegment_();
	},

	onMediaSourceEnded_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::onMediaSource end, {0} arguments,({1}),({2})", arguments.length, arguments[1], arguments[2]));
	},

	onMediaSourceClosed_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::onMediaSource close, {0} arguments", arguments.length));
		this.actived_ = false;
		this.mediaOpened_ = false;
	},

	onMediaSourceError_ : function(evt) {
		if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
			return;
		}
		P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::onMediaSource error, {0} arguments", arguments.length));
		this.actived_ = false;
		this.mediaOpened_ = false;
	},

	addSourceBufferListEvent_ : function() {
		var bufferlists = this.mediaSource_.sourceBuffers;
		this.onRemoveSourceBufferBinded_ = this.onRemoveSourceBuffer_.bind(this);
		this.onAddSourceBufferBinded_ = this.onAddSourceBuffer_.bind(this);
		bufferlists.addEventListener('removesourcebuffer', this.onRemoveSourceBufferBinded_);
		bufferlists.addEventListener('addsourcebuffer', this.onAddSourceBufferBinded_);
	},

	onRemoveSourceBuffer_ : function() {
		this.sourceBufferRemoved_ = true;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::removesourcebuffer..."));
	},

	onAddSourceBuffer_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::onAddSourceBuffer..."));
	},

	addSourceEvents_ : function(source) {
		try {

			this.onSourceUpdateEndBinded_ = this.onSourceUpdateEnd_.bind(this);
			this.onSourceUpdateBinded_ = this.onSourceUpdate_.bind(this);
			this.onSourceUpdateStartBinded_ = this.onSourceUpdateStart_.bind(this);
			this.onSourceUpdateErrorBinded_ = this.onSourceUpdateError_.bind(this);

			source.addEventListener('updateend', this.onSourceUpdateEndBinded_)
			source.addEventListener('update', this.onSourceUpdateBinded_);
			source.addEventListener('updatestart', this.onSourceUpdateStartBinded_);
			source.addEventListener('error', this.onSourceUpdateErrorBinded_);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Add source event failed: {0}", (e || "").toString()));
		}
	},

	removeSourceEvents_ : function(source) {
		try {
			var me = this;
			source.removeEventListener('updateend', this.onSourceUpdateEndBinded_);
			source.removeEventListener('update', this.onSourceUpdateBinded_);
			source.removeEventListener('updatestart', this.onSourceUpdateStartBinded_);
			source.removeEventListener('error', this.onSourceUpdateErrorBinded_);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Remove source event failed: {0}", (e || "").toString()));
		}
	},

	onSourceUpdateStart_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Source update start"));
		this.sourceIdle_ = false;
	},

	onSourceUpdate_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Source updated"));
	},

	onSourceUpdateEnd_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		this.sourceIdle_ = true;
		if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kFirstSeekWaitDownLoadSegment) {
			this.video_.currentTime = this.preSeekTime_;
			this.firstSeekStatus_ = this.kFirstSeekDownLoadSegmentOk;
		}
		try {
			this.playerContext_.bufferd_ = this.sourceBuffer_.buffered;
		} catch (err) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer buffered error ({0})", err));
		}

		var currenTime = this.video_.currentTime;
		if (this.playerContext_.bufferd_ && this.playerContext_.bufferd_.length > 0) {
			for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Source update finished, idx({0}), time({1}), range({2}, {3})", i, (currenTime || 0)
						.toFixed(3), this.playerContext_.bufferd_.start(i), this.playerContext_.bufferd_.end(i)));
			}
		}
	},

	onSourceUpdateError_ : function(evt) {
		if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
			return;
		}
		P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Source update error:{0}", arguments.length));
	},

	addVideoEvents_ : function(video) {
		var events = p2p$.com.webp2p.core.player.PLAY_STATES.VideoEvents;
		this.videoStatusHandlerBinded_ = this.videoStatusHandler_.bind(this);
		for ( var i = 0; i < events.length; i++) {
			try {
				video.addEventListener(events[i], this.videoStatusHandlerBinded_);
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Add video event({0}) failed: {1}", events[i], (e || "").toString()));
			}
		}
	},

	removeVideoEvents_ : function(video) {
		var events = p2p$.com.webp2p.core.player.PLAY_STATES.VideoEvents;
		for ( var i = 0; i < events.length; i++) {
			try {
				video.removeEventListener(events[i], this.videoStatusHandlerBinded_);
			} catch (e) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::BasePlayer::Remove video event({0}) failed: {1}", events[i], (e || "").toString()));
			}
		}
	},

	videoStatusHandler_ : function(evt) {
		if (!this.video_ || this.video_ != evt.target) {
			return;
		}

		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		var type = evt.type;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Video status handler, type({0}),time({1})", type, time));
		switch (type) {
		case "abort":
			break;
		case "canplay":
			this.onVideoCanPlay_();
			break;
		case "canplaythrough":
			this.onCanPlayThrough_();
			break;
		case "durationchange":
			break;
		case "emptied":
			break;
		case "ended":
			// this.onEnded_();
			break;
		case "error":
			this.onError_();
			break;
		case "loadeddata":
			this.onLoadedData_();
			break;
		case "loadedmetadata":
			this.onVideoLoadedMetaData_();
			break;
		case "loadstart":
			this.loadStart_();
			break;
		case "pause":
			this.onVideoPuase_();
			break;
		case "play":
			this.onVideoPlay_();
			break;
		case "playing":
			this.onVideoPlaying_();
			break;
		case "progress":
			this.onVideoProgress_();
			break;
		case "ratechange":
			break;
		case "seeked":
			this.onVideoSeeked_();
			break;
		case "seeking":
			this.onVideoSeeking_();
			break;
		case "stalled":
			break;
		case "suspend":
			break;
		case "timeupdate":
			this.onVideoTimeUpdate_();
			break;
		case "volumechange":
			break;
		case "waiting":
			this.onVideoWaiting_();
			break;
		default:
			break;
		}
	},
	onVideoProgress_ : function() {

	},
	loadStart_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video loaded start"));
		if (this.wrapper_.onbufferstart) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video event onloadStart bufferstart"));
			this.wrapper_.onbufferstart();
		}
		this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart;
	},

	onLoadedData_ : function() {
	},

	onVideoLoadedMetaData_ : function() {
		this.videoDuration_ = this.video_.duration ? this.video_.duration.toFixed(1) : 0;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::Video loaded meta data, duration({0})", this.videoDuration_));
	},

	onVideoTimeUpdate_ : function() {
		this.errorTimes_ = 0;
		if (this.wrapper_.ontimeupdate) {
			this.wrapper_.ontimeupdate();
		}
	},

	onVideoSeeking_ : function() {
	},

	onVideoSeeked_ : function() {
	},
	onVideoPuase_ : function() {
		if (this.wrapper_.onpause) {
			this.wrapper_.onpause();
		}
	},
	onVideoPlay_ : function() {
		if (this.wrapper_.onplay) {
			this.wrapper_.onplay();
		}
	},

	onVideoWaiting_ : function() {
	},

	onVideoCanPlay_ : function() {
	},

	onCanPlayThrough_ : function() {
	},

	onVideoPlaying_ : function() {
	},

	onBufferEndAndOnPrepared_ : function() {
		if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video can play"));
			this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay;
			if (this.wrapper_.onbufferend) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video event onVideoCanPlay bufferend"));
				this.wrapper_.onbufferend();
			}
			if (this.wrapper_.onprepared) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video event onVideoCanPlay onprepared"));
				this.wrapper_.onprepared();
			}
		}
	},

	onEnded_ : function() {
		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		this.video_.pause();
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video ended, time({0})", time));
		if (this.wrapper_.oncomplete) {
			this.wrapper_.oncomplete();
		}
	},

	onError_ : function() {
		var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
		var code = -100;
		if (this.video_ && this.video_.error) {
			// MEDIA_ERR_ABORTED: 1
			// MEDIA_ERR_NETWORK: 2
			// MEDIA_ERR_DECODE: 3
			// MEDIA_ERR_SRC_NOT_SUPPORTED: 4
			code = this.video_.error.code;
		}
		this.actived_ = false;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::BasePlayer::Video error, play time({0}), time({1}), code({2})", this.playerContext_.currentPlayTime_, time,
				code));

		if (this.errorTimes_ < this.maxErrorTimes_) {
			return;
		}
		if (this.wrapper_.onerror) {
			this.wrapper_.onerror(code);
		}
	},

	stop : function() {
		this.actived_ = false;
		this.stopFetchTimer_();
		this.clearMediaSource_();
		if (this.video_) {
			this.video_.pause();
			this.removeVideoEvents_(this.video_);
			// this.video_ = null;
		}

		this.blockList_ = [];
		this.fileMp4_ = new p2p$.com.webp2p.tools.ts2mp4.FileHandler();
		this.initFnum_ = 0;
		this.metaData_ = null;
		this.nextSegmentId_ = 0;
		this.preTime_ = 0;
		this.preSegmentId_ = -1;
		this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
		this.breakTimes_ = 0;
	},

	pause : function() {
		if (this.video_) {
			this.video_.pause();
		}
	},

	replay : function() {
	},

	seek : function(postion) {
	},

	getCurrentPosition : function() {
		if (this.video_) {
			if (this.macSafariPattern_) {
				if (this.playerContext_.playState_ != p2p$.com.webp2p.core.player.PLAY_STATES.PLAY) {
					return this.preSeekTime_;
				}
			}
			return this.video_.currentTime;
		}
		return null;
	},

	getDuration : function() {
		if (this.video_) {
			return this.video_.duration.toFixed(1);
		}
		return null;
	}
});p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.VodPlayer = p2p$.com.webp2p.core.player.BasePlayer
		.extend_({

			kNoFirstSeek : -1,
			kFirstSeekInit : 0,
			kFirstSeekWaitDownLoadSegment : 1,
			kFirstSeekDownLoadSegmentOk : 2,
			kFirstSeekStatusDone : 3,

			seekForSafariPlay_ : false,
			firstSeekStatus_ : -1,
			firstSeekPosition_ : 0,
			jump2SeekPostion_ : false,
			addNextSegmentId_ : false,
			addedSegment_ : null,
			init : function(wrapper) {
				this._super(wrapper);
				this.seekForSafariPlay_ = false;
				this.firstSeekStatus_ = -1;
				this.firstSeekPosition_ = 0;
				this.jump2SeekPostion_ = false;
				this.addNextSegmentId_ = false;
				this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod;
			},
			play : function() {
				if (!this.video_) {
					return;
				}
				if (this.video_.paused) {
					this.video_.play();
				}
				if (!this.macSafariPattern_ || this.video_.currentTime > 0.1) {
					return;
				}
				this.jump2SeekPostion_ = true;
				this.video_.currentTime = 0.1;
				return;
			},
			getBlock_ : function(nextSegment) {
				if (this.metaData_) {
					if (!this.addNextSegmentId_) {
						for ( var n = 0; n < this.metaData_.segments_.length - 1; n++) {
							var segment = this.metaData_.segments_[n];
							var segment2 = this.metaData_.segments_[n + 1];
							segment.nextId_ = segment2.id_;
							if (n == this.metaData_.segments_.length - 2) {
								segment2.nextId_ = -1;
							}
							this.addNextSegmentId_ = true;
						}
					}

					for ( var n = 0; n < this.metaData_.segments_.length; n++) {
						var segment = this.metaData_.segments_[n];
						if (segment.id_ == nextSegment) {
							return segment;
						}
					}
				} else {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::VodPlayer::Meta data is null"));
					return null;
				}
			},
			refreshUrgentSegment_ : function(segmentId) {
				this.urgentSegment_ = segmentId;
			},
			playSegment_ : function() {
				if (!this.playerContext_.avccName_) {
					return;
				}

				if (!this.mediaSource_) {
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::Create media source ..."));
					this.sourceBuffer_ = null;
					this.mediaSource_ = this.createMediaSource_();
					this.video_.src = window.URL.createObjectURL(this.mediaSource_);
					if (this.firstSeekStatus_ != this.kFirstSeekWaitDownLoadSegment) {
						// this.video_.play();
					}
				}

				if (!this.sourceBuffer_) {
					this.delayTime_++;
					if (this.delayTime_ > 500) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::VodPlayer::Play segment with delay count({0})", this.delayTime_));
					}
					return;
				}
				if (this.sourceBuffer_.updating) {
					return;
				}

				var currentTime = this.video_.currentTime.toFixed(1);
				var vRemaining = this.video_.duration - this.video_.currentTime;
				if (this.playerContext_.lastCurrentTime_ == currentTime && !this.video_.paused && !this.video_.ended && Math.abs(vRemaining) > 5) {
					this.breakTimes_++;
					if (this.breakTimes_ > 4) {
						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend) {
							if (this.wrapper_.onbufferstart) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Breakstart onbufferend current({0}), status({1})", this.video_.currentTime
										.toFixed(1), this.playerContext_.videoStatus_));
								this.wrapper_.onbufferstart();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.breakstart;
						}
					}
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer break {0} times, current {1}, status({2}) ...", this.breakTimes_, currentTime,
							this.playerContext_.videoStatus_));
					// if (this.breakTimes_ > 10) {
					// var seekToTime = this.video_.currentTime + 0.2;
					// if (seekToTime < this.video_.duration - 1) {
					// P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer
					// break {0} times ...,seek to {1}", this.breakTimes_,
					// seekToTime));
					// this.seek(seekToTime);
					// }
					// }
				}

				if (this.playerContext_.lastCurrentTime_ != currentTime && !this.video_.paused) {
					if (this.breakTimes_ > 4) {
						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakstart) {
							if (this.wrapper_.onbufferend) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Breakend onbufferend current({0}), status({1})", this.video_.currentTime
										.toFixed(1), this.playerContext_.videoStatus_));
								this.wrapper_.onbufferend();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend;
						}
					}
					this.breakTimes_ = 0;
					this.playerContext_.lastCurrentTime_ = currentTime;
				}

				if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.PLAY_STATES.SEEKING && this.existTime_(this.preSeekTime_)) {
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.PLAY_STATES.SEEKED;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Play exist time({0}), state({1})", this.preSeekTime_, this.playerContext_.playState_));
				}

				if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.PLAY_STATES.SEEKED) {
					if (this.macSafariPattern_) {
						P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::Play segment firstSeekStatus={0} "
								+ "preSeekTime_({1})=firstSeekPosition_=({2})={3}", this.firstSeekStatus_, this.preSeekTime_, this.firstSeekPosition_,
								(this.preSeekTime_ == this.firstSeekPosition_)));
						do {
							if (this.firstSeekStatus_ == this.kFirstSeekStatusDone) {
								this.firstSeekStatus_ = this.kNoFirstSeek;
								if (this.preSeekTime_ == this.firstSeekPosition_) {
									break;
								}
							}
							this.jump2SeekPostion_ = true;
							this.video_.currentTime = this.preSeekTime_;
							P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::Play segment video current time == pre seek time"));
						} while (0);
					}
					// if (!this.macSafariPattern_) {
					// this.video_.play();
					// }
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.PLAY_STATES.PLAY;
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::playSegment existTime({0}) playState({1})", this.preSeekTime_,
							this.playerContext_.playState_));
				}
				this.calculateBufferLength_();

				if (this.blockList_.length > 0 && this.sourceIdle_ && this.playerContext_.bufferLength_ < 3) {
					// add source
					var streamInfo = this.blockList_[0];
					this.blockList_.shift();

					// if (this.playerContext_.playState_ ==
					// p2p$.com.webp2p.core.player.PLAY_STATES.SEEKING &&
					// this.existTime_(this.preSeekTime_)) {
					//
					// } else {
					if (streamInfo.block.index_ == 0 && !this.seekForSafariPlay_) {
						this.isFirstSegment_ = true;
						this.seekForSafariPlay_ = true;
					}
					this.sourceBuffer_.appendBuffer(streamInfo.data);
					this.addedSegment_ = streamInfo.block;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Add data success ,buffer({0}),"
							+ "block({1}s), segment({2}), start time ({3}),  timestamp({4}),segment length ({5})",
							this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000, streamInfo.block.id_,
							streamInfo.block.startTime_ / 1000, streamInfo.block.timestamp_, streamInfo.data.length));
					// }
					if (this.playerContext_.playState_ == p2p$.com.webp2p.core.player.PLAY_STATES.SEEKING) {
						// chrome don't need to pause
						if (this.macSafariPattern_) {
							this.video_.pause();
						}
					}
				}
			},

			calculateBufferLength_ : function() {
				if (!this.video_) {
					return;
				}

				var _st = 0;
				var _ed = 0;
				if (this.playerContext_.playState_ != p2p$.com.webp2p.core.player.PLAY_STATES.PLAY) {
					this.preTime_ = this.preSeekTime_;
				} else {
					this.preTime_ = this.video_.currentTime;
				}
				this.playerContext_.bufferLength_ = 0;
				if (this.playerContext_.bufferd_) {

					this.playerContext_.buffers_ = [];
					for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
						var _start = this.playerContext_.bufferd_.start(i);
						var _end = this.playerContext_.bufferd_.end(i);
						this.playerContext_.buffers_.push([ _start, _end ]);
					}

					for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
						_st = this.playerContext_.bufferd_.start(i);
						_ed = this.playerContext_.bufferd_.end(i);

						if (this.video_.currentTime < 1 && this.isFirstSegment_) {
							this.playerContext_.bufferLength_ = 4;

							// if the device is the mobile phone or the safari om mac book
							if (this.macSafariPattern_) {
								this.seekForSafariPlay_ = true;
								this.isFirstSegment_ = false;
								// wating for playing by external call 'play' method
								break;
							}
							if (this.onErrorReplay_) {
								this.video_.currentTime = _st;
								// this.video_.play();
								this.onErrorReplay_ = null;
							}
							// var platform = p2p$.com.webp2p.core.supernode.Enviroment.getOSType_();
							// var position = platform.indexOf("Win");
							// if (position == -1) {
							// // this.video_.currentTime = _st;
							// }

						} else {
							if (_st > this.preTime_) {
								this.playerContext_.bufferLength_ += (_ed - _st);
							} else if (_st <= this.preTime_ && _ed >= this.preTime_) {
								this.playerContext_.bufferLength_ = (_ed - this.preTime_);
							}
						}

					}
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::vod::Player::Calculate buffer, current({0}), pre({1}), buffer({2}), "
						+ "pre segment({3}), next segment({4}), play state({5})", this.video_.currentTime, this.preTime_, this.playerContext_.bufferLength_,
						this.preSegmentId_, this.nextSegmentId_, this.playerContext_.playState_));
			},

			seek : function(postion) {
				if (!this.mediaSource_) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Seek postion ({0}),mediaSource is null", postion));
					return;
				}
				if (isNaN(postion)) {
					return;
				}
				if (postion <= 1) {
					postion = 1;
				}
				if (postion >= this.mediaSource_.duration) {
					postion = this.mediaSource_.duration - 0.5;
				}
				var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				this.preSeekTime_ = Number(postion).toFixed(0);
				if (!this.macSafariPattern_) {
					this.video_.currentTime = postion;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Seek vtime({0}) seekTo({1})", time, this.preSeekTime_));
				} else {
					if (this.innerSeek_) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Seek innerseek return vtime({0}) seekTo({1})", time, this.preSeekTime_));
						return;
					}
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::seek videoStatus({0})", this.playerContext_.videoStatus_));
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked
							|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::seek vtime({0}) status({1})", time, this.playerContext_.videoStatus_));
						if (this.wrapper_.onbufferstart) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Seek start seeking bufferstart  seekTo({0})", this.preSeekTime_));
							this.wrapper_.onbufferstart();
						}
						this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking;
					}
					// this.video_.pause();
					P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::seek time({0}) isPaused({1})", time, this.video_.paused));

					this.seek2(postion);
				}

			},

			seek2 : function(time) {
				var seek2Segment = this.findSegment_(time);
				if (seek2Segment) {
					this.playerContext_.playState_ = p2p$.com.webp2p.core.player.PLAY_STATES.SEEKING;
					this.nextSegmentId_ = seek2Segment.id_;
					try {
						this.sourceBuffer_.abort(); // mac
						// safari
						// play
					} catch (e) {
						P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::VodPlayer::seek2 abort error({0})", e));
					}
					if (this.macSafariPattern_ || !this.existTime_(this.preSeekTime_)) {
						if (this.firstSeekStatus_ != this.kFirstSeekDownLoadSegmentOk) {
							try {
								this.sourceBuffer_.remove(0, this.mediaSource_.duration);
								P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::seek2 remove length {0}", this.sourceBuffer_.buffered.length));
								for ( var i = 0; i < this.sourceBuffer_.buffered.length; i++) {
									P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::seek2 remove: start: {0}, end: {1}, length: {2}",
											this.sourceBuffer_.buffered.start(i), this.sourceBuffer_.buffered.end(i), this.sourceBuffer_.buffered.length));
								}
							} catch (e) {
								P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::VodPlayer::seek2 remove error({0})", e));
							}
						}

					}
					this.blockList_ = [];
					this.playerContext_.bufferLength_ = 0;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::seek2 seek to({0}), next segment({1}), state({2})", time, this.nextSegmentId_,
							this.playerContext_.playState_));
					this.onLoop_();
				} else {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::seek2 find segment failed, seek to({0}), next segment({1})", time, this.nextSegmentId_));
				}
			},

			onVideoTimeUpdate_ : function() {
				if (this.videoDuration_ < 1) {
					return;
				}
				this._super();
				var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
				this.playerContext_.currentPlayTime_ = time;
				var remain = (this.videoDuration_ - time).toFixed(1);
				if (Math.abs(remain) <= 0.5) {
					this.onEnded_();
				}
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::Video time update, time({0}) remain({1}), pre seek({2})", time, remain, this.preSeekTime_));
			},

			onVideoSeeking_ : function() {

				var time = this.video_.currentTime ? this.video_.currentTime : 0;
				if (this.macSafariPattern_) {
					if (this.jump2SeekPostion_) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer::onVideoSeeking innerSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", time,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
						return;
					}
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking) {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer::onVideoSeeking autoBackSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", time,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
						return;
					}

				}
				if (this.firstSeekStatus_ != this.kNoFirstSeek) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeking firstSeek start"));
				}
				this.preSeekTime_ = time;
				if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.canplay
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked
						|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.breakend) {
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeking vtime({0}) seekTo({1}) status({2})", time, this.preSeekTime_,
							this.playerContext_.videoStatus_));
					if (this.wrapper_.onbufferstart) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeking start seeking bufferstart"));
						this.wrapper_.onbufferstart();
					}
					this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking;
				}
				// safari need pause the video first for seeking
				this.video_.pause();
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeking to({0}), paused({1})", time, this.video_.paused));
				this.seek2(time);
			},

			onVideoSeeked_ : function() {
				var time = this.video_.currentTime ? this.video_.currentTime : 0;
				if (this.macSafariPattern_) {
					if (this.jump2SeekPostion_) {
						this.jump2SeekPostion_ = false;
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer::onVideoSeeked innerseek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", time,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));

						if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking
								|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.loadstart) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked vtime({0}) status({1})", time, this.playerContext_.videoStatus_));
							this.video_.play();
							if (this.wrapper_.onbufferend) {
								P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked seeking bufferend"));
								this.wrapper_.onbufferend();
							}
							this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked;
						}

						return;

					} else if (this.firstSeekStatus_ == this.kFirstSeekDownLoadSegmentOk) {
						this.firstSeekStatus_ = this.kFirstSeekStatusDone;
						this.video_.play();
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked firstSeek Done"));
					} else {
						P2P_ULOG_INFO(P2P_ULOG_FMT(
								"core::player::VodPlayer::onVideoSeeked autoBackSeek return vtime({0}) seekTo({1}) innerSeek({2}) videoStatus({3})", time,
								this.preSeekTime_, this.jump2SeekPostion_, this.playerContext_.videoStatus_));
					}
				} else {
					if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked vtime({0}) status({1})", time, this.playerContext_.videoStatus_));
						this.video_.play();
						if (this.wrapper_.onbufferend) {
							P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked end seeking bufferend"));
							this.wrapper_.onbufferend();
						}
						this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS.seeked;
					} else if (this.firstSeekStatus_ == this.kFirstSeekDownLoadSegmentOk) {
						this.firstSeekStatus_ = this.kFirstSeekStatusDone;
						this.video_.play();
						P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::onVideoSeeked firstSeek Done"));
					}

					return;
				}
			},

			onVideoCanPlay_ : function() {
				// onprepared onbufferend
				if (!this.macSafariPattern_) {
					this.onBufferEndAndOnPrepared_();
				}
			},
			onVideoProgress_ : function() {
				if (this.macSafariPattern_ && !this.firstProgress_) {
					this.firstProgress_ = true;
					this.onBufferEndAndOnPrepared_();
				}
			},
			onCanPlayThrough_ : function() {
				if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kNoFirstSeek) {
					if (this.macSafariPattern_) {
						this.onBufferEndAndOnPrepared_();
					}
				}
			},

			onVideoPlaying_ : function() {
				if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ != this.kNoFirstSeek) {
					if (this.macSafariPattern_) {
						this.onBufferEndAndOnPrepared_();
					}
				}
			},
			findMaxBuffered_ : function(time) {
				var buffered = -1;
				var segment = null;
				if (!this.metaData_) {
					return;
				}
				for ( var n = 0; n < this.metaData_.segments_.length; n++) {
					segment = this.metaData_.segments_[n];
					if (segment.startTime_ + segment.duration_ <= time * 1000) {
						continue;
					}
					if (segment.completedTime_ > 0) {
						buffered = (segment.startTime_ + segment.duration_ - 0) / 1000;
					} else {
						break;
					}
				}
				return buffered;
			},
			getCurrentBuffered : function() {
				var buffer = -1;
				if (this.video_) {
					buffer = this.findMaxBuffered_(this.getCurrentPosition());
				}
				return buffer;
			},
			onError_ : function() {
				this._super();
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::Player error {0} times... init a new one", this.errorTimes_));
				this.clearMediaSource_();
				this.isFirstSegment_ = true;
				this.onErrorReplay_ = true;
				this.playerContext_.bufferd_ = null;
				this.playerContext_.avccName_ = null;
				this.playerContext_.aacName_ = null;
				this.playerContext_.bufferLength_ = 0;
				this.firstProgress_ = null;
				this.blockList_ = [];
				this.actived_ = true;
				this.video_.pause();
				this.errorReplayTime_ = this.playerContext_.currentPlayTime_;
				var seek2Segment = this.findSegment_(this.errorReplayTime_);
				if (seek2Segment) {
					this.nextSegmentId_ = seek2Segment.id_ + 1;
				} else {
					this.nextSegmentId_ = this.addedSegment_ ? this.addedSegment_.id_ : 0;
				}

				this.addedSegment_ = null;
				this.playerContext_.currentPlayTime_ = 0;
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::VodPlayer::replay segment({0}),nextSegmentId2({1}),errorReplayTime({2})", (seek2Segment != null),
						this.nextSegmentId_, this.errorReplayTime_));
			}
		});p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.LivePlayer = p2p$.com.webp2p.core.player.BasePlayer.extend_({
	isFirstSegment_ : false,
	firstIndexUsed_ : false,
	playNextDelayTime_ : 0,
	suspendTimes_ : 0,

	init : function(wrapper) {
		this._super(wrapper);
		this.isFirstSegment_ = false;
		this.playNextDelayTime_ = 0;
		this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive;
		this.lastDiscontinuitySegment_ = 0;
		this.lastHandleSuspendTime_ = 0;
	},
	play : function() {
		if (!this.video_) {
			return;
		}
		if (this.video_.paused) {
			this.video_.play();
		}
		if (!this.safariFirstSeek_) {
			return;
		}
		this.video_.currentTime = this.safariFirstSeekPostion_;
		this.safariFirstSeek_ = false;
		this.canHandleSuspend_ = true;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::play first segment seek to({0})", this.video_.currentTime.toFixed(1)));
		return;
	},
	getBlock_ : function(nextSegment) {
		if (!this.metaData_) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::LivePlayer::Meta data is null"));
			return null;
		}

		for ( var n = 0; n < this.metaData_.segments_.length - 1; n++) {
			var segment = this.metaData_.segments_[n];
			var segment2 = this.metaData_.segments_[n + 1];
			segment.nextId_ = segment2.id_;
			if (n == this.metaData_.segments_.length - 2) {
				segment2.nextId_ = segment2.id_;
			}
		}

		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (nextSegment == segment.id_) {
				return segment;
			}
			if (n == this.metaData_.segments_.length - 1) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::LivePlayer::segment ({0}) not found,return default segment({1})", nextSegment,
						this.metaData_.segments_[0].id_));
			}
		}
		return this.metaData_.segments_[0];
	},

	refreshUrgentSegment_ : function(segmentId) {
		if (!this.playerContext_.bufferd_) {
			return;
		}
		var vtime = this.video_.currentTime;
		if (vtime > 1) {
			var segment = this.getSegmentByVideoTime_(vtime);
			if (segment) {
				this.urgentSegment_ = segment.id_;
				P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::refreshUrgentSegment1 requestSegment({0}),urgentSegment({1})", segmentId,
						this.urgentSegment_));
				return;
			}
		}
		this.urgentSegment_ = segmentId - 1;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::BasePlayer::refreshUrgentSegment2 requestSegment({0}),urgentSegment({1})", segmentId, this.urgentSegment_));
	},

	getSegmentByVideoTime_ : function(time) {
		time = time * 1000;
		var temp = null;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			// the current urgentSegment should be the latest urgentSegment_
			if (segment.timestamp_ <= time && time <= segment.timestamp_ + segment.duration_ && segment.id_ > this.lastDiscontinuitySegment_) {
				temp = segment;
			}
		}
		return temp;
	},

	playSegment_ : function() {
		if (!this.playerContext_.avccName_) {
			return;
		}
		if (!this.mediaSource_) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::LivePlayer::Create media source ..."));
			this.sourceBuffer_ = null;
			this.mediaSource_ = this.createMediaSource_();
			this.video_.src = window.URL.createObjectURL(this.mediaSource_);
		}
		// if (this.sourceBufferRemoved_ && !this.sourceBuffer_) {
		// this.sourceBufferRemoved_ = false;
		// P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::play next video , start add media source header..."));
		// this.actived_ = true;
		// this.addMediaSourceHeader_();
		// }
		if (!this.sourceBuffer_) {
			if (!this.mediaOpened_) {
				this.delayTime_++;
				if (this.delayTime_ > 500) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::LivePlayer::Play segment with delay count({0})", this.delayTime_));
				}
				return;
			}
			this.addMediaSourceHeader_();
			if (!this.sourceBuffer_) {
				this.delayTime_++;
				if (this.delayTime_ > 500) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::LivePlayer::Play segment with delay2 count({0})", this.delayTime_));
				}
				return;
			}
		}
		if (this.sourceBuffer_.updating) {
			return;
		}

		this.calculateBufferLength_();

		this.handleSuspend_();

		if (this.blockList_.length <= 0 || this.playerContext_.bufferLength_ >= 20) {
			return;
		}

		// add source
		var streamInfo = this.blockList_[0];
		// this.blockList_.shift();
		if (streamInfo.block.index_ == 0 && !this.firstIndexUsed_) {
			this.isFirstSegment_ = true;
			this.firstIndexUsed_ = true;
		}

		if (this.addedSegment_ && streamInfo.block.timestamp_ < this.addedSegment_.timestamp_) {
			if (!this.showDiscontinuity_) {
				if (streamInfo.block.discontinuity_) {
					this.showDiscontinuity_ = true;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::discontinuity true, segment({0})", streamInfo.block.id_));
				} else {
					streamInfo.block.discontinuity_ = true;
					this.showDiscontinuity_ = true;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::discontinuity false, segment({0})", streamInfo.block.id_));
				}
			}
		}

		if (streamInfo.block.discontinuity_ && !this.playNextVideo_ && this.lastDiscontinuitySegment_ != streamInfo.block.id_) {
			if (this.playerContext_.bufferLength_ < 0.2 || this.playNextDelayTime_ > 5) {

				var offsetTime = ((streamInfo.block.timestamp_ || 0)) / 1000;

				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::Start to play next video, buffer({0}), delay({1}), offset({2}), mime({3}, {4} => {5})",
						this.playerContext_.bufferLength_.toFixed(3), this.playNextDelayTime_, offsetTime, streamInfo.mime == this.sourceMime_ ? "same"
								: "diff", this.sourceMime_, streamInfo.mime));

				// this.video_.pause();
				this.video_.currentTime = offsetTime;

				if (streamInfo.mime != this.sourceMime_) {
					// play next video
					this.clearMediaSource_();
					// this.removeSourceBuffer_();
					this.playNextVideo_ = true;
					this.isFirstSegment_ = true;
					this.playerContext_.bufferd_ = null;
					this.playerContext_.avccName_ = null;
					this.playerContext_.aacName_ = null;
					this.blockList_ = [];
				} else if (this.sourceBuffer_.buffered.length > 0) {
					this.sourceBuffer_.remove(0, this.sourceBuffer_.buffered.end(this.sourceBuffer_.buffered.length - 1));
				}

				// this.removeVideoEvent_(this.video_);
				// this.video_ = null;

				this.preTime_ = 0;
				this.playNextDelayTime_ = 0;
				this.showDiscontinuity_ = false;
				this.addedSegment_ = null;
				this.playerContext_.bufferLength_ = 0;
				this.lastDiscontinuitySegment_ = streamInfo.block.id_;
			} else {
				if (this.playerContext_.bufferLength_ < 3) {
					this.playNextDelayTime_++;
				}
			}

			this.nextSegmentId_ = streamInfo.block.id_;
			return null;
		}

		this.blockList_.shift();

		// this.sourceBuffer_.timestampOffset = streamInfo.offsetTime / 1000;
		this.sourceBuffer_.appendBuffer(streamInfo.data);
		this.addedSegment_ = streamInfo.block;

		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::Add data success ,buffer length({0}),"
				+ "blockLength ({1}s), segmentId({2}), startTime({3}), timestamp({4}), discontinuity({5}), segment length ({6}), "
				+ "prev segment({7}), next segment({8})", this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000,
				streamInfo.block.id_, p2p$.com.webp2p.core.common.Global.getCurentTime_(streamInfo.block.startTime_ / 1000), streamInfo.block.timestamp_,
				streamInfo.block.discontinuity_, streamInfo.data.length, this.preSegmentId_, this.nextSegmentId_));
	},

	handleSuspend_ : function() {
		if (!this.playerContext_.bufferd_ || !this.canHandleSuspend_) {
			return;
		}
		var nowTime = new Date().getTime();
		if (this.lastHandleSuspendTime_ + 500 > nowTime) {
			return;
		}
		this.lastHandleSuspendTime_ = nowTime;
		var temp = this.playerContext_.currentPlayTime_;
		var bufferIndex = -1;
		if (Math.abs(this.video_.currentTime - temp) < 0.1) {
			// break
			for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
				var start = this.playerContext_.bufferd_.start(i);
				if (start > temp) {
					bufferIndex = i;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer start ({0}),length ({1}),i ({2}),bufferIndex ({3})", start,
							this.playerContext_.bufferd_.length, i, bufferIndex));
					break;
				}
			}
			if (bufferIndex != -1) {
				var seekto = this.playerContext_.bufferd_.start(bufferIndex);
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer replay suspend seekto ({0}) ...", seekto));
				try {
					this.video_.pause();
					this.video_.currentTime = seekto;
					this.video_.play();
					if (bufferIndex >= 2) {
						if (!this.macSafariPattern_) {
							this.sourceBuffer_.remove(0, this.playerContext_.bufferd_.end(bufferIndex - 2));
						}
						this.playerContext_.bufferd_ = this.sourceBuffer_.buffered;
					}
				} catch (e) {
					P2P_ULOG_ERROR(P2P_ULOG_FMT("core::player::LivePlayer replay seek or remove error({0})", e));
				}
				this.suspendTimes_ = 0;
			} else {
				if (!this.suspendTimes_) {
					this.suspendTimes_ = 0;
				}
				this.suspendTimes_++;
				if (this.suspendTimes_ > 5) {
					var seekto = temp + 0.2;
					this.video_.currentTime = seekto;
					this.suspendTimes_ = 0;
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer replay2 suspend seekto ({0}) ...", seekto));
				}
			}
		} else {
			this.suspendTimes_ = 0;
		}
		this.playerContext_.currentPlayTime_ = this.video_.currentTime;
	},

	calculateBufferLength_ : function() {
		if (!this.video_) {
			return;
		}

		var _st = 0;
		var _ed = 0;
		if (this.video_) {
			this.preTime_ = this.video_.currentTime;
		}

		this.playerContext_.bufferLength_ = 0;
		if (!this.playerContext_.bufferd_) {
			return;
		}

		for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
			_st = this.playerContext_.bufferd_.start(i);
			_ed = this.playerContext_.bufferd_.end(i);

			if (this.isFirstSegment_) {
				this.playerContext_.bufferLength_ = _ed - _st;
				this.isFirstSegment_ = false;
				if (this.onErrorReplay_) {
					this.onErrorReplay_ = false;
					if (_st <= this.errorReplayTime_ && this.errorReplayTime_ <= _ed) {
						this.video_.currentTime = this.errorReplayTime_;
					} else {
						this.video_.currentTime = this.macSafariPattern_ ? Math.max(_st, 0.1) : _st;
					}
					this.onBufferEndAndOnPrepared_();
					this.video_.play();
					P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::error play first segment seek to({0})", this.video_.currentTime.toFixed(1)));
				} else {
					this.safariFirstSeek_ = true;
					this.safariFirstSeekPostion_ = _st;
					if (!this.macSafariPattern_) {
						this.video_.currentTime = this.safariFirstSeekPostion_;
						this.video_.pause();
					}
					this.onBufferEndAndOnPrepared_();
					// wating for playing by external call 'play' method
				}
				this.playNextVideo_ = null;
			} else {
				if (_st > this.preTime_) {
					this.playerContext_.bufferLength_ += (_ed - _st);
				} else if (_st <= this.preTime_ && _ed >= this.preTime_) {
					this.playerContext_.bufferLength_ = (_ed - this.preTime_);
				}
			}
		}
		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::player::LivePlayer::Calculate buffer, current({0}), pre({1}), buffer({2}), pre segment({3}), next segment({4})",
				this.video_.currentTime, this.preTime_, this.playerContext_.bufferLength_, this.preSegmentId_, this.nextSegmentId_));
	},

	onVideoSeeking_ : function() {
	},

	onVideoSeeked_ : function() {
		// this.video_.play();
	},

	onError_ : function() {
		this.errorTimes_++;
		this._super();
		if (this.errorTimes_ > this.maxErrorTimes_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::Player error {0} times...,return error", this.errorTimes_));
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::Player error {0} times... init a new one", this.errorTimes_));

		this.clearMediaSource_();
		// this.removeSourceBuffer_();
		this.playNextVideo_ = true;
		this.isFirstSegment_ = true;
		this.playerContext_.bufferd_ = null;
		this.playerContext_.avccName_ = null;
		this.playerContext_.aacName_ = null;
		this.blockList_ = [];
		this.video_.pause();
		this.onErrorReplay_ = true;
		var findFlag = 0;
		var segment = this.getSegmentByVideoTime_(this.playerContext_.currentPlayTime_);
		if (segment) {
			this.nextSegmentId_ = segment.id_;
			findFlag = 1;
		} else {
			var timestamp = Date.parse(new Date());
			var seek2Segment = this.findSegment_(timestamp / 1000);
			if (seek2Segment) {
				this.nextSegmentId_ = seek2Segment.id_;
				findFlag = 2;
			} else {
				this.nextSegmentId_ = this.addedSegment_ ? this.addedSegment_.id_ : 0;
				findFlag = 3;
			}
		}
		this.lastDiscontinuitySegment_ = 0;
		this.playerContext_.bufferLength_ = 0;
		this.actived_ = true;
		this.playNextDelayTime_ = 0;
		this.showDiscontinuity_ = false;
		this.addedSegment_ = null;
		this.playerContext_.bufferLength_ = 0;
		this.errorReplayTime_ = this.playerContext_.currentPlayTime_;
		this.playerContext_.currentPlayTime_ = 0;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::player::LivePlayer::replay find segment by ({0}),nextSegmentId({1}),errorReplayTime({2})", findFlag,
				this.nextSegmentId_, this.errorReplayTime_));
	},

	onVideoTimeUpdate_ : function() {
		this._super();
		// this.playerContext_.currentPlayTime_ = this.video_.currentTime;
	},
	// onVideoProgress_ : function() {
	// if (!this.firstProgress_) {
	// this.firstProgress_ = true;
	// this.onBufferEndAndOnPrepared_();
	// }
	// },
	onVideoCanPlay_ : function() {
		// onprepared onbufferend
		// this.onBufferEndAndOnPrepared_();
	},

	onCanPlayThrough_ : function() {
	},

	onVideoPlaying_ : function() {
	},

	seek : function(postion) {
		return;
	},

	getCurrentPosition : function() {
		return 0;
	},

	getDuration : function() {
		return Infinity;
	},
	getCurrentBuffered : function() {
		var buffer = -1;
		return buffer;
	},
});p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.Audio = CdeBaseClass.extend_({
	state_ : 0,
	haveNewTimestamp_ : false,
	audioTime_ : 0,
	audioTimeIncr_ : 0,
	profile_ : 0,
	sampleRateIndex_ : 0,
	channelConfig_ : 0,
	frameLength_ : 0,
	remaining_ : 0,
	adtsHeader_ : null,
	needACHeader_ : false,
	audioData_ : null,
	aacData_ : null,
	tags_ : null,
	audioInfo_ : null,
	srMap_ : [ 96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350 ],

	init : function() {
		this.reset();
	},

	reset : function() {
		this.state_ = 0;
		this.adtsHeader_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(100);
		this.needACHeader_ = true; // need more than this, actually...
		this.sampleRateIndex_ = 0;
		this.channelConfig_ = 0;
		this.tags_ = [];
		this.audioInfo_ = {
			index : 0,
			timeScale : 44100,
			duration : 0
		};
	},

	getPTS_ : function(p1, p2, p3) {
		return ((p1 & 0x0e) * Math.pow(2, 29)) + ((p2 & 0xfffe) << 14) + ((p3 & 0xfffe) >> 1);
	},

	getIncrForSRI_ : function(srIndex) {
		var rate = this.srMap_[srIndex];
		return 1024000.0 / rate; // t = 1/rate... 1024 samples/frame and srMap is in kHz
	},

	processES_ : function(pusi, packet, flush) {
		var value;
		if (pusi) {
			// start of a new PES packet
			// Start code prefix and packet ID.
			value = packet.readUnsignedInt_();
			packet.position -= 4;
			if (packet.readUnsignedInt_() != 0x1c0) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Audio::PES start code not found or not AAC/AVC"));
				return;
			}
			// Ignore packet length and marker bits.
			packet.position += 3;
			// need PTS only
			var flags = (packet.readUnsignedByte_() & 0xc0) >> 6;
			// console.log("-->flags:",flags);
			if (flags != 0x02) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Audio::No PTS in this audio PES packet, flags({0})", flags));
				return;
			}

			var length = packet.readUnsignedByte_();
			var p1 = packet.readUnsignedByte_();
			var p2 = packet.readUnsignedShort_();
			var p3 = packet.readUnsignedShort_();
			var pts = this.getPTS_(p1, p2, p3);

			this._timestamp = Math.round(pts / 90);
			this.haveNewTimestamp_ = true;
			// console.log("audio:",pts);
			length -= 5;
			// no comp time for audio
			// Skip other header data.
			packet.position += length;
		}

		value = 0;
		var tag = null;

		var dStart = 0;
		if (!flush) {
			dStart = packet.position;
		}

		if (flush) {
			// console.log("-->audio flush at state " + this.state_.toString());
		} else {
			while (packet.bytesAvailable_() > 0) {
				if (this.state_ < 7) {
					value = packet.readUnsignedByte_();
					this.adtsHeader_.setByte_(this.state_, value);
				}

				switch (this.state_) {
				case 0: // first 0xff of flags
					if (this.haveNewTimestamp_) {
						this.audioTime_ = this._timestamp;
						this.haveNewTimestamp_ = false;
					}

					if (value == 0xff) {
						this.state_ = 1;
					} else {
						// console.log("adts seek 0");
					}
					break;

				case 1: // final 0xf of flags, first nibble of flags
					if ((value & 0xf0) != 0xf0) {
						// console.log("adts seek 1");
						this.state_ = 0;
					} else {
						this.state_ = 2;
						// 1 bit always 1
						// 2 bits of layer, always 00
						// 1 bit of protection present
					}
					break;

				case 2:
					this.state_ = 3;
					this.profile_ = (value >> 6) & 0x03;
					// console.log("AUDIO: raw " + value.toString(2));
					// console.log("AUDIO: profile " + this.profile_.toString(2));
					this.sampleRateIndex_ = (value >> 2) & 0x0f;
					this.audioTimeIncr_ = this.getIncrForSRI_(this.sampleRateIndex_);
					// console.log("AUDIO: sample rate index " + this.sampleRateIndex_ + ", time incr " + this.audioTimeIncr_);
					// if( this.audioTimeIncr_ > 0 ) this.audioInfo_.timeScale = this.audioTimeIncr_;
					// one private bit
					this.channelConfig_ = (value & 0x01) << 2; // first bit thereof
					break;

				case 3:
					this.state_ = 4;
					// console.log("raw "+value.toString(2));
					this.channelConfig_ += (value >> 6) & 0x03; // rest of channel config
					// orig/copy bit
					// home bit
					// copyright id bit
					// copyright id start
					this.frameLength_ = (value & 0x03) << 11; // bits 12 and 11 of the length
					break;

				case 4:
					this.state_ = 5;
					// console.log("raw "+value.toString(2));
					this.frameLength_ += (value) << 3; // bits 10, 9, 8, 7, 6, 5, 4, 3
					break;

				case 5:
					this.state_ = 6;
					// console.log("raw "+value.toString(2));
					this.frameLength_ += (value & 0xe0) >> 5;
					// console.log("framelen "+this.frameLength_.toString(2));
					this.remaining_ = this.frameLength_ - 7; // XXX crc issue?
					// console.log("remaining: "+this.remaining_.toString());
					// buffer fullness
					break;

				case 6:
					this.state_ = 7;
					dStart = packet.position;
					this.audioData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(2048);
					// 6 more bits of buffer fullness
					// 2 bits number of raw data blocks in frame (add one to get count)
					if (this.needACHeader_) {
						tag = {};
						tag.timestamp = this.audioTime_;
						// tag.soundFormat = 'SOUND_FORMAT_AAC';
						// tag.soundChannels = 'SOUND_CHANNELS_STEREO';
						// tag.soundRate = 'SOUND_RATE_44K'; // rather than what is reported
						// tag.soundSize = 'SOUND_SIZE_16BITS';
						// tag.isAACSequenceHeader = true;

						this.aacData_ = new Uint8Array((this.sampleRateIndex_ == 7) ? 7 : 2);
						this.aacData_[0] = (this.profile_ + 1) << 3;
						this.aacData_[0] |= this.sampleRateIndex_ >> 1;
						this.aacData_[1] = (this.sampleRateIndex_ & 0x01) << 7;
						this.aacData_[1] |= this.channelConfig_ << 3;
						if (this.sampleRateIndex_ == 7) {
							var privateBytes = [ 0x56, 0xE5, 0xA5, 0x48, 0x80 ];
							for ( var i = 0; i < privateBytes.length; i++) {
								this.aacData_[i + 2] = privateBytes[i];
							}
						}
						this.audioInfo_.index = this.sampleRateIndex_;
						this.audioInfo_.channelCount = 2; // this.channelConfig_;
						this.audioInfo_.timeScale = this.srMap_[this.sampleRateIndex_] || 44100;
						this.audioInfo_.sampleSize = 16; // * this.audioInfo_.timeScale / 44100;

						// console.log('profile_ is : ' + this.profile_);
						// console.log('sampleRateIndex_ is : ' + this.sampleRateIndex_);
						// console.log('channelConfig_ is : ' + this.channelConfig_);

						/*
						 * acHeader[0] = (this.profile_ + 1)<<3; acHeader[0] |= this.sampleRateIndex_ >> 1; acHeader[1] = (this.sampleRateIndex_ & 0x01) <<
						 * 7; acHeader[1] |= this.channelConfig_ << 3; acHeader.length = 2;
						 */
						this.adtsHeader_.length = 4;
						tag.data = this.adtsHeader_;
						this.needACHeader_ = false;

						// console.log("adding AC header of "+uint(this.adtsHeader_[0]).toString(16)+" "+uint(this.adtsHeader_[1]).toString(16)+"
						// "+uint(this.adtsHeader_[2]).toString(16)+" "+uint(this.adtsHeader_[3]).toString(16));
						// tag.write(tagData); // unroll out vector
						// this.tags_.push(tag);
					}
					break;

				case 7:
					if ((packet.length - dStart) >= this.remaining_) {
						packet.position += this.remaining_;
						this.remaining_ = 0;
					} else {
						var avail = packet.length - dStart;
						packet.position += avail;
						this.remaining_ -= avail;
						this.audioData_.writeBytes_(packet, dStart, packet.position - dStart);
					}

					if (this.remaining_ > 0) {
						//
					} else {
						this.audioData_.writeBytes_(packet, dStart, packet.position - dStart);
						this.state_ = 0;

						tag = {};
						tag.timestamp = this.audioTime_;
						// console.log("audio timestamp " + this.audioTime_.toString());
						this.audioTime_ += this.audioTimeIncr_;
						// tag.soundChannels = 'SOUND_CHANNELS_STEREO';
						// tag.soundFormat = 'SOUND_FORMAT_AAC';
						// tag.isAACSequenceHeader = false;
						// tag.soundRate = 'SOUND_RATE_44K'; // rather than what is reported
						// tag.soundSize = 'SOUND_SIZE_16BITS';
						tag.data = this.audioData_;
						// tag.write(tagData); // unrolled out the vector for audio tags
						// console.log("done");
						this.tags_.push(tag);
					}
					break;
				} // switch
			} // while
		}
	}
});p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.ByteArray = CdeBaseClass.extend_({
	position : 0,
	length : 0,
	data : null,
	autoIncrementSize_ : 1024,
	className : 'WebP2P.ts2mp4.ByteArray',

	init : function(size, writeable) {
		this.position = 0;
		this.data = new Uint8Array(size);
		this.length = writeable ? 0 : this.data.length;
	},

	bytesAvailable_ : function() {
		return this.data.length - this.position;
	},

	resize : function(size) {
		var newData = new Uint8Array(size);
		for (var i = 0; i < size && i < this.length; i++) {
			newData[i] = this.data[i];
		}
		this.data = newData;
		if (this.length > size) {
			this.length = size;
		}
	},

	getByte_ : function(index) {
		return this.data[index];
	},

	readUnsignedByte_ : function() {
		if (this.position >= this.data.length) {
			return 0;
		}
		return this.data[this.position++];
	},

	readUnsignedShort_ : function() {
		if ((this.position + 1) >= this.data.length) {
			return 0;
		}
		var value1 = this.data[this.position++];
		var value2 = this.data[this.position++];
		return (value1 << 8) + value2;
	},

	readUnsignedInt_ : function() {
		if ((this.position + 3) >= this.data.length) {
			return 0;
		}
		var value1 = this.data[this.position++];
		var value2 = this.data[this.position++];
		var value3 = this.data[this.position++];
		var value4 = this.data[this.position++];
		return (value1 << 24) + (value2 << 16) + (value3 << 8) + value4;
	},

	setByte_ : function(index, value) {
		this.data[index] = value;
	},

	writeByte_ : function(value) {
		this.writeUnsignedByte_(value);
	},

	writeUnsignedByte_ : function(value) {
		this.position = Math.min(this.position, this.length);
		if (this.data.length < this.position + 1) {
			this.resize(this.data.length + Math.max(1, this.autoIncrementSize_));
		}
		this.data[this.position++] = value;
		this.length = this.position;
	},

	writeUnsignedShort_ : function(value) {
		this.position = Math.min(this.position, this.length);
		if (this.data.length < this.position + 2) {
			this.resize(this.data.length + Math.max(2, this.autoIncrementSize_));
		}
		this.data[this.position++] = (value >> 8) & 0xff;
		this.data[this.position++] = value & 0xff;
		this.length = this.position;
	},

	writeUnsignedInt_ : function(value) {
		this.position = Math.min(this.position, this.length);
		if (this.data.length < this.position + 2) {
			this.resize(this.data.length + Math.max(4, this.autoIncrementSize_));
		}
		this.data[this.position++] = (value >> 24) & 0xff;
		this.data[this.position++] = (value >> 16) & 0xff;
		this.data[this.position++] = (value >> 8) & 0xff;
		this.data[this.position++] = value & 0xff;
		this.length = this.position;
	},

	writeBytes_ : function(bytes, start, size) {
		var byteSize = bytes.length || 0;
		start = start || 0;
		size = size || byteSize;

		if (bytes.className == 'WebP2P.ts2mp4.ByteArray') {
			bytes = bytes.data;
		}

		size = Math.min(size, byteSize - start);
		if (start < 0 || size <= 0) {
			return;
		}

		this.position = Math.min(this.position, this.length);
		if (this.data.length < this.position + size) {
			this.resize(this.data.length + Math.max(size, this.autoIncrementSize_));
		}

		var maxIndex = start + size;
		this.data[this.position + size - 1] = 0;
		for (var i = start; i < maxIndex && i < byteSize; i++) {
			this.data[this.position++] = bytes[i];
		}
		this.length = this.position;
	}
});p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.FileHandler = CdeBaseClass.extend_({
	syncFound_ : false,
	pmtPid_ : 0,
	audioPid_ : 0,
	videoPid_ : 0,
	audioPes_ : null,
	videoPes_ : null,
	startTime_ : null,

	init : function() {
		this.audioPes_ = new p2p$.com.webp2p.tools.ts2mp4.Audio();
		this.videoPes_ = new p2p$.com.webp2p.tools.ts2mp4.Video();
	},

	beginProcessFile_ : function(seek, seekTime) {
		this.syncFound_ = false;
	},

	inputBytesNeeded_ : function() {
		if (this.syncFound_) {
			return 187;
		} else {
			return 1;
		}
	},

	// 分析188字节第一个为0x47
	/**
	 * @params
	 * @input 解码数据
	 * @params 参数
	 * @fragmentSquenceNumber ts编号
	 * @encode 是否需要解码
	 */
	processFileSegment_ : function(input, params, fragmentSequenceNumber, encode) {
		var _usedBytes = 0;
		var _startTime;
		this.startTime_ = null;
		this.audioPes_.reset();
		this.videoPes_.reset();
		while (_usedBytes < input.length) {
			if (!this.syncFound_) {
				if (_usedBytes + 1 > input.length) {
					return null;
				}
				if (input[_usedBytes++] == 0x47) {
					this.syncFound_ = true;
				}
			} else {
				if (_usedBytes + 187 > input.length) {
					return null;
				}
				this.syncFound_ = false;
				var packet = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(input.subarray(_usedBytes, _usedBytes + 187));
				_startTime = this.processPacket_(packet, encode);
				if (_startTime !== null && this.startTime_ === null) {
					this.startTime_ = _startTime;
				}
				if (!encode && this.startTime_ !== null)// 如果不需要解码，只需计算出ts的开始时间即可
				{
					break;
				}
				_usedBytes += 187;
			}
		}
		if (!encode) {
			return input;// 无需解码
		}

		this.flushFileSegment_(input);

		/**
		 * var base64String = this.base64Uint8Array_(this.videoPes_.h264Data_.data); var xhr = new XMLHttpRequest(); xhr.open('POST', '/saveBase64AsH264'); var
		 * params = "data=" + encodeURIComponent(base64String); xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); xhr.send(params);
		 * return;
		 */

		var handlerOptions = {
			video : {
				info : this.videoPes_.videoInfo_,
				avcc : this.videoPes_.avccData_,
				items : this.videoPes_.tags_,
			},
			audio : {
				info : this.audioPes_.audioInfo_,
				aac : this.audioPes_.aacData_,
				items : this.audioPes_.tags_
			},
			fragmentSequenceNumber_ : fragmentSequenceNumber || 0,
			start : 0,
		};

		p2p$.com.webp2p.core.utils.Utils.apply(handlerOptions.video.info, params || {});
		if (params) {
			if (params.duration) {
				handlerOptions.audio.info.duration = Math.floor(params.duration * handlerOptions.audio.info.timeScale / 1000);
				var frameRate = Math.ceil(handlerOptions.audio.info.duration / handlerOptions.audio.items.length);
				handlerOptions.audio.info.duration = frameRate * handlerOptions.audio.items.length;
			}
			if (params.start) {
				handlerOptions.start = params.start;
			}
		}

		var mp4Handler = new p2p$.com.webp2p.tools.ts2mp4.ToMP4(handlerOptions);// Mp4Handler(handlerOptions);
		var data = mp4Handler.toBuffer();
		return data;
	},

	getMediaStreamAvccName_ : function() {
		var avcc = this.videoPes_.avccData_;
		if (!avcc) {
			return "avc1.64001f";
		}
		var name = 'avc1.';
		for ( var i = 0; i < 3; i++) {
			var byteValue = avcc.getByte_(i + 1).toString(16);
			if (byteValue.length < 2) {
				byteValue = ('0' + byteValue);
			}
			name += byteValue;
		}
		return name;
	},

	getMediaStreamAacName_ : function() {
		var index = this.audioPes_.sampleRateIndex_;
		var profile = 5;
		switch (index) {
		case 4:
			profile = 2;
			break;
		case 7:
			profile = 2;
			break;
		default:
			profile = 5;
			break;
		}
		return 'mp4a.40.' + profile;
	},

	getMediaStreamAacName2_ : function() {
		var aac = this.audioPes_.aacData_;
		var name = 'mp4a.40.2';
		if (!aac) {
			return name;
		}
		// name = 'mp4a.40.' + ((aac[0] >> 3) & 0x1f).toString(16);
		return name;
	},

	getMediaInfoDescriptions_ : function() {
		return 'audio<sri:' + this.audioPes_.sampleRateIndex_ + ', profile:' + this.audioPes_.profile_ + ', channel:' + this.audioPes_.channelConfig_ + '>';
	},

	base64Uint8Array_ : function(bytes) {
		var base64 = '';
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		var byteLength = bytes.byteLength;
		var byteRemainder = byteLength % 3;
		var mainLength = byteLength - byteRemainder;
		var a, b, c, d;
		var chunk;

		// Main loop deals with bytes in chunks of 3
		for ( var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

			// Use bit masks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
			c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
			d = chunk & 63; // 63 = 2^6 - 1

			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
		}

		// Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength];
			a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
			// Set the 4 least significant bits to zero
			b = (chunk & 3) << 4; // 3 = 2^2 - 1
			base64 += encodings[a] + encodings[b] + '==';
		} else if (byteRemainder == 2) {
			chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
			a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
			b = (chunk & 1008) >> 4; // 1008 = (2^6 - 1) << 4
			// Set the 2 least significant bits to zero
			c = (chunk & 15) << 2; // 15 = 2^4 - 1
			base64 += encodings[a] + encodings[b] + encodings[c] + '=';
		}

		return base64;
	},

	endProcessFile_ : function(input) {
		return null;
	},

	// 分析187字节
	processPacket_ : function(packet) {
		// decode rest of transport stream prefix (after the 0x47 flag byte)

		// top of second byte
		var value = packet.readUnsignedByte_();
		// var tei = Boolean(value & 0x80); // error indicator
		var pusi = Boolean(value & 0x40); // payload unit start indication
		// var tpri = Boolean(value & 0x20); // transport priority indication

		// bottom of second byte and all of third
		value <<= 8;
		value += packet.readUnsignedByte_();

		var pid = value & 0x1fff; // packet ID

		// fourth byte
		value = packet.readUnsignedByte_();
		// var scramblingControl = (value >> 6) & 0x03; // scrambling control bits
		var hasAF = Boolean(value & 0x20); // has adaptation field
		var hasPD = Boolean(value & 0x10); // has payload data
		// var ccount = value & 0x0f; // continuty count

		// technically hasPD without hasAF is an error, see spec

		if (hasAF) {
			// process adaptation field
			var afLen = packet.readUnsignedByte_();

			// don't care about flags
			// don't care about clocks here
			packet.position += afLen; // skip to end
		}

		if (hasPD) {
			return this.processES_(pid, pusi, packet);
		}
		return null;
	},

	processES_ : function(pid, pusi, packet) {
		if (pid === 0) // PAT
		{
			if (pusi) {
				this.processPAT_(packet);
			}
		} else if (pid == this.pmtPid_) {
			if (pusi) {
				this.processPMT_(packet);
			}
		} else if (pid == this.audioPid_) {
			this.audioPes_.processES_(pusi, packet);
		} else if (pid == this.videoPid_) {
			return this.videoPes_.processES_(pusi, packet);
		}
		return null; // ignore all other pids
	},

	processPAT_ : function(packet) {
		var pointer = packet.readUnsignedByte_();
		var tableID = packet.readUnsignedByte_();

		var sectionLen = packet.readUnsignedShort_() & 0x03ff; // ignoring misc and reserved bits
		var remaining = sectionLen;

		packet.position += 5; // skip tsid + version/cni + sec# + last sec#
		remaining -= 5;

		while (remaining > 4) {
			packet.readUnsignedShort_(); // program number
			this.pmtPid_ = packet.readUnsignedShort_() & 0x1fff; // 13 bits
			remaining -= 4;
			// return; // immediately after reading the first pmt ID, if we don't we get the LAST one
		}

		// and ignore the CRC (4 bytes)
	},

	processPMT_ : function(packet) {
		var pointer = packet.readUnsignedByte_();
		var tableID = packet.readUnsignedByte_();

		if (tableID != 0x02) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::FileHandler::PAT pointed to PMT that isn't PMT"));
			return; // don't try to parse it
		}
		var sectionLen = packet.readUnsignedShort_() & 0x03ff; // ignoring section syntax and reserved
		var remaining = sectionLen;

		packet.position += 7; // skip program num, rserved, version, cni, section num, last section num, reserved, PCR PID
		remaining -= 7;

		var piLen = packet.readUnsignedShort_() & 0x0fff;
		remaining -= 2;

		packet.position += piLen; // skip program info
		remaining -= piLen;

		while (remaining > 4) {
			var type = packet.readUnsignedByte_();
			var pid = packet.readUnsignedShort_() & 0x1fff;
			var esiLen = packet.readUnsignedShort_() & 0x0fff;
			remaining -= 5;

			packet.position += esiLen;
			remaining -= esiLen;

			switch (type) {
			case 0x1b: // H.264 video
				this.videoPid_ = pid;
				break;
			case 0x0f: // AAC Audio / ADTS
				this.audioPid_ = pid;
				break;
			// need to add MP3 Audio (3 & 4)
			default:
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::FileHandler::Unsupported typeh {0} in PMT", type.toString(16)));
				break;
			}
		}

		// and ignore CRC
	},

	flushFileSegment_ : function(input) {
		this.videoPes_.processES_(false, null, true);
		this.audioPes_.processES_(false, null, true);
	}
});p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.H264NALU = CdeBaseClass.extend_({
	data : null,

	init : function(source) {
		this.data = source;
	},

	NALtype : function() {
		return this.data.getByte_(0) & 0x1f;
	},

	length : function() {
		return this.data.length;
	},

	NALdata : function() {
		return this.data;
	}
});p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.ToMP4 = CdeBaseClass.extend_({
	type : 0,
	audio : null,
	video : null,
	start : 0,
	dataSize : 0,
	fileData : null,
	fileType : true,
	config : null,

	// private members
	movieBoxSize_ : 0,
	dataOffset : 0,
	videoDataOffset_ : 0,
	videoDataSize_ : 0,
	audioDataOffset_ : 0,
	autioDataSize_ : 0,
	fragmentSequenceNumber_ : 0,
	moofPos_ : 0,
	videoOffsetPos_ : [],
	audioOffsetPos_ : [],
	videoMoofOffset_ : [],
	audioMoofOffset_ : [],

	init : function(configer) {
		if (Object.prototype.toString.call(configer) == '[object Object]') {
			for ( var name in configer) {
				// console.log(name,":",configer[name]);
				this[name] = configer[name];
			}
		}
		// this.config = h5$.com.p2p.vo.Config;
	},

	toBuffer : function() {
		var moofstart = 0;
		this.videoOffsetPos_ = [];
		this.audioOffsetPos_ = [];
		this.videoMoofOffset_ = [];
		this.audioMoofOffset_ = [];
		this.type = 0;
		this.dataSize = 0;
		this.movieBoxSize_ = (this.video.items.length + this.audio.items.length) * 8 + 2000;
		this.dataOffset = this.movieBoxSize_;
		var i;
		var item;
		for ( i = 0; i < this.video.items.length; i++) {
			item = this.video.items[i];
			this.dataSize += item.data.length;
		}
		this.videoDataSize_ = this.dataSize;
		for ( i = 0; i < this.audio.items.length; i++) {
			item = this.audio.items[i];
			this.dataSize += item.data.length;
		}
		this.autioDataSize_ = this.dataSize - this.videoDataSize_;
		this.fileData = new Uint8Array(this.dataOffset + this.dataSize);
		var offset = 0;
		// console.log("-->fragmentNumber=",this.fragmentSequenceNumber_);
		if (this.fragmentSequenceNumber_ === 0) {
			offset += this.writeFileType_(this.fileData, offset);
			offset += this.writeFreeBlock_(this.fileData, offset);
		} else {
			offset += this.writeMediaType_(this.fileData, offset);
		}
		offset += this.writeMovie_(this.fileData, offset);
		moofstart = offset;
		offset += this.writeMoiveFragment_(this.fileData, offset);
		this.videoDataOffset_ = offset + 8;
		this.audioDataOffset_ = this.videoDataOffset_ + this.videoDataSize_;
		for ( i = 0; i < this.videoOffsetPos_.length; i++) {
			this.writeArrayUint32_(this.fileData, this.videoOffsetPos_[i], this.videoDataOffset_);
		}
		for ( i = 0; i < this.audioOffsetPos_.length; i++) {
			this.writeArrayUint32_(this.fileData, this.audioOffsetPos_[i], this.audioDataOffset_);
		}
		for ( i = 0; i < this.videoMoofOffset_.length; i++) {
			this.writeArrayUint32_(this.fileData, this.videoMoofOffset_[i], this.videoDataOffset_ - moofstart);
		}
		for ( i = 0; i < this.audioMoofOffset_.length; i++) {
			this.writeArrayUint32_(this.fileData, this.audioMoofOffset_[i], this.audioDataOffset_ - moofstart);
		}
		var _len = this.writeMediaData_(this.fileData, offset);
		// if(this.lastid)
		// {
		// _len += this.writeRandom_(this.fileData,_len);
		// }
		var _filedata = new Uint8Array();
		_filedata = this.fileData.subarray(0, _len);
		// console.log("-->offset:",this.videoDataOffset_,"this.dataSize=",this.dataSize,",filesize=",this.fileData.length,",after=",_filedata.length);
		return _filedata;
	},

	writeArrayBuffer_ : function(to, offset, from) {
		var i;
		if (from.className == 'WebP2P.ts2mp4.ByteArray') {
			for ( i = 0; i < from.length; i++) {
				to[offset + i] = from.getByte_(i);
			}
		} else {
			for ( i = 0; i < from.length; i++) {
				to[offset + i] = from[i];
			}
		}
		return from.length;
	},

	writeArrayString_ : function(to, offset, from) {
		for ( var i = 0; i < from.length; i++) {
			to[offset + i] = from.charCodeAt(i);
		}
		return from.length;
	},

	writeArrayUint8_ : function(to, offset, from) {
		var position = offset;
		if (Object.prototype.toString.call(from) == '[object Array]') {
			for ( var i = 0; i < from.length; i++) {
				position += this.writeArrayUint8_(to, position, from[i]);
			}
		} else {
			to[position++] = from & 0xff;
		}
		return position - offset;
	},

	writeArrayUint16_ : function(to, offset, from) {
		var position = offset;
		if (Object.prototype.toString.call(from) == '[object Array]') {
			for ( var i = 0; i < from.length; i++) {
				position += this.writeArrayUint16_(to, position, from[i]);
			}
		} else {
			to[position++] = (from >> 8) & 0xff;
			to[position++] = from & 0xff;
		}
		return position - offset;
	},

	writeArrayUint32_ : function(to, offset, from) {
		var position = offset;
		if (Object.prototype.toString.call(from) == '[object Array]') {
			for ( var i = 0; i < from.length; i++) {
				position += this.writeArrayUint32_(to, position, from[i]);
			}
		} else {
			to[position++] = (from >> 24) & 0xff;
			to[position++] = (from >> 16) & 0xff;
			to[position++] = (from >> 8) & 0xff;
			to[position++] = from & 0xff;
		}
		return position - offset;
	},

	writeFileType_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "ftyp");
		size += this.writeArrayString_(buffer, offset + size, "isom"); // major brand
		size += this.writeArrayUint32_(buffer, offset + size, 1); // minor version
		size += this.writeArrayString_(buffer, offset + size, "isommp42avc1"); // compatible brands
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMediaType_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "styp");
		size += this.writeArrayString_(buffer, offset + size, "isom"); // major brand
		size += this.writeArrayUint32_(buffer, offset + size, 1); // minor version
		size += this.writeArrayString_(buffer, offset + size, "isommp42avc1"); // compatible brands
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeFreeBlock_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "free");
		size += this.writeArrayString_(buffer, offset + size, "IsoMedia File Produced with GPAC 0.5.1-DEV-rev5528");
		size += this.writeArrayUint8_(buffer, offset + size, 0);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	// moovbox，这个box中不包含具体媒体数据，但包含本文件中所有媒体数据的宏观描述信息，moov box下有mvhd和trak box
	writeMovie_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "moov");
		size += this.writeMovieHeader_(buffer, offset + size);
		if (this.type === 0) {
			size += this.writeMovieExtendBox_(buffer, offset + size);
		}
		size += this.writeTrack_(buffer, offset + size, true);
		size += this.writeTrack_(buffer, offset + size, false);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMovieHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mvhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // creation time
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // modification time
		size += this.writeArrayUint32_(buffer, offset + size, this.video.info.timeScale); // time scale
		size += this.writeArrayUint32_(buffer, offset + size, this.type == 1 ? this.video.info.duration : 0); // Math.max(this.video.info.duration,
		// this.audio.info.duration)); // duration
		size += this.writeArrayUint32_(buffer, offset + size, 0x00010000); // rate
		size += this.writeArrayUint16_(buffer, offset + size, 0x0100); // volume
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0 ]); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, [ 0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000 ]); // unity matrix
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0, 0, 0, 0, 0 ]); // pre defined
		size += this.writeArrayUint32_(buffer, offset + size, 3); // next track id
		this.writeArrayUint32_(buffer, offset, size);
		// console.log("-->mvhd:timescale-->",this.video.info.timeScale,",duration-->",this.video.info.duration);
		return size;
	},

	writeMovieExtendBox_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mvex");
		size += this.writeMovieExtendHeader_(buffer, offset + size);
		size += this.writeTrack_Extend_(buffer, offset + size, true);
		size += this.writeTrack_Extend_(buffer, offset + size, false);
		// size += this.writeTrackPrograme_(buffer,offset+size,true);
		// size += this.writeTrackPrograme_(buffer,offset+size,false);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMovieExtendHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mehd");
		size += this.writeArrayUint32_(buffer, offset + size, 0);
		size += this.writeArrayUint32_(buffer, offset + size, this.fragmentSequenceNumber_);// fregment_duration
		// console.log("-->duration:",this.video.info.duration);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrack_Extend_ : function(buffer, offset, isVideo) {
		var media = isVideo ? this.video : this.audio;
		// var dur = media.info.duration;// /media.items.length;
		var samplesize = isVideo ? this.videoDataSize_ : this.autioDataSize_;
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "trex");
		size += this.writeArrayUint32_(buffer, offset + size, 0);
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2);// track_ID;
		size += this.writeArrayUint32_(buffer, offset + size, 1);// default_sample_description_index;
		size += this.writeArrayUint32_(buffer, offset + size, Math.ceil(media.info.duration / media.items.length));// default_sample_duration;
		size += this.writeArrayUint32_(buffer, offset + size, Math.ceil(samplesize / media.items.length));// default_sample_size;
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 0x10000 : 0x0);// default_sample_flags
		// console.log("-->trex:","dur=",Math.ceil(media.info.duration/media.items.length),",size=",Math.ceil(samplesize/media.items.length));
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrackPrograme_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "trep");
		size += this.writeArrayUint32_(buffer, offset + size, 0);
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2);// track_ID;
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrack_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "trak");
		size += this.writeTrack_Header_(buffer, offset + size, isVideo);
		// if(isVideo && this.type==0)
		// {
		// size += this.writeEditBox_(buffer, offset + size, isVideo);
		// }
		size += this.writeMedia_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeEditBox_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "edts");
		size += this.writeEditListBox_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeEditListBox_ : function(buffer, offset, isVideo) {
		var size = 8;
		var info = isVideo ? this.video.info : this.audio.info;
		this.writeArrayString_(buffer, offset + 4, "elst");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
		size += this.writeArrayUint32_(buffer, offset + size, info.duration); // segment duration
		size += this.writeArrayUint32_(buffer, offset + size, 0); // media time
		size += this.writeArrayUint16_(buffer, offset + size, 1); // media rate integer
		size += this.writeArrayUint16_(buffer, offset + size, 0); // media rate fraction
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrack_Header_ : function(buffer, offset, isVideo) {
		var size = 8;
		var info = isVideo ? this.video.info : this.audio.info;
		this.writeArrayString_(buffer, offset + 4, "tkhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0x1); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // creation time
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // modification time
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2); // track id
		size += this.writeArrayUint32_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, this.type == 1 ? info.duration : 0); // duration
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0 ]); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, 0); // layer
		size += this.writeArrayUint16_(buffer, offset + size, 0); // alternate group
		size += this.writeArrayUint16_(buffer, offset + size, isVideo ? 0 : 0x0100); // volume
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, [ 0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000 ]); // unity matrix
		size += this.writeArrayUint32_(buffer, offset + size, (info.width || 0) << 16); // width
		size += this.writeArrayUint32_(buffer, offset + size, (info.height || 0) << 16); // height
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMedia_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mdia");
		size += this.writeMediaHeader_(buffer, offset + size, isVideo);
		size += this.writeMediaHandlerRef_(buffer, offset + size, isVideo);
		size += this.writeMediaInformation_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMediaHeader_ : function(buffer, offset, isVideo) {
		var size = 8;
		var info = isVideo ? this.video.info : this.audio.info;
		this.writeArrayString_(buffer, offset + 4, "mdhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // creation time
		size += this.writeArrayUint32_(buffer, offset + size, Math.round(new Date().getTime() / 1000) + 2082844800); // modification time
		size += this.writeArrayUint32_(buffer, offset + size, info.timeScale); // time scale
		size += this.writeArrayUint32_(buffer, offset + size, this.type == 1 ? info.duration : 0); // duration
		size += this.writeArrayUint16_(buffer, offset + size, 0x55C4); // language and pack und
		size += this.writeArrayUint16_(buffer, offset + size, 0); // pre defined
		this.writeArrayUint32_(buffer, offset, size);
		// console.log("-->",info.timeScale,",",info.duration);
		return size;
	},

	writeMediaHandlerRef_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "hdlr");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 0); // pre defined
		size += this.writeArrayString_(buffer, offset + size, isVideo ? "vide" : "soun"); // handler type
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0, 0 ]); // reserved
		size += this.writeArrayString_(buffer, offset + size, isVideo ? "VideoHandler" : "SoundHandler"); // name
		size += this.writeArrayUint8_(buffer, offset + size, 0); // end of name
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMediaInformation_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "minf");
		if (isVideo) {
			size += this.writeVideoMediaHeader_(buffer, offset + size);
		} else {
			size += this.writeAudioMediaHeader_(buffer, offset + size);
		}
		size += this.writeDataInformation_(buffer, offset + size, isVideo);
		size += this.writeSampleTable_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeVideoMediaHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "vmhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0x1); // full box version and flags
		size += this.writeArrayUint16_(buffer, offset + size, 0); // graphics mode
		size += this.writeArrayUint16_(buffer, offset + size, [ 0, 0, 0 ]); // opcolors
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAudioMediaHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "smhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint16_(buffer, offset + size, 0); // balance
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeDataInformation_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "dinf");
		size += this.writeDataReference_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeDataReference_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "dref");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
		size += this.writeDataInfoUrl_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeDataInfoUrl_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "url ");
		size += this.writeArrayUint32_(buffer, offset + size, 0x1); // full box version and flags
		// empty location as same file
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSampleTable_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "stbl");
		size += this.writeSampleDescription_(buffer, offset + size, isVideo);
		size += this.writeSampleTimestamp_(buffer, offset + size, isVideo);
		// if(isVideo )
		// {
		// size += this.writeSyncSample_(buffer, offset + size);
		// }
		size += this.writeSampleToChunk_(buffer, offset + size, isVideo);
		size += this.writeSampleSize_(buffer, offset + size, isVideo);
		size += this.writeChunkOffset_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSyncSample_ : function(buffer, offset) {
		var syncEntries = [];
		var i;
		var item;
		for ( i = 0; i < this.video.items.length; i++) {
			item = this.video.items[i];
			item.sampleNumber = i + 1;
			if (item.isKeyFrame) {
				syncEntries.push(item);
			}
		}

		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "stss");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, syncEntries.length); // entry count
		for ( i = 0; i < syncEntries.length; i++) {
			item = syncEntries[i];
			size += this.writeArrayUint32_(buffer, offset + size, item.sampleNumber); // sample number
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSampleDescription_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "stsd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
		if (isVideo) {
			size += this.writeVisualSampleEntry_(buffer, offset + size);
		} else {
			size += this.writeAudioSampleEntry_(buffer, offset + size);
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeVisualSampleEntry_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "avc1");
		size += this.writeArrayUint8_(buffer, offset + size, [ 0, 0, 0, 0, 0, 0 ]); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, 1); // data reference index
		size += this.writeArrayUint16_(buffer, offset + size, 0); // pre defined
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0, 0 ]); // pre defined
		size += this.writeArrayUint16_(buffer, offset + size, this.video.info.width); // width
		size += this.writeArrayUint16_(buffer, offset + size, this.video.info.height); // height
		size += this.writeArrayUint32_(buffer, offset + size, 0x00480000); // horiz resolution
		size += this.writeArrayUint32_(buffer, offset + size, 0x00480000); // vert resolution
		size += this.writeArrayUint32_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, 1); // frame count
		for ( var i = 0; i < 32; i++) {
			size += this.writeArrayUint8_(buffer, offset + size, 0); // 32 bytes padding name
		}
		size += this.writeArrayUint16_(buffer, offset + size, 0x0018); // depth
		size += this.writeArrayUint16_(buffer, offset + size, 0xffff); // pre defined
		size += this.writeAVCDecoderConfiguration_(buffer, offset + size);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAVCDecoderConfiguration_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "avcC");
		if (this.video.avcc) {
			size += this.writeArrayBuffer_(buffer, offset + size, this.video.avcc);
			// size += this.writeArrayUint32_(buffer, offset + size,0xfcf8f800);
		} else {
			var sequences = [ 0x67, 0x42, 0xC0, 0x15, 0xD9, 0x41, 0xE0, 0x8E, 0x9A, 0x80, 0x80, 0x80, 0xA0, 0x00, 0x00, 0x03, 0x00, 0x20, 0x00, 0x00, 0x03,
					0x03, 0xD1, 0xE2, 0xC5, 0xCB ];
			size += this.writeArrayUint8_(buffer, offset + size, 1); // configuration version
			size += this.writeArrayUint8_(buffer, offset + size, 0x42); // profile indication => baseline
			size += this.writeArrayUint8_(buffer, offset + size, 0xC0); // profile compatibility
			size += this.writeArrayUint8_(buffer, offset + size, 21); // level indication
			size += this.writeArrayUint8_(buffer, offset + size, 0xFF); // length size minus one
			size += this.writeArrayUint8_(buffer, offset + size, 0xE1); // num of sequence parameter sets
			size += this.writeArrayUint16_(buffer, offset + size, sequences.length); // sequence size
			size += this.writeArrayUint8_(buffer, offset + size, sequences); // sequence
			size += this.writeArrayUint8_(buffer, offset + size, 1); // num of picture parameter sets
			size += this.writeArrayUint16_(buffer, offset + size, 4); // picture size
			size += this.writeArrayUint8_(buffer, offset + size, [ 0x68, 0xC9, 0x23, 0xC8 ]); // picture
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAudioSampleEntry_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mp4a");
		size += this.writeArrayUint8_(buffer, offset + size, [ 0, 0, 0, 0, 0, 0 ]); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, 1); // data reference index
		size += this.writeArrayUint32_(buffer, offset + size, [ 0, 0 ]); // reserved
		size += this.writeArrayUint16_(buffer, offset + size, this.audio.info.channelCount || 2); // channel count
		size += this.writeArrayUint16_(buffer, offset + size, this.audio.info.sampleSize || 16); // sample size
		size += this.writeArrayUint16_(buffer, offset + size, 0); // pre defined
		size += this.writeArrayUint16_(buffer, offset + size, 0); // reserved
		size += this.writeArrayUint32_(buffer, offset + size, this.audio.info.timeScale << 16); // sample rate
		size += this.writeAudioDecoderConfiguration_(buffer, offset + size);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAudioDecoderConfiguration_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "esds"); // Element Stream Descriptors
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeAudioEsDescriptionTag_(buffer, offset + size); // unknown
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeAudioEsDescriptionTag_ : function(buffer, offset) {
		var size = 0;
		size += this.writeArrayUint8_(buffer, offset + size, 0x03); // tag
		size += this.writeArrayUint8_(buffer, offset + size, 0); // size
		size += this.writeArrayUint16_(buffer, offset + size, 10); // ESID
		size += this.writeArrayUint8_(buffer, offset + size, 0); // Stream Dependence Flag:1, URL Flag:1, OCR Stream Flag: 1, Stream Priority: 5
		size += this.writeAudioDecodeConfigDescriptionTag_(buffer, offset + size);
		size += this.writeAudioSlConfigDescriptionTag_(buffer, offset + size);
		this.writeArrayUint8_(buffer, offset + 1, size - 2);
		return size;
	},

	writeAudioDecodeConfigDescriptionTag_ : function(buffer, offset) {
		var size = 0;
		size += this.writeArrayUint8_(buffer, offset + size, 0x04); // tag
		size += this.writeArrayUint8_(buffer, offset + size, 0); // size
		size += this.writeArrayUint8_(buffer, offset + size, 0x40); // Object Type Id
		size += this.writeArrayUint8_(buffer, offset + size, 0x14); // Stream Type = 0x05 << 2
		size += this.writeArrayUint8_(buffer, offset + size, [ 0, 0, 0 ]); // Buffer Size DB
		size += this.writeArrayUint32_(buffer, offset + size, this.autioDataSize_ * 8000 / this.audio.info.duration); // Max Bitrate
		size += this.writeArrayUint32_(buffer, offset + size, this.autioDataSize_ * 8000 / this.audio.info.duration); // Avg Bitrate
		size += this.writeAudioDecodeSpecificDescriptionTag_(buffer, offset + size);
		this.writeArrayUint8_(buffer, offset + 1, size - 2);
		return size;
	},

	writeAudioDecodeSpecificDescriptionTag_ : function(buffer, offset) {
		var size = 0;
		size += this.writeArrayUint8_(buffer, offset + size, 0x05); // tag
		size += this.writeArrayUint8_(buffer, offset + size, 0); // size
		// size += this.writeArrayUint8_(buffer, offset + size, [0x13,0x88,0x56,0xE5,0xA5,0x48,0x80]);
		if (this.audio.aac) {
			size += this.writeArrayBuffer_(buffer, offset + size, this.audio.aac); // info
		} else {
			size += this.writeArrayUint16_(buffer, offset + size, 0x1210); // info
		}
		this.writeArrayUint8_(buffer, offset + 1, size - 2);
		return size;
	},

	writeAudioSlConfigDescriptionTag_ : function(buffer, offset) {
		var size = 0;
		size += this.writeArrayUint8_(buffer, offset + size, 0x06); // tag
		size += this.writeArrayUint8_(buffer, offset + size, 0); // size
		size += this.writeArrayUint8_(buffer, offset + size, 0x02); // predefined
		// size += this.writeArrayUint8_(buffer, offset + size, 0); // flags
		this.writeArrayUint8_(buffer, offset + 1, size - 2);
		return size;
	},

	writeSampleTimestamp_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		// var start = media.start;
		this.writeArrayString_(buffer, offset + 4, "stts");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		if (this.type == 1) {
			size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // sample count
			size += this.writeArrayUint32_(buffer, offset + size, Math.ceil(media.info.duration / media.items.length)); // sample delta
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0); // entry count
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSampleToChunk_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		this.writeArrayString_(buffer, offset + 4, "stsc");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		if (this.type == 1) {
			size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
			size += this.writeArrayUint32_(buffer, offset + size, 1); // first chunk
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // samples per chunk
			size += this.writeArrayUint32_(buffer, offset + size, 1); // sample description index
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0); // entry count
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeSampleSize_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		this.writeArrayString_(buffer, offset + 4, "stsz");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, 0); // sample size
		if (this.type == 1) {
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // sample count
			for ( var i = 0; i < media.items.length; i++) {
				var item = media.items[i];
				size += this.writeArrayUint32_(buffer, offset + size, item.data.length); // entry size
			}
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0); //
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeChunkOffset_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "stco");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		if (this.type == 1) {
			size += this.writeArrayUint32_(buffer, offset + size, 1); // entry count
			if (isVideo) {
				this.videoOffsetPos_.push(offset + size);
			} else {
				this.audioOffsetPos_.push(offset + size);
			}
			size += this.writeArrayUint32_(buffer, offset + size, 0); // chunk offset
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0); // entry count
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMoiveFragment_ : function(buffer, offset) {
		this.moofPos_ = offset;
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "moof");
		size += this.writeMoiveFragmentHeader_(buffer, offset + size);
		if (this.type === 0) {
			size += this.writeTraf_(buffer, offset + size, true);
			size += this.writeTraf_(buffer, offset + size, false);
		}
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeMoiveFragmentHeader_ : function(buffer, offset) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "mfhd");
		size += this.writeArrayUint32_(buffer, offset + size, 0); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, this.fragmentSequenceNumber_++); // sequence number
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTraf_ : function(buffer, offset, isVideo) {
		var size = 8;
		this.writeArrayString_(buffer, offset + 4, "traf");
		size += this.writeTrafHeader_(buffer, offset + size, isVideo);
		size += this.writeTrafDT_(buffer, offset + size, isVideo);
		size += this.writeTrunHeader_(buffer, offset + size, isVideo);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrafHeader_ : function(buffer, offset, isVideo) {
		var size = 8;
		// var info = isVideo ? this.video.info : this.audio.info;
		// var msize = isVideo ? this.videoDataSize_ : this.audioDataSize;
		this.writeArrayString_(buffer, offset + 4, "tfhd");
		/**
		 * 0x000001 base-data-offset-present 0x000002 sample-description-index-present 0x000008 default-sample-duration-present 0x000010
		 * default-sample-size-present 0x000020 default-sample-flags-present 0x010000 duration-is-empty 0x020000 default-base-is-moof
		 */
		size += this.writeArrayUint32_(buffer, offset + size, 0x020000); // full box version and flags
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2); // track id
		// size += this.writeArrayUint32_(buffer, offset + size, 0);//;
		// isVideo ? this.videoOffsetPos_.push(offset + size) : this.audioOffsetPos_.push(offset + size);
		// size += this.writeArrayUint32_(buffer, offset + size, 0);//base_data_offset;
		// if(!isVideo){
		// size += this.writeArrayUint32_(buffer, offset + size, 0x02000000);
		// }
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrafDT_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;

		this.writeArrayString_(buffer, offset + 4, "tfdt");
		size += this.writeArrayUint32_(buffer, offset + size, 0);
		// 提取第一片时间
		// media.items.sort(function(a,b){return a.timestamp-b.timestamp;});
		var newItems = media.items.concat();
		newItems.sort(function(a, b) {
			return a.timestamp - b.timestamp;
		});
		var timestamp = newItems[0].timestamp;
		var dttime = Math.ceil(timestamp * media.info.timeScale / 1000);
		size += this.writeArrayUint32_(buffer, offset + size, dttime);// sum duration
		// console.log("*toMp4:ts--time:",media.items[0].timestamp,dttime);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeTrunHeader_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		var i;
		var item;
		this.writeArrayString_(buffer, offset + 4, "trun");
		/*
		 * flags说明： 0x000001:data-offset-present 0x000004:first-sample-flags-present; this over-rides the default flags for the first sample only. This makes it
		 * possible to record a group of frames where the first is a key and the rest are difference frames, without supplying explicit flags for every sample.
		 * If this flag and field are used, sample-flags shall not be present. 0x000100 sample-duration-present: 标示每一个sample有他自己的时长, 否则使用默认值. 0x000200
		 * sample-size-present：每个sample拥有大小，否则使用默认值 0x000400 sample-flags-present：每个sample有他自己的标志，否则使用默认值 0x000800 sample-composition-time-offsets-present;
		 * 每个sample 有一个composition time offset
		 */
		if (isVideo) {
			size += this.writeArrayUint32_(buffer, offset + size, 0xe05);// flags//offset ,s-size
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // sample count
			this.videoMoofOffset_.push(offset + size);// position
			size += this.writeArrayUint32_(buffer, offset + size, 0); // dat-offset
			size += this.writeArrayUint32_(buffer, offset + size, 0x02000000); // first-sample-flag//
			// var dur = Math.ceil(media.info.duration / media.items.length);
			for ( i = 0; i < media.items.length; i++) {
				item = media.items[i];
				// console.log("-->time:",i,":",item.timestamp,",offset:",item.avccTimeOffset);
				// size += this.writeArrayUint32_(buffer, offset + size, dur); // sample_size
				size += this.writeArrayUint32_(buffer, offset + size, item.data.length); // sample_size
				if (item.isKeyFrame === true) {
					// console.log("-->key:",item.frameType,"|",item.timestamp);
					size += this.writeArrayUint32_(buffer, offset + size, 0x02000000);
				} else {
					size += this.writeArrayUint32_(buffer, offset + size, 0x10000);
				}
				size += this.writeArrayUint32_(buffer, offset + size, item.avccTimeOffset);
			}
		} else {
			size += this.writeArrayUint32_(buffer, offset + size, 0x201);// flags//offset ,s-size
			size += this.writeArrayUint32_(buffer, offset + size, media.items.length); // sample count
			this.audioMoofOffset_.push(offset + size);// position
			size += this.writeArrayUint32_(buffer, offset + size, 0); // dat-offset
			// size += this.writeArrayUint32_(buffer, offset + size, 0); // first-sample-flag//
			for ( i = 0; i < media.items.length; i++) {
				item = media.items[i];
				// console.log("size:",item.data.length);
				// if(this.start<0)
				// {
				// if(i<media.items.length-1)
				// {
				// dur = Math.ceil((media.items[i+1].timestamp - media.items[i].timestamp)*media.info.timeScale/1000);
				// }
				// else
				// {
				// dur = Math.ceil(media.info.duration+(media.items[0].timestamp-media.items[i-1].timestamp)*media.info.timeScale/1000);
				// }
				// // console.log("-->time:",media.items[i].timestamp,",dur:",dur,"|",media.info.duration);
				// size += this.writeArrayUint32_(buffer, offset + size, dur); // sample_duration
				// }
				size += this.writeArrayUint32_(buffer, offset + size, item.data.length); // sample_size
			}
		}
		this.writeArrayUint32_(buffer, offset, size);
		// console.log("--->trun:","|count:",media.items.length,"|dur:",this.audio.info.duration,"-",dur);
		return size;
	},

	writeMediaData_ : function(buffer, offset) {
		offset += this.writeArrayUint32_(buffer, offset, this.dataSize + 8);
		offset += this.writeArrayString_(buffer, offset, "mdat");
		var i, item;
		for ( i = 0; i < this.video.items.length; i++) {
			item = this.video.items[i];
			item.dataOffset = offset;
			offset += this.writeArrayBuffer_(buffer, offset, item.data);
		}
		for ( i = 0; i < this.audio.items.length; i++) {
			item = this.audio.items[i];
			item.dataOffset = offset;
			offset += this.writeArrayBuffer_(buffer, offset, item.data);
		}
		return offset;
	},

	writeRandom_ : function(buffer, offset) {
		// console.log("-->增加文件最后标志！");
		var size = 8;
		offset += this.writeArrayString_(buffer, offset + 4, "mfra");
		size += this.writeRandomTrack_(buffer, offset + size, true);
		size += this.writeRandomTrack_(buffer, offset + size, false);
		size += this.writeRandomOffset_(buffer, offset + size);
		this.writeArrayUint32_(buffer, offset + size, size);
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeRandomTrack_ : function(buffer, offset, isVideo) {
		var size = 8;
		var media = isVideo ? this.video : this.audio;
		var dttime = Math.ceil(media.items[0].timestamp * media.info.timeScale / 1000);
		offset += this.writeArrayString_(buffer, offset + 4, "tfra");
		size += this.writeArrayUint32_(buffer, offset + size, 0);// version
		size += this.writeArrayUint32_(buffer, offset + size, isVideo ? 1 : 2);// trackid
		size += this.writeArrayUint32_(buffer, offset + size, 0);// size traf
		size += this.writeArrayUint32_(buffer, offset + size, 1);// trun size
		size += this.writeArrayUint32_(buffer, offset + size, dttime);
		size += this.writeArrayUint32_(buffer, offset + size, this.moofPos_);
		size += this.writeArrayUint8_(buffer, offset + size, 0x01);// trafnum
		size += this.writeArrayUint8_(buffer, offset + size, 0x01);// trunnum
		size += this.writeArrayUint8_(buffer, offset + size, media.items.length);// trafnum
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	},

	writeRandomOffset_ : function(buffer, offset) {
		var size = 8;
		offset += this.writeArrayString_(buffer, offset + 4, "mfro");
		size += this.writeArrayUint32_(buffer, offset + size, 0);// version
		size += this.writeArrayUint32_(buffer, offset + size, 0);// version
		this.writeArrayUint32_(buffer, offset, size);
		return size;
	}
});p2p$.ns('com.webp2p.tools.ts2mp4');

p2p$.com.webp2p.tools.ts2mp4.Video = CdeBaseClass.extend_({
	nalData_ : null,
	vTag_ : null,
	vTagData_ : null,
	scState_ : null,
	tags_ : null,
	avccData_ : null,
	videoInfo_ : null,
	h264Data_ : null,
	timestamp_ : 0,
	compositionTime_ : 0,

	init : function() {
		this.reset();
	},

	reset : function() {
		this.scState_ = 0;
		this.nalData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024);
		this.vTag_ = null;
		this.vTagData_ = null;
		this.tags_ = [];
		this.avccData_ = null;
		this.videoInfo_ = {
			width : 640,
			height : 352,
			timeScale : 1000,
			duration : 0
		};
		this.timestamp_ = 0;
		this.compositionTime_ = 0;
		// this.h264Data_ = new WebP2P.ts2mp4.ByteArray(100);
	},

	getPTS_ : function(p1, p2, p3) {
		return ((p1 & 0x0e) * Math.pow(2, 29)) + ((p2 & 0xfffe) << 14) + ((p3 & 0xfffe) >> 1);
	},

	processES_ : function(pusi, packet, flush) {
		// if( packet ) this.h264Data_.writeBytes_(packet, packet.position, packet.length - packet.position);
		var i = 0;
		if (pusi) {
			// start of a new PES packet
			if (packet.readUnsignedInt_() != 0x1e0) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Video::PES start code not found or not AAC/AVC"));
			}
			// Ignore packet length and marker bits.
			packet.position += 3;
			// Need PTS and DTS
			var flags = (packet.readUnsignedByte_() & 0xc0) >> 6;
			if (flags != 0x03 && flags != 0x02) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Video::Video PES packet without PTS cannot be decoded, flags: {0}", flags));
			}
			// Check PES header length
			var length = packet.readUnsignedByte_();
			var p1 = packet.readUnsignedByte_();
			var p2 = packet.readUnsignedShort_();
			var p3 = packet.readUnsignedShort_();
			var pts = this.getPTS_(p1, p2, p3);

			// console.log("time:",p1,(p1 & 0x0e),(p1 & 0x0e) << 29);

			this.timestamp_ = Math.round(pts / 90);
			length -= 5;
			if (flags == 0x03) {
				p1 = packet.readUnsignedByte_();
				p2 = packet.readUnsignedShort_();
				p3 = packet.readUnsignedShort_();
				var dts = this.getPTS_(p1, p2, p3);

				// this.timestamp_ = Math.round(dts / 90);
				this.compositionTime_ = this.timestamp_ - Math.round(dts / 90);
				// console.log("-->video--pts " + pts.toString() + " dts " + dts.toString() + " comp " + this.compositionTime_.toString() + " stamp "
				// + this.timestamp_.toString() + " total " + (this.compositionTime_ + this.timestamp_).toString());
				length -= 5;
			} else {
				// this.timestamp_ = Math.round(pts / 90);
				this.compositionTime_ = 0;
			}
			// console.log("--->flags:",flags,",ct=",this.compositionTime_);

			// Skip other header data.
			packet.position += length;
		}
		var dStart = 0;
		if (!flush) {
			dStart = packet.position; // assume that the copy will be from start-of-data
		}

		var nals = [];
		var nal = null;

		if (flush) {
			nal = new p2p$.com.webp2p.tools.ts2mp4.H264NALU(this.nalData_); // full length to end, don't need to trim last 3 bytes
			if (nal.NALtype() !== 0) {
				nals.push(nal); // could inline this (see below)
				// console.log("-->pushed one flush nal of type " + nal.NALtype());
			}
			this.nalData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024);
		} else {
			while (packet.bytesAvailable_() > 0) {
				var value = packet.readUnsignedByte_();

				// finding only 3-byte start codes is ok as trailing zeros are ignored in most (all?) cases
				// console.log("# "+value.toString(16) + " at st "+this.scState_.toString());
				// unperf
				// this.nalData_.writeByte_()value); // in the future we will performance-fix this by keeping indexes and doing block copies, for now we want it
				// to work at all
				switch (this.scState_) {
				case 0:
					if (value === 0x00) {
						this.scState_ = 1;
					}
					break;
				case 1:
					if (value === 0x00) {
						this.scState_ = 2;
					} else {
						this.scState_ = 0;
					}
					break;
				case 2:
					if (value === 0x00) // more than 2 zeros... no problem
					{
						// state stays at 2
						// console.log("ex zero");
						break;
					} else if (value == 0x01) {
						// perf
						this.nalData_.writeBytes_(packet, dStart, packet.position - dStart);
						dStart = packet.position;
						// at this point we have the NAL data plus the *next* start code in nalData_
						// unless there was no previous NAL in which case nalData_ is either empty or has the leading zeros, if any
						if (this.nalData_.length > 4) // require >1 byte of payload
						{
							this.nalData_.length -= 3; // trim off the 0 0 1 (might be one more zero, but in H.264 that's ok)
							nal = new p2p$.com.webp2p.tools.ts2mp4.H264NALU(this.nalData_);
							if (nal.NALtype() !== 0) {
								// console.log("F NAL TYPE "+nal.NALtype().toString());
								nals.push(nal); // could inline this as well, rather than stacking and processing later in the function
							}
						} else {
							// console.log("-->length too short! = " + this.nalData_.length);
						}
						this.nalData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024); // and start collecting into the next one
						this.scState_ = 0; // got one, now go back to looking
						break;
					} else {
						// console.log("0, 0,... " + value.toString());
						this.scState_ = 0; // go back to looking
						break;
					}
					// notreached
					break;
				default:
					// shouldn't ever get here
					this.scState_ = 0;
					break;
				} // switch scState_
			} // while bytesAvailable
		}

		if (!flush && packet.position - dStart > 0) {
			this.nalData_.writeBytes_(packet, dStart, packet.position - dStart);
		}

		var spsNAL = null;
		var ppsNAL = null;
		// find SPS + PPS if we can
		for (i = 0; i < nals.length; i++) {
			nal = nals[i];
			switch (nal.NALtype()) {
			case 7:
				spsNAL = nal;
				break;
			case 8:
				ppsNAL = nal;
				break;
			default:
				break;
			}
		}

		var tag = null; // :FLVTagVideo;
		var avccTag = null; // :FLVTagVideo = null;

		// note that this breaks if the sps and pps are in different segments that we process

		if (spsNAL && ppsNAL) {
			var spsLength = spsNAL.length();
			var ppsLength = ppsNAL.length();

			tag = {};
			tag.timestamp = this.timestamp_;
			tag.isKeyFrame = true;
			// tag.codecId = 'CODEC_ID_AVC';
			// tag.frameType = 'FRAME_TYPE_KEYFRAME';
			// tag.avcPacketType = 'AVC_PACKET_TYPE_SEQUENCE_HEADER';

			var avcc = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024);
			avcc.writeByte_(0x01); // avcC version 1
			// profile, compatibility, level
			avcc.writeBytes_(spsNAL.NALdata(), 1, 3);
			avcc.writeByte_(0xff); // 111111 + 2 bit NAL size - 1
			avcc.writeByte_(0xe1); // number of SPS
			avcc.writeByte_(spsLength >> 8); // 16-bit SPS byte count
			avcc.writeByte_(spsLength);
			avcc.writeBytes_(spsNAL.NALdata(), 0, spsLength); // the SPS
			avcc.writeByte_(0x01); // number of PPS
			avcc.writeByte_(ppsLength >> 8); // 16-bit PPS byte count
			avcc.writeByte_(ppsLength);
			avcc.writeBytes_(ppsNAL.NALdata(), 0, ppsLength);
			this.avccData_ = avcc;
			this.deocodeSps_(spsNAL.NALdata(), 0, spsLength);

			tag.data = avcc;
			// this.tags_.push(tag);
			avccTag = tag;
		}

		for (i = 0; i < nals.length; i++) {
			nal = nals[i];
			// console.log(" NAL TYPE "+nal.NALtype().toString());

			if (nal.NALtype() == 9) // AUD - should read the flags in here too, perhaps
			{
				// close the last vTag_ and start a new one
				if (this.vTag_ && this.vTagData_.length === 0) {
					// console.log("-->zero-length vtag"); // can't happen if we are writing the AUDs in
					if (avccTag) {
						P2P_ULOG_INFO(P2P_ULOG_FMT("tools::ts2mp4::Video::Avccts " + avccTag.timestamp.toString() + " vtagts "
								+ this.vTag_.timestamp.toString()));
					}
				}

				if (this.vTag_ && this.vTagData_.length > 0) {
					this.vTag_.data = this.vTagData_; // set at end (see below)
					this.tags_.push(this.vTag_);
					this.videoInfo_.duration = this.videoInfo_.timeScale * this.timestamp_ / 1000;
					if (avccTag) {
						avccTag.timestamp = this.vTag_.timestamp;
						avccTag = null;
					}
				}
				this.vTag_ = {};
				// this.vTag_.codecId = 'CODEC_ID_AVC';
				// this.vTag_.frameType = 'FRAME_TYPE_INTER'; // adjust to keyframe later
				// this.vTag_.avcPacketType = 'AVC_PACKET_TYPE_NALU';
				this.vTag_.timestamp = this.timestamp_;
				this.vTag_.avccTimeOffset = this.compositionTime_;
				this.vTagData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024); // we assemble the nalus outside, set at end
				this.vTagData_.writeUnsignedInt_(nal.length());
				this.vTagData_.writeBytes_(nal.NALdata()); // start with this very NAL, an AUD (XXX not sure this is needed)
			} else if (nal.NALtype() != 7 && nal.NALtype() != 8) {
				if (this.vTag_ === null) {
					// console.log("-->needed to create vtag");
					this.vTag_ = {};
					this.vTagData_ = new p2p$.com.webp2p.tools.ts2mp4.ByteArray(1024); // we assemble the nalus outside, set at end
					// this.vTag_.codecId = 'CODEC_ID_AVC';
					// this.vTag_.frameType = 'FRAME_TYPE_INTER'; // adjust to keyframe later
					// this.vTag_.avcPacketType = 'AVC_PACKET_TYPE_NALU';
					this.vTag_.timestamp = this.timestamp_;
					this.vTag_.avccTimeOffset = this.compositionTime_;
				}

				if (nal.NALtype() == 5) // is this correct code?
				{
					this.vTag_.isKeyFrame = true;
					// this.vTag_.frameType = 'FRAME_TYPE_KEYFRAME';
				}
				this.vTagData_.writeUnsignedInt_(nal.length());
				this.vTagData_.writeBytes_(nal.NALdata());
			}
		}

		if (flush) {
			// console.log(" *** VIDEO FLUSH CALLED");
			if (this.vTag_ && this.vTagData_.length > 0) {
				this.vTag_.data = this.vTagData_; // set at end (see below)
				this.tags_.push(this.vTag_);
				this.videoInfo_.duration = this.videoInfo_.timeScale * this.timestamp_ / 1000;
				if (avccTag) {
					avccTag.timestamp = this.vTag_.timestamp;
					avccTag = null;
				}
				// console.log("flushing one vtag");
			}
			this.vTag_ = null; // can't start new one, don't have the info
		}
		return this.timestamp_;
	},

	deocodeSps_ : function(buffer, offset, size) {
	}
});p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.ClientBase = CdeBaseClass.extend_({
	init : function() {
	},

	tidy : function() {
	},

	toUrl_ : function(client, url) {
		var env = client.getEnviroment_();
		var context = client.getContext_();
		var metaData = client.getMetaData_();

		url.params_.set("p2p", env.p2pEnabled_ ? "1" : "0");
		url.params_.set("gID", metaData.p2pGroupId_);
		url.params_.set("ver", p2p$.com.webp2p.core.common.String.format("cde.{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber));
		url.params_.set("type", context.playType_);
		url.params_.set("termid", p2p$.com.webp2p.core.common.String.fromNumber(context.terminalType_));
		url.params_.set("platid", context.platformId_);
		url.params_.set("splatid", context.subPlatformId_);
		url.params_.set("vtype", context.videoType_);
		url.params_.set("vformat", context.videoFormat_);
		url.params_.set("geo", context.geo_);
		if (metaData.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive) {
			url.params_.set("gdur", p2p$.com.webp2p.core.common.String.fromNumber(metaData.totalDuration_ / 1000));
		}
		url.params_.set("appid", env.externalAppId_);
		url.params_.set("cdeid", env.moduleId_);
		url.params_.set("package", env.externalAppPackageName_);
		url.params_.set("streamid", context.streamId_);
		url.params_.set("p-rtmfp", context.protocolRtmfpDisabled_ ? "0" : "1");
		url.params_.set("p-cde", context.protocolWebsocketDisabled_ ? "0" : "1");
		url.params_.set("p-rtc", context.protocolWebrtcDisabled_ ? "0" : "1");
		url.params_.set("r", Math.floor(Math.random() * (1000000 + 1)));
		// addtional params
		if (context.addtionalParam1_ != "") {
			url.params_.set("p1", context.addtionalParam1_);
		}
		if (context.addtionalParam2_ != "") {
			url.params_.set("p2", context.addtionalParam2_);
		}
		if (context.addtionalParam3_ != "") {
			url.params_.set("p3", context.addtionalParam3_);
		}
		if (context.appUuid_ != "") {
			url.params_.set("uuid", context.appUuid_);
		}
		if (context.t3partyAppChannel_ != "") {
			url.params_.set("ch", context.t3partyAppChannel_);
		}
	}
});p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.ClientStageStatic = {
	kActionInitialize : 0,
	kActionDownloadMeta : 1,
	kActionSelectorConnected : 2,
	kActionRtmfpConnected : 3,
	kActionGatherConnected : 4,
	kActionWebrtcConnected : 6,

	kActionFirstP2pPiece : 5,
	kActionCdeTrackerConnected : 8,
	kActionScheduleCompleted : 11,
	kActionFirstPiece : 12,
};

p2p$.com.webp2p.tools.collector.ClientStage = p2p$.com.webp2p.tools.collector.ClientBase.extend_({
	action_ : 0,
	errorCode_ : 0,
	usedTime_ : 0,
	serverIp_ : "",
	serverPort_ : 0,

	init : function() {
		this.action_ = 0;
		this.errorCode_ = 0;
		this.usedTime_ = 0;
		this.serverPort_ = 0;
		this.serverIp_ = "";
	},

	tidy : function() {
		this._super();
		this.action_ = 0;
		this.errorCode_ = 0;
		this.usedTime_ = 0;
		this.serverPort_ = 0;
	},

	toUrl_ : function(client, url) {
		this._super(client, url);
		url.file_ = "/ClientStageInfo";
		url.params_.set("act", p2p$.com.webp2p.core.common.String.fromNumber(this.action_));
		url.params_.set("err", p2p$.com.webp2p.core.common.String.fromNumber(this.errorCode_));
		url.params_.set("utime", p2p$.com.webp2p.core.common.String.fromNumber(this.usedTime_));
		url.params_.set("ip", this.serverIp_);
		url.params_.set("port", p2p$.com.webp2p.core.common.String.fromNumber(this.serverPort_));
	}

});p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.ClientTraffic = p2p$.com.webp2p.tools.collector.ClientBase.extend_({

	playing_ : false,
	downloadSizeFromCdn_ : 0,

	downloadSizeByRtmfp_ : 0,
	downloadSizeByRtmfpFromPc_ : 0,
	downloadSizeByRtmfpFromTv_ : 0,
	downloadSizeByRtmfpFromBox_ : 0,
	downloadSizeByRtmfpFromMobile_ : 0,

	downloadSizeByWebsocket_ : 0,
	downloadSizeByWebsocketFromPc_ : 0,
	downloadSizeByWebsocketFromTv_ : 0,
	downloadSizeByWebsocketFromBox_ : 0,
	downloadSizeByWebsocketFromMobile_ : 0,

	downloadSizeByWebrtc_ : 0,
	downloadSizeByWebrtcFromPc_ : 0,
	downloadSizeByWebrtcFromTv_ : 0,
	downloadSizeByWebrtcFromBox_ : 0,
	downloadSizeByWebrtcFromMobile_ : 0,

	avgRtmfpNodes_ : 0,
	avgRtmfpSessions_ : 0,
	avgWebSocketNodes_ : 0,
	avgWebSocketSessions_ : 0,
	avgWebrtcNodes_ : 0,
	avgWebrtcSessions_ : 0,

	totalRtmfpNodes_ : 0,
	totalRtmfpSessions_ : 0,
	totalWebSocketNodes_ : 0,
	totalWebSocketSessions_ : 0,
	totalWebrtcNodes_ : 0,
	totalWebrtcSessions_ : 0,

	rtmfpNodeTimes_ : 0,
	rtmfpSessionTimes_ : 0,
	webSocketNodeTimes_ : 0,
	webSocketSessionTimes_ : 0,
	webrtcNodeTimes_ : 0,
	webrtcSessionTimes_ : 0,

	trackerServerIp_ : "",
	trackerServerPort_ : 0,
	rtmfpServerIp_ : "",
	rtmfpServerPort_ : 0,
	webrtcServerIp_ : "",
	webrtcServerPort_ : 0,
	stunServerIp_ : "",
	stunServerPort_ : 0,

	uploadSizeByRtmfp_ : 0,
	uploadSizeByWebsocket_ : 0,
	uploadSizeByWebrtc_ : 0,

	checksumSuccessCount_ : 0,
	checksumErrorsByCdn_ : 0,
	checksumErrorsByRtmfp_ : 0,
	checksumErrorsByWebsocket_ : 0,
	checksumErrorsByWebrtc_ : 0,
	checksumErrorsByUnknown_ : 0,

	updated_ : false,
	nodesReset_ : false,
	updateTime_ : 0,
	lastFlushTime_ : 0,

	init : function() {
		this.trackerServerPort_ = 0;
		this.rtmfpServerPort_ = 0;

		this.updated_ = false;
		this.updateTime_ = 0;
		this.lastFlushTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		this.tidy();
		this.tidyNodeAndSessions_();
	},

	tidy : function() {
		this._super();
		this.nodesReset_ = true;
		this.playing_ = true;
		this.downloadSizeFromCdn_ = 0;
		this.downloadSizeByRtmfp_ = 0;
		this.downloadSizeByRtmfpFromPc_ = 0;
		this.downloadSizeByRtmfpFromTv_ = 0;
		this.downloadSizeByRtmfpFromBox_ = 0;
		this.downloadSizeByRtmfpFromMobile_ = 0;

		this.downloadSizeByWebsocket_ = 0;
		this.downloadSizeByWebsocketFromPc_ = 0;
		this.downloadSizeByWebsocketFromTv_ = 0;
		this.downloadSizeByWebsocketFromBox_ = 0;
		this.downloadSizeByWebsocketFromMobile_ = 0;

		this.downloadSizeByWebrtc_ = 0;
		this.downloadSizeByWebrtcFromPc_ = 0;
		this.downloadSizeByWebrtcFromTv_ = 0;
		this.downloadSizeByWebrtcFromBox_ = 0;
		this.downloadSizeByWebrtcFromMobile_ = 0;

		this.uploadSizeByRtmfp_ = 0;
		this.uploadSizeByWebsocket_ = 0;
		this.uploadSizeByWebrtc_ = 0;

		this.checksumSuccessCount_ = 0;
		this.checksumErrorsByCdn_ = 0;
		this.checksumErrorsByRtmfp_ = 0;
		this.checksumErrorsByWebsocket_ = 0;
		this.checksumErrorsByWebrtc_ = 0;
		this.checksumErrorsByUnknown_ = 0;
	},

	tidyNodeAndSessions_ : function() {
		this.avgRtmfpNodes_ = 0;
		this.avgRtmfpSessions_ = 0;
		this.avgWebSocketNodes_ = 0;
		this.avgWebSocketSessions_ = 0;
		this.avgWebrtcNodes_ = 0;
		this.avgWebrtcSessions_ = 0;

		this.totalRtmfpNodes_ = 0;
		this.totalRtmfpSessions_ = 0;
		this.totalWebSocketNodes_ = 0;
		this.totalWebSocketSessions_ = 0;
		this.totalWebrtcNodes_ = 0;
		this.totalWebrtcSessions_ = 0;

		this.rtmfpNodeTimes_ = 0;
		this.rtmfpSessionTimes_ = 0;
		this.webSocketNodeTimes_ = 0;
		this.webSocketSessionTimes_ = 0;
		this.webrtcNodeTimes_ = 0;
		this.webrtcSessionTimes_ = 0;
	},

	toUrl_ : function(client, url) {
		var context = client.getContext_();
		this._super(client, url);
		var upnpStatus = 0;
		if (!context.protocolWebsocketDisabled_) {
			upnpStatus = context.upnpMapSuccess_ ? 1 : 2;
		}

		url.file_ = "/ClientTrafficInfo";
		url.params_.set("play", this.playing_ ? "1" : "0");
		url.params_.set("csize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeFromCdn_));
		url.params_.set("dsize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByRtmfpFromPc_));
		url.params_.set("tsize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByRtmfpFromTv_));
		url.params_.set("bsize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByRtmfpFromBox_));
		url.params_.set("msize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByRtmfpFromMobile_));
		url.params_.set("dnode", this.avgRtmfpSessions_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgRtmfpSessions_));
		url.params_.set("lnode", this.avgRtmfpNodes_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgRtmfpNodes_));
		url.params_.set("dnode-cde", this.avgWebSocketSessions_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgWebSocketSessions_));
		url.params_.set("lnode-cde", this.avgWebSocketNodes_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgWebSocketNodes_));
		url.params_.set("dnode-rtc", this.avgWebSocketSessions_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgWebrtcSessions_));
		url.params_.set("lnode-rtc", this.avgWebSocketNodes_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgWebrtcNodes_));
		url.params_.set("gip", this.trackerServerIp_);
		url.params_.set("gport", p2p$.com.webp2p.core.common.String.fromNumber(this.trackerServerPort_));
		url.params_.set("rip", this.rtmfpServerIp_);
		url.params_.set("rport", p2p$.com.webp2p.core.common.String.fromNumber(this.rtmfpServerPort_));

		url.params_.set("gip", this.webrtcServerIp_);
		url.params_.set("gport", p2p$.com.webp2p.core.common.String.fromNumber(this.webrtcServerPort_));
		// url.params_.set("stunip", this.stunServerIp_);
		// url.params_.set("stunport", p2p$.com.webp2p.core.common.String.fromNumber(this.stunServerPort_));

		url.params_.set("upnp", p2p$.com.webp2p.core.common.String.fromNumber(upnpStatus));
		url.params_.set("up-rtmfp", p2p$.com.webp2p.core.common.String.fromNumber(this.uploadSizeByRtmfp_));
		url.params_.set("up-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.uploadSizeByWebsocket_));
		url.params_.set("up-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.uploadSizeByWebrtc_));

		url.params_.set("dsize-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebsocketFromPc_));
		url.params_.set("tsize-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebsocketFromTv_));
		url.params_.set("bsize-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebsocketFromBox_));
		url.params_.set("msize-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebsocketFromMobile_));

		url.params_.set("dsize-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebrtcFromPc_));
		url.params_.set("tsize-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebrtcFromTv_));
		url.params_.set("bsize-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebrtcFromBox_));
		url.params_.set("msize-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebrtcFromMobile_));

		url.params_.set("chk0", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumSuccessCount_));
		url.params_.set("chk1", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumErrorsByUnknown_));
		url.params_.set("chk2", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumErrorsByCdn_));
		url.params_.set("chk3", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumErrorsByRtmfp_));
		url.params_.set("chk4", "0");
		url.params_.set("chk5", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumErrorsByWebsocket_));
	},

	updateSessions_ : function(client, protocolType, count, autoFlush) {
		if (typeof autoFlush == 'undefined') {
			autoFlush = true;
		}
		var context = client.getContext_();
		if (this.nodesReset_) {
			this.tidyNodeAndSessions_();
			this.nodesReset_ = false;
		}

		this.updated_ = true;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.rtmfpSessionTimes_++;
			this.totalRtmfpSessions_ += count;
			this.avgRtmfpSessions_ = context.p2pRtmfpPeerId_ == "" ? -1 : (this.totalRtmfpSessions_ / this.rtmfpSessionTimes_);
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.webSocketSessionTimes_++;
			this.totalWebSocketSessions_ += count;
			this.avgWebSocketSessions_ = context.trackerServerConnectedTime_ <= 0 ? -1 : (this.totalWebSocketSessions_ / this.webSocketSessionTimes_);
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.webrtcSessionTimes_++;
			this.totalWebrtcSessions_ += count;
			this.avgWebrtcSessions_ = context.webrtcServerConnectedTime_ <= 0 ? -1 : (this.totalWebrtcSessions_ / this.webrtcSessionTimes_);
			break;
		default:
			break;
		}

		var nodeCount = 0;
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			nodeCount = context.rtmfpTotalNodeCount_;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			nodeCount = context.websocketTotalNodeCount_;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			nodeCount = context.webrtcTotalNodeCount_;
			break;
		default:
			break;
		}
		this.updateNodes_(client, protocolType, nodeCount);

		// if (autoFlush) {
		// this.flush(client, false);
		// }
	},

	updateNodes_ : function(client, protocolType, count) {
		this.updated_ = true;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.rtmfpNodeTimes_++;
			this.totalRtmfpNodes_ += count;
			this.avgRtmfpNodes_ = this.totalRtmfpNodes_ / this.rtmfpNodeTimes_;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.webSocketNodeTimes_++;
			this.totalWebSocketNodes_ += count;
			this.avgWebSocketNodes_ = this.totalWebSocketNodes_ / this.webSocketNodeTimes_;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.webrtcNodeTimes_++;
			this.totalWebrtcNodes_ += count;
			this.avgWebrtcNodes_ = this.totalWebrtcNodes_ / this.webrtcNodeTimes_;
			break;
		default:
			break;
		}
	},

	addDownloadSize_ : function(client, protocolType, terminalType, size, autoFlush) {
		if (size <= 0) {
			return;
		}
		if (typeof autoFlush == 'undefined') {
			autoFlush = true;
		}

		this.updated_ = true;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
			this.downloadSizeFromCdn_ += size;
			break;

		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.downloadSizeByRtmfp_ += size;
			switch (terminalType) {
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
				this.downloadSizeByRtmfpFromPc_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
				this.downloadSizeByRtmfpFromTv_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
				this.downloadSizeByRtmfpFromBox_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
				this.downloadSizeByRtmfpFromMobile_ += size;
				break;
			default:
				this.downloadSizeByRtmfpFromPc_ += size;
				break;
			}
			break;

		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.downloadSizeByWebsocket_ += size;
			switch (terminalType) {
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
				this.downloadSizeByWebsocketFromPc_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
				this.downloadSizeByWebsocketFromTv_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
				this.downloadSizeByWebsocketFromBox_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
				this.downloadSizeByWebsocketFromMobile_ += size;
				break;
			default:
				this.downloadSizeByWebsocketFromPc_ += size;
				break;
			}
			break;

		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.downloadSizeByWebrtc_ += size;
			switch (terminalType) {
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
				this.downloadSizeByWebrtcFromPc_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
				this.downloadSizeByWebrtcFromTv_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
				this.downloadSizeByWebrtcFromBox_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
				this.downloadSizeByWebrtcFromMobile_ += size;
				break;
			default:
				this.downloadSizeByWebrtcFromPc_ += size;
				break;
			}
			break;

		default:
			break;
		}

		// if (autoFlush) {
		// this.flush(client, false);
		// }
	},

	addUploadSize_ : function(client, protocolType, terminalType, size, autoFlush) {
		if (size <= 0) {
			return;
		}
		if (typeof autoFlush == 'undefined') {
			autoFlush = true;
		}

		this.updated_ = true;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.uploadSizeByRtmfp_ += size;
			break;

		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.uploadSizeByWebsocket_ += size;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.uploadSizeByWebrtc_ += size;
			break;

		default:
			break;
		}

		// if (autoFlush) {
		// this.flush(client, false);
		// }
	},

	addChecksumErrors_ : function(client, protocolType, successCount, failedCount, autoFlush) {
		this.checksumSuccessCount_ += successCount;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (typeof autoFlush == 'undefined') {
			autoFlush = true;
		}

		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
			this.checksumErrorsByCdn_ += failedCount;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.checksumErrorsByRtmfp_ += failedCount;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.checksumErrorsByWebsocket_ += failedCount;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.checksumErrorsByWebrtc_ += failedCount;
			break;
		default:
			this.checksumErrorsByUnknown_ += failedCount;
			break;
		}

		// if (autoFlush) {
		// this.flush(client, false);
		// }
	},

	flush : function(client, closed) {
		if (!this.updated_) {
			return;
		}
		client.sendClientTraffic_(this);
		// this.lastFlushTime_ = nowTime;
		this.tidy();
	}
});p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.ReportClient = CdeBaseClass.extend_({

	timer_ : null,
	enviroment_ : null,
	context_ : null,
	metaData_ : null,
	pendingReports_ : null,
	http_ : null,
	reportServer_ : "",

	init : function(env, context, metaData) {
		this.enviroment_ = env;
		this.metaData_ = metaData;
		this.context_ = context;
		this.reportServer_ = "http://" + env.getHostDomain_("s.webp2p.letv.com");
		this.pendingReports_ = [];
	},

	setReportTimeout_ : function(timeoutMs) {
		var me = this;
		this.timer_ = setTimeout(function() {
			me.onHttpTimeout_();
		}, timeoutMs);
	},

	reportNext_ : function() {
		if (this.http_ != null || this.pendingReports_.length == 0) {
			return;
		}

		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		this.setReportTimeout_(10 * 1000);

		var nextItem = this.pendingReports_[0];
		this.pendingReports_.shift();

		var url;
		if (nextItem.indexOf("http://") == 0) {
			url = nextItem;
		} else {
			url = this.reportServer_ + nextItem;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::ReportClient::Send report, {0} pending item(s) to url({1})", this.pendingReports_.length, url));
		this.http_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(url, this, "GET", "text", "collector::report");
		this.http_.load();
	},

	onHttpTimeout_ : function() {
		this.http_ = null;
		this.reportNext_();
	},

	onHttpDownloadCompleted_ : function(downloader) {
		if (this.http_ != downloader) {
			// expired
			P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::ReportClient::expired http complete for tag({0}), channel({1}), ignore", downloader.tag_,
					this.metaData_.storageId_));
			return true;
		}

		this.http_ = null;
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT(
				"tools::collector::ReportClient::Report complete for tag({0}), channel({1}), url({2}), response code({3}), details({4}), size({5})",
				downloader.tag_, this.metaData_.storageId_, downloader.fullUrl_, downloader.responseCode_, downloader.responseDetails_,
				downloader.responseData_.length));

		this.reportNext_();
		return true;
	},

	getEnviroment_ : function() {
		return this.enviroment_;
	},

	getContext_ : function() {
		return this.context_;
	},

	getMetaData_ : function() {
		return this.metaData_;
	},

	initialize_ : function(params) {
		return true;
	},

	exit : function() {

		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.http_ != null) {
			this.http_ = null;
		}
		this.pendingReports_ = [];
	},

	sendClientStage_ : function(stage) {
		var url = new p2p$.com.webp2p.core.supernode.Url();
		stage.toUrl_(this, url);
		var val = "";
		if (url.params_.find("act")) {
			val = url.params_.get("act");
			url.params_.erase("act");
		}
		this.pendingReports_.push(url.file_ + "?act=" + val + url.toQueryString_(false));
		this.reportNext_();
		return true;
	},

	sendClientTraffic_ : function(traffic) {
		var url = new p2p$.com.webp2p.core.supernode.Url();
		traffic.toUrl_(this, url);
		this.pendingReports_.push(url.file_ + url.toQueryString_());
		this.reportNext_();
	},

	sendAdvertStage_ : function(stage) {
		var url = new p2p$.com.webp2p.core.supernode.Url();
		stage.toUrl_(this, url);
		this.pendingReports_.push(url.toString());
		this.reportNext_();
	},

	sendClientStage2_ : function(action, errorCode, serverHost, usedTime) {
		var stage = new p2p$.com.webp2p.tools.collector.ClientStage();
		var data2 = serverHost.split(" ");
		var data = "";
		if (data2.length == 1) {
			data = data2[0].split(":");
		} else {
			data = data2[1].split(":");
		}

		stage.action_ = action;
		stage.errorCode_ = errorCode;
		stage.usedTime_ = usedTime;
		stage.serverIp_ = data[0];
		stage.serverPort_ = data.length == 1 ? 80 : data[1];
		return this.sendClientStage_(stage);
	}
});p2p$.ns('com.webp2p.tools.collector');

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
				this.applyCallbacks_();
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
};CdeBaseClass.apply(p2p$.com.webp2p.core.supernode.Context, {
	getAllStatus_ : function(result) {
		result["drmEnabled"] = this.drmEnabled_;
		result["geo"] = this.geo_;
		result["geoName"] = this.geoName_;
		result["clientIp"] = this.clientIp_;
		result["gslbServerIp"] = this.gslbServerIp_;
		result["metaServerIp"] = this.metaServerIp_;
		result["deviceType"] = this.deviceType_;
		result["osType"] = this.osType_;
		result["statReportInterval"] = this.statReportInterval_;
		result["specialPlayerTimeOffset"] = this.specialPlayerTimeOffset_;
		result["specialPlayerTimeLimit"] = this.specialPlayerTimeLimit_;
		result["liveStorageMemoryOnly"] = this.liveStorageMemoryOnly_;
		result["vodStorageMemoryOnly"] = this.vodStorageMemoryOnly_;
		result["downloadSpeedRatio"] = this.downloadSpeedRatio_;

		result["p2pPeerId"] = this.p2pPeerId_;
		result["p2pRtmfpPeerId"] = this.p2pRtmfpPeerId_;
		result["p2pWebsocketPeerId"] = this.p2pWebsocketPeerId_;
		result["p2pWebrtcPeerId"] = this.p2pWebrtcPeerId_;
		result["p2pFetchRate"] = this.p2pFetchRate_;
		result["p2pMaxPeers"] = this.p2pMaxPeers_;
		result["p2pUrgentSize"] = this.p2pUrgentSize_;
		result["p2pUploadEnabled"] = this.p2pUploadEnabled_;
		result["p2pUploadLimit"] = this.p2pUploadLimit_;
		result["p2pUploadThrottleInit"] = this.p2pUploadThrottleInit_;
		result["p2pUploadThrottleAverage"] = this.p2pUploadThrottleAverage_;
		result["p2pUploadMaxReserved"] = this.p2pUploadMaxReserved_;
		result["p2pUrgentUploadEnabled"] = this.p2pUrgentUploadEnabled_;
		result["p2pShareRangeInterval"] = this.p2pShareRangeInterval_;
		result["p2pMaxParallelRequestPieces"] = this.p2pMaxParallelRequestPieces_;
		result["p2pMaxUrgentRequestPieces"] = this.p2pMaxUrgentRequestPieces_;

		result["cdnSlowThresholdRate"] = this.cdnSlowThresholdRate_;
		result["cdnDisabled"] = this.cdnDisabled_;
		result["cdnMultiRequest"] = this.cdnMultiRequest_;
		result["cdnMultiMaxHost"] = this.cdnMultiMaxHost_;
		result["cdnStartTime"] = this.cdnStartTime_;
		result["playingPosition"] = this.playingPosition_;

		result["selectorServerHost"] = this.selectorServerHost_;
		result["gatherServerHost"] = this.gatherServerHost_;
		result["rtmfpServerHost"] = this.rtmfpServerHost_;
		result["trackerServerHost"] = this.trackerServerHost_;

		var url = new p2p$.com.webp2p.core.supernode.Url();
		url.fromString_(this.webrtcServerHost_);
		result["webrtcServerHost"] = url.host_ + ":" + url.port_;

		result["protocolCdnDisabled"] = this.protocolCdnDisabled_;
		result["protocolRtmfpDisabled"] = this.protocolRtmfpDisabled_;
		result["protocolWebsocketDisabled"] = this.protocolWebsocketDisabled_;
		result["protocolWebrtcDisabled"] = this.protocolWebrtcDisabled_;

		result["selectorConnectedTime"] = this.selectorConnectedTime_;
		result["rtmfpServerConnectedTime"] = this.rtmfpServerConnectedTime_;
		result["webrtcServerConnectedTime"] = this.webrtcServerConnectedTime_;
		result["gatherServerConnectedTime"] = this.gatherServerConnectedTime_;
		result["trackerServerConnectedTime"] = this.trackerServerConnectedTime_;

		result["cdnTotalNodeCount"] = this.cdnTotalNodeCount_;
		result["rtmfpTotalNodeCount"] = this.rtmfpTotalNodeCount_;
		result["webrtcTotalNodeCount"] = this.webrtcTotalNodeCount_;
		result["websocketTotalNodeCount"] = this.websocketTotalNodeCount_;

		result["upnpMapCompleteTime"] = this.upnpMapCompleteTime_;
		result["upnpMapSuccess"] = this.upnpMapSuccess_;
		result["upnpMappedInPort"] = this.upnpMappedInPort_;
		result["upnpMappedOutPort"] = this.upnpMappedOutPort_;
		result["upnpMappedAddress"] = this.upnpMappedAddress_;
	}
});

p2p$.com.webp2p.core.supernode.Enviroment.getAllStatus_ = function(result) {
	result["debug"] = this.debug_;
	result["p2pEnabled"] = this.p2pEnabled_;
	result["p2pUploadEnabled"] = this.p2pUploadEnabled_;
	result["rtlStreamEnabled"] = this.rtlStreamEnabled_;
	result["liveStorageMemoryOnly"] = this.liveStorageMemoryOnly_;
	result["vodStorageMemoryOnly"] = this.vodStorageMemoryOnly_;
	result["networkType"] = this.networkType_;
	result["externalAppId"] = this.externalAppId_;
	result["externalAppVersion"] = this.externalAppVersion_;
	result["externalAppChannel"] = this.externalAppChannel_;
	result["externalAppPackageName"] = this.externalAppPackageName_;
	result["moduleVersion"] = this.moduleVersion_;
	result["moduleId"] = this.moduleId_;
	result["clientGeo"] = this.clientGeo_;
	result["clientGeoName"] = this.clientGeoName_;
	result["clientIp"] = this.clientIp_;
	result["deviceType"] = this.deviceType_;
	result["osType"] = this.osType_;
	result["rootDomain"] = this.rootDomain_;
	result["globalProxyUrl"] = this.globalProxyUrl_;
	result["defaultGslbTss"] = this.defaultGslbTss_;
	result["defaultGslbM3v"] = this.defaultGslbM3v_;
	result["hlsServerPort"] = this.hlsServerPort_;
	result["livePlayOffset"] = this.livePlayOffset_;
	result["specialPlayerTimeOffset"] = this.specialPlayerTimeOffset_;
	result["specialPlayerTimeLimit"] = this.specialPlayerTimeLimit_;
	result["downloadSpeedRatio"] = this.downloadSpeedRatio_;
	result["customContextParams"] = this.customContextParams_;
	result["customMediaParams"] = this.customMediaParams_;
	// result["keyDataCacheCount"] = (json::Int)keyDataCaches_.size();

	// control params
	result["protocolCdnDisabled"] = this.protocolCdnDisabled_;
	result["protocolRtmfpDisabled"] = this.protocolRtmfpDisabled_;
	result["protocolWebsocketDisabled"] = this.protocolWebsocketDisabled_;
	result["protocolWebrtcDisabled"] = this.protocolWebrtcDisabled_;
};

CdeBaseClass.apply(p2p$.com.webp2p.core.supernode.MetaData, {
	getAllStatus_ : function(startSegmentId, maxDuration, params, result) {
		var incompleleOnly = params["incompleteOnly"];
		result["updateTime"] = this.updateTime_;
		result["segmentCount"] = this.segments_.length;
		result["directCount"] = this.directCount_;
		result["pieceCount"] = this.tn2SegmentIndexMap_.length + this.pn2SegmentIndexMap_.length;
		result["tnPieceCount"] = this.tn2SegmentIndexMap_.length;
		result["pnPieceCount"] = this.pn2SegmentIndexMap_.length;
		result["p2pGroupId"] = this.p2pGroupId_;
		result["directDuration"] = this.directDuration_;
		result["targetDuration"] = this.targetDuration_;
		result["totalGapDuration"] = this.totalGapDuration_;
		result["segmentFirstId"] = (this.segments_.length > 0) ? this.segments_[0].id_ : 0;
		result["segmentLastId"] = (this.segments_.legnth > 0) ? this.segments_[this.segments_.length - 1].id_ : 0;
		result["rangeParamsSupported"] = this.rangeParamsSupported_;
		result["verifyMethod"] = this.verifyMethod_;

		var segmentDisplayCount = 0;
		var segmentDisplayDuration = 0;
		var segmentCompletedCount = 0;
		var segmentCompletingCount = 0;
		var resultSegments = result["segments"] = [];
		for ( var n = 0, j = 0; n < this.segments_.length; n++) {
			var segment = this.segments_[n];
			if (incompleleOnly && segment.completedTime_ > 0) {
				continue;
			}
			if (startSegmentId >= 0 && segment.id_ < startSegmentId) {
				continue;
			}
			if (maxDuration > 0 && segmentDisplayDuration >= maxDuration * 1000) {
				break;
			}
			var resultSegmentsStatus = resultSegments[j++] = {};
			segment.getAllStatus_(resultSegmentsStatus);

			segmentDisplayCount++;
			segmentDisplayDuration += segment.duration_;
			if (segment.completedTime_ > 0) {
				segmentCompletedCount++;
			} else if (segment.completedPieceCount_ > 0) {
				segmentCompletingCount++;
			}
		}
		result["segmentDisplayCount"] = segmentDisplayCount;
		result["segmentDisplayDuration"] = segmentDisplayDuration;
		result["segmentCompletedCount"] = segmentCompletedCount;
		result["segmentCompletingCount"] = segmentCompletingCount;
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.core.supernode.MetaSegment, {
	getAllStatus_ : function(result) {
		result["id"] = this.id_;
		result["index"] = this.index_;
		result["duration"] = this.duration_;
		result["url"] = this.url_;
		result["pieceCount"] = this.pieces_.length;
		result["pieceTnCount"] = this.pieceTnCount_;
		result["piecePnCount"] = this.piecePnCount_;
		result["size"] = this.size_;
		result["startTime"] = this.startTime_;
		result["startTimeActual"] = this.startTimeActual_;
		result["lastActiveTime"] = this.lastActiveTime_;
		result["completedTime"] = this.completedTime_;
		result["completedPieceCount"] = this.completedPieceCount_;
		result["completedSize"] = this.completedSize_;
		result["startReceiveTime"] = this.startReceiveTime_;
		result["lastReceiveTime"] = this.lastReceiveTime_;
		result["receiveSpeed"] = this.receiveSpeed_;
		result["beginOfMeta"] = this.beginOfMeta_;
		result["discontinuity"] = this.discontinuity_;

		var pendingPieceCount = 0;
		var resultPieces = result["pieces"] = [];
		for ( var n = 0; n < this.pieces_.length; n++) {
			var piece = this.pieces_[n];
			if (piece.completedTime_ <= 0 && piece.receiveStartTime_ > 0) {
				pendingPieceCount++;
			}
			var resultPiecesStatus = resultPieces[n] = {};
			piece.getAllStatus_(resultPiecesStatus);
		}
		result["pendingPieceCount"] = pendingPieceCount;
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.core.supernode.MetaPiece, {
	getAllStatus_ : function(result) {
		result["id"] = this.id_;
		result["index"] = this.index_;
		result["type"] = this.type_;
		result["offset"] = this.offset_;
		result["size"] = this.size_;
		result["wild"] = this.wild_;
		result["checksum"] = this.checksum_;
		result["transferDepth"] = this.transferDepth_;
		result["shareInRanges"] = this.shareInRanges_;
		result["receiveProtocol"] = this.receiveProtocol_;
		result["receiveByStable"] = this.receiveByStable_;
		result["receiveStartTime"] = this.receiveStartTime_;
		result["playedTime"] = this.playedTime_;
		result["completedTime"] = this.completedTime_;
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.logic.base.Channel, {
	getAllStatus_ : function(params, result) {
		var simpleMode = params.get("simple");
		var needGslbData = params.get("gslb");
		var segmentStartWithPlayer = params.get("segmentStartWithPlayer") == "1";
		var maxDuration = params.get("maxDuration");
		if (segmentStartWithPlayer && maxDuration <= 0) {
			maxDuration = 300; // default
		}

		result["id"] = this.id_;
		result["type"] = this.getTypeName_();
		result["opened"] = this.opened_;
		result["paused"] = this.paused_;
		result["groupType"] = this.groupType_;
		result["redirectMode"] = this.redirectMode_;
		result["directMetaMode"] = this.directMetaMode_;
		result["playerHistoryKey"] = this.playerHistoryKey_;
		result["icpCode"] = this.icpCode_;
		result["channelUrl"] = this.metaData_.channelUrl_;
		result["channelPlayUrl"] = p2p$.com.webp2p.core.common.String.format("/play?debug={0}&mcdn={1}&enc=base64&ext=m3u8&url={2}", this.context_.debug_ ? 1
				: 0, this.context_.cdnMultiRequest_ ? 1 : 0, p2p$.com.webp2p.core.common.String.urlEncode_(p2p$.com.webp2p.core.common.String
				.base64Encode_(this.metaData_.channelUrl_)));
		result["gslbRequestUrl"] = this.gslbRequestUrl_;
		result["gslbEncryptUrl"] = this.gslbEncryptUrl_;
		result["createTime"] = this.createTime_;
		result["openTime"] = this.openTime_;
		result["activeTime"] = this.activeTime_;
		result["urlTagTime"] = this.urlTagTime_;
		result["gslbTryTimes"] = this.gslbTryTimes_;
		result["metaTryTimes"] = this.metaTryTimes_;
		result["gslbServerResponseCode"] = this.gslbServerResponseCode_;
		result["gslbServerErrorCode"] = this.gslbServerErrorCode_;
		result["gslbServerErrorDetails"] = this.gslbServerErrorDetails_;
		result["checksumServerResponseCode"] = this.checksumServerResponseCode_;
		result["metaServerResponseCode"] = this.metaServerResponseCode_;
		result["channelOpenedTime"] = this.channelOpenedTime_;
		result["maxSleepTime"] = this.maxSleepTime_;
		result["playerFlushTime"] = this.playerFlushTime_;
		result["playerFlushInterval"] = this.playerFlushInterval_;
		result["playerFlushMaxInterval"] = this.playerFlushMaxInterval_;
		result["playerInitialPosition"] = this.playerInitialPosition_;
		result["playerSkipPosition"] = this.playerSkipPosition_;
		result["playerSkipDuration"] = this.playerSkipDuration_;
		result["playerSkipBeginSegmentId"] = this.playerSkipBeginSegmentId_;
		result["playerSkipEndSegmentId"] = this.playerSkipEndSegmentId_;
		result["playerSegmentId"] = this.playerSegmentId_;
		result["urgentSegmentId"] = this.urgentSegmentId_;
		result["urgentSegmentEndId"] = this.urgentSegmentEndId_;
		result["urgentIncompleteCount"] = this.urgentIncompleteCount_;
		result["otherPeerRequestCount"] = this.otherPeerRequestCount_;
		result["completedSegmentId"] = this.completedSegmentId_;
		result["downloadedRate"] = this.statData_.urgentReceiveSpeed_;
		// result["downloadedDuration"] = getDownloadedDuration();
		result["downloadedDuration"] = this.statData_.downloadedDuration_;
		result["mediaStartTime"] = this.mediaStartTime_;
		result["metaResponseCode"] = this.metaResponseCode_;
		result["metaResponseDetails"] = this.metaResponseDetails_;
		result["metaResponseType"] = this.metaResponseType_;
		result["peerReceiveTimeout"] = this.peerReceiveTimeout_;
		result["gslbReloadInterval"] = this.gslbReloadInterval_ * 1000;
		result["gslbLoadTime"] = this.gslbLoadTime_;
		result["gslbReloadTimes"] = this.gslbReloadTimes_;
		result["gslbConsumedTime"] = this.gslbConsumedTime_;
		result["checksumLoadTime"] = this.checksumLoadTime_;
		result["metaLoadTime"] = this.metaLoadTime_;
		result["metaReloadTimes"] = this.gslbReloadTimes_;
		result["selfRanges"] = this.selfRanges_;
		if (needGslbData) {
			result["gslbData"] = this.context_.gslbData_;
		}

		if (simpleMode) {
			return;
		}
		var contextStatus = result["context"] = {};
		this.context_.getAllStatus_(contextStatus);

		var statDataStatus = result["statData"] = {};
		this.statData_.getAllStatus_(statDataStatus);

		var metaDataStatus = result["metaData"] = {};
		this.metaData_.getAllStatus_(segmentStartWithPlayer ? this.urgentSegmentId_ : -1, maxDuration, params, metaDataStatus);

		var reportTrafficStatus = result["reportTraffic"] = {};
		this.reportTraffic_.getAllStatus_(reportTrafficStatus);

		var resultStablePeers = result["stablePeers"] = [];
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var peer = this.stablePeers_[n];
			var stablePeersStatus = resultStablePeers[n] = {};
			peer.getAllStatus_(stablePeersStatus);
		}

		var resultOtherPeers = result["otherPeers"] = [];
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var peer = this.otherPeers_[n];
			var otherPeersStatus = resultOtherPeers[n] = {};
			peer.getAllStatus_(otherPeersStatus);
		}
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.logic.base.Manager, {
	getAllStatus_ : function(params, result) {
		var jsonManager = result["manager"] = {};
		jsonManager["defaultMultiMode"] = this.defaultMultiMode_;
		jsonManager["channelCapacity"] = this.channelCapacity_;
		jsonManager["downloadCapacity"] = this.downloadCapacity_;
		jsonManager["downloadParallelCount"] = this.downloadParallelCount_;
		// jsonManager["authSynced"] = authorization_.synced();
		// jsonManager["authSyncedSuccess"] = authorization_.syncedSuccess();
		// jsonManager["authServerTimeNow"] = authorization_.serverTimeNow();
		// jsonManager["authRemoteServerTime"] = authorization_.remoteServerTime();
		// jsonManager["authAbsoluteCdeTime"] = authorization_.absoluteCdeTime();
		// jsonManager["authLocalCdeTime"] = authorization_.localCdeTime();
		// jsonManager["authTimeDiff"] = authorization_.timeDiff();
		// jsonManager["playedHistoryCount"] = playedHistoryKeys_.size();

		var jsonChannels = result["channels"] = [];

		for ( var n = 0; n < this.channels_.length; n++) {
			var channel = this.channels_.element(n).value;
			var channelTemp = jsonChannels[n] = {};
			channel.getAllStatus_(params, channelTemp);
		}
		// for( logic::base::ChannelPtrList::const_iterator itr = downloads_.begin(); itr != downloads_.end(); itr ++ )
		// {
		// const logic::base::ChannelPtr &channel = (*itr);
		// channel->getAllStatus_(params, jsonChannels[jsonChannels.size()]);
		// }
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.logic.base.Peer, {
	getAllStatus_ : function(result) {
		result["name"] = this.session_.getName_();
		result["type"] = this.session_.getManager_().getTypeName_();
		result["remoteId"] = this.session_.getRemoteId_();
		result["remoteAddress"] = this.session_.getRemoteAddress_();
		result["remoteType"] = this.session_.getRemoteType_();
		result["lastReceiveSpeed"] = this.lastReceiveSpeed_;
		result["lastReceiveTime"] = this.lastReceiveTime_;
		result["lastSendTime"] = this.lastSendTime_;
		result["pendingRequestCount"] = this.pendingRequestCount_;
		result["totalReceiveBytes"] = this.totalReceiveBytes_;
		result["totalReceivePieces"] = this.totalReceivePieces_;
		result["totalSendBytes"] = this.totalSendBytes_;
		result["totalSendPieces"] = this.totalSendPieces_;
		result["totalChecksumErrors"] = this.totalChecksumErrors_;
		result["totalInvalidErrors"] = this.totalInvalidErrors_;
		result["totalSendRanges"] = this.totalSendRanges_;
		result["totalSendRequests"] = this.totalSendRequests_;
		result["totalSendResponses"] = this.totalSendResponses_;
		result["totalReceiveRanges"] = this.totalReceiveRanges_;
		result["totalReceiveRequests"] = this.totalReceiveRequests_;
		result["totalReceiveResponses"] = this.totalReceiveResponses_;
		result["selfRanges"] = this.selfRanges_;
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.logic.base.StatData, {
	getAllStatus_ : function(result) {
		result["totalSendPieces"] = this.totalSendPieces_;
		result["totalSendBytes"] = this.totalSendBytes_;
		result["actualSendPieces"] = this.actualSendPieces_;
		result["actualSendBytes"] = this.actualSendBytes_;
		result["totalReceivePieces"] = this.totalReceivePieces_;
		result["totalReceiveBytes"] = this.totalReceiveBytes_;
		result["actualReceivePieces"] = this.actualReceivePieces_;
		result["actualReceiveBytes"] = this.actualReceiveBytes_;
		result["urgentReceiveBytes"] = this.urgentReceiveBytes_;
		result["lastReceiveBytes"] = this.lastReceiveBytes_;

		result["shareSendRatio"] = this.shareSendRatio_;
		result["shareReceiveRatio"] = this.shareReceiveRatio_;

		result["avgSendSpeed"] = this.avgSendSpeed_;
		result["avgReceiveSpeed"] = this.avgReceiveSpeed_;
		result["urgentReceiveSpeed"] = this.urgentReceiveSpeed_;
		result["lastReceiveSpeed"] = this.lastReceiveSpeed_;
		result["restrictedSendSpeed"] = this.restrictedSendSpeed_;

		result["totalReceiveDuration"] = this.totalReceiveDuration_;
		result["downloadedDuration"] = this.downloadedDuration_;
		result["totalPlayedBytes"] = this.totalPlayedBytes_;
		result["totalPlayedPieces"] = this.totalPlayedPieces_;
		result["totalPlayedDuration"] = this.totalPlayedDuration_;

		var protocolValues = result["protocols"] = [];
		var ptypes = p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES;
		for ( var type = ptypes.kProtocolTypeReserved + 1; type < ptypes.kProtocolTypeMax; type++) {
			var protocolItem = protocolValues[type] = {};
			protocolItem["totalSendPieces"] = this.protocolReceivePieces_[type];
			protocolItem["totalSendBytes"] = this.protocolSendBytes_[type];
			protocolItem["totalReceivePieces"] = this.protocolReceivePieces_[type];
			protocolItem["totalReceiveBytes"] = this.protocolReceiveBytes_[type];
			protocolItem["shareSendRatio"] = this.protocolReceiveBytes_[type] > 0 ? (this.protocolSendBytes_[type] / this.protocolReceiveBytes_[type]) : 0;
			protocolItem["shareReceiveRatio"] = this.totalReceiveBytes_ > 0 ? (this.protocolReceiveBytes_[type] / this.totalReceiveBytes_) : 0;
		}
	}
});

CdeBaseClass.apply(p2p$.com.webp2p.tools.collector.ClientTraffic, {
	getAllStatus_ : function(result) {
		result["playing"] = this.playing_;
		result["downloadSizeFromCdn"] = this.downloadSizeFromCdn_;
		result["downloadSizeByRtmfp"] = this.downloadSizeByRtmfp_;
		result["downloadSizeByRtmfpFromPc"] = this.downloadSizeByRtmfpFromPc_;
		result["downloadSizeByRtmfpFromTv"] = this.downloadSizeByRtmfpFromTv_;
		result["downloadSizeByRtmfpFromBox"] = this.downloadSizeByRtmfpFromBox_;
		result["downloadSizeByRtmfpFromMobile"] = this.downloadSizeByRtmfpFromMobile_;
		result["downloadSizeByWebsocket"] = this.downloadSizeByWebsocket_;
		result["downloadSizeByWebsocketFromPc"] = this.downloadSizeByWebsocketFromPc_;
		result["downloadSizeByWebsocketFromTv"] = this.downloadSizeByWebsocketFromTv_;
		result["downloadSizeByWebsocketFromBox"] = this.downloadSizeByWebsocketFromBox_;
		result["downloadSizeByWebsocketFromMobile"] = this.downloadSizeByWebsocketFromMobile_;
		result["downloadSizeByWebrtc"] = this.downloadSizeByWebsocket_;
		result["downloadSizeByWebrtcFromPc"] = this.downloadSizeByWebrtcFromPc_;
		result["downloadSizeByWebrtcFromTv"] = this.downloadSizeByWebrtcFromTv_;
		result["downloadSizeByWebrtcFromBox"] = this.downloadSizeByWebrtcFromBox_;
		result["downloadSizeByWebrtcFromMobile"] = this.downloadSizeByWebrtcFromMobile_;

		result["avgRtmfpNodes"] = this.avgRtmfpNodes_;
		result["avgRtmfpSessions"] = this.avgRtmfpSessions_;
		result["avgWebSocketNodes"] = this.avgWebSocketNodes_;
		result["avgWebSocketSessions"] = this.avgWebSocketSessions_;
		result["avgWebrtcNodes"] = this.avgWebrtcNodes_;
		result["avgWebrtcSessions"] = this.avgWebrtcSessions_;

		result["totalRtmfpNodes"] = this.totalRtmfpNodes_;
		result["totalRtmfpSessions"] = this.totalRtmfpSessions_;
		result["totalWebSocketNodes"] = this.totalWebSocketNodes_;
		result["totalWebSocketSessions"] = this.totalWebSocketSessions_;
		result["totalWebrtcNodes"] = this.totalWebrtcNodes_;
		result["totalWebrtcSessions"] = this.totalWebrtcSessions_;

		result["rtmfpNodeTimes"] = this.rtmfpNodeTimes_;
		result["rtmfpSessionTimes"] = this.rtmfpSessionTimes_;
		result["webSocketNodeTimes"] = this.webSocketNodeTimes_;
		result["webSocketSessionTimes"] = this.webSocketSessionTimes_;
		result["webrtcNodeTimes"] = this.webrtcNodeTimes_;
		result["webrtcSessionTimes"] = this.webrtcSessionTimes_;

		result["uploadSizeByRtmfp"] = this.uploadSizeByRtmfp_;
		result["uploadSizeByWebsocket"] = this.uploadSizeByWebsocket_;
		result["uploadSizeByWebrtc"] = this.uploadSizeByWebrtc_;

		result["checksumSuccessCount"] = this.checksumSuccessCount_;
		result["checksumErrorsByCdn"] = this.checksumErrorsByCdn_;
		result["checksumErrorsByRtmfp"] = this.checksumErrorsByRtmfp_;
		result["checksumErrorsByWebsocket"] = this.checksumErrorsByWebsocket_;
		result["checksumErrorsByWebrtc"] = this.checksumErrorsByWebrtc_;
		result["checksumErrorsByUnknown"] = this.checksumErrorsByUnknown_;

		result["updated"] = this.updated_;
		result["nodesReset"] = this.nodesReset_;
		result["updateTime"] = this.updateTime_;
		result["lastFlushTime"] = this.lastFlushTime_;
	}
});

if (p2p$.com.webp2p.tools.collector.SupportSession) {
	p2p$.com.webp2p.tools.collector.SupportSession.getAllStatus_ = function(result) {
		result["errorCode"] = this.serverErrorCode_;
		result["serviceNumber"] = this.serviceNumber_;
		result["sessionActiveTime"] = this.sessionActiveTime_;
		result["sessionServerTime"] = this.sessionServerTime_;
		result["sessionExpireTime"] = this.sessionExpireTime_;
		result["reportInterval"] = this.reportInterval_;
		result["lastPipeLogTime"] = this.lastPipeLogTime_;
		result["lastSubmitTime"] = this.lastSubmitTime_;
		result["totalSubmitTimes"] = this.totalSubmitTimes_;
	};
}
p2p$.ns('com.webp2p.tools.console');

p2p$.com.webp2p.tools.console.Index = {

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

	start : function() {
		this.params_ = {};
		this.refreshLimitCount_ = 1000;
		this.videoStream_ = p2p$.com.webp2p.core.entrance.VideoStream;
		if (this.params_['limitrc']) {
			this.refreshLimitCount_ = parseInt(this.params_['limitrc']);
		}
		var me = this;
		$("#cde-online-status").click(function() {
			me.onOnlineClick_();
		});
		this.startTimer_();

		this.ipHelper_ = new p2p$.com.webp2p.tools.console.IpHelper({});
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
			$("#cde-online-status").html("正在连接 ...");
			$("#cde-online-status").css("color", "red");
		} else {
			this.paused_ = true;
			$("#cde-online-status").html("已暂停");
			$("#cde-online-status").css("color", "red");
		}
	},

	onTimer_ : function() {
		this.loadAjaxData_();
		this.refreshNowCount_++;
		if (this.refreshNowCount_ >= this.refreshLimitCount_) {
			// auto pause
			this.stopTimer_();
			this.paused_ = true;
			$("#cde-online-status").html("已自动暂停，点击继续刷新");
			$("#cde-online-status").css("color", "red");
		}
	},

	loadAjaxData_ : function() {
		var data = this.videoStream_.requestStateCurrent_("state/current?needCurrentProcess=1&segmentStartWithPlayer="
				+ this.statusParams_.segmentStartWithPlayer_ + "&maxDuration=1500");
		this.onAjaxDataResult_(data);

		$("#cde-online-status").html("已连接 - " + (this.refreshLimitCount_ - this.refreshNowCount_));
		$("#cde-online-status").css("color", "green");
	},

	onAjaxDataResult_ : function(data) {
		this.statusData_ = typeof (data) == 'string' ? eval('(' + data + ')') : data;
		$('#cde-module-version').html(this.statusData_.module.version + '/Build ' + this.statusData_.module.buildTime);
		$('#cde-current-time').html(p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', this.statusData_.system.currentTime * 1000));
		// $('#cde-resolution-time').html(p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', Math.floor((this.statusData_.system.resolutionTime || 0) /
		// 1000)));
		// $('#cde-system-startup-time').html(this.statusData_.system.startupTime ? p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s',
		// this.statusData_.system.startupTime * 1000)
		// : '-');
		// $('#cde-module-startup-time').html(this.statusData_.system.startupTime ? p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s',
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
				channel = new p2p$.com.webp2p.tools.console.Channel(itemData, this.videoStream_);
				channel.create(++this.nextChannelIndex_, $("#cde-channels-layer"));
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
		$dom = $('#cde-system-status-more-1');
		var statChildren = $dom.find(".row");
		var osStatusDom = $(statChildren[0]);
		var doms = osStatusDom.find(".value");

		if (data.cpu && data.memory) {
			$(doms[offset + 0]).html((data.cpu.usagePercent || 0).toFixed(1) + '%');
			$(doms[offset + 1]).html(data.cpu.coreCount);
			$(doms[offset + 2]).html((data.memory.usagePercent || 0).toFixed(1) + '%');
			$(doms[offset + 3]).html(p2p$.com.webp2p.core.utils.Utils.size(data.memory.totalBytes));
		}
		offset += 4;

		if (data.memory && data.process) {
			var processMemoryUsage = data.process.physicalMemorySize * 100 / data.memory.totalBytes;
			$(doms[offset + 0]).html((data.process.usagePercent || 0).toFixed(1) + '%');
			$(doms[offset + 1]).html(processMemoryUsage.toFixed(1) + '%');
			$(doms[offset + 2]).html(p2p$.com.webp2p.core.utils.Utils.size(data.process.physicalMemorySize));
		}
		offset += 3;

		if (data.storage && data.storage['default']) {
			var defaultInfo = data.storage['default'];
			var usagePercent = (defaultInfo.dataSize * 100 / defaultInfo.dataCapacity);
			$(doms[offset + 0]).html(defaultInfo.name.substr(0, 1).toUpperCase());
			$(doms[offset + 1]).html(usagePercent.toFixed(1) + '%');
			$(doms[offset + 2]).html(p2p$.com.webp2p.core.utils.Utils.size(defaultInfo.dataSize));
			$(doms[offset + 3]).html(p2p$.com.webp2p.core.utils.Utils.size(defaultInfo.dataCapacity));
		}
		offset += 4;

		$dom = $('#cde-system-status-more-2');
		var statChildren = $dom.find(".row");
		var osStatusDom = $(statChildren[0]);
		var doms = osStatusDom.find(".value");

		offset = 0;
		if (root.channels) {
			$(doms[offset + 0]).html(root.channels.length);
			// $(doms[offset + 1]).html(root.enviroment.hlsServerPort);
		}
		offset += 2;

		if (root.enviroment) {
			$(doms[offset + 0]).html(root.enviroment.clientGeo + "/" + root.enviroment.clientIp);
			$(doms[offset + 1]).html(root.enviroment.deviceType);
			$(doms[offset + 2]).html((root.enviroment.osType + '').toUpperCase());
			$(doms[offset + 3]).html(this.getNetworkTypeName_(root.enviroment.networkType));
			$(doms[offset + 4]).html(root.enviroment.p2pEnabled ? 'Yes' : 'No');
			$(doms[offset + 5]).html(root.enviroment.externalAppId);
			$(doms[offset + 6]).html(root.enviroment.externalAppVersion);
			$(doms[offset + 7]).html(root.enviroment.externalAppChannel);
			$(doms[offset + 8]).html(root.enviroment.externalAppPackageName || '-');
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
};p2p$.ns('com.webp2p.tools.console');

p2p$.com.webp2p.tools.console.Channel = CdeBaseClass.extend_({
	index : 0,
	parent : null,
	dom : null,
	elements_ : null,
	property : null,
	peers : null,
	peerHeaders_ : null,
	segments : null,
	pieces : null,

	init : function(data, videoStream) {
		this.property = data;
		this.videoStream_ = videoStream;
	},

	create : function(index, parent) {
		this.index = index;
		if (this.dom) {
			this.destroy();
		}

		this.peerHeaders_ = [ {
			title : "名称",
			fieldIndex : "name"
		} ];

		this.peers = {};
		this.segments = {};
		this.pieces = [];
		this.parent = parent;
		this.dom = $('<div id="channel-' + this.property.id + '" class="channel-item" />');
		this.parent.append(this.dom);
		this.createElements_();
	},

	destroy : function() {
		if (this.dom) {
			this.dom.remove();
			this.dom = null;
		}
	},

	getTypeName_ : function() {
		switch (this.property.type) {
		case 'vod':
			return '点播';
		case 'live':
			return '直播';
		case 'stream':
			return '实时';
		case 'download':
			return '下载';
		default:
			return '未知';
		}
	},

	createElements_ : function() {
		this.elements_ = {
			title : $(p2p$.com.webp2p.core.utils.Utils.format(
					'<div id="channel-title" class="title" title="播放 URL: {0}"><a href="{1}" title="查看 M3U8" target="_blank">{2}频道 {3}</a>'
							+ ' <a title="关闭该频道" class="click-link">X</a>: {4}</div>', this.property.channelUrl, p2p$.com.webp2p.core.utils.Utils.format(
							'http://{0}{1}', p2p$.com.webp2p.tools.console.Index.host, (this.property.channelPlayUrl || '').replace(/debug=0/g, 'debug=1')),
					this.getTypeName_(), this.index, p2p$.com.webp2p.core.utils.Utils.htmlEscape_((this.property.directMetaMode ? this.property.channelUrl
							: this.property.gslbEncryptUrl)
							|| this.property.channelUrl))),
			info : $('<div class = "info" />'),
			statData : $('<table class="stat" border="0">' + '<tr><td colspan="18" class="title">传输统计</td></tr>' + '<tr class="row">'
					+ '<td class="prefix">下载数据:</td><td class="value" colspan="4"></td>' + '<td class="prefix">上传数据:</td><td class="value" colspan="4"></td>'
					+ '<td class="prefix">P2P 下载率:</td><td class="value" colspan="1"></td>'
					+ '<td class="prefix" align="right">参数:</td><td class="value" colspan="2" title="Fetch Rate  % / 最大连接节点 / 紧急区时长 / P2P.P2P-UIC "></td>'
					+ '<td class="prefix">上传比:</td><td class="value" colspan="1"></td>' + '</tr><tr class="row">'
					+ '<td class="prefix protocol-cdn">CDN:</td> <td class="prefix2">下载:</td><td class="value"></td> '
					+ '<td class="prefix2"></td><td class="value" style="padding-right:20px;"></td>'
					+ '<td class="prefix protocol-webrtc">WebRTC:</td> <td class="prefix2">下载:</td><td class="value"></td> '
					+ '<td class="prefix2">上传:</td><td class="value" style="padding-right:20px;"></td>'
					+ '<td class="prefix protocol-websocket">SOCKET:</td> <td class="prefix2">下载:</td><td class="value"></td> '
					+ '<td class="prefix2">上传:</td><td class="value" style="padding-right:20px;"></td>' + '<td class="prefix"></td><td></td><td></td>'
					+ '</tr></table>'),
			pieces : $('<div class="pieces"><div class="switch-wrapper"><span class="switch-btn"></span></div></div>'),
			segments : $("<table class='segments' >" + "<tr><td colspan='9' class='title'><span>分片(TS)列表 (从紧急区位置开始 5 个)</span><td></tr>"
					+ "<tr class='header'>" + "<th>ID</th> <th>大小</th> <th>开始时间</th> <th>时长 (s)</th> <th>平均码率</th> <th>下载速度</th> <th>最后下载时间</th>"
					+ "<th>等待 / 已下载 / PIECE</th> <th>完成比例</th>" + "</tr></table>"),
			peers : $("<table class='peers' >" + "<tr class='title'><td colspan='13'>节点列表 (<span class='peer-type-stats'>...</span>)</td></tr>"
					+ "<tr class='header'>" + "<th>名称</th> <th>类型</th> <th>节点 ID / QoS</th> <th>IP 地址</th> <th>位置</th> <th>下载速度</th> "
					+ "<th>最后下载时间</th> <th>下载数据量</th> <th>下载 PIECE</th> <th>上传数据量</th> <th>上传 PIECE</th>" + "<th>队列 / 响应 / 请求 / 消息</th> <th>错误: 校验/所有</th>"
					+ "</tr></table>")
		};
		for ( var name in this.elements_) {
			this.dom.append(this.elements_[name]);
		}

		var delegate = this;
		var page = p2p$.com.webp2p.tools.console.Index;
		var switchWrapper = this.elements_.pieces.children('.switch-wrapper');
		var switchBtn = switchWrapper.children('.switch-btn');
		switchBtn.click(function() {
			page.statusParams_.segmentStartWithPlayer_ = page.statusParams_.segmentStartWithPlayer_ ? 0 : 1;
			delegate.reset(switchBtn, page.statusParams_.segmentStartWithPlayer_);
			page.onTimer_();
		});
		this.reset(switchBtn, page.statusParams_.segmentStartWithPlayer_);

		var closeLink = $(this.elements_.title.find(".click-link"));
		closeLink.click(function() {
			delegate.closeRemoteChannel_();
		});
	},

	reset : function(switchBtn, segmentStartWithPlayer_) {
		switchBtn.html(segmentStartWithPlayer_ ? '显示所有片段' : '从播放器位置显示');
		if (this.pieces) {
			for ( var i = 0; i < this.pieces.length; i++) {
				this.pieces[i].remove();
			}
		}
		this.pieces = [];

		if (this.peers) {
			for ( var id in this.peers) {
				this.peers[id].remove();
			}
			this.peers = {};
		}
	},

	update : function(data) {
		this.property = data;
		this.updateInfo_();
		this.updateStatData_();
		this.updatePieces_();
		this.updateSegments_();
		this.updatePeers_();
	},

	updateInfo_ : function() {
		var streamName = this.property.liveStreamId || '';
		if (this.property.type != 'live') {
			var channelParams = p2p$.com.webp2p.core.utils.Utils.getUrlParams_(this.property.channelUrl);
			streamName = this.getVideoRateName_(channelParams['vtype']) || channelParams['rateid'];
		}

		// var gslbErrorDetails = this.property.gslbServerErrorDetails || this.getGslbErrorDetails_(this.property.gslbServerErrorCode,
		// this.property.gslbServerErrorDetails);
		var gslbErrorDetails = this.getGslbErrorDetails_(this.property.gslbServerErrorCode, this.property.gslbServerErrorDetails);
		var htmls = p2p$.com.webp2p.core.utils.Utils.format('<table>' + '<tr><td class="prefix">频道 ID:</td><td class="name" title="{1}">{0}</td></tr>'
				+ '<tr><td class="prefix">创建时间:</td><td>{2}, <span class="extra">P2P Tracker:</span> {20}, '
				+ '  <span class="extra">Webrtc:</span> {21} <span class="extra" title="{22}">Peer ID:</span> {23}</td></tr>'
				+ '<tr><td class="prefix">最后活跃时间:</td><td>{3} <span class="extra">(与播放器交互)</span>, '
				+ '  HTTP: {17}, GSLB({31}): {18}/EC:{28}, M3U8({32}): {19}</td></tr>'
				+ '<tr><td class="prefix">打开耗时:</td><td>{4} ms <span class="extra">(GSLB + 第一次 M3U8)</span>, '
				+ '  {30} ms<span class="extra">(GSLB)</span></td></tr>'
				+ '<tr><td class="prefix">当前直播点:</td><td>{5} <span class="extra" title="GAP / M3U8刷新 / TS 跳跃 / 直播时延">(最新) GAP:</span> {29} 秒 '
				+ '  <span class="extra">GSLB 加载: </span>{24}, <span class="extra">重新调度: </span>{25} 分钟后</td></tr>'
				+ '<tr><td class="prefix">M3U8 信息 1:</td><td><span class="extra">加载: </span>{26}, 当前 {6} 个 TS，'
				+ '  <span class="extra">范围: </span>{7} ~ {8}, {9} 个已完成, {10} 个正在下载, {11} 个可见, 共 {12} 秒</td></tr>'
				+ '<tr><td class="prefix">M3U8 信息 2:</td><td>{13} 个 PIECE, <span class="extra">P2P Group ID:</span> {14}, '
				+ '  <span class="extra">Stream ID/Rate:</span> {27}</td></tr>'
				+ '<tr><td class="prefix">播放器:</td><td>正在请求 TS {15}, <span class="extra">第一次起播时间:</span> '
				+ '  {16}, UIC: {33}::{34}, <span title="P2P 正在下载 PIECE 数量">{35}P</span></tr>' + '</table>', this.property.id
				+ (this.property.context.drmEnabled ? ' - <i>DRM</i>' : '') + (this.property.paused ? ' - 已暂停' : ''), this.property.selfRanges,
				p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', this.property.createTime), p2p$.com.webp2p.core.utils.Utils.formatDate_(
						'Y-m-d H:i:s', this.property.activeTime), this.property.channelOpenedTime > 0 ? Math
						.round((this.property.channelOpenedTime - this.property.createTime)) : '-', p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s',
						this.property.livePseudoPlayTime * 1000), this.property.metaData.segmentCount, this.property.metaData.segmentFirstId,
				this.property.metaData.segmentLastId, this.property.metaData.segmentCompletedCount, this.property.metaData.segmentCompletingCount,// 10
				this.property.metaData.segmentDisplayCount, Math.round(this.property.metaData.segmentDisplayDuration / 1000),
				this.property.metaData.pieceCount, this.property.metaData.p2pGroupId, this.property.urgentSegmentId + '/' + this.property.playerSegmentId,
				p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', this.property.mediaStartTime), p2p$.com.webp2p.core.utils.Utils.format(
						'<span class="{0}">{1}</span>', this.property.metaResponseCode == 200 ? 'status-ok' : 'status-error', this.property.metaResponseCode),
				p2p$.com.webp2p.core.utils.Utils.format('<span class="{0}">{1}</span>', this.property.gslbServerResponseCode == 200 ? 'status-ok'
						: 'status-error', this.property.gslbServerResponseCode), p2p$.com.webp2p.core.utils.Utils.format('<span class="{0}">{1}</span>',
						this.property.metaServerResponseCode == 200 ? 'status-ok' : 'status-error', this.property.metaServerResponseCode),
				this.property.context ? this.property.context.gatherServerHost : '-', // 20
				this.property.context ? this.property.context.webrtcServerHost : '-', this.property.context ? (this.property.context.p2pWebrtcPeerId || '...')
						: '-', this.property.context ? (this.property.context.p2pWebrtcPeerId || '...') : '-', p2p$.com.webp2p.core.utils.Utils.formatDate_(
						'Y-m-d H:i:s', this.property.gslbLoadTime), this.property.gslbReloadInterval / 1000000 / 60, p2p$.com.webp2p.core.utils.Utils
						.formatDate_('Y-m-d H:i:s', this.property.metaLoadTime), streamName, p2p$.com.webp2p.core.utils.Utils.format(
						'<span class="{0}" title="Error Code">{1}</span>', this.property.gslbServerErrorCode == 0 ? 'status-ok' : 'status-error', [
								this.property.gslbServerErrorCode, gslbErrorDetails ].toString()), (this.property.metaData.totalGapDuration / 1000) + ' / '
						+ (Math.round(this.property.playerFlushInterval / 1000) / 1000) + ' / ' + (this.property.liveSkipSegmentTime / 1000) + ' / '
						+ (this.property.livePlayOffset || '-'), this.property.gslbConsumedTime ? ((this.property.gslbConsumedTime || 0)) : '-',
				this.property.context.gslbServerIp ? this.property.context.gslbServerIp : '...',
				this.property.context.metaServerIp ? this.property.context.metaServerIp : '...',
				typeof (this.property.urgentIncompleteCount) == 'number' ? this.property.urgentIncompleteCount : '-',
				typeof (this.property.urgentSegmentEndId) == 'number' ? this.property.urgentSegmentEndId : '-',
				typeof (this.property.otherPeerRequestCount) == 'number' ? this.property.otherPeerRequestCount : '-');
		this.elements_.info.html(htmls);
	},

	updateStatData_ : function() {
		if (!this.property.statData) {
			return;
		}

		var statChildren = this.elements_.statData.find(".row");
		var allStatDom = $(statChildren[0]);
		var protocolsDom = $(statChildren[1]);

		var uploadSuffix = '';
		if (this.property.context.p2pUploadLimit) {
			uploadSuffix = p2p$.com.webp2p.core.utils.Utils.format('<span title="P2P 上传限制, I:初始值, A:平均值, N:目前值"> / I:{0}, A:{1}, N:{2}</span>',
					p2p$.com.webp2p.core.utils.Utils.speed(this.property.context.p2pUploadThrottleInit, true), p2p$.com.webp2p.core.utils.Utils.speed(
							this.property.context.p2pUploadThrottleAverage, true), p2p$.com.webp2p.core.utils.Utils.speed(
							this.property.statData.restrictedSendSpeed, true));
		}

		var doms = allStatDom.find(".value");
		$(doms[0]).html(p2p$.com.webp2p.core.utils.Utils.size(this.property.statData.totalReceiveBytes));
		$(doms[1])
				.html(
						(this.property.statData.totalSendBytes > 0 ? p2p$.com.webp2p.core.utils.Utils.size(this.property.statData.totalSendBytes) : '-')
								+ uploadSuffix);
		$(doms[2]).html((this.property.statData.shareReceiveRatio * 100).toFixed(1) + '%');
		$(doms[3]).html(
				(this.property.context.p2pFetchRate * 100).toFixed(1) + '% / ' + this.property.context.p2pMaxPeers + ' / '
						+ (this.property.context.p2pUrgentSize || '-') + 's' + ' / ' + (this.property.context.p2pMaxParallelRequestPieces || '-') + '.'
						+ (this.property.context.p2pMaxUrgentRequestPieces || '-'));
		$(doms[4]).html((this.property.statData.shareSendRatio * 100).toFixed(1) + '%');

		$(protocolsDom.find(".protocol-cdn")[0]).css('color', '#aa0000');

		var webRtcName = $(protocolsDom.find(".protocol-webrtc")[0]);
		webRtcName.css('color', this.property.context.webrtcServerConnectedTime > 0 ? 'green' : '');
		webRtcName.attr('title', this.property.context.p2pWebrtcPeerId + "\n" + this.property.selfRanges);

		var websocketName = $(protocolsDom.find(".protocol-websocket")[0]);
		var upnpInfo = p2p$.com.webp2p.core.utils.Utils.format(', UPNP: {0}, Port: {1}/{2}, {3}, {4}', this.property.context.upnpMapSuccess ? 'Yes' : 'No',
				this.property.context.upnpMappedInPort, this.property.context.upnpMappedOutPort, this.property.context.upnpMappedAddress,
				p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', this.property.context.upnpMapCompleteTime / 1000));
		websocketName.css('color', this.property.context.trackerServerConnectedTime > 0 ? '#00bb00' : '');
		websocketName.attr('title', this.property.context.p2pWebsocketPeerId + upnpInfo);

		var doms = protocolsDom.find(".value");
		for ( var type = 0; type < 4; type++) {
			var pdata = this.property.statData.protocols[type + 1];
			if (!pdata) {
				continue;
			}
			//
			var temp = type;
			if (type == 3) {
				temp = 1;
			}
			$(doms[temp * 2]).html(
					p2p$.com.webp2p.core.utils.Utils.format('{0}, {1}%', p2p$.com.webp2p.core.utils.Utils.size(pdata.totalReceiveBytes),
							(pdata.shareReceiveRatio * 100).toFixed(1)));
			if (temp > 0) // not cdn
			{
				$(doms[temp * 2 + 1]).html(
						p2p$.com.webp2p.core.utils.Utils.format('{0}, {1}%', p2p$.com.webp2p.core.utils.Utils.size(pdata.totalSendBytes),
								(pdata.shareSendRatio * 100).toFixed(1)));
			}
		}
	},

	updatePieces_ : function() {
		var pieceCount = 0;
		var page = p2p$.com.webp2p.tools.console.Index;
		var segments = this.property.metaData.segments;
		for ( var i = 0; i < segments.length; i++) {
			var segment = segments[i];
			pieceCount += (segment.pieceCount + 1);
			if (pieceCount > 1000 && page.statusParams_.segmentStartWithPlayer_) {
				break;
			}
		}
		if (this.pieces.length < pieceCount) {
			while (this.pieces.length < pieceCount) {
				var el = $('<div class="piece-units">&nbsp;</div>');
				this.pieces.push(el);
				this.elements_.pieces.append(el);
			}
		}
		var pieceIndex = 0;
		for ( var i = 0; i < segments.length; i++) {
			var segment = segments[i];
			if (pieceIndex < this.pieces.length) {
				var dom = this.pieces[pieceIndex];
				dom.html(p2p$.com.webp2p.core.utils.Utils.format('<span>{0}</span>', segment.id % 10000));
				dom.attr('class', segment.discontinuity ? 'ts-discontinuity' : (segment.beginOfMeta ? 'ts-begin' : 'ts'));
				dom.css('background-color', '');
				pieceIndex++;
			}
			for ( var j = 0; j < segment.pieces.length && pieceIndex < this.pieces.length; j++, pieceIndex++) {
				var piece = segment.pieces[j];
				var color = '#ddd';
				if (piece.completedTime > 0) {
					switch (piece.receiveProtocol) {
					case 1:
						color = '#aa0000';
						break;
					case 2:
					case 4:
						color = 'green';
						break;
					case 3:
						color = '#00aa00';
						break;
					default:
						color = '#000000';
						break;
					}
				} else if (piece.receiveStartTime > 0) {
					if (piece.receiveByStable) {
						color = 'blue';
					} else {
						color = 'orange';
					}
				} else if (piece.shareInRanges > 0) {
					color = '#ffdddd'; // pink';
				}
				var dom = this.pieces[pieceIndex];
				dom.html(piece.playedTime > 0 ? '*' : '&nbsp;');
				dom.attr('class', 'piece-units');
				dom.css('background-color', color);
				dom.attr('title', p2p$.com.webp2p.core.utils.Utils.format('{0}/{1}/{2}, Share In Ranges: {3}', segment.id, piece.type == 0 ? 'tn' : 'pn',
						piece.id, piece.shareInRanges));
			}
		}

		while (pieceIndex < this.pieces.length) {
			var dom = this.pieces[pieceIndex];
			dom.html('');
			dom.attr('class', 'blank');
			dom.css('background-color', '');
			pieceIndex++;
		}
	},

	updateSegments_ : function() {
		for ( var id in this.segments) {
			var item = this.segments[id];
			item.__removeMarked = true;
		}

		var inPeusdoTime = true;
		var displayCount = 0;
		var segments = this.property.metaData.segments;
		for ( var i = 0; segments && i < segments.length && displayCount < 5; i++) {
			var info = segments[i];
			if (info.id < this.property.urgentSegmentId) {
				continue;
			}
			var dom = this.segments[info.id];
			if (!dom) {
				dom = $('<tr class="row" id="segment-item-' + info.id + '">' + '<td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>'
						+ '<td></td> <td></td>' + '</tr>');
				this.elements_.segments.append(dom);
				this.segments[info.id] = dom;
			}
			dom.__removeMarked = false;
			// dom.css('background', info.completedSize >= info.size ? 'green' : '#000');
			displayCount++;

			var peusdoMark = '';
			if (this.property.livePseudoPlayTime > 0) {
				peusdoMark = inPeusdoTime ? ' *' : '';
				if (info.startTime > this.property.livePseudoPlayTime * 1000) {
					inPeusdoTime = false;
				}
			}

			var doms = dom.children();
			$(doms[0]).html(info.id); // + (info.id > 1000000 ? (' - ' + p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', info.id * 1000))
			// :
			// ''));
			$(doms[1]).html(p2p$.com.webp2p.core.utils.Utils.size(info.size || 0));
			$(doms[2]).html(
					(info.startTime > 86400000 ? p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', info.startTime) : p2p$.com.webp2p.core.utils.Utils
							.formatDuration_(info.startTime / 1000))
							+ peusdoMark);
			$(doms[3]).html(info.duration / 1000);
			$(doms[4]).html(info.size > 0 ? p2p$.com.webp2p.core.utils.Utils.speed(info.size * 1000 / info.duration, true) : '-');
			$(doms[5]).html((info.receiveSpeed > 0) ? p2p$.com.webp2p.core.utils.Utils.speed(info.receiveSpeed, true) : '-');
			$(doms[6]).html(
					(info.lastReceiveTime && info.lastReceiveTime > 0) ? p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', info.lastReceiveTime)
							: '-');
			$(doms[7]).html((info.pendingPieceCount || 0) + ' / ' + info.completedPieceCount + ' / ' + info.pieceCount);
			$(doms[8]).html(Math.round(info.completedSize * 100 / info.size) + '%');
		}

		for ( var id in this.segments) {
			var item = this.segments[id];
			if (item.__removeMarked) {
				item.remove();
				delete this.segments[id];
			}
		}
	},

	updatePeers_ : function() {
		for ( var id in this.peers) {
			var item = this.peers[id];
			item.__removeMarked = true;
		}

		var ipHelper = p2p$.com.webp2p.tools.console.Index.ipHelper_;
		var peerTypeCounts = {};
		var allPeers = this.property.stablePeers ? this.property.stablePeers.concat(this.property.otherPeers || []) : [];
		for ( var i = 0; i < allPeers.length; i++) {
			var info = allPeers[i];
			var dom = this.peers[info.remoteId];
			if (!dom) {
				dom = $('<tr class="row" id="peer-item-' + info.remoteId + '">' + '<td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>'
						+ '<td></td> <td></td> <td></td> <td></td> <td></td> <td></td>' + '</tr>');
				this.elements_.peers.append(dom);
				this.peers[info.remoteId] = dom;
			}
			dom.__removeMarked = false;

			peerTypeCounts[info.type] = (peerTypeCounts[info.type] || 0) + 1;

			var fullPeerName = info.name || info.remoteType || '';
			var displayPeerName = fullPeerName;
			if (displayPeerName.length > 10 && displayPeerName.indexOf('/') > 0) {
				var peerNames = displayPeerName.split('/');
				if (peerNames[0].length > 10) {
					peerNames[0] = peerNames[0].substr(0, 8) + '...';
				}
				displayPeerName = peerNames.join('/');
			}

			var doms = dom.children();
			var col = 0;
			$(doms[col++]).html(displayPeerName);
			$(doms[0]).attr('title', fullPeerName);
			$(doms[col++]).html(info.type);
			$(doms[col]).attr('title', info.remoteId + "\n" + info.selfRanges);
			$(doms[col++]).html(info.type == 'cdn' ? ('QoS: ' + this.getQosFromUrl_(info.remoteId)) : info.remoteId.substr(0, 10) + "...");
			$(doms[col++]).html(info.remoteAddress == "Unknown" ? (info.remoteId.substr(0, 16) + "...") : info.remoteAddress);
			$(doms[col++]).html(ipHelper.getNameByIp_(info.remoteAddress, this.updatePeers_, this));
			$(doms[col++]).html(info.lastReceiveSpeed > 0 ? p2p$.com.webp2p.core.utils.Utils.speed(info.lastReceiveSpeed, true) : '-');
			$(doms[col++]).html(p2p$.com.webp2p.core.utils.Utils.formatDate_('Y-m-d H:i:s', info.lastReceiveTime));
			$(doms[col++]).html(p2p$.com.webp2p.core.utils.Utils.size(info.totalReceiveBytes || 0));
			$(doms[col++]).html(info.totalReceivePieces);
			$(doms[col++]).html(p2p$.com.webp2p.core.utils.Utils.size(info.totalSendBytes || 0));
			$(doms[col++]).html(info.totalSendPieces);
			var totalMessages = info.totalSendRanges + info.totalReceiveRanges + info.totalSendRequests + info.totalReceiveRequests + info.totalSendResponses
					+ info.totalReceiveResponses;
			var messageTitle = p2p$.com.webp2p.core.utils.Utils.format('Range: {0}/{1}, Request: {2}/{3}, Response: {4}/{5}', info.totalSendRanges,
					info.totalReceiveRanges, info.totalSendRequests, info.totalReceiveRequests, info.totalSendResponses, info.totalReceiveResponses);
			$(doms[col]).attr('title', messageTitle);
			$(doms[col++]).html((info.pendingRequestCount || 0) + ' / ' + info.totalReceiveResponses + ' / ' + info.totalSendRequests + ' / ' + totalMessages);
			$(doms[col]).css('color', (info.totalChecksumErrors > 0 || info.totalInvalidErrors > 0) ? 'red' : 'green');
			$(doms[col++]).html(info.totalChecksumErrors + ' / ' + info.totalInvalidErrors);
		}

		for ( var id in this.peers) {
			var item = this.peers[id];
			if (item.__removeMarked) {
				item.remove();
				delete this.peers[id];
			}
		}

		var peerStatText = '';
		for ( var orgType in peerTypeCounts) {
			var type = (orgType || '').toLowerCase();
			var count = peerTypeCounts[type];
			var nodeCount = this.property.context[type + 'TotalNodeCount'];
			if (peerStatText != '') {
				peerStatText += ', ';
			}
			peerStatText += p2p$.com.webp2p.core.utils.Utils.format('{0}: {1}/{2} 个', type, count, (nodeCount > 10000 || !nodeCount) ? '-' : nodeCount);
		}
		var doms = this.elements_.peers.find('span.peer-type-stats');
		$(doms[0]).html(peerStatText);
	},

	getQosFromUrl_ : function(url) {
		if (!url) {
			return '-';
		}
		var pos = url.indexOf('&qos=');
		if (pos < 0) {
			pos = url.indexOf('?qos=');
		}
		if (pos < 0) {
			return '-';
		}
		var end = url.indexOf('&', pos + 5);
		return url.substring(pos + 5, end);
	},

	getGslbErrorDetails_ : function(code, orgDetails) {
		var details = {
			'-1' : '等待中',
			0 : '正常',
			200 : 'HTTP 200',
			302 : 'HTTP Moved',
			400 : '无法计算出可用CDN节点',
			403 : '禁止访问',
			404 : '文件未找到',
			413 : '直播流名称不存在',
			414 : '用户所在国家不允许直播',
			415 : '用户所在省份不允许直播',
			416 : '请求的子平台ID不在保留平台,不允许直播',
			417 : '请求被配置为黑名单,不允许在此平台播放',
			418 : '请求参数不完整，缺少format,expect参数',
			419 : '请求参参数不合法,非法参数:platid, splatid',
			420 : '文件名错误, Base64解密到了错误的文件名',
			421 : '盗链请求, 被屏蔽',
			422 : '请求被服务器拒绝/屏蔽',
			423 : '请求参数不完整, 缺少tm,key,mmsid参数',
			424 : 'URL已过期',
			425 : 'URL校验不通过, MD5错误',
			426 : '请求参数不符合规范：format/expetct/platid/splatid',
			427 : '会员/付费的 token 验证失败',
			428 : 'LinkShell 防盗链时间过期',
			429 : 'LinkShell 防盗链验证失败',
			430 : '直播流在此平台不允许播放',
			431 : 'Cookie验证错误',
			432 : 'LinkShell防盗链验证,MAC被加入了黑名单'
		};
		return details[code] || orgDetails || '未知错误';
	},

	getVideoRateName_ : function(type) {
		var vtypes = {
			1 : 'flv_350',
			2 : '3gp_320X240',
			3 : 'flv_enp',
			4 : 'chinafilm_350',
			8 : 'flv_vip',
			9 : 'mp4',
			10 : 'flv_live',
			11 : 'union_low',
			12 : 'union_high',
			13 : 'mp4_800',
			16 : 'flv_1000',
			17 : 'flv_1300',
			18 : 'flv_720p',
			19 : 'mp4_1080p',
			20 : 'flv_1080p6m',
			21 : 'mp4_350',
			22 : 'mp4_1300',
			23 : 'mp4_800_db',
			24 : 'mp4_1300_db',
			25 : 'mp4_720p_db',
			26 : 'mp4_1080p6m_db',
			27 : 'flv_yuanhua',
			28 : 'mp4_yuanhua',
			29 : 'flv_720p_3d',
			30 : 'mp4_720p_3d',
			31 : 'flv_1080p6m_3d',
			32 : 'mp4_1080p6m_3d',
			33 : 'flv_1080p_3d',
			34 : 'mp4_1080p_3d',
			35 : 'flv_1080p3m',
			44 : 'flv_4k',
			45 : 'flv_4k_265',
			46 : 'flv_3m_3d',
			47 : 'h265_flv_800',
			48 : 'h265_flv_1300',
			49 : 'h265_flv_720p',
			50 : 'h265_flv_1080p',
			51 : 'mp4_720p',
			52 : 'mp4_1080p3m',
			53 : 'mp4_1080p6m',
			54 : 'mp4_4k',
			55 : 'mp4_4k_15m',
			57 : 'flv_180',
			58 : 'mp4_180',
			59 : 'mp4_4k_db',
			68 : 'baseline_marlin',
			69 : 'baseline_access',
			70 : '180_marlin',
			71 : '180_access',
			72 : '350_marlin',
			73 : '350_access',
			74 : '800_marlin',
			75 : '800_access',
			76 : '1300_marlin',
			77 : '1300_access',
			78 : '720p_marlin',
			79 : '720p_access',
			80 : '1080p3m_marlin',
			81 : '1080p3m_access',
			82 : '1080p6m_marlin',
			83 : '1080p6m_access',
			84 : '1080p15m_marlin',
			85 : '1080p15m_access',
			86 : '4k_marlin',
			87 : '4k_access',
			88 : '4k15m_marlin',
			89 : '4k15m_access',
			90 : '4k30m_marlin',
			91 : '4k30m_access',
			92 : '800_db_marlin',
			93 : '800_db_access',
			94 : '1300_db_marlin',
			95 : '1300_db_access',
			96 : '720p_db_marlin',
			97 : '720p_db_access',
			98 : '1080p3m_db_marlin',
			99 : '1080p3m_db_access',
			100 : '1080p6m_db_marlin',
			101 : '1080p6m_db_access',
			102 : '1080p15m_db_marlin',
			103 : '1080p15m_db_access',
			104 : '4k_db_marlin',
			105 : '4k_db_access',
			106 : '4k15m_db_marlin',
			107 : '4k15m_db_access',
			108 : '4k30m_db_marlin',
			109 : '4k30m_db_access',
			110 : '720p_3d_marlin',
			111 : '720p_3d_access',
			112 : '1080p3m_3d_marlin',
			113 : '1080p3m_3d_access',
			114 : '1080p6m_3d_marlin',
			115 : '1080p6m_3d_access',
			116 : '1080p15m_3d_marlin',
			117 : '1080p15m_3d_access',
			118 : '4k_3d_marlin',
			119 : '4k_3d_access',
			120 : '4k15m_3d_marlin',
			121 : '4k15m_3d_access',
			122 : '4k30m_3d_marlin',
			123 : '4k30m_3d_access',
			124 : 'mp4_180_logo',
			125 : 'mp4_350_logo',
			126 : 'mp4_800_logo'
		};
		return vtypes[type] || '';
	},

	closeRemoteChannel_ : function() {
		if (!confirm('停止后，播放器可能无法正常播放，确定关闭该频道吗？')) {
			return;
		}
		this.videoStream_.requestPlayStop_(this.property.channelUrl);
	}
});
p2p$.ns('com.webp2p.tools.console');

p2p$.com.webp2p.tools.console.IpHelper = CdeBaseClass.extend_({

	ajaxId_ : 0,
	names_ : null,
	pendingIps_ : null,

	init : function(config) {
		this.names_ = {};
		this.pendingIps_ = [];
	},

	getNameByIp_ : function(ip, callback, scope) {
		if (ip.indexOf(':') >= 0) {
			ip = ip.substr(0, ip.indexOf(':'));
		}
		if (ip.substr(0, 1) == '*') {
			ip = ip.substr(1);
		}
		ip = p2p$.com.webp2p.core.utils.Utils.trim(ip);
		if (this.names_[ip]) {
			return this.names_[ip];
		}

		this.queryIp_(ip, callback, scope);
		return '...';
	},

	queryIp_ : function(ip, callback, scope) {
		if (this.ajaxId_) {
			for (var i = 0; i < this.pendingIps_.length; i++) {
				if (this.pendingIps_[i] == ip) {
					return;
				}
			}
			this.pendingIps_.push(ip);
			return;
		}
		this.queryNext_(ip, callback, scope);
	},

	queryNext_ : function(ip, callback, scope) {
		if (!ip && this.pendingIps_.length == 0) {
			return;
		}

		if (!ip) {
			ip = this.pendingIps_[0];
			this.pendingIps_.shift();
		}

		var delegate = this;
		this.ajaxId_ = $.ajax({
			url : 'http://g3.letv.cn/?format=1&ajax=1&uip=' + ip + '&random=' + Math.random()
		}).done(function(data) {
			if (typeof (data) == 'string') {
				try {
					data = eval('(' + data + ')');
				} catch (e) {
				}
			}
			var name = (data.desc || '-');
			var trimValues = '中国-';
			if (name.substr(0, trimValues.length) == trimValues) {
				name = name.substr(trimValues.length);
			}
			delegate.names_[ip] = name;
			delegate.queryNext_(null, callback, scope);
			if (callback) {
				callback.call(scope);
			}
		}).fail(function() {
			delegate.names_[ip] = '-';
			delegate.queryNext_(null, callback, scope);
			if (callback) {
				callback.call(scope);
			}
		}).always(function() {
			delegate.ajaxId_ = 0;
		});
	}
});
/* pako 0.2.7 nodeca/pako */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.pako=t()}}(function(){return function t(e,a,n){function r(s,h){if(!a[s]){if(!e[s]){var l="function"==typeof require&&require;if(!h&&l)return l(s,!0);if(i)return i(s,!0);var o=new Error("Cannot find module '"+s+"'");throw o.code="MODULE_NOT_FOUND",o}var _=a[s]={exports:{}};e[s][0].call(_.exports,function(t){var a=e[s][1][t];return r(a?a:t)},_,_.exports,t,e,a,n)}return a[s].exports}for(var i="function"==typeof require&&require,s=0;s<n.length;s++)r(n[s]);return r}({1:[function(t,e,a){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;a.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var a=e.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(var n in a)a.hasOwnProperty(n)&&(t[n]=a[n])}}return t},a.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var r={arraySet:function(t,e,a,n,r){if(e.subarray&&t.subarray)return void t.set(e.subarray(a,a+n),r);for(var i=0;n>i;i++)t[r+i]=e[a+i]},flattenChunks:function(t){var e,a,n,r,i,s;for(n=0,e=0,a=t.length;a>e;e++)n+=t[e].length;for(s=new Uint8Array(n),r=0,e=0,a=t.length;a>e;e++)i=t[e],s.set(i,r),r+=i.length;return s}},i={arraySet:function(t,e,a,n,r){for(var i=0;n>i;i++)t[r+i]=e[a+i]},flattenChunks:function(t){return[].concat.apply([],t)}};a.setTyped=function(t){t?(a.Buf8=Uint8Array,a.Buf16=Uint16Array,a.Buf32=Int32Array,a.assign(a,r)):(a.Buf8=Array,a.Buf16=Array,a.Buf32=Array,a.assign(a,i))},a.setTyped(n)},{}],2:[function(t,e,a){"use strict";function n(t,e){if(65537>e&&(t.subarray&&s||!t.subarray&&i))return String.fromCharCode.apply(null,r.shrinkBuf(t,e));for(var a="",n=0;e>n;n++)a+=String.fromCharCode(t[n]);return a}var r=t("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(h){i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(h){s=!1}for(var l=new r.Buf8(256),o=0;256>o;o++)l[o]=o>=252?6:o>=248?5:o>=240?4:o>=224?3:o>=192?2:1;l[254]=l[254]=1,a.string2buf=function(t){var e,a,n,i,s,h=t.length,l=0;for(i=0;h>i;i++)a=t.charCodeAt(i),55296===(64512&a)&&h>i+1&&(n=t.charCodeAt(i+1),56320===(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),i++)),l+=128>a?1:2048>a?2:65536>a?3:4;for(e=new r.Buf8(l),s=0,i=0;l>s;i++)a=t.charCodeAt(i),55296===(64512&a)&&h>i+1&&(n=t.charCodeAt(i+1),56320===(64512&n)&&(a=65536+(a-55296<<10)+(n-56320),i++)),128>a?e[s++]=a:2048>a?(e[s++]=192|a>>>6,e[s++]=128|63&a):65536>a?(e[s++]=224|a>>>12,e[s++]=128|a>>>6&63,e[s++]=128|63&a):(e[s++]=240|a>>>18,e[s++]=128|a>>>12&63,e[s++]=128|a>>>6&63,e[s++]=128|63&a);return e},a.buf2binstring=function(t){return n(t,t.length)},a.binstring2buf=function(t){for(var e=new r.Buf8(t.length),a=0,n=e.length;n>a;a++)e[a]=t.charCodeAt(a);return e},a.buf2string=function(t,e){var a,r,i,s,h=e||t.length,o=new Array(2*h);for(r=0,a=0;h>a;)if(i=t[a++],128>i)o[r++]=i;else if(s=l[i],s>4)o[r++]=65533,a+=s-1;else{for(i&=2===s?31:3===s?15:7;s>1&&h>a;)i=i<<6|63&t[a++],s--;s>1?o[r++]=65533:65536>i?o[r++]=i:(i-=65536,o[r++]=55296|i>>10&1023,o[r++]=56320|1023&i)}return n(o,r)},a.utf8border=function(t,e){var a;for(e=e||t.length,e>t.length&&(e=t.length),a=e-1;a>=0&&128===(192&t[a]);)a--;return 0>a?e:0===a?e:a+l[t[a]]>e?a:e}},{"./common":1}],3:[function(t,e,a){"use strict";function n(t,e,a,n){for(var r=65535&t|0,i=t>>>16&65535|0,s=0;0!==a;){s=a>2e3?2e3:a,a-=s;do r=r+e[n++]|0,i=i+r|0;while(--s);r%=65521,i%=65521}return r|i<<16|0}e.exports=n},{}],4:[function(t,e,a){"use strict";function n(){for(var t,e=[],a=0;256>a;a++){t=a;for(var n=0;8>n;n++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e}function r(t,e,a,n){var r=i,s=n+a;t=-1^t;for(var h=n;s>h;h++)t=t>>>8^r[255&(t^e[h])];return-1^t}var i=n();e.exports=r},{}],5:[function(t,e,a){"use strict";function n(t,e){return t.msg=I[e],e}function r(t){return(t<<1)-(t>4?9:0)}function i(t){for(var e=t.length;--e>=0;)t[e]=0}function s(t){var e=t.state,a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(S.arraySet(t.output,e.pending_buf,e.pending_out,a,t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))}function h(t,e){j._tr_flush_block(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,s(t.strm)}function l(t,e){t.pending_buf[t.pending++]=e}function o(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function _(t,e,a,n){var r=t.avail_in;return r>n&&(r=n),0===r?0:(t.avail_in-=r,S.arraySet(e,t.input,t.next_in,r,a),1===t.state.wrap?t.adler=E(t.adler,e,r,a):2===t.state.wrap&&(t.adler=U(t.adler,e,r,a)),t.next_in+=r,t.total_in+=r,r)}function d(t,e){var a,n,r=t.max_chain_length,i=t.strstart,s=t.prev_length,h=t.nice_match,l=t.strstart>t.w_size-ot?t.strstart-(t.w_size-ot):0,o=t.window,_=t.w_mask,d=t.prev,u=t.strstart+lt,f=o[i+s-1],c=o[i+s];t.prev_length>=t.good_match&&(r>>=2),h>t.lookahead&&(h=t.lookahead);do if(a=e,o[a+s]===c&&o[a+s-1]===f&&o[a]===o[i]&&o[++a]===o[i+1]){i+=2,a++;do;while(o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&u>i);if(n=lt-(u-i),i=u-lt,n>s){if(t.match_start=e,s=n,n>=h)break;f=o[i+s-1],c=o[i+s]}}while((e=d[e&_])>l&&0!==--r);return s<=t.lookahead?s:t.lookahead}function u(t){var e,a,n,r,i,s=t.w_size;do{if(r=t.window_size-t.lookahead-t.strstart,t.strstart>=s+(s-ot)){S.arraySet(t.window,t.window,s,s,0),t.match_start-=s,t.strstart-=s,t.block_start-=s,a=t.hash_size,e=a;do n=t.head[--e],t.head[e]=n>=s?n-s:0;while(--a);a=s,e=a;do n=t.prev[--e],t.prev[e]=n>=s?n-s:0;while(--a);r+=s}if(0===t.strm.avail_in)break;if(a=_(t.strm,t.window,t.strstart+t.lookahead,r),t.lookahead+=a,t.lookahead+t.insert>=ht)for(i=t.strstart-t.insert,t.ins_h=t.window[i],t.ins_h=(t.ins_h<<t.hash_shift^t.window[i+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[i+ht-1])&t.hash_mask,t.prev[i&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=i,i++,t.insert--,!(t.lookahead+t.insert<ht)););}while(t.lookahead<ot&&0!==t.strm.avail_in)}function f(t,e){var a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(u(t),0===t.lookahead&&e===D)return bt;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var n=t.block_start+a;if((0===t.strstart||t.strstart>=n)&&(t.lookahead=t.strstart-n,t.strstart=n,h(t,!1),0===t.strm.avail_out))return bt;if(t.strstart-t.block_start>=t.w_size-ot&&(h(t,!1),0===t.strm.avail_out))return bt}return t.insert=0,e===T?(h(t,!0),0===t.strm.avail_out?wt:yt):t.strstart>t.block_start&&(h(t,!1),0===t.strm.avail_out)?bt:bt}function c(t,e){for(var a,n;;){if(t.lookahead<ot){if(u(t),t.lookahead<ot&&e===D)return bt;if(0===t.lookahead)break}if(a=0,t.lookahead>=ht&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+ht-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-ot&&(t.match_length=d(t,a)),t.match_length>=ht)if(n=j._tr_tally(t,t.strstart-t.match_start,t.match_length-ht),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=ht){t.match_length--;do t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+ht-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart;while(0!==--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else n=j._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(n&&(h(t,!1),0===t.strm.avail_out))return bt}return t.insert=t.strstart<ht-1?t.strstart:ht-1,e===T?(h(t,!0),0===t.strm.avail_out?wt:yt):t.last_lit&&(h(t,!1),0===t.strm.avail_out)?bt:vt}function g(t,e){for(var a,n,r;;){if(t.lookahead<ot){if(u(t),t.lookahead<ot&&e===D)return bt;if(0===t.lookahead)break}if(a=0,t.lookahead>=ht&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+ht-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=ht-1,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-ot&&(t.match_length=d(t,a),t.match_length<=5&&(t.strategy===P||t.match_length===ht&&t.strstart-t.match_start>4096)&&(t.match_length=ht-1)),t.prev_length>=ht&&t.match_length<=t.prev_length){r=t.strstart+t.lookahead-ht,n=j._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-ht),t.lookahead-=t.prev_length-1,t.prev_length-=2;do++t.strstart<=r&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+ht-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart);while(0!==--t.prev_length);if(t.match_available=0,t.match_length=ht-1,t.strstart++,n&&(h(t,!1),0===t.strm.avail_out))return bt}else if(t.match_available){if(n=j._tr_tally(t,0,t.window[t.strstart-1]),n&&h(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return bt}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(n=j._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<ht-1?t.strstart:ht-1,e===T?(h(t,!0),0===t.strm.avail_out?wt:yt):t.last_lit&&(h(t,!1),0===t.strm.avail_out)?bt:vt}function p(t,e){for(var a,n,r,i,s=t.window;;){if(t.lookahead<=lt){if(u(t),t.lookahead<=lt&&e===D)return bt;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=ht&&t.strstart>0&&(r=t.strstart-1,n=s[r],n===s[++r]&&n===s[++r]&&n===s[++r])){i=t.strstart+lt;do;while(n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&i>r);t.match_length=lt-(i-r),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=ht?(a=j._tr_tally(t,1,t.match_length-ht),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=j._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(h(t,!1),0===t.strm.avail_out))return bt}return t.insert=0,e===T?(h(t,!0),0===t.strm.avail_out?wt:yt):t.last_lit&&(h(t,!1),0===t.strm.avail_out)?bt:vt}function m(t,e){for(var a;;){if(0===t.lookahead&&(u(t),0===t.lookahead)){if(e===D)return bt;break}if(t.match_length=0,a=j._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(h(t,!1),0===t.strm.avail_out))return bt}return t.insert=0,e===T?(h(t,!0),0===t.strm.avail_out?wt:yt):t.last_lit&&(h(t,!1),0===t.strm.avail_out)?bt:vt}function b(t){t.window_size=2*t.w_size,i(t.head),t.max_lazy_match=C[t.level].max_lazy,t.good_match=C[t.level].good_length,t.nice_match=C[t.level].nice_length,t.max_chain_length=C[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=ht-1,t.match_available=0,t.ins_h=0}function v(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=X,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new S.Buf16(2*it),this.dyn_dtree=new S.Buf16(2*(2*nt+1)),this.bl_tree=new S.Buf16(2*(2*rt+1)),i(this.dyn_ltree),i(this.dyn_dtree),i(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new S.Buf16(st+1),this.heap=new S.Buf16(2*at+1),i(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new S.Buf16(2*at+1),i(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function w(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=W,e=t.state,e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?dt:pt,t.adler=2===e.wrap?0:1,e.last_flush=D,j._tr_init(e),N):n(t,H)}function y(t){var e=w(t);return e===N&&b(t.state),e}function z(t,e){return t&&t.state?2!==t.state.wrap?H:(t.state.gzhead=e,N):H}function k(t,e,a,r,i,s){if(!t)return H;var h=1;if(e===M&&(e=6),0>r?(h=0,r=-r):r>15&&(h=2,r-=16),1>i||i>Y||a!==X||8>r||r>15||0>e||e>9||0>s||s>Q)return n(t,H);8===r&&(r=9);var l=new v;return t.state=l,l.strm=t,l.wrap=h,l.gzhead=null,l.w_bits=r,l.w_size=1<<l.w_bits,l.w_mask=l.w_size-1,l.hash_bits=i+7,l.hash_size=1<<l.hash_bits,l.hash_mask=l.hash_size-1,l.hash_shift=~~((l.hash_bits+ht-1)/ht),l.window=new S.Buf8(2*l.w_size),l.head=new S.Buf16(l.hash_size),l.prev=new S.Buf16(l.w_size),l.lit_bufsize=1<<i+6,l.pending_buf_size=4*l.lit_bufsize,l.pending_buf=new S.Buf8(l.pending_buf_size),l.d_buf=l.lit_bufsize>>1,l.l_buf=3*l.lit_bufsize,l.level=e,l.strategy=s,l.method=a,y(t)}function x(t,e){return k(t,e,X,Z,$,V)}function B(t,e){var a,h,_,d;if(!t||!t.state||e>L||0>e)return t?n(t,H):H;if(h=t.state,!t.output||!t.input&&0!==t.avail_in||h.status===mt&&e!==T)return n(t,0===t.avail_out?K:H);if(h.strm=t,a=h.last_flush,h.last_flush=e,h.status===dt)if(2===h.wrap)t.adler=0,l(h,31),l(h,139),l(h,8),h.gzhead?(l(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),l(h,255&h.gzhead.time),l(h,h.gzhead.time>>8&255),l(h,h.gzhead.time>>16&255),l(h,h.gzhead.time>>24&255),l(h,9===h.level?2:h.strategy>=G||h.level<2?4:0),l(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(l(h,255&h.gzhead.extra.length),l(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(t.adler=U(t.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=ut):(l(h,0),l(h,0),l(h,0),l(h,0),l(h,0),l(h,9===h.level?2:h.strategy>=G||h.level<2?4:0),l(h,zt),h.status=pt);else{var u=X+(h.w_bits-8<<4)<<8,f=-1;f=h.strategy>=G||h.level<2?0:h.level<6?1:6===h.level?2:3,u|=f<<6,0!==h.strstart&&(u|=_t),u+=31-u%31,h.status=pt,o(h,u),0!==h.strstart&&(o(h,t.adler>>>16),o(h,65535&t.adler)),t.adler=1}if(h.status===ut)if(h.gzhead.extra){for(_=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>_&&(t.adler=U(t.adler,h.pending_buf,h.pending-_,_)),s(t),_=h.pending,h.pending!==h.pending_buf_size));)l(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>_&&(t.adler=U(t.adler,h.pending_buf,h.pending-_,_)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=ft)}else h.status=ft;if(h.status===ft)if(h.gzhead.name){_=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>_&&(t.adler=U(t.adler,h.pending_buf,h.pending-_,_)),s(t),_=h.pending,h.pending===h.pending_buf_size)){d=1;break}d=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,l(h,d)}while(0!==d);h.gzhead.hcrc&&h.pending>_&&(t.adler=U(t.adler,h.pending_buf,h.pending-_,_)),0===d&&(h.gzindex=0,h.status=ct)}else h.status=ct;if(h.status===ct)if(h.gzhead.comment){_=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>_&&(t.adler=U(t.adler,h.pending_buf,h.pending-_,_)),s(t),_=h.pending,h.pending===h.pending_buf_size)){d=1;break}d=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,l(h,d)}while(0!==d);h.gzhead.hcrc&&h.pending>_&&(t.adler=U(t.adler,h.pending_buf,h.pending-_,_)),0===d&&(h.status=gt)}else h.status=gt;if(h.status===gt&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&s(t),h.pending+2<=h.pending_buf_size&&(l(h,255&t.adler),l(h,t.adler>>8&255),t.adler=0,h.status=pt)):h.status=pt),0!==h.pending){if(s(t),0===t.avail_out)return h.last_flush=-1,N}else if(0===t.avail_in&&r(e)<=r(a)&&e!==T)return n(t,K);if(h.status===mt&&0!==t.avail_in)return n(t,K);if(0!==t.avail_in||0!==h.lookahead||e!==D&&h.status!==mt){var c=h.strategy===G?m(h,e):h.strategy===J?p(h,e):C[h.level].func(h,e);if((c===wt||c===yt)&&(h.status=mt),c===bt||c===wt)return 0===t.avail_out&&(h.last_flush=-1),N;if(c===vt&&(e===O?j._tr_align(h):e!==L&&(j._tr_stored_block(h,0,0,!1),e===q&&(i(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),s(t),0===t.avail_out))return h.last_flush=-1,N}return e!==T?N:h.wrap<=0?R:(2===h.wrap?(l(h,255&t.adler),l(h,t.adler>>8&255),l(h,t.adler>>16&255),l(h,t.adler>>24&255),l(h,255&t.total_in),l(h,t.total_in>>8&255),l(h,t.total_in>>16&255),l(h,t.total_in>>24&255)):(o(h,t.adler>>>16),o(h,65535&t.adler)),s(t),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?N:R)}function A(t){var e;return t&&t.state?(e=t.state.status,e!==dt&&e!==ut&&e!==ft&&e!==ct&&e!==gt&&e!==pt&&e!==mt?n(t,H):(t.state=null,e===pt?n(t,F):N)):H}var C,S=t("../utils/common"),j=t("./trees"),E=t("./adler32"),U=t("./crc32"),I=t("./messages"),D=0,O=1,q=3,T=4,L=5,N=0,R=1,H=-2,F=-3,K=-5,M=-1,P=1,G=2,J=3,Q=4,V=0,W=2,X=8,Y=9,Z=15,$=8,tt=29,et=256,at=et+1+tt,nt=30,rt=19,it=2*at+1,st=15,ht=3,lt=258,ot=lt+ht+1,_t=32,dt=42,ut=69,ft=73,ct=91,gt=103,pt=113,mt=666,bt=1,vt=2,wt=3,yt=4,zt=3,kt=function(t,e,a,n,r){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=n,this.func=r};C=[new kt(0,0,0,0,f),new kt(4,4,8,4,c),new kt(4,5,16,8,c),new kt(4,6,32,32,c),new kt(4,4,16,16,g),new kt(8,16,32,32,g),new kt(8,16,128,128,g),new kt(8,32,128,256,g),new kt(32,128,258,1024,g),new kt(32,258,258,4096,g)],a.deflateInit=x,a.deflateInit2=k,a.deflateReset=y,a.deflateResetKeep=w,a.deflateSetHeader=z,a.deflate=B,a.deflateEnd=A,a.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":1,"./adler32":3,"./crc32":4,"./messages":6,"./trees":7}],6:[function(t,e,a){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],7:[function(t,e,a){"use strict";function n(t){for(var e=t.length;--e>=0;)t[e]=0}function r(t){return 256>t?st[t]:st[256+(t>>>7)]}function i(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function s(t,e,a){t.bi_valid>Q-a?(t.bi_buf|=e<<t.bi_valid&65535,i(t,t.bi_buf),t.bi_buf=e>>Q-t.bi_valid,t.bi_valid+=a-Q):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)}function h(t,e,a){s(t,a[2*e],a[2*e+1])}function l(t,e){var a=0;do a|=1&t,t>>>=1,a<<=1;while(--e>0);return a>>>1}function o(t){16===t.bi_valid?(i(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}function _(t,e){var a,n,r,i,s,h,l=e.dyn_tree,o=e.max_code,_=e.stat_desc.static_tree,d=e.stat_desc.has_stree,u=e.stat_desc.extra_bits,f=e.stat_desc.extra_base,c=e.stat_desc.max_length,g=0;for(i=0;J>=i;i++)t.bl_count[i]=0;for(l[2*t.heap[t.heap_max]+1]=0,a=t.heap_max+1;G>a;a++)n=t.heap[a],i=l[2*l[2*n+1]+1]+1,i>c&&(i=c,g++),l[2*n+1]=i,n>o||(t.bl_count[i]++,s=0,n>=f&&(s=u[n-f]),h=l[2*n],t.opt_len+=h*(i+s),d&&(t.static_len+=h*(_[2*n+1]+s)));if(0!==g){do{for(i=c-1;0===t.bl_count[i];)i--;t.bl_count[i]--,t.bl_count[i+1]+=2,t.bl_count[c]--,g-=2}while(g>0);for(i=c;0!==i;i--)for(n=t.bl_count[i];0!==n;)r=t.heap[--a],r>o||(l[2*r+1]!==i&&(t.opt_len+=(i-l[2*r+1])*l[2*r],l[2*r+1]=i),n--)}}function d(t,e,a){var n,r,i=new Array(J+1),s=0;for(n=1;J>=n;n++)i[n]=s=s+a[n-1]<<1;for(r=0;e>=r;r++){var h=t[2*r+1];0!==h&&(t[2*r]=l(i[h]++,h))}}function u(){var t,e,a,n,r,i=new Array(J+1);for(a=0,n=0;H-1>n;n++)for(lt[n]=a,t=0;t<1<<$[n];t++)ht[a++]=n;for(ht[a-1]=n,r=0,n=0;16>n;n++)for(ot[n]=r,t=0;t<1<<tt[n];t++)st[r++]=n;for(r>>=7;M>n;n++)for(ot[n]=r<<7,t=0;t<1<<tt[n]-7;t++)st[256+r++]=n;for(e=0;J>=e;e++)i[e]=0;for(t=0;143>=t;)rt[2*t+1]=8,t++,i[8]++;for(;255>=t;)rt[2*t+1]=9,t++,i[9]++;for(;279>=t;)rt[2*t+1]=7,t++,i[7]++;for(;287>=t;)rt[2*t+1]=8,t++,i[8]++;for(d(rt,K+1,i),t=0;M>t;t++)it[2*t+1]=5,it[2*t]=l(t,5);_t=new ft(rt,$,F+1,K,J),dt=new ft(it,tt,0,M,J),ut=new ft(new Array(0),et,0,P,V)}function f(t){var e;for(e=0;K>e;e++)t.dyn_ltree[2*e]=0;for(e=0;M>e;e++)t.dyn_dtree[2*e]=0;for(e=0;P>e;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*W]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function c(t){t.bi_valid>8?i(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function g(t,e,a,n){c(t),n&&(i(t,a),i(t,~a)),E.arraySet(t.pending_buf,t.window,e,a,t.pending),t.pending+=a}function p(t,e,a,n){var r=2*e,i=2*a;return t[r]<t[i]||t[r]===t[i]&&n[e]<=n[a]}function m(t,e,a){for(var n=t.heap[a],r=a<<1;r<=t.heap_len&&(r<t.heap_len&&p(e,t.heap[r+1],t.heap[r],t.depth)&&r++,!p(e,n,t.heap[r],t.depth));)t.heap[a]=t.heap[r],a=r,r<<=1;t.heap[a]=n}function b(t,e,a){var n,i,l,o,_=0;if(0!==t.last_lit)do n=t.pending_buf[t.d_buf+2*_]<<8|t.pending_buf[t.d_buf+2*_+1],i=t.pending_buf[t.l_buf+_],_++,0===n?h(t,i,e):(l=ht[i],h(t,l+F+1,e),o=$[l],0!==o&&(i-=lt[l],s(t,i,o)),n--,l=r(n),h(t,l,a),o=tt[l],0!==o&&(n-=ot[l],s(t,n,o)));while(_<t.last_lit);h(t,W,e)}function v(t,e){var a,n,r,i=e.dyn_tree,s=e.stat_desc.static_tree,h=e.stat_desc.has_stree,l=e.stat_desc.elems,o=-1;for(t.heap_len=0,t.heap_max=G,a=0;l>a;a++)0!==i[2*a]?(t.heap[++t.heap_len]=o=a,t.depth[a]=0):i[2*a+1]=0;for(;t.heap_len<2;)r=t.heap[++t.heap_len]=2>o?++o:0,i[2*r]=1,t.depth[r]=0,t.opt_len--,h&&(t.static_len-=s[2*r+1]);for(e.max_code=o,a=t.heap_len>>1;a>=1;a--)m(t,i,a);r=l;do a=t.heap[1],t.heap[1]=t.heap[t.heap_len--],m(t,i,1),n=t.heap[1],t.heap[--t.heap_max]=a,t.heap[--t.heap_max]=n,i[2*r]=i[2*a]+i[2*n],t.depth[r]=(t.depth[a]>=t.depth[n]?t.depth[a]:t.depth[n])+1,i[2*a+1]=i[2*n+1]=r,t.heap[1]=r++,m(t,i,1);while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],_(t,e),d(i,o,t.bl_count)}function w(t,e,a){var n,r,i=-1,s=e[1],h=0,l=7,o=4;for(0===s&&(l=138,o=3),e[2*(a+1)+1]=65535,n=0;a>=n;n++)r=s,s=e[2*(n+1)+1],++h<l&&r===s||(o>h?t.bl_tree[2*r]+=h:0!==r?(r!==i&&t.bl_tree[2*r]++,t.bl_tree[2*X]++):10>=h?t.bl_tree[2*Y]++:t.bl_tree[2*Z]++,h=0,i=r,0===s?(l=138,o=3):r===s?(l=6,o=3):(l=7,o=4))}function y(t,e,a){var n,r,i=-1,l=e[1],o=0,_=7,d=4;for(0===l&&(_=138,d=3),n=0;a>=n;n++)if(r=l,l=e[2*(n+1)+1],!(++o<_&&r===l)){if(d>o){do h(t,r,t.bl_tree);while(0!==--o)}else 0!==r?(r!==i&&(h(t,r,t.bl_tree),o--),h(t,X,t.bl_tree),s(t,o-3,2)):10>=o?(h(t,Y,t.bl_tree),s(t,o-3,3)):(h(t,Z,t.bl_tree),s(t,o-11,7));o=0,i=r,0===l?(_=138,d=3):r===l?(_=6,d=3):(_=7,d=4)}}function z(t){var e;for(w(t,t.dyn_ltree,t.l_desc.max_code),w(t,t.dyn_dtree,t.d_desc.max_code),v(t,t.bl_desc),e=P-1;e>=3&&0===t.bl_tree[2*at[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}function k(t,e,a,n){var r;for(s(t,e-257,5),s(t,a-1,5),s(t,n-4,4),r=0;n>r;r++)s(t,t.bl_tree[2*at[r]+1],3);y(t,t.dyn_ltree,e-1),y(t,t.dyn_dtree,a-1)}function x(t){var e,a=4093624447;for(e=0;31>=e;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return I;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return D;for(e=32;F>e;e++)if(0!==t.dyn_ltree[2*e])return D;return I}function B(t){gt||(u(),gt=!0),t.l_desc=new ct(t.dyn_ltree,_t),t.d_desc=new ct(t.dyn_dtree,dt),t.bl_desc=new ct(t.bl_tree,ut),t.bi_buf=0,t.bi_valid=0,f(t)}function A(t,e,a,n){s(t,(q<<1)+(n?1:0),3),g(t,e,a,!0)}function C(t){s(t,T<<1,3),h(t,W,rt),o(t)}function S(t,e,a,n){var r,i,h=0;t.level>0?(t.strm.data_type===O&&(t.strm.data_type=x(t)),v(t,t.l_desc),v(t,t.d_desc),h=z(t),r=t.opt_len+3+7>>>3,i=t.static_len+3+7>>>3,r>=i&&(r=i)):r=i=a+5,r>=a+4&&-1!==e?A(t,e,a,n):t.strategy===U||i===r?(s(t,(T<<1)+(n?1:0),3),b(t,rt,it)):(s(t,(L<<1)+(n?1:0),3),k(t,t.l_desc.max_code+1,t.d_desc.max_code+1,h+1),b(t,t.dyn_ltree,t.dyn_dtree)),f(t),n&&c(t)}function j(t,e,a){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(ht[a]+F+1)]++,t.dyn_dtree[2*r(e)]++),t.last_lit===t.lit_bufsize-1}var E=t("../utils/common"),U=4,I=0,D=1,O=2,q=0,T=1,L=2,N=3,R=258,H=29,F=256,K=F+1+H,M=30,P=19,G=2*K+1,J=15,Q=16,V=7,W=256,X=16,Y=17,Z=18,$=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],tt=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],et=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],at=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],nt=512,rt=new Array(2*(K+2));n(rt);var it=new Array(2*M);n(it);var st=new Array(nt);n(st);var ht=new Array(R-N+1);n(ht);var lt=new Array(H);n(lt);var ot=new Array(M);n(ot);var _t,dt,ut,ft=function(t,e,a,n,r){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=n,this.max_length=r,this.has_stree=t&&t.length},ct=function(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e},gt=!1;a._tr_init=B,a._tr_stored_block=A,a._tr_flush_block=S,a._tr_tally=j,a._tr_align=C},{"../utils/common":1}],8:[function(t,e,a){"use strict";function n(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}e.exports=n},{}],"/lib/deflate.js":[function(t,e,a){"use strict";function n(t,e){var a=new w(e);if(a.push(t,!0),a.err)throw a.msg;return a.result}function r(t,e){return e=e||{},e.raw=!0,n(t,e)}function i(t,e){return e=e||{},e.gzip=!0,n(t,e)}var s=t("./zlib/deflate.js"),h=t("./utils/common"),l=t("./utils/strings"),o=t("./zlib/messages"),_=t("./zlib/zstream"),d=Object.prototype.toString,u=0,f=4,c=0,g=1,p=2,m=-1,b=0,v=8,w=function(t){this.options=h.assign({level:m,method:v,chunkSize:16384,windowBits:15,memLevel:8,strategy:b,to:""},t||{});var e=this.options;e.raw&&e.windowBits>0?e.windowBits=-e.windowBits:e.gzip&&e.windowBits>0&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new _,this.strm.avail_out=0;var a=s.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==c)throw new Error(o[a]);e.header&&s.deflateSetHeader(this.strm,e.header)};w.prototype.push=function(t,e){var a,n,r=this.strm,i=this.options.chunkSize;if(this.ended)return!1;n=e===~~e?e:e===!0?f:u,"string"==typeof t?r.input=l.string2buf(t):"[object ArrayBuffer]"===d.call(t)?r.input=new Uint8Array(t):r.input=t,r.next_in=0,r.avail_in=r.input.length;do{if(0===r.avail_out&&(r.output=new h.Buf8(i),r.next_out=0,r.avail_out=i),a=s.deflate(r,n),a!==g&&a!==c)return this.onEnd(a),this.ended=!0,!1;(0===r.avail_out||0===r.avail_in&&(n===f||n===p))&&this.onData("string"===this.options.to?l.buf2binstring(h.shrinkBuf(r.output,r.next_out)):h.shrinkBuf(r.output,r.next_out))}while((r.avail_in>0||0===r.avail_out)&&a!==g);return n===f?(a=s.deflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===c):n===p?(this.onEnd(c),r.avail_out=0,!0):!0},w.prototype.onData=function(t){this.chunks.push(t)},w.prototype.onEnd=function(t){t===c&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=h.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Deflate=w,a.deflate=n,a.deflateRaw=r,a.gzip=i},{"./utils/common":1,"./utils/strings":2,"./zlib/deflate.js":5,"./zlib/messages":6,"./zlib/zstream":8}]},{},[])("/lib/deflate.js")});
var CdeLocalPlayer = CdeBaseClass.extend_({
	player_ : null,
	playerContext_ : null,
	http_ : null,
	url_ : "",
	cdeMediaPlayer_ : null,

	init : function(cdeMediaPlayer, player, playUrl) {
		this.cdeMediaPlayer_ = cdeMediaPlayer;
		this.player_ = player;
		this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
		this.http_ = null;
		this.url_ = playUrl;
	},
	play : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Start play ...", this.url_));
		this.player_.play();
	},
	pause : function() {
		this.player_.pause();
	},
	stop : function() {
		this.player_.pause();
	},
	seek : function(pos) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::seek ...({0})", pos));
		this.player_.currentTime = pos;
	},
	getCurrentPosition : function() {
		return this.player_.currentTime;
	},
	getDuration : function() {
		return this.player_.duration;
	},
	getCurrentBuffered : function() {
		return -1;
	},
	playLocalUrl_ : function() {
		if (this.http_) {
			this.http_.abort();
			this.http_ = null;
		}
		var urlInfo = CdeMediaHelper.parseUrl(this.url_);
		urlInfo.params_.set('format', '1');
		urlInfo.params_.set('expect', '3');
		urlInfo.params_.set('ajax', '1');
		if (!urlInfo.params_.has('stream_id')) {
			urlInfo.params_.set('tss', 'no');
		}
		var gslbUrl = urlInfo.toString();
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Start download gslb url: {0} ...", gslbUrl));

		var me = this;
		this.http_ = $.ajax({
			url : gslbUrl,
			type : 'GET',
			error : function(request, textStatus, errorThrown) {
				me.playLocalUrlDone_(data, textStatus, errorThrown);
			},
			success : function(data, textStatus) {
				me.playLocalUrlDone_(data, textStatus, '');
			}
		});

		var env = p2p$.com.webp2p.core.supernode.Enviroment;
		var report = new p2p$.com.webp2p.core.supernode.Url();
		report.protocol_ = "http";
		report.host_ = env.getHostDomain_("s.webp2p.letv.com");
		report.file_ = "/ClientStageInfo";
		report.params_.set("act", "0");
		report.params_.set("err", "1");
		report.params_.set("utime", CdeMediaHelper.initializeTime_ || 0);
		report.params_.set("type", urlInfo.params_.has("stream_id") ? "liv" : "vod");
		report.params_.set("termid", urlInfo.params_.get("termid"));
		report.params_.set("platid", urlInfo.params_.get("platid"));
		report.params_.set("splatid", urlInfo.params_.get("splatid"));
		report.params_.set("vtype", urlInfo.params_.get("vtype") || "0");
		report.params_.set("streamid", urlInfo.params_.get("stream_id") || "");
		report.params_.set("ch", urlInfo.params_.get("ch") || "");
		report.params_.set("p1", urlInfo.params_.get("p1") || "");
		report.params_.set("p2", urlInfo.params_.get("p2") || "");
		report.params_.set("p3", urlInfo.params_.get("p3") || "");
		report.params_.set("uuid", urlInfo.params_.get("uuid") || "");
		report.params_.set("p2p", "0");
		report.params_.set("appid", env.externalAppId_);
		report.params_.set("cdeid", env.moduleId_);
		report.params_.set("package", env.externalAppPackageName_);

		var reportUrl = report.toString();
		$.ajax({
			url : reportUrl.toString(),
			type : 'GET',
			error : function(request, textStatus, errorThrown) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Report stage failed({0}, url: {1}", textStatus, reportUrl));
			},
			success : function(data, textStatus) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Report stage ok({0}), url: {1}", textStatus, reportUrl));
			}
		});
	},

	playLocalUrlDone_ : function(data, textStatus, errorThrown) {

		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Download gslb {0}: {1}, {2} ...", data ? 'success' : 'failed', textStatus + '', errorThrown + ''));
		if (!data) {
			if (this.cdeMediaPlayer_.onerror) {
				this.cdeMediaPlayer_.onerror(this);
			}
			return;
		}

		try {
			var gslbData = (typeof (data) == "string") ? eval("(" + data + ")") : data;
			var mediaUrl = gslbData.location;

			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::Gslb responsed, error code({0}), details({1}), user ip({2}), url({3})", gslbData.ercode,
					gslbData.errinfo || '', gslbData.remote, mediaUrl));

			this.player_.src = mediaUrl;
			this.addVideoEvent_(this.player_);
			this.player_.play();
		} catch (e) {
			if (this.cdeMediaPlayer_.onerror) {
				this.cdeMediaPlayer_.onerror(this);
			}
		}
	},

	addVideoEvent_ : function(video) {
		var _me = this;
		var _ve = p2p$.com.webp2p.core.player.base.PLAY_STATES.VideoEvent;
		for ( var i = 0; i < _ve.length; i++) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Add video event, type({0})", _ve[i]));
			try {
				video.addEventListener(_ve[i], function(evt) {
					_me.videoStatusHandler_(evt);
				});
			} catch (e) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Add video event failed, type({0}), error({1})", _ve[i], (e || "none").toString()));
			}
		}
	},

	removeVideoEvent_ : function(video) {
		var me = this;
		var _ve = p2p$.com.webp2p.core.player.base.PLAY_STATES.VideoEvent;
		for ( var i = 0; i < _ve.length; i++) {
			try {
				video.removeEventListener(_ve[i], function(evt) {
					me.videoStatusHandler_(evt);
				});
			} catch (e) {
				P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Remove video event failed, type({0}), error({1})", _ve[i], (e || "none").toString()));
			}
		}
	},

	videoStatusHandler_ : function(evt) {
		var _type = evt.type;
		P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Video status handler, type({0})", _type));
		switch (_type) {
		case "abort":
			break;
		case "canplay":
			this.onVideoCanPlay_(evt);
			break;
		case "canplaythrough":
			// this.onCanPlayThrough_();
			break;
		case "durationchange":
			this.durationChange_();
			break;
		case "emptied":
			break;
		case "ended":
			// this.onEnded_();
			break;
		case "error":
			this.onError_(evt);
			break;
		case "loadeddata":
			this.onLoadedData_(evt);
			break;
		case "loadedmetadata":
			// this.onVideoLoadedMetaData_();
			break;
		case "loadstart":
			break;
		case "pause":
			break;
		case "play":
			break;
		case "playing":
			// this.onVideoPlaying_();
			break;
		case "progress":

			break;
		case "ratechange":
			break;
		case "seeked":
			this.onVideoSeeked_(evt);
			break;
		case "seeking":
			this.onVideoSeeking_(evt);
			break;
		case "stalled":
			break;
		case "suspend":
			break;
		case "timeupdate":
			this.onVideoTimeUpdate_(evt);
			break;
		case "volumechange":
			break;
		case "waiting":
			// this.onVideoWaiting_(evt);
			break;
		}
	},
	durationChange_ : function() {
	},
	onLoadedData_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Loaded data"));
		if (this.cdeMediaPlayer_.onbufferstart) {
			this.cdeMediaPlayer_.onbufferstart();
		}
		this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.loadeddata;
	},

	onVideoCanPlay_ : function() {
		if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.loadeddata) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Video can play"));
			this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.canplay;
			if (this.cdeMediaPlayer_.onbufferend) {
				this.cdeMediaPlayer_.onbufferend();
			}
			if (this.cdeMediaPlayer_.onprepared) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Video onVideoCanPlay onprepared"));
				this.cdeMediaPlayer_.onprepared();
			}
			if (this.cdeMediaPlayer_.firstSeekTime_) {
				this.player_.currentTime = this.cdeMediaPlayer_.firstSeekTime_;
			} else {
				// this.player_.currentTime = 500;
			}
		}
	},

	onVideoSeeking_ : function() {
		var vTime = this.player_.currentTime ? this.player_.currentTime.toFixed(1) : 0;

		if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.canplay
				|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking
				|| this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeked) {
			if (this.cdeMediaPlayer_.onbufferstart) {
				this.cdeMediaPlayer_.onbufferstart();
			}
			this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Video seeking vTime({0}) videoStatus({1})", vTime, this.playerContext_.videoStatus_));
	},

	onVideoSeeked_ : function() {
		var vTime = this.player_.currentTime ? this.player_.currentTime.toFixed(1) : 0;
		if (this.playerContext_.videoStatus_ == p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeking) {
			if (this.cdeMediaPlayer_.onbufferend) {
				this.cdeMediaPlayer_.onbufferend();
			}
			this.playerContext_.videoStatus_ = p2p$.com.webp2p.core.player.base.VIDEO_STATUS.seeked;

		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Video seeked  vTime({0}) videoStatus({1})", vTime, this.playerContext_.videoStatus_));
	},

	onVideoTimeUpdate_ : function() {
		var vLength = this.player_.duration.toFixed(1);
		var vTime = this.player_.currentTime.toFixed(1);
		var vRemaining = (vLength - vTime).toFixed(1);
		P2P_ULOG_TRACE(P2P_ULOG_FMT("CdeLocalPlayer::Video time update vTime({0}) vLength({1}) vRemaining({2})", vTime, vLength, vRemaining));
		if (Math.abs(vRemaining) <= 0.5) {
			if (this.cdeMediaPlayer_.onEnded_) {
				this.cdeMediaPlayer_.onEnded_();
			}

		}
	},

	onEnded_ : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Ended"));
		if (this.cdeMediaPlayer_.oncomplete) {
			this.cdeMediaPlayer_.oncomplete();
		}
	},

	onError_ : function(evt) {
		var details = this.player_.error ? this.player_.error.code : 'unknown';
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeLocalPlayer::Error, code: {0}", details));
		if (this.cdeMediaPlayer_.onerror) {
			this.cdeMediaPlayer_.onerror();
		}

	}
});CdeMediaPlayer = CdeBaseClass.extend_({

	// events
	onprepared : null,
	onbufferstart : null,
	onbufferend : null,
	oncomplete : null,
	onerror : null,

	// properties
	url_ : null,
	playerTimer_ : null,
	playerCreated_ : false,
	videoStream_ : null,
	logicPlayer_ : null,
	localPlayer_ : null,
	pendingCallbacks_ : null,
	playWithCdeLocalPlayer_ : false,
	firstSeekTime_ : 0,
	preload_ : true,
	// constructor
	init : function(url, el, params) {

		params = params || {};
		if ((el.tagName + '').toLowerCase() == 'video') {
			this.localPlayer_ = el;
		} else {
			this.localPlayer_ = document.createElement("video");

			if (params && params.playerAttributes) {
				try {
					for ( var n in params.playerAttributes) {
						newVideo[n] = params.playerAttributes[n];
					}
				} catch (e) {
					// Ignore
				}
			}
			while (el.childNodes.length > 0) {
				el.removeChild(el.childNodes[0]);
			}
			el.appendChild(this.localPlayer_);
		}
		if (params.localVideo) {
			this.playWithCdeLocalPlayer_ = params.localVideo;
		}
		if (params.seekTo) {
			this.firstSeekTime_ = parseFloat(params.seekTo) || 0;
		}
		this.url_ = url;
		this.playerCreated_ = false;
		this.videoStream_ = p2p$.com.webp2p.core.entrance.VideoStream;
		this.videoStream_.init();

		if (this.url_) {
			CdeMediaHelper.init(null, {
				fn : this.createPlayer_,
				scope : this
			});
		}

	},

	createPlayer_ : function() {
		if (!this.url_) {
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::createPlayer..."));
		this.playerCreated_ = true;
		if (this.firstSeekTime_) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaPlayer::createPlayer::Seek to({0})", this.firstSeekTime_));
		}

		if (this.playWithCdeLocalPlayer_ || !CdeMediaHelper.supportPlayer()) {
			this.logicPlayer_ = new CdeLocalPlayer(this, this.localPlayer_, this.url_);
			this.logicPlayer_.playLocalUrl_();
		} else {
			var creator = new p2p$.com.webp2p.core.player.Creator();
			creator.initialize_(this, this.url_, this.localPlayer_, this.videoStream_);
			this.logicPlayer_ = creator.createPlayer_();
			this.firstSeekTime_ = null;
		}

		if (this.pendingCallbacks_) {
			for ( var i = 0; i < this.pendingCallbacks_.length; i++) {
				var action = this.pendingCallbacks_[i];
				action.fn.apply(action.scope || this, action.params);
			}
			this.pendingCallbacks_ = null;
		}
	},

	addPendingAction_ : function(fn, scope, params) {
		if (!this.pendingCallbacks_) {
			this.pendingCallbacks_ = [];
		}
		this.pendingCallbacks_.push({
			fn : fn,
			scope : scope,
			params : params || []
		});
	},

	getVideoStream : function() {
		return this.videoStream_;
	},

	play : function(url) {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			this.addPendingAction_(this.play, this, [ url ]);
			return;
		}
		if (this.logicPlayer_) {
			this.logicPlayer_.play();
		}
	},
	setSource : function(url, preload) {
		if (!this.playerCreated_ && this.url_) {
			this.url_ = url;
			this.preload_ = preload;
			return;
		}
		// this.release();
		this.url_ = url;
		this.preload_ = preload;
		CdeMediaHelper.init(null, {
			fn : this.createPlayer_,
			scope : this
		});
	},
	pause : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			this.addPendingAction_(this.pause, this);
			return;
		}

		if (this.logicPlayer_) {
			this.logicPlayer_.pause();
		}
	},

	stop : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			this.addPendingAction_(this.stop, this);
			return;
		}

		if (this.logicPlayer_) {
			this.logicPlayer_.stop();
		}
	},

	release : function() {
		if (!this.url_) {
			return;
		}
		if (this.playerTimer_) {
			clearTimeout(this.playerTimer_);
			this.playerTimer_ = null;
		}

		if (this.logicPlayer_) {
			this.logicPlayer_.stop();
		}
		this.logicPlayer_ = null;
		this.playerCreated_ = false;
		this.videoStream_.requestPlayStop_(this.url_);
		this.url_ = null;
	},

	seek : function(pos) {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			this.addPendingAction_(this.seek, this);
			return;
		}

		if (this.logicPlayer_) {
			this.logicPlayer_.seek(pos);
		}
	},

	getCurrentPosition : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			return -1;
		}

		if (this.logicPlayer_) {
			return this.logicPlayer_.getCurrentPosition();
		}
	},

	getDuration : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			return -1;
		}

		if (this.logicPlayer_) {
			return this.logicPlayer_.getDuration();
		}
	},
	getCurrentBuffered : function() {
		if (!this.url_) {
			return;
		}
		if (!this.playerCreated_) {
			return -1;
		}

		if (this.logicPlayer_) {
			return this.logicPlayer_.getCurrentBuffered();
		}
	}
});
CdeMediaHelper = {
	initialized_ : false,
	initializeTime_ : -1,
	initializeTimeout_ : 500,
	supported_ : false,
	pendingCallbacks_ : null,

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
		var logServer = "http://" + (params["logServer"] || "10.58.132.159:8000");
		p2p$.com.webp2p.core.common.Log.init(logLevel, params["uploadLog"] ? logServer : null);
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
			this.initComplete_(false, 0, "failed, not supported");
			return;
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
			me.initComplete_(false, 0, "exception: " + e);
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

	initComplete_ : function(supported, time, message) {

		P2P_ULOG_INFO(P2P_ULOG_FMT("CdeMediaHelper::MediaSource open {0}, used {1}ms", message, time));

		this.supported_ = supported;
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
		p2p$.com.webp2p.tools.collector.SupportSession.open(params, callback);
	},

	showConsole : function(el) {
		p2p$.com.webp2p.tools.console.Index.start();
	}
};