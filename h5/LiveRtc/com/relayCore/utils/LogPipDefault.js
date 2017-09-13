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
