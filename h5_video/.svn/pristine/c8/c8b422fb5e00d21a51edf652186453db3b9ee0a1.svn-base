p2p$.ns("com.webp2p.core.utils");

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
