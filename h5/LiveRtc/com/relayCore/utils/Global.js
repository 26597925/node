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
