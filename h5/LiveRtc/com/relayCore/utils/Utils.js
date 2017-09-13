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
