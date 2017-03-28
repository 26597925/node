p2p$.ns("com.webp2p.core.common");

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
};